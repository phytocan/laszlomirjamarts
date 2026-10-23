let cats=Object.fromEntries(Object.entries(ART_CATALOG.albums).map(([id,album])=>[id,album.title])),pages={};
function albumContent(key){const a=ART_ALBUMS[key];return a.template.replace(/\{\{description:(\d+)\}\}/g,(_,i)=>a.descriptions[language][Number(i)]);}
let language=new URLSearchParams(location.search).get('lang');
if(!['hu','en'].includes(language)){try{language=localStorage.getItem('portfolio-language')}catch{} }
if(!['hu','en'].includes(language))language='hu';
if(location.hash==='#about/en'){language='en';history.replaceState(null,'',location.pathname+'?lang=en#about');}
const translations=Object.entries(ART_TRANSLATIONS).sort((a,b)=>b[0].length-a[0].length);
function tr(text){if(language==='hu')return text;for(const [hu,en] of translations)text=text.split(hu).join(en);return text;}
function translateTree(root){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(!node.parentElement.closest('script,style,[data-original-title]'))node.nodeValue=tr(node.nodeValue);}root.querySelectorAll('[alt],[aria-label],[title]').forEach(el=>{for(const attr of ['alt','aria-label','title'])if(el.hasAttribute(attr))el.setAttribute(attr,tr(el.getAttribute(attr)));});}
function updateChrome(){document.documentElement.lang=language;document.querySelector('.skip').textContent=tr('Ugrás a tartalomra');document.querySelector('.brand span').textContent=tr('MŰVÉSZETI PORTFÓLIÓ');
const nav=document.querySelector('header nav');nav.setAttribute('aria-label',tr('Fő navigáció'));nav.innerHTML=`<a href="#works">${tr('Alkotások')}</a><a href="#about">${tr('Rólam')}</a><a href="#contact">${tr('Kapcsolat')} ↗</a>`;
document.querySelector('footer span').textContent=tr('Festmények · Térbeli alkotások · Installációk');document.querySelector('footer>a:last-child').textContent=tr('Lépjünk kapcsolatba')+' ↗';
document.querySelector('#close-label').textContent=tr('Bezárás');document.querySelector('#close').setAttribute('aria-label',tr('Képnagyító bezárása'));document.querySelector('#previous').setAttribute('aria-label',tr('Előző kép'));document.querySelector('#next').setAttribute('aria-label',tr('Következő kép'));document.querySelector('#language-switch').setAttribute('aria-label',language==='en'?'Language':'Nyelv');
document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
document.querySelector('meta[name="description"]').content=language==='en'?'László Mirjam’s art portfolio. Paintings, sculptural works and installations in six albums.':'László Mirjam művészeti portfóliója. Festmények, térbeli alkotások és installációk hat albumban.';
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.language;try{localStorage.setItem('portfolio-language',language)}catch{}const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);render();}));
const main=document.querySelector('main'),viewer=document.querySelector('#viewer');
const imageRecords=ART_CATALOG.images;
const ART_WORKS=Object.fromEntries(Object.entries(imageRecords).map(([id,image])=>[id,ART_CATALOG.works[image.workId]]));
const covers=Object.keys(cats).map(key=>ART_CATALOG.albums[key].cover);
const descriptions=['Festmények és grafikák','Tájképek, 2017–2025','Festett és vetett árnyékok','Fényorgona · 2024','Installációk és festészet','Mintázás és figurális munkák'];
const asset=(key,size=640)=>imageRecords[key].variants[String(size)].src;
function imageSrcset(key){const choices=new Map();for(const v of Object.values(imageRecords[key].variants))choices.set(v.width,v.src);return [...choices].map(([width,src])=>src+' '+width+'w').join(', ');}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function img(key,alt,hero=false){const m=imageRecords[key];return `<img draggable="false" src="${asset(key,hero?1600:640)}" srcset="${imageSrcset(key)}" sizes="${hero?'(max-width:560px) 90vw, 50vw':'(max-width:560px) 90vw, 40vw'}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${hero?'fetchpriority="high"':'loading="lazy"'} decoding="async">`}
function cards(){return `<div class="categories">${Object.entries(cats).map(([k,v],i)=>`<a class="category" href="#portfolio/${k}">${covers[i]?img(covers[i],v):'<div class="album-cover-empty"><span>Nincs még kép</span></div>'}<h3>${v}<span aria-hidden="true">↗</span></h3><small>${descriptions[i]||'Üres album'}</small></a>`).join('')}</div>`}
function contact(){return `<div class="page-top"><span class="eyebrow">Beszélgessünk</span><h1>Kapcsolat</h1></div><section class="contact"><p>Egy alkotás megszólított? Kérdésed van a munkáimmal kapcsolatban? Írj e-mailt.</p><a class="email" href="mailto:laszlomirjamm@gmail.com">laszlomirjamm@gmail.com ↗</a></section>`}
let gallery=[],current=0,activeAlbum='';
function prepareGallery(){
 gallery=[];
 main.querySelectorAll('.content-page br').forEach(e=>e.replaceWith(document.createTextNode('\n')));
 main.querySelectorAll('.content-page [style]').forEach(e=>e.removeAttribute('style'));
 main.querySelectorAll('.content-page [onclick]').forEach(e=>e.removeAttribute('onclick'));
 main.querySelectorAll('.content-page img').forEach((old,i)=>{
  const key=old.getAttribute('data-image'),work=ART_WORKS[key];
  const title=work.title,details=tr(work.details),caption=[title,details].filter(Boolean).join(' · ');
  const b=document.createElement('button');b.className='art-button';b.setAttribute('aria-label',caption+' — '+tr('nagyítás'));b.innerHTML=img(key,caption);old.replaceWith(b);b.addEventListener('click',()=>openImage(i));
  const block=b.closest('.mindensemmi-item,.tajak-item');
  if(block){const label=block.querySelector('.project-description-per-image');label.innerHTML=`<p><span class="work-title" data-original-title lang="hu">${esc(title)}</span><span class="work-details">${esc(details)}</span></p>`;}
  gallery.push({key,title,details,caption});
 });
 const separate=main.querySelector('.emberalakok-descriptions');
 if(separate){const figures=main.querySelectorAll('.emberalakok-grid-2 .portfolio-item');separate.querySelectorAll('.project-description-per-image').forEach((p,i)=>figures[i]?.append(p));separate.remove();}
 main.querySelectorAll('.project-description').forEach(p=>{
  if(p.textContent.length<500)return;
  const sentences=p.textContent.trim().split(/(?<=[.!?])\s+/),groups=[];
  for(let i=0;i<sentences.length;i+=3)groups.push(sentences.slice(i,i+3).join(' '));
  const section=document.createElement('div');section.className='project-description project-prose';
  groups.forEach(text=>{const para=document.createElement('p');para.textContent=text;section.append(para);});p.replaceWith(section);
 });
}
let returnFocus=null,touchStart=null;
function updateImage(){
 const item=gallery[current],image=document.querySelector('#full-image'),status=document.querySelector('#image-status');
 viewer.classList.add('is-loading');status.textContent=tr('Kép betöltése…');
 image.src=asset(item.key,1600);image.alt=item.caption;
 viewer.setAttribute('aria-labelledby',item.title?'caption':'image-details');document.querySelector('#caption').textContent=item.title;document.querySelector('#caption').lang=ART_WORKS[item.key].title?'hu':language;
 document.querySelector('#image-details').textContent=item.details;
 document.querySelector('#counter').textContent=String(current+1).padStart(2,'0')+' / '+String(gallery.length).padStart(2,'0');
 document.querySelector('#viewer-hint').textContent=tr(matchMedia('(pointer:coarse)').matches?'Lapozz oldalra a következő képhez':'Lapozás: ← → · Bezárás: Esc');
 document.querySelector('#previous').disabled=document.querySelector('#next').disabled=gallery.length<2;
 document.querySelector('#share-status').textContent='';document.querySelector('#share-link').hidden=true;document.querySelector('#share-button').textContent=tr('Hivatkozás másolása');
 if(image.complete&&image.naturalWidth){viewer.classList.remove('is-loading');status.textContent='';}
}
function openImage(i,writeHistory=true){current=i;returnFocus=document.activeElement;updateImage();viewer.showModal();document.body.style.overflow='hidden';document.querySelector('#close').focus();if(writeHistory)writeImageRoute(false);updateMetadata(gallery[current].key);}
function step(n){if(gallery.length<2)return;current=(current+n+gallery.length)%gallery.length;updateImage();writeImageRoute(true);updateMetadata(gallery[current].key);}
document.querySelector('#full-image').addEventListener('load',()=>{viewer.classList.remove('is-loading');document.querySelector('#image-status').textContent='';});
document.querySelector('#full-image').addEventListener('error',()=>{viewer.classList.remove('is-loading');document.querySelector('#image-status').textContent=tr('A kép nem tölthető be. Próbálj másik képre lapozni.');});
document.querySelector('#close').onclick=closeViewer;viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
viewer.addEventListener('close',()=>{document.body.style.overflow='';touchStart=null;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
document.querySelector('#previous').onclick=()=>step(-1);document.querySelector('#next').onclick=()=>step(1);
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}});
const swipeArea=document.querySelector('.viewer-image-wrap');
swipeArea.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
swipeArea.addEventListener('touchmove',e=>{if(e.touches.length!==1)touchStart=null;},{passive:true});
swipeArea.addEventListener('touchcancel',()=>touchStart=null,{passive:true});
swipeArea.addEventListener('touchend',e=>{if(!touchStart||e.touches.length){touchStart=null;return;}const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1);},{passive:true});
function arrangeBiography(){const layout=main.querySelector('.about-layout');if(!layout)return;const cv=document.createElement('div');cv.className='cv-overview';layout.querySelectorAll('.cv-section').forEach(section=>cv.append(section));layout.after(cv);}
function render(){gallery=[];pages=Object.fromEntries(Object.keys(ART_ALBUMS).map(key=>[key,albumContent(key)]));updateChrome();if(viewer.open)viewer.close();const route=location.hash.slice(1).split('/art/'),hash=route[0],requestedImage=route[1];activeAlbum=hash.startsWith('portfolio/')?hash.slice(10):'';document.querySelectorAll('nav a').forEach(a=>{a.removeAttribute('aria-current');if(hash===a.hash.slice(1)||(hash==='about/en'&&a.hash==='#about')||(hash.startsWith('portfolio/')&&a.hash==='#works'))a.setAttribute('aria-current','page')});
if(!hash){document.title='László Mirjam — Művészeti portfólió';main.innerHTML=`<section class="hero"><div><span class="eyebrow">László Mirjam · Festészet és szobrászat</span><h1>László<br>Mirjam</h1><p>Festészet és szobrászat</p><a class="cta" href="#works">Fedezd fel az alkotásokat <span>↗</span></a></div><figure><a href="#portfolio/minden-semmi" aria-label="${language==='en'?'Fény — open the series':'Fény — a sorozat megnyitása'}">${img('mindensemmi-feny-2025','Fény, 2025, 250 × 150 cm, olajfesték',true)}</a><figcaption><span>Fény, 2025</span><span>Olajfesték · 250 × 150 cm</span></figcaption></figure></section><section class="section"><div class="section-head"><div><span class="eyebrow">A portfólió</span><h2>Alkotások</h2></div></div>${cards()}</section>`}
else if(hash==='works'){document.title='Alkotások — László Mirjam';main.innerHTML=`<div class="page-top"><span class="eyebrow">A portfólió</span><h1>Alkotások</h1><p>Válassz egy albumot, és fedezd fel a műveket.</p></div>${cards()}`}
else if(hash.startsWith('portfolio/')&&pages[hash.slice(10)]){const key=hash.slice(10);document.title=cats[key]+' — László Mirjam';main.innerHTML=`<div class="page-top"><a class="back" href="#works">← Összes témakör</a><span class="eyebrow">Alkotások</span><h1>${cats[key]}</h1></div><nav class="filters" aria-label="Témakörök">${Object.entries(cats).map(([k,v])=>`<a href="#portfolio/${k}" ${key===k?'aria-current="page"':''}>${v}</a>`).join('')}</nav>${pages[key]}<section class="section"><h2>Megszólított egy alkotás?</h2><a class="text-link" href="#contact">Írj nekem ↗</a></section>`;prepareGallery()}
else if(hash==='about'){document.title='Rólam — László Mirjam';main.innerHTML=`<div class="page-top"><span class="eyebrow">László Mirjam</span><h1>Rólam</h1></div><section class="about-layout"><figure>${img('mindensemmi-teremtes-ereje-2020','Teremtés ereje, 2020, 70 × 50 cm, olajfesték, akril')}<figcaption class="note">Teremtés ereje, 2020 · 70 × 50 cm · olajfesték, akril</figcaption></figure><div>${ART_BIO[language]}<a class="text-link" href="#contact">Kapcsolat ↗</a></div></section>`}
else if(hash==='contact'){document.title='Kapcsolat — László Mirjam';main.innerHTML=contact();}
else{main.innerHTML='<div class="page-top"><h1>Ez a témakör nem elérhető.</h1><a class="text-link" href="#works">Vissza az alkotásokhoz</a></div>'}
arrangeBiography();translateTree(main);document.title=tr(document.title);window.scrollTo(0,0);if(hash)main.focus({preventScroll:true});updateMetadata();if(requestedImage){const i=gallery.findIndex(item=>item.key===requestedImage);if(i>=0)openImage(i,false);}}

