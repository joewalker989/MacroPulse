/* Fixed provider relay: authenticated by core; no arbitrary URLs or user health records. */
export function foodQuery(value){if(typeof value!=='string'||value.trim().length<3||value.trim().length>120)throw Error('Enter 3–120 characters for Open Food Facts name search.');const text=value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();if(text.length<3)throw Error('Enter at least three letters or numbers for food name search.');return text;}
export async function searchFoods(value,fetcher=fetch){
 const query=foodQuery(value),url=new URL('https://search.openfoodfacts.org/search');
 // Plain lowercase words omit Lucene syntax and uppercase boolean operators.
 url.searchParams.set('q',query);
 url.searchParams.set('page_size','20');url.searchParams.set('fields','code,product_name,product_name_en,nutrition_data_per,nutriments');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetcher(url,{redirect:'manual',credentials:'omit',headers:{Accept:'application/json','User-Agent':'MacroPulse/9.3 (https://github.com/joewalker989/MacroPulse)'},signal:controller.signal});
  if(!response.ok)throw Error('Open Food Facts is unavailable or rate limited ('+response.status+'). Saved foods remain available.');
  if(Number(response.headers.get('content-length'))>2000000)throw Error('Food search response exceeds 2 MB. Narrow the search.');
  const reader=response.body.getReader(),parts=[];let size=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2000000)throw Error('Food search response exceeds 2 MB. Narrow the search.');parts.push(value);}}finally{await reader.cancel().catch(()=>{});}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  let raw;try{raw=JSON.parse(new TextDecoder().decode(bytes));}catch{throw Error('Open Food Facts returned unreadable data.');}
  if(!raw||!Array.isArray(raw.hits)||raw.timed_out||raw.errors?.length)throw Error('Open Food Facts could not complete this search.');
  return {products:raw.hits.slice(0,20).map(p=>({code:p.code,product_name:p.product_name,product_name_en:p.product_name_en,nutrition_data_per:p.nutrition_data_per,nutriments:p.nutriments})),reviewRequired:true};
 }catch(error){if(controller.signal.aborted)throw Error('Open Food Facts search timed out. Saved foods remain available.');throw error;}finally{clearTimeout(timer);}
}
