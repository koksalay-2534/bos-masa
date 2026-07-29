# Boş Masa Web Platformu

Boş Masa; restoran, kafe ve benzeri işletmelerin süreli kampanyalar yayınlayabildiği, kullanıcıların kampanya kodu alabildiği mobil uyumlu bir web uygulamasıdır.

## İçerik

- Kullanıcı kampanya keşif ekranı
- İşletme kampanya paneli
- Yönetici ekranı
- Kampanya kodu üretimi
- Supabase bağlantı altyapısı
- Netlify yayınlama ayarları
- İsimtescil DNS kurulum rehberi

## Hızlı başlangıç

1. Bu klasörü GitHub'da açacağınız `bos-masa` deposuna yükleyin.
2. Netlify'da **Add new project > Import an existing project** yolunu izleyin.
3. GitHub hesabınızı bağlayıp `bos-masa` deposunu seçin.
4. Build command alanını boş bırakın, publish directory alanına `.` yazın.
5. **Publish** düğmesine basın.
6. Veritabanı için `docs/SUPABASE-KURULUMU.md` dosyasını uygulayın.
7. Alan adı için `docs/ISIMTESCIL-DNS.md` dosyasını uygulayın.

## Güvenlik

`config.js` içinde yalnızca Supabase **Project URL** ve **anon/public key** kullanılmalıdır. Supabase `service_role` anahtarını hiçbir zaman bu projeye, GitHub'a veya tarayıcı koduna koymayın.

## Yerel çalışma

`index.html` dosyasını doğrudan açabilirsiniz. Tarayıcı güvenlik kısıtlamalarıyla karşılaşırsanız klasörde basit bir yerel sunucu çalıştırın:

```bash
python3 -m http.server 8080
```

Sonra `http://localhost:8080` adresini açın.
