# Full-gym routine library

Four new original starting templates are added to Fitness → Browse gym routines /
Workout Program Library. The three existing adaptable programs remain available.
These templates use MacroPulse's supported free-weight, pull-up and bike equipment;
they do not pretend to cover machines that the exercise library cannot demonstrate.

| Program | Weekly schedule | Intended use | Approximate session time |
| --- | --- | --- | --- |
| Gym Foundation | Mon/Wed/Fri full body | Beginner or returning trainee; establish consistent strength work | 32–36 min |
| Strength + Cardio | Mon/Wed/Fri full body, then moderate bike | Fat-loss support and maintaining strength; 39 min of included gym cardio/week | 45–48 min |
| Muscle Builder | Mon upper / Tue lower / Thu upper / Fri lower | Intermediate upper/lower split with repeated weekly practice | 38–41 min |
| Strength & Muscle | Mon/Wed/Fri full body | Intermediate compound lifts with longer rests | 42–43 min |

Every session has explicit working sets, rep ranges and rest. Estimates include an
8-minute warm-up, 3-minute cool-down, transitions, an approximate four seconds per rep
at the upper target, and between-set rests. Real sessions may take longer. No burn,
weight-loss amount or muscle-growth outcome is predicted. No loads are assigned.

Progression starts at the lower rep target with roughly 2–3 reps in reserve. Once all
sets reach the upper target with control on two sessions, use the smallest available
load increase and return to the lower target. Bodyweight moves progress through
controlled reps before difficulty. Recovery guidance and existing pain/readiness checks
remain available. These are general templates for healthy adults, not individualized
injury advice, clinical prescriptions or professionally reviewed motion footage.

## Content basis

The schedules and prescriptions are original implementations of general training
principles. [ACSM's 2026 guidance](https://acsm.org/resistance-training-guidelines-update-2026/)
emphasizes consistency, training major muscle groups repeatedly, and tailoring load
and volume to the person. It does not endorse these exact plans. The initial working
volume is a starting point, not a claim to optimize every muscle's hypertrophy.

[CDC activity guidance](https://www.cdc.gov/physical-activity-basics/guidelines/adults.html)
recommends at least 150 minutes of moderate aerobic activity plus two strengthening
days weekly for adults. The gym cardio in these templates is not the whole weekly
recommendation; additional activity should be built up as appropriate. [CDC's activity
and weight guidance](https://www.cdc.gov/healthy-weight-growth/physical-activity/)
describes the role of overall energy balance. Workout selection never adjusts food
targets or assumes exercise calories. References checked 2026-11-14.

## Integration and preservation

- Shoulder press, biceps curl and calf raise become usable exercise-library records,
  reusing the existing original illustrations and IDs. No footage is invented.
- Exact required equipment and excluded movements gate application. Previewing never
  modifies inventory or silently swaps a gym lift for a different movement.
- Preview and confirmation are required. The old complete routine, options, inventory
  and unknown fields are archived through the existing routine-archive flow.
- Current training extensions/options are retained. Workout logs, active sessions,
  scheduled session snapshots, meals, targets, photos and existing archives are kept.
- Target ranges travel into My Routine and new live-workout notes. Live sets start
  unchecked, with zero added weight; finishing still requires actual completed sets.
- Existing transaction, recovery, stale-tab protection, backup and offline storage
  formats are reused. No new persisted schema or external service is required.
- The primary muscle-volume map has limited group coverage; adding arm/calf exercises
  does not claim complete muscle-volume accounting or detailed anatomical overlays.

This change is independent of the draft RealMotion filming work in PR #22. It does not
merge that PR, clear footage rights or deploy either feature. A future merge should
retain both new shell assets and a fresh service-worker cache name/version.

## Validation

Unit checks cover all plans, exact equipment/exclusions, time budgets, immutable
templates, legacy programs, archive/backup round trips and live note targets. Browser
checks exercise preview/cancel/apply/archive/restore, failures and stale tabs, active
session/schedule/unknown-field preservation, backup, offline use, narrow/large-text
layout and readiness-gated live sessions. Existing full app checks remain required.
The older recipe browser test uses a clock anchored to its fixture date so expired
leftovers and price-history ordering do not depend on the wall-clock date.

Local final checks: all 197 unit tests, all 26 browser suites and focused gym-routine
syntax/browser checks passed. CI status is recorded on the PR. No deployment is part
of this implementation.
