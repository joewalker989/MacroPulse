/* Offline development renderer; no application data or runtime dependency. */
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),{execFileSync}=require('node:child_process'),{chromium}=require('../../node_modules/playwright');
async function main(){
 const scratch=path.resolve(__dirname,'../../test-results/trainer-render'),output=path.resolve(__dirname,'../../media/exercise-3d');fs.mkdirSync(scratch,{recursive:true});fs.mkdirSync(output,{recursive:true});
 const bundle=path.join(scratch,'scene.js');require('esbuild').buildSync({entryPoints:[path.join(__dirname,'scene.mjs')],bundle:true,format:'esm',outfile:bundle});
 const server=http.createServer((req,res)=>{if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end('<style>body{margin:0}</style><script type="module" src="/scene.js"></script>');}const files={'/scene.js':bundle,'/trainer-source.glb':path.join(__dirname,'trainer-source.glb')},file=files[req.url];if(!file){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'application/octet-stream');fs.readFile(file,(err,bytes)=>{res.writeHead(err?500:200);res.end(bytes);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{browser=await chromium.launch({args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});const page=await browser.newPage({viewport:{width:800,height:600}});await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.ready);
  let encoder=process.env.FFMPEG_PATH||'ffmpeg';if(!process.env.FFMPEG_PATH&&process.platform==='win32')encoder=path.join(path.dirname(require.resolve('@ffmpeg-installer/win32-x64/package.json')),'ffmpeg.exe');
  for(const id of ['leg-raise','dead-bug','band-row']){const folder=path.join(scratch,id);fs.mkdirSync(folder,{recursive:true});const seconds=id==='dead-bug'?12:6,fps=20;
   for(let frame=0;frame<seconds*fps;frame++){const data=await page.evaluate(({id,frame,fps})=>{const t=frame/fps,phase=.5-.5*Math.cos(2*Math.PI*(t%6)/6);pose(id,phase,t<6?'L':'R');return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},{id,frame,fps});fs.writeFileSync(path.join(folder,String(frame).padStart(4,'0')+'.png'),Buffer.from(data,'base64'));}
   execFileSync(encoder,['-y','-framerate',String(fps),'-i',path.join(folder,'%04d.png'),'-c:v','libx264','-preset','slow','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-an',path.join(output,id+'.mp4')],{stdio:'pipe'});
   execFileSync(encoder,['-y','-i',path.join(folder,'0030.png'),'-frames:v','1','-q:v','3',path.join(output,id+'.jpg')],{stdio:'pipe'});console.log(id+': '+seconds+'s, '+fs.statSync(path.join(output,id+'.mp4')).size+' bytes');
  }
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
