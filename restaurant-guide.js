/* Curated public restaurant sources. No home address, GPS, API key or automatic user-data writes. */
(function(root){'use strict';
 const checked='2026-10-18';
 const rows=[
 ['chick','Chick-fil-A','3202 Highway 5','https://www.chick-fil-a.com/locations/ga/douglasville'],
 ['chipotle','Chipotle','9380 The Landing Dr','https://locations.chipotle.com/ga/douglasville/9380-the-landing-dr'],
 ['wendys',"Wendy’s",'6959 Douglas Blvd','https://locations.wendys.com/united-states/ga/douglasville'],
 ['zaxbys','Zaxby’s','7035 Concourse Pkwy','https://www.zaxbys.com/locations/ga/douglasville/7035-concourse-pkwy'],
 ['subway','Subway','3869 Chapel Hill Rd','https://restaurants.subway.com/united-states/ga/douglasville/3869-chapel-hill-rd'],
 ['panda','Panda Express','2716 Chapel Hill Road','https://www.pandaexpress.com/locations/ga/douglasville/'],
 ['kfc','KFC','Highway 5 Market Square Shopping Ctr','https://locations.kfc.com/ga/douglasville/highway-5-market-square-shopping-ctr'],
 ['jersey','Jersey Mike’s','9478 Highway 5, Suite C','https://naacpwestmetroga.org/black-businesses-and-non-profits-directory/','https://www.jerseymikes.com/menu'],
 ['olive','Olive Garden','6710 Douglas Blvd','https://jobs.olivegarden.com/search/jobdetails/server/7cda9d39-cd3e-43d4-b3f5-5a8e1b3008ef','https://www.olivegarden.com/menu'],
 ['longhorn','LongHorn Steakhouse','8471 Hospital Drive','https://www.longhornsteakhouse.com/locations/ga/douglasville/douglasville/5011'],
 ['waffle','Waffle House','9464 Highway 5','https://locations.wafflehouse.com/douglasville-ga-1968/'],
 ['ihop','IHOP','7401 Douglas Blvd','https://restaurants.ihop.com/en-us/ga/douglasville/breakfast-7401-douglas-blvd-4428'],
 ['cracker','Cracker Barrel','7060 Concourse Pkwy','https://careers.crackerbarrel.com/jobs/location/GA/Douglasville/','https://www.crackerbarrel.com/menu'],
 ['moes','Moe’s Southwest Grill','6968 Douglas Blvd','https://locations.moes.com/ga/douglasville'],
 ['pizzahut','Pizza Hut','3697 Highway 5, #4','https://locations.pizzahut.com/ga/douglasville'],
 ['papajohns','Papa Johns','3387 Highway 5, Ste F','https://locations.papajohns.com/united-states/ga/30135/douglasville/3387-highway-5/food-near-me'],
 ['wingstop','Wingstop','2911 Chapel Hill Rd, Suite 235','https://www.wingstop.com/georgia/douglasville'],
 ['dominos','Domino’s','2163 Fairburn Road','https://pizza.dominos.com/georgia/douglasville'],
 ['bww','Buffalo Wild Wings','6790 Douglas Blvd','https://www.buffalowildwings.com/locations/?q=30303','https://www.buffalowildwings.com/menu/'],
 ['applebees','Applebee’s','6915 Douglas Blvd','https://restaurants.applebees.com/en-us/ga/douglasville/6915-douglas-blvd.-95037']
 ];
 const places=rows.map(([id,name,address,source,menuUrl])=>({id:'douglasville-'+id,name,location:address+', Douglasville, GA',source,menuUrl:menuUrl||source,checked}));
 const panda='https://www.pandaexpress.com/nutritioninformation';
 const foods=[
 ['grilled-nuggets','Chick-fil-A','Grilled Nuggets','8 count; no dipping sauce',130,25,1,3,'https://www.chick-fil-a.com/menu/entrees/grilled-nuggets'],
 ['chicken-sandwich','Chick-fil-A','Chicken Sandwich','1 standard sandwich; no sides/drink',420,29,41,18,'https://www.chick-fil-a.com/catering/entrees/chick-fil-a-chicken-sandwich'],
 ['teriyaki','Panda Express','Grilled Teriyaki Chicken','6.1 oz; separate sauce, sides/drink not included',280,38,13,9,panda],
 ['orange','Panda Express','The Original Orange Chicken','6.2 oz; no sides/drink',560,19,63,25,panda],
 ['broccoli','Panda Express','Broccoli Beef','6.3 oz; no sides/drink',190,17,14,7,panda],
 ['chow-mein','Panda Express','Chow Mein','12 oz side',520,14,89,12,panda],
 ['fried-rice','Panda Express','Fried Rice','12 oz side',610,15,109,13,panda],
 ['white-rice','Panda Express','White Steamed Rice','12 oz side',570,11,129,0,panda],
 ['greens','Panda Express','Super Greens','10 oz side (not entree portion)',180,8,17,9,panda],
 ['mushroom','Panda Express','Mushroom Chicken','5.7 oz; no sides/drink',180,13,12,9,panda]
 ];
 const meals=foods.map(([id,restaurant,name,serving,cal,p,c,f,source])=>({id:'menu-20261018-'+id,restaurant,name,serving,cal,p,c,f,source,verified:checked}));
 const normalize=s=>String(s).normalize('NFKD').replace(/[’']/g,'').toLowerCase();
 function search(query=''){const q=normalize(query).trim();return places.filter(p=>normalize(p.name+' '+p.location).includes(q));}
 function menu(saved=[]){const own=new Set(saved.map(x=>x.id));return [...saved,...meals.filter(x=>!own.has(x.id))];}
 const api={places,meals,search,menu,checked};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroRestaurants=api;
})(typeof window==='undefined'?globalThis:window);
