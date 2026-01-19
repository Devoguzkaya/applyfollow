export const tr = {
    common: {
        save: "Kaydet",
        saved: "Kaydedildi!",
        cancel: "İptal",
        delete: "Sil",
        edit: "Düzenle",
        download: "İndir",
        loading: "Yükleniyor...",
        noData: "Veri bulunamadı",
        viewAll: "Tümünü Gör",
    },
    sidebar: {
        overview: "Genel Bakış",
        applications: "Başvurularım",
        schedule: "Takvim",
        cvBuilder: "CV Oluşturucu",
        settings: "Ayarlar",
        management: "Yönetim",
        adminPanel: "Admin Paneli",
        users: "Kullanıcılar",
        messages: "Mesajlar",
        upgradePlan: "Planı Yükselt",
        proVersion: "Pro Versiyon içeriği...",
        proButton: "Pro'ya Geç",
    },
    dashboard: {
        welcome: "Hoş geldin",
        summary: "Özet",
        stats: {
            total: "Toplam Başvuru",
            responseRate: "Dönüş Oranı",
            pending: "Bekleyen",
            interviews: "Mülakatlar",
            rejected: "Reddedilen",
            offer: "Teklif",
            ghosted: "Cevapsız",
        },
        charts: {
            statusBreakdown: "Durum Dağılımı",
            outcomes: "Sonuçlar",
            upcoming: "Yaklaşanlar",
            total: "Toplam",
            noEvents: "Yaklaşan etkinlik yok.",
        },
        recentApps: {
            title: "Son Başvurular",
            noRecentActivity: "Son zamanlarda aktivite yok. Başvuru yapmaya başla!",
            addNew: "Yeni Ekle",
        }
    },
    profile: {
        yourProfile: "Profilin",
        logout: "Çıkış Yap",
        signedInAs: "Giriş yapıldı",
    },
    notifications: {
        title: "Bildirimler",
        clearAll: "Hepsini Temizle",
        allCaughtUp: "Her şey hazır!",
        noNotifications: "Şu anda yeni bildirim yok. Bir şey olduğunda sizi uyaracağız.",
    },
    cv: {
        preview: "CV Önizleme",
        builder: "CV Oluşturucu",
        title: "CV Başlığı / İsim",
        personalInfo: "Kişisel Bilgiler",
        summary: "Profil Özeti",
        experience: "Deneyim",
        education: "Eğitim",
        skills: "Yetenekler",
        languages: "Diller",
        certificates: "Sertifikalar",
        previewMode: {
            title: "CV Önizleme",
            subtitle: "CV verilerinizin nasıl göründüğü aşağıdadır.",
            editContent: "İçeriği Düzenle",
            downloadDocx: "İndir .docx",
            noCvFound: "CV Bulunamadı",
            noCvDesc: "Henüz bir CV oluşturmadınız. Oluşturmak için CV Oluşturucu sekmesine geçin.",
            openBuilder: "CV Oluşturucuyu Aç",
            verify: "Doğrula",
            degree: "Derece",
            present: "Devam Ediyor"
        },
        sections: {
            experience: {
                title: "Deneyim",
                add: "Pozisyon Ekle",
                company: "Şirket Adı",
                position: "Pozisyon",
                startDate: "Başlangıç Tarihi",
                endDate: "Bitiş Tarihi",
                current: "Halen çalışıyorum",
                description: "Açıklama",
                empty: "Henüz deneyim eklenmemiş."
            },
            education: {
                title: "Eğitim",
                add: "Eğitim Ekle",
                school: "Okul / Üniversite",
                field: "Bölüm",
                degree: "Derece",
                startDate: "Başlangıç Tarihi",
                endDate: "Bitiş Tarihi",
                empty: "Henüz eğitim eklenmemiş."
            },
            skills: {
                title: "Yetenekler",
                add: "Yetenek Ekle",
                name: "Yetenek Adı",
                empty: "Henüz yetenek eklenmemiş."
            },
            languages: {
                title: "Diller",
                add: "Dil Ekle",
                name: "Dil (örn. İngilizce)",
                level: "Seviye",
                levels: {
                    BASIC: "Başlangıç",
                    INTERMEDIATE: "Orta",
                    ADVANCED: "İleri",
                    FLUENT: "Akıcı",
                    NATIVE: "Anadil"
                },
                empty: "Henüz dil eklenmemiş."
            },
            certificates: {
                title: "Sertifikalar & Ödüller",
                add: "Sertifika Ekle",
                name: "Sertifika Adı",
                issuer: "Veren Kurum",
                date: "Veriliş Tarihi",
                url: "Sertifika URL",
                empty: "Henüz sertifika eklenmemiş."
            },
            personal: {
                titlePlaceholder: "örn. Kıdemli Yazılım Mühendisi CV",
                titleHelp: "Bu başlık profesyonel profilinizin en üstünde görünecektir.",
                summaryPlaceholder: "Profesyonel geçmişinizi ve önemli başarılarınızı özetleyin..."
            }
        }
    },
    applications: {
        title: "Başvurular",
        subtitle: "Tüm fırsatlarını tek bir yerden yönet ve takip et.",
        searchPlaceholder: "Şirket ara...",
        newButton: "Yeni Ekle",
        list: {
            company: "Şirket",
            position: "Pozisyon",
            status: "Durum",
            appliedDate: "Başvuru Tarihi",
            actions: "İşlemler",
            emptyTitle: "Henüz başvuru yok",
            emptyDesc: "İlk iş başvurunu ekleyerek yolculuğuna başla.",
            emptyAction: "Başvuru Ekle",
            noResult: "\"{query}\" ile eşleşen başvuru bulunamadı.",
            loading: "Başvuruların yükleniyor..."
        },
        new: {
            title: "Yeni Başvuru Ekle",
            companyName: "Şirket Adı",
            companyPlaceholder: "örn. Google, Stripe",
            position: "Pozisyon",
            positionPlaceholder: "örn. Kıdemli Ürün Tasarımcısı",
            jobUrl: "İlan Linki (Opsiyonel)",
            jobUrlPlaceholder: "https://...",
            appliedDate: "Başvuru Tarihi",
            status: "Durum",
            notes: "Notlar (Opsiyonel)",
            notesPlaceholder: "Bu işle ilgili önemli detaylar...",
            submit: "Başvuruyu Kaydet",
            submitting: "Kaydediliyor...",
            success: "Başvuru başarıyla oluşturuldu!",
            validation: {
                required: "Şirket Adı ve Pozisyon alanları zorunludur.",
                genericError: "Bir şeyler ters gitti. Lütfen tekrar dene."
            }
        },
        detail: {
            jobDetails: "İş Detayları",
            visitPost: "İlana Git",
            notes: "Notlar",
            notesPlaceholder: "Mülakat notlarını veya düşüncelerini buraya yaz...",
            saveNotes: "Notları Kaydet",
            saving: "Kaydediliyor...",
            contacts: "Kişiler",
            addContact: "Kişi Ekle",
            noContacts: "Henüz kişi eklenmemiş.",
            statusUpdated: "Durum güncellendi: ",
            contactAdded: "Kişi başarıyla eklendi!",
            notesSaved: "Notlar kaydedildi!",
            noLink: "Link Yok",
            delete: "Başvuruyu Sil",
            contactModal: {
                title: "Yeni Kişi Ekle",
                name: "İsim",
                role: "Rol / Pozisyon",
                email: "E-posta",
                phone: "Telefon",
                linkedin: "LinkedIn",
                save: "Kaydet",
                cancel: "İptal"
            }
        },
        status: {
            APPLIED: "Başvurdum",
            INTERVIEW: "Mülakat",
            OFFER: "Teklif",
            REJECTED: "Reddedildi",
            GHOSTED: "Cevap Yok"
        }
    },
    landing: {
        nav: {
            features: "Özellikler",
            about: "Hakkımızda",
            contact: "İletişim",
            login: "Giriş Yap",
            signup: "Kayıt Ol",
        },
        hero: {
            badge: "v1.0 Açık Beta",
            title: "Hayalindeki İşe Karmaşa Olmadan Kavuş.",
            subtitle: "Excel tablolarını bırak. Profesyoneller için tasarlanmış güçlü bir çalışma alanında başvurularını takip et, mülakatlarını yönet ve ağını düzenle.",
            getStarted: "Hemen Başla",
            starGithub: "GitHub'da İncele",
        },
        features: {
            title: "İhtiyacın Olan Her Şey",
            subtitle: "Kariyer büyümeni optimize etmek için tasarlanmış araçlar.",
            cards: {
                allInOne: {
                    title: "Hepsi Bir Arada",
                    desc: "Dağınık notlardan kurtul. Tüm başvurularını, durumlarını ve notlarını tek bir panelde gör.",
                },
                reminders: {
                    title: "Akıllı Hatırlatıcılar",
                    desc: "Hiçbir mülakatı kaçırma. Yaklaşan görüşmeler ve takipler için otomatik bildirimler al.",
                },
                analytics: {
                    title: "Süreç Analitiği",
                    desc: "İlerlemeni görselleştir. Kaç başvuru gönderildiğini, kaç mülakat yapıldığını veya teklif alındığını takip et.",
                }
            }
        },
        about: {
            badge: "Misyonumuz",
            title: "Profesyonelleri Geleceklerini İnşa Etmeleri İçin Güçlendiriyoruz.",
            desc1: "ApplyFollow bir ihtiyaçtan doğdu. Profesyoneller olarak işimize değer katmaya odaklanıyoruz ancak kendi kariyer süreçlerimizi yönetmek için doğru araçlardan yoksunuz.",
            desc2: "Misyonumuz, iş arama sürecindeki karmaşayı ortadan kaldırmak. Doğru veri ve organizasyonla, herkesin hayalindeki işe tükenmişlik yaşamadan ulaşabileceğine inanıyoruz."
        },
        contact: {
            title: "Bize Ulaşın.",
            subtitle: "Sorularınız veya geri bildirimleriniz mi var? Sizi dinlemekten mutluluk duyarız. Ekibimiz her zaman yardıma hazır.",
            info: {
                email: "E-posta gönder",
                location: "Konum",
            },
            form: {
                name: "İsim",
                email: "E-posta",
                subject: "Konu",
                message: "Mesajınız",
                send: "Mesaj Gönder",
                sending: "Gönderiliyor...",
            }
        },
        footer: {
            rights: "© 2026 ApplyFollow. Oguzhan tarafından ❤️ ile yapıldı.",
            links: {
                terms: "Şartlar",
            }
        }
    },
    admin: {
        title: "Kullanıcı Yönetimi",
        loading: "Kullanıcılar yükleniyor...",
        table: {
            fullName: "Ad Soyad",
            email: "E-posta",
            role: "Rol",
            status: "Durum",
            actions: "İşlemler",
            viewDetails: "Detayları Gör",
            active: "Aktif",
            inactive: "Pasif",
        },
        detail: {
            title: "Kullanıcı Detayları",
            loading: "Kullanıcı detayları yükleniyor...",
            back: "Kullanıcılara Dön",
            profile: {
                title: "Profil Bilgileri",
                fullName: "Ad Soyad",
                email: "E-posta",
                phone: "Telefon",
                address: "Adres",
                role: "Rol",
                active: "Durum",
                links: "Bağlantılar",
                notProvided: "Belirtilmemiş"
            },
            stats: {
                title: "İstatistikler",
                totalApps: "Toplam Başvuru",
                hasCv: "CV Var mı?",
                yes: "EVET",
                no: "HAYIR",
                cvScore: "CV Doluluk Oranı"
            },
            tabs: {
                overview: "Genel Bakış",
                applications: "Başvurular",
                cv: "CV / Özgeçmiş",
            },
            cv: {
                title: "Özgeçmiş (CV)",
                download: "Word CV İndir",
                downloading: "İndiriliyor...",
                notCreated: "Kullanıcı henüz CV oluşturmamış.",
                phone: "Telefon",
                linkedin: "LinkedIn",
                summary: "Profil Özeti",
                education: "Eğitim",
                experience: "Deneyim",
                present: "Devam Ediyor",
            },
            apps: {
                company: "Şirket",
                position: "Pozisyon",
                status: "Durum",
                date: "Başvuru Tarihi",
                empty: "Başvuru bulunamadı.",
            }
        }
    },
    calendar: {
        subtitle: "Programını, mülakatlarını ve son tarihleri yönet.",
        today: "Bugün",
        monthNames: [
            "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ],
        weekDays: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
        addEvent: "Etkinlik Ekle",
        form: {
            title: "Başlık",
            titlePlaceholder: "örn. Google Mülakatı",
            date: "Tarih",
            time: "Saat",
            type: "Tür",
            notes: "Notlar",
            notesPlaceholder: "Detaylar, linkler veya notlar ekle...",
            alarm: "Alarm / Hatırlatıcı Kur",
            alarmTime: "Alarm Saati",
            save: "Kaydet",
            types: {
                event: "Etkinlik",
                interview: "Mülakat",
                deadline: "Son Tarih"
            }
        },
        toast: {
            success: "Etkinlik başarıyla oluşturuldu!",
            deleted: "\"{title}\" silindi.",
            deleteError: "Etkinlik silinemedi.",
            fetchError: "Etkinlikler yüklenemedi.",
            saveError: "Etkinlik kaydedilemedi."
        },
        confirmDelete: "Bu etkinliği silmek istediğine emin misin?"
    },
    profilePage: {
        title: "Profil Ayarları",
        subtitle: "Kişisel bilgilerinizi ve hesap güvenliğinizi yönetin.",
        tabs: {
            personal: "Kişisel Bilgiler",
            security: "Güvenlik & Şifre"
        },
        personal: {
            fullName: "Ad Soyad",
            email: "E-posta Adresi",
            phone: "Telefon Numarası",
            address: "Adres",
            summary: "Kısa Özgeçmiş / Özet",
            links: "Bağlantılar",
            linkedin: "LinkedIn URL",
            github: "GitHub URL",
            website: "Kişisel Web Sitesi",
            save: "Değişiklikleri Kaydet",
            saving: "Kaydediliyor..."
        },
        security: {
            currentPassword: "Mevcut Şifre",
            newPassword: "Yeni Şifre",
            confirmPassword: "Yeni Şifre (Tekrar)",
            changePassword: "Şifreyi Değiştir",
            changing: "Değiştiriliyor...",
            requirements: "Şifreniz en az 6 karakter uzunluğunda olmalıdır."
        },
        toast: {
            profileUpdated: "Profil başarıyla güncellendi!",
            passwordChanged: "Şifreniz başarıyla değiştirildi!",
            matchError: "Yeni şifreler eşleşmiyor.",
            genericError: "Bir hata oluştu. Lütfen tekrar deneyin."
        }
    }
};

export type Dictionary = typeof tr;
