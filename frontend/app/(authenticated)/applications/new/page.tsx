"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { applicationService, ApplicationRequest } from "@/services/applicationService";

export default function NewApplicationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<ApplicationRequest>({
        companyName: '',
        position: '',
        jobUrl: '',
        status: 'APPLIED',
        notes: ''
    });

    const handleSubmit = async () => {
        if (!formData.companyName || !formData.position) {
            setError("Company Name and Position are required/zorunlu kardeşim.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await applicationService.createApplication(formData);
            router.push('/applications'); // Redirect to list
            router.refresh(); // Verileri tazelemek için
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Backend ayakta mı?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            {/* MODAL CONTAINER (Centered in page) */}
            <div className="w-full max-w-2xl relative flex flex-col bg-surface-dark border border-border-dark rounded-2xl shadow-glow transition-all">

                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-border-dark bg-surface-dark rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white tracking-tight font-display">Add New Application</h2>
                    <Link href="/dashboard" className="group p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </Link>
                </div>

                {/* FORM BODY */}
                <div className="p-8 flex flex-col gap-6">

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {/* Company Name Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Company Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">business</span>
                            </div>
                            <input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full h-14 pl-12 pr-4 bg-input-bg border border-border-dark rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal text-base"
                                placeholder="e.g. Google, Stripe"
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Job Position Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Job Position</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">badge</span>
                            </div>
                            <input
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full h-14 pl-12 pr-4 bg-input-bg border border-border-dark rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal text-base"
                                placeholder="e.g. Senior Product Designer"
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Grid Row for Status and URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* URL Field */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Job Listing URL</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">link</span>
                                </div>
                                <input
                                    value={formData.jobUrl}
                                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                                    className="w-full h-14 pl-12 pr-4 bg-input-bg border border-border-dark rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal text-base"
                                    placeholder="https://..."
                                    type="url"
                                />
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Application Status</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">flag</span>
                                </div>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full h-14 pl-12 pr-10 bg-input-bg border border-border-dark rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal text-base appearance-none cursor-pointer"
                                >
                                    <option value="APPLIED">Applied</option>
                                    <option value="INTERVIEW">Interviewing</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="GHOSTED">Ghosted</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="px-8 py-6 bg-surface-dark rounded-b-2xl border-t border-border-dark flex items-center justify-end gap-4">
                    <Link href="/dashboard" className="px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 rounded-xl text-sm font-bold text-[#101618] bg-primary hover:bg-emerald-400 shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#11161d] focus:ring-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">check</span>
                                Save Application
                            </>
                        )}
                    </button>
                </div>

                {/* Subtle decorative gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 rounded-t-2xl"></div>
            </div>
        </div>
    );
}
