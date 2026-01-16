import { CvData } from '@/services/cvService';
import { MdPerson } from 'react-icons/md';
import { useLanguage } from '@/context/LanguageContext';

interface PersonalInfoFormProps {
    data: CvData;
    updateField: (field: keyof CvData, value: any) => void;
}

export default function PersonalInfoForm({ data, updateField }: PersonalInfoFormProps) {
    const { t } = useLanguage();

    return (
        <section className="bg-surface-card p-6 rounded-2xl border border-border-main">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6">
                <MdPerson className="text-primary text-[24px]" />
                {t('cv.personalInfo')}
            </h3>
            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-bold tracking-wider uppercase">{t('cv.title')}</label>
                    <input
                        value={data.cvTitle || ''}
                        onChange={e => updateField('cvTitle', e.target.value)}
                        className="bg-input-bg border border-border-main p-4 rounded-xl text-text-main text-lg font-bold focus:border-primary outline-none transition-all placeholder:text-text-muted/50 shadow-inner"
                        placeholder="e.g. Senior Software Engineer CV"
                    />
                    <p className="text-[10px] text-text-muted italic mt-1 px-1">This title will appear at the top of your professional profile.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-bold">{t('profilePage.personal.phone')}</label>
                    <input value={data.phoneNumber || ''} onChange={e => updateField('phoneNumber', e.target.value)} className="bg-input-bg border border-border-main p-3 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="+1 234 567 8900" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-bold">{t('profilePage.personal.address')}</label>
                    <input value={data.address || ''} onChange={e => updateField('address', e.target.value)} className="bg-input-bg border border-border-main p-3 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="New York, USA" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-bold">{t('profilePage.personal.linkedin')}</label>
                    <input value={data.linkedinUrl || ''} onChange={e => updateField('linkedinUrl', e.target.value)} className="bg-input-bg border border-border-main p-3 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-bold">{t('profilePage.personal.github')}</label>
                    <input value={data.githubUrl || ''} onChange={e => updateField('githubUrl', e.target.value)} className="bg-input-bg border border-border-main p-3 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="https://github.com/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-bold">{t('profilePage.personal.website')}</label>
                    <input value={data.websiteUrl || ''} onChange={e => updateField('websiteUrl', e.target.value)} className="bg-input-bg border border-border-main p-3 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="https://..." />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted font-bold">{t('cv.summary')}</label>
                <textarea
                    rows={4}
                    value={data.summary || ''}
                    onChange={e => updateField('summary', e.target.value)}
                    className="bg-input-bg border border-border-main p-3 rounded-lg text-text-main text-sm focus:border-primary outline-none resize-y"
                    placeholder="Write a brief summary of your professional background and key achievements..."
                />
            </div>
        </section>
    );
}
