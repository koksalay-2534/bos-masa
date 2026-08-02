const cfg = window.BOSMASA_CONFIG || {};
const configured = cfg.SUPABASE_URL?.startsWith('https://') && !cfg.SUPABASE_URL.includes('BURAYA_') && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes('BURAYA_');
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const state = { mode: 'login', role: 'user', session: null };
const deals = [
  {name:'Masa Bistro',area:'Kadıköy',title:'İlk ana yemekte %25 indirim',minutes:38},
  {name:'Köşe Kahve',area:'Beşiktaş',title:'İkinci kahve ücretsiz',minutes:52},
  {name:'Limon Teras',area:'Moda',title:'Saat 18.00’e kadar %20 indirim',minutes:74},
  {name:'Fırın 34',area:'Şişli',title:'Tatlı yanında filtre kahve hediye',minutes:41},
  {name:'Sahil Lokantası',area:'Üsküdar',title:'2 kişilik menüde %15 indirim',minutes:63},
  {name:'Beyoğlu Bahçe',area:'Beyoğlu',title:'İlk içecekte %30 indirim',minutes:27}
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function showView(name){
  $$('.view').forEach(v=>v.classList.remove('active'));
  $(`#${name}View`).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));

function renderDeals(filter = '') {
  const q = filter.toLocaleLowerCase('tr');

  const rows = deals.filter(d =>
    `${d.name} ${d.area} ${d.title}`
      .toLocaleLowerCase('tr')
      .includes(q)
  );

  $('#dealGrid').innerHTML = rows.map((d, i) => `
    <article
      class="deal business-card"
      data-business-id="${i}"
      tabindex="0"
      role="button"
      aria-label="${d.name} işletme profilini aç"
    >
      <span class="badge">${d.minutes} dk kaldı</span>
      <h3>${d.name}</h3>
      <p>${d.title}</p>

      <div class="deal-footer">
        <span>${d.area}</span>
        <button
          class="ghost small business-view-btn"
          data-business-id="${i}"
          type="button"
        >
          İşletmeyi İncele
        </button>
      </div>
    </article>
  `).join('') || '<p>Aramana uygun fırsat bulunamadı.</p>';

  $$('.business-card').forEach(card => {
    card.addEventListener('click', () => {
      openBusinessDetail(Number(card.dataset.businessId));
    });

    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openBusinessDetail(Number(card.dataset.businessId));
      }
    });
  });

  $$('.business-view-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      openBusinessDetail(Number(button.dataset.businessId));
    });
  });
}
$('#searchInput').addEventListener('input',e=>renderDeals(e.target.value));
renderDeals();
let selectedBusiness = null;

function openBusinessDetail(index) {
  const business = deals[index];
  if (!business) return;

  selectedBusiness = business;

  $('#businessDetailCategory').textContent = 'RESTORAN / KAFE';
  $('#businessDetailTitle').textContent = business.name;
  $('#businessDetailLocation').textContent = business.area;
  $('#businessDetailAddress').textContent = `${business.area}, İstanbul`;
  $('#businessDetailPhone').textContent = 'İşletme tarafından henüz eklenmedi';
  $('#businessDetailHours').textContent = '09.00 – 23.00';
  $('#businessDetailRating').textContent = 'Yeni işletme';

  $('#businessDetailDescription').textContent =
    `${business.name}, ${business.area} bölgesinde hizmet veren bir işletmedir. İşletme detayları yakında güncellenecektir.`;

  $('#businessCampaignTitle').textContent = business.title;
  $('#businessCampaignDescription').textContent = business.title;
  $('#businessCampaignTime').textContent = `${business.minutes} dk kaldı`;
  $('#businessCampaignMessage').textContent = '';

  $('#businessDetailModal').classList.remove('hidden');
}

$('#businessDetailClose')?.addEventListener('click', () => {
  $('#businessDetailModal').classList.add('hidden');
});

$('#businessDetailModal')?.addEventListener('click', event => {
  if (event.target.id === 'businessDetailModal') {
    $('#businessDetailModal').classList.add('hidden');
  }
});

$('#businessCampaignClaim')?.addEventListener('click', () => {
  if (!state.session?.user) {
    $('#businessDetailModal').classList.add('hidden');
    openAuth('user', 'login');
    return;
  }

  $('#businessCampaignMessage').textContent =
    'Kampanya kodunun hesabınıza kaydedilmesi sonraki aşamada etkinleştirilecek.';
});
function openAuth(role='user', mode='login'){
  state.role=role; state.mode=mode;
  $('#authRoleLabel').textContent=role==='business'?'İşletme hesabı':'Kullanıcı hesabı';
  setMode(mode);
  $('#authModal').classList.remove('hidden');
}
function closeAuth(){ $('#authModal').classList.add('hidden'); $('#authMessage').textContent=''; }
function setMode(mode){
  state.mode=mode;
  $('#loginTab').classList.toggle('active',mode==='login');
  $('#registerTab').classList.toggle('active',mode==='register');
  $('#nameWrap').classList.toggle('hidden',mode==='login');
  $('#authTitle').textContent=mode==='login'?'Giriş yap':'Ücretsiz hesap oluştur';
  $('#authSubmit').textContent=mode==='login'?'Giriş Yap':'Kayıt Ol';
  $('#password').autocomplete=mode==='login'?'current-password':'new-password';
}
$('#authOpen').addEventListener('click',()=>openAuth('user','login'));
$('#businessAuthOpen').addEventListener('click',()=>openAuth('business','login'));
$('#authClose').addEventListener('click',closeAuth);
$('#authModal').addEventListener('click',e=>{if(e.target.id==='authModal')closeAuth()});
$('#loginTab').addEventListener('click',()=>setMode('login'));
$('#registerTab').addEventListener('click',()=>setMode('register'));

