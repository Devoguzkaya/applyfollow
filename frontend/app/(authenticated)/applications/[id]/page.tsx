"use client";

import Link from "next/link";
import { use, useState, useEffect, useCallback } from "react";
import { applicationService, ApplicationResponse, ContactDto } from "@/services/applicationService";
import { useLanguage } from "@/context/LanguageContext";
import toast from 'react-hot-toast';

export default function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { t } = useLanguage();
    const { id } = use(params);

    // --- ALL HOOKS MUST BE AT THE TOP ---
    const [application, setApplication] = useState<ApplicationResponse | null>(null);
    const [contacts, setContacts] = useState<ContactDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState("");
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [newContact, setNewContact] = useState<ContactDto>({ name: '', role: '', email: '', phone: '', linkedIn: '' });
    const [contactLoading, setContactLoading] = useState(false);

    // Expanded Contact State (MOVED HERE)
    const [expandedContactId, setExpandedContactId] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const [appData, contactsData] = await Promise.all([
                    applicationService.getApplicationById(id),
                    applicationService.getContacts(id)
                ]);

                setApplication(appData);
                setContacts(contactsData);
                setNotes(appData.notes || "");
            } catch (error) {
                console.error("Failed to fetch application:", error);
                toast.error("Failed to load application details.");
            } finally {
                setLoading(false);
            }

        };

        if (id) fetchApplication();
    }, [id]);

    // --- Helper Functions mapped with useCallback for performance ---

    const handleVisitJobPost = useCallback(() => {
        if (!application?.jobUrl) return;
        let url = application.jobUrl;
        if (!url.match(/^https?:\/\//i)) url = 'https://' + url;
        window.open(url, '_blank');
    }, [application?.jobUrl]);

    const handleAddContact = useCallback(async () => {
        if (!newContact.name) {
            toast.error(t('applications.new.validation.required'));
            return;
        }
        setContactLoading(true);
        try {
            const addedContact = await applicationService.addContact(id, newContact);
            setContacts(prev => [...prev, addedContact]);
            setNewContact({ name: '', role: '', email: '', phone: '', linkedIn: '' });
            setNewContact({ name: '', role: '', email: '', phone: '', linkedIn: '' });
            setIsContactModalOpen(false);
            toast.success(t('applications.detail.contactAdded'));
        } catch (error) {
            console.error("Failed to add contact:", error);
            toast.error(t('applications.new.validation.genericError'));
        } finally {
            setContactLoading(false);
        }
    }, [id, newContact]);

    const toggleContact = useCallback((contactId: string | undefined) => {
        if (!contactId) return;
        setExpandedContactId(prev => (prev === contactId ? null : contactId));
    }, []);

    const [notesLoading, setNotesLoading] = useState(false);

    const handleSaveNotes = useCallback(async () => {
        setNotesLoading(true);
        try {
            await applicationService.updateNotes(id, notes);
            toast.success(t('applications.detail.notesSaved'));
        } catch (error) {
            console.error("Failed to save notes:", error);
            toast.error(t('applications.new.validation.genericError'));
        } finally {
            setNotesLoading(false);
        }
    }, [id, notes]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!application) return;
        try {
            await applicationService.updateApplicationStatus(application.id, newStatus);
            setApplication(prev => prev ? { ...prev, status: newStatus as any } : null);
            toast.success(t('applications.detail.statusUpdated') + t(`applications.status.${newStatus}`));
        } catch (error) {
            console.error("Status update failed:", error);
            toast.error(t('applications.new.validation.genericError'));
        }
    };

    // --- Conditional Returns (MUST BE AFTER HOOKS) ---

    if (loading) {
        return (
            <div role="status" className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-slate-400 font-medium">{t('applications.list.loading')}</p>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                <span className="material-symbols-outlined text-4xl text-slate-600" aria-hidden="true">error</span>
                <p className="text-slate-400">Application not found.</p>
                <Link href="/dashboard" className="text-primary hover:underline">Go back to Dashboard</Link>
            </div>
        );
    }

    // --- Render Constants ---

    const steps = [
        { key: 'APPLIED', label: t('applications.status.APPLIED'), icon: 'check' },
        { key: 'INTERVIEW', label: t('applications.status.INTERVIEW'), icon: 'video_camera_front' },
        { key: 'OFFER', label: t('applications.status.OFFER'), icon: 'celebration' }
    ];

    let activeIndex = -1;
    if (application.status === 'APPLIED') activeIndex = 0;
    else if (application.status === 'INTERVIEW') activeIndex = 1;
    else if (application.status === 'OFFER') activeIndex = 2;

    const isRejected = application.status === 'REJECTED';
    const isGhosted = application.status === 'GHOSTED';

    const statusStyles = {
        'APPLIED': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        'INTERVIEW': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        'OFFER': 'text-primary bg-primary/10 border-primary/20',
        'REJECTED': 'text-red-400 bg-red-500/10 border-red-500/20',
        'GHOSTED': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    };
    const activeStyle = statusStyles[application.status] || statusStyles['APPLIED'];

    return (
        <main className="w-full max-w-[1400px] mx-auto flex flex-col gap-8 h-[calc(100vh-140px)]">

            {/* 1. Dynamic Pipeline */}
            <section aria-label="Application Progress" className="w-full shrink-0 py-4">
                <div className="max-w-[800px] mx-auto relative px-4">
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-white/10 -z-10 rounded-full"></div>
                    {activeIndex !== -1 && !isRejected && !isGhosted && (
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-primary -z-0 rounded-full transition-all duration-500" style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}></div>
                    )}
                    <div className="flex justify-between relative" role="list">
                        {steps.map((step, index) => {
                            const isActive = index === activeIndex;
                            const isPast = index < activeIndex;
                            let circleClass = "bg-surface-dark border-2 border-slate-600 text-slate-600"; // Default

                            if (isRejected && activeIndex === index) circleClass = "bg-red-500 text-[#111814] border-red-500 shadow-glow-red";
                            else if (isGhosted && activeIndex === index) circleClass = "bg-slate-500 text-[#111814] border-slate-500";
                            else if (isActive) circleClass = "bg-primary text-[#111814] border-primary shadow-glow-emerald";
                            else if (isPast) circleClass = "bg-emerald-500/20 text-emerald-500 border-emerald-500/50";

                            return (
                                <div key={step.key} role="listitem" className="flex flex-col items-center gap-3">
                                    <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${circleClass}`}>
                                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{isRejected && isActive ? 'close' : isGhosted && isActive ? 'help' : step.icon}</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 2. Main Layout Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-0 flex-1">

                {/* LEFT COLUMN: Info */}
                <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
                    {/* Company Card */}
                    <article className="bg-surface-dark rounded-xl p-6 shadow-lg border border-border-dark flex flex-col gap-6">
                        <header className="flex items-start justify-between">
                            <div className="size-16 rounded-lg bg-white p-2 flex items-center justify-center overflow-hidden">
                                {application.company.logoUrl ? (
                                    <img src={application.company.logoUrl} alt={`${application.company.name} Logo`} loading="lazy" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-black font-bold text-2xl">{application.company.name.charAt(0)}</span>
                                )}
                            </div>
                            <div className="relative group/status w-fit">
                                <select
                                    value={application.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    className={`appearance-none bg-transparent border rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none focus:ring-1 focus:ring-primary transition-all pr-7 ${activeStyle}`}
                                >
                                    <option value="APPLIED" className="bg-[#0A0C10]">{t('applications.status.APPLIED')}</option>
                                    <option value="INTERVIEW" className="bg-[#0A0C10]">{t('applications.status.INTERVIEW')}</option>
                                    <option value="OFFER" className="bg-[#0A0C10]">{t('applications.status.OFFER')}</option>
                                    <option value="REJECTED" className="bg-[#0A0C10]">{t('applications.status.REJECTED')}</option>
                                    <option value="GHOSTED" className="bg-[#0A0C10]">{t('applications.status.GHOSTED')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none opacity-50">expand_more</span>
                            </div>
                        </header>
                        <div>
                            <h1 className="text-2xl font-bold font-display text-white leading-tight mb-1">{application.position}</h1>
                            <p className="text-slate-400 font-medium text-lg">{application.company.name}</p>
                        </div>
                        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 text-slate-300">
                                <span className="material-symbols-outlined text-slate-500 text-[20px]" aria-hidden="true">calendar_today</span>
                                <span className="text-sm">{t('applications.list.appliedDate')}: {new Date(application.appliedAt).toLocaleDateString()}</span>
                            </div>
                            {application.company.website && (
                                <div className="flex items-center gap-3 text-slate-300">
                                    <span className="material-symbols-outlined text-slate-500 text-[20px]" aria-hidden="true">language</span>
                                    <a href={application.company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary hover:underline truncate">{application.company.website}</a>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            {application.jobUrl ? (
                                <button onClick={handleVisitJobPost} className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                                    <span className="material-symbols-outlined text-lg" aria-hidden="true">open_in_new</span> {t('applications.detail.visitPost')}
                                </button>
                            ) : (
                                <button disabled aria-disabled="true" className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-white/5 text-slate-500 text-sm font-medium cursor-not-allowed">
                                    <span className="material-symbols-outlined text-lg">link_off</span> {t('applications.detail.noLink')}
                                </button>
                            )}
                        </div>
                    </article>


                    {/* Contacts Widget */}
                    <div className="bg-surface-dark rounded-xl p-5 shadow-lg border border-border-dark">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-display">{t('applications.detail.contacts')}</h3>
                            <button onClick={() => setIsContactModalOpen(true)} className="text-xs text-primary hover:underline font-bold flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-primary rounded">
                                <span className="material-symbols-outlined text-[16px]">add</span> {t('applications.detail.addContact')}
                            </button>
                        </div>

                        {contacts.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">{t('applications.detail.noContacts')}</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {contacts.map((contact, idx) => {
                                    const isExpanded = expandedContactId === contact.id;
                                    return (
                                        <button
                                            key={contact.id || idx}
                                            onClick={() => toggleContact(contact.id)}
                                            aria-expanded={isExpanded}
                                            className={`w-full text-left rounded-lg transition-all border cursor-pointer group focus:outline-none focus:ring-1 focus:ring-primary ${isExpanded ? 'bg-white/5 border-primary/30 p-3' : 'hover:bg-white/5 border-transparent p-2'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-surface-hover flex items-center justify-center text-white font-bold shrink-0">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{contact.role || 'No role'}</p>
                                                </div>
                                                {contact.linkedIn && !isExpanded && (
                                                    <span
                                                        className="text-slate-500 hover:text-[#0077b5] group-hover:block hidden transition-none"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(contact.linkedIn?.startsWith('http') ? contact.linkedIn : `https://${contact.linkedIn}`, '_blank');
                                                        }}
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-label="Open LinkedIn Profile"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">public</span>
                                                    </span>
                                                )}
                                                <span className={`material-symbols-outlined text-slate-500 text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2 text-xs animate-in slide-in-from-top-2 duration-200 cursor-text" onClick={(e) => e.stopPropagation()}>
                                                    {contact.email && (
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <span className="material-symbols-outlined text-[16px] text-slate-500">mail</span>
                                                            <span className="select-all">{contact.email}</span>
                                                        </div>
                                                    )}
                                                    {contact.phone && (
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <span className="material-symbols-outlined text-[16px] text-slate-500">call</span>
                                                            <span className="select-all">{contact.phone}</span>
                                                        </div>
                                                    )}
                                                    {contact.linkedIn && (
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <span className="material-symbols-outlined text-[16px] text-[#0077b5]">public</span>
                                                            <a href={contact.linkedIn.startsWith('http') ? contact.linkedIn : `https://${contact.linkedIn}`} target="_blank" rel="noreferrer" className="hover:underline text-primary" onClick={(e) => e.stopPropagation()}>LinkedIn Profile</a>
                                                        </div>
                                                    )}
                                                    {(!contact.email && !contact.phone && !contact.linkedIn) && (
                                                        <p className="text-slate-500 italic">No contact details available.</p>
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>

                {/* RIGHT COLUMN: Notes */}
                <section className="lg:col-span-8 xl:col-span-9 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-xl font-bold font-display text-white">{t('applications.detail.notes')}</h2>
                            <span className="text-slate-500 text-sm hidden sm:inline-block">Auto-saved</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-surface-dark rounded-xl shadow-lg border border-border-dark flex flex-col overflow-hidden relative">
                        <div className="flex items-center gap-1 p-2 border-b border-border-dark bg-[#15171C]">
                            <span className="text-xs text-slate-500 px-2">Markdown supported</span>
                        </div>
                        <textarea className="flex-1 bg-input-bg p-6 text-slate-300 resize-none outline-none border-none font-body leading-relaxed" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('applications.detail.notesPlaceholder')} />
                        <div className="p-4 border-t border-border-dark bg-surface-dark flex items-center justify-end gap-4 shrink-0">
                            <button
                                onClick={handleSaveNotes}
                                disabled={notesLoading}
                                className="px-4 py-2 rounded-lg bg-primary text-[#101618] hover:bg-emerald-400 text-sm font-bold transition-all shadow-glow flex items-center gap-2"
                            >
                                {notesLoading && <span className="size-4 border-2 border-[#101618]/30 border-t-[#101618] rounded-full animate-spin"></span>}
                                {notesLoading ? t('applications.detail.saving') : t('applications.detail.saveNotes')}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* CONTACT MODAL */}
            {isContactModalOpen && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border-dark flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">{t('applications.detail.contactModal.title')}</h2>
                            <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close modal"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-slate-400 font-bold mb-1 block">{t('applications.detail.contactModal.name')} *</label>
                                <input value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full bg-input-bg border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold mb-1 block">{t('applications.detail.contactModal.role')}</label>
                                <input value={newContact.role} onChange={e => setNewContact({ ...newContact, role: e.target.value })} className="w-full bg-input-bg border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none" placeholder="e.g. Hiring Manager" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold mb-1 block">{t('applications.detail.contactModal.email')}</label>
                                <input value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="w-full bg-input-bg border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold mb-1 block">{t('applications.detail.contactModal.phone')}</label>
                                <input value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full bg-input-bg border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none" placeholder="+1 234 567 89" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold mb-1 block">{t('applications.detail.contactModal.linkedin')}</label>
                                <input value={newContact.linkedIn} onChange={e => setNewContact({ ...newContact, linkedIn: e.target.value })} className="w-full bg-input-bg border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none" placeholder="linkedin.com/in/..." />
                            </div>
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-surface-hover/10 rounded-b-2xl">
                            <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-sm font-bold">{t('applications.detail.contactModal.cancel')}</button>
                            <button onClick={handleAddContact} disabled={contactLoading} className="px-6 py-2 rounded-lg bg-primary text-[#101618] hover:bg-emerald-400 text-sm font-bold shadow-glow flex items-center gap-2">
                                {contactLoading ? t('applications.detail.saving') : t('applications.detail.contactModal.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
