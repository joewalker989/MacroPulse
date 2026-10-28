# MacroPulse 9.3 — combined food search

Roadmap item 9 joins saved foods, USDA and Open Food Facts in one reviewed search with offline cached results and independent source failures. OFF name search uses the signed-in service and shares its 20/day quota; public barcode and USDA searches remain available without sign-in. See [RELEASE_9_3.md](RELEASE_9_3.md). Items 1–7 remain shipped; item 8 is deferred because Mac/Xcode and an Apple Developer team are unavailable. Items 10–100 remain pending. Older release details follow.

# MacroPulse 9.2 — daily flow and reviewed setup

Roadmap items 1–7 are implemented: simplified daily Home, guided setup, current cloud/session messages, library-only USDA saving, persistent planning preferences, recipe nutrients in diary coverage and inventory/ledger sync review. See [RELEASE_9_2.md](RELEASE_9_2.md) and [ROADMAP_PROGRESS.md](ROADMAP_PROGRESS.md). Native Apple activation and other provider/device dependencies remain pending. Older sections below describe historical releases.

# MacroPulse 9.1 — reviewed sync and weighed recipe nutrition

Optional encrypted device/cloud record merging now includes explicit conflicts, encrypted original recovery and session-only automatic sync. Weighed recipes use reviewed USDA matches and preserve missing nutrient coverage. See [RELEASE_9_1.md](RELEASE_9_1.md) for behavior, tests and external setup still required. The sections below are historical releases.

# MacroPulse 9.0 — encrypted backups and reviewed connections

Encrypted cloud backups passed actual sign-in, private record/photo transfer and conflict tests. Reviewed weekly planning, USDA search, offline barcode-picture decoding, a credited 78-clip online exercise player and guarded Strava/recipe adapters are implemented. iOS/widgets and Watch simulator targets compiled; provider credentials and signed-device acceptance remain pending. See [RELEASE_9_0.md](RELEASE_9_0.md) for exact verification and remaining provider/device requirements. This does not make every pending feature live. Older release notes below remain historical.

# MacroPulse 8.0 — reviewed food and health imports

Current release: reviewed Apple Health XML / standard fitness CSV import, local English nutrition-label OCR, food/barcode adapters, recipe and meal-description drafts, food-plan suggestions, imported-product nutrients, guarded expenditure estimates, set types/RIR, automatic rest, training-block previews, external video references, calendar reminders and a passphrase privacy screen. Home has direct links to the new tools.

**The 20-feature expansion is not complete.** See [RELEASE_8_0.md](RELEASE_8_0.md) for the exact 20-row shipped/partial/pending report. Live Apple Health/fitness-app authorization, cloud sync, native watch/widgets, background app notifications and AI food/menu recognition are not integrated. Public food search returned HTTP 503 during validation; barcode lookup worked. Camera scanning depends on browser support and has not been tested on iPhone. A privacy screen does not encrypt saved data.

The optional `connected` extension preserves the prior raw JSON before first save. No progress-photo storage is changed. All 89 unit tests and 12 browser suites passed locally, including actual local OCR and offline/legacy/photo regression checks. Older sections below describe prior releases and do not replace the current integration boundaries.

# MacroPulse 7.2 — seven local convenience tools

Workout focus mode, work/rest intervals, illustrated printable routines, workout notes, planned-workout calendar files, printable food diaries and a US/metric converter. See RELEASE_7_2.md for locations, verification and explicit boundaries. No app or photo record migration is needed.

# MacroPulse 7.1.2 — timer controls and visible supplement benefits

Fitness shows the readiness check, 00:00:00 timer and Start/red Stop controls immediately. Stack shows each benefit directly below the supplement. Existing pause/resume, evidence, cautions and sources are retained. See RELEASE_7_1_2.md.

# MacroPulse 7.1.1 — workout demonstration pictures

Larger start/movement illustrations now appear in templates, the library, logging and matched workout history. Custom workouts can save a matching demonstration reference. See RELEASE_7_1_1.md.

# MacroPulse 7.1 — latest shipped experience

Daily targets/jug/hydration now share one panel. Live workouts have a persistent pause-aware clock, set ring, red Stop and original movement illustrations. Food includes 20 Douglasville chain menu links, 10 sourced offline nutrition snapshots and an editable visited-place directory. Stack includes benefits, evidence and cautions for every existing option. See RELEASE_7_1.md for shipped features, preservation, validation and boundaries. Exact home-based 20-mile filtering, full imported menus and live restaurant services are not verified/integrated.

