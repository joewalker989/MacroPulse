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
// Whole-catalogue poses. Existing three exercises above keep their inspected motion.
const initial=Object.fromEntries(Object.entries(bones).map(([name,b])=>[name,b.getWorldQuaternion(new THREE.Quaternion())]));
const props=new Map(),floorColor='#dce4e0';
function mesh(name,shape,color){if(!props.has(name)){const m=new THREE.Mesh(shape(),new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.12}));m.castShadow=true;m.receiveShadow=true;scene.add(m);props.set(name,m);}const m=props.get(name);m.visible=true;return m;}
function box(name,p,size,color='#354a50'){const m=mesh(name,()=>new THREE.BoxGeometry(1,1,1),color);m.position.set(...p);m.scale.set(...size);m.quaternion.identity();return m;}
function rod(name,a,b,r=.015,color='#45545b'){const m=mesh(name,()=>new THREE.CylinderGeometry(1,1,1,12),color),u=new THREE.Vector3(...a),v=new THREE.Vector3(...b),d=v.clone().sub(u);m.position.copy(u).add(v).multiplyScalar(.5);m.scale.set(r,d.length(),r);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
const wp=name=>bones[name].getWorldPosition(new THREE.Vector3());
function worldRotation(name,q){const b=bones[name];b.quaternion.copy(b.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(q));actor.updateMatrixWorld(true);}
function inverseLimb(part,side,target,pole){const first=part==='leg'?'upperleg':'upperarm',second=part==='leg'?'lowerleg':'lowerarm',end=part==='leg'?'foot':bones[second+'02'+side].children[0].name;
 const h=wp(first+'01'+side),k=wp(second+'01'+side),f=wp(end+ (part==='leg'?side:'')),l1=h.distanceTo(k),l2=k.distanceTo(f),goal=new THREE.Vector3(...target),u=goal.clone().sub(h),d=Math.min(u.length(),l1+l2-.001);u.normalize();const p=new THREE.Vector3(...pole),v=p.sub(u.clone().multiplyScalar(p.dot(u))).normalize(),a=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-a*a)),knee=h.clone().addScaledVector(u,a).addScaledVector(v,height);limb(first,side,knee.clone().sub(h).toArray());limb(second,side,goal.clone().sub(wp(second+'01'+side)).toArray());}
