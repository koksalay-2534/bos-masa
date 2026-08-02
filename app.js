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

function renderDeals(filter=''){
  const q=filter.toLocaleLowerCase('tr');
  const rows=deals.filter(d=>`${d.name} ${d.area} ${d.title}`.toLocaleLowerCase('tr').includes(q));
  $('#dealGrid').innerHTML=rows.map((d,i)=>`<article class="deal"><span class="badge">${d.minutes} dk kaldı</span><h3>${d.name}</h3><p>${d.title}</p><div class="deal-footer"><span>${d.area}</span><button class="primary small claim" data-id="${i}">Kodu Al</button></div></article>`).join('') || '<p>Aramana uygun fırsat bulunamadı.</p>';
  $$('.claim').forEach(b=>b.addEventListener('click',()=>requireUser()));
}
$('#searchInput').addEventListener('input',e=>renderDeals(e.target.value));
renderDeals();

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
