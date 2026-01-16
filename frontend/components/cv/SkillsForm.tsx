import { SkillDto } from '@/services/cvService';
import { MdPsychology, MdDelete } from 'react-icons/md';
import { useLanguage } from '@/context/LanguageContext';

interface SkillsFormProps {
    skills: SkillDto[];
    addSkill: () => void;
    removeSkill: (index: number) => void;
    updateSkill: (index: number, field: keyof SkillDto, value: any) => void;
}

export default function SkillsForm({ skills, addSkill, removeSkill, updateSkill }: SkillsFormProps) {
    const { t } = useLanguage();

    return (
        <section className="bg-surface-card p-6 rounded-2xl border border-border-main">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <MdPsychology className="text-primary text-[24px]" />
                    {t('cv.sections.skills.title')}
                </h3>
                <button onClick={addSkill} className="text-sm text-primary font-bold hover:underline">+ {t('cv.sections.skills.add')}</button>
            </div>
            <div className="flex flex-col gap-3">
                {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-fadeIn">
                        <input value={skill.name} onChange={e => updateSkill(idx, 'name', e.target.value)} className="flex-1 bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder={t('cv.sections.skills.name')} />
                        <button onClick={() => removeSkill(idx)} className="text-text-muted hover:text-red-400 p-1"><MdDelete className="text-[20px]" /></button>
                    </div>
                ))}
                {skills.length === 0 && <p className="text-center text-text-muted py-2 italic text-sm">{t('cv.sections.skills.empty')}</p>}
            </div>
        </section>
    );
}
