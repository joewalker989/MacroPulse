# Local English label reader

Optional Tesseract.js 6.0.1 and tesseract.js-core 6.0.0, Apache License 2.0.
See LICENSE-tesseract-js.md and LICENSE-core. English integer LSTM model from
@tesseract.js-data/eng 1.0.0, 4.0.0_best_int, derived from Tesseract tessdata_best
(Apache 2.0). Upstream: https://github.com/naptha/tesseract.js and
https://github.com/tesseract-ocr/tessdata_best.

Files are downloaded on demand from the versioned jsDelivr npm distributions, verified against the SHA-256 manifest in ocr-assets.js and stored in a separate offline cache. No image is sent
to jsDelivr, Open Food Facts or an AI service. OCR assets execute locally after verified installation; they are not included in the initial application cache. Approximate added download: 10 MB.
Labels, decimals, units and serving bases must be checked by the user.
