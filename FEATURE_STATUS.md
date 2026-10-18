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
