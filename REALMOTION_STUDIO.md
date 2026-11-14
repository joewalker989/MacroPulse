# RealMotion Studio audit and release gate

Audited baseline: `4ee54497c3dab1ca0d630945afb800dc80cbb8cc` (2026-11-13).

## Existing app and data

MacroPulse is a static mobile PWA, with no build step. Fitness contains Workouts,
equipment-filtered routines, templates, live sessions, and manual workout history.
`workout-visuals.js` supplies original simplified offline SVG pictures for 26 movements.
The existing video library contains 78 publisher streams for 46 named movements,
24 H.264 and 54 HEVC. There are no bundled trainer video or audio files.

`data.js` owns `macropulse_pwa_v1`, recovery snapshots, validation, and preservation
of unknown fields. RealMotion must not write any app data or migrate this schema.
Playback preferences are ephemeral. Existing routines, demo IDs, import/export,
photos, synchronization, and logs remain on their original paths.

`sw.js` caches the app shell only; publisher streams are cross-origin and bypass it.
Do not add video downloads, full-video caching, cache-all fetches, or broad cache
deletion. New shell files need a distinct shell cache; activation continues to wait
for old tabs to close. OCR/barcode caches and local/IndexedDB user data are preserved.

## Media and review audit

`VIDEO_SOURCES.md` and the immutable catalog record Goulart / CC BY-SA 4.0 for
publisher videos and separate authors/licenses for exercise-name metadata. Keep
source, author and license visible before loading. The repository has no general
LICENSE file; this work does not grant new rights to third-party media.

The catalog is a 2026-10-20 snapshot, not a fresh clearance or anatomical review.
Attempts to re-fetch wger records 17 and 48 on 2026-11-13 through the web reader
failed. CC's deed was accessible: https://creativecommons.org/licenses/by-sa/4.0/ .
It requires attribution and identification of changes, and ShareAlike for adaptations;
it does not guarantee publicity/model releases. No new clips, derivatives, synthetic
motion, or claims of medical/professional review are introduced.

Pilot inventory:

| Exercise variant | Existing candidate | Limitation |
| --- | --- | --- |
| Dumbbell biceps curl | 48, HEVC, 31.8 MB | Legacy community reference; angle/mechanics not reviewed |
| Dumbbell bench press | 17–20, H.264, 4.5–9.9 MB | Legacy community references; angle/mechanics not reviewed |
| Bodyweight squat | none | Front squat / multipress footage must not substitute |
| Dumbbell RDL | none confirmed | Catalog RDL 2–4 has no equipment review; do not assume dumbbells |
| Band row | none | Cable/seated rows must not substitute |

No clip has evidence for front/side/45-degree labels, complete-rep time bounds,
reviewed muscle highlights, incorrect-form examples or synchronized coaching.
All these states must remain unavailable in the shipped manifest. Existing written
technique cues remain labeled as existing guidance, not reviewed coaching.

## Baseline verification

192 unit tests passed before edits. Browser dependencies installed with `npm ci`;
the initial browser run could not start because its bundled browser was missing.
Browser installation / installed Chrome fallback and full regression checks follow.

Final local validation: `npm test` passed all 197 tests; `npm run test:browser`
passed all 26 suites on bundled Chromium; `npm run test:realmotion` passed syntax
and focused browser checks. `git diff --check` passed. The existing recipe browser
test now uses an advancing clock anchored to its 2026-10-29 fixture date, avoiding
expired-leftover failures and preserving price-history ordering. No product recipe
logic changed.

RealMotion checks cover five pilot entry points, routines, exact equipment labels,
unavailable angles, codec rejection, publisher errors, credits, no startup media,
all speeds, modal focus/keyboard/Escape, stream release, offline shell reload,
320/390px layouts, large text and zero app-storage writes. Synthetic transport
fixtures in an isolated browser exercise reviewed rep intervals, seek/loop, regional
muscle schematic/form gates, timed captions/transcript, synchronized audio at all
four speeds, and mute. These fixtures are never in the production manifest or shell
cache and are not evidence of human exercise review. Live publisher playback and
actual Safari/Android device behavior were not verified locally. PR CI remains a
separate release requirement; refer to its current checks rather than this document
for CI status.

## Enabling reviewed content

The versioned `realmotion.js` review manifest is code-reviewed app content, never
populated from workout records, user text, remote AI, or guessed exercise names.
Each reviewed clip needs: exact exercise/equipment mapping, human footage origin,
reviewer/date/evidence, a media-bound review revision, rights evidence including model
release, attribution and license, and a verified camera angle. Optional rep intervals,
muscle zones, form pairs and timed coaching each need their own evidence. Reject
malformed or partial evidence. Exercise variations never inherit each other's review.

For voice coaching provide a rights-cleared audio file, exact media-clock cue bounds,
and the full transcript (also rendered as captions). Test sync at every playback speed,
on seek/pause/loop/end, and on actual iOS Safari/Android Chrome. Native speech synthesis
is deliberately not used: its timing and voice availability are not reliable.

No external AI, paid API, pose estimation, backend, or video generation service is
required by the player. New multi-angle production, qualified mechanics/anatomy
review, model releases, captions/coaching recordings and mobile-sized encodes are
content work still required before those features can truthfully be enabled.

## Release gate

Do not merge/deploy until unit and full browser regression checks pass, PR CI is
green, phone Safari/Android playback and keyboard/screen-reader review are complete,
and all enabled media evidence has been reviewed. An empty reviewed manifest is an
intentional honest pilot, not a completed filmed trainer library. No deployment is
authorized by this implementation task.

## Follow-up: production and clearance handoff

The user chose preparation of a filming/review package. The full handoff is in
[`review/realmotion/README.md`](review/realmotion/README.md), with 15 exact shot rows,
rights-holder and specialist enquiries, hash-bound review worksheets, and physical
iOS/Android acceptance sheets. None of the enquiries have been sent or agreements
accepted. No production approval or signature has been fabricated.

Fresh direct requests successfully retrieved wger video records 2–4, 17–20 and 48,
license record 2, and HTTP HEAD responses for all eight media files. Their checked
metadata agrees with the existing catalog. Public source snapshots and UTC timestamps
are retained in the handoff evidence folder. This supersedes the earlier failed
web-reader attempt for source availability only; it supplies no model release,
specialist review or real-device playback approval.

`npm run audit:realmotion` now reports the unresolved full-pilot requirements and
returns a failing status until exact production media, approvals, checksums and device
sign-offs are present. It cannot authenticate evidence or replace the release owner's
rights/professional verification. The normal application CI can be green while this
content gate remains blocked. The gate is a separate read-only pre-release check,
not a change to GitHub Pages deployment or app storage. Keep this PR draft until the
required real-world work is complete.