# MacroPulse 7.0 — 50 implemented additions

Baseline: 332aecffa32c2c0249baff6e089b1b442ad63db8 (6.1). Existing functionality was inspected before choosing these additions; the numbered guide maps each addition to an actual control. No external-service placeholders count toward the 50.

See RELEASE_7_0.md for the complete numbered list and boundaries.



## Preservation and validation

Optional seven schema v1 is created on explicit use, with no startup writes. Before its first save, macropulse_pwa_v1_before_7 retains the original raw app data. Download this snapshot from Undo, integrity audit & action journal. Unknown app/record fields survive; invalid/future schemas, stale tabs and snapshot/write failures reject saves. These record-tool commits roll back memory on failure. Original localStorage key and IndexedDB photo store/version are retained. Photo metadata edits use existing revision protection; no photo blob is rewritten. Full app JSON includes the new extension. Photos and their annotations still require separate photo JSON backup. Privacy erasure includes the new release snapshot. Source backup branch backup/pre-7.0 and a local Git bundle precede this release.

62 Node tests and eight browser suites cover all 50 numbered additions, formula boundaries, snapshots/quota failures, future schemas, copy/edit/undo semantics, unknown-field retention, live-set integrity, core/photo backup round trips, original photo pixels/metadata paths, offline reload, mobile width, local exports and keyboard navigation. The new suite asserts a coverage set of all integers 1–50. Existing 5.0/5.1/6.0/6.1 regressions remain in the test command; time-sensitive 6.0 fixtures now use relative dates. Local Windows uses Chrome; CI uses Chromium. Tests use synthetic records/images in isolated profiles, not personal storage or an actual camera.

The new tools avoid unnecessary rerendering on unrelated food-search input. Home offers an in-app numbered guide, tool search and pinned shortcuts. Cache generation macropulse-v7-0-1 precaches all runtime modules and waits for old tabs to close; it does not erase records/photos.

## Explicit limits

AI/body analysis, external food/restaurant/price APIs, cloud accounts/sync/encrypted backup, health-device/native iOS integration, background alarms and HEIC conversion remain not integrated. Real iPhone hardware/camera/speech-provider behavior is not verified. Timers are foreground only. Nutrient/food/price values remain manual or illustrative. Progress summaries describe recorded information, not measured total intake, safe lifting capacity, health grades or inferred body composition. CSV/JSON extracts and period reports are not substitutes for full app and photo backups.

---

# MacroPulse 6.1 — photo library and visual comparison studio

Adds explicit **Choose from photo library** (without a camera capture hint) and a separate **Take a photo** chooser, with a local preview before saving, editable capture timestamp/view and existing explicit consent. JPEG/PNG/WebP up to 12 MB remain supported. Browser camera/library chooser behavior varies; actual iPhone hardware and HEIC conversion are not verified/integrated.

Comparison improvements:

- Side-by-side and slider remain; transparent overlay adds adjustable opacity.
- Optional orange pixel-difference map runs entirely on device, after manual alignment. Adjustable threshold suppresses smaller pixel changes. It highlights image differences, including lighting, pose, clothes and distance; it does not detect or measure fat, muscle, health or anatomical change. No AI service or image upload.
- Add numbered boxes with labels such as shoulders, arms, waist outline or posture and optional observations. Tap the later image to position a box, or use exact percentage controls. Edit/remove labels without changing images. Labels are user observations attached to the exact selected photo pair, not automatic body tracking.
- Existing pan/zoom alignment is retained. A warning appears when alignment has changed since saved identifiers; review/reposition those boxes. Consistent 4:5 comparison frames match PNG export geometry.
- Pair date interval, reversed-date warning, swap control and a consistency checklist improve comparison quality.
- Comparison PNGs include the chosen side/slider/overlay view, optional difference map, grid, numbered regions and readable observation legend. Photos remain unmodified.

Data protection:

- Existing IndexedDB database/store/version retained. Optional validated comparison metadata is added only after saving an identifier. No startup migration or photo rewrites. Existing timestamps, measurements, notes, alignment, blobs and unknown fields remain intact.
- Photo metadata updates use optimistic revision checks so stale saves cannot overwrite a newer edit. Future/malformed comparison versions and invalid/out-of-frame regions are rejected.
- Full/per-photo backups include comparison metadata with the existing checksum. Restore remains atomic and add-only; IDs already present are never replaced. Standard app JSON still excludes photos and their annotations: export photo JSON separately.
- Service-worker cache v6-1-1 precaches the new local comparison module; existing offline behavior and other features are retained. Source backup branch backup/pre-photo-studio-6.1 and local Git bundle precede this change.

