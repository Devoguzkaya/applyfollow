import { CvData } from '@/services/cvService';
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { MdEmail, MdCall, MdLocationOn, MdEdit } from "react-icons/md";
import { useLanguage } from '@/context/LanguageContext';

interface CvPreviewProps {
    data: CvData;
    user: {
        fullName: string;
        email: string;
    };
    onEdit?: () => void;
    onDownload?: () => void;
    showActions?: boolean; // If true, shows the edit/download buttons in header
}

export default function CvPreview({ data, user, onEdit, onDownload, showActions = true }: CvPreviewProps) {
    const { t } = useLanguage();

    const hasData = data && (
        (data.experiences && data.experiences.length > 0) ||
        (data.educations && data.educations.length > 0) ||
        (data.skills && data.skills.length > 0) ||
        (data.languages && data.languages.length > 0) ||
        data.summary
    );

    if (!hasData && showActions) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-surface-card border border-border-main rounded-2xl animate-in fade-in zoom-in duration-300">
                <div className="size-16 rounded-full bg-surface-hover flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-text-muted">description</span>
                </div>
                <h3 className="text-xl font-bold text-text-main">{t('cv.previewMode.noCvFound')}</h3>
                <p className="text-text-muted max-w-sm">
                    {t('cv.previewMode.noCvDesc')}
                </p>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:opacity-90 transition-all"
                    >
                        {t('cv.previewMode.openBuilder')}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions - Only conditionally rendered */}
            {showActions && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-card p-6 rounded-2xl border border-border-main shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main mb-1">{t('cv.previewMode.title')}</h2>
                        <p className="text-text-muted text-sm">{t('cv.previewMode.subtitle')}</p>
                    </div>
                    <div className="flex gap-3">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="px-6 py-2.5 rounded-xl bg-surface-hover hover:bg-surface-card text-text-main font-bold border border-border-main transition-all flex items-center gap-2 group"
                            >
                                <MdEdit className="text-[20px] group-hover:text-primary transition-colors" />
                                {t('cv.previewMode.editContent')}
                            </button>
                        )}
                        {onDownload && (
                            <button
                                onClick={onDownload}
                                className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:opacity-90 hover:shadow-glow transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                {t('cv.previewMode.downloadDocx')}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* A4 Document Preview (ATS Friendly Design) */}
            <div className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:w-full flex flex-col">

                {/* Header Section (Compact) */}
                <div
                    className="text-white p-5 flex flex-row gap-5 items-center shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: data.themeColor || '#0f172a' }}
                >
                    {data.profileImage && (
                        <div className="size-20 rounded-full border-2 border-white/20 shrink-0 overflow-hidden bg-white/10">
                            <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold uppercase tracking-wide leading-tight">{user.fullName || "Your Name"}</h1>
                        {data.cvTitle && (
                            <h2 className="text-sm font-medium tracking-wider uppercase mt-0.5 opacity-90 truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                {data.cvTitle}
                            </h2>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[200mm] flex-1">

                    {/* LEFT SIDEBAR (Contact, Skills, Languages) */}
                    <div className="md:col-span-3 bg-slate-50 p-6 border-r border-slate-200 flex flex-col gap-8">
                        {/* Contact Info */}
                        <section>
                            <h3
                                className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3 transition-colors duration-300"
                                style={{ borderColor: data.accentColor || data.themeColor || '#cbd5e1', color: data.accentColor || data.themeColor || '#0f172a' }}
                            >
                                Contact
                            </h3>
                            <div className="flex flex-col gap-2 text-xs text-slate-600">
                                <div className="flex items-center gap-2 break-all">
                                    <MdEmail className="shrink-0 transition-colors duration-300" style={{ color: data.accentColor || data.themeColor || '#0f172a' }} />
                                    <span>{user.email}</span>
                                </div>
                                {data.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                        <MdCall className="shrink-0 transition-colors duration-300" style={{ color: data.accentColor || data.themeColor || '#0f172a' }} />
                                        <span>{data.phoneNumber}</span>
                                    </div>
                                )}
                                {data.address && (
                                    <div className="flex items-start gap-2">
                                        <MdLocationOn className="shrink-0 mt-0.5 transition-colors duration-300" style={{ color: data.accentColor || data.themeColor || '#0f172a' }} />
                                        <span>{data.address}</span>
                                    </div>
                                )}
                                <div className="mt-3 flex flex-col gap-2">
                                    {data.linkedinUrl && (
                                        <div className="flex items-center gap-2">
                                            <FaLinkedin className="shrink-0 text-lg transition-colors duration-300" style={{ color: data.accentColor || data.themeColor || '#0f172a' }} />
                                            <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="truncate hover:underline text-slate-600 hover:text-slate-900 transition-colors text-[10px]">
                                                {data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        </div>
                                    )}
                                    {data.githubUrl && (
                                        <div className="flex items-center gap-2">
                                            <FaGithub className="shrink-0 text-lg transition-colors duration-300" style={{ color: data.accentColor || data.themeColor || '#0f172a' }} />
                                            <a href={data.githubUrl} target="_blank" rel="noreferrer" className="truncate hover:underline text-slate-600 hover:text-slate-900 transition-colors text-[10px]">
                                                {data.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        </div>
                                    )}
                                    {data.websiteUrl && (
                                        <div className="flex items-center gap-2">
                                            <FaGlobe className="shrink-0 text-lg transition-colors duration-300" style={{ color: data.accentColor || data.themeColor || '#0f172a' }} />
                                            <a href={data.websiteUrl} target="_blank" rel="noreferrer" className="truncate hover:underline text-slate-600 hover:text-slate-900 transition-colors text-[10px]">
                                                {data.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <h3
                                    className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3 transition-colors duration-300"
                                    style={{ borderColor: data.accentColor || data.themeColor || '#cbd5e1', color: data.accentColor || data.themeColor || '#0f172a' }}
                                >
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {data.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-700 font-medium shadow-sm">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {data.languages && data.languages.length > 0 && (
                            <section>
                                <h3
                                    className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3 transition-colors duration-300"
                                    style={{ borderColor: data.accentColor || data.themeColor || '#cbd5e1', color: data.accentColor || data.themeColor || '#0f172a' }}
                                >
                                    Languages
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {data.languages.map((lang, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs">
                                            <span className="font-medium text-slate-700">{lang.name}</span>
                                            <span className="text-slate-500 italic">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT MAIN CONTENT (Summary, Experience, Education) */}
                    <div className="md:col-span-9 p-6 flex flex-col gap-6">

                        {/* Summary (Moved here) */}
                        {data.summary && (
                            <section>
                                <h3
                                    className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3 flex items-center gap-2 transition-colors duration-300"
                                    style={{ borderColor: data.accentColor || data.themeColor || '#0f172a', color: data.accentColor || data.themeColor || '#0f172a' }}
                                >
                                    <span className="material-symbols-outlined text-lg">person</span>
                                    Profile
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap text-justify break-words">
                                    {data.summary}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {data.experiences && data.experiences.length > 0 && (
                            <section>
                                <h3
                                    className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-4 flex items-center gap-2 transition-colors duration-300"
                                    style={{ borderColor: data.accentColor || data.themeColor || '#0f172a', color: data.accentColor || data.themeColor || '#0f172a' }}
                                >
                                    <span className="material-symbols-outlined text-lg">work</span>
                                    Experience
                                </h3>
                                <div className="flex flex-col gap-6">
                                    {data.experiences.map((exp, idx) => (
                                        <div key={idx} className="flex flex-col gap-1">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="text-base font-bold text-slate-900 break-words max-w-[70%]">{exp.position}</h4>
                                                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                                                    {exp.startDate || "N/A"} — {exp.isCurrent ? "Present" : (exp.endDate || "N/A")}
                                                </span>
                                            </div>
                                            <div className="text-slate-800 font-bold text-xs mb-1 break-words">{exp.companyName}</div>
                                            {exp.description && (
                                                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap text-justify break-words">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {data.educations && data.educations.length > 0 && (
                            <section>
                                <h3
                                    className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-4 flex items-center gap-2 transition-colors duration-300"
                                    style={{ borderColor: data.accentColor || data.themeColor || '#0f172a', color: data.accentColor || data.themeColor || '#0f172a' }}
                                >
                                    <span className="material-symbols-outlined text-lg">school</span>
                                    Education
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {data.educations.map((edu, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className="text-sm font-bold text-slate-900">{edu.schoolName}</h4>
                                                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                                                    {edu.startDate || "N/A"} — {edu.isCurrent ? "Present" : (edu.endDate || "N/A")}
                                                </span>
                                            </div>
                                            <div className="text-slate-700 font-medium text-xs">
                                                {edu.degree ? `${edu.degree}, ` : ''}{edu.fieldOfStudy}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certificates */}
                        {data.certificates && data.certificates.length > 0 && (
                            <section>
                                <h3
                                    className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-4 flex items-center gap-2 transition-colors duration-300"
                                    style={{ borderColor: data.accentColor || data.themeColor || '#0f172a', color: data.accentColor || data.themeColor || '#0f172a' }}
                                >
                                    <span className="material-symbols-outlined text-lg">workspace_premium</span>
                                    Certificates
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {data.certificates.map((cert, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-start border-l-2 border-slate-200 pl-3 py-1 gap-2">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h4 className="text-xs font-bold text-slate-900 break-words">{cert.name}</h4>
                                                <p className="text-[10px] text-slate-500 break-words">{cert.issuer}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-400">{cert.date}</span>
                                                {cert.url && (
                                                    <a
                                                        href={cert.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] font-bold hover:underline text-slate-600 hover:text-slate-900 transition-colors"
                                                    >
                                                        VERIFY
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="h-4 bg-slate-900 w-full mt-auto"></div>
            </div>
        </div>
    );
}
