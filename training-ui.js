/* Equipment and routine UI; shares the existing app's state and backup format. */
window.mountTraining = function ({getState,save,escapeHTML:esc,logExercise}) {
  const T=window.MacroTraining, host=document.getElementById('training'), $=id=>document.getElementById(id);
  let timerEnd=0, timerHandle;
  const current=()=>getState().training||{equipment:[],options:{days:3,minutes:30,goal:'general',core:true,cardio:false},routine:[]};
  function update(next){getState().training=next;save();render();}
  const button=(label,action,value)=>`<button type="button" class="alt small" data-training="${action}" data-value="${esc(value)}">${esc(label)}</button>`;
  function render(){
    const s=current(),o=s.options;
    host.innerHTML=`<div class="panel"><h3>My Equipment</h3><p class="notice">Bodyweight exercises are always available. Custom equipment is saved in your inventory; automatic matching currently uses the supported equipment below.</p><div class="equipment-grid">${T.equipment.map(name=>`<label><input type="checkbox" data-equipment="${esc(name)}" ${s.equipment.includes(name)?'checked':''}> ${esc(name)}</label>`).join('')}</div><form id="equipmentForm" class="row"><label style="flex:1">Custom equipment<input class="field" name="equipment" required maxlength="60" placeholder="e.g. Cable machine"></label><button class="alt">Add</button></form>${s.equipment.filter(x=>!T.equipment.includes(x)).map(x=>`<div class="entry row"><span>${esc(x)}</span>${button('Remove','remove',x)}</div>`).join('')}</div>
    <div class="panel"><h3>Build Your Routine</h3><form id="routineForm"><div class="grid2"><label>Days per week<select class="field" name="days">${[3,4,5,6].map(n=>`<option ${n===o.days?'selected':''}>${n}</option>`).join('')}</select></label><label>Workout duration<select class="field" name="minutes">${[20,30,45,60].map(n=>`<option value="${n}" ${n===o.minutes?'selected':''}>${n} minutes</option>`).join('')}</select></label></div><label>Goal<select class="field" name="goal">${[['general','General fitness'],['strength','Strength'],['muscle','Build muscle']].map(([v,n])=>`<option value="${v}" ${v===o.goal?'selected':''}>${n}</option>`).join('')}</select></label><div class="actions"><label><input type="checkbox" name="core" ${o.core?'checked':''}> Include core</label><label><input type="checkbox" name="cardio" ${o.cardio?'checked':''}> Include 5 min cardio</label></div><p class="notice">Time estimates include a 3-minute warm-up and rests. Short sessions use fewer sets. Plan days around your recovery; this is a local rule-based planner.</p><button class="btn" style="margin-top:12px">Generate routine</button></form></div>
    <div class="panel"><h3>My Routine</h3>${s.routine.length?'<p class="notice">Open an exercise to review or adjust its log. A day is not marked complete automatically. Changing inventory clears this plan so it cannot retain unavailable equipment.</p>':'<p class="muted">Choose equipment and preferences, then generate a plan.</p>'}${s.routine.map((day,i)=>`<details class="entry"><summary>${esc(day.name)} · ~${day.estimatedMinutes} min</summary>${day.exercises.map((x,j)=>{
      const e=T.library.find(e=>e.id===x.exerciseId); if(!e)return '';
      const alternatives=T.available(s.equipment).filter(a=>a.group===e.group);
      const partner=x.superset?day.exercises.find(p=>p!==x&&p.superset===x.superset):null;
      const pairCue=partner?`<p class="notice green">Superset with ${esc(T.library.find(e=>e.id===partner.exerciseId)?.name)}. Alternate one set of each, then rest ${Math.max(x.rest,partner.rest)}s. Complete extra sets solo if needed.</p>`:'';
      return `<div class="entry"><strong>${esc(e.name)}</strong>${window.MacroWorkoutVisuals?MacroWorkoutVisuals.illustration(e):''}<div class="muted">${x.sets} × ${x.reps} ${x.unit} · ${x.rest}s rest · ${esc(e.group)}</div>${pairCue}<p class="notice">${esc(e.cue)}</p><div class="actions">${button('Log / adjust','log',`${i}:${j}`)}${button('Start rest','rest',x.rest)}</div><label>Substitute<select class="field" data-substitute="${i}:${j}">${alternatives.map(a=>`<option value="${a.id}" ${a.id===e.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select></label></div>`;
    }).join('')}</details>`).join('')}</div>
    <div class="panel"><h3>Exercise Library</h3><p class="notice">Exercise illustrations and technique cues, filtered to your equipment. These are schematic references, not video or automated form analysis.</p>${T.available(s.equipment).map(e=>`<details class="entry"><summary>${esc(e.name)} · ${esc(e.group)}</summary>${window.MacroWorkoutVisuals?MacroWorkoutVisuals.illustration(e):''}<p class="notice">${esc(e.cue)}</p></details>`).join('')}</div>`;
  }
  host.addEventListener('submit',e=>{
    e.preventDefault();const s=current(),f=e.target.elements;
    if(e.target.id==='equipmentForm'){
      const name=f.equipment.value.trim();if(!name||s.equipment.some(x=>x.toLowerCase()===name.toLowerCase()))return;
      update({...s,equipment:[...s.equipment,name]});
    }else if(e.target.id==='routineForm'){
      const options={days:Number(f.days.value),minutes:Number(f.minutes.value),goal:f.goal.value,core:f.core.checked,cardio:f.cardio.checked};
      update({...s,options,routine:T.generate(options,s.equipment)});
    }
  });
  host.addEventListener('change',e=>{
    const s=current(),el=e.target;
    if(el.dataset.equipment){const name=el.dataset.equipment;update({...s,equipment:el.checked?[...s.equipment,name]:s.equipment.filter(x=>x!==name),routine:[]});}
    if(el.dataset.substitute){const [i,j]=el.dataset.substitute.split(':').map(Number);const old=T.library.find(x=>x.id===s.routine[i].exercises[j].exerciseId);if(T.available(s.equipment).some(x=>x.id===el.value&&x.group===old.group)){s.routine[i].exercises[j].exerciseId=el.value;update(s);}}
  });
  host.addEventListener('click',e=>{
    const b=e.target.closest('[data-training]');if(!b)return;
    const s=current(),v=b.dataset.value;
    if(b.dataset.training==='remove')update({...s,equipment:s.equipment.filter(x=>x!==v),routine:[]});
    if(b.dataset.training==='log'){
      const [i,j]=v.split(':').map(Number),x=s.routine[i].exercises[j],exercise=T.library.find(e=>e.id===x.exerciseId);
      logExercise(exercise.name,x);
    }
    if(b.dataset.training==='rest'){
      clearInterval(timerHandle);timerEnd=Date.now()+Number(v)*1000;
      const tick=()=>{const seconds=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));$('restStatus').textContent=seconds?`Rest · ${seconds}s remaining`:'Rest complete';if(!seconds)clearInterval(timerHandle);};
      tick();timerHandle=setInterval(tick,250);
    }
  });
  $('cancelRest').onclick=()=>{clearInterval(timerHandle);$('restStatus').textContent='Rest timer ready';};
  render();return {render};
};
