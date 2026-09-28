/* ================= ROUTER ================= */
function route(){const h=(location.hash||'#/').slice(2).split('/'),k=h[0];let html;
 const pg=pages[k];
 if(k=='profile')html=DB.user?detail(h[1]):null;else if(k=='report')html=DB.user?reportView(h[1]):null;else if(pg)html=(pg.pub||DB.user)?pg.html():null;else{location.hash='#/';return}
 if(html===null){location.hash='#/login';return}
 $('#app').innerHTML=html;window.scrollTo(0,0)}
document.documentElement.dataset.theme=localStorageGet('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
window.addEventListener('hashchange',route);route();
