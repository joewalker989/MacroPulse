# Filming brief: five exact exercise variants, fifteen camera views

**Production draft — specialist must approve setup and performance before filming.**
This is a shoot plan, not an exercise prescription or signed mechanics review.

## Crew and setup

Use a consenting adult human demonstrator, an operator and a qualified reviewer. The
reviewer sets comfortable demonstration loads/range, supervises equipment safety and
may stop a take. Keep the room free of unconsenting bystanders, screens, music and
third-party artwork. Obtain location permission where applicable. Use consistent
lighting/clothing that makes joint positions visible; no skin-colored equipment or
loose clothing that hides the movement. Keep both hands, feet and equipment in frame.

Record one correct movement continuously from each view: front, true side (90°), and
45° between those positions. Label the camera position relative to the demonstrator,
not by the filename alone. For bench press, document whether the front view is from
the foot end; do not put the operator in the weight path. Keep the camera stationary
and far enough away to avoid wide-angle distortion. The reviewer must reject a view
that hides the relevant joints. Three views may be separate takes; do not imply they
are synchronized recordings of the same repetition.

Capture three controlled complete reps per view, with about two seconds of stillness
before and after. Do not cut within a rep, change equipment between views or create
frames with generative interpolation. Shoot side views first so the reviewer can
catch setup problems before the other ten takes. The 15 checklist rows are delivery
clips; allow additional takes and reshoots rather than setting a performance quota.

## Exact variants and reviewer prompts

### CURL — standing bilateral supinated dumbbell curl (`curl`)

Two actual dumbbells, standing, both arms moving together. Do not substitute a hammer,
barbell, cable or preacher curl. Draft cue: “Keep your torso quiet. Bend the elbows to
lift, then lower under control.” Reviewer checks the chosen grip, comfortable elbow
range, wrist alignment and absence of trunk swing. Proposed schematic region: upper
arms, with biceps wording to be confirmed. Reference: AAOS [elbow flexion](https://www.orthoinfo.org/bodypart/shoulder/rotator-cuff-and-shoulder-conditioning-program/),
section 10. That rehabilitation reference is supporting reading, not approval of this
bilateral fitness variant or a prescription for repetitions/load.

### BENCH — flat dumbbell bench press (`bench-press`)

Two actual dumbbells and a stable flat bench. Do not substitute barbell, incline, floor
or machine press. Draft cue: “Keep your feet supported and lower the dumbbells with
control. Press smoothly.” Reviewer determines grip, elbow path, comfortable depth,
setup and safe exit; checks wrist support and shoulder position. Film the approved
setup/exit separately if it cannot fit the short demonstration. Proposed regions:
chest and upper arms; identify primary/assisting labels separately. Reference:
ACE [dumbbell chest press](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/).

### SQUAT — bilateral bodyweight squat (`squat`)

No external weight or assistance. Do not substitute goblet, barbell, front or Smith
machine squat. Draft cue: “Lower to a comfortable depth with your feet grounded.
Stand back up with control.” Reviewer approves stance/depth for this demonstrator and
checks foot contact, knee tracking and controlled torso position through the full
cycle. Avoid universal depth or “knees never pass toes” claims. Proposed regions:
thighs and hips, with individual muscle labels to be approved. Reference:
ACE [bodyweight squat](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/).

### RDL — bilateral dumbbell Romanian deadlift (`rdl`)

Two dumbbells, starting from standing. Do not substitute a conventional deadlift,
single-leg version, barbell or kettlebell. Draft cue: “Move your hips back with a
small knee bend. Keep the weights close and return to standing.” Reviewer checks
hip-led movement, spine control and a comfortable endpoint rather than a prescribed
floor target. Proposed regions: posterior thighs and hips, with hamstring/gluteal
labels subject to approval. Reference: NASM [dumbbell RDL](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift).

### BANDROW — standing bilateral anchored resistance-band row (`band-row`)

A real resistance band/tube with a suitable rated anchor, not a cable machine. Film
the anchor, band path and hands clearly, following the equipment manufacturer's
instructions; the reviewer approves anchor height, stance, resistance and grip.
Draft cue: “Keep your torso steady. Draw your elbows back, then return slowly.”
Reviewer checks anchor security, controlled return, shoulder movement and no torso
jerk. Proposed region: back; approve the exact upper-back/latissimus wording for the
chosen path. AAOS [standing row](https://www.orthoinfo.org/bodypart/shoulder/rotator-cuff-and-shoulder-conditioning-program/),
section 6, is related reading; its rehabilitation variant is not automatically this
bilateral demonstration. Final variant-specific professional review is required.

## Correct versus incorrect form

The existing player displays text pairs, so this pilot does not require anyone to
perform risky incorrect repetitions under load. Ask the reviewer to write one or two
concise “Correct / Avoid” comparisons for each locked clip. If an error illustration
is later requested, use a separately cleared, supervised, unloaded still/example and
review it separately. Do not turn an unsuccessful or painful take into a demonstration.

## Files and delivery

Use `MP-RM-{EXERCISE}-{front|side|45}-take01-master` for originals and
`media/realmotion/{exerciseId}-{angle}-r1.mp4` for reviewed delivery copies.
Keep masters privately outside this public repository until rights are cleared.
Record the take, actual equipment, camera position and any approved adaptation on set.

Capture at 1080p/60 real frames per second if the camera supports it with stable
lighting. Deliver a natural-aspect 720p H.264 MP4, yuv420p, with the MP4 metadata before
the media data (fast start). Prefer 60 fps for quarter-speed inspection when mobile
quality and budget allow; 30 fps needs reviewer acceptance of the slower playback.
No generated intermediate frames. Aim for 12–25 seconds and at most 6 MB per view.
If compression hides joint/equipment detail, reshoot or revise the approved delivery
budget instead of claiming the degraded image is adequate. Never preload all views.

Remove incidental audio from the video. After picture lock, record separately cleared
coaching as AAC/M4A, no music, at most 1 MB per view. Align each audio file to the full
clip duration, padding with silence where needed. Use original short scripts based on
the approved cues above; do not copy third-party video narration. Assign transcript
cue start/end times only after watching the final edit. Do not infer synchronization
from an exercise name, duration estimate or another camera's take.

The developer will calculate delivery SHA-256 hashes, inspect encodes, implement the
approved rep boundaries/captions, and prepare phone review copies. Any later picture
or voice change invalidates its hash-bound approvals and requires a focused re-review.
