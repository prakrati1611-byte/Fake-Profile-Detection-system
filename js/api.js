/* ================= CONFIG & API LAYER =================
 * Set USE_MOCK=false and API_BASE to Paridhi's Flask/FastAPI URL to go live.
 * Expected endpoints (contract for backend):
 *  POST /analyze   {username,platform,followers,following,posts,age_days,bio,captions} -> {ml_score,llm:{verdict,flags,rationale},risk,features}
 *  GET  /profiles  -> [Profile]      GET /profiles/:id -> Profile      PATCH /profiles/:id {status}
 *  POST /batch     {usernames:[]} -> [Profile]
 *  POST /reports   {profile_id} -> {id,url}    GET /reports -> [Report]      GET /metrics -> model metrics
 *  POST /auth/login {email,password} -> {token}
 */
const CFG={USE_MOCK:true,API_BASE:localStorageGet('api')||'http://localhost:8000/api'};
function localStorageGet(k){try{return localStorage.getItem('fps_'+k)}catch(e){return null}}
function localStorageSet(k,v){try{localStorage.setItem('fps_'+k,v)}catch(e){}}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const cls=r=>r>=.7?'high':r>=.4?'med':'low', lbl=r=>r>=.7?'High':r>=.4?'Medium':'Low';
const col=r=>r>=.7?'var(--hi)':r>=.4?'var(--md)':'var(--lo)';
const pct=x=>Math.round(x*100)+'%';
const entropy=s=>{const m={};for(const c of s)m[c]=(m[c]||0)+1;return -Object.values(m).reduce((a,n)=>a+n/s.length*Math.log2(n/s.length),0)};
const SUS=['dm for','crypto','investment','giveaway','click link','guaranteed','earn $','whatsapp','official page','verify your','loan','forex'];
function scoreProfile(p){
  const ratio=p.followers/Math.max(p.following,1),digits=(p.username.match(/\d/g)||[]).length,ent=entropy(p.username);
  const f=[
    ['Follower/following ratio',ratio<.1?.9:ratio<.5?.5:.1],['Account age',p.age_days<30?.95:p.age_days<180?.45:.08],
    ['Posting frequency',p.posts<3?.7:p.posts>3000?.6:.15],['Username pattern',clamp(digits/6+(ent>3.4?.25:0))],
    ['Bio completeness',p.bio.length<8?.7:.15],['Engagement anomaly',p.followers>5000&&p.posts<10?.85:.2]];
  const ml=clamp(f.reduce((a,x)=>a+x[1],0)/f.length*1.15);
  const txt=(p.bio+' '+(p.captions||'')).toLowerCase(),flags=SUS.filter(k=>txt.includes(k));
  if(/official|ceo|police|bank|support/.test(txt)&&p.age_days<365)flags.push('possible impersonation');
  const llm=clamp(flags.length*.28+(/(hate|kill|nude|drugs)/.test(txt)?.4:0)+.05);
  return {ml,llm,risk:clamp(.6*ml+.4*llm),features:f,flags,
    verdict:llm>=.5?'Suspicious content detected':llm>=.25?'Minor concerns':'No harmful content found',
    rationale:flags.length?`Content contains indicators (${flags.join(', ')}) commonly associated with scams, spam or impersonation.`:'Bio and captions show no impersonation, spam or illegal-content cues.'};
}
const seed=[['luxe.deals.9921','Instagram',48,3900,2,6,'DM for guaranteed crypto investment returns 💸'],['ananya_verma','Instagram',1840,620,412,1460,'Photographer | Indore | Coffee addict'],
['official_sbi_help','Twitter/X',95,10,14,9,'Official support page. Click link to verify your account'],['rohit.k','Facebook',530,480,220,2100,'Engineer @ startup'],
['giveaway_king77','Instagram',15,7200,320,21,'Giveaway! WhatsApp us to earn $500 daily'],['meera.sharma','Twitter/X',980,850,3100,1900,'Reader. Runner. Chai > coffee.'],
['x8fj2kq_09','Twitter/X',3,410,0,4,''],['cyber.dost','Twitter/X',5200,300,890,1200,'Cyber awareness for everyone'],['loan_fast_now','Facebook',40,2600,25,18,'Instant loan, forex tips, DM for details'],
['dev.patel','Instagram',760,700,180,900,'Full-stack dev | Ahmedabad'],['ceo.tech.official','Instagram',210,15,6,25,'CEO official page – verify your account now'],['sneha_arts','Instagram',2200,540,640,1300,'Artist. Commissions open.']]
.map((a,i)=>{const p={id:i+1,username:a[0],platform:a[1],followers:a[2],following:a[3],posts:a[4],age_days:a[5],bio:a[6],captions:'',status:'Open',date:'2026-09-'+String(10+i).padStart(2,'0')};return Object.assign(p,scoreProfile(p))});
const DB={profiles:seed,reports:[],user:localStorageGet('user')};
const API={
 async analyze(p){if(CFG.USE_MOCK){await sleep(900);const o={...p,id:DB.profiles.length+1,status:'Open',date:new Date().toISOString().slice(0,10),...scoreProfile(p)};return o}
  return (await fetch(CFG.API_BASE+'/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})).json()},
 async batch(names){await sleep(1200);return names.map((u,i)=>{const r=Math.random();const p={id:DB.profiles.length+i+1,username:u,platform:'Instagram',followers:Math.round(Math.random()*(r>.5?300:5000)),following:Math.round(Math.random()*2500),posts:Math.round(Math.random()*(r>.5?8:800)),age_days:Math.round(Math.random()*(r>.5?40:1500)),bio:r>.7?'DM for crypto giveaway':'',captions:'',status:'Open',date:new Date().toISOString().slice(0,10)};return Object.assign(p,scoreProfile(p))})}
};
const sleep=t=>new Promise(r=>setTimeout(r,t));
function toast(m){const t=document.getElementById('toast');t.innerHTML=`<div class=toast>${m}</div>`;setTimeout(()=>t.innerHTML='',2600)}
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- Live-mode helpers: when CFG.USE_MOCK=false these call the real backend (see docs/API_CONTRACT.md) ---- */
async function http(method,path,body){
  const t=localStorageGet('token');
  const r=await fetch(CFG.API_BASE+path,{method,headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:body?JSON.stringify(body):undefined});
  if(!r.ok)throw new Error(method+' '+path+' failed: '+r.status);
  return r.json();
}
const _mockBatch=API.batch;
API.batch=async n=>CFG.USE_MOCK?_mockBatch(n):http('POST','/batch',{usernames:n});
API.profiles=async()=>CFG.USE_MOCK?DB.profiles:http('GET','/profiles');
API.updateStatus=async(id,status)=>CFG.USE_MOCK?null:http('PATCH','/profiles/'+id,{status});
API.metrics=async()=>CFG.USE_MOCK?null:http('GET','/metrics');
API.createReport=async id=>CFG.USE_MOCK?null:http('POST','/reports',{profile_id:id});
API.login=async(email,password)=>CFG.USE_MOCK?{token:'demo'}:http('POST','/auth/login',{email,password});
