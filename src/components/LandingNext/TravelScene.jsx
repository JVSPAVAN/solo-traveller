import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Decorative scene: bounded geometry makes time and space O(1) per frame.
export default function TravelScene({ dark }) {
  const host = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false, cleanup;
    import('three').then(async THREE => {
      const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
      if (disposed) return;
      const el = host.current;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { setFailed(true); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
      camera.position.set(0, 1.4, 9.4); camera.lookAt(0, 0, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8170, 3));
      const light = new THREE.DirectionalLight(0xfff1df, 4); light.position.set(-3, 5, 5); scene.add(light);
      const ivory = new THREE.MeshStandardMaterial({ color: 0xeee4d5, roughness: .65 });
      const coral = new THREE.MeshStandardMaterial({ color: 0xfa4d4d, roughness: .38 });
      const land = new THREE.MeshStandardMaterial({ color: 0xcebea8, roughness: .9 });
      const group = new THREE.Group(); scene.add(group);
      const mesh = (geometry, material, parent, x=0,y=0,z=0) => {
        const object = new THREE.Mesh(geometry, material); object.position.set(x,y,z); parent.add(object); return object;
      };
      const box = (w,h,d,mat,parent,x,y,z) => mesh(new RoundedBoxGeometry(w,h,d,3,.08),mat,parent,x,y,z);
      const globe = new THREE.Group(); globe.position.set(-.45,.45,0); group.add(globe);
      mesh(new THREE.SphereGeometry(1.36,48,32),ivory,globe);
      // Stylized continent silhouettes lie on the sphere instead of a flat decal.
      const patches = [[[-.85,.65],[-.65,.95],[-.25,.85],[-.05,.6],[-.3,.35],[-.5,.2],[-.7,.4]], [[-.45,.12],[-.08,.05],[.08,-.2],[-.2,-.75],[-.4,-.5]], [[.22,.8],[.6,.9],[.95,.6],[.72,.35],[.38,.45]], [[.25,.3],[.64,.25],[.65,-.05],[.38,-.55],[.18,-.15]]];
      patches.forEach(points => {
        const shape = new THREE.Shape(points.map(p => new THREE.Vector2(...p)));
        const geo = new THREE.ShapeGeometry(shape,12), pos=geo.attributes.position;
        for(let i=0;i<pos.count;i++){ const x=pos.getX(i),y=pos.getY(i); pos.setZ(i,Math.sqrt(1.37**2-x*x-y*y)); }
        geo.computeVertexNormals(); mesh(geo,land,globe);
      });
      function pin(parent,x,y,z){
        mesh(new THREE.TorusGeometry(.095,.04,10,24),coral,parent,x,y+.1,z);
        const tip=mesh(new THREE.ConeGeometry(.10,.18,3),coral,parent,x,y-.025,z); tip.rotation.z=Math.PI;
      }
      pin(globe,-.92,.5,1.01); pin(globe,.75,.18,1.15);
      for(let i=0;i<22;i++){ const x=-.85+i*.073,y=.38-.35*Math.sin(i/21*Math.PI); const z=Math.sqrt(1.39**2-x*x-y*y); const dash=box(.043,.023,.018,coral,globe,x,y,z); dash.rotation.z=-.35*Math.cos(i/21*Math.PI); }
      const luggage=new THREE.Group(); luggage.position.set(1.45,-.45,.35); luggage.rotation.y=-.22; group.add(luggage);
      box(.94,1.35,.56,ivory,luggage,0,0,0);
      for(let i=-2;i<=2;i++) box(.035,1.04,.05,land,luggage,i*.15,0,.29);
      box(.5,.09,.12,coral,luggage,0,.91,0); box(.075,.2,.10,coral,luggage,-.22,.79,0); box(.075,.2,.10,coral,luggage,.22,.79,0);
      [-.32,.32].forEach(x => mesh(new THREE.SphereGeometry(.10,12,8),land,luggage,x,-.76,0));
      const map=new THREE.Group(); map.position.set(-.35,-1.1,1.1); map.rotation.x=-.65; map.rotation.z=-.12; group.add(map);
      for(let i=0;i<3;i++){ const panel=box(.64,.88,.035,ivory,map,(i-1)*.59,0,0); panel.rotation.y=i%2===0?.25:-.25; }
      for(let i=0;i<15;i++) box(.06,.02,.02,coral,map,-.8+i*.11,Math.sin(i*.5)*.15,.12);
      pin(map,.53,.15,.16);
      let visible=true, frame=0; const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
      const draw = time => { group.rotation.y=motion.matches?0:Math.sin(time*.0003)*.07; renderer.render(scene,camera); };
      const loop=time=>{ draw(time); if(visible&&!document.hidden&&!motion.matches) frame=requestAnimationFrame(loop); };
      const resume=()=>{ cancelAnimationFrame(frame); draw(0); if(visible&&!document.hidden&&!motion.matches) frame=requestAnimationFrame(loop); };
      const resize=new ResizeObserver(()=>{ const {width,height}=el.getBoundingClientRect(); if(!width||!height)return; renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw(0); }); resize.observe(el);
      const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();});observer.observe(el);
      motion.addEventListener('change',resume);document.addEventListener('visibilitychange',resume);
      cleanup=()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();motion.removeEventListener('change',resume);document.removeEventListener('visibilitychange',resume);scene.traverse(o=>{o.geometry?.dispose();});[ivory,coral,land].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{if(!disposed)setFailed(true);});
    return ()=>{disposed=true;cleanup?.();};
  }, []);
  return <div className={`ln-scene ${dark?'ln-scene-dark':''}`} role="img" aria-label="A globe, coral travel route, suitcase and folded map"><div ref={host} />{failed&&<div className="ln-scene-fallback"><i className="fa-solid fa-earth-americas"/><i className="fa-solid fa-suitcase-rolling"/><i className="fa-solid fa-map"/></div>}<span>A bigger<br/>world awaits.</span></div>;
}
TravelScene.propTypes={dark:PropTypes.bool};