Validation: 50 passing Node tests and seven local browser suites, including all prior 5.0/5.1/6.0 regression suites. New acceptance covers library/camera input separation, selected-file preview, consent, add/edit/remove identifiers, pixel map, transparent overlay, annotated PNG download, changed-alignment warning, stale-revision rejection, backup/restore, offline reload, mobile width and retention of both original images. Tests use isolated synthetic images and browser profiles; a camera chooser is simulated by supplying a file, not verified on physical hardware. No personal photo library was inspected.

---

# MacroPulse 6.0 — shipped local features

5.1 was deployed and verified before 6.0 implementation began: commit `48220d456ff9ecedeb4741804b1159b431dc61db`; successful PWA checks run `39089013476`, Pages run `39089013036`, and live `health-browser.cjs` acceptance on https://joewalker989.github.io/MacroPulse/ . 5.1 remains included; see RELEASE_5_1.md.

| # | Requested feature | Shipped behavior / exact boundary |
| --- | --- | --- |
| 1 | Body transformation scorecard | Recorded weight/waist change and seven-day training, food and water logging coverage. No combined health/appearance grade or photo inference. |
| 2 | Weekly calorie budget | Monday-based seven-day reference targets or explicitly saved per-day planning amounts; total, observed food and completion attestations. Unlogged is unknown; plan does not change approved daily intake or add exercise calories. Pre-history targets use current target as an approximate reference. |
| 3 | Visual body measurements | Accessible schematic with manually measured waist/chest/hip/arm/thigh; dated cm storage, US/metric entry/display; waist also added to existing transformation timeline. Existing waist records preserved. |
| 4 | Kitchen inventory | Add/edit/remove quantities, units and entered best-before dates; exact name+serving stock comparison with existing grocery list. No inferred consumption or live retailer data. |
| 5 | Calorie target version history | Before/after calories/macros for manual Settings changes and calculator approvals from 6.0 onward. Reuses earlier calculator approval history; never invents older manual changes. Backup import restores supplied history. |
| 6 | Smoothed weight trends | Seven-calendar-day moving means, last check-in per date, date counts and actual observations; no interpolation or invented readings. |
| 7 | Protein distribution planner | Two to six equal planned allocations from current protein target; manually assign diary entries to meal slots, with unassigned protein shown. No meal-time inference. |
| 8 | Nutrition gap detector | Reuses sourced nutrient coverage; protein difference and optional personal fiber/calcium/iron references and sodium maximum. Missing values and partial coverage give unknown gaps. Not a deficiency diagnosis or medical prescription. |
| 9 | Food swap assistant | Local library/custom-food serving comparisons under calorie/protein limits, with differences displayed. Servings may differ; no AI or automatic diary substitution. |
| 10 | Meal cost tracker | Per-logged-portion receipt/source notes and price replacement, seven-day coverage, separate currency totals, exclusion of removed meals. No live prices or exchange conversion. |
| 11 | Estimated one-rep max | Reuses Epley, positive added-load sets of 1–10 reps, best daily observation within 90 days. New review view complements existing Strength Predictor. Not a safe-max prescription. |
| 12 | Recovery journal | Dated sleep/energy/soreness/pain/notes and food-log completion attestations; daily check-in and journal entries share one history. Manual reports, no sensors. |
| 13 | Exercise plateau detector | Three comparable dates spanning 14 days within 28 days; latest 1RM estimate <=102% of first flags plateau/decline review. No automatic load change or diagnosis. |
| 14 | Equipment upgrade planner | Current equipment/movement coverage, proposed items with manual cost/currency/priority/reason and status. Purchased planning status does not falsely add equipment to inventory. |
| 15 | Workout time analytics | Finished live sessions' elapsed wall-clock time, mean and separate manual-duration sum; excludes per-set live entries from manual totals. Rest/interruption included; no claim of verified active time. |
| 16 | Smart daily check-in | Observed food/protein/water/planned sessions plus explicit readiness inputs and local pain/low-readiness guidance. No AI or inferred medical finding. |
| 17 | Goal scenario simulator | Shared-profile hypothetical goal/rate with 5.1 guardrails, energy change and static timeframe approximation. Does not alter goal, deadline, food targets or weight. |
| 18 | Weekly fitness report export | Standalone JSON and offline HTML with dates, coverage, targets, recorded changes, recovery, costs and time. No photos/raw backup; browser print-to-PDF available, no native PDF service. |
| 19 | Data source center | Manual, illustrative and estimated data identified; nutrient sources, record counts and external-service boundaries shown. Existing per-source records retained. |
| 20 | Privacy/sync status | Actual service-worker control, caches, online indicator, local photo count, usage/persistent-storage status where available, snapshot download. Cloud sync/encryption/AI/native integrations explicitly not integrated. |

