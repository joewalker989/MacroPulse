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

## Backend verification

Used the existing connected Supabase project without changing its existing `public.docs` table. Applied additive private snapshot/quota migrations and private photo bucket policies. Deployed the authenticated `mp-services` function. Real transactional isolation tests verified owner-only reads, cross-account update rejection, revision compare-and-swap conflict behavior and client denial of the server-only quota function; synthetic transaction data was rolled back. The deployed function rejected an unauthenticated request with HTTP 401.

Supabase's security advisor reports leaked-password protection disabled for this existing project. Enable it in Auth settings: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . No Auth settings administration tool was available to change it here.

## Precise remaining boundaries

| Area | Actual status |
| --- | --- |
| Encrypted cloud backup | Backend deployed; cryptography, conflict handling and browser review flows tested. A real signed-in user backup/restore and email confirmation still require account acceptance. No automatic conflict merge. |
| AI meal/menu/description | Server/client implementation and mocked provider/consent tests. OPENAI_API_KEY and OPENAI_MODEL must be securely configured in Supabase Edge secrets; no real AI request verified. |
| USDA | Public limited mode and full nutrient adapter implemented. Production USDA_API_KEY is not configured. |
| Apple Health | Native source/bridge plus existing local XML import. Signed installation and physical-device read permission verification pending. No browser HealthKit access. |
| Watch | Native HealthKit workout source; signed installation/pairing and physical metrics pending. No fabricated metrics. |
| Widgets/Live Activities | Native source; signing, device authorization and device verification pending. No web substitute advertised as native. |
| Notifications/biometrics | Native source; device permission and actual delivery/authentication pending. Local data is not encrypted by a privacy screen. |
| Strava/Fitbit/other providers | Live OAuth is not implemented or configured. Requires registered provider apps, secure server credentials and actual authorization tests. Standard CSV imports remain available. |
| Android Health Connect | No Android native implementation. |
| Safari barcode camera | Still depends on native browser BarcodeDetector. No cross-browser decoder fallback shipped. Manual barcode lookup remains available. |
| Recipe URLs | Existing CORS-dependent URL/JSON-LD import; no general server scraper or ingredient-level nutrient calculation. |
| Filmed exercise library | Existing illustrated movements and external demonstration references; no newly licensed complete embedded filmed library. |
| Weekly meal planning | Uses the user's recipes/prices/tags; no verified allergy database, medical diet optimizer or live grocery pricing. |

## Data preservation and tests

The optional `plus` schema is lazy and additive. Its first save retains the exact prior JSON at `macropulse_pwa_v1_before_9`; future versions and recovery-copy failures block writes. Existing diary, workout, supplement, measurement and progress-photo stores retain their formats. Existing offline shell caching includes the new browser modules.

Validation record will be updated after the full browser run, native build and deployed asset checks. Provider mock tests verify contracts, not live provider availability.
