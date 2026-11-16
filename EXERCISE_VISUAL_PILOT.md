# Realistic exercise visuals

All 25 existing exercise demonstration IDs now use realistic references: two licensed real-person videos and 23 generated anatomical 3D references. The original cartoon exercise renderer and schematic fallback controls are removed. This applies to Quick Log, the Exercise Library, generated/saved routines, coaching/favorites, live workouts, log previews, recorded workouts and printable exercise guides through their shared renderer.

## Integration and preservation

Branch: feat/exercise-visual-pilot, stacked on the existing RealMotion draft PR #22. No merge or deployment is included. Review this increment against feat/realmotion-studio; integrate that dependency before retargeting to main. The separate full-gym routine work is not duplicated.

The audit found 18 training-library exercises, 25 shared demonstration IDs, five Quick Log categories and an existing attributed wger catalogue/player. Existing IDs, aliases, training rules, routines, logs, equipment, photos, backup formats and unknown fields are preserved. No data migration is needed. Unknown custom exercises do not receive guessed images.

exercise-media.js is the immutable shared catalogue; workout-visuals.js resolves existing names and creates the same realistic preview everywhere. All five categories link to the library, whose cards include equipment, missing inventory, muscles, cues and demo controls. Filters and players do not write saved state.

## Free assets and provenance

The two unchanged Your Move references are dumbbell goblet squat and single-arm dumbbell row (free hand supported on the forward thigh, no bench). Terms were verified at https://ymove.app/free-exercise-videos on 2026-11-15, page revision 9 November 2026. Commercial app use is permitted with linked credit; standalone media-library redistribution is prohibited. Credits appear everywhere, including printed exports. Source URLs, sizes and hashes remain in media/exercise-pilot/provenance.json. Separate signed human-model release documents have not been supplied to MacroPulse.

The anatomical model comes from the pinned OpenGym3D pack at https://github.com/mortensams/freefitness/tree/ea3a60130fdcfb3c4771e44d09f84ebab4ee9bae. That ZIP includes an MIT licence and identifies its MPFB2-generated figure. MakeHuman's official core-asset terms at https://download.makehumancommunity.org/about/license.html release core graphical assets under CC0. Licence notices and the source mesh are retained in tools/trainer-render. No new purchased or restricted assets are used.

The source file's embedded animation is not played or retargeted. MacroPulse authors new joint-direction motion, inverse limb placement and equipment, resets the skeleton to bind pose, and renders the references locally. The generated references are visibly labeled. These are general movement references, not professionally reviewed mechanics or an assessment of a user's form. No licensor endorsement is implied, and the specialist-reviewed RealMotion manifest remains empty.

media/exercise-3d/provenance.json binds every MP4/JPG and the renderer source to hashes, with model/pack provenance and declared changes. Three.js is MIT-licensed; its notice is included. The optional development renderer uses local Chromium and FFmpeg; the app does not ship their executables or load Three.js, the source mesh or WebGL. No AI-generated motion is presented as anatomically verified.

## Motion and equipment

All references were visually inspected at start/end poses. New scenes include planted feet, a bench for bench press, matched dumbbells, anchored bands, a barbell/rack, a pull-up frame and a stationary bike with pedals. A fixed upright trunk is used for presses/curls/rows; hip hinging and supported floor movements use separate poses. Dead Bug, reverse lunge and marching alternate both sides. The plank is explicitly labeled an isometric hold rather than fabricated movement. No clip is silently substituted for an equipment-mismatched exercise.

This inspection and the automated checks establish rendering/identity and operational behavior; they do not replace qualified mechanics review. Physical iOS/Android playback, screen-reader assessment and actual device speech remain release checks.

## Playback, offline and exports

No MP4 is requested before explicit Play/Load. Native inline playback and the existing RealMotion dialog share one active inline stream; navigation, dialog changes, hidden/replaced cards, backgrounding and offline transitions release it. Full controls retain four speeds, whole-clip repeat, visible cues and optional explicitly unsynchronized cue reading. Additional camera angles, specialist-reviewed rep intervals, anatomical overlays and synchronized captions/recorded voice stay gated on real evidence.

The 23 800×600, 20 fps H.264 references total about 1.43 MB, plus about 3 MB of real-person video. All 25 JPEG previews join a new versioned offline shell; MP4s are not precached. Offline fallback uses realistic posters and cues, with no cartoon fallback. Guaranteed offline video downloads/playback are not implemented.

Printable HTML guides embed their realistic JPEGs as data URLs and retain attribution, so downloaded guides work independently and offline. Guides contain still previews and written plan details; full motion remains in the app. Export makes no saved-state changes and uploads no private records.

## Validation

206 unit tests and all 28 browser suites passed locally on Chromium. Checks include all 25 media mappings, every model/output hash, source renderer hashes, old name/ID resolution and unknown-exercise behavior. Dedicated catalogue acceptance decodes all 25 MP4s, checks moving decoded frames for dynamic clips, the declared plank hold, absence of cartoons across cards/routines/history/log/player, 25 cached offline posters, zero startup videos, narrow large-text layout and zero saved-data writes. Existing storage, backup, photo, stale-tab, sync and export regressions passed.

Remaining review work concerns professional form verification and physical-device accessibility/playback, not missing cartoon replacements in the current 25-exercise catalogue. Future new exercise IDs require their own matched assets. No purchase, merge or deployment was performed.
