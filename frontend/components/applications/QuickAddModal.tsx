"use client";

import { useState } from 'react';
import { applicationService } from '@/services/applicationService';
import { useLanguage } from '@/context/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function QuickAddModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!companyName || !position) {
            toast.error(t('applications.new.validation.required'));
            return;
        }

        setIsLoading(true);
        try {
            await applicationService.createApplication({
                companyName,
                position,
                appliedAt: new Date().toISOString().split('T')[0], // Today
                status: 'APPLIED',
                jobUrl: '',
                notes: ''
            });

            // Invalidate cache to refresh lists
            queryClient.invalidateQueries({ queryKey: ['applications'] });

            toast.success(t('applications.new.success'));

            // Reset & Close
            setCompanyName('');
            setPosition('');
            onClose();
        } catch (error) {
            console.error("Quick Add Error:", error);
            toast.error(t('applications.new.validation.genericError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"></div>

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg bg-surface-card border border-border-main rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-text-main">Hızlı Başvuru Ekle</h2>
                        <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-text-main transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wide">{t('applications.new.companyName')}</label>
                            <input
                                type="text"
                                autoFocus
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full bg-input-bg border border-border-main rounded-lg px-4 py-3 text-text-main focus:border-primary outline-none transition-colors"
                                placeholder="örn. Google"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wide">{t('applications.new.position')}</label>
                            <input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full bg-input-bg border border-border-main rounded-lg px-4 py-3 text-text-main focus:border-primary outline-none transition-colors"
                                placeholder="örn. Frontend Developer"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg text-text-muted hover:bg-surface-hover font-medium transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-5 py-2.5 rounded-lg bg-primary text-[#101618] font-bold hover:bg-emerald-400 shadow-glow transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading ? t('common.loading') : t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
