# İsimtescil Alan Adını Netlify'a Bağlama

DNS ayarlarını, Netlify sitesi ilk kez yayınlandıktan sonra yapın. Netlify'ın kendi ekranında gösterdiği değerler esas alınmalıdır.

## 1. Alan adını Netlify'a ekleyin

1. Netlify'da Boş Masa projesini açın.
2. **Domain management** bölümüne girin.
3. **Add a domain > Add a domain you already own** seçin.
4. İsimtescil'den satın aldığınız alan adını tam olarak yazın.
5. Alan adını doğrulayıp projeye ekleyin.

## 2. Önerilen yöntem: İsimtescil DNS'yi korumak

Bu yöntemde alan adının DNS yönetimi İsimtescil'de kalır. Netlify'ın istediği A, ALIAS, CNAME veya benzeri kayıtları İsimtescil paneline girersiniz.

1. Netlify'da alan adının yanındaki **Pending DNS verification** veya DNS kurulum bağlantısını açın.
2. Netlify'ın gösterdiği kayıtları not edin.
3. İsimtescil hesabınıza giriş yapın.
4. **Domainlerim / Alan Adlarım** bölümünden alan adınızı seçin.
5. **DNS Yönetimi / Gelişmiş DNS Yönetimi** ekranına girin.
6. Netlify'ın gösterdiği kayıtları tür, host ve değer alanlarına aynen girin.
7. `www` için Netlify'ın belirttiği CNAME kaydını ekleyin.
8. Aynı host adına ait çakışan eski A veya CNAME kayıtları varsa, ne işe yaradığını kontrol etmeden silmeyin. Özellikle e-posta için kullanılan MX ve TXT kayıtlarına dokunmayın.
9. Kaydedin ve Netlify'da **Verify DNS configuration** işlemini çalıştırın.

## 3. Alternatif yöntem: Netlify DNS

Netlify size nameserver adresleri verirse bunları İsimtescil'deki nameserver alanına girebilirsiniz. Bu durumda DNS yönetimi Netlify'a geçer fakat alan adı mülkiyeti yine İsimtescil hesabınızda kalır.

E-posta kullanıyorsanız mevcut MX, SPF, DKIM ve doğrulama TXT kayıtlarını Netlify DNS'e taşımadan nameserver değiştirmeyin.

## 4. HTTPS

DNS doğrulandıktan sonra Netlify, alan adınız için SSL/HTTPS sertifikasını otomatik oluşturmaya çalışır. Netlify'da **HTTPS** bölümünden sertifika durumunu kontrol edin.

## 5. Taşıma

İleride başka bir sunucuya geçmek için yalnızca İsimtescil'deki DNS kayıtlarını yeni sunucunun verdiği değerlere değiştirmeniz yeterlidir. Alan adınız Netlify'a devredilmiş olmaz.
