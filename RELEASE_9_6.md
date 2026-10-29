# MacroPulse 9.6.0 — actual meal times and time zones

Roadmap item **12** is implemented. Items 1–7, 9 and 11 remain complete. Item 10's guide is shipped; user physical-device/email/recovery acceptance remains pending. Native Apple Health (8) remains deferred because Mac/Xcode and an Apple Developer team are unavailable.

## Shipped

- Browse any diary date in **Meal times & time zones** and add, edit or clear the actual consumption time for an individual entry. This includes custom foods, sourced foods, recipes, imported records and copied meals. Enter the actual local date/time and a named time zone, preview the exact instant and UTC offset, then explicitly confirm. Clearing also requires confirmation.
- Multi-select food logging offers an optional shared consumption time on the selected diary date. All selected foods receive the same reviewed time. Editing the time or zone invalidates the meal preview. For a repeated daylight-saving hour, the batch review asks users to log without a time and select an occurrence in the individual editor.
- Spring-forward clock gaps are rejected. Repeated times require an explicit earlier/later occurrence. Quarter-hour offsets and half-hour daylight-saving changes are supported through the browser's time-zone database. The saved record contains local time, zone, exact UTC instant and offset; it is not a claim of measured consumption.
- Diary dates remain independent of the exact instant. Travel, UTC-midnight crossings and later device-zone changes never silently move food between daily totals. Existing calorie, macro, nutrient and source records remain intact.
- Old entries remain date-only with unknown consumption times. No migration fabricates timestamps or equates logging time with time eaten. Copying a meal/day preserves nutrition and extensions while starting the new entries with unknown consumption times. Other individual logging tools remain date-only until their time is supplied through the editor.
- Optional, versioned metadata is validated on save/import. Unsupported future or inconsistent time records block replacement. Existing raw recovery snapshots, JSON backups, period exports, record synchronization and offline storage retain the time data. Concurrent time changes require one complete time choice during sync, preventing mixed local/zone/instant fields.
- Drafts stay in memory. Preview never writes. Failed storage, changed meals, duplicate meal identifiers and stale tabs prevent the edit from overwriting data. Time editing changes only the selected meal's time field and rolls back that field after a failed save; unrelated records and unknown fields retain their identities and values.

## Verification

- 159 unit tests, including legacy preservation, UTC midnight, DST gaps/repeats, half-hour DST, quarter-hour offsets, malformed/future metadata, exact recovery bytes, backup roundtrip, copied meals and atomic sync choices.
- 22 browser suites, including dedicated time tests for untouched old entries, preview/invalidation, explicit repeated-hour choice, failed-storage rollback, preserved sources/nutrients/unknown fields, clear confirmation, batch timing, offline reload/edit, stale tabs and narrow mobile layout.
- Publication evidence records CI results, deployed source hashes and a separate browser run against GitHub Pages.

No new service, credential, permission, cloud schema or native integration is required. Calculations use the browser's available time-zone database; this release does not activate additional fitness providers, AI, native Health or background sync. Roadmap item 13 remains next.