## Preservation and regression evidence

- Original storage key, legacy fields, unknown extensions and IndexedDB photo store retained. Optional six schema v1 is lazy; no startup write. Independent immutable pre-6.0 raw snapshot precedes first six save and is downloadable. Failed snapshots/primary writes, stale tabs and future/invalid data are blocked. New feature changes roll back in memory on failure. Pre-5.1 and pre-6.0 Git backups preserve source, not personal device records.
- Full app JSON export/import includes all new data. Photos remain separate; export both app and photo backups. Core import does not clear photos. Privacy erasure explicitly includes all release snapshots and existing photos.
- Cache generation v6-0-1 precaches every runtime module; waits for existing tabs to close and retains user storage. Close all old app tabs/windows and reopen online to activate the new release.
- 47 passing Node tests and six browser suites: old core, feature expansion, 5.0 live workouts/photo studio, 5.1 calculators and 6.0 capabilities. Includes formulas, bounded rates, sparse/deduplicated history, snapshots/quota errors, invalid/future schemas, stale tabs, backup round-trips, image/checksum/atomic restore checks, mobile layout, cache upgrade and offline reads/writes. Local Windows uses installed Chrome; GitHub CI uses Chromium. Isolated synthetic records/images only; personal saved data and camera not accessed.

## Pending external integrations

AI vision/coaching, nutrition/restaurant databases, live shopping/prices, cloud accounts/sync/backup, encryption, health wearables/Apple Health, native iOS/WidgetKit, background alarms and HEIC conversion remain **not integrated**. Real iPhone camera/hardware and live microphone/provider behavior are **not verified**. Optional browser storage and capture/speech capabilities depend on permissions/support; the new local features request none of these permissions. Existing opt-in speech/camera controls retain their documented boundaries.


---

# MacroPulse Complete Upgrade — 5.0

## 5.0: implemented offline PWA features

All 16 requested capabilities have local implementations. The previous 3.x/4.0 features below remain available. No backend, account or AI provider is configured.

