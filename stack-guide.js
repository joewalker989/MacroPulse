/* Ingredient-level references, not brand certification or personalized dosing. */
(function(root){
 const sport='https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-Consumer/',professional='https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/',loss='https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/';
 const whey={benefit:'Helps meet protein needs for muscle repair and growth alongside training.',evidence:'Protein intake support',caution:'Contains milk. Check your product label and log shakes as food; the checklist does not add calories or protein.',source:sport};
 const entries=[whey,whey,whey,
  {benefit:'Can support repeated brief, high-intensity exercise and strength-training performance.',evidence:'Well studied for relevant exercise',caution:'May increase scale weight through water retention. Benefits differ by activity and person.',source:professional},
  {benefit:'Bulk-forming fiber can help bowel regularity and constipation.',evidence:'Established bulk-forming action',caution:'Use label-directed fluid; swallowing problems and medicine spacing need pharmacist or clinician review.',source:'https://medlineplus.gov/druginfo/meds/a601104.html'},
  {benefit:'Supplies leucine, isoleucine and valine; adequate high-quality protein already supplies these amino acids.',evidence:'Extra benefit over adequate protein is uncertain',caution:'Not a proven shortcut to better performance or recovery.',source:professional},
  {benefit:'Any average weight/fat-loss effect appears very small.',evidence:'Limited practical weight-loss benefit',caution:'Can cause digestive symptoms. Do not treat it as a reliable fat-loss aid.',source:loss},
  {benefit:'Supplementation may produce a small weight-loss effect in some research.',evidence:'Modest or uncertain benefit',caution:'Can cause nausea, cramps, diarrhea or body odor. Fat-metabolism claims do not guarantee fat loss.',source:loss},
  {benefit:'No established body-weight or appetite benefit from the limited available studies.',evidence:'Insufficient support for weight loss',caution:'Safety is not well studied; loose stools can occur.',source:loss},
  {benefit:'Supports normal nerve and blood-cell function; supplementation can help address inadequate intake or deficiency.',evidence:'Useful when needed; not a general energy booster',caution:'Extra B12 does not improve energy or endurance when B12 status is already adequate.',source:'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/'}
 ];
 function card(index){const e=entries[index];if(!e)return '';return `<details class="stack-evidence"><summary>Benefits & evidence</summary><p>${e.benefit}</p><p class="notice"><strong>${e.evidence}</strong> · ${e.caution}</p><p class="notice"><a href="${e.source}" target="_blank" rel="noopener">NIH / MedlinePlus source</a> · reviewed 2026-10-18. Ingredient evidence, not verification of this brand or batch.</p></details>`;}
 const api={entries,card};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroStackGuide=api;
})(typeof window!=='undefined'?window:globalThis);
