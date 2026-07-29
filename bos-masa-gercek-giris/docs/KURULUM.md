# Kurulum

## 1. Supabase
- Yeni proje oluştur.
- SQL Editor aç.
- `supabase/schema.sql` içeriğini çalıştır.
- Authentication > Providers > Email açık olsun.
- Gerçek kullanım için e-posta doğrulamasını açık bırakman önerilir.
- Authentication > URL Configuration bölümünde Site URL alanını `https://www.bosmasa.com` yap.
- Redirect URLs bölümüne hem `https://www.bosmasa.com/**` hem de Netlify geçici adresini ekle.

## 2. Anahtarlar
Project Settings > API bölümünden:
- Project URL
- anon public key

al ve `config.js` içine yaz.

`service_role` anahtarını kesinlikle kullanma.

## 3. GitHub
ZIP'i aç. ZIP dosyasının kendisini değil, içindeki bütün dosyaları depo köküne yükle.

## 4. Netlify
GitHub deposunu mevcut Netlify sitesine bağladıysan commit sonrası otomatik yayın yapılır. Manuel yüklemede klasörün tamamını sürükleyebilirsin.

## 5. Test
1. Uydurma e-posta ve şifreyle giriş dene: reddedilmelidir.
2. Kayıt Ol sekmesinden gerçek hesap oluştur.
3. E-posta doğrulaması açıksa gelen bağlantıyı aç.
4. Giriş yap.
5. Fırsat kodu butonuna bas.
6. İşletme kaydı açıp işletme panelinin göründüğünü doğrula.
