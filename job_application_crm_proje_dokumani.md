# Job Application CRM

İş arayanlar için **merkezde bir Job Application CRM** olan, etrafına para kazandıran akıllı modüller eklenmiş web servisi.

Bu doküman; ürün vizyonunu, aşamaları, her aşamada ne yapılacağını ve teknik/ürün kararlarını net şekilde anlatır.

---

## 🎯 Ürün Vizyonu

> İş arama sürecini **tek bir yerden yönetilebilir**, ölçülebilir ve daha az stresli hale getiren bir platform.

Kullanıcı:
- Nereye başvurduğunu unutmaz
- Ghost’lanıp ghost’lanmadığını bilir
- Ne zaman follow-up atacağını kaçırmaz
- CV’sinin o ilana uygun olup olmadığını görür
- Mülakata girmeden önce hazırlanır

---

## 🧠 Core Ürün: Job Application CRM

Tüm sistemin kalbi burasıdır. Diğer her şey **feature / modül** olarak bunun üstüne eklenir.

### Core Özellikler
- Başvuru ekleme (manuel)
- Firma adı
- Pozisyon
- Başvuru tarihi
- Status yönetimi:
  - Applied
  - Interview
  - Offer
  - Rejected
  - Ghosted
- Not alanı
- Basit liste / dashboard

> Bu aşamada otomasyon yok, AI yok. Ama **ürün çalışıyor**.

---

## 🧱 AŞAMA 1 – MVP (0–14 Gün)

### Amaç
- Çalışan bir ürün çıkarmak
- Gerçek kullanıcıdan feedback almak

### Yapılacaklar
- Next.js + Tailwind proje kurulumu
- Auth (magic link)
- Postgres DB
- Application tablosu
- CRUD:
  - Başvuru ekle
  - Listele
  - Status değiştir
- Minimal dashboard

### Çıkış Kriteri
- Bir kullanıcı en az **5 başvurusunu** sisteme girebiliyor olmalı

---

## 🧠 AŞAMA 2 – ATS CV Analyzer (15–30 Gün)

### Amaç
- Ürüne net bir **değer algısı** katmak
- Premium’a zemin hazırlamak

### Özellikler
- CV upload (PDF / DOCX)
- Job description paste
- ATS uyum skoru (0–100)
- Eksik keyword listesi
- Genel CV feedback

### CRM Entegrasyonu
- Her başvuruya özel ATS analizi
- “Bu başvuru zayıf” uyarısı

---

## ✉️ AŞAMA 3 – Follow-Up & Email Assistant (30–45 Gün)

### Amaç
- Kullanıcının **geri gelmesini** sağlamak

### Özellikler
- Follow-up mail önerisi
- Interview sonrası teşekkür maili
- Rejection sonrası düzgün kapanış maili
- Ton seçimi (samimi / resmi)

### CRM Bağlantısı
- Status’a göre otomatik öneri
- Reminder tarihleri

---

## 🎤 AŞAMA 4 – Interview Prep Modülü (45–60 Gün)

### Amaç
- Para kazanan feature eklemek

### Özellikler
- Pozisyona özel mock interview
- Teknik + behavioral sorular
- Yazılı veya sesli cevap
- AI feedback:
  - Güçlü yönler
  - Geliştirilecek yerler

### CRM Entegrasyonu
- Status = Interview olduğunda aktif olur

---

## 💰 AŞAMA 5 – Salary & Offer Analyzer (60–75 Gün)

### Amaç
- Offer anında kullanıcıya **yüksek değer** sunmak

### Özellikler
- Pozisyon + ülke bazlı maaş aralığı
- Lowball uyarısı
- Counter-offer metni

### CRM Entegrasyonu
- Status = Offer olduğunda tetiklenir

---

## 🚨 AŞAMA 6 – Job Scam Detector (75–90 Gün)

### Amaç
- Özellikle remote iş arayanlar için güven

### Özellikler
- İlan linki analizi
- Scam skoru
- Red flag listesi

### CRM Entegrasyonu
- Başvuruya “Scam / Şüpheli” etiketi

---

## 🧠 AŞAMA 7 – Anonymous Market Intel (MOAT)

### Amaç
- Rakiplerin kopyalayamayacağı veri havuzu oluşturmak

### Toplanan (anonim) veriler
- Firma cevap süresi
- Ghost oranı
- Interview → Offer dönüşüm oranı

### Kullanıcıya Gösterilen
- “Bu firma ortalama X günde dönüyor”

---

## 💸 Monetizasyon Stratejisi

### Free
- Sınırlı başvuru
- Basic CRM

### Pro (Aylık)
- Unlimited başvuru
- ATS Analyzer
- Email assistant

### Career+
- Interview Prep
- Salary Analyzer

### Ultimate
- Tüm feature’lar
- Market Intel

---

## ⚠️ Bilinçli Olarak Yapılmayanlar
- Otomatik başvuru botu (ilk aşamada)
- Chrome extension (erken)
- Recruiter tarafı

---

## 🎯 İlk Gerçek Başarı Kriteri

- 10 aktif kullanıcı
- Her biri en az 10 başvuru girmiş
- En az 1 kişi ödeme yapmış

---

## 🧠 Uzun Vadeli Vizyon

- Job seeker için **tek zorunlu araç** olmak
- ATS = trafik
- CRM = lock-in
- Interview & salary = para
- Market intel = savunma hattı

---

**Bu doküman yaşayan bir dokümandır.**
Ürün geliştikçe güncellenecektir.

