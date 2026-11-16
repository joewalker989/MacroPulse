# Exercise visual pilot

Branch: `feat/exercise-visual-pilot`, based on the existing `feat/realmotion-studio` draft (PR #22). Review this increment against that branch; merge the RealMotion dependency before integrating this increment into main. No deployment or storage migration is included.

## Audit before implementation

- Main has 18 equipment-filtered training movements and 25 original schematic demonstration IDs. Five Quick Log categories reference 20 movements, with shared IDs for repeated movements. Templates are logging shortcuts, not complete scheduled programs.
- Existing `video-catalog.js` / `video-library.js` retain attributed wger community references, with H.264/HEVC compatibility and publisher streaming. These are preserved unchanged; their historical licence snapshot does not establish current model clearance or specialist mechanics review.
- Existing RealMotion draft adds one dialog, speed, reviewed-angle/rep/coaching gates, legacy bench/curl candidates, offline drawings, no storage writes, and a private production review intake. Its reviewed manifest remains empty. This pilot reuses that player without relaxing its review gates.
- The separate full-gym routine branch/PR is not merged or duplicated here. Existing routines, logs, photos, equipment and backups retain their IDs and formats.

## Licensed content

Checked 2026-11-15 at [Your Move's free download page](https://ymove.app/free-exercise-videos), page revision 9 November 2026. Publisher terms permit free commercial use within an app, require linked credit, and prohibit selling or redistributing the clips as a standalone media library. Each appearance credits the publisher and links to its exercise API page. The original files and publisher thumbnails are bundled solely as MacroPulse app resources, not a separate asset product. Do not extract and redistribute them as a media collection. This permission is independent of MacroPulse's source-code licensing.

See `media/exercise-pilot/provenance.json` for the two download URLs, exact file hashes, dimensions, durations, sizes and terms evidence. Only dumbbell goblet squat and the standing single-arm dumbbell row variant match the existing equipment and exercise records closely enough for this pilot. The row uses the free hand on the forward thigh, not a bench. The original files are unchanged. Chromium playback and moving frames were checked for exercise/equipment identity; this is not professional form verification, authentication of model releases, or a recommendation for an individual user's abilities.

Generated 3D motion is explicitly labeled and is not presented as professionally form-verified. No guessed angle, fake muscle overlay or invented trainer endorsement is added. No specialist-approved assets have been admitted to the reviewed manifest. The publisher's commercial permission is verified; separate signed model documents have not been supplied to MacroPulse.

## Implemented

- Quick Log: all five categories retain movement references and logging controls; each has a category-specific Exercise Library navigation control. Upper/Full Body show the real-person row, Lower Body shows the real-person goblet squat, Core shows realistic 3D Dead Bug and Leg Raise, and Bands shows realistic 3D Band Row.
- Library: consistent read-only cards for the 25 existing demonstration IDs; equipment, missing inventory, target muscles and written cues; category selector and equipment filter. Template navigation browses the category with the inventory filter off and clearly labels missing equipment. Filters never change saved inventory or generated routines.
- Five lazy, locally hosted previews with linked credit. Play loads the example directly inside its card; full controls remain available in RealMotion. No video request before explicit Play/Load. Only one inline stream is active, and card replacement or navigation releases it. Remaining non-pilot cartoons are collapsed behind an optional older schematic fallback, with unavailable realistic media clearly identified.
- Native accessible playback, four speeds, optional whole-clip repeat (not a seamless/trimmed rep loop), stream release and error fallback. Real angle selection and reviewed synchronized coaching remain gated on real assets and evidence.
- Written cues remain visible alongside playback. Optional browser read-aloud pauses video and is explicitly unsynchronized; unsupported browsers hide those controls. Closing/stopping/backgrounding cancels speech.
- New shell cache and versioned changed scripts. About 132 KB of posters join the offline shell; videos are not precached. Three 800×600, 20 fps H.264 3D clips total about 210 KB, alongside approximately 3 MB of real-person video. The app loads no Three.js, source mesh or WebGL. Offline posters/cues work after shell installation; guaranteed offline video playback/downloads are not implemented.

## Pending before expansion / release

- Owner acceptance of this five-exercise pilot and additional asset selection. No automatic catalog expansion.
- Remaining non-pilot movements and additional real camera angles. The three screenshot exercises now have generated 3D references, while professionally reviewed human footage remains a separate content dependency.
- Qualified mechanics review, complete-rep boundaries, anatomy overlays and synchronized captions/recorded voice require content and evidence; the existing review workflow remains authoritative for those features.
- Physical iOS/Android decoding, speech, screen reader and low-bandwidth checks. Desktop Chromium tests cannot establish those outcomes.

## Validation

- 205 unit tests and all 27 browser suites passed locally on Chromium.
- Actual shipped MP4 decoding, moving playback, end-of-clip repeat, four speeds, credits, no startup video requests, category/equipment filters and navigation focus passed.
- Cue reading/cancellation uses a speech mock in the automated check; actual device voices remain a physical-device check.
- Poster/offline-shell reload, missing-video fallback, 320/390px large-text width checks, unchanged synthetic saved records and zero player/filter persistence writes passed. Existing backup, photo, stale-tab and sync regressions passed.
- Pilot media were inspected visually for movement/equipment matching. Neither those checks nor passing CI establish specialist form review or signed model releases.

## Screenshot clarification follow-up

Leg Raise, Dead Bug and Band Row now show actual animated anatomical models directly on the cards, replacing the three cartoon examples identified in the screenshot. Opening the full player, changing category/page, replacing cards, backgrounding or going offline releases an inline stream. The remaining non-pilot examples have not been replaced with realistic media.

The neutral model comes from the pinned OpenGym3D pack in [freefitness](https://github.com/mortensams/freefitness/tree/ea3a60130fdcfb3c4771e44d09f84ebab4ee9bae). That ZIP includes an MIT licence and identifies its generated MPFB2 figure. MakeHuman's [official asset terms](https://download.makehumancommunity.org/about/license.html), checked 2026-11-15, release core graphical assets under CC0. Pack/model hashes and changes are recorded in `media/exercise-3d/provenance.json`. The model and licence notices are retained in `tools/trainer-render`.

The embedded squat animation is not played or retargeted. The renderer resets the skeleton to its bind pose and authors new joint-direction motion for these three exercises. MacroPulse adds neutral material, mat, anchor, band geometry, scene and timing. Three.js is MIT-licensed, with its notice retained. The optional development renderer uses local Chromium and FFmpeg; their executables are not shipped in the app. See `tools/trainer-render/README.md` for reproduction and motion rules. The checked-in renderer reproduced the shipped byte sizes and hashes.

Generated poses were visually inspected and decoded frames checked for actual motion, including alternating Dead Bug sides. This is not qualified mechanics review, and none of these clips enters the specialist-reviewed manifest. No licensor endorsement is implied. Paid alternatives were not bought, downloaded, hotlinked or added; no purchase is needed for these three replacements.
