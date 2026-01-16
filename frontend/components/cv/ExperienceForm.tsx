import { ExperienceDto } from '@/services/cvService';
import { MdWork, MdDelete } from 'react-icons/md';
import { useLanguage } from '@/context/LanguageContext';

interface ExperienceFormProps {
    experiences: ExperienceDto[];
    addExperience: () => void;
    removeExperience: (index: number) => void;
    updateExperience: (index: number, field: keyof ExperienceDto, value: any) => void;
}

export default function ExperienceForm({ experiences, addExperience, removeExperience, updateExperience }: ExperienceFormProps) {
    const { t } = useLanguage();

    return (
        <section className="bg-surface-card p-6 rounded-2xl border border-border-main">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <MdWork className="text-primary text-[24px]" />
                    {t('cv.sections.experience.title')}
                </h3>
                <button onClick={addExperience} className="text-sm text-primary font-bold hover:underline">+ {t('cv.sections.experience.add')}</button>
            </div>
            <div className="flex flex-col gap-6">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-hover/50 border border-border-main relative group animate-fadeIn">
                        <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-text-muted hover:text-red-400 z-10 p-1"><MdDelete className="text-[20px]" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-text-muted font-bold">{t('cv.sections.experience.company')}</label>
                                <input value={exp.companyName} onChange={e => updateExperience(idx, 'companyName', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-text-muted font-bold">{t('cv.sections.experience.position')}</label>
                                <input value={exp.position} onChange={e => updateExperience(idx, 'position', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.experience.startDate')}</label><input type="date" value={exp.startDate || ''} onChange={e => updateExperience(idx, 'startDate', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" /></div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.experience.endDate')}</label><input type="date" value={exp.endDate || ''} disabled={exp.isCurrent} onChange={e => updateExperience(idx, 'endDate', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none disabled:opacity-50" /></div>
                            <div className="flex items-center gap-2 mt-6"><input type="checkbox" checked={exp.isCurrent} onChange={e => updateExperience(idx, 'isCurrent', e.target.checked)} className="accent-primary size-4" /><span className="text-sm text-text-muted">{t('cv.sections.experience.current')}</span></div>
                        </div>
                        <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.experience.description')}</label><textarea rows={3} value={exp.description || ''} onChange={e => updateExperience(idx, 'description', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none resize-none" /></div>
                    </div>
                ))}
                {experiences.length === 0 && <p className="text-center text-text-muted py-4 italic">{t('cv.sections.experience.empty')}</p>}
            </div>
        </section>
    );
}
