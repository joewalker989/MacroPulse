# MacroPulse 9.4 — guided second-device setup

The guided portion of roadmap item 10 is implemented. **The user's own physical-device acceptance, email delivery/confirmation and account recovery remain pending.** Automated browser sessions and a disposable confirmed account do not establish those results. Items 1–7 and 9 remain shipped; native Apple Health (8) is deferred because Mac/Xcode and an Apple Developer team are unavailable.

## Implemented

- Settings → **Set up another device** walks through original/additional device roles, independent app and photo backups, same-account sign-in, separate passphrase entry, reviewed merging, cloud verification and explicit photo transfer. The guide never uploads merely by opening or checking a box. Checklist acknowledgements are session-only, user-supplied confirmations.
- Additional-device setup requires an existing cloud copy before applying a merge through the guide. Existing records participate in conflict review. Automatic sync remains separately opt-in and works only while the signed-in app is open.
- A new read-only verification downloads and decrypts the cloud snapshot, then compares it with the current app records. It records the revision/time for this session. Local edits, another tab's saved data, account/passphrase changes and new merges invalidate verification. It makes no claim about an unobserved physical device or photos.
- Keyed record merges retain cloud ordering when all merged records already match it. This fixes repeated order-only differences after independent device additions and rebasing, without dropping records, mutating inputs or relaxing deletion/conflict review. Ordered non-keyed arrays and protected whole-record conflicts retain their existing behavior.
- Stale browser tabs cannot start sync/verification or upload an outdated in-memory backup. A tab change during transfer preserves the newer local data and requires a fresh review.
- Account or passphrase changes clear old cloud/file/photo previews, cached backup hashes, revision and photo-upload bookkeeping. Photo previews are bound to their account, selected version and passphrase session. Photo list/preview/restore operations are serialized with other transfers. Existing photo IDs and edits remain unchanged by add-only restore.
- Photo backup verifies the existing app snapshot can be decrypted first. An existing immutable photo version is checked with the current passphrase and checksum before it is counted as backed up. This is not an automatic encryption-passphrase rotation feature; retain the original passphrase for existing encrypted backups.

## Verification

- 145 unit tests, including exact multi-device convergence and retained deletion/conflict protection.
- 20 browser suites, including a new two-device walkthrough suite covering no startup/preview writes, backup download, empty-cloud protection, wrong passphrase, reviewed merge, read-only verification, encrypted/add-only photos, session reset, stale tabs, offline messages and 320-pixel layout.
- Real backend verification used two isolated browser stores, a disposable confirmed account, synthetic records and a generated image. Reviewed records converged exactly; both sessions independently verified the cloud copy; a photo was decrypted for review and added explicitly. Temporary records, photo objects and sessions were cleaned after each run. Final publication evidence is recorded separately.

No database migration, native activation, new provider credential or change to canonical app/photo storage is included. Existing recovery snapshots, separate photo backups, unknown fields and offline tracking remain in place.

## Remaining acceptance

On the user's own devices: keep independent backups, confirm email/sign-in/recovery, complete the walkthrough on both devices, compare recent food/workout/weight/water entries, inspect photo views/dates/annotations, test wrong-passphrase and conflict recovery, and check behavior after reopening. Photo counts alone do not establish identical edits. Until these checks are actually performed, roadmap item 10 remains partially complete. Item 11 is the next unblocked implementation: multi-select food results.