async function requireUser(){
  if(state.session){ alert('Fırsat kodun oluşturuldu: BOSMASA25'); return; }
  openAuth('user','register');
  $('#authMessage').textContent='Kod almak için ücretsiz hesap oluşturmalısın.';
}

$('#authForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const msg=$('#authMessage'); msg.textContent='';
  if(!configured){ msg.textContent='Önce config.js dosyasına Supabase bilgilerini eklemelisin.'; return; }
  const email=$('#email').value.trim();
  const password=$('#password').value;
  const fullName=$('#fullName').value.trim();
  $('#authSubmit').disabled=true;
  try{
    if(state.mode==='register'){
      const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:fullName,role:state.role}}});
      if(error) throw error;
      msg.textContent=data.session?'Kayıt tamamlandı ve giriş yapıldı.':'Kayıt tamamlandı. E-postana gelen doğrulama bağlantısını aç.';
      if(data.session){ state.session=data.session; closeAuth(); await applySession(); }
    }else{
      const {data,error}=await sb.auth.signInWithPassword({email,password});
      if(error) throw error;
      state.session=data.session;
      const actualRole=data.user?.user_metadata?.role || 'user';
      if(state.role==='business' && actualRole!=='business'){
        await sb.auth.signOut(); state.session=null; throw new Error('Bu hesap işletme hesabı değil. İşletme kaydı oluşturmalısın.');
      }
      closeAuth(); await applySession();
    }
  }catch(err){ msg.textContent=translateError(err.message); }
  finally{$('#authSubmit').disabled=false;}
});

function translateError(m=''){
  if(m.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı. Kayıtlı değilsen Kayıt Ol sekmesini kullan.';
  if(m.includes('already registered')) return 'Bu e-posta zaten kayıtlı.';
  if(m.includes('Email not confirmed')) return 'Önce e-posta adresini doğrulamalısın.';
  return m || 'İşlem tamamlanamadı.';
}

async function applySession() {
  const user = state.session?.user;

  $('#authOpen').classList.toggle('hidden', !!user);
  $('#logoutBtn').classList.toggle('hidden', !user);

  const role = user?.user_metadata?.role || 'user';
  console.log("ROLE =", role);
  $('#accountBtn').classList.toggle(
    'hidden',
    !user || role === 'business'
  );

  $('#businessPanel').classList.toggle(
    'hidden',
    role !== 'business'
  );
}

$('#logoutBtn').addEventListener('click',async()=>{if(sb)await sb.auth.signOut();state.session=null;await applySession();showView('home')});

$('#campaignForm').addEventListener('submit',e=>{
  e.preventDefault();
  const title=$('#campaignTitle').value.trim(); const desc=$('#campaignDesc').value.trim(); const min=$('#campaignMinutes').value;
  $('#campaignList').insertAdjacentHTML('afterbegin',`<div class="mini-item"><strong>${title}</strong><br><span>${desc} · ${min} dakika</span></div>`);
  e.target.reset();
});

(async()=>{
  if(sb){
    const {data}=await sb.auth.getSession(); state.session=data.session; await applySession();
    sb.auth.onAuthStateChange((_event,session)=>{state.session=session;applySession()});
  } else {
    console.warn('Supabase yapılandırılmadı. config.js dosyasını doldurun.');
  }
  const accountBtn = document.querySelector('#accountBtn');
const accountModal = document.querySelector('#accountModal');
const accountClose = document.querySelector('#accountClose');

accountBtn?.addEventListener('click', async () => {
  const user = state.session?.user;
  if (!user) return;

  document.querySelector('#accountFullName').textContent =
    user.user_metadata?.full_name || '-';

  document.querySelector('#accountEmail').textContent =
    user.email || '-';

  document.querySelector('#accountRole').textContent =
    user.user_metadata?.role === 'business'
      ? 'İşletme'
      : 'Kullanıcı';

  accountModal.classList.remove('hidden');
});

accountClose?.addEventListener('click', () => {
  accountModal.classList.add('hidden');
});

document.querySelectorAll('.account-tab').forEach(tab => {
  tab.addEventListener('click', () => {

    document.querySelectorAll('.account-tab')
      .forEach(t => t.classList.remove('active'));

    tab.classList.add('active');

    document.querySelectorAll('.account-panel')
      .forEach(p => p.classList.remove('active'));

    const panel =
      document.querySelector('#' + tab.dataset.accountTab + 'Panel');

    panel?.classList.add('active');
  });
});
})();
