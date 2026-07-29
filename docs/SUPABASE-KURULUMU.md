# Supabase Kurulumu

## 1. Proje oluşturma

1. Supabase hesabınızda yeni proje oluşturun.
2. Güçlü bir veritabanı şifresi belirleyin ve güvenli yerde saklayın.
3. Proje hazır olduğunda **SQL Editor** bölümünü açın.
4. `supabase/schema.sql` dosyasının tamamını çalıştırın.

## 2. Web bağlantısı

1. Supabase proje ayarlarından Project URL ve anon/public key değerlerini alın.
2. `config.js` dosyasını açın.
3. İki yer tutucuyu kendi değerlerinizle değiştirin.
4. Dosyayı GitHub'a kaydedin. Netlify otomatik yayınlayacaktır.

Örnek:

```js
window.BOSMASA_CONFIG = {
  SUPABASE_URL: "https://proje-kodunuz.supabase.co",
  SUPABASE_ANON_KEY: "anon-public-key",
  APP_NAME: "Boş Masa"
};
```

## 3. Kesinlikle kullanmayın

`service_role` anahtarını `config.js` içine, GitHub'a veya tarayıcı koduna koymayın. Bu anahtar sunucu yetkisine sahiptir ve gizli tutulmalıdır.