| # | Capability | Shipped behavior and limits |
| --- | --- | --- |
| 1 | Live Workout Mode | Preview quick workout or saved routine day; readiness; per-set reps/minutes, added lb, effort and completion; foreground rest/elapsed timers; finish logs only checked sets. Calories remain zero unless logged separately. |
| 2 | Smart Weight Recommendations | Local history rules: repeat, small increase with recorded effort/reps, or reduce for low readiness/high effort. Uses listed individual lb/kg equipment loads where available; explicit Apply required. No starting load invented without comparable history; no plate-inventory solver or safe-load guarantee. |
| 3 | Pre-Workout Readiness | Sleep, energy, soreness and pain check before each live session. Pain blocks starting; low readiness displays recovery guidance. Manual check, no sensor inference. |
| 4 | Exercise Coaching Cards | Existing equipment library cues plus setup/control/stop guidance, accessible from live workouts and Favorites. Text only; no video or automated form analysis. |
| 5 | Workout Resume | Active plan, actual set values, completion, effort and notes reload from the existing local save. One active session per browser. Stale-tab writes are rejected. |
| 6 | Workout Auto-Save | Valid live input saved on every edit and checkbox change, with saved/error status. Partial invalid numeric input is not saved. Failed saves roll back the new extension in memory and preserve disk state. Foreground operation; no cloud sync. |
| 7 | Quick Workout Generator | Offline 5–60 minute previews matched to supported inventory, favorites and exercise exclusions. Estimated preparation/sets/rest fit budget; no generated log entries until performed and finished. |
| 8 | Exercise Favorites | Persistent library favorites prioritized within matching movement groups by quick generator. |
| 9 | Workout Notes | Autosaved session and exercise notes, retained in session history and backups; completed exercise notes also appear on generated log records. |
| 10 | Exercise Progression Ladder | Five manual steps per exercise, current step shown during training; explicit review and confirmation before advancing/resetting. No inferred readiness to progress. |
| 11 | Workout Comparison | Select two finished live sessions; completed sets and added-load rep-lb volume with change. Timed movements excluded from volume. Legacy history and Weekly Review retained; arbitrary old logs are not reconstructed into sessions. |
| 12 | Training Balance Alerts | Seven-day primary-muscle set summary; missing supported groups flagged after six classified sets. Shows unclassified count. Missing logs are not proof of inactivity or a medical finding. |
| 13 | Custom Challenges | Named, dated targets for training days, sessions or sets, calculated from actual history. Legacy entries count individually for session targets; no fabricated exercise records. |
| 14 | Detailed Home Gym Inventory | Add/edit/remove named items, supported type, quantity, available individual loads or band levels, units and limitations. Supported types participate in quick matching; custom Other remains descriptive. Legacy equipment/routines unchanged. Quantity is recorded, not a guarantee of all safe movement setups. |
| 15 | Recovery/Backup Verification | Separate immutable raw snapshot before first 5.0 save; export it in an importable version-1 envelope. Schema validation and SHA-256 calculation for downloaded workout backups without restoring them. Existing confirmed import/recovery paths retained. Photo backups verify checksum, records and decodable images; restoration is atomic/add-only. |
| 16 | Photo Progression Studio | Private timestamped front/side/back photo file/camera capture, view-filtered timeline, side-by-side/slider comparison, optional recorded measurement overlays and reference grid, manual pan/zoom saved per photo, slideshow, comparison PNG and full/per-photo backup export. IndexedDB stores re-encoded JPEGs on-device. Explicit consent, file validation, storage estimate/persistence request, per-photo/all-photo deletion, verified add-only backup merge. |

### Data and privacy boundaries

- The original `macropulse_pwa_v1` key and all old record shapes are retained. Optional `five.version = 1` is created only on an explicit action; no startup writes. `macropulse_pwa_v1_before_five` captures the pre-5.0 raw record even when earlier snapshots already exist. Invalid/future schemas, failed snapshot writes and stale tabs block saves.
- Standard workout JSON includes all live sessions, notes, favorites, inventory, ladders and challenges. **Progress photos are separate: export both workout JSON and photo JSON.** Core JSON import never removes or replaces photos.
- Photos are in `macropulse_photos_v1` IndexedDB, store `photos`, version 1. Uploaded JPEG/PNG/WebP ≤12 MB is re-encoded to JPEG ≤1600px, discarding original metadata; timestamp is explicitly saved as UTC and displayed locally. Original source files remain outside the app. HEIC requires external conversion.
- Data and downloads are unencrypted. No photo uploads, tracking, body detection, estimated measurements or AI analysis. Same-browser-profile access, browser eviction and device loss remain risks. Persistent-storage permission is optional and not an independent backup. Photo import accepts ≤200 MB files; large collections can be exported one photo at a time. Merge skips existing IDs and never overwrites them.
- Erase in Privacy Center explicitly includes progress photos and recovery copies. Photo-only deletion leaves workout history intact. Downloaded files and copies on other devices remain under user control.
- All local screens work offline after service-worker installation. Updates wait for existing tabs to close, retain localStorage/IndexedDB, and cache all 5.0 modules. Browser camera/file chooser permissions and capabilities vary. Real camera access, iPhone hardware, HEIC conversion, native iOS/WidgetKit, background notifications, cloud backup, encrypted vault, backend AI and external services are **not shipped**.

### 5.0 verification

32 Node tests and four browser suites cover existing 3.x/4.0 functionality, additive migrations/unknown fields, quota failures, future versions, stale tabs, actual per-set logging, autosave/resume, favorites/inventory/challenges/notes/ladders/comparison, photo views/timestamps, comparison/overlays/alignment/slideshow/PNG export, verified photo backup merge and corruption rejection, workout verification, offline reload, preserved old records and narrow mobile layout. Browser checks use synthetic data and image files in isolated profiles, never a user's real saved data or camera. Local Windows checks use installed Chrome because the bundled Chromium executable cannot launch in this environment; CI uses Chromium.

## Requested 15-feature expansion · 4.0.2

