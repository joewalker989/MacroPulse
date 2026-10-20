# MacroPulse 8.0 — reviewed food and health imports

This is the first shipped stage of the approved 20-feature expansion. It does
**not** complete all 20 integrations. The following table is the release scope;
older handoffs and marketing labels do not override it.

| # | Approved capability | Actual implementation and remaining work |
| --- | --- | --- |
| 1 | Large verified food database | **Partial:** Open Food Facts community product adapter, saved offline products and online search. Not an independently verified database. Product lookup returned HTTP 200 during validation; public search returned HTTP 503. No claim of reliable live search or comprehensive food coverage. |
| 2 | Barcode scanning | **Partial:** typed UPC/EAN lookup works; camera uses browser BarcodeDetector only where supported, with permission, explicit stop and track cleanup. Hardware scanning on iPhone is not verified. Unsupported browsers offer typed lookup. |
| 3 | Nutrition-label OCR | **Implemented:** on-device English Tesseract model, local image reading, editable text, unknown values left blank, mandatory serving-basis and nutrition review, save to food library. Synthetic image tested through the actual browser OCR worker; real package/iPhone accuracy remains unverified. |
| 4 | AI meal photographs | **Pending:** no meal-recognition service or model. Existing manual meal-photo tools remain. |
| 5 | Natural-language meal logging | **Partial:** multiple exact saved food names, optional numeric serving counts, commas/“and”, unmatched-food correction and preview. Not free-form AI understanding. Existing browser dictation remains optional. |
| 6 | Recipe URL import | **Partial:** public HTTPS URL read where CORS permits; Recipe JSON-LD paste fallback, ingredient/yield preview and published nutrition review. Does not calculate nutrition from arbitrary ingredients or bypass blocked websites. |
| 7 | Automatic meal planning | **Partial:** bounded food-portion suggestions from current macros, pantry-name preference and explicit text exclusions, preview and dated plan save. Not a weekly dietary/budget optimizer, allergy validator or automatic recipe generation. |
| 8 | Comprehensive micronutrients | **Partial:** twelve additional nutrient fields when present on imported products, unit conversion, per-meal source and coverage. The four supported legacy nutrient fields also integrate with existing gap tools. Missing values stay unknown. No full nutrient database or full adequacy assessment. |
| 9 | Targets that learn from results | **Implemented with limits:** two weekly weight averages and fourteen explicitly complete food days produce an inspectable expenditure estimate. Eligibility, data-density, change, reference floor and adjustment guards apply. User approval required; target change capped at 150 kcal and enters existing target history. Not measured metabolism or a validated clinical/adaptive model. |
| 10 | Restaurant-menu AI scan | **Pending:** no menu recognition/recommendation model. Existing restaurant links and sourced sample foods remain. |
| 11 | Professional demonstration videos | **Partial:** external publisher demonstration references / exercise library links. Original offline illustrations remain. No licensed local filmed-video library. |
| 12 | Set type and reps in reserve | **Implemented:** working/warmup/drop/failure classifications and nullable RIR 0–10 in live sessions; preserved through finish/log/backup. Old sets without these fields remain valid. |
| 13 | Structured training blocks | **Partial:** 2–12 week routine snapshots, week previews, configured lighter weeks and review-only load percentages. Does not automatically schedule block sessions or apply progressive loads. |
| 14 | Automatic rest timers | **Implemented:** optional rest starts on a newly checked completed set in a running live session. Save failure, pause/stop and unchecked sets do not start rest. Foreground countdown; no background alarm. |
| 15 | Cloud account/device sync | **Pending:** no configured backend, authentication, access rules, conflict resolution service or automatic off-device backup. Downloaded local backups remain available. |
| 16 | Health and smart-scale connections | **Partial:** reviewed Apple Health export.xml or documented fitness CSV import. Supported observations: weight, steps, active energy, heart rate, asleep intervals and workouts. Date range, source labels, duplicate skipping, local export and explicit removal. An imported weight needs separate approval to become a check-in. No live Apple Fitness/HealthKit, Garmin, Fitbit, Strava, smart-scale or Health Connect authorization. |
| 17 | Native smartwatch controls | **Pending:** native watch implementation, signing, platform permissions and device testing. |
| 18 | Native widgets/Live Activities | **Pending:** native implementation, shared storage, signing and device tests. Home links are not native widgets. |
| 19 | Background hydration reminders | **Partial:** timed calendar reminder export. Import and notification settings are controlled by the user's calendar. Not web push, automatic cancellation at goal or background MacroPulse reminders. |
| 20 | App privacy lock | **Implemented as a screen lock:** optional locally hashed passphrase, lock on background/reopen, retry cooldown and authenticated removal. **Not encryption, biometrics or protection against browser/device administration.** Existing records, photos and backups remain unencrypted. |

