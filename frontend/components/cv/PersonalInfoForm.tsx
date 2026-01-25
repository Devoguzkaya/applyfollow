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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Profile Picture Upload */}
                <div className="md:col-span-1 flex flex-col gap-2 items-center justify-center">
                    <div className="relative group size-32 rounded-full overflow-hidden border-2 border-border-main bg-background-main shadow-inner">
                        {data.profileImage ? (
                            <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                                <MdPerson className="text-4xl opacity-50" />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold">
                            <span>Upload Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            updateField('profileImage', reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {data.profileImage && (
                        <button
                            onClick={() => updateField('profileImage', undefined)}
                            className="text-xs text-red-500 hover:text-red-400 font-bold"
                        >
                            Remove
                        </button>
                    )}
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5 justify-center">
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
