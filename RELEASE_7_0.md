# MacroPulse 7.0 — 50 implemented additions

Baseline: 332aecffa32c2c0249baff6e089b1b442ad63db8 (6.1). Existing functionality was inspected before choosing these additions; the numbered guide maps each addition to an actual control. No external-service placeholders count toward the 50.

1. **Dated food diary** — Browse any food date and see its recorded calorie/macro totals; unlogged intake remains unknown. Location: food → sevenDiary.

2. **Edit meal records** — Edit meal name, date and macros while retaining original IDs and unknown fields. Location: food → sevenDiary.

3. **Adjustable food portions** — Preview 0.01–100 listed food servings and explicitly confirm logging. Location: food → sevenPortions.

4. **Copy a meal to another date** — Copy a selected meal to another date with a new ID and its record-tool notes/tags. Location: food → sevenDiary.

5. **Copy a full food day with preview** — Preview a source food day, reject a changed source, and confirm new-ID copies without replacing destination records. Location: food → sevenCopyDay.

6. **Meal-time tags** — Breakfast, lunch, dinner, snack or unspecified tags are stored separately from original meal records. Location: food → sevenDiary.

7. **Meal notes** — Per-meal free-text notes survive saves and full backups. Location: food → sevenDiary.

8. **Favorite foods** — Star existing illustrative/custom foods without logging them. Location: food → sevenPortions.

9. **Recipe builder with yield** — Build recipes from food-library ingredient quantities and a chosen yield; saved macro values remain a snapshot. Location: food → sevenRecipes.

10. **Log a recipe portion** — Preview recipe portions and explicitly log calculated calories/macros on a chosen date. Location: food → sevenRecipes.

11. **Backdated water in ml, oz or jugs** — Add water on a chosen date using ml, US fl oz or 40 oz jugs; limit 5,000 ml per record. Location: home → sevenWater.

12. **Edit water records** — Edit a selected drink amount/date in the original water store without changing its ID. Location: home → sevenWater.

13. **Thirty-day hydration chart** — Thirty-day bars plus accessible daily values show recorded volume and distinguish missing entries. Location: home → sevenWaterTrend.

14. **Drink-type labels** — Label water, sparkling water or other drinks; caloric drinks still require separate food logging. Location: home → sevenWater.

15. **Named cup shortcuts** — Create named cup volumes and add today’s drink with one action. Location: home → sevenCups.

16. **Searchable workout archive** — Filter all workout records by date range and exercise text; display up to 100 matches with narrowing guidance. Location: fitness → sevenWorkouts.

17. **Edit manual workout records** — Edit manual workouts while retaining IDs and unknown fields; live session sets are blocked. Location: fitness → sevenWorkouts.

18. **Copy manual workouts** — Explicitly confirm copying manual records for work actually completed; new IDs preserve the original. Location: fitness → sevenWorkouts.

19. **Metric manual-workout entry** — Choose kg or lb for manual added load; canonical storage remains lb. Added load is bounded to 3,000 lb. Location: fitness → sevenWorkouts.

20. **Observed personal-best board** — Compare observed highest added load, tied repetitions, recorded duration and date coverage by exercise; no safe-max prediction. Location: fitness → sevenBests.

21. **Exercise load history graph** — Graph daily highest recorded added load with accessible dated values; no inferred missing observations. Location: fitness → sevenExercise.

22. **Warm-up load arithmetic** — Compute chosen percentages of a working load in kg/lb; arithmetic only, not a readiness or load prescription. Location: fitness → sevenRamp.

23. **Finished-session tags** — Attach location/context tags to finished live sessions without changing their set history. Location: fitness → sevenSessionTags.

24. **Live-session set density** — Completed sets per elapsed hour for finished live sessions, including rest/interruption time; no quality grade. Location: fitness → sevenDensity.

25. **Named foreground rest timers** — Named foreground countdown presets with cancel and completion text; no background alarm or notification permission. Location: fitness → sevenTimers.

26. **Body-measurement targets** — User-chosen baseline/target for waist, chest, hip, arm or thigh; cm storage with profile-aware display. Location: progress → sevenMeasureGoals.

27. **Body-measurement change table** — First/latest/change/count table combines original waist and full-body records without double-counting mirrored IDs. Location: progress → sevenMeasureGoals.

28. **Photo search by date and notes** — Filter photos by date range, note/measurement text and view; no uploads. Location: progress → sevenPhotoArchive.

29. **Photo thumbnail gallery** — Private, lazy-loaded thumbnail gallery showing up to 60 matches; filters narrow larger collections. Location: progress → sevenPhotoArchive.

30. **Edit photo date, view and notes** — Edit photo capture timestamp, view, notes and measurement text; keep original blob, unknown metadata and annotations; revision checks reject stale saves. Location: progress → sevenPhotoArchive.

31. **Favorite progress photos** — Favorite photo references in core app data, with favorites-only gallery filtering; photo files still need separate backup. Location: progress → sevenPhotoArchive.

32. **Interval-based photo pairing** — Find nearest earlier same-view photo to a chosen 7/30/90-day interval, review dates, then explicitly open the pair. Location: progress → sevenPhotoArchive.