| # | Requested capability | Actual implementation and limits |
| --- | --- | --- |
| 1 | Smart Goal Engine | Weight and weekly training-day goals, editable deadlines, 25/50/75/100% milestones and recorded weight trends. Deadline suggestions require three dates over seven days; changes require user edits. No automatic calorie prescriptions. |
| 2 | Interactive muscle map | Keyboard and pointer controls for chest, back, quads, glutes and core; exercise cues and recorded volume. Schematic, not an anatomical diagnostic. |
| 3 | Voice workout assistant | Opt-in browser speech fills a command field; explicitly apply sets/reps/rest commands, review a workout draft and confirm logging. Typed fallback always available. Speech API, permission, language and provider connectivity vary. Timer works in-page only. |
| 4 | Consistency calendar | 35 local dates with actual workout entries, meals and planned sessions; no inferred inactivity. |
| 5 | Smart replacement | Matches movement group and available equipment, excluding specific movements the user chooses to avoid. Existing routine substitution controls remain available. No injury diagnosis or medical suitability inference. |
| 6 | Training volume | Seven-day primary-muscle sets, reps and sets × reps × added lb. Known exercise names only; unclassified count shown, cardio excluded and secondary muscles not double counted. |
| 7 | Strength predictor | Epley estimated 1RM from comparable positive-load sets of 1–10 reps; three dates over seven days within 90 days. Trend projection capped at six months. No guaranteed milestone or safe lifting recommendation. |
| 8 | Program library | Three offline equipment-adapted programs, session previews, explicit application, archive and restore of the previous equipment routine. No training log fabrication. |
| 9 | Voice meal logging | Opt-in speech or typed `2 servings of Chicken Breast`, exact library lookup, macro preview and explicit confirmation. Unknown foods are rejected. No unrestricted natural-language nutrition inference. |
| 10 | Restaurant finder | **Partial:** search locally saved, sourced menu items by restaurant/name and calorie ceiling; review serving/source/date and confirm logging. **Live restaurant discovery and database lookup are not connected.** They require a provider/API and possibly credentials, backend and location permission. |
| 11 | Food photo logging | **Manual fallback:** temporary local image preview, user-selected food and estimated servings, calculated macro preview and confirmed logging. **Automatic image recognition/nutrition estimation is not connected.** AI vision requires a provider, secure backend/credentials, upload consent and accuracy validation. Photos are not uploaded or persisted. |
| 12 | Nutrition quality | Logged protein and sourced fiber/sodium/calcium/iron totals, with per-nutrient coverage and source labels. Missing data is unknown; no deficiency claims. Users must transcribe reliable values themselves. No external nutrient database is connected; built-in food macros remain illustrative. |
| 13 | Workout/meal templates | Save dated log snapshots; apply on a chosen date only after confirmation; delete templates without deleting history. Existing templates remain. Repeated application creates new entries and warns accordingly. |
| 14 | Weekly review | Last seven days vs prior seven: training days, sets, meal logging, logged-day calorie averages, goal progress and rule-based next steps. No cloud AI. |
| 15 | Accessibility/personalization | Larger text, high contrast, reduced motion, start page, visible keyboard focus, keyboard map, modal focus trap/Escape and inert background. Preferences persist in backups. Tested at a narrow mobile viewport; no claim of a formal accessibility audit. |

All local features work offline after the current service worker is installed. Browser speech may need network access and may send audio to the browser provider only when the user starts dictation and grants permission. No native iOS app, WidgetKit extension, Apple Health connection, cloud account, backend or external credentials are supplied. Browser tests mock recognition results and permission errors; live microphone accuracy and iPhone hardware are not verified.

The `complete` extension has its own schema version, remains optional on legacy data, and is included by existing exports/imports. Its first save retains an additional `macropulse_pwa_v1_before_complete` raw snapshot even when an older pre-upgrade snapshot exists. Settings → Data Privacy Center → Download before feature expansion exports it. Quota/write failures abort before primary data replacement; recoveries remain local until downloaded.

## Previously shipped upgrade (preserved)

All entries and features below work locally in the installable PWA unless a limitation is explicitly stated. No AI, cloud account, credentials or subscription is configured.

