import React, {useEffect, useRef, useState} from 'react';

// Botanical study: curved, double-sided petals, modeled individually in space.
export default function FlowerSculpture(){
 const host=useRef(null),[ready,setReady]=useState(false);
 useEffect(()=>{
  const node=host.current;let disposed=false,cleanup=()=>{};
  const observer=new IntersectionObserver(async entries=>{
   if(!entries.some(e=>e.isIntersecting))return;
   observer.disconnect();
   try{
    const T=await import('three');if(disposed)return;
    const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
    node.appendChild(renderer.domElement);
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,60);
    camera.position.set(0,1.3,11);camera.lookAt(0,.35,0);
    scene.add(new T.HemisphereLight(0xfff3df,0x354932,2.6));
    const key=new T.DirectionalLight(0xffe5cf,4);key.position.set(-3,5,5);scene.add(key);
    const rim=new T.DirectionalLight(0xe3f5c7,3);rim.position.set(4,2,-3);scene.add(rim);
    const bouquet=new T.Group();scene.add(bouquet);
    const materials=[],geometries=[];
    const material=(color,roughness=.52)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness:0,side:T.DoubleSide});materials.push(m);return m};
    const greens=material('#526840'),leafMat=material('#738254'),heart=material('#c2a064'),seedMat=material('#41452b');
    const petalMats=['#f0d7c8','#e4b7ad','#eedec5'].map(c=>material(c));
    function mesh(g,m,parent){geometries.push(g);const o=new T.Mesh(g,m);parent.add(o);return o}
    function petal(length,width,cup){
     const g=new T.PlaneGeometry(1,1,16,22),p=g.attributes.position;
     for(let i=0;i<p.count;i++){
      const u=p.getX(i)*2,v=p.getY(i)+.5;
      const edge=Math.pow(Math.sin(Math.PI*v),.62);
      p.setXYZ(i,u*width*edge,v*length,cup*Math.pow(v,1.7)+.16*u*u*Math.sin(Math.PI*v)+.035*Math.sin(v*24+u*5)*v);
     }
     g.computeVertexNormals();return g;
    }
    function flower(x,y,z,scale,tilt,index){
     const plant=new T.Group();plant.position.set(x,y,z);plant.scale.setScalar(scale);bouquet.add(plant);
     const curve=new T.CatmullRomCurve3([new T.Vector3(-.35,-3.2,-.2),new T.Vector3(-.2,-1.5,0),new T.Vector3(0,0,0)]);
     mesh(new T.TubeGeometry(curve,32,.027,7,false),greens,plant);
     for(let j=0;j<2;j++){const leaf=mesh(petal(1.5,.23,.12),leafMat,plant);leaf.position.set(-.15,-1.5-j*.65,0);leaf.rotation.set(.4,0,j?1.1:-1.1)}
     const bloom=new T.Group();bloom.rotation.set(.28,tilt,.15);plant.add(bloom);
     for(let layer=0;layer<3;layer++){
      const n=layer===0?9:7;
      const geometry=petal(1.12-layer*.19,.62-layer*.09,.35+layer*.08);
      for(let i=0;i<n;i++){
       const pivot=new T.Group();pivot.rotation.z=i/n*Math.PI*2+layer*.43;pivot.position.z=layer*.09;bloom.add(pivot);
       const pet=mesh(geometry,petalMats[index],pivot);pet.rotation.x=.13+layer*.15;pet.position.y=.06;
      }
     }
     const center=mesh(new T.SphereGeometry(.19,24,16),heart,bloom);center.scale.z=.55;center.position.z=.38;
     const seedGeometry=new T.SphereGeometry(.028,6,5);
     for(let i=0;i<55;i++){
      const angle=i*2.39996,r=.17*Math.sqrt(i/55),seed=mesh(seedGeometry,seedMat,bloom);
      seed.position.set(Math.cos(angle)*r,Math.sin(angle)*r,.45+Math.sqrt(1-r/.2)*.045);
     }
     return plant;
    }
    const blooms=[flower(-1.38,.55,-.2,.88,-.38,1),flower(.35,1.25,.2,1.12,.1,0),flower(1.65,-.2,.1,.75,.5,2)];
    const media=matchMedia('(prefers-reduced-motion: reduce)');let active=true,frame=0,px=0,py=0,last=0;
    const resize=()=>{const {width,height}=node.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=width<600?13.5:10.6;camera.updateProjectionMatrix()};
    const ro=new ResizeObserver(resize);ro.observe(node);resize();
    const pointer=e=>{const r=node.getBoundingClientRect();px=((e.clientX-r.left)/r.width-.5)*.5;py=((e.clientY-r.top)/r.height-.5)*.2};
    const reset=()=>{px=0;py=0};node.addEventListener('pointermove',pointer);node.addEventListener('pointerleave',reset);
    function render(time){
     frame=0;if(disposed||!active||document.hidden)return;
     if(time-last>32){
      last=time;
      if(!media.matches){const r=node.getBoundingClientRect(),progress=Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/innerHeight));bouquet.rotation.y+=(px+progress*.24-bouquet.rotation.y)*.045;bouquet.rotation.x+=(-py-bouquet.rotation.x)*.045;blooms.forEach((b,i)=>{b.rotation.z=Math.sin(time*.0005+i*1.9)*.025});}
      renderer.render(scene,camera);
     }
     if(!media.matches)frame=requestAnimationFrame(render);
    }
    const resume=()=>{if(!frame)frame=requestAnimationFrame(render)};
    const visible=new IntersectionObserver(es=>{active=es[0].isIntersecting;if(active)resume();else{cancelAnimationFrame(frame);frame=0}});visible.observe(node);
    document.addEventListener('visibilitychange',resume);media.addEventListener('change',resume);resume();setReady(true);
    cleanup=()=>{cancelAnimationFrame(frame);visible.disconnect();ro.disconnect();node.removeEventListener('pointermove',pointer);node.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',resume);media.removeEventListener('change',resume);new Set(geometries).forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()};
   }catch{/* Photography remains visible when WebGL is unavailable. */}
  },{rootMargin:'300px'});observer.observe(node);
  return()=>{disposed=true;observer.disconnect();cleanup()};
 },[]);
 return <section className={'botanical-study '+(ready?'is-rendered':'')} aria-labelledby="sculpture-title"><div className="study-copy"><h2 id="sculpture-title">La belleza<br/>está en <em>cada<br/>pétalo.</em></h2><p>Una pausa para mirar más cerca.<br/>Formas orgánicas, luz y la delicadeza<br/>de lo que florece a su propio ritmo.</p><a className="text-link light" href="#coleccion">Encuentra tu flor <span aria-hidden="true">↗</span></a></div><div className="sculpture-stage" ref={host} role="img" aria-label="Escultura tridimensional de tres flores rosadas y marfil, con pétalos curvos y tallos verdes"><img className="sculpture-fallback" src="/images/bouquet-blush.webp" alt="" loading="lazy"/></div><div className="study-caption"><span>Un estudio de la naturaleza</span><span>{ready?'Flores digitales · Mueve el cursor y descubre sus formas':'Formas que florecen a su propio ritmo'}</span></div></section>;
}
