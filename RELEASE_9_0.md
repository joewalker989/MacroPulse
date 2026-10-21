# MacroPulse 9.0 — encrypted accounts and reviewed planning

## Implemented in this release

- Optional Supabase email account controls; session tokens stay in memory. No account request or upload happens on startup.
- Client-encrypted app backups and separate immutable encrypted photo versions, using AES-GCM and PBKDF2-SHA256 with random salt/IV. The passphrase is never uploaded. Losing it makes those backups unrecoverable.
- Cloud revision checks reject conflicting writes. Restoring records requires preview and confirmation, retains the previous raw JSON recovery copy and leaves photo storage unchanged. Photo restores add missing IDs only.
- Automatic record backups while the signed-in app is open. Photos have a separate explicit backup control. This is snapshot backup/restore, not automatic multi-device merge or background synchronization.
- Encrypted app backup files, independently usable without cloud sign-in.
- USDA per-100 g food search, all supplied nutrients and reviewed diary portions. Public DEMO_KEY mode is rate limited; production server lookup requires a USDA key. No claim of complete nutrient coverage.
- Weekly recipe planning with explicit per-portion prices, diet tags, ingredient exclusions, checked allergen metadata, hard total budget and visible calorie/protein shortfalls. Plans enter the meal calendar only after review; they do not mark food eaten.
- Training-block calendar snapshots and reviewed day startup, retaining readiness/equipment checks and deload sets.
- Server-side structured meal/photo/menu estimate requests, per-request input consent and mandatory manual nutrition review. These require an AI provider key and model; they are not live until configured and a real request succeeds.
- Apple companion source and native bridge for reviewed HealthKit imports, Watch workout controls/real workout collection, widget water queues, Live Activities, hydration notifications and device authentication. See `native/apple/README.md` for signing, separate-storage migration and device verification requirements.
- Licensed online exercise player with 78 credited wger clips across 46 movements (24 H.264; 54 HEVC). Original media stream only after selection; actual publisher metadata loaded successfully in a browser. Offline illustrations remain available. See VIDEO_SOURCES.md for per-media attribution and limits.
- Cross-browser barcode-picture decoding with a pinned, hash-verified ZXing download, checksum review and offline reuse. An actual barcode image decoded successfully using both the downloaded runtime and the offline cache; tampered cache execution was rejected.
- Read-only Strava browser OAuth implementation with account-bound, expiring, single-use state, encrypted server-only tokens, refresh/revoke and serialized provider operations. Provider credentials are not configured, so no real Strava connection is claimed.
- Restricted signed-in server recipe retrieval for four publishers, with redirect/host/size checks and passive Recipe JSON-LD review. Publisher blocks and missing nutrition remain explicit.

## Backend verification

Used the existing connected Supabase project without changing its existing `public.docs` table. Applied additive private snapshot/quota migrations and private photo bucket policies. Deployed the authenticated `mp-services` function. Real transactional isolation tests verified owner-only reads, cross-account update rejection, revision compare-and-swap conflict behavior and client denial of the server-only quota function; synthetic transaction data was rolled back. The deployed function rejected an unauthenticated request with HTTP 401.

Additional live browser tests signed in through Supabase Auth with two disposable accounts, completed encrypted record/photo transfers, rejected stale revisions, denied cross-account record/photo access and confirmed missing AI/Strava credentials return unavailable. Test objects and accounts were removed; cleanup confirmed zero remaining. A real USDA demo request returned HTTP 200 with a food ID and nutrients through browser CORS.

Supabase's security advisor reports leaked-password protection disabled for this existing project. Enable it in Auth settings: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . No Auth settings administration tool was available to change it here.

## Precise remaining boundaries

| Area | Actual status |
| --- | --- |
| Encrypted cloud backup | Backend deployed; real signed-in record/photo transfers, account isolation and stale revision rejection verified with disposable accounts. New-user email confirmation/delivery still needs user acceptance. No automatic conflict merge. |
| AI meal/menu/description | Server/client implementation and mocked provider/consent tests. OPENAI_API_KEY and OPENAI_MODEL must be securely configured in Supabase Edge secrets; no real AI request verified. |
| USDA | Public limited mode and full nutrient adapter implemented. Production USDA_API_KEY is not configured. |
| Apple Health | Native source/bridge plus existing local XML import. Signed installation and physical-device read permission verification pending. No browser HealthKit access. |
| Watch | Native HealthKit workout source; signed installation/pairing and physical metrics pending. No fabricated metrics. |
| Widgets/Live Activities | Native source; signing, device authorization and device verification pending. No web substitute advertised as native. |
| Notifications/biometrics | Native source; device permission and actual delivery/authentication pending. Local data is not encrypted by a privacy screen. |
| Strava/Fitbit/other providers | Strava read-only OAuth source and mocked contracts implemented; registration, credentials and actual provider authorization remain pending. Google Health/Fitbit and Garmin adapters are not implemented. Standard CSV imports remain available. |
| Android Health Connect | No Android native implementation. |
| Safari barcode camera | Barcode-picture fallback implemented and verified with actual ZXing decoding/offline reload. Real iPhone camera/library focus and HEIC behavior are not device-verified. Live video still depends on native BarcodeDetector. |
| Recipe URLs | Browser import and four-publisher server retrieval implemented. No arbitrary URL proxy or ingredient-level nutrient calculation. Publisher delivery not guaranteed. |
| Filmed exercise library | Licensed embedded online catalog: 78 clips/46 movements, with attribution and codec filters. It does not cover every variation or provide offline video. Actual H.264 publisher metadata loaded; every clip/device is not individually verified. |
| Weekly meal planning | Uses the user's recipes/prices/tags; no verified allergy database, medical diet optimizer or live grocery pricing. |

