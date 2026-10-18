/* Local pixel aids and user-authored regions; no body recognition or health inference. */
(function(root){
 'use strict';
 const finite=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 const id=x=>typeof x==='string'&&x.length>0&&x.length<=160;
 const alignment=a=>a&&finite(a.x,-50,50)&&finite(a.y,-50,50)&&finite(a.scale,.5,2);
 function region(r){return r&&id(r.id)&&typeof r.label==='string'&&r.label.trim().length>0&&r.label.length<=80&&typeof r.note==='string'&&r.note.length<=500&&finite(r.x,0,100)&&finite(r.y,0,100)&&finite(r.width,2,100)&&finite(r.height,2,100)&&r.x+r.width<=100&&r.y+r.height<=100;}
 function validPairs(a){try{return Array.isArray(a)&&a.length<=100&&new Set(a.map(x=>x.earlierId)).size===a.length&&a.every(p=>p&&id(p.earlierId)&&alignment(p.alignmentA)&&alignment(p.alignmentB)&&Array.isArray(p.regions)&&p.regions.length<=30&&new Set(p.regions.map(r=>r.id)).size===p.regions.length&&p.regions.every(region));}catch{return false;}}
 function difference(a,b,width,height,threshold=30,block=8){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>1000000||a.length!==width*height*4||b.length!==a.length||!finite(threshold,5,150)||!Number.isInteger(block)||block<1||block>64)throw Error('Invalid pixel comparison.');
  const pixels=new Uint8ClampedArray(a.length);let changed=0,total=0;
  for(let y=0;y<height;y+=block)for(let x=0;x<width;x+=block){let sum=0,count=0;for(let yy=y;yy<Math.min(height,y+block);yy++)for(let xx=x;xx<Math.min(width,x+block);xx++){const i=(yy*width+xx)*4;sum+=(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]))/3;count++;}const score=sum/count,on=score>=threshold;total++;if(on)changed++;for(let yy=y;yy<Math.min(height,y+block);yy++)for(let xx=x;xx<Math.min(width,x+block);xx++){const i=(yy*width+xx)*4;pixels[i]=255;pixels[i+1]=160;pixels[i+2]=35;pixels[i+3]=on?Math.min(210,90+score):0;}}
  return {pixels,changedBlocks:changed,totalBlocks:total};
 }
 async function canvasFor(p,width=320,height=400){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{willReadFrequently:true}),bitmap=await createImageBitmap(p.blob);try{ctx.fillStyle='#071b18';ctx.fillRect(0,0,width,height);const scale=Math.min(width/bitmap.width,height/bitmap.height)*p.align.scale;ctx.translate(width/2+p.align.x/100*width,height/2+p.align.y/100*height);ctx.drawImage(bitmap,-bitmap.width*scale/2,-bitmap.height*scale/2,bitmap.width*scale,bitmap.height*scale);return canvas;}finally{bitmap.close();}}
 async function heatmap(a,b,threshold=30){const ca=await canvasFor(a),cb=await canvasFor(b),width=ca.width,height=ca.height,ctx=ca.getContext('2d'),r=difference(ctx.getImageData(0,0,width,height).data,cb.getContext('2d').getImageData(0,0,width,height).data,width,height,threshold);ctx.setTransform(1,0,0,1,0,0);ctx.putImageData(new ImageData(r.pixels,width,height),0,0);return {canvas:ca,changedBlocks:r.changedBlocks,totalBlocks:r.totalBlocks};}
 const api={region,validPairs,alignment,difference,canvasFor,heatmap};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroPhotoCompare=api;
})(typeof window!=='undefined'?window:globalThis);
