import React from 'react';

export default function KvkkPage() {
    return (
        <article>
            <h1>KVKK Aydınlatma Metni</h1>
            <p className="text-sm text-slate-500 mb-8">Veri Sorumlusu: ApplyFollow</p>

            <section>
                <h2>1. Veri Sorumlusu</h2>
                <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>ApplyFollow</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                </p>
            </section>

            <section>
                <h2>2. Kişisel Verilerin İşlenme Amacı</h2>
                <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Üyelik işlemlerinin gerçekleştirilmesi.</li>
                    <li>İş başvuru süreçlerinizin (şirket, pozisyon, tarih vb.) kayıt altına alınması ve raporlanması.</li>
                    <li>Size özel kariyer önerileri sunulması.</li>
                    <li>Hukuki yükümlülüklerin yerine getirilmesi.</li>
                    <li>Açık rızanız olması halinde anonimleştirilerek pazar analizi yapılması.</li>
                </ul>
            </section>

            <section>
                <h2>3. İşlenen Kişisel Veriler ve Toplama Yöntemi</h2>
                <p>
                    Verileriniz, web sitemiz üzerinden elektronik ortamda; kayıt formu, başvuru ekleme formu ve profil güncelleme araçları aracılığıyla toplanmaktadır.
                </p>
                <p className="mt-2"><strong>İşlenen Kategoriler:</strong> Kimlik, İletişim, Özlük (CV), İşlem Güvenliği (IP, Log).</p>
            </section>

            <section>
                <h2>4. Kişisel Verilerin Aktarılması</h2>
                <p>
                    Verileriniz, yasal zorunluluklar (savcılık vb.) dışında üçüncü kişilerle paylaşılmamaktadır. Sunucularımız güvenli veri merkezlerinde barındırılmaktadır.
                </p>
            </section>

            <section>
                <h2>5. İlgili Kişinin Hakları (Madde 11)</h2>
                <p>KVKK'nın 11. maddesi uyarınca herkes veri sorumlusuna başvurarak kendisiyle ilgili;</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
                    <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
                    <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                    <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                    <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme haklarına sahiptir.</li>
                </ul>
            </section>

            <section>
                <h2>6. Başvuru</h2>
                <p>
                    Yukarıda belirtilen haklarınızı kullanmak için talebinizi yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da bize daha önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresini kullanmak suretiyle <a href="mailto:kvkk@applyfollow.com" className="text-primary hover:underline">kvkk@applyfollow.com</a> adresine iletebilirsiniz.
                </p>
            </section>
        </article>
    );
}
