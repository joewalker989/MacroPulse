# MacroPulse 9.5.1 — multi-select food results

Roadmap item **11** is implemented. Items 1–7 and 9 remain complete. Item 10's guide is shipped, while the user's physical-device/email/recovery acceptance remains pending. Native Apple Health (8) remains deferred.

Version 9.5.1 narrows the batch commit and rollback to diary and nutrient fields. Unrelated root fields, including literal unknown property names, are retained without copying them onto the app object. The browser regression reads exact saved JSON and checks this preservation.

## Shipped

- Select up to 20 combined-search results for one meal, retaining selections across searches. A shortcut opens the selected-food review. Custom foods, illustrative examples, USDA foods and Open Food Facts products retain separate identities and serving bases.
- Review listed-serving counts for custom/example foods and gram/milliliter quantities for sourced foods. Confirm unknown Open Food Facts package bases before previewing. Choose one diary date and preview every portion plus the combined macro total before explicitly logging.
- Selection and preview never log food or change targets. A successful confirmation writes the entire selected meal together. Invalid portions, unsupported data, a stale tab or failed storage prevent a partial batch. Editing a quantity, date, package basis or selection invalidates the preview.
- Source snapshots remain as selected; later online results do not silently replace them. Changed or removed saved/cache dependencies require re-selection. Different provider records remain distinct; users must avoid counting the same food twice. There is no automatic cross-provider duplicate resolution in this release.
- USDA nutrient records and Open Food Facts additional nutrients scale with their portions. Supported fiber/sodium/calcium/iron values enter the existing diary coverage records. Actual zero remains zero; missing or unsupported nutrient values remain unknown.
- Batch logging does not change the food library. Existing individual review and save-to-library controls remain available. Clear/removal affect only the draft. Drafts remain in memory and clear on reload; cached food selection and batch logging work offline.

## Verification

- 151 unit tests, including multi-source scaling, source identity, library changes, fresh source snapshots, package-basis confirmation, missing nutrients, bounds and unique draft IDs.
- 21 browser suites, including a dedicated multi-select suite covering cross-search selection, portion/date review, preview invalidation, storage-failure rollback, one-write confirmation, unchanged library/targets/unknown fields, a 20-food bound, offline logging, reload behavior, stale tabs and mobile layout.
- Existing source-search, photo, calculator, workout, sync, device-setup and legacy-preservation suites remain in regression coverage. Publication evidence records the deployed asset hashes and deployed browser verification separately.

No new service, credential, permission or database migration is needed. Existing source quotas, sign-in requirements and provider availability still apply. This release does not activate AI, additional fitness providers, native Health or background sync. Next unblocked implementation: item 12, actual meal times and time zones.
