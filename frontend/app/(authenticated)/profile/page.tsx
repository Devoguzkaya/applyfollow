"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/services/authService";
import { applicationService } from "@/services/applicationService";
import toast from "react-hot-toast";
import CvBuilder from "@/components/CvBuilder";
import MyCv from "@/components/MyCv";

type Tab = 'profile' | 'cv' | 'preview' | 'security';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState({ total: 0, interviews: 0, offers: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    // Modal States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // Form States
    const [tempName, setTempName] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');

    useEffect(() => {
        // 1. Get User info
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
            setUser(currentUser);
            setTempName(currentUser.fullName);
            setTempEmail(currentUser.email);
        } else {
            router.push('/login');
            return;
        }

        // 2. Calculate Stats from applications
        const fetchStats = async () => {
            try {
                const apps = await applicationService.getAllApplications();
                const total = apps.length;
                const interviews = apps.filter(app => app.status === 'INTERVIEW').length;
                const offers = apps.filter(app => app.status === 'OFFER').length;

                setStats({ total, interviews, offers });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [router]);

    // Handlers
    const handleLogout = () => {
        authService.logout();
        toast.success("Logged out successfully");
        router.push('/login');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updated = await authService.updateProfile(tempName, tempEmail);
            setUser(updated);
            toast.success("Profile updated!");
            setIsEditOpen(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error("Failed to update profile");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.changePassword(currentPass, newPass);
            toast.success("Password changed!");
            setIsPasswordOpen(false);
            setCurrentPass('');
            setNewPass('');
        } catch (err) {
            console.error("Failed to change password", err);
            toast.error("Failed to change password");
        }
    };

    if (loading || !user) {
        return (
            <div className="w-full h-full flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-4">
                    <span className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-slate-500 font-medium">Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 lg:p-12 relative">
            {/* Page Heading */}
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white font-display">Profile & Settings</h1>
                <p className="text-[#9db8a9] text-lg">Manage your personal details and professional CV.</p>
            </header>

            {/* Profile Summary Card (Always Visible) */}
            <section className="rounded-2xl bg-surface-dark border border-white/5 p-6 lg:p-8 shadow-xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                        <div className="size-24 rounded-full border-2 border-primary shadow-glow flex items-center justify-center bg-surface-hover text-3xl font-bold text-white relative overflow-hidden select-none">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
                            <p className="text-[#9db8a9]">{user.email}</p>
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Status: Job Hunting
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Tabs */}
            <div className="border-b border-white/10 flex gap-6 overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-primary text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    Profile & Stats
                </button>
                <button
                    onClick={() => setActiveTab('cv')}
                    className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'cv' ? 'border-primary text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    CV Builder
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'preview' ? 'border-primary text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    My CV
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'security' ? 'border-primary text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    Security
                </button>
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <article className="group flex items-center justify-between rounded-2xl bg-surface-dark border border-white/5 p-6 shadow-lg transition-colors hover:border-primary/30">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-[#9db8a9]">Total Applications</p>
                                <p className="text-3xl font-bold text-white tracking-tight">{stats.total}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-transparent text-primary shadow-glow-sm">
                                <span className="material-symbols-outlined text-[28px]">send</span>
                            </div>
                        </article>
                        <article className="group flex items-center justify-between rounded-2xl bg-surface-dark border border-white/5 p-6 shadow-lg transition-colors hover:border-primary/30">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-[#9db8a9]">Active Interviews</p>
                                <p className="text-3xl font-bold text-white tracking-tight">{stats.interviews}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                                <span className="material-symbols-outlined text-[28px]">groups</span>
                            </div>
                        </article>
                        <article className="group flex items-center justify-between rounded-2xl bg-surface-dark border border-white/5 p-6 shadow-lg transition-colors hover:border-primary/30">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-[#9db8a9]">Offers Received</p>
                                <p className="text-3xl font-bold text-white tracking-tight">{stats.offers}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent text-amber-400 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]">
                                <span className="material-symbols-outlined text-[28px] fill-1">trophy</span>
                            </div>
                        </article>
                    </section>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsEditOpen(true)} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-6 text-sm font-bold text-white transition-all">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Edit Personal Info
                        </button>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: CV BUILDER */}
            {activeTab === 'cv' && (
                <CvBuilder />
            )}

            {/* TAB CONTENT: MY CV (PREVIEW) */}
            {activeTab === 'preview' && (
                <MyCv />
            )}

            {/* TAB CONTENT: SECURITY */}
            {activeTab === 'security' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Password & Authentication</h3>
                        <button onClick={() => setIsPasswordOpen(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-6 text-sm font-bold text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                            Change Password
                        </button>
                    </div>

                    <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                        <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                        <p className="text-[#9db8a9] text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                        <div className="flex gap-4">
                            <button onClick={handleLogout} className="rounded-lg px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 border border-white/10 transition-all">
                                Log Out
                            </button>
                            <button className="rounded-lg px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit Profile Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <form onSubmit={handleUpdateProfile} className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in duration-200 shadow-2xl">
                        <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-slate-400">Full Name</label>
                            <input value={tempName} onChange={e => setTempName(e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white focus:border-primary outline-none" placeholder="John Doe" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-slate-400">Email</label>
                            <input value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white focus:border-primary outline-none" placeholder="john@example.com" />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white font-medium">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-primary text-[#101618] font-bold rounded-lg hover:bg-emerald-400 transition-colors">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <form onSubmit={handleChangePassword} className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in duration-200 shadow-2xl">
                        <h3 className="text-xl font-bold text-white">Change Password</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-slate-400">Current Password</label>
                            <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white focus:border-primary outline-none" placeholder="Current Password" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-slate-400">New Password</label>
                            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white focus:border-primary outline-none" placeholder="New Password" />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setIsPasswordOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white font-medium">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-primary text-[#101618] font-bold rounded-lg hover:bg-emerald-400 transition-colors">Update Password</button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}
