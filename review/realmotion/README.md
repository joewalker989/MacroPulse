# RealMotion Studio filming and review package

**Status: prepared for production; full pilot release is blocked.** No trainer footage,
model releases, specialist approvals or physical-phone sign-offs have been supplied.
Nothing in this folder marks a clip approved or deploys MacroPulse. PR #22 stays draft.
The user selected the filming-and-review route rather than supplying existing owned media.

## Start here

1. Read [the filming brief](production-brief.md) with the trainer and camera operator.
   Use [the 15-shot checklist](pilot-shots.csv) on set.
2. Use [the rights and specialist workbook](rights-and-review.md) to collect the actual
   agreements, final-file approvals, rep boundaries, muscle labels and coaching decisions.
3. Complete [the phone acceptance sheet](device-acceptance.md) on real iOS Safari and
   Android Chrome. Emulation and an Apple build are not substitutes for phone playback.
4. The developer copies `release-intake.template.json` to a private local working folder,
   fills it with the approved production records, and adds those same clip records to
   the trusted manifest. After committing the final app/media candidate, record that
   immutable commit in the private intake and complete phone/owner sign-offs against it.
   Keep the completed intake outside this public repository; this avoids publishing
   private approvals and avoids a self-referencing commit. Then run
   `npm run audit:realmotion -- path/to/completed.json`.
   The command currently exits 1 by design: the full pilot is not cleared.

## Your involvement

| Step | What you provide/decide | What the developer can handle |
| --- | --- | --- |
| Arrange the shoot | Choose an adult demonstrator, camera operator/location and any budget; no purchase or booking has been made | Exact shot list, file naming, equipment matching, edit/encode and intake |
| Clear rights | Have the actual rights holder and demonstrator sign or provide adequate written clearance; agree scope/term and resolve any legal uncertainty | Organize evidence IDs, attribution, hashes and license notices; cannot sign for people or infer releases |
| Appoint reviewer | A suitably qualified trainer/strength professional or physiotherapist willing to review these exact variants; verify relevant credentials | Prepare worksheets, source references, review copies and frame/time reports; cannot impersonate the specialist |
| Film and record | Real human performances and a consenting coaching voice; approve reshoots when needed | Prepare delivery copies, captions, synchronization and audio attribution after files arrive |
| Phone checks | Access to an iPhone/iPad using Safari and Android phone using Chrome, plus a tester for VoiceOver/TalkBack | Run desktop regressions and fix issues the phone tests find |
| Release decision | Approve the final candidate once all evidence and checks pass | Update PR, verify CI and report readiness. No deployment is included in this package |

You may combine the trainer, demonstrator and voice roles if that person is qualified and
consents to each use. Clinical/technique approval remains a real human decision even when
one person fills several roles. Do not place signed releases, contact details, private
credential documents or access tokens in this public repository.

## What has been verified

Eight relevant wger source records and license record 2 were retrieved successfully.
All eight publisher files returned HTTP 200 to HEAD requests, with byte-range support;
the video/quicktime MIME type and recorded sizes were retained. Records still credit
Goulart under CC BY-SA 4.0. This is source/availability verification, not a playback,
equipment, professional-mechanics or model-release approval.

The exact responses and UTC timestamps are in [evidence/wger-records.json](evidence/wger-records.json)
and [evidence/publisher-availability.json](evidence/publisher-availability.json). The metadata
matches the existing snapshot for the fields checked (ID, exercise, URL, codec, size,
duration, license ID and author). Existing community clips and saved user data are unchanged.

| Candidate | Decision for this release |
| --- | --- |
| wger dumbbell bench 17–20 | Retain as existing credited references. Model rights, angles, reps and expert review remain missing |
| wger dumbbell curl 48 | Same limitations; HEVC and 31.8 MB are poor defaults for mobile |
| wger RDL 2–4 | No promotion: dumbbell equipment has not been verified; HEVC files are 38.1–390.6 MB |
| YMove free set | No pilot substitutions: hammer curl, barbell bench/back squat and kettlebell RDL differ from the requested variants; no matched band row. Website requires attribution while repository README says optional, so obtain clarification before relying on that set |
| MuscleWiki | Paid commercial streaming is offered, generally front/side. Standard published terms disallow permanent media storage/rehosting; 45-degree coverage and overlay/coaching use need confirmation. A purchase, account/backend and review would still be needed; none authorized or created |

Primary licensing references: [CC BY-SA legal code, sections 2(b), 3 and 5](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en),
[YMove website](https://ymove.app/free-exercise-videos),
[YMove free-set README](https://github.com/ymove-app/exercise-api/blob/main/free-videos/README.md),
[MuscleWiki licensing FAQ](https://api.musclewiki.com/faq).
These are research findings, not supplier warranties or new rights grants.

## Release gate scope

The gate requires all five variants × three angles, real-file hashes, MP4/codec/duration
checks, separate cleared voice audio, all content approvals, device sign-offs and owner
approval bound to the exact candidate. It also checks that approved clips actually match
the production manifest. It is read-only, does not upload media, does not write saved app
data and does not deploy. `ffprobe` must be installed when final local media is audited.
Template receipts cannot establish legal permission or prove a professional's identity;
the owner must verify the underlying private records. Public URLs must not contain tokens.

The full-feature gate is separate from the existing safe fallback player and from CI.
Passing application tests alone does not clear these content requirements. No date or
cost is promised until the chosen trainer/producer has accepted the brief.
