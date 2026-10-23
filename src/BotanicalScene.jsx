import React, {useEffect, useRef} from 'react';
import {ArrowUpRight} from 'lucide-react';
import './botanical-scene.css';

export default function BotanicalScene(){
 const section=useRef(null);
 useEffect(()=>{
  const el=section.current;
  let visible=false,frame=0,dirty=true;
  const current={x:0,y:0,scroll:0,scale:1.035},target={...current};
  const stop=()=>{cancelAnimationFrame(frame);frame=0};
  const request=()=>{if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw)};
  function draw(){
   frame=0;
   if(!visible||document.hidden)return;
   if(dirty){
    const r=el.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
    target.scroll=(progress-.5)*48;target.scale=1.035+progress*.025;dirty=false;
   }
   let moving=false;
   for(const key of Object.keys(current)){
    const threshold=key==='scale'?.0001:.04;
    current[key]+=(target[key]-current[key])*.085;
    if(Math.abs(target[key]-current[key])>threshold)moving=true;else current[key]=target[key];
   }
   el.style.setProperty('--scene-x',`${current.x.toFixed(2)}px`);
   el.style.setProperty('--scene-y',`${(current.scroll+current.y).toFixed(2)}px`);
   el.style.setProperty('--scene-scale',current.scale.toFixed(4));
   if(moving)request();
  }
  const scroll=()=>{dirty=true;request()};
  const pointer=e=>{
   if(e.pointerType!=='mouse'||innerWidth<=760)return;
   const r=el.getBoundingClientRect();
   target.x=((e.clientX-r.left)/r.width-.5)*12;
   target.y=((e.clientY-r.top)/r.height-.5)*7;request();
  };
  const leave=()=>{target.x=0;target.y=0;request()};
  const visibility=()=>{if(document.hidden)stop();else scroll()};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)scroll();else stop()},{threshold:0});
  observer.observe(el);
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
  el.addEventListener('pointermove',pointer);el.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',visibility);
  return()=>{stop();observer.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);el.removeEventListener('pointermove',pointer);el.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility)};
 },[]);
 return <section className="botanical-scene" ref={section} aria-labelledby="botanical-scene-title">
  <picture className="botanical-scene__visual"><source media="(max-width:760px)" srcSet="/images/botanical-editorial-mobile.webp"/><img src="/images/botanical-editorial-desktop.webp" width="1672" height="941" alt="Rosas de jardín, dalias marfil y tulipanes entre ramas de eucalipto, iluminados suavemente sobre un fondo oliva" loading="lazy" decoding="async"/></picture>
  <div className="botanical-scene__shade"/>
  <div className="botanical-scene__copy"><h2 id="botanical-scene-title">Una pausa.<br/>Para <em>sentir.</em></h2><p>Acércate a lo bonito.<br/>A los pétalos, a los pequeños detalles.<br/>A ese gesto que lo dice todo.</p><a className="text-link light" href="#ocasiones">Encuentra tu próximo gesto <ArrowUpRight size={20}/></a></div>
  <div className="botanical-scene__caption">La naturaleza, a nuestro ritmo.</div>
 </section>;
}
