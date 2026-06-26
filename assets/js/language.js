function initialLang(){const saved=localStorage.getItem('goenLang'); if(saved) return saved; return navigator.language?.startsWith('ja')?'ja':'en'}
let currentLang=initialLang();
async function loadLanguage(lang){
  try{
    const res=await fetch(`data/${lang}.json`); const dict=await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(dict[key]) el.textContent=dict[key]});
    document.querySelectorAll('.language button').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
    document.documentElement.lang=lang; localStorage.setItem('goenLang',lang); currentLang=lang;
    window.dispatchEvent(new CustomEvent('languagechange',{detail:{lang}}));
  }catch(e){console.warn('language load failed',e)}
}
document.querySelectorAll('.language button').forEach(btn=>btn.addEventListener('click',()=>loadLanguage(btn.dataset.lang)));
loadLanguage(currentLang);
