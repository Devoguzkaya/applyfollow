'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { userService, UpdateProfileRequest } from '@/services/userService';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaSave, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

export default function ProfilePage() {
    const { dict } = useLanguage();
    const t = dict; // Use dict directly for typed access
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profile, setProfile] = useState<UpdateProfileRequest>({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        linkedinUrl: '',
        githubUrl: '',
        websiteUrl: '',
        summary: '',
    });

    // Password State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Load initial data from localStorage (AuthResponse)
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setProfile({
                    fullName: user.fullName || '',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    address: user.address || '',
                    linkedinUrl: user.linkedinUrl || '',
                    githubUrl: user.githubUrl || '',
                    websiteUrl: user.websiteUrl || '',
                    summary: user.summary || ''
                });
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const onUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await userService.updateProfile(profile);
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const mergedUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));

            toast.success(t.profilePage.toast.profileUpdated);
        } catch (error) {
            console.error(error);
            toast.error(t.profilePage.toast.genericError);
        } finally {
            setLoading(false);
        }
    };

    const onChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error(t.profilePage.toast.matchError);
            return;
        }
        setLoading(true);
        try {
            await userService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            toast.success(t.profilePage.toast.passwordChanged);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            toast.error(t.profilePage.toast.genericError);
        } finally {
            setLoading(false);
        }
    };

    if (!t.profilePage) return null; // Guard clause if translations aren't loaded

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {t.profilePage.title}
                </h1>
                <p className="text-gray-400 mt-2">{t.profilePage.subtitle}</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`pb-3 px-4 flex items-center gap-2 transition-colors relative ${activeTab === 'personal'
                            ? 'text-[#00D632] font-medium'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <FaUser />
                    {t.profilePage.tabs.personal}
                    {activeTab === 'personal' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D632] shadow-[0_0_10px_#00D632]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-4 flex items-center gap-2 transition-colors relative ${activeTab === 'security'
                            ? 'text-[#00D632] font-medium'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <FaLock />
                    {t.profilePage.tabs.security}
                    {activeTab === 'security' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D632] shadow-[0_0_10px_#00D632]" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="bg-[#182023]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                {activeTab === 'personal' ? (
                    <form onSubmit={onUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.profilePage.personal.fullName}</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleProfileChange}
                                    className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.profilePage.personal.email}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full bg-[#0F1416]/30 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500">Email cannot be changed.</p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.profilePage.personal.phone}</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={profile.phoneNumber}
                                    onChange={handleProfileChange}
                                    className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.profilePage.personal.address}</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleProfileChange}
                                    className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.profilePage.personal.summary}</label>
                            <textarea
                                name="summary"
                                rows={4}
                                value={profile.summary}
                                onChange={handleProfileChange}
                                className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600 resize-none"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-lg font-medium text-white">{t.profilePage.personal.links}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* LinkedIn */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FaLinkedin className="text-blue-500" /> LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={profile.linkedinUrl}
                                        onChange={handleProfileChange}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                    />
                                </div>
                                {/* GitHub */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FaGithub className="text-white" /> GitHub
                                    </label>
                                    <input
                                        type="url"
                                        name="githubUrl"
                                        value={profile.githubUrl}
                                        onChange={handleProfileChange}
                                        placeholder="https://github.com/..."
                                        className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                    />
                                </div>
                                {/* Website */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FaGlobe className="text-emerald-400" /> Website
                                    </label>
                                    <input
                                        type="url"
                                        name="websiteUrl"
                                        value={profile.websiteUrl}
                                        onChange={handleProfileChange}
                                        placeholder="https://mysite.com"
                                        className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#00D632] hover:bg-[#00D632]/90 text-black font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,214,50,0.3)] hover:shadow-[0_0_30px_rgba(0,214,50,0.4)]"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <FaSave />
                                )}
                                {loading ? t.profilePage.personal.saving : t.profilePage.personal.save}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onChangePassword} className="space-y-6 max-w-2xl mx-auto">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                            <p className="text-yellow-200 text-sm">
                                {t.profilePage.security.requirements}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.profilePage.security.currentPassword}</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.profilePage.security.newPassword}</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.profilePage.security.confirmPassword}</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-[#0F1416]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D632] focus:ring-1 focus:ring-[#00D632]/50 transition-all placeholder-gray-600"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#00D632] hover:bg-[#00D632]/90 text-black font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,214,50,0.3)] hover:shadow-[0_0_30px_rgba(0,214,50,0.4)]"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <FaLock />
                                )}
                                {loading ? t.profilePage.security.changing : t.profilePage.security.changePassword}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
