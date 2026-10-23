import React, {useEffect, useRef} from 'react';
import './floral-passage.css';

export default function FloralPassage(){
 const root=useRef(null);
 useEffect(()=>{
  const el=root.current,collection=el.closest('.collection');
  let frame=0,current=0,visible=false;
  const draw=()=>{
   frame=0;
   if(document.hidden)return;
   const top=collection.getBoundingClientRect().top;
   const target=Math.max(0,Math.min(1,(innerHeight*.65-top)/(innerHeight*.65)));
   current=current+(target-current)*.1;
   if(Math.abs(target-current)<.001)current=target;
   const sides=Math.max(0,Math.min(1,(current-.12)/.88));
   el.style.setProperty('--garden-opacity',current.toFixed(4));
   el.style.setProperty('--garden-drop',`${(-240*(1-current)).toFixed(2)}px`);
   el.style.setProperty('--corner-opacity',sides.toFixed(4));
   el.style.setProperty('--corner-x',`${((1-sides)*110).toFixed(2)}%`);
   el.style.setProperty('--corner-y',`${((1-sides)*28).toFixed(2)}px`);
   if(current!==target)frame=requestAnimationFrame(draw);
  };
  const update=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(draw)};
  const scroll=()=>{if(visible)update()};
  const observer=new IntersectionObserver(([entry])=>{
   visible=entry.isIntersecting;
   // Also reset on the return to the hero, including fast anchor navigation.
   update();
  });
  observer.observe(collection);
  window.addEventListener('scroll',scroll,{passive:true});
  window.addEventListener('resize',update);
  document.addEventListener('visibilitychange',update);
  update();
  return()=>{
   cancelAnimationFrame(frame);observer.disconnect();
   window.removeEventListener('scroll',scroll);
   window.removeEventListener('resize',update);
   document.removeEventListener('visibilitychange',update);
  };
 },[]);
 return <div className="floral-passage" ref={root} aria-hidden="true">
  <div className="floral-passage__viewport">
   <div className="floral-passage__corner floral-passage__corner--left"><img src="/images/opening-floral-shrub.png" width="1024" height="1536" alt="" decoding="async" onError={e=>{e.currentTarget.hidden=true}}/></div>
   <div className="floral-passage__corner floral-passage__corner--right"><img src="/images/opening-floral-shrub.png" width="1024" height="1536" alt="" decoding="async" onError={e=>{e.currentTarget.hidden=true}}/></div>
   <img className="floral-passage__hedge" src="/images/opening-floral-hedge.png" width="2048" height="692" alt="" decoding="async" onError={e=>{e.currentTarget.hidden=true}}/>
  </div>
 </div>;
}
