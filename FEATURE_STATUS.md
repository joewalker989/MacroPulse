# MacroPulse implementation status — 3.2

This release is an incremental PWA upgrade. A feature is only usable in production after these changes are merged and deployed. No accounts, backend or paid services are configured.

## Implemented in this increment (browser/PWA)

- My Equipment: seven supported equipment types plus saved custom names. Bodyweight requires no inventory. Custom names do not unlock automatic exercise matches.
- Local rule-based routine generation: 3–6 days, strength/build muscle/general fitness, 20/30/45/60 minute budgets, core/cardio preferences. Short sessions reduce sets and may omit movement groups; the order rotates across days. Times are estimates, not scheduled sessions or workout prescriptions.
- Equipment-filtered exercise library with 18 text technique cues. Same movement-group substitutions; no video or animated demonstrations.
- Open a planned exercise in the existing manual log with sets/reps and duration prefilled. User enters weight and saves each exercise separately. Cardio uses duration and one placeholder rep in the existing log model. This is not a complete session builder or per-set tracker.
- Rest countdown while the app is open, based on elapsed wall-clock time. No background alarm, push service or notification permission.
- Emerald styling added to the existing responsive dark interface.
- Existing storage key and records retained. Equipment and routines included in existing JSON backups. Legacy backups still import. Unreadable local data is not overwritten by normal saves.
- New training files included in the service-worker app shell. Updates activate after existing app tabs close; no deletion of other applications' caches.

## Existing features retained

Manual meals, custom saved foods, food search, manual sets/reps/weight and active calorie entries, daily supplement checklist, weight check-ins, seven-day calorie bars, local storage, JSON backup export/import. Imported backups replace current data after confirmation. Browser storage may be cleared by the OS/browser; backups remain important.

## Approved backlog and requirements

| Feature | Actual status | Platform / remaining requirement |
| --- | --- | --- |
| Full workout/session builder; per-set results | Partial: generated routines plus manual exercise log | PWA-compatible; needs session model/editor and migration |
| Calendar, personal records, strength charts | Pending | PWA-compatible; derive from dated workout history with clear units |
| Progressive overload | Pending | PWA-compatible; needs performance history and reviewed progression rules |
| Muscle tracking and recovery | Partial: movement groups shown; no muscle volume or recovery score | PWA-compatible; needs muscle mapping and recovery inputs |
| Exercise demonstrations | Pending; text cues only | Licensed video/animation assets and offline asset policy |
| Nutrition serving adjustment | Pending; existing foods use a single serving | PWA-compatible; scale calories/macros consistently |
| Favorites and full nutrition history | Partial: saved food library and today's meals | PWA-compatible; needs explicit favorites/history interface |
| Barcode scanning / product lookup | Pending | Browser camera support varies; requires product database/API, permission and manual fallback |
| Label recognition | Pending | Local OCR or external recognition service plus user verification; never present inferred macros as verified |
| Body measurements and progress photos | Pending; weight history already exists | PWA-compatible; photo storage/migrations and backup size strategy needed |
| AI coach | Pending; planner is not AI | Needs authenticated backend, model API, privacy controls and cost limits; no client API keys |
| Reminders | Pending; foreground rest timer only | In-app reminders can be local; reliable scheduled/background alerts require supported push infrastructure or native app |
| Apple Health | Not connected | Native iOS HealthKit integration, entitlement and user permission; unavailable directly to this static PWA |
| FitIndex | Not connected | Verify vendor API/SDK/export availability and authorization; may require native bridge or documented import path |
| Secure cloud sync | Not implemented | Authentication, authorized per-user storage, conflict resolution and infrastructure |
| Backups / offline support | Local JSON backups and cached app shell implemented | Encrypted cloud backups and cross-device restore pending; offline cache requires one successful online load |

## Verification

Run `npm test` with Node 22 or newer; no packages required. Generator coverage includes 576 preference/inventory combinations, equipment prerequisites, time budgets and invalid inputs. Data tests cover legacy records, unrelated extension fields, extended/legacy backup round trips and rejected malformed backups. Browser smoke checks are documented in the PR. Physical iPhone testing, production deployment and native integrations are not verified by these tests.
