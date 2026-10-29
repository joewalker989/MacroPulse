# MacroPulse improvement roadmap progress

Updated October 29, 2026. Numbers match the approved 100-item list. Items 1–7 shipped in 9.2; item 9 shipped in 9.3. Release 9.4 implements the guided portion of item 10; user physical-device/email/recovery acceptance remains pending. Release 9.5.1 implements item 11, multi-select food results. Release 9.6.0 implements item 12, actual meal times and time zones. Release 9.7 implements items 13–18 and 20; item 19 remains pending. Release 9.8 implements recipe/planning items 21–30. Release 9.9 implements restaurant items 31–38 and scoped temporary travel item 40; AI menu item 39 remains pending. Deployment evidence is recorded separately. Unchecked items remain pending; existing partial implementations do not count as completed upgrades.

## First priorities

- [x] 1. Simplify the daily screen.
- [x] 2. Add guided onboarding/setup.
- [x] 3. Unify connection messages.
- [x] 4. Save USDA foods without logging a meal.
- [x] 5. Remember meal-planning preferences.
- [x] 6. Carry recipe nutrients into the diary with partial/stale coverage protection.
- [x] 7. Correct inventory sync protection.
- [ ] 8. Finish the real Apple Health connection — deferred: user has neither Mac/Xcode nor an Apple Developer team. Signed companion installation and physical-device permission/acceptance tests remain required.
- [x] 9. Create one combined food search — saved/USDA/OFF, source and portion review, offline cache, partial failures; OFF name search requires sign-in.
- [ ] 10. Complete guided second-device setup and real-user acceptance — guide and read-only cloud verification shipped in 9.4, with automated real-backend testing; user physical-device/email/recovery acceptance remains pending.

## Food logging

- [x] 11. Multi-select food results — up to 20 foods across searches, per-source portion review, combined preview and atomic confirmation; offline saved foods supported.
- [x] 12. Record actual meal times and time zones. Optional reviewed consumption times for all diary entries and multi-select meals; explicit DST handling, preserved diary dates and unknown times for old/copied foods. See RELEASE_9_6.md.
- [x] 13. Improve search tolerance and aliases.
- [x] 14. Resolve duplicate food entries with source/serving review.
- [x] 15. Support reliable serving conversions.
- [x] 16. Remember preferred portions per food.
- [x] 17. Explain calorie–macro discrepancies.
- [x] 18. Improve OCR review beside the original label.
- [ ] 19. Activate and verify real AI meal-photo requests — pending configured provider credentials and a real consented request; local tools are not AI integration.
- [x] 20. Finish reviewed natural-language multi-food entry.

## Recipes and planning

- [x] 21. Suggest ingredient matches during recipe import.
- [x] 22. Calculate cooked portions by finished batch weight.
- [x] 23. Track leftovers linked to the original recipe.
- [x] 24. Plan batch-cooking sessions.
- [x] 25. Keep recipe price history.
- [x] 26. Generate pantry-first plans.
- [x] 27. Improve grocery consolidation with verified aliases/units.
- [x] 28. Preview ingredient substitutions.
- [x] 29. Add meal-variety and household portion controls.
- [x] 30. Respect preparation time and appliance constraints.

## Restaurants

- [x] 31. Verify nearby locations within the privately chosen radius.
- [x] 32. Show menu freshness and location applicability.
- [x] 33. Support reviewed order customization.
- [x] 34. Match restaurant meals to remaining targets.
- [x] 35. Save exact usual restaurant orders and modifications.
- [x] 36. Build complete order combinations.
- [x] 37. Include current sourced meal prices where available.
- [x] 38. Improve allergen certainty/unknown visibility.
- [ ] 39. Activate and verify menu-photo recognition — actual provider credentials and a real consented request/acceptance remain pending.
- [x] 40. Add temporary travel searches — offline city centers, temporary areas/user-checked locations and explicit external Maps links. No live global directory or address-geocoding API is integrated.

