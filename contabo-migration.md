# Contabo VPS Migration Plan

## 1. GitHub Secrets Güncellemesi

GitHub deposuna gidip `Settings > Secrets and variables > Actions` altındaki şu değişkenleri yeni sunucu bilgilerine göre güncellememiz gerekiyor:

- `REMOTE_HOST`: `185.239.209.104`
- `REMOTE_USER`: `root`
- `REMOTE_PASSWORD`: (Sipariş sırasında belirlediğin şifre)

## 2. Sunucu Hazırlığı (VPS İçi Kurulumlar)

Yeni bir VPS olduğu için içinde Docker ve Git yüklü olmayabilir. Şu adımları sunucuda gerçekleştirmemiz lazım:

- Sistem güncellemeleri (`apt update && apt upgrade`)
- Docker & Docker Compose kurulumu
- Git kurulumu
- Proje dizininin oluşturulması (`mkdir -p /root/Repositories/ApplyFollow`)
- `.env` dosyasının sunucuya aktarılması

## 3. İlk Deployment ve CI/CD Tetiklemesi

- Sunucu hazırlandıktan sonra GitHub Actions üzerinden Pipeline'ı tetiklemek.
- Nginx-proxy ve acme-companion üzerinden SSL sertifikalarının otomatik alınmasını beklemek.

## 4. Domain Yönlendirmesi (DNS)

- Cloudflare veya alan adını kaydettiğin neresi ise, `A` kaydını `185.239.209.104` IP adresine yönlendirmek.
