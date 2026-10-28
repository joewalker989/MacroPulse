# MacroPulse 9.2 daily flow and reviewed setup

This release implements roadmap items 1–7. Existing stores, photos, unknown fields, calorie approval and offline behavior are retained. No backend migration or newly activated health/AI provider is included.

## Implemented

1. **Daily screen:** Today prioritizes calories/macros, recorded food/water/workout status, daily actions, a next useful action and the existing shared hydration tracker. Secondary information is collapsed into labeled disclosures; tool search remains available. Status/error messages remain visible. Existing nodes and delegated actions are retained, and startup does not save app data.
2. **Guided setup:** A three-step review covers units, adult reference profile, weight goal, equipment, training preferences and simple/expanded Home detail. It reuses existing schemas, preserves unknown fields and routines, and saves atomically through the normal stale-tab/recovery guard. A new scale reading is added only when explicitly selected. Calorie/macro targets are retained; calculator changes still need separate approval. Removing equipment required by a saved routine is blocked with instructions rather than silently deleting the routine.
3. **Connection messages:** Settings and Home privacy status reflect the current in-memory cloud sign-in/passphrase state. Older unconditional “cloud not integrated” messages are replaced. Configuration or an in-memory session is not proof of successful transfer. Local browser storage is still unencrypted; native Health still requires the companion and permissions.
4. **USDA library-only save:** Saved USDA foods can be added for later use without logging food as eaten or changing diary totals. Existing save-and-log remains available.
5. **Planning preferences:** Explicitly save recipe prices, tags, checked allergen metadata and weekly planning choices. They survive reopening and full app backup. Missing prices remain unknown. Saving a reviewed week also retains its planning inputs; changed inputs/recipes require a new preview. Allergy metadata remains user supplied.
6. **Recipe nutrients:** Newly calculated weighed recipes retain an input signature and ingredient coverage. Reviewed portion logging scales the nutrient snapshot into the diary; details and sources remain visible. Nutrition Quality counts complete and partial coverage separately, with manual sourced values taking precedence. Manual macro edits retain original nutrient data but exclude the stale snapshot from current totals. Older or altered recipe snapshots without matching inputs require recalculation before detailed nutrients are carried forward; their macro logging still works.
7. **Inventory sync:** The correct `six.kitchen` path is protected. Divergent concurrent inventory changes, first joins and one-sided inventory/ledger deletions require whole-app review so quantities and movement records are not silently mixed. The existing encrypted-original recovery path remains in use. An inventory change can still merge with unrelated non-conflicting diary additions.

## Verification

- 132 unit tests passed locally.
- All 18 browser suites passed locally, including legacy/photo/calculator/offline coverage and the new daily-flow and setup suites.
- New browser checks cover no startup or preview writes, one hydration store, advanced-tool discovery, retained expansion, mobile/large-text layout, ongoing workouts, setup cancellation, explicit measurements, recovery snapshots, stale tabs, library-only saves, persistent planning across a second page, recipe nutrient logging and account-status transitions.
- The existing two-device suite passes with the updated conservative merge engine. New unit cases cover stock/quantity coupling, inventory deletion/first joins, stale recipe nutrients, partial coverage, manual-value priority and planning schema bounds.
- Provider responses in browser fixtures remain mocks. This release does not claim a new live Supabase transfer test, real AI request or physical Apple-device acceptance.

Final GitHub checks, deployed asset hashes and deployed browser verification are recorded with the task output evidence after publication. See ROADMAP_PROGRESS.md for remaining items.

## Next external dependency

Roadmap item 8 remains pending: a Mac/Xcode signing setup, Apple Developer team, installed iPhone/Watch companion and actual user Health permissions/device tests. Simulator compilation does not establish a working physical-device connection. AI/Strava credentials and the other existing integration boundaries remain as documented in INTEGRATION_SETUP.md.
