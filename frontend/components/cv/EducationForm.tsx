import { EducationDto } from '@/services/cvService';
import { MdSchool, MdDelete } from 'react-icons/md';
import { useLanguage } from '@/context/LanguageContext';

interface EducationFormProps {
    educations: EducationDto[];
    addEducation: () => void;
    removeEducation: (index: number) => void;
    updateEducation: (index: number, field: keyof EducationDto, value: any) => void;
}

export default function EducationForm({ educations, addEducation, removeEducation, updateEducation }: EducationFormProps) {
    const { t } = useLanguage();

    return (
        <section className="bg-surface-card p-6 rounded-2xl border border-border-main">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <MdSchool className="text-primary text-[24px]" />
                    {t('cv.sections.education.title')}
                </h3>
                <button onClick={addEducation} className="text-sm text-primary font-bold hover:underline">+ {t('cv.sections.education.add')}</button>
            </div>
            <div className="flex flex-col gap-6">
                {educations.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-hover/50 border border-border-main relative group animate-fadeIn">
                        <button onClick={() => removeEducation(idx)} className="absolute top-2 right-4 text-text-muted hover:text-red-400 z-10 p-1"><MdDelete className="text-[20px]" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.education.school')}</label><input value={edu.schoolName} onChange={e => updateEducation(idx, 'schoolName', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" /></div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.education.field')}</label><input value={edu.fieldOfStudy} onChange={e => updateEducation(idx, 'fieldOfStudy', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.education.degree')}</label><input value={edu.degree || ''} onChange={e => updateEducation(idx, 'degree', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" /></div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.education.startDate')}</label><input type="date" value={edu.startDate || ''} onChange={e => updateEducation(idx, 'startDate', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" /></div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.education.endDate')}</label><input type="date" value={edu.endDate || ''} disabled={edu.isCurrent} onChange={e => updateEducation(idx, 'endDate', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none disabled:opacity-50" /></div>
                        </div>
                    </div>
                ))}
                {educations.length === 0 && <p className="text-center text-text-muted py-4 italic">{t('cv.sections.education.empty')}</p>}
            </div>
        </section>
    );
}
