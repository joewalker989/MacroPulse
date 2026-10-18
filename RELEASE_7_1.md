# MacroPulse 7.1 — daily targets, workout console and local menus

Baseline: 6b8eb12c8deceab19c0f2b76b5dbdd7b276b531a (7.0). The earlier 5.1, 6.0, photo studio and 50-addition releases remain available. This release adds the latest requested experience changes.

## Shipped in this release

- Home: Daily targets, 40 US fl oz jug and Hydration share one panel and the same intake history. Full/half/quarter jug and ml entries retain their original records. Saved water goals now populate the form after reload.
- Fitness: a large HH:MM:SS workout clock, completed-set ring, green Start/Pause/Resume controls and adjacent red Stop control. Stop freezes the session for review; checked sets are logged only through Finish. Resume continues the session. Pause intervals are excluded from the clock and persist across reloads. Finished session history includes this clock; older sessions are identified as having no pause history. Existing workout analytics retain their documented wall-clock calculations.
- Fitness: original offline start/move SVG illustrations for all 18 library exercises, generated routines, live coaching/favorites and recognized Quick Log template movements. These are schematic pictures, with written cues, rather than photographs, videos or form analysis.
- Food: a filterable shortlist of 20 chain restaurants with publicly listed Douglasville locations, location evidence and official menu access. Chick-fil-A, Chipotle, Wendy’s, Zaxby’s, Subway, Panda Express, KFC, Jersey Mike’s, Olive Garden, LongHorn, Waffle House, IHOP, Cracker Barrel, Moe’s, Pizza Hut, Papa Johns, Wingstop, Domino’s, Buffalo Wild Wings and Applebee’s are included.
- Food: 10 offline standard-serving nutrition snapshots from official Chick-fil-A and Panda Express sources, checked October 18, 2026. Search by restaurant/item and calories, review portions, then confirm diary logging. These are a starter selection, not complete imported menus. Sauces, sides, drinks and customizations must be accounted for separately as indicated. Other chains provide official menu access and sourced manual entry.
- Food: Restaurants I visit supports saved locations, menu links, usual orders/notes, editing, removal, search and prefilled nutrition entry. Saving the same suggested chain twice does not duplicate it or overwrite notes. Nothing is added to personal records on startup.
- Stack: each of the 10 existing serving options has expandable benefits, evidence, cautions and NIH/MedlinePlus links. Weak evidence is identified. Ingredient evidence does not certify a brand or batch. Selecting both Body Fortress serving alternatives shows a reminder to check whether that was intended. Existing serving indices are retained.

## Preserved data and offline support

The existing localStorage key and IndexedDB photo database/version remain unchanged. No user photo or photo metadata is rewritten. Existing diary entries, workouts, calculations, supplements, backups and unknown fields remain intact. The first save using a workout timer or restaurant directory retains an independent raw snapshot at `macropulse_pwa_v1_before_7_1`; snapshot/write failures abort saving. Future or invalid timer/directory schemas reject replacement. The snapshot is included in the existing Privacy Center erase controls. Full app JSON round trips the optional fields; progress photos still use the separate photo backup.

New illustrations, reference content and nutrition snapshots are precached. External menu and evidence links require internet. Close all MacroPulse tabs and reopen to activate an installed service-worker update. Source backup: `backup/pre-7.1`; a local Git bundle was also created before edits.

## Pending or not integrated

- Exact 20-mile inclusion from the user's home, distance sorting and a comprehensive local restaurant search are **not verified**. This is a Douglasville city-based shortlist, not a radius guarantee or popularity ranking. No private street address or precise location is published or stored in the app. Precise geocoding was blocked by automatic approval review; city-based restaurant research continued.
- Live menu/nutrition APIs, live prices, availability, ordering and allergy guarantees are not integrated. The linked restaurant sites supply their current menus; the app does not scrape them or silently refresh saved nutrition.
- Apple Health/Fitness, heart rate, wearable/active-calorie feeds, cloud sync, native iOS functions, AI photo/body analysis, background alarms and screen wake lock are not integrated. Existing local photo comparisons/annotations remain available and do not claim anatomical measurements from image differences.

## Verification

69 unit tests and nine browser suites cover legacy data preservation, migration snapshots, invalid/future schemas, quota/stale-tab protection, backup/photo round trips, offline upgrades and feature flows. The new acceptance suite covers shared hydration, saved goals, clock pause/resume/reload/Stop/Finish, red controls, set rings, movement pictures, every supplement card, restaurant filtering, nonduplicating saves, sourced menu logging, backups and mobile/offline use. Deployment and public-URL acceptance must also pass before this release is reported as live; the task's deployment verification report records those results.

## Evidence sources

Every restaurant card links its location source and official menu access. Nutrition snapshots cite [Chick-fil-A Grilled Nuggets](https://www.chick-fil-a.com/menu/entrees/grilled-nuggets), [Chick-fil-A Chicken Sandwich](https://www.chick-fil-a.com/catering/entrees/chick-fil-a-chicken-sandwich), and [Panda Express nutrition](https://www.pandaexpress.com/nutritioninformation). Portions and recipes can change.

Supplement notes cite [NIH exercise supplement guidance](https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-Consumer/), [NIH weight-loss supplement guidance](https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/), [NIH B12 guidance](https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/) and [MedlinePlus psyllium](https://medlineplus.gov/druginfo/meds/a601104.html). They are educational ingredient summaries, not individual treatment or dose recommendations.
