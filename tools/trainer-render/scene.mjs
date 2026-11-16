import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const scene=new THREE.Scene();scene.background=new THREE.Color('#edf1f0');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(800,600);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;document.body.append(renderer.domElement);
const camera=new THREE.PerspectiveCamera(36,800/600,.01,100);camera.position.set(3,1.5,3);camera.lookAt(0,1,0);
scene.add(new THREE.HemisphereLight(0xffffff,0x647770,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(2,4,3);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-3;light.shadow.camera.right=3;light.shadow.camera.top=3;light.shadow.camera.bottom=-3;scene.add(light);
const gltf=await new GLTFLoader().loadAsync('/trainer-source.glb');const actor=gltf.scene;scene.add(actor);const bones={};actor.traverse(n=>{if(n.isSkinnedMesh){n.skeleton.pose();n.material=new THREE.MeshStandardMaterial({color:'#aeb9b5',roughness:.65,metalness:.1});}if(n.isBone)bones[n.name]=n;});actor.updateMatrixWorld(true);
window.positions=()=>Object.fromEntries(Object.entries(bones).filter(([k])=>/root|spine|upperarm|lowerarm|upperleg|lowerleg|foot|neck|head/.test(k)).map(([k,n])=>[k,n.getWorldPosition(new THREE.Vector3()).toArray()]));
window.ready=true;window.actor=actor;window.bones=bones;window.THREE=THREE;window.render=()=>renderer.render(scene,camera);window.camera=camera;window.scene=scene;render();
const bind=Object.values(bones).map(b=>({b,p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));
function aim(name,d){const b=bones[name],desired=new THREE.Vector3(...d).normalize(),q=b.getWorldQuaternion(new THREE.Quaternion()),direction=new THREE.Vector3(0,1,0).applyQuaternion(q),turn=new THREE.Quaternion().setFromUnitVectors(direction,desired),world=turn.multiply(q);b.quaternion.copy(b.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(world));actor.updateMatrixWorld(true);}
const limb=(part,side,d)=>{for(const n of ['01','02'])aim(part+n+side,d);};
const axis=(degrees,x=0)=>{const t=degrees*Math.PI/180;return [x,-Math.cos(t),Math.sin(t)];};
actor.traverse(n=>{if(n.isMesh)n.castShadow=true;});
const mat=new THREE.Mesh(new THREE.BoxGeometry(.9,.035,2.2),new THREE.MeshStandardMaterial({color:'#244e46',roughness:1}));mat.receiveShadow=true;mat.position.set(0,0,0);scene.add(mat);
const anchor=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,1.7),new THREE.MeshStandardMaterial({color:'#47535b',roughness:.5}));anchor.position.set(0,.85,1.7);scene.add(anchor);
const bands=['L','R'].map(()=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,8),new THREE.MeshStandardMaterial({color:'#df6e29'}));scene.add(l);return l;});
window.pose=(id,phase=0,activeSide='L')=>{
 for(const {b,p,q,s} of bind){b.position.copy(p);b.quaternion.copy(q);b.scale.copy(s);}actor.rotation.set(0,0,0);actor.position.set(0,0,0);actor.updateMatrixWorld(true);
 anchor.visible=id==='band-row';bands.forEach(b=>b.visible=id==='band-row');mat.visible=id!=='band-row';
 for(const side of ['L','R']){limb('upperarm',side,axis(0,side==='L'?.04:-.04));limb('lowerarm',side,axis(0));}
 if(id==='leg-raise'||id==='dead-bug'){
  for(const side of ['L','R']){
   let angle=id==='leg-raise'?15+65*phase:90-(side===activeSide?70*phase:0),knee=id==='leg-raise'?3:90-(side===activeSide?75*phase:0);
   limb('upperleg',side,axis(angle));limb('lowerleg',side,axis(angle-knee));
   if(id==='dead-bug'){const arm=side!==activeSide?90+85*phase:90;limb('upperarm',side,axis(arm));limb('lowerarm',side,axis(arm-3));}
  }
  actor.rotation.x=-Math.PI/2;actor.position.set(0,.14,.85);camera.position.set(2.5,1.65,2.5);camera.lookAt(0,.3,0);
 }else if(id==='band-row'){
  for(const side of ['L','R']){limb('upperarm',side,axis(70-75*phase,side==='L'?.04:-.04));limb('lowerarm',side,axis(70+23*phase));}
  for(const b of Object.values(bones))if(/^finger[2-5]/.test(b.name))b.rotateX(.9);
  camera.position.set(2.6,1.6,3);camera.lookAt(0,.9,.4);
 }
 actor.updateMatrixWorld(true);
 for(let i=0;i<2;i++){const side=i?'R':'L',forearm=bones['lowerarm02'+side],child=forearm.children[0],hand=child.getWorldPosition(new THREE.Vector3()),anchorPoint=new THREE.Vector3(i?-.08:.08,1.2,1.7),direction=hand.clone().sub(anchorPoint);bands[i].position.copy(anchorPoint).add(hand).multiplyScalar(.5);bands[i].scale.y=direction.length();bands[i].quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());}
 render();
};
