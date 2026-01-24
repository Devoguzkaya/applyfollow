import React from 'react';

export default function PrivacyPage() {
    return (
        <article>
            <h1>Gizlilik Politikası</h1>
            <p className="text-sm text-slate-500 mb-8">Son Güncelleme: 24.01.2026</p>

            <section>
                <h2>1. Giriş</h2>
                <p>
                    ApplyFollow ("Biz" veya "Şirket") olarak gizliliğinize önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
                </p>
            </section>

            <section>
                <h2>2. Toplanan Veriler</h2>
                <p>Hizmetimizi kullanırken aşağıdaki bilgileri toplayabiliriz:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Kimlik Bilgileri:</strong> Ad, soyad.</li>
                    <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası (opsiyonel).</li>
                    <li><strong>Mesleki Veriler:</strong> Özgeçmiş (CV), iş deneyimi, eğitim bilgileri, yetenekler.</li>
                    <li><strong>Kullanım Verileri:</strong> Başvurduğunuz şirketler, pozisyonlar, başvuru tarihleri ve süreç durumları.</li>
                </ul>
            </section>

            <section>
                <h2>3. Verilerin Kullanım Amacı</h2>
                <p>Toplanan veriler şu amaçlarla kullanılır:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>İş başvurularınızı takip etmenizi sağlamak.</li>
                    <li>Size hatırlatmalar ve bildirimler göndermek (örn. mülakat takvimi).</li>
                    <li>Hizmet kalitesini artırmak ve kullanıcı deneyimini kişiselleştirmek.</li>
                    <li><strong>Anonim Pazar Analizi:</strong> Açık rızanız varsa, maaş ve mülakat süreci verilerinizi kimliğinizden arındırarak (anonimleştirerek) genel topluluk istatistikleri oluşturmak için kullanabiliriz.</li>
                </ul>
            </section>

            <section>
                <h2>4. Veri Paylaşımı</h2>
                <p>
                    Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla paylaşılmaz. Anonimleştirilmiş veriler (kişiyle ilişkilendirilemeyecek istatistikler) araştırma raporlarında kullanılabilir.
                </p>
            </section>

            <section>
                <h2>5. Veri Güvenliği</h2>
                <p>
                    Verilerinizi korumak için endüstri standardı güvenlik önlemleri (SSL şifreleme, güvenli sunucular) kullanıyoruz. Ancak internet üzerinden yapılan hiçbir iletim %100 güvenli değildir.
                </p>
            </section>

            <section>
                <h2>6. İletişim</h2>
                <p>
                    Gizlilik politikamızla ilgili sorularınız için <a href="mailto:privacy@applyfollow.com" className="text-primary hover:underline">privacy@applyfollow.com</a> adresinden bize ulaşabilirsiniz.
                </p>
            </section>
        </article>
    );
}
