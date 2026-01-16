import { LanguageDto } from '@/services/cvService';
import { MdTranslate, MdDelete } from 'react-icons/md';
import { useLanguage } from '@/context/LanguageContext';

interface LanguagesFormProps {
    languages: LanguageDto[];
    addLanguage: () => void;
    removeLanguage: (index: number) => void;
    updateLanguage: (index: number, field: keyof LanguageDto, value: any) => void;
}

export default function LanguagesForm({ languages, addLanguage, removeLanguage, updateLanguage }: LanguagesFormProps) {
    const { t } = useLanguage();

    return (
        <section className="bg-surface-card p-6 rounded-2xl border border-border-main">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <MdTranslate className="text-primary text-[24px]" />
                    {t('cv.sections.languages.title')}
                </h3>
                <button onClick={addLanguage} className="text-sm text-primary font-bold hover:underline">+ {t('cv.sections.languages.add')}</button>
            </div>
            <div className="flex flex-col gap-3">
                {languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-fadeIn">
                        <input value={lang.name} onChange={e => updateLanguage(idx, 'name', e.target.value)} className="flex-1 bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder={t('cv.sections.languages.name')} />
                        <select value={lang.level} onChange={e => updateLanguage(idx, 'level', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none w-32">
                            <option value="BASIC">{t('cv.sections.languages.levels.BASIC')}</option>
                            <option value="INTERMEDIATE">{t('cv.sections.languages.levels.INTERMEDIATE')}</option>
                            <option value="ADVANCED">{t('cv.sections.languages.levels.ADVANCED')}</option>
                            <option value="FLUENT">{t('cv.sections.languages.levels.FLUENT')}</option>
                            <option value="NATIVE">{t('cv.sections.languages.levels.NATIVE')}</option>
                        </select>
                        <button onClick={() => removeLanguage(idx)} className="text-text-muted hover:text-red-400 p-1"><MdDelete className="text-[20px]" /></button>
                    </div>
                ))}
                {languages.length === 0 && <p className="text-center text-text-muted py-2 italic text-sm">{t('cv.sections.languages.empty')}</p>}
            </div>
        </section>
    );
}
