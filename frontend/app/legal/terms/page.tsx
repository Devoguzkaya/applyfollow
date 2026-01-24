import React from 'react';

export default function TermsPage() {
    return (
        <article>
            <h1>Kullanıcı Sözleşmesi (Terms of Service)</h1>
            <p className="text-sm text-slate-500 mb-8">Yürürlük Tarihi: 24.01.2026</p>

            <section>
                <h2>1. Kabul</h2>
                <p>
                    ApplyFollow hizmetlerini kullanarak veya bunlara erişerek, bu Kullanım Şartları'nı ("Şartlar") okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul etmiş olursunuz.
                </p>
            </section>

            <section>
                <h2>2. Hizmetin Tanımı</h2>
                <p>
                    ApplyFollow, kullanıcıların iş başvurularını takip etmelerini, yönetmelerini ve kariyer süreçlerini organize etmelerini sağlayan bir SaaS (Hizmet Olarak Yazılım) platformudur.
                </p>
            </section>

            <section>
                <h2>3. Kullanıcı Sorumlulukları</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Hesap Güvenliği:</strong> Şifrenizin güvenliğinden siz sorumlusunuz. Hesabınızla yapılan tüm işlemlerden sorumlu olduğunuzu kabul edersiniz.</li>
                    <li><strong>Doğru Bilgi:</strong> Kayıt sırasında ve sistemde tuttuğunuz verilerin doğruluğunu taahhüt edersiniz.</li>
                    <li><strong>Yasal Uygunluk:</strong> Hizmeti yasalara aykırı amaçlarla kullanamazsınız.</li>
                    <li><strong>Hassas Veri:</strong> "Notlar" veya serbest metin alanlarına sağlık verisi, siyasi görüş, dini inanç gibi Özel Nitelikli Kişisel Veri girmemeyi kabul edersiniz.</li>
                </ul>
            </section>

            <section>
                <h2>4. Fikri Mülkiyet</h2>
                <p>
                    Hizmetin tasarımı, logosu, kodu ve diğer fikri mülkiyet hakları ApplyFollow'a aittir. İzinsiz kopyalanamaz veya çoğaltılamaz.
                </p>
            </section>

            <section>
                <h2>5. Sorumluluk Reddi</h2>
                <p>
                    Hizmet "olduğu gibi" sunulur. ApplyFollow, hizmetin kesintisiz veya hatasız olacağını garanti etmez. Veri kaybından doğacak zararlardan sorumlu tutulamaz.
                </p>
            </section>

            <section>
                <h2>6. Fesih</h2>
                <p>
                    ApplyFollow, bu Şartları ihlal etmeniz durumunda hesabınızı askıya alma veya sonlandırma hakkını saklı tutar.
                </p>
            </section>

            <section>
                <h2>7. Değişiklikler</h2>
                <p>
                    Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikleri size bildireceğiz.
                </p>
            </section>
        </article>
    );
}
