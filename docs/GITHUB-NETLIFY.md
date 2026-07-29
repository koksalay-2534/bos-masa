# GitHub ve Netlify Kurulumu

## A. GitHub deposunu oluşturma

1. `github.com` adresinde hesabınıza giriş yapın.
2. Sağ üstteki `+` simgesinden **New repository** seçin.
3. Repository name alanına `bos-masa` yazın.
4. Görünürlük için başlangıçta **Private** seçebilirsiniz.
5. README, .gitignore veya license eklemeyin; dosyalar pakette hazırdır.
6. **Create repository** düğmesine basın.
7. Açılan sayfada **uploading an existing file** bağlantısını seçin.
8. Bu klasörün içindeki bütün dosya ve klasörleri yükleme alanına sürükleyin. `bos-masa-v1` üst klasörünü değil, onun içindekileri yükleyin.
9. Commit mesajına `İlk Boş Masa sürümü` yazıp **Commit changes** düğmesine basın.

## B. Netlify'ı GitHub'a bağlama

1. Netlify hesabınıza giriş yapın.
2. **Add new project > Import an existing project** seçin.
3. Git sağlayıcısı olarak **GitHub** seçin.
4. Netlify'ın GitHub erişim iznini onaylayın.
5. `bos-masa` deposunu seçin.
6. Ayarları şöyle bırakın:
   - Branch to deploy: `main`
   - Build command: boş
   - Publish directory: `.`
7. **Publish** düğmesine basın.
8. Netlify size `bir-ad.netlify.app` biçiminde geçici adres verir.

## C. Sonraki güncellemeler

GitHub deposunda bir dosya değiştirilip `main` dalına kaydedildiğinde Netlify otomatik olarak yeni sürümü yayınlar. ZIP dosyasını yeniden yüklemeniz gerekmez.
