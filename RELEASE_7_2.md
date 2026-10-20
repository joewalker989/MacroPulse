# MacroPulse 7.2 — seven local convenience tools

1. **Workout focus mode** — Fitness → Focus on this workout hides other fitness panels. Show all fitness tools restores them. Navigation and the live workout remain available. This display preference lasts in the current tab only.
2. **Work/rest interval timer** — Fitness → Work/rest interval timer supports chosen work/rest seconds and rounds, pause/resume, red Stop and completion. No rest is added after the last round. This is independent of the live workout clock and does not create logs. It resets on reload and has no background alarm, notification or wake lock.
3. **Printable illustrated exercise guide** — Fitness → Printable exercise guide & workout notes downloads a self-contained HTML guide from a saved routine day, including pictures, planned sets/reps/rest and existing cues. Open the file and use the browser Print command for paper or PDF.
4. **Workout notes download** — The same panel downloads a live/recorded session as text, including clock time, checked and unchecked sets, exercise notes and workout notes. Unchecked sets are explicitly identified; nothing is marked complete by exporting.
5. **Calendar-file export** — Fitness → Export planned workouts to calendar downloads planned sessions in a chosen date range as all-day .ics events with stable IDs. Open and review the file in a calendar app. Importing again may duplicate entries. No calendar account or sync is connected.
6. **Printable daily food diary** — Food → Printable daily food diary downloads selected-day recorded foods and calorie/macro totals in a local HTML file. Missing intake remains unknown. Browser Print can save a PDF.
7. **US/metric quick converter** — Home → US / metric quick converter handles lb/kg, ml/US fl oz/40 oz jugs, and inches/cm. Incompatible units and invalid values are rejected. Conversion does not change profile settings or records.

The new panels are also discoverable through Find a tool and can use the existing pinned-tool system. The numbered 7.0 catalog retains its original 50 entries.

## Preservation and verification

The new module never writes app data or photo storage. Focus and interval timing stay in memory. No migrations, new storage keys or database changes are needed. Existing diary, workout, supplements, profile, photo files/annotations, backup and offline support remain in place. Exports are private local files and are not restore backups. New source modules are precached.

75 unit tests and eleven browser suites cover prior features plus unit conversions, interval boundaries/pause/stop/completion, all four exports, escaped HTML/calendar text, UTF-8 calendar line folding, unchanged source records, mobile layout and offline reload. The dedicated browser suite uses an isolated synthetic profile and a controlled clock. Live release verification is recorded in the task outputs.

Calendar formatting follows the all-day start/end and line-folding rules in [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545). Import behavior in actual Apple/Google/Outlook calendar apps is not verified; no calendar permission or account connection is added.

## Still not integrated

Cloud sync, AI services, wearable/Apple Health feeds, live restaurant or price APIs, native iOS functions and background notifications remain not integrated. HTML/PDF printing and calendar import are performed by the user's browser/calendar app, not by a native integration.
