"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCv, downloadCv } from '@/store/features/cv/cvSlice';
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { MdEmail, MdCall, MdLocationOn } from "react-icons/md";

export default function MyCv() {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useAppSelector((state) => state.cv);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Fetch CV data if not already available
        if (!data) {
            dispatch(fetchCv());
        }
    }, [dispatch, data]);

    const handleDownload = async () => {
        try {
            await dispatch(downloadCv()).unwrap();
        } catch (error) {
            // Toast managed in slice or component
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    // Checking if there is any data
    const hasData = data && (
        data.experiences.length > 0 ||
        data.educations.length > 0 ||
        data.skills.length > 0 ||
        data.languages.length > 0 ||
        data.summary
    );

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-surface-card border border-border-main rounded-2xl animate-in fade-in zoom-in duration-300">
                <div className="size-16 rounded-full bg-surface-hover flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-text-muted">description</span>
                </div>
                <h3 className="text-xl font-bold text-text-main">No CV found</h3>
                <p className="text-text-muted max-w-sm">
                    You haven't built your CV yet. Switch to the <b>CV Builder</b> tab to create one.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-card p-6 rounded-2xl border border-border-main shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold text-text-main mb-1">My CV Preview</h2>
                    <p className="text-text-muted text-sm">This is how your CV data looks.</p>
                </div>
                <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:opacity-90 hover:shadow-glow transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Download .docx
                </button>
            </div>

            {/* A4 Document Preview */}
            <div className="mx-auto w-full max-w-[210mm] bg-surface-card shadow-2xl rounded-sm border border-border-main p-8 md:p-12 relative overflow-hidden">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-teal-500"></div>

                {/* Header Section */}
                <div className="border-b border-border-main pb-8 mb-8">
                    {data?.cvTitle && (
                        <h2 className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-2 px-1">
                            {data.cvTitle}
                        </h2>
                    )}
                    <h1 className="text-4xl font-bold text-text-main mb-4">{user?.fullName || "Your Name"}</h1>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-text-muted">
                        <span className="flex items-center gap-2">
                            <MdEmail className="text-[18px] text-primary" />
                            {user?.email || "email@example.com"}
                        </span>
                        {data?.phoneNumber && (
                            <span className="flex items-center gap-2">
                                <MdCall className="text-[18px] text-primary" />
                                {data.phoneNumber}
                            </span>
                        )}
                        {data?.address && (
                            <span className="flex items-center gap-2">
                                <MdLocationOn className="text-[18px] text-primary" />
                                {data.address}
                            </span>
                        )}
                        <div className="flex gap-4 col-span-1 sm:col-span-2 mt-2">
                            {data?.linkedinUrl && (
                                <a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                                    <FaLinkedin className="text-[18px]" /> LinkedIn
                                </a>
                            )}
                            {data?.githubUrl && (
                                <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-main hover:text-primary transition-colors">
                                    <FaGithub className="text-[18px]" /> GitHub
                                </a>
                            )}
                            {data?.websiteUrl && (
                                <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors">
                                    <FaGlobe className="text-[18px]" /> Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                {data?.summary && (
                    <div className="mb-8 p-6 bg-surface-hover/50 rounded-xl border border-border-main">
                        <h3 className="text-lg font-bold text-text-main mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">feed</span>
                            Professional Summary
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                            {data.summary}
                        </p>
                    </div>
                )}


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Experience */}
                        {data?.experiences && data.experiences.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="material-symbols-outlined">work</span>
                                    Experience
                                </h3>
                                <div className="flex flex-col gap-8 border-l-2 border-border-main pl-4 ml-2">
                                    {data.experiences.map((exp, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className="absolute -left-[21px] top-1.5 size-3 rounded-full bg-background-main border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                            <h4 className="font-bold text-text-main text-lg">{exp.position}</h4>
                                            <p className="text-primary font-medium text-sm mb-1">{exp.companyName}</p>
                                            <p className="text-xs text-text-muted mb-2 uppercase tracking-wide font-bold">
                                                {exp.startDate || "N/A"} — {exp.isCurrent ? "Present" : (exp.endDate || "N/A")}
                                            </p>
                                            {exp.description && (
                                                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap mt-2">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {data?.educations && data.educations.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="material-symbols-outlined">school</span>
                                    Education
                                </h3>
                                <div className="flex flex-col gap-6 border-l-2 border-border-main pl-4 ml-2">
                                    {data.educations.map((edu, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className="absolute -left-[21px] top-1.5 size-3 rounded-full bg-background-main border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                            <h4 className="font-bold text-text-main text-lg">{edu.schoolName}</h4>
                                            <p className="text-primary font-medium text-sm mb-1">{edu.degree || "Degree"} in {edu.fieldOfStudy}</p>
                                            <p className="text-xs text-text-muted uppercase tracking-wide font-bold">
                                                {edu.startDate || "N/A"} — {edu.isCurrent ? "Present" : (edu.endDate || "N/A")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* Skills */}
                        {data?.skills && data.skills.length > 0 && (
                            <section className="bg-surface-hover/50 p-6 rounded-xl border border-border-main">
                                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2 border-b border-border-main pb-2">
                                    <span className="material-symbols-outlined text-primary">psychology</span>
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-surface-card text-text-main text-xs font-bold px-3 py-1.5 rounded-lg border border-border-main hover:border-primary/50 transition-colors cursor-default">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {data?.languages && data.languages.length > 0 && (
                            <section className="bg-surface-hover/50 p-6 rounded-xl border border-border-main">
                                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2 border-b border-border-main pb-2">
                                    <span className="material-symbols-outlined text-primary">translate</span>
                                    Languages
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {data.languages.map((lang, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-border-main pb-2 last:border-0 last:pb-0">
                                            <span className="text-text-muted font-medium">{lang.name}</span>
                                            <span className="text-primary font-bold text-[10px] uppercase bg-primary/10 px-2 py-0.5 rounded">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certificates */}
                        {data?.certificates && data.certificates.length > 0 && (
                            <section className="bg-surface-hover/50 p-6 rounded-xl border border-border-main">
                                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2 border-b border-border-main pb-2">
                                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                                    Certificates
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {data.certificates.map((cert, idx) => (
                                        <div key={idx} className="flex flex-col gap-0.5">
                                            <p className="text-text-main text-sm font-bold leading-tight">{cert.name}</p>
                                            <p className="text-text-muted text-xs">{cert.issuer}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] text-text-muted">{cert.date}</span>
                                                {cert.url && (
                                                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">Verify</a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
