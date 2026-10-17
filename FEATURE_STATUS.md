# MacroPulse Complete Upgrade — 4.0

All entries and features below work locally in the installable PWA unless a limitation is explicitly stated. No AI, cloud account, credentials or subscription is configured.

| Approved feature | Shipped PWA behavior | Integration boundary |
| --- | --- | --- |
| Daily Fitness Command Center | Existing calories, macros, supplements and activity plus today's planned sessions, meals, hydration, habits and recovery guidance | No health-device feed |
| Adaptive Workout Scheduler | Equipment routine scheduled across a week, readiness and recent difficulty rules, conflict avoidance, reschedule/skip/done and saved session snapshots | Local rules; no AI trainer or calendar sync |
| Body Transformation Dashboard | Recorded weight history, change from first check-in, goal progress, recent average, waist measurements and notes | No inferred body-fat percentage or photo analysis |
| Smart Meal Builder | Library/custom ingredients, serving multipliers, macro totals, remaining-target comparison, dated plans and explicit nutrition logging | Example food values; no barcode or AI scanner |
| Workout difficulty feedback | Easy / just right / hard on recent workout entries; feeds recovery and scheduling | Manually entered |
| Automatic warm-up builder | Three-minute movement preparation based on the selected routine day's movement groups | Text guidance |
| Deload planner | Recent hard sessions or frequent training trigger guidance; halved-set session previews; adaptive weeks suggest lighter sessions | Manual load selection; previews preserve the original routine |
| Exercise form review | Local video playback, movement cues, self-review checklist, persistent notes | **Manual review only.** Automated AI assessment, coaching uploads and video persistence are not implemented |
| Plate / weight calculator | lb/kg, custom bar and plate sizes, balanced per-side combinations and unloaded remainder | Assumes sufficient plate pairs; does not infer physical inventory |
| Workout supersets | Persistent pairs in equipment routines, alternate-set instructions, rest guidance and unpairing | Individual exercises still logged separately |
| Habit / streak tracking | Custom habits, daily toggles, calendar streaks, removal | No background reminders |
| Hydration tracking | Quick/custom drinks, daily target, progress and undo | Manual local log |
| Smart grocery list | Date-range meal ingredients consolidated by food/serving, quantities, checklist and clipboard export | No live prices, pantry database, delivery or retailer link |
| iPhone Lock Screen widgets | In-app quick view and Home Screen links only | **Native Lock Screen widgets are not implemented.** A native iOS app, WidgetKit extension, shared storage and iOS build/signing are required |
| Data privacy center | Full/raw/recovery exports, local storage explanation and explicit confirmed erasure | No cloud copy, encrypted vault or account-deletion service |

## Existing functionality

Includes the equipment/routine work from `codex/equipment-routines` (previously separate from live 3.1), exercise substitutions and rest timer. Preserves nutrition, custom foods, workout templates/logs, supplements, weight/progress, goals and version-1 JSON backup compatibility.

## Data and update safety

- Keeps `macropulse_pwa_v1` and its existing record shapes. Upgrade data is an optional, versioned `upgrade` extension created on first use. Unknown extension fields survive saves and backup imports.
- Does not write at startup. Invalid/corrupt data or a future upgrade schema blocks saves instead of overwriting the original raw value. Privacy Center can download it.
- Before the first new-version save, retains the existing raw value in `macropulse_pwa_v1_before_upgrade`. Imports validate first, ask before replacement, then retain current raw data in `macropulse_pwa_v1_recovery` before writing. A recovery-write failure aborts the replacement.
- Recovery copies use the same browser and are not independent backups. Export files regularly. A subsequent import replaces the pre-import recovery slot.
- Service worker precaches all runtime files. An update waits until older tabs close; it does not erase localStorage. Close all MacroPulse tabs/windows and reopen online after deployment to activate a pending release.
- Changing equipment clears the original generated routine as before. Scheduled snapshots are preserved; viewing a session checks current equipment and asks for a new plan if required items are no longer available.
- Marking a scheduled day complete does not fabricate exercise/calorie logs. Planned meals are explicitly logged once, on their chosen date. Removing a meal plan does not delete nutrition history.

## Validation

`npm test` runs legacy data round trips, malformed payloads, write failures, upgrade snapshots, routine combinations, streaks, readiness/recovery, warm-ups, plate loading, meal quantities, grocery grouping and transformation calculations.

`npm ci && npx playwright install chromium && npm run test:browser` runs an isolated mobile-width Chromium scenario: legacy preservation, feature interactions, exports/import recovery, offline reload, corrupt-storage protection and layout overflow. GitHub Actions also installs Chromium dependencies and retains a mobile screenshot. These tests use synthetic records, never a person's browser storage.

Actual iPhone hardware, native WidgetKit behavior and external AI/cloud services are outside this test suite and are not claimed as live.
