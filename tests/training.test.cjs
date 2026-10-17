const {test}=require('node:test');
const assert=require('node:assert/strict');
const T=require('../training.js');
test('all day counts, durations, goals and equipment combinations fit the time budget',()=>{
  for(const days of [3,4,5,6])for(const minutes of [20,30,45,60])for(const goal of ['strength','muscle','general'])for(const core of [false,true])for(const cardio of [false,true])for(const inventory of [[],['Dumbbells'],T.equipment]){
    const options={days,minutes,goal,core,cardio};const routine=T.generate(options,inventory);
    assert.equal(routine.length,days);
    for(const day of routine){
      assert.ok(day.estimatedMinutes<=minutes);assert.ok(day.exercises.length>0);
      for(const x of day.exercises)assert.ok(T.available(inventory).some(e=>e.id===x.exerciseId));
      if(core)assert.ok(day.exercises.some(x=>T.library.find(e=>e.id===x.exerciseId).group==='Core'));
      if(cardio)assert.ok(day.exercises.some(x=>x.unit==='minutes'));
    }
    assert.ok(T.validState({equipment:inventory,options,routine}));
  }
});
test('multi-equipment requirements require every item; unknown equipment grants no matches',()=>{
  assert.ok(!T.available(['Bench']).some(x=>x.id==='bench-press'));
  assert.ok(T.available(['Dumbbells','Bench']).some(x=>x.id==='bench-press'));
  assert.deepEqual(T.available(['Custom machine']),T.available([]));
});
test('invalid preferences and imported routine payloads are rejected',()=>{
  const options={days:3,minutes:30,goal:'general',core:true,cardio:false};
  for(const days of [0,7,3.5,'3'])assert.throws(()=>T.generate({...options,days},[]));
  assert.equal(T.validState({equipment:[],options,routine:[{name:'bad',exercises:[{exerciseId:'unknown'}]}]}),false);
  assert.equal(T.validState({equipment:[null],options,routine:[]}),false);
});