| Approved feature | Shipped PWA behavior | Integration boundary |
| --- | --- | --- |
| Daily Fitness Command Center | Existing calories, macros, supplements and activity plus today's planned sessions, meals, hydration, habits and recovery guidance | No health-device feed |
| Adaptive Workout Scheduler | Equipment routine scheduled across a week, readiness and recent difficulty rules, conflict avoidance, reschedule/skip/done and saved session snapshots | Local rules; no AI trainer or calendar sync |
| Body Transformation Dashboard | Recorded weight history, change from first check-in, goal progress, recent average, waist measurements and notes | No inferred body-fat percentage or photo analysis |
| Smart Meal Builder | Library/custom ingredients, serving multipliers, macro totals, remaining-target comparison, dated plans and explicit nutrition logging | Example food values; no barcode or AI scanner |
| Workout difficulty feedback | Easy / just right / hard on recent workout entries; feeds recovery and scheduling | Manually entered |
| Automatic warm-up builder | Three-minute movement preparation based on the selected routine day's movement groups | Text guidance |
| Deload planner | Recent hard sessions or frequent training trigger guidance; halved-set session previews; adaptive weeks suggest lighter sessions | Manual load selection; previews preserve the original routine |
| Exercise form review | Local video playback, movement cues, self-review checklist, persistent notes | **Manual review only.** Automated AI assessment, coaching uploads and video persistence are not implemented |
| Plate / weight calculator | lb/kg, custom bar and plate sizes, balanced per-side combinations and unloaded remainder | Assumes sufficient plate pairs; does not infer physical inventory |
| Workout supersets | Persistent pairs in equipment routines, alternate-set instructions, rest guidance and unpairing | Individual exercises still logged separately |
| Habit / streak tracking | Custom habits, daily toggles, calendar streaks, removal | No background reminders |
| Hydration tracking | Quick/custom drinks, daily target, progress and undo | Manual local log |
| Smart grocery list | Date-range meal ingredients consolidated by food/serving, quantities, checklist and clipboard export | No live prices, pantry database, delivery or retailer link |
| iPhone Lock Screen widgets | In-app quick view and Home Screen links only | **Native Lock Screen widgets are not implemented.** A native iOS app, WidgetKit extension, shared storage and iOS build/signing are required |
| Data privacy center | Full/raw/recovery exports, local storage explanation and explicit confirmed erasure | No cloud copy, encrypted vault or account-deletion service |

## Existing functionality

Includes the equipment/routine work from `codex/equipment-routines` (previously separate from live 3.1), exercise substitutions and rest timer. Preserves nutrition, custom foods, workout templates/logs, supplements, weight/progress, goals and version-1 JSON backup compatibility.

## Data and update safety

- Keeps `macropulse_pwa_v1` and its existing record shapes. Upgrade data is an optional, versioned `upgrade` extension created on first use. Unknown extension fields survive saves and backup imports.
- Does not write at startup. Invalid/corrupt data or a future upgrade schema blocks saves instead of overwriting the original raw value. Privacy Center can download it.
- Before the first new-version save, retains the existing raw value in `macropulse_pwa_v1_before_upgrade`. Imports validate first, ask before replacement, then retain current raw data in `macropulse_pwa_v1_recovery` before writing. A recovery-write failure aborts the replacement.
- Recovery copies use the same browser and are not independent backups. Export files regularly. A subsequent import replaces the pre-import recovery slot.
- Service worker precaches all runtime files using fresh network requests, bypassing stale browser HTTP assets. An update waits until older tabs close; it does not erase localStorage. Close all MacroPulse tabs/windows and reopen online after deployment to activate a pending release.
- Changing equipment clears the original generated routine as before. Scheduled snapshots are preserved; viewing a session checks current equipment and asks for a new plan if required items are no longer available.
- Marking a scheduled day complete does not fabricate exercise/calorie logs. Planned meals are explicitly logged once, on their chosen date. Removing a meal plan does not delete nutrition history.

## Validation

`npm test` runs legacy data round trips, malformed payloads, write failures, upgrade snapshots, routine combinations, streaks, readiness/recovery, warm-ups, plate loading, meal quantities, grocery grouping and transformation calculations.

`npm ci && npx playwright install chromium && npm run test:browser` runs isolated Chromium scenarios: mobile feature interactions, legacy preservation, exports/import recovery, offline reload, corrupt-storage protection, layout overflow and an upgrade from a 3.1-style cache with stale HTTP assets. GitHub Actions also installs Chromium dependencies and retains a mobile screenshot. These tests use synthetic records, never a person's browser storage.

Actual iPhone hardware, native WidgetKit behavior and external AI/cloud services are outside this test suite and are not claimed as live.