## Where to find the additions

Home → New food, training & health tools contains direct links. Food contains
catalog/barcode lookup, local label reader, meal description, recipe import,
generated food plans and imported-product nutrient totals. Fitness contains
set metadata, automatic-rest preference, training blocks and video references.
Progress contains health-file import and expenditure estimates. Settings
contains connection status, privacy-screen settings and hydration reminder files.

## Health data rules

Apple: Health → profile → Export All Health Data; unzip and choose export.xml.
The XML or CSV file must be at most 20 MB, with at most 3,000 saved observations.
For large exports, create a smaller standard CSV outside MacroPulse. This
limitation is shown before import; there is no silent truncation.

Standard CSV columns: `type,source,start,end,value,unit`. Types are `weight`,
`steps`, `activeEnergy`, `heartRate`, `sleep`, `workout`. Units: lb/kg, count,
kcal/kJ, bpm, min/s respectively. Dates must include a full timestamp; include
an explicit timezone. A downloadable example is provided. This does not mean
arbitrary proprietary CSV layouts are automatically compatible.

Data is parsed locally. Previewing does not save. Reimporting skips identical
source/type/time/value/unit observations, including equivalent timezone
timestamps. Different sources stay separate. The summary displays one source
at a time; overlapping same-source samples are flagged. Sleep uses the union
of asleep intervals, and assigns an interval to its recorded start date.
Other metrics show recorded sums/ranges, not Apple Health's deduplicated totals.
There is no clinical interpretation of heart-rate or sleep data.

Imported observations never manufacture workouts, add exercise calories to the
food budget or silently change targets. Removing observations leaves approved
weight check-ins, diary records and photos intact. The complete app backup
includes the observations; the separate observation export is an archive.

## Preservation and dependencies

The original storage key and existing record shapes remain. The optional
`connected` schema is versioned and validated. Before first use, the exact
previous app JSON is retained at `macropulse_pwa_v1_before_8`. Existing snapshot
and import recovery protections remain. Unknown fields survive. Failed saves
restore the in-memory state. Saves exceeding the existing 5 MB app-backup
limit are rejected before primary replacement. No progress-photo database
schema or image bytes are modified.

OCR downloads about 10 MB from version-pinned jsDelivr URLs only on explicit first use. SHA-256 is checked before caching and before execution; a failed check prevents installation. Once cached, the reader works offline after reload. Clearing browser cache requires downloading it again. The main app installation does not wait for the OCR download. Apache-2.0 licenses and provenance
are in `vendor/ocr/`. Open Food Facts entries retain source links and licensing
attribution, remain community-contributed, and require review. Lookup requests
are explicit and throttled, omit credentials, and do not send diary/health/photo
records. Public-provider outages do not disable local tools. See
https://openfoodfacts.github.io/openfoodfacts-server/api/.

Apple live access requires HealthKit capability and authorization in a native
app: https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data.
A signed native app and real-device tests are required before any native
connection can be described as integrated. No provider password or API secret
belongs in this public repository or the GitHub Pages client.

## Validation

89 unit tests and 12 isolated browser suites passed locally, including actual
English label-image OCR, health CSV/XML preview and deduplication, invalid XML
rejection, reviewed weight transfer, unchanged calorie budgets, set metadata,
automatic rest, privacy-screen enable/lock/wrong-password/unlock/removal,
offline reload, legacy migrations and progress-photo preservation.

Online service fixtures in automated tests are explicitly mocked. Real public
barcode lookup was checked separately. Real camera hardware, native Apple
permissions, cloud sync and unavailable AI services are not covered or claimed.
