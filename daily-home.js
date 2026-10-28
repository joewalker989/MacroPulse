/* Home presentation only: retain existing nodes, event delegation and persistence. */
window.mountDailyHome=function({getState,today,escapeHTML:esc}){
 const home=document.getElementById('home'),$=id=>document.getElementById(id),opened=new Set();
 const next=document.createElement('section');next.id='dailyNext';next.className='panel';next.setAttribute('aria-label','Next useful action');
 const glance=document.createElement('div');glance.id='dailyAtGlance';glance.className='grid';glance.setAttribute('aria-label','Today’s recorded activity');
 const tools=document.createElement('div');tools.id='dailyToolsHeading';tools.innerHTML='<h2>More tools & insights</h2><p class="notice">Open a section when you need it. Your history, calculators and advanced tools are still here.</p><button class="alt" type="button" id="dailyFindTool">Find any tool</button>';
 home.classList.add('daily-home');
 const first=home.firstElementChild;first.querySelector('h2').textContent='Today';first.querySelector('.muted').textContent='Food, water and training at a glance';
 const calorie=$('remaining').closest('.panel'),macros=$('macroCards'),actions=home.querySelector('.grid:has([data-modal="food"])'),upgrade=$('dailyUpgrade');
 actions.id='dailyActions';actions.setAttribute('aria-label','Daily actions');const stack=actions.querySelector('[data-page="stack"]');
 if(stack){stack.removeAttribute('data-page');stack.id='dailyWaterShortcut';stack.innerHTML='💧<br><span class="small">Water</span>';stack.onclick=()=>{$('hydrationHub').scrollIntoView({block:'start',behavior:'auto'});$('hydrationHub').querySelector('button')?.focus({preventScroll:true});};}
 const review=document.createElement('button');review.type='button';review.className='alt';review.id='dailyWorkoutShortcut';review.dataset.page='fitness';review.innerHTML='▶<br><span class="small">Start / resume</span>';actions.append(review);
 home.append(first,calorie,macros,actions,next,upgrade);
 // Put essential existing controls ahead of the original advanced hosts, without changing their parents.
 home.insertBefore(first,home.firstChild);let anchor=first;for(const node of [calorie,macros,glance,actions,next,upgrade]){anchor.after(node);anchor=node;}
 upgrade.prepend($('hydrationHub'));$('hydrationHub').after(tools);
 const status=$('upgradeStatus');if(status)tools.after(status);
 $('dailyFindTool').onclick=()=>{const finder=$('sevenFinder');if(!finder)return;for(let p=finder;p&&p!==home;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;finder.scrollIntoView({block:'start'});$('sevenToolQuery')?.focus({preventScroll:true});};
 function expandAncestors(node){for(let p=node.parentElement;p&&p!==home;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}
 home.addEventListener('toggle',e=>{const node=e.target;if(node.tagName!=='DETAILS'||!home.contains(node))return;if(node.dataset.dailyGroup){if(node.open)opened.add(node.dataset.dailyGroup);else opened.delete(node.dataset.dailyGroup);}if(node.open)expandAncestors(node);},true);
 function collapsePanel(panel){
  if(panel.tagName==='DETAILS'||panel.id==='hydrationHub'||panel.id==='dailyNext'||panel===calorie||panel.closest('details')||panel.querySelector('#hydrationHub'))return;
  const heading=panel.querySelector('h3,h2');if(!heading)return;const key=(panel.parentElement.id||'home')+':'+(panel.id||heading.textContent),wrapper=document.createElement('details'),summary=document.createElement('summary');
  wrapper.className='panel daily-secondary';wrapper.dataset.dailyGroup=key;wrapper.open=opened.has(key);summary.textContent=heading.textContent.replace(/^\d+(?:\.\d+)*\s*·\s*/,'');wrapper.append(summary);panel.before(wrapper);wrapper.append(panel);
  // Cross-tool save/undo messages must remain visible when their introduction is collapsed.
  for(const live of panel.querySelectorAll(':scope > [data-seven-status], :scope > [data-six-status]'))wrapper.before(live);
 }
 // The compact disclosure leaves every water action in its original delegated hydration hub.
 const waterOptions=document.createElement('details');waterOptions.id='dailyWaterOptions';waterOptions.innerHTML='<summary>Custom water amount & daily goal</summary>';$('waterForm').before(waterOptions);waterOptions.append($('waterForm'),$('waterGoalForm'));
 function render(){
  const app=getState(),date=today(),meals=app.meals.filter(m=>m.date===date),water=(app.upgrade?.water||[]).filter(w=>w.date===date).reduce((n,w)=>n+w.ml,0),goal=app.upgrade?.waterGoal??2000,active=app.five?.active,plans=(app.upgrade?.schedule||[]).filter(p=>p.date===date&&p.status==='planned');
  let title,description,attrs,label;
  glance.innerHTML='<div><span class="muted">FOOD</span><strong>'+meals.length+' '+(meals.length===1?'entry':'entries')+'</strong></div><div><span class="muted">WATER</span><strong>'+Math.round(water)+' ml logged</strong></div><div><span class="muted">WORKOUT</span><strong>'+esc(active?(active.timer?.stopped?'Stopped':active.timer?.pausedAt?'Paused':'In progress'):app.workouts.some(w=>w.date===date)?'Entries logged':'None logged')+'</strong></div>';
  if(active){title=active.timer?.stopped?'Review your stopped workout':active.timer?.pausedAt?'Resume your workout':'Your workout is in progress';description='Open Fitness to review the timer and saved sets. Finishing remains a separate action.';attrs='data-page="fitness"';label='Open current workout';}
  else if(!meals.length){title='Log your first meal when ready';description='No food entries today. Missing entries do not mean zero intake.';attrs='data-modal="food"';label='Log food';}
  else if(water<goal){title='Review your water progress';description=Math.round(water)+' / '+Math.round(goal)+' ml recorded against your chosen goal. Add only what you have actually drunk.';attrs='data-daily-water';label='Open water tracker';}
  else if(plans.length){title='Review today’s planned training';description=plans.length+' planned session'+(plans.length===1?'':'s')+'. Review readiness in Fitness before starting.';attrs='data-page="fitness"';label='Review planned workout';}
  else{title='Review your day';description=meals.length+' food entr'+(meals.length===1?'y':'ies')+' recorded today. Check portions and missing meals in your diary.';attrs='data-page="food"';label='Open food diary';}
  next.innerHTML='<p class="muted">NEXT USEFUL ACTION</p><h3>'+esc(title)+'</h3><p class="notice">'+esc(description)+'</p><button class="btn" type="button" '+attrs+'>'+label+'</button>';
  next.querySelector('[data-daily-water]')?.addEventListener('click',()=>$('dailyWaterShortcut').click());
  if(status?.textContent==='Complete Upgrade · local features')status.textContent='Changes use the existing saved records.';
  for(const panel of home.querySelectorAll('.panel'))collapsePanel(panel);
 }
 // This formerly expanded release-shortcut panel is secondary to the daily actions.
 if($('connectedShortcuts'))$('connectedShortcuts').open=false;
 render();return {render};
};
