"use client";

import { useEffect, useState } from 'react';
import { CvData, EducationDto, ExperienceDto, SkillDto, LanguageDto, CertificateDto, cvService } from '@/services/cvService';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdSave, MdDownload, MdVisibility } from "react-icons/md";

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
        cvTitle: ''
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
                cvTitle: serverData.cvTitle || ''
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

    // 4. Download Mutation
    const downloadMutation = useMutation({
        mutationFn: cvService.downloadCv,
        onError: () => {
            toast.error("Failed to download CV");
        }
    });

    const handleSave = async () => {
        saveMutation.mutate(data);
    };

    const handleDownload = async () => {
        // Save first then download
        saveMutation.mutate(data, {
            onSuccess: () => {
                downloadMutation.mutate();
                toast.success(t('cv.preview') + " " + t('common.download') + "!");
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
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-card p-6 rounded-2xl border border-border-main shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold text-text-main mb-1">{t('cv.builder')}</h2>
                    <p className="text-text-muted text-sm">Craft your professional resume.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-xl bg-surface-hover hover:bg-surface-card text-text-main font-bold border border-border-main transition-all flex items-center gap-2 group"
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
                    <button
                        onClick={handleDownload}
                        disabled={downloadMutation.isPending}
                        className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:opacity-90 hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {downloadMutation.isPending ? <span className="size-4 border-2 border-black/50 border-t-black rounded-full animate-spin"></span> : <MdDownload className="text-[20px]" />}
                        {t('common.download')} .docx
                    </button>
                </div>
            </div>

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

            {/* 4. SKILLS & LANGUAGES (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>

            {/* 5. CERTIFICATES */}
            <CertificatesForm
                certificates={data.certificates}
                addCertificate={addCertificate}
                removeCertificate={removeCertificate}
                updateCertificate={updateCertificate}
            />

        </div>
    );
}
