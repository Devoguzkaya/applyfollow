"use client";

import { useEffect, useState } from 'react';
import { CvData, EducationDto, ExperienceDto, SkillDto, LanguageDto, CertificateDto } from '@/services/cvService';
import toast from 'react-hot-toast';
// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCv, saveCv, downloadCv } from '@/store/features/cv/cvSlice';
import { MdSave, MdDownload, MdPerson, MdWork, MdSchool, MdPsychology, MdTranslate, MdWorkspacePremium, MdDelete } from "react-icons/md";

export default function CvBuilder() {
    const dispatch = useAppDispatch();
    const { data: reduxData, isLoading, isSaving } = useAppSelector((state) => state.cv);

    // Local state for all form data
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
        certificates: []
    });

    // 1. Fetch CV on mount
    useEffect(() => {
        dispatch(fetchCv());
    }, [dispatch]);

    // 2. Sync Redux data to Local state when fetched
    useEffect(() => {
        if (reduxData) {
            setData({
                summary: reduxData.summary || '',
                phoneNumber: reduxData.phoneNumber || '',
                address: reduxData.address || '',
                linkedinUrl: reduxData.linkedinUrl || '',
                githubUrl: reduxData.githubUrl || '',
                websiteUrl: reduxData.websiteUrl || '',
                educations: reduxData.educations || [],
                experiences: reduxData.experiences || [],
                skills: reduxData.skills || [],
                languages: reduxData.languages || [],
                certificates: reduxData.certificates || []
            });
        }
    }, [reduxData]);

    const handleSave = async () => {
        try {
            await dispatch(saveCv(data)).unwrap();
            toast.success("CV saved successfully!");
        } catch (error) {
            // Error handled in slice
        }
    };

    const handleDownload = async () => {
        try {
            // First save, then download
            await dispatch(saveCv(data)).unwrap();
            await dispatch(downloadCv()).unwrap();
            toast.success("CV downloaded!");
        } catch (error) {
            toast.error("Failed to download CV");
        }
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


    if (isLoading && !data.summary) return <div className="p-8 text-center text-slate-500">Loading CV data...</div>;

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1A2321] p-6 rounded-2xl border border-white/10 shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">CV Builder</h2>
                    <p className="text-[#9db8a9] text-sm">Craft your professional resume.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all flex items-center gap-2"
                    >
                        {isSaving ? <span className="size-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span> : <MdSave className="text-[20px]" />}
                        Save
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-6 py-2.5 rounded-xl bg-primary text-[#101618] font-bold hover:bg-emerald-400 hover:shadow-glow transition-all flex items-center gap-2"
                    >
                        <MdDownload className="text-[20px]" />
                        Download .docx
                    </button>
                </div>
            </div>

            {/* 1. PERSONAL INFO & SUMMARY */}
            <section className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <MdPerson className="text-primary text-[24px]" />
                    Personal Info & Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-bold">Phone Number</label>
                        <input value={data.phoneNumber || ''} onChange={e => updateField('phoneNumber', e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="+1 234 567 8900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-bold">Address (City, Country)</label>
                        <input value={data.address || ''} onChange={e => updateField('address', e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="New York, USA" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-bold">LinkedIn URL</label>
                        <input value={data.linkedinUrl || ''} onChange={e => updateField('linkedinUrl', e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-bold">GitHub / Portfolio URL</label>
                        <input value={data.githubUrl || ''} onChange={e => updateField('githubUrl', e.target.value)} className="bg-input-bg border border-white/10 p-3 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="https://github.com/..." />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">Professional Summary</label>
                    <textarea
                        rows={4}
                        value={data.summary || ''}
                        onChange={e => updateField('summary', e.target.value)}
                        className="bg-input-bg border border-white/10 p-3 rounded-lg text-white text-sm focus:border-primary outline-none resize-y"
                        placeholder="Write a brief summary of your professional background and key achievements..."
                    />
                </div>
            </section>

            {/* 2. EXPERIENCE */}
            <section className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MdWork className="text-primary text-[24px]" />
                        Experience
                    </h3>
                    <button onClick={addExperience} className="text-sm text-primary font-bold hover:underline">+ Add Position</button>
                </div>
                <div className="flex flex-col gap-6">
                    {data.experiences.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5 relative group">
                            <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-slate-600 hover:text-red-400"><MdDelete className="text-[20px]" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-slate-400 font-bold">Company Name</label>
                                    <input value={exp.companyName} onChange={e => updateExperience(idx, 'companyName', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-slate-400 font-bold">Position</label>
                                    <input value={exp.position} onChange={e => updateExperience(idx, 'position', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Start Date</label><input type="date" value={exp.startDate || ''} onChange={e => updateExperience(idx, 'startDate', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">End Date</label><input type="date" value={exp.endDate || ''} disabled={exp.isCurrent} onChange={e => updateExperience(idx, 'endDate', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none disabled:opacity-50" /></div>
                                <div className="flex items-center gap-2 mt-6"><input type="checkbox" checked={exp.isCurrent} onChange={e => updateExperience(idx, 'isCurrent', e.target.checked)} className="accent-primary size-4" /><span className="text-sm text-slate-300">I currently work here</span></div>
                            </div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Description</label><textarea rows={3} value={exp.description || ''} onChange={e => updateExperience(idx, 'description', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none resize-none" /></div>
                        </div>
                    ))}
                    {data.experiences.length === 0 && <p className="text-center text-slate-500 py-4 italic">No experience added yet.</p>}
                </div>
            </section>

            {/* 3. EDUCATION */}
            <section className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MdSchool className="text-primary text-[24px]" />
                        Education
                    </h3>
                    <button onClick={addEducation} className="text-sm text-primary font-bold hover:underline">+ Add Education</button>
                </div>
                <div className="flex flex-col gap-6">
                    {data.educations.map((edu, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5 relative group">
                            <button onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-slate-600 hover:text-red-400"><MdDelete className="text-[20px]" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">School / University</label><input value={edu.schoolName} onChange={e => updateEducation(idx, 'schoolName', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Field of Study</label><input value={edu.fieldOfStudy} onChange={e => updateEducation(idx, 'fieldOfStudy', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Degree</label><input value={edu.degree || ''} onChange={e => updateEducation(idx, 'degree', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Start Date</label><input type="date" value={edu.startDate || ''} onChange={e => updateEducation(idx, 'startDate', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">End Date</label><input type="date" value={edu.endDate || ''} disabled={edu.isCurrent} onChange={e => updateEducation(idx, 'endDate', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none disabled:opacity-50" /></div>
                            </div>
                        </div>
                    ))}
                    {data.educations.length === 0 && <p className="text-center text-slate-500 py-4 italic">No education added yet.</p>}
                </div>
            </section>

            {/* 4. SKILLS & LANGUAGES (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SKILLS */}
                <section className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <MdPsychology className="text-primary text-[24px]" />
                            Skills
                        </h3>
                        <button onClick={addSkill} className="text-sm text-primary font-bold hover:underline">+ Add Skill</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input value={skill.name} onChange={e => updateSkill(idx, 'name', e.target.value)} className="flex-1 bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="Skill Name" />
                                <button onClick={() => removeSkill(idx)} className="text-slate-600 hover:text-red-400"><MdDelete className="text-[20px]" /></button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* LANGUAGES */}
                <section className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <MdTranslate className="text-primary text-[24px]" />
                            Languages
                        </h3>
                        <button onClick={addLanguage} className="text-sm text-primary font-bold hover:underline">+ Add Language</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {data.languages.map((lang, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input value={lang.name} onChange={e => updateLanguage(idx, 'name', e.target.value)} className="flex-1 bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="Language (e.g. English)" />
                                <select value={lang.level} onChange={e => updateLanguage(idx, 'level', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none w-32">
                                    <option value="BASIC">Basic</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="FLUENT">Fluent</option>
                                    <option value="NATIVE">Native</option>
                                </select>
                                <button onClick={() => removeLanguage(idx)} className="text-slate-600 hover:text-red-400"><MdDelete className="text-[20px]" /></button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 5. CERTIFICATES */}
            <section className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MdWorkspacePremium className="text-primary text-[24px]" />
                        Certificates & Awards
                    </h3>
                    <button onClick={addCertificate} className="text-sm text-primary font-bold hover:underline">+ Add Certificate</button>
                </div>
                <div className="flex flex-col gap-6">
                    {data.certificates.map((cert, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5 relative group">
                            <button onClick={() => removeCertificate(idx)} className="absolute top-4 right-4 text-slate-600 hover:text-red-400"><MdDelete className="text-[20px]" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Certificate Name</label><input value={cert.name} onChange={e => updateCertificate(idx, 'name', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="e.g. AWS Certified Solutions Architect" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Issuing Organization</label><input value={cert.issuer || ''} onChange={e => updateCertificate(idx, 'issuer', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="e.g. Amazon Web Services" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Issue Date</label><input type="date" value={cert.date || ''} onChange={e => updateCertificate(idx, 'date', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" /></div>
                                <div className="flex flex-col gap-1.5"><label className="text-xs text-slate-400 font-bold">Credential URL</label><input value={cert.url || ''} onChange={e => updateCertificate(idx, 'url', e.target.value)} className="bg-input-bg border border-white/10 p-2.5 rounded-lg text-white text-sm focus:border-primary outline-none" placeholder="https://..." /></div>
                            </div>
                        </div>
                    ))}
                    {data.certificates.length === 0 && <p className="text-center text-slate-500 py-4 italic">No certificates added yet.</p>}
                </div>
            </section>

        </div>
    );
}
