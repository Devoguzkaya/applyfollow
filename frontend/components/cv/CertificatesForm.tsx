import { CertificateDto } from '@/services/cvService';
import { MdWorkspacePremium, MdDelete } from 'react-icons/md';
import { useLanguage } from '@/context/LanguageContext';

interface CertificatesFormProps {
    certificates: CertificateDto[];
    addCertificate: () => void;
    removeCertificate: (index: number) => void;
    updateCertificate: (index: number, field: keyof CertificateDto, value: any) => void;
}

export default function CertificatesForm({ certificates, addCertificate, removeCertificate, updateCertificate }: CertificatesFormProps) {
    const { t } = useLanguage();

    return (
        <section className="bg-surface-card p-6 rounded-2xl border border-border-main">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <MdWorkspacePremium className="text-primary text-[24px]" />
                    {t('cv.sections.certificates.title')}
                </h3>
                <button onClick={addCertificate} className="text-sm text-primary font-bold hover:underline">+ {t('cv.sections.certificates.add')}</button>
            </div>
            <div className="flex flex-col gap-6">
                {certificates.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-hover/50 border border-border-main relative group animate-fadeIn">
                        <button onClick={() => removeCertificate(idx)} className="absolute top-2 right-4 text-text-muted hover:text-red-400 z-10 p-1"><MdDelete className="text-[20px]" /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.certificates.name')}</label><input value={cert.name} onChange={e => updateCertificate(idx, 'name', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="e.g. AWS Certified Solutions Architect" /></div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.certificates.issuer')}</label><input value={cert.issuer || ''} onChange={e => updateCertificate(idx, 'issuer', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="e.g. Amazon Web Services" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.certificates.date')}</label><input type="date" value={cert.date || ''} onChange={e => updateCertificate(idx, 'date', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" /></div>
                            <div className="flex flex-col gap-1.5"><label className="text-xs text-text-muted font-bold">{t('cv.sections.certificates.url')}</label><input value={cert.url || ''} onChange={e => updateCertificate(idx, 'url', e.target.value)} className="bg-input-bg border border-border-main p-2.5 rounded-lg text-text-main text-sm focus:border-primary outline-none" placeholder="https://..." /></div>
                        </div>
                    </div>
                ))}
                {certificates.length === 0 && <p className="text-center text-text-muted py-4 italic">{t('cv.sections.certificates.empty')}</p>}
            </div>
        </section>
    );
}
