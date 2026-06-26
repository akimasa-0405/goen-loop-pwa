const header=document.querySelector('.header');
window.addEventListener('scroll',()=>{header?.classList.toggle('scrolled',window.scrollY>20)});
const splash=document.getElementById('splash');
window.addEventListener('load',()=>{if(splash){setTimeout(()=>splash.classList.add('hide'),800)}});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('show')})},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
