import React, { useId } from 'react';
export default function Logo({width='40px',height='40px',color='#f05c5c',className=''}) {
 const id=useId();
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={width} height={height} className={className} aria-hidden="true" focusable="false">
 <defs><path id={id+'pin'} fillRule="evenodd" d="M96 0C96 50 37 125 11 155C5 162-5 162-11 155C-37 125-96 50-96 0C-96-53-53-96 0-96C53-96 96-53 96 0ZM32 0A32 32 0 1 0-32 0A32 32 0 1 0 32 0Z"/><mask id={id+'padding'} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="640"><rect width="640" height="640" fill="white"/><g fill="black" stroke="black" strokeWidth="40" strokeLinejoin="round"><use href={'#'+id+'pin'} transform="translate(480 160)"/><use href={'#'+id+'pin'} transform="translate(160 416)"/></g></mask></defs>
 <path d="M480 288H384C348.65 288 320 316.65 320 352S348.65 416 384 416H480C515.35 416 544 444.65 544 480S515.35 544 480 544H160" fill="none" stroke={color} strokeWidth="64" strokeLinecap="butt" strokeLinejoin="round" mask={'url(#'+id+'padding)'}/>
 <g fill={color}><use href={'#'+id+'pin'} transform="translate(480 160)"/><use href={'#'+id+'pin'} transform="translate(160 416)"/></g></svg>;
}
