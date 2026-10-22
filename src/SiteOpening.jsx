import React, {useEffect, useRef, useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import './site-opening.css';

const SESSION_KEY='floria-opening-seen';
function shouldOpen(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||location.hash||scrollY>80)return false;
 try{return sessionStorage.getItem(SESSION_KEY)!=='yes'}catch{return true}
}

export default function SiteOpening(){
 const [visible,setVisible]=useState(shouldOpen),root=useRef(null),dismiss=useRef(()=>{});
 useEffect(()=>{
  if(!visible)return;
  const el=root.current,media=matchMedia('(prefers-reduced-motion: reduce)'),animations=[];
  let finished=false,revealed=false;
  try{sessionStorage.setItem(SESSION_KEY,'yes')}catch{}
  const reveal=()=>{if(!revealed){revealed=true;window.dispatchEvent(new Event('floria:entered'))}};
  const finish=()=>{if(finished)return;finished=true;setVisible(false);reveal()};
  dismiss.current=finish;
  const animate=(node,keyframes,options)=>{
   const animation=node.animate(keyframes,{fill:'both',easing:'cubic-bezier(.16,1,.3,1)',...options});
   animations.push(animation);return animation;
  };
  const key=e=>{if(e.key==='Escape'||e.key==='Tab')finish()};
  const preference=()=>{if(media.matches)finish()};
  window.addEventListener('keydown',key,true);window.addEventListener('wheel',finish,{passive:true});window.addEventListener('touchstart',finish,{passive:true});
  media.addEventListener('change',preference);
  try{
   animate(el.querySelector('.opening-wordmark'),[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:450});
   el.querySelectorAll('.opening-photo').forEach((photo,i)=>animate(photo,[{opacity:0,clipPath:'inset(100% 0 0 0)',translate:'0 18px'},{opacity:1,clipPath:'inset(0% 0 0 0)',translate:'0 0'}],{duration:580,delay:60+i*85}));
   animate(el.querySelector('.opening-note'),[{opacity:0},{opacity:1}],{duration:350,delay:250});
   const exit=animate(el,[{clipPath:'inset(0 0 0% 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:500,delay:1050,easing:'cubic-bezier(.76,0,.24,1)'});
   exit.finished.then(finish).catch(()=>{});
  }catch{finish()}
  const handoff=setTimeout(reveal,1050),safety=setTimeout(finish,1800);
  return()=>{finished=true;dismiss.current=()=>{};clearTimeout(handoff);clearTimeout(safety);animations.forEach(a=>a.cancel());window.removeEventListener('keydown',key,true);window.removeEventListener('wheel',finish);window.removeEventListener('touchstart',finish);media.removeEventListener('change',preference)};
 },[visible]);
 if(!visible)return null;
 return <div className="site-opening" ref={root} role="region" aria-label="Bienvenida a Floria">
  <button className="opening-skip" onClick={()=>dismiss.current()}>Omitir introducción <ArrowUpRight size={16} aria-hidden="true"/></button>
  <div className="opening-composition" aria-hidden="true">
   <div className="opening-wordmark">floria<span>.</span></div>
   <div className="opening-gallery">
    <figure className="opening-photo opening-photo--left"><img src="/images/bouquet-sunflower.webp" width="1024" height="1536" alt="" fetchPriority="high" onError={()=>dismiss.current()}/></figure>
    <figure className="opening-photo opening-photo--center"><img src="/images/catalog-pastel-signature.webp" width="1054" height="1492" alt="" fetchPriority="high" onError={()=>dismiss.current()}/></figure>
    <figure className="opening-photo opening-photo--right"><img src="/images/bouquet-tulips.webp" width="1024" height="1536" alt="" fetchPriority="high" onError={()=>dismiss.current()}/></figure>
   </div>
   <p className="opening-note">Un gesto. Mil formas de sentir.</p>
  </div>
  <span className="opening-footnote" aria-hidden="true">Flores con intención.</span>
 </div>;
}
