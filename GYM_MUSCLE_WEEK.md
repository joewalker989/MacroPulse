# Free exercise demos, muscle browsing and a seven-day muscle plan

The Exercise Library now has 47 exact movement references: 25 real-person clips from Your Move's free collection and 22 existing realistic anatomical 3D motions. There are no cartoon exercise examples. Equipment variants have separate IDs; existing saved names/IDs retain their meaning. The original two human clips are reused without copying them again. The generic routine generator retains its original selection pool so expanding the catalog does not silently change existing planning behavior.

## Browse and play

Fitness → Exercise Library has 10 muscle groups, primary/assisting labels, demo type, search, movement category and saved-equipment filters. These filters are read-only and compose. Original front/back trainer images orient the user; labeled keyboard-accessible buttons select a muscle. They are not a heatmap or an activation measurement. The old five-group volume accounting is deliberately retained separately so historical statistics do not change.

Cards show equipment, target muscles, cues, local preview and demo controls. Videos load on demand; only one inline video stays active. Playback speed and clip looping work. Existing cue read-aloud is available when the browser supports speech. All 47 posters, anatomy views, muscle metadata and programs are cached for offline use; video playback still requires connectivity. No videos are precached or downloaded automatically. There is no invented alternate angle, rep synchronization, specialist certification or timed caption track.

## Seven-day Muscle Builder

Fitness → Preview 7-day Muscle Builder. Four lifting sessions, approximately 44–50 minutes including the planning allowance for warm-up, rest and transitions. Actual time varies. Review exact equipment and any exclusions before applying. Applying requires confirmation and archives the exact previous routine; it does not add completed logs, alter scheduled sessions, replace an active workout, prescribe weights or change nutrition targets.

| Day | Session | Working exercises: sets × rep range (rest seconds) |
| --- | --- | --- |
| Monday | Upper A | Barbell bench 3×6–10 (150); lat pulldown 3×8–12 (120); seated cable row 2×8–12 (90); cable crossover 2×10–15 (75); dumbbell lateral raise 3×12–15 (60); rope pushdown 2×10–15 (75); hammer curl 2×10–15 (75) |
| Tuesday | Lower A | Barbell squat 3×6–10 (150); kettlebell RDL 3×8–12 (120); lying cable leg curl 2×10–15 (75); calf raise 3×12–20 (60); high-to-low woodchop 2×10–15 each side (60 after both sides) |
| Wednesday | Active recovery | Optional 20–30 minutes easy walking/cycling and 5–10 minutes comfortable mobility; shorten or skip when tired |
| Thursday | Upper B | Machine chest press 3×8–12 (120); seated cable row 3×8–12 (120); lat pulldown 2×8–12 (90); cable crossover 2×10–15 (75); dumbbell lateral raise 3×12–15 (60); overhead rope extension 2×10–15 (75); rope curl 2×10–15 (75) |
| Friday | Lower B | Leg press 3×10–15 (120); kettlebell RDL 3×8–12 (120); leg extension 2×10–15 (75); machine glute kickback 2×10–15 each side (75 after both sides); calf raise 3×12–20 (60) |
| Saturday | Easy activity | Optional 20–30 minutes conversational walking/cycling and 5–10 minutes gentle mobility |
| Sunday | Rest | Rest from structured lifting; review recovery and prepare for next week |

Use about 8 minutes of easy movement and light rehearsal/ramp-up sets before working sets. Choose starting loads, leaving about 2–3 controlled reps in reserve. If new or returning, start with 1–2 sets per exercise for 1–2 weeks, building toward the listed volume as recovery allows. Repeat for 4–6 weeks. When all sets reach the top of the range with good control on two sessions, make the smallest available load increase and restart at the lower rep target. Reduce load/sets if recovery is poor; stop for pain. This is a general template, not an individualized prescription or a promise of results.

The app also reuses the four previously prepared full-gym programs from PR #23 and its preview/apply/archive safeguards, rather than maintaining a second program system. Backup round-trips retain target notes, rep ranges, original routines and unknown extension fields.

## Sources, rights and limits

- [Your Move free collection](https://ymove.app/free-exercise-videos), checked November 15–16, 2026: free commercial app/website use with linked “Exercise video by Your Move” credit. No standalone resale/redistribution. Exact publisher IDs, paths, metadata and hashes: `media/exercise-human/provenance.json`; original two-clip proof remains in `media/exercise-pilot/`. Human clips are original publisher files, visually checked for variant/equipment matching, not independently form-certified. Visible credit appears wherever the app shows them.
- [MakeHuman mesh license](https://download.makehumancommunity.org/about/license.html): CC0 mesh reused from the existing pinned OpenGym3D MIT pack. Existing source and notices: `tools/trainer-render/OPENGYM3D_LICENSE`, `tools/trainer-render/THREE_LICENSE`, `media/exercise-3d/provenance.json`. New orientation views are original renders, not third-party body maps. Reproduce with `node tools/trainer-render/render-map.cjs` after installing the renderer's optional development dependencies.
- [MuscleWiki terms](https://musclewiki.com/terms) and [API tiers](https://api.musclewiki.com/), checked November 15, 2026: no MuscleWiki imagery, footage, maps, paid API or scraped content was copied. Its free sharing terms do not establish permission for this commercial app use.
- [ACSM 2026 resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/) supports regular training, goal-specific volume and individualization; [CDC adult activity guidance](https://www.cdc.gov/physical-activity-basics/guidelines/adults.html) supplies the broader activity context. The exact plan is authored for MacroPulse and is not endorsed by these organizations. Optional recovery cardio does not by itself meet the full aerobic guideline.

Pending: qualified independent mechanics review, additional freely licensed real-person footage for the remaining 22 movements, actual additional camera angles and reviewed synchronized rep/caption coaching. These are not presented as completed features.

## Validation

214 unit checks and all 30 browser suites passed locally, including all 47 MP4 decodes/posters, changing generated poses, no startup video requests, 320/390px large-text layout, offline references and plan, exact equipment/exclusion gates, preview without writes, cancel/apply/archive/restore, quota and stale-tab failure safety, backup round-trip, existing live sessions/schedules/history and unknown fields. GitHub checks and final live verification are also required before release.