33. **Photo contact-sheet export** — Export a PNG contact sheet of 1–40 filtered photos with dates/views, preserving stored originals. Location: progress → sevenPhotoArchive.

34. **Custom-period fitness report** — Choose a custom date range, preview logging coverage/totals and recorded weight change, and export a standalone JSON report. Location: progress → sevenReport.

35. **Dated weight-context notes** — Dated context tags/notes for scale readings; no causal explanation or medical inference. Location: progress → sevenWeightNotes.

36. **Pantry expiry queue** — Sort nonempty pantry items by entered best-before date and show days before/after that date; not a food-safety determination. Location: food → sevenExpiry.

37. **Categorized manual groceries** — Add/edit/remove categorized manual grocery items and check them independently from generated meal-plan groceries. Location: food → sevenShopping.

38. **Auditable pantry stock adjustments** — Explicit signed pantry quantity changes with before/after/date/reason ledger; negative stock rejected. Location: food → sevenStock.

39. **Meal-plan week calendar** — Monday-based calendar reads existing meal plans and planned calorie totals without adding food logs. Location: food → sevenMealCalendar.

40. **Grocery price estimates** — Per-unit manual grocery prices and currencies; no live price lookup. Location: food → sevenShopping.

41. **Shopping budget and remaining estimate** — Shopping budget shows entire-list/checked-item estimates and remaining amounts in one selected currency; other currencies excluded. Location: food → sevenShopping.

42. **Weekly preparation checklist** — Manual dated weekly preparation tasks with completion checks; no scheduled reminders. Location: home → sevenPrep.

43. **Universal tool finder** — Search app tool names and open the matching screen/section, including earlier-release tools. Location: home → sevenFinder.

44. **Pinned tool shortcuts** — Pin/unpin tool shortcuts on Home; included in full app backups. Location: home → sevenPins.

45. **Undo last record-tool change** — One-step undo for these core record-tool changes; blocked after intervening saved/unsaved state changes; excludes photo-file edits. Location: home → sevenSafety.

46. **Local data integrity audit** — Report duplicate meal/workout IDs and selected orphaned nutrient/cost/meal-metadata/photo-favorite references without modifying records. Location: home → sevenSafety.

47. **Date-filtered CSV export** — Date-filtered CSV extracts for meals, workouts, weights, water, tape measurements or recovery, with spreadsheet-formula escaping. Location: progress → sevenExports.

48. **Date-filtered JSON extracts** — Date-filtered JSON extracts retain selected record fields and declare canonical units; extracts are not full restore backups. Location: progress → sevenExports.

49. **Record-tool action journal** — On-device timestamped journal of these core record-tool mutations, showing the latest 50 while retaining the full saved journal; not a reconstructed global audit log. Location: home → sevenSafety.

50. **Keyboard navigation shortcuts** — Ctrl/Command+K opens tool search; Alt+1–5 switches main screens when not typing. Existing modal/keyboard controls retained. Location: home → sevenFinder.

## Preservation and validation

Optional seven schema v1 is created on explicit use, with no startup writes. Before its first save, macropulse_pwa_v1_before_7 retains the original raw app data. Download this snapshot from Undo, integrity audit & action journal. Unknown app/record fields survive; invalid/future schemas, stale tabs and snapshot/write failures reject saves. These record-tool commits roll back memory on failure. Original localStorage key and IndexedDB photo store/version are retained. Photo metadata edits use existing revision protection; no photo blob is rewritten. Full app JSON includes the new extension. Photos and their annotations still require separate photo JSON backup. Privacy erasure includes the new release snapshot. Source backup branch backup/pre-7.0 and a local Git bundle precede this release.

62 Node tests and eight browser suites cover all 50 numbered additions, formula boundaries, snapshots/quota failures, future schemas, copy/edit/undo semantics, unknown-field retention, live-set integrity, core/photo backup round trips, original photo pixels/metadata paths, offline reload, mobile width, local exports and keyboard navigation. The new suite asserts a coverage set of all integers 1–50. Existing 5.0/5.1/6.0/6.1 regressions remain in the test command; time-sensitive 6.0 fixtures now use relative dates. Local Windows uses Chrome; CI uses Chromium. Tests use synthetic records/images in isolated profiles, not personal storage or an actual camera.

The new tools avoid unnecessary rerendering on unrelated food-search input. Home offers an in-app numbered guide, tool search and pinned shortcuts. Cache generation macropulse-v7-0-1 precaches all runtime modules and waits for old tabs to close; it does not erase records/photos.

## Explicit limits

AI/body analysis, external food/restaurant/price APIs, cloud accounts/sync/encrypted backup, health-device/native iOS integration, background alarms and HEIC conversion remain not integrated. Real iPhone hardware/camera/speech-provider behavior is not verified. Timers are foreground only. Nutrient/food/price values remain manual or illustrative. Progress summaries describe recorded information, not measured total intake, safe lifting capacity, health grades or inferred body composition. CSV/JSON extracts and period reports are not substitutes for full app and photo backups.
