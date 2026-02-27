"use client";

import { useEffect, useState, useRef } from 'react';
import { CvData, EducationDto, ExperienceDto, SkillDto, LanguageDto, CertificateDto, cvService } from '@/services/cvService';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdSave, MdDownload, MdVisibility, MdPalette, MdExpandMore } from "react-icons/md";
import { useAppSelector } from '@/store/hooks';
import CvPreview from './CvPreview';
import { useReactToPrint } from 'react-to-print';

// Sub-components
import PersonalInfoForm from './cv/PersonalInfoForm';
import ExperienceForm from './cv/ExperienceForm';
import EducationForm from './cv/EducationForm';
import SkillsForm from './cv/SkillsForm';
import LanguagesForm from './cv/LanguagesForm';
import CertificatesForm from './cv/CertificatesForm';

interface CvBuilderProps {
    setIsEditing: (value: boolean) => void;
}

export default function CvBuilder({ setIsEditing }: CvBuilderProps) {
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    // Get user data for preview
    const { user } = useAppSelector((state) => state.auth);
    const displayUser = user || { fullName: 'Your Name', email: 'email@example.com' };

    // Local state for all form data (for real-time editing)
    const [data, setData] = useState<CvData>({
        summary: '',
        phoneNumber: '',
        address: '',
        linkedinUrl: '',
        githubUrl: '',
        websiteUrl: '',
        educations: [],
        experiences: [],
        skills: [],
        languages: [],
        certificates: [],
        cvTitle: '',
        profileImage: ''
    });

    // 1. Fetch CV Data (TanStack Query)
    const { data: serverData, isLoading } = useQuery({
        queryKey: ['cv'],
        queryFn: cvService.getCv
    });

    // 2. Sync server data to local form state
    useEffect(() => {
        if (serverData) {
            setData({
                summary: serverData.summary || '',
                phoneNumber: serverData.phoneNumber || '',
                address: serverData.address || '',
                linkedinUrl: serverData.linkedinUrl || '',
                githubUrl: serverData.githubUrl || '',
                websiteUrl: serverData.websiteUrl || '',
                educations: serverData.educations || [],
                experiences: serverData.experiences || [],
                skills: serverData.skills || [],
                languages: serverData.languages || [],
                certificates: serverData.certificates || [],
                cvTitle: serverData.cvTitle || '',
                profileImage: serverData.profileImage || ''
            });
        }
    }, [serverData]);

    // 3. Save Mutation
    const saveMutation = useMutation({
        mutationFn: (newData: CvData) => cvService.saveCv(newData),
        onSuccess: () => {
            toast.success(t('common.saved'));
            queryClient.invalidateQueries({ queryKey: ['cv'] });
        },
        onError: () => {
            toast.error("Failed to save CV");
        }
    });

    const validateCvData = (cvData: CvData): boolean => {
        // Education Validation
        for (const edu of cvData.educations) {
            if (!edu.schoolName.trim() || !edu.fieldOfStudy.trim()) {
                toast.error(t('cv.sections.education.empty') || 'Please fill in School Name and Field of Study in all Education entries.');
                return false;
            }
        }

        // Experience Validation
        for (const exp of cvData.experiences) {
            if (!exp.companyName.trim() || !exp.position.trim()) {
                toast.error(t('cv.sections.experience.empty') || 'Please fill in Company Name and Position in all Experience entries.');
                return false;
            }
        }

        // Skill Validation
        for (const skill of cvData.skills) {
            if (!skill.name.trim()) {
                toast.error(t('cv.sections.skills.empty') || 'Please fill in the Skill Name for all skill entries.');
                return false;
            }
        }

        // Language Validation
        for (const lang of cvData.languages) {
            if (!lang.name.trim()) {
                toast.error(t('cv.sections.languages.empty') || 'Please fill in the Language Name for all language entries.');
                return false;
            }
        }

        // Certificate Validation
        for (const cert of cvData.certificates) {
            if (!cert.name.trim()) {
                toast.error(t('cv.sections.certificates.empty') || 'Please fill in the Certificate Name for all certificate entries.');
                return false;
            }
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateCvData(data)) {
            return;
        }

        // Scrub empty strings from dates to prevent backend Jackson 400 Bad Request
        const cleanData: CvData = {
            ...data,
            educations: data.educations.map(e => ({
                ...e,
                startDate: e.startDate === '' ? undefined : e.startDate,
                endDate: e.endDate === '' ? undefined : e.endDate
            })),
            experiences: data.experiences.map(e => ({
                ...e,
                startDate: e.startDate === '' ? undefined : e.startDate,
                endDate: e.endDate === '' ? undefined : e.endDate
            })),
            certificates: data.certificates.map(c => ({
                ...c,
                date: c.date === '' ? undefined : c.date
            }))
        };

        saveMutation.mutate(cleanData);
    };

    // 4. PDF Download (Server-Side with Puppeteer)
    const componentRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!componentRef.current) {
            toast.error("Preview not ready");
            return;
        }

        if (!validateCvData(data)) {
            return;
        }

        // Scrub empty strings from dates to prevent backend Jackson 400 Bad Request
        const cleanData: CvData = {
            ...data,
            educations: data.educations.map(e => ({
                ...e,
                startDate: e.startDate === '' ? undefined : e.startDate,
                endDate: e.endDate === '' ? undefined : e.endDate
            })),
            experiences: data.experiences.map(e => ({
                ...e,
                startDate: e.startDate === '' ? undefined : e.startDate,
                endDate: e.endDate === '' ? undefined : e.endDate
            })),
            certificates: data.certificates.map(c => ({
                ...c,
                date: c.date === '' ? undefined : c.date
            }))
        };

        // Save first
        saveMutation.mutate(cleanData, {
            onSuccess: async () => {
                const toastId = toast.loading('Generating High-Quality PDF...');

                try {
                    // Extract HTML
                    const htmlContent = componentRef.current?.innerHTML || '';

                    // Call backend API
                    const response = await fetch('/api/generate-pdf', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            html: htmlContent,
                            themeConfig: {
                                primary: data.themeColor || '#17cf63',
                                primaryDark: data.themeColor || '#14b556', // Simple fallback
                                accent: data.accentColor || data.themeColor || '#0f172a'
                            }
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Server failed to generate PDF');
                    }

                    // Handle Blob
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    // Filename logic
                    const filename = `CV_${user?.fullName?.replace(/\s+/g, '_') || 'My_CV'}.pdf`;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    toast.success('PDF Downloaded!', { id: toastId });

                } catch (error) {
                    console.error("PDF Error:", error);
                    toast.error('Failed to generate PDF. Please try again.', { id: toastId });
                }
            }
        });
    };

    // --- Helpers ---

    const updateField = (field: keyof CvData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // EXPERIENCE Logic
    const addExperience = () => {
        setData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { companyName: '', position: '', isCurrent: false }]
        }));
    };
    const removeExperience = (index: number) => {
        setData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
    };
    const updateExperience = (index: number, field: keyof ExperienceDto, value: any) => {
        const updated = [...data.experiences];
        updated[index] = { ...updated[index], [field]: value };
        setData(prev => ({ ...prev, experiences: updated }));
    };

    // EDUCATION Logic
    const addEducation = () => {
        setData(prev => ({
            ...prev,
            educations: [...prev.educations, { schoolName: '', fieldOfStudy: '', isCurrent: false }]
        }));
    };
    const removeEducation = (index: number) => {
        setData(prev => ({ ...prev, educations: prev.educations.filter((_, i) => i !== index) }));
    };
    const updateEducation = (index: number, field: keyof EducationDto, value: any) => {
        const updated = [...data.educations];
        updated[index] = { ...updated[index], [field]: value };
        setData(prev => ({ ...prev, educations: updated }));
    };

    // SKILLS Logic
    const addSkill = () => {
        setData(prev => ({ ...prev, skills: [...prev.skills, { name: '' }] }));
    };
    const removeSkill = (index: number) => {
        setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    };
    const updateSkill = (index: number, field: keyof SkillDto, value: any) => {
        const updated = [...data.skills];
        updated[index] = { ...updated[index], [field]: value };
        setData(prev => ({ ...prev, skills: updated }));
    };

    // LANGUAGES Logic
    const addLanguage = () => {
        setData(prev => ({ ...prev, languages: [...prev.languages, { name: '', level: 'BASIC' }] }));
    };
    const removeLanguage = (index: number) => {
        setData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) }));
    };
    const updateLanguage = (index: number, field: keyof LanguageDto, value: any) => {
        const updated = [...data.languages];
        updated[index] = { ...updated[index], [field]: value };
        setData(prev => ({ ...prev, languages: updated }));
    };

    // CERTIFICATES Logic
    const addCertificate = () => {
        setData(prev => ({ ...prev, certificates: [...prev.certificates, { name: '' }] }));
    };
    const removeCertificate = (index: number) => {
        setData(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== index) }));
    };
    const updateCertificate = (index: number, field: keyof CertificateDto, value: any) => {
        const updated = [...data.certificates];
        updated[index] = { ...updated[index], [field]: value };
        setData(prev => ({ ...prev, certificates: updated }));
    };


    if (isLoading && !data.summary) return <div className="p-8 text-center text-slate-500">{t('common.loading')}</div>;

    return (
        <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in duration-500 items-start h-[calc(100vh-120px)]">

            {/* LEFT COLUMN: EDITOR FORM */}
            <div className="flex-1 w-full flex flex-col gap-8 min-w-0 overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
                {/* Header / Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-card p-6 rounded-2xl border border-border-main shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main mb-1">{t('cv.builder')}</h2>
                        <p className="text-text-muted text-sm">Craft your professional resume.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="xl:hidden px-6 py-2.5 rounded-xl bg-surface-hover hover:bg-surface-card text-text-main font-bold border border-border-main transition-all flex items-center gap-2 group"
                        >
                            <MdVisibility className="text-[20px] group-hover:text-primary transition-colors" />
                            {t('cv.preview')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="px-6 py-2.5 rounded-xl bg-surface-hover hover:bg-surface-card text-text-main font-bold border border-border-main transition-all flex items-center gap-2"
                        >
                            {saveMutation.isPending ? <span className="size-4 border-2 border-text-main/50 border-t-text-main rounded-full animate-spin"></span> : <MdSave className="text-[20px]" />}
                            {t('common.save')}
                        </button>
                    </div>
                </div>

                {/* THEME CUSTOMIZATION (Collapsible) */}
                <details className="bg-surface-card rounded-2xl border border-border-main group">
                    <summary className="p-6 font-bold text-lg text-text-main flex items-center gap-2 cursor-pointer list-none select-none">
                        <MdPalette className="text-primary text-[24px]" />
                        Theme Settings
                        <MdExpandMore className="ml-auto text-2xl text-text-muted transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="px-6 pb-6 pt-0 flex flex-col gap-6">
                        {/* Header Color */}
                        <div>
                            <label className="text-xs text-text-muted font-bold block mb-3 uppercase tracking-wider">Header Background</label>
                            <div className="flex flex-wrap gap-3 items-center">
                                {['#0f172a', '#1e40af', '#991b1b', '#065f46', '#5b21b6', '#ea580c', '#be185d'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => updateField('themeColor', color)}
                                        className={`size-8 rounded-full border-2 transition-all ${data.themeColor === color ? 'border-primary shadow-glow scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                                <div className="h-6 w-px bg-border-main mx-2"></div>
                                <div className="relative size-8 rounded-full overflow-hidden border-2 border-border-main cursor-pointer hover:border-text-muted transition-all bg-gradient-to-tr from-slate-200 to-slate-400">
                                    <input
                                        type="color"
                                        value={data.themeColor || '#0f172a'}
                                        onChange={(e) => updateField('themeColor', e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0 opacity-0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border-main"></div>

                        {/* Accent Color */}
                        <div>
                            <label className="text-xs text-text-muted font-bold block mb-3 uppercase tracking-wider">Accent Color (Titles & Icons)</label>
                            <div className="flex flex-wrap gap-3 items-center">
                                {['#0f172a', '#2563eb', '#dc2626', '#059669', '#7c3aed', '#f97316', '#db2777'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => updateField('accentColor', color)}
                                        className={`size-8 rounded-full border-2 transition-all ${data.accentColor === color ? 'border-primary shadow-glow scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                                <div className="h-6 w-px bg-border-main mx-2"></div>
                                <div className="relative size-8 rounded-full overflow-hidden border-2 border-border-main cursor-pointer hover:border-text-muted transition-all bg-gradient-to-tr from-slate-200 to-slate-400">
                                    <input
                                        type="color"
                                        value={data.accentColor || '#0f172a'}
                                        onChange={(e) => updateField('accentColor', e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0 opacity-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </details>

                {/* 1. PERSONAL INFO & SUMMARY */}
                <PersonalInfoForm data={data} updateField={updateField} />

                {/* 2. EXPERIENCE */}
                <ExperienceForm
                    experiences={data.experiences}
                    addExperience={addExperience}
                    removeExperience={removeExperience}
                    updateExperience={updateExperience}
                />

                {/* 3. EDUCATION */}
                <EducationForm
                    educations={data.educations}
                    addEducation={addEducation}
                    removeEducation={removeEducation}
                    updateEducation={updateEducation}
                />

                {/* 4. SKILLS & LANGUAGES */}
                <SkillsForm
                    skills={data.skills}
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                    updateSkill={updateSkill}
                />

                <LanguagesForm
                    languages={data.languages}
                    addLanguage={addLanguage}
                    removeLanguage={removeLanguage}
                    updateLanguage={updateLanguage}
                />

                {/* 5. CERTIFICATES */}
                <CertificatesForm
                    certificates={data.certificates}
                    addCertificate={addCertificate}
                    removeCertificate={removeCertificate}
                    updateCertificate={updateCertificate}
                />

                <div className="pb-20"></div>
            </div>

            {/* RIGHT COLUMN: LIVE PREVIEW (Desktop Only) */}
            <div className="hidden xl:block w-[210mm] shrink-0 h-full overflow-y-auto pr-4 pb-20 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
                <div className="transform scale-100 origin-top-left">
                    <div className="bg-surface-card rounded-2xl border border-border-main p-4 shadow-2xl relative">
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full animate-pulse border border-primary/50">
                                LIVE PREVIEW
                            </span>
                        </div>
                        {/* Reuse CvPreview Component with Live Data */}
                        <div ref={componentRef} className="print:m-0 print:p-0 print:w-[210mm] print:h-[297mm]">
                            <CvPreview
                                data={data}
                                user={displayUser}
                                showActions={false} // Hide header actions in live preview
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Download Button (FAB) */}
            <button
                onClick={handleDownload}
                title={t('common.download')}
                className="fixed bottom-28 right-8 z-40 size-14 bg-surface-card text-text-main border border-border-main rounded-full shadow-lg hover:shadow-primary/30 hover:border-primary hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            >
                <MdDownload className="text-3xl" />
            </button>
        </div>
    );
}
