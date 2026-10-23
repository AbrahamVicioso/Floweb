import {useEffect} from 'react';

export default function usePageMotion(){
 useEffect(()=>{
  const animations=new Set();
  const animate=(el,frames,options)=>{
   if(!el)return;
   const animation=el.animate(frames,{duration:650,easing:'cubic-bezier(.16,1,.3,1)',...options});
   animations.add(animation);animation.finished.then(()=>animations.delete(animation)).catch(()=>{});
  };
  const enter=()=>{
   animate(document.querySelector('.hero h1'),[{opacity:.45,transform:'translateY(18px)'},{opacity:1,transform:'none'}]);
   animate(document.querySelector('.hero-content>p'),[{opacity:.4},{opacity:1}],{duration:800});
   animate(document.querySelector('.hero-floral-cutout'),[{opacity:.4,clipPath:'inset(0 0 14% 0)'},{opacity:1,clipPath:'inset(0 0 0% 0)'}],{duration:1100});
  };
  if(document.querySelector('.site-opening'))window.addEventListener('floria:entered',enter,{once:true});else enter();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target;
   if(el.matches('.story-photo'))animate(el,[{clipPath:'inset(0 8% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:850});
   else animate(el,[{opacity:.45},{opacity:1}],{duration:600});
   observer.unobserve(el);
  }),{threshold:.15});
  document.querySelectorAll('.story-photo,.story-copy,.newsletter form').forEach(el=>observer.observe(el));
  const escape=e=>{if(e.key==='Escape')document.querySelector('.mobile-menu[aria-expanded="true"]')?.click()};
  document.addEventListener('keydown',escape);
  return()=>{observer.disconnect();animations.forEach(a=>a.cancel());window.removeEventListener('floria:entered',enter);document.removeEventListener('keydown',escape)};
 },[]);
}