function writeImageRoute(replace){if(!activeAlbum)return;const url=new URL(location.href);url.hash='portfolio/'+activeAlbum+'/art/'+gallery[current].key;history[replace?'replaceState':'pushState'](null,'',url);}
function closeViewer(){viewer.close();const url=new URL(location.href);url.hash='portfolio/'+activeAlbum;history.replaceState(null,'',url);document.title=(cats[activeAlbum]||tr('Alkotások'))+' — László Mirjam';updateMetadata();}
function sharingUrl(){const url=new URL('art/'+gallery[current].key+'.html',location.href);url.searchParams.set('lang',language);url.hash='';return url.href;}
document.querySelector('#share-button').addEventListener('click',async()=>{const field=document.querySelector('#share-link'),status=document.querySelector('#share-status');const url=sharingUrl();field.value=url;field.hidden=false;field.focus();field.select();if(location.protocol==='file:'){status.textContent=tr('Ez helyi hivatkozás; másoknak az éles weboldalról lesz megosztható.');return;}try{await navigator.clipboard.writeText(url);status.textContent=tr('Hivatkozás másolva.');}catch{status.textContent=tr('Másold ki a kijelölt hivatkozást.');}});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView({block:'start'});});
function updateMetadata(imageId){
 const selected=imageId&&imageRecords[imageId]?imageId:(ART_CATALOG.albums[activeAlbum]?.cover||covers[0]);
 const work=ART_WORKS[selected];if(imageId)document.title=[work.title, 'László Mirjam'].filter(Boolean).join(' — ');
 const description=imageId?[work.title,tr(work.details)].filter(Boolean).join(' · '):[cats[activeAlbum],document.querySelector('meta[name="description"]').content].filter(Boolean).join(' — ');
 const set=(key,value)=>document.querySelector('meta[property="'+key+'"]').setAttribute('content',value);
 set('og:title',document.title);set('og:description',description);set('og:locale',language==='en'?'en_GB':'hu_HU');
 if(/^https?:$/.test(location.protocol)){set('og:image',new URL(asset(selected,1600),location.href).href);set('og:url',location.href);}
}
window.addEventListener('hashchange',render);render();



// Discourage casual saving without interfering with gallery keyboard controls.
function isArtworkTarget(target){return target instanceof Element && Boolean(target.closest('img, .art-button, .category, .hero figure, .about-layout figure'));}
document.addEventListener('contextmenu',event=>{if(isArtworkTarget(event.target))event.preventDefault();});
document.addEventListener('dragstart',event=>{if(isArtworkTarget(event.target))event.preventDefault();});

