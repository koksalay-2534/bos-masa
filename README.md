# Boş Masa — gerçek kayıt/giriş sürümü

Bu sürümde önceki demo giriş kaldırıldı.

## Davranış
- Fırsatlar üyelik olmadan görüntülenir.
- Kod almak için kullanıcı kaydı/girişi gerekir.
- Rastgele e-posta ve şifreyle giriş yapılamaz.
- Kullanıcı ve işletme rolleri ayrıdır.
- İşletme paneli yalnızca `business` rolündeki hesapta görünür.

## Kurulum
1. Supabase projesi oluştur.
2. `supabase/schema.sql` dosyasını SQL Editor içinde çalıştır.
3. Supabase > Project Settings > API içinden Project URL ve anon public key değerlerini al.
4. `config.js` dosyasına bu iki değeri yaz.
5. Dosyaları GitHub'a yükle ve Netlify'a bağla.

Ayrıntılar için `docs/KURULUM.md` dosyasını oku.
