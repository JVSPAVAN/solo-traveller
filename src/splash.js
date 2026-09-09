import './splash.css';
const splash=document.getElementById('brand-splash');
if(splash){
const root=document.getElementById('root');
root.inert=true;
splash.innerHTML='<div class="stage"><svg viewBox="0 0 640 640" fill="none"><defs><clipPath id="earthClip"><circle cx="320" cy="320" r="170"/></clipPath><path id="pin" fill-rule="evenodd" d="M96 0C96 50 37 125 11 155C5 162-5 162-11 155C-37 125-96 50-96 0C-96-53-53-96 0-96C53-96 96-53 96 0ZM32 0A32 32 0 1 0-32 0A32 32 0 1 0 32 0Z"/><radialGradient id="ocean" cx="32%" cy="28%" r="75%"><stop stop-color="#fffaf5"/><stop offset=".65" stop-color="#f6e6de"/><stop offset="1" stop-color="#d8b8ad"/></radialGradient><radialGradient id="shade" cx="28%" cy="25%" r="80%"><stop offset=".55" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#77473d" stop-opacity=".24"/></radialGradient>\n<mask id="markerPadding" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="640"><rect width="640" height="640" fill="white"/><g fill="black" stroke="black" stroke-width="40" stroke-linejoin="round"><use href="#pin" transform="translate(480 160)"/><use href="#pin" transform="translate(160 416)"/></g></mask>\n<g id="land" fill="#f05c5c"><path d="M30 130L68 109L94 80L130 69L157 92L145 111L170 127L162 147L137 151L127 172L112 192L98 194L104 215L88 224L70 205L60 178L43 164Z M104 218L130 227L155 240L165 267L144 293L135 323L116 345L103 321L100 282L89 252Z M187 73L216 64L233 81L217 104L200 115Z M259 145L283 123L300 124L313 109L338 111L355 88L388 89L400 111L437 104L469 127L483 152L465 169L441 161L428 181L411 178L408 207L393 223L381 195L361 198L348 177L331 181L317 166L296 169L280 162Z M272 170L300 163L327 176L346 210L336 236L316 265L300 286L279 271L268 240L249 207L251 185Z M354 258L363 271L356 296L347 293Z M426 283L458 270L480 282L493 310L471 327L444 320L422 327L408 311Z M414 222L424 236L447 242L465 250L468 260L435 256Z"/></g></defs>\n<g id="globe"><circle cx="320" cy="320" r="170" fill="#f05c5c"/><g clip-path="url(#earthClip)"><g id="continents" fill="white">\n<path d="M159 218C177 199 182 178 213 171C234 163 246 175 265 170C281 164 302 172 307 186C311 197 295 206 284 212C281 222 296 228 301 238C307 251 291 261 278 264C266 267 263 282 251 285C241 289 235 278 226 283C218 290 223 300 229 309L243 323C249 333 241 343 233 336L208 312C193 300 180 299 174 283C168 267 181 259 174 246C168 237 155 234 159 218Z"/>\n<path d="M246 334C258 321 279 329 290 337C305 347 326 346 337 358C348 371 338 389 328 397C317 408 319 425 307 437C296 448 293 464 280 471C272 475 269 462 270 452C271 436 256 429 255 414C253 399 264 390 257 378C249 365 236 348 246 334Z"/>\n<path d="M298 154C310 141 336 149 345 160C353 172 337 185 328 198C320 209 307 205 302 195C296 181 288 165 298 154Z"/>\n<path d="M435 212C450 198 468 204 483 214L502 270C480 274 470 268 463 256C455 244 443 253 434 243C425 234 426 223 435 212Z"/>\n</g></g></g>\n<g id="flightScene"><g id="clouds" fill="white" stroke="#f05c5c" stroke-width="8" stroke-linejoin="round"><path d="M395 213C380 215 375 195 391 189C390 166 424 163 433 183C456 179 466 211 443 213Z"/><path d="M192 428C177 428 172 410 188 402C190 375 226 373 235 397C258 392 270 429 245 429Z"/></g><g id="flight" fill="#f05c5c" stroke="#f05c5c" stroke-width="12" stroke-linejoin="round"><path d="M-124-19H-37L-90-87H-48L36-19H105Q137-19 143 5Q147 24 117 24H32L-57 98H-99L-40 24H-110L-144-50H-115L-91-19Z"/></g><g id="trails" stroke="#f05c5c" stroke-width="8" stroke-linecap="round"><path d="M118 264H166M96 264H100M95 354H147"/></g></g>\n<g id="start" fill="#f05c5c"><use href="#pin"/></g>\n<path id="route" d="M480 288H384C348.65 288 320 316.65 320 352S348.65 416 384 416H480C515.35 416 544 444.65 544 480S515.35 544 480 544H160" stroke="#f05c5c" stroke-width="64" stroke-linecap="butt" stroke-linejoin="round" mask="url(#markerPadding)" pathLength="1"/>\n<g id="end" fill="#f05c5c"><use href="#pin"/></g>\n</svg><div class="wordmark-wrap"><div id="wordmark" aria-label="SoloTraveller"><span style="visibility:hidden">S</span><span style="visibility:hidden">o</span><span style="visibility:hidden">l</span><span style="visibility:hidden">o</span><span style="visibility:hidden">T</span><span style="visibility:hidden">r</span><span style="visibility:hidden">a</span><span style="visibility:hidden">v</span><span style="visibility:hidden">e</span><span style="visibility:hidden">l</span><span style="visibility:hidden">l</span><span style="visibility:hidden">e</span><span style="visibility:hidden">r</span></div><svg class="car" id="car" viewBox="0 0 96 52" aria-hidden="true"><path d="M7 34V19Q7 15 12 15H27L38 5H59L72 20L87 23Q92 24 92 29V37H7Z" fill="#f05c5c"/><path d="M32 17 41 8H48V17ZM52 8H58L66 18H52Z" fill="white"/><path d="M69 22H86" stroke="#d44649" stroke-width="2"/><path d="M85 25h7v5h-7z" fill="#fff2ba"/><path d="M7 23h5v7H7z" fill="#ae2c38"/><path d="M91 33h3M5 33h5" stroke="#d44649" stroke-width="3"/><path d="M53 22h5" stroke="white" stroke-width="2"/><g id="wheel1"><circle r="10" fill="#f05c5c" stroke="white" stroke-width="3"/><path d="M-4 0H4M0-4V4" stroke="white" stroke-width="2"/></g><g id="wheel2"><circle r="10" fill="#f05c5c" stroke="white" stroke-width="3"/><path d="M-4 0H4M0-4V4" stroke="white" stroke-width="2"/></g></svg></div></div>'+ '<button class="splash-skip" type="button">Skip animation</button>';

const $=id=>document.getElementById(id),clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*x*(x*(6*x-15)+10)},lerp=(a,b,t)=>a+(b-a)*t;
const spring=x=>{x=clamp(x);return x===1?1:1-Math.exp(-7*x)*Math.cos(9*x)};
// A fixed vector scene uses O(1) time and space per frame; no raster scaling.
const draw=t=>{
 const enter=ease(t/.65),exit=ease((t-1.65)/.8);
 $('globe').style.opacity=enter*(1-exit);
 $('globe').setAttribute('transform',`translate(${320+exit*35} ${320-exit*18}) scale(${lerp(.82,1,enter)*(1-exit*.12)}) translate(-320 -320)`);
 $('continents').setAttribute('transform',`translate(${28-t*32} 0)`);
 const f=clamp((t-1.6)/1.65),flightIn=ease((t-1.6)/.4),flightOut=ease((t-2.95)/.4);
 $('flightScene').style.opacity=flightIn*(1-flightOut);
 $('flight').setAttribute('transform',`translate(${310+f*18} 315) scale(.78)`);
 $('clouds').setAttribute('transform',`translate(${-f*100} 0)`);
 $('trails').setAttribute('transform',`translate(${-f*28} 0)`);
 const a=spring((t-2.92)/.75),alpha=ease((t-2.92)/.3);
 $('start').setAttribute('transform',`translate(480 ${160+(1-a)*22}) scale(${a})`);$('start').style.opacity=alpha;
 // The same expanded marker silhouette clips both route ends, creating equal contour padding.
 const progress=ease((t-3.3)/2.6);
 $('route').style.strokeDasharray='1';$('route').style.strokeDashoffset=1-progress;$('route').style.opacity=ease((t-3.3)/.18);
 const b=spring((t-5.7)/.8);$('end').setAttribute('transform',`translate(160 ${416+(1-b)*24}) scale(${b})`);$('end').style.opacity=ease((t-5.7)/.24);
 // Solo appears together; each trailing letter appears only after the car passes it.
 const letters=Array.from($('wordmark').children),bounds={left:0,width:$('wordmark').offsetWidth};
 const soloRight=letters[3].offsetLeft+letters[3].offsetWidth;
 const drive=clamp((t-7.15)/2.4),distance=bounds.width-soloRight+16;
 const carX=soloRight-4+distance*drive;
 letters.forEach((letter,i)=>{const edge=letter.offsetLeft+letter.offsetWidth;letter.style.visibility=t>=6.7&&(i<4||(t>=7.15&&edge<carX-5))?'visible':'hidden';});
 const carVisible=ease((t-7.0)/.2)*(1-ease((t-9.52)/.4));
 $('car').style.opacity=carVisible;
 $('car').style.transform=`translateX(${carX}px)`;
 $('wheel1').setAttribute('transform',`translate(25 37) rotate(${drive*1080})`);
 $('wheel2').setAttribute('transform',`translate(73 37) rotate(${drive*1080})`);
 
};
let frame, done=false, ready=false, removed=false;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
function remove(){
 if(removed || !done || !ready)return;
 removed=true; cancelAnimationFrame(frame); clearTimeout(failsafe);
 window.removeEventListener('solo-app-ready',appReady);
 motion.removeEventListener('change',reduceMotion); resize.disconnect();
 root.inert=false; splash.classList.add('fade-out');
 setTimeout(()=>splash.remove(),450);
}
function appReady(){ready=true;remove();}
function reduceMotion(){if(motion.matches){draw(10.3);done=true;remove();}}
const resize=new ResizeObserver(()=>{
 const scale=Math.min(1,(splash.clientWidth-32)/640,(splash.clientHeight-110)/490);
 splash.querySelector('.stage').style.transform=`translate(-50%,-50%) scale(${Math.max(.2,scale)})`;
});
resize.observe(splash);
window.addEventListener('solo-app-ready',appReady);
motion.addEventListener('change',reduceMotion);
splash.querySelector('button').addEventListener('click',()=>{done=true;remove();});
// Bounded startup: a failed app mount must never leave an unskippable overlay.
const failsafe=setTimeout(()=>{ready=true;done=true;remove();},15000);
const startTime=performance.now();
function tick(now){
 if(removed)return;
 const t=(now-startTime)/1000;
 draw(Math.min(t,10.5));
 if(t>=10.5){done=true;remove();}else frame=requestAnimationFrame(tick);
}
draw(0);
if(motion.matches){draw(10.3);done=true;}else frame=requestAnimationFrame(tick);
}
