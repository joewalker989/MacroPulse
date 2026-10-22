# MacroPulse 9.1 — reviewed encrypted sync and weighed recipes

## Implemented

- Opt-in device/cloud three-way record merging, using encrypted account-specific baselines in a separate IndexedDB store. Account tokens and encryption passphrases remain in memory.
- Independent diary, workout, hydration and weight records merge by stable identities. Unknown fields survive. Duplicate identities and ambiguous arrays require review rather than being collapsed.
- Conflicting edits and one-sided deletions require an explicit device/cloud selection. Concurrent target/profile changes and active workouts are reviewed as whole units. Concurrent stock-ledger changes require whole-app review so inventory quantities and movements stay together.
- Both original app snapshots are encrypted and archived before conflict resolution. The recovery list downloads encrypted files for the existing reviewed backup restore workflow. Private storage ownership policies apply to the account's `records/` folder; no new table or schema migration is required.
- Revision compare-and-swap rejects a newer cloud change. Edits made during transfer are rebased or retained locally for another preview. Existing raw local recovery snapshots remain in use.
- Automatic non-conflicting record sync is available after the first reviewed merge, while this signed-in app is open. Conflicts stop it. Photo originals and edits remain separate encrypted versions; there is no automatic photo merge.
- Forgetting a derived local sync baseline requires confirmation and leaves app records, photos and cloud backups intact. This supports fresh review after a passphrase/baseline mismatch.
- A weighed ingredient recipe calculator uses explicitly selected saved USDA foods, reviewed gram weights and recipe yield. It retains food sources and preparation names, computes per-portion macros and supplied nutrients, and marks incomplete nutrient coverage. Missing nutrients are not zero-filled. It does not infer cup/spoon weights, raw-to-cooked conversions or allergy suitability.
- Reviewed recipes enter the existing recipe builder and weekly planner. Ordinary recipe portion logging continues through the existing macro calculator. Detailed nutrient estimates remain attached to the saved recipe; they are not automatically copied to every diary entry.

## Preservation and validation

No existing app or photo schema is replaced. Sync metadata is separate and encrypted; photos retain their existing IndexedDB store. The optional recipe metadata is additive. No personal health record, account credential or real progress photo is included in source or synthetic tests.

Unit coverage includes independent additions, food tuple identity, deletion review, same-record conflicts, atomic settings/workouts, duplicate dates, stock ledgers, late edits, unknown/prototype keys, weighed portions, incomplete nutrients and unit mismatch rejection. Browser coverage uses two isolated devices and an encrypted revision-checked server fixture: initial review, no-op sync, separate diary additions, automatic pull, target conflict selection, encrypted original recovery, restart baseline recovery, stale cloud rejection and baseline reset without app-data changes. Recipe browser coverage checks review invalidation after ingredient edits and integration with the existing planner.

All 124 unit tests and 16 browser suites passed locally. GitHub PWA checks and iOS/widget/Watch simulator builds also passed on the implementation commit (PWA run 39680048088; Apple run 39680048252). Separate live Supabase browser tests used two disposable accounts: actual encrypted record transfer, owner recovery upload/list/download/decryption, immutable recovery rejection, stale revision rejection and cross-account record/recovery denial all passed. Test sessions were signed out; cleanup confirmed zero remaining test accounts and storage objects. Final deployed-file verification is recorded with the release handoff.

## Still requires external setup or device verification

| Area | Actual remaining work |
| --- | --- |
| AI meals and menus | Secure provider key/model configuration and a successful real request. |
| Strava | Registered developer application, server credentials and real user authorization. |
| Apple native features | Signing team, installed iPhone/Watch companion, physical-device Health permissions, widgets, Live Activities and notification verification. Simulator compilation alone is not device integration. |
| Apple Health through Freddy | The connected chat tool reports an Apple Health source, but available totals were older/incomplete and updates must be pushed by the iPhone app. This is not a continuous connection inside MacroPulse. |
| Additional fitness providers | Direct Fitbit/Garmin/Android Health Connect adapters and authorization remain unimplemented. Existing standard CSV imports remain available. |
| Cloud | New-user email delivery/confirmation and production multi-device acceptance remain user acceptance tasks. Automatic sync requires an open signed-in app; there is no closed-app/background merge. |
| Auth password protection | The existing project's leaked-password protection remains disabled; enable it in Supabase Auth settings. No settings administration capability was available here. |
| Recipes | Food matching and grams require review. No automatic ingredient recognition, household-unit conversion, live grocery pricing or medical diet verification. |

Earlier release notes remain historical. See RELEASE_9_0.md and INTEGRATION_SETUP.md for credential and native setup instructions.