## Training

- [ ] 41. Show the last comparable set beside each input.
- [ ] 42. Explain progression proposals.
- [ ] 43. Adapt whole training blocks with review.
- [ ] 44. Predict workout duration from personal history.
- [ ] 45. Handle occupied equipment and reviewed reordering.
- [ ] 46. Save equipment profiles by location.
- [ ] 47. Clarify load conventions.
- [ ] 48. Track unilateral work separately.
- [ ] 49. Handle assisted exercises correctly.
- [ ] 50. Add transparent weekly muscle-group set budgets.

## Workout experience

- [ ] 51. Expand original/licensed demonstration coverage.
- [ ] 52. Add video slow-playback and loop controls.
- [ ] 53. Improve phase-specific illustrated instructions.
- [ ] 54. Provide captions and optional spoken cues.
- [ ] 55. Verify dependable background timer alerts.
- [ ] 56. Restore interrupted interval sessions.
- [ ] 57. Offer supported keep-screen-awake behavior.
- [ ] 58. Improve one-handed accessible workout controls.
- [ ] 59. Reduce accidental stops with configurable confirmation.
- [ ] 60. Reconcile phone and Watch session control.

## Photos and measurements

- [ ] 61. Add a prior-pose capture guide.
- [ ] 62. Record comparison conditions.
- [ ] 63. Verify iPhone HEIC/orientation/large-image handling.
- [ ] 64. Track annotation history by body region.
- [ ] 65. Support reviewed batch photo import.
- [ ] 66. Support repeated measurement readings and spread.
- [ ] 67. Link photos to dated tape measurements.
- [ ] 68. Add optional progress-photo reminders.
- [ ] 69. Create private comparison crops.
- [ ] 70. Export a reviewed transformation video.

## Insights

- [ ] 71. Compare recovery reports with training outcomes and coverage.
- [ ] 72. Add approved training/rest-day target templates.
- [ ] 73. Explain adaptive calorie recommendations and uncertainty.
- [ ] 74. Show uncertainty around weight projections.
- [ ] 75. Improve plateau reviews before proposing changes.
- [ ] 76. Support planned maintenance phases.
- [ ] 77. Offer progress views without weight emphasis.
- [ ] 78. Add a reviewed return-after-a-break flow.
- [ ] 79. Let users choose overlapping health-data source priority.
- [ ] 80. Graph readiness trends and missing reports.

## Hydration and supplements

- [ ] 81. Allow user-defined hydration schedules by day.
- [ ] 82. Show progress against a chosen drinking schedule.
- [ ] 83. Make beverage-counting rules explicit.
- [ ] 84. Track bottle fill levels and refills.
- [ ] 85. Add actionable native hydration notifications.
- [ ] 86. Store exact supplement product labels.
- [ ] 87. Log supplement amount and time.
- [ ] 88. Total overlapping labeled ingredients across products.
- [ ] 89. Date supplement evidence reviews.
- [ ] 90. Export a selected supplement review sheet.

## Connections and ownership

- [ ] 91. Complete real Strava authorization and acceptance.
- [ ] 92. Build Android Health Connect support.
- [ ] 93. Add an authorized Garmin connection.
- [ ] 94. Implement current Fitbit/Google Health access.
- [ ] 95. Create one guided app-and-photo backup/restore workflow.
- [ ] 96. Offer genuine local-data encryption.
- [ ] 97. Support safe encryption-key changes.
- [ ] 98. Make sync conflicts readable without raw JSON.
- [ ] 99. Add sanitized connection diagnostics.
- [ ] 100. Create private, selectable and revocable coach-review sharing.

External services, credentials, provider access, media licensing and device permissions remain dependencies wherever applicable. See RELEASE_9_2.md, INTEGRATION_SETUP.md and native/apple/README.md. Do not publish private health data or secrets to complete a checklist item.