## Data preservation and tests

The optional `plus` schema is lazy and additive. Its first save retains the exact prior JSON at `macropulse_pwa_v1_before_9`; future versions and recovery-copy failures block writes. Existing diary, workout, supplement, measurement and progress-photo stores retain their formats. Existing offline shell caching includes the new browser modules.

The original 89 unit tests passed; new tests cover encryption/tampering, cloud conflicts, planning, native stale commands, barcode checksums, provider state/token isolation and recipe redirect/size protection. Provider mocks verify contracts, not real provider availability. The iOS/widget and Watch simulator builds passed in [Apple build 39529238197](https://github.com/joewalker989/MacroPulse/actions/runs/39529238197). Initial 99 tests and 13 browser suites also passed in [PWA check 39529238147](https://github.com/joewalker989/MacroPulse/actions/runs/39529238147). The final release adds barcode and provider checks; final CI/deployed verification is recorded separately.

## All 20 competitor gaps, reconciled

| # | Capability | Shipped versus remaining |
| --- | --- | --- |
| 1 | Searchable food database | Open Food Facts lookup and sourced USDA demo search; USDA actual request verified. No claim of universal database coverage. |
| 2 | Barcode scanning | Native detector plus local barcode-picture fallback. Actual decoder/offline/tamper tests pass; physical iPhone live camera remains unverified. |
| 3 | Label OCR | On-device English OCR with mandatory review and offline verified models. |
| 4 | AI meal photos | Implemented client/server drafts and consent tests; provider key/model and real response pending. |
| 5 | Natural-language food entry | Existing exact-food local parser plus AI description adapter; real AI activation pending. |
| 6 | Recipe importing | Reviewed JSON-LD/browser imports plus restricted server retrieval; no automatic ingredient nutrition engine. |
| 7 | Weekly dietary meal planning | Saved recipes, explicit costs/tags/allergens, budget cap, shortfall review and calendar save. No verified medical diet/allergen guidance or grocery-price feed. |
| 8 | Detailed nutrients | Imported product nutrients plus all supplied USDA nutrients; missing values stay unknown. |
| 9 | Adaptive expenditure | Existing complete-log/weight gates and reviewed target proposal with floors/change limit; not a measured metabolism. |
| 10 | AI restaurant menus | Implemented server/client transcription drafts; provider activation and real scans pending. Official restaurant nutrition is not inferred. |
| 11 | Exercise video library | Offline illustrations plus 78 licensed publisher clips/46 movements in an embedded online player. H.264/HEVC filtering, attribution and actual publisher loading verified. Some movements/devices remain uncovered; no offline video or form assessment. |
| 12 | Set types and RIR | Implemented and preserved through finished logs. |
| 13 | Training programs | Snapshots, deload weeks, full-block calendar and reviewed day execution. Automatic load increases remain proposals. |
| 14 | Automatic rest | Existing foreground automatic rest on completed sets; no web background alarm promise. |
| 15 | Account/cloud backup | Real encrypted record/photo round trip, private account isolation and revision conflict rejection verified. Session-open automatic record backup only; no automatic merge/background sync. |
| 16 | Health/fitness integration | Existing XML/CSV imports, compiled HealthKit companion and Strava OAuth source. Signed Apple device/provider authorization not yet verified; Google Health/Fitbit/Garmin not connected. |
| 17 | Watch | Watch target compiles; actual device pairing, metrics and command delivery pending. |
| 18 | Widgets/Live Activities | iOS/widget target compiles; signed installation and device acceptance pending. |
| 19 | Reminders | Existing calendar export and compiled native seven-day notification scheduler; actual device permission/delivery pending. |
| 20 | Privacy/security controls | Existing passphrase screen, verified encrypted backup files/cloud payloads and compiled native device-authentication screen. Local web storage remains unencrypted. |

Secure activation steps and provider boundaries are in [INTEGRATION_SETUP.md](INTEGRATION_SETUP.md). Credentials, native signing/device tests, provider review, licensed media and the explicit unimplemented adapters above are not described as shipped integrations.