function torso(degrees){const t=degrees*Math.PI/180;for(const name of ['spine05','spine04','spine03','spine02','spine01'])aim(name,[0,Math.cos(t),Math.sin(t)]);}
function planted(){const feet=['L','R'].map(s=>wp('foot'+s));actor.position.y+=.0706292649-(feet[0].y+feet[1].y)/2;actor.position.z+=.0148932915-(feet[0].z+feet[1].z)/2;actor.updateMatrixWorld(true);}
function palm(side){const b=bones['lowerarm02'+side],w=b.children[0].getWorldPosition(new THREE.Vector3()),elbow=wp('lowerarm01'+side);return w.add(w.clone().sub(elbow).normalize().multiplyScalar(.045));}
function weight(side){const p=palm(side);rod('db-bar'+side,[p.x-.1,p.y,p.z],[p.x+.1,p.y,p.z],.012,'#606d73');for(const x of [-.09,.09])rod('db-plate'+side+x,[p.x+x-.018,p.y,p.z],[p.x+x+.018,p.y,p.z],.06,'#28343c');}
function grip(){for(const b of Object.values(bones))if(/^finger[2-5]/.test(b.name))b.rotateX(.9);actor.updateMatrixWorld(true);}
function proneContacts(support){const contacts=['L','R'].map(s=>wp(support==='elbow'?'lowerarm01'+s:bones['lowerarm02'+s].children[0].name)),feet=['L','R'].map(s=>wp('toe1-1'+s)),h=contacts[0].clone().add(contacts[1]).multiplyScalar(.5),f=feet[0].clone().add(feet[1]).multiplyScalar(.5),angle=Math.atan2(h.y-f.y,h.z-f.z);actor.rotateX(angle);actor.updateMatrixWorld(true);actor.position.y+=.04-(wp('toe1-1L').y+wp('toe1-1R').y)/2;actor.position.z=-.8;actor.updateMatrixWorld(true);}
const threePose=window.pose;
window.pose=(id,phase=0,activeSide='L',time=0)=>{
 props.forEach(m=>m.visible=false);
 if(['leg-raise','dead-bug','band-row'].includes(id)){threePose(id,phase,activeSide);return;}
 for(const {b,p,q,s} of bind){b.position.copy(p);b.quaternion.copy(q);b.scale.copy(s);}actor.rotation.set(0,0,0);actor.position.set(0,0,0);actor.updateMatrixWorld(true);anchor.visible=false;bands.forEach(m=>m.visible=false);mat.visible=false;
 box('floor',[0,-.04,0],[3,.04,3],floorColor);
 for(const side of ['L','R']){limb('upperarm',side,axis(0,side==='L'?.04:-.04));limb('lowerarm',side,axis(0));}
 const squatIds=['squat','band-squat','barbell-squat'];
 if(squatIds.includes(id)||id==='rdl'){
  const hinge=id==='rdl';for(const side of ['L','R']){limb('upperleg',side,axis((hinge?17:65)*phase,side==='L'?.1:-.1));limb('lowerleg',side,axis(-(hinge?12:30)*phase));worldRotation('foot'+side,initial['foot'+side]);}torso((hinge?55:24)*phase);planted();
  for(const side of ['L','R']){if(id==='rdl'){limb('upperarm',side,axis(0));limb('lowerarm',side,axis(0));}if(id==='squat'){limb('upperarm',side,axis(70));limb('lowerarm',side,axis(80));}if(id==='band-squat'){limb('upperarm',side,axis(0));limb('lowerarm',side,axis(155));}}
 }else if(id==='lunge'){
  actor.position.set(0,-.4*phase,-.2*phase);actor.updateMatrixWorld(true);
  for(const side of ['L','R']){const back=side===activeSide;inverseLimb('leg',side,[side==='L'?.16:-.16,back?.07+.13*phase:.07,back?.16-.81*phase:.16],[0,0,1]);worldRotation('foot'+side,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),back?phase*.8:0).multiply(initial['foot'+side]));}
 }else if(['floor-press','bench-press','bridge','crunch'].includes(id)){
  if(id==='crunch')torso(25*phase);
  for(const side of ['L','R']){if(id.includes('press')){limb('upperarm',side,[side==='L'?.8*(1-phase):-.8*(1-phase),-.2*(1-phase),.12+.88*phase]);limb('lowerarm',side,[0,0,1]);}if(id==='crunch'){limb('upperarm',side,[side==='L'?.5:-.5,-.5,.3]);limb('lowerarm',side,[side==='L'?-.8:.8,.5,.2]);}}
  actor.rotation.x=-Math.PI/2-(id==='bridge'?.38*phase:0);actor.position.set(0,(id==='bench-press'?.59:.14)+(id==='bridge'?.28*phase:0),.85);actor.updateMatrixWorld(true);
  if(id==='bridge'){actor.position.y+=.085+.3*phase-wp('root').y;actor.updateMatrixWorld(true);for(const side of ['L','R']){limb('upperarm',side,[side==='L'?.05:-.05,-.1,1]);limb('lowerarm',side,[0,-.15,1]);}}
  for(const side of ['L','R']){inverseLimb('leg',side,[side==='L'?.18:-.18,.07,.56],[0,1,0]);worldRotation('foot'+side,initial['foot'+side]);}
  if(id==='bench-press'){box('bench-top',[0,.4,-.32],[.52,.1,1.35],'#263940');for(const z of [-.8,.1])box('bench-leg'+z,[0,.19,z],[.4,.38,.09],'#6a7578');}
  else{mat.visible=true;props.get('floor').visible=false;}
 }else if(['push-up','plank','prone-pull'].includes(id)){
  if(id==='prone-pull'){for(const side of ['L','R']){const sign=side==='L'?1:-1;limb('upperarm',side,[sign*.9,-.5,-.04-.2*phase]);limb('lowerarm',side,[-sign*.15,.8,-.04-.2*phase]);}for(const name of ['neck01','neck02','neck03','head'])aim(name,[0,.96,-.28]);actor.rotation.x=Math.PI/2;actor.position.set(0,.18,-.85);actor.updateMatrixWorld(true);for(const side of ['L','R']){inverseLimb('leg',side,[side==='L'?.16:-.16,.08,-.78],[0,-1,0]);aim('foot'+side,[0,0,-1]);}}
  else{for(const side of ['L','R']){limb('upperarm',side,axis(id==='plank'?90:90+45*phase,side==='L'?.08:-.08));limb('lowerarm',side,axis(id==='plank'?180:90-45*phase));}actor.rotation.x=Math.PI/2;actor.updateMatrixWorld(true);proneContacts(id==='plank'?'elbow':'hand');}
  mat.visible=true;props.get('floor').visible=false;
 }else if(['curl','band-curl','shoulder-press','band-press'].includes(id)){
  for(const side of ['L','R']){if(id.includes('curl'))limb('lowerarm',side,axis(5+135*phase));if(id==='shoulder-press'){limb('upperarm',side,[side==='L'?.9*(1-phase):-.9*(1-phase),phase,.12]);limb('lowerarm',side,[0,1,.03]);}if(id==='band-press'){limb('upperarm',side,[side==='L'?.7*(1-phase):-.7*(1-phase),-.4*(1-phase),-.3+.95*phase]);limb('lowerarm',side,[0,.1,1]);}}
 }else if(id==='pull-up'){
  actor.position.y=.08+.45*phase;actor.updateMatrixWorld(true);for(const side of ['L','R'])inverseLimb('arm',side,[side==='L'?.32:-.32,2.01,.06],[side==='L'?1:-1,-1,-.2]);rod('pull-bar',[-.7,2.01,.06],[.7,2.01,.06],.025);for(const x of [-.7,.7])rod('pull-post'+x,[x,0,.06],[x,2.1,.06],.035);for(const side of ['L','R']){limb('upperleg',side,axis(0));limb('lowerleg',side,axis(-20));}
 }else if(id==='calf-raise'){
  for(const side of ['L','R'])worldRotation('foot'+side,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),.4*phase).multiply(initial['foot'+side]));actor.position.y+=.02-(wp('toe1-1L').y+wp('toe1-1R').y)/2;actor.updateMatrixWorld(true);
 }else if(id==='march'){
  for(const side of ['L','R']){const moving=side===activeSide;limb('upperleg',side,axis(moving?50*phase:0));limb('lowerleg',side,axis(moving?-10*phase:0));limb('upperarm',side,axis(moving?-20*phase:20*phase));limb('lowerarm',side,axis(moving?0:40*phase));}
  const still=activeSide==='L'?'R':'L';actor.position.y+=.0706292649-wp('foot'+still).y;actor.updateMatrixWorld(true);
 }else if(id==='bike'){
  torso(25);actor.position.set(0,.04,-.03);actor.updateMatrixWorld(true);const theta=time*Math.PI*2/3;
  for(const side of ['L','R']){const angle=theta+(side==='R'?Math.PI:0),x=side==='L'?.16:-.16,y=.35+.16*Math.cos(angle),z=.18+.16*Math.sin(angle);inverseLimb('leg',side,[x,y+.07,z],[0,0,1]);worldRotation('foot'+side,initial['foot'+side]);box('pedal'+side,[x,y,z],[.15,.025,.12]);rod('crank'+side,[x,.35,.18],[x,y,z],.012);inverseLimb('arm',side,[side==='L'?.22:-.22,1.3,.49],[side==='L'?1:-1,-1,0]);}
  for(const z of [-.55,.55])rod('bike-base'+z,[-.35,.025,z],[.35,.025,z],.035);rod('bike-seat-stem',[0,.05,-.15],[0,.93,-.15],.045);box('bike-seat',[0,.94,-.15],[.25,.065,.3]);rod('bike-frame',[0,.35,.18],[0,.8,-.15],.055);rod('bike-handle-stem',[0,.04,.55],[0,1.3,.49],.035);rod('bike-handle',[-.3,1.3,.49],[.3,1.3,.49],.025);rod('bike-flywheel',[-.045,.35,.3],[.045,.35,.3],.25,'#7c8c8e');
 }else throw Error('No authored motion for '+id);
 actor.updateMatrixWorld(true);
 if(['floor-press','bench-press','rdl','curl','shoulder-press','band-curl','band-squat','band-press','barbell-squat','pull-up','bike'].includes(id))grip();
 if(['floor-press','bench-press','rdl','curl','shoulder-press'].includes(id))for(const side of ['L','R'])weight(side);
 if(['band-curl','band-squat','band-press'].includes(id))for(const side of ['L','R']){const p=palm(side),foot=wp('foot'+side),a=id==='band-press'?[side==='L'?.1:-.1,1.2,-1.25]:[foot.x,.035,foot.z];rod('band'+side,a,p.toArray(),.006,'#df6e29');if(id==='band-press')rod('band-anchor',[0,0,-1.25],[0,1.6,-1.25],.035);}
 if(id==='barbell-squat'){
  const p=wp('upperarm01L').add(wp('upperarm01R')).multiplyScalar(.5);p.y+=.055;p.z-=.12;for(const side of ['L','R'])inverseLimb('arm',side,[side==='L'?.4:-.4,p.y,p.z],[side==='L'?1:-1,-1,.2]);rod('squat-bar',[p.x-.8,p.y,p.z],[p.x+.8,p.y,p.z],.018,'#879194');for(const x of [-.65,.65])rod('squat-plate'+x,[p.x+x-.035,p.y,p.z],[p.x+x+.035,p.y,p.z],.17,'#34444a');for(const x of [-.75,.75]){rod('rack'+x,[x,0,-.3],[x,1.7,-.3],.035);rod('safety'+x,[x,.65,-.3],[x,.65,.5],.025);}
 }
 camera.position.set(2.7,1.6,3.2);camera.lookAt(0,.88,0);
 if(['floor-press','bench-press','bridge','crunch','push-up','plank','prone-pull'].includes(id)){camera.position.set(2.5,1.65,2.5);camera.lookAt(0,.32,0);}if(id==='pull-up'){camera.position.set(3,1.7,3.3);camera.lookAt(0,1.15,0);}
 render();
};
