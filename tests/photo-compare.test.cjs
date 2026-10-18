const {test}=require('node:test'),a=require('node:assert/strict'),V=require('../photo-compare.js'),P=require('../photos.js');
const align={x:0,y:0,scale:1},region={id:'r',label:'Waist outline',note:'Lighting varies',x:25,y:30,width:30,height:20};
test('photo area identifiers validate bounds, duplicate IDs, future versions and legacy photos',()=>{
 const old={id:'p',at:'2026-10-17T12:00:00Z',view:'front',measurement:'',note:'',align,blob:new Blob(['fake'],{type:'image/jpeg'})};a.equal(P.valid(old),true);const pair={earlierId:'a',alignmentA:align,alignmentB:align,regions:[region]};a.equal(P.valid({...old,comparisonVersion:1,comparisons:[pair]}),true);
 for(const patch of [{comparisonVersion:2,comparisons:[pair]},{comparisonVersion:1,comparisons:[{...pair,regions:[{...region,x:95}]}]},{comparisonVersion:1,comparisons:[{...pair,regions:[region,region]}]},{comparisonVersion:1,comparisons:[null]},{revision:-1}])a.equal(P.valid({...old,...patch}),false);
 a.equal(V.region({...region,label:' '}),false);a.equal(V.region({...region,x:NaN}),false);
});
test('local difference map is transparent for identical pixels and highlights changed blocks only',()=>{
 const old=new Uint8ClampedArray(8*8*4).fill(255),next=old.slice();a.equal(V.difference(old,next,8,8,30,4).changedBlocks,0);for(let y=0;y<4;y++)for(let x=0;x<4;x++){const i=(y*8+x)*4;next[i]=next[i+1]=next[i+2]=0;}const r=V.difference(old,next,8,8,30,4);a.equal(r.changedBlocks,1);a.equal(r.totalBlocks,4);a.ok(r.pixels[3]>0);a.equal(r.pixels[(7*8+7)*4+3],0);a.deepEqual(old,new Uint8ClampedArray(8*8*4).fill(255));
});
test('difference threshold suppresses small differences and rejects invalid processing bounds',()=>{
 const a1=new Uint8ClampedArray([100,100,100,255]),b=new Uint8ClampedArray([110,110,110,255]);a.equal(V.difference(a1,b,1,1,5).changedBlocks,1);a.equal(V.difference(a1,b,1,1,30).changedBlocks,0);a.throws(()=>V.difference(a1,b,2,1));a.throws(()=>V.difference(a1,b,1,1,0));a.throws(()=>V.difference(a1,b,1,1,30,0));
});
