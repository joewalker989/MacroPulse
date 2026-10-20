/* Public, version-pinned dependencies. These hashes cover downloaded bytes, not label pictures. */
(function(root){'use strict';
 const files=[
  ['tesseract.min.js','https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js','10fff78484067759c43028a02a72d76d0b90eb17302bb23b58a9ec5410bc928b','application/javascript'],
  ['worker.min.js','https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/worker.min.js','38645599043239c0eb6db08a6504a92dcdc292200535f3e9339cd77c4443b842','application/javascript'],
  ['tesseract-core-lstm.wasm.js','https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.0/tesseract-core-lstm.wasm.js','775a35df6f2ae100e02609443e6bd5cafcd07983dd6175454ca4a432a7730687','application/javascript'],
  ['tesseract-core-lstm.wasm','https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.0/tesseract-core-lstm.wasm','220e2e87551edccb85519796a170469f8ab2a8055216789e3b8b1ada18b7bc2b','application/wasm'],
  ['eng.traineddata.gz','https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng@1.0.0/4.0.0_best_int/eng.traineddata.gz','45b4cb346724ac1774f1c36f42f182b887bcdb28ebe63e6fff90ac41f3fcff91','application/octet-stream']
 ].map(([name,url,sha256,type])=>Object.freeze({name,url,sha256,type}));
 const api=Object.freeze({cache:'mp-ocr-tesseract6.0.1-eng1-integrity',path:'ocr-runtime/tesseract6.0.1-eng1/',files:Object.freeze(files)});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroOCRAssets=api;
})(typeof self!=='undefined'?self:globalThis);
