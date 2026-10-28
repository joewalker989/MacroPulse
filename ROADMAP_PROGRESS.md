# MacroPulse improvement roadmap progress

Updated October 28, 2026. Numbers match the approved 100-item list. Items 1–7 shipped in 9.2; item 9 shipped in 9.3. Release 9.4 implements the guided portion of item 10; user physical-device/email/recovery acceptance remains pending. Deployment evidence is recorded separately. Unchecked items remain pending; existing partial implementations do not count as completed upgrades.

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

- [ ] 11. Multi-select food results.
- [ ] 12. Record actual meal times and time zones.
- [ ] 13. Improve search tolerance and aliases.
- [ ] 14. Resolve duplicate food entries with source/serving review.
- [ ] 15. Support reliable serving conversions.
- [ ] 16. Remember preferred portions per food.
- [ ] 17. Explain calorie–macro discrepancies.
- [ ] 18. Improve OCR review beside the original label.
- [ ] 19. Activate and verify real AI meal-photo requests.
- [ ] 20. Finish reviewed natural-language multi-food entry.

## Recipes and planning

- [ ] 21. Suggest ingredient matches during recipe import.
- [ ] 22. Calculate cooked portions by finished batch weight.
- [ ] 23. Track leftovers linked to the original recipe.
- [ ] 24. Plan batch-cooking sessions.
- [ ] 25. Keep recipe price history.
- [ ] 26. Generate pantry-first plans.
- [ ] 27. Improve grocery consolidation with verified aliases/units.
- [ ] 28. Preview ingredient substitutions.
- [ ] 29. Add meal-variety and household portion controls.
- [ ] 30. Respect preparation time and appliance constraints.

## Restaurants

- [ ] 31. Verify nearby locations within the privately chosen radius.
- [ ] 32. Show menu freshness and location applicability.
- [ ] 33. Support reviewed order customization.
- [ ] 34. Match restaurant meals to remaining targets.
- [ ] 35. Save exact usual restaurant orders and modifications.
- [ ] 36. Build complete order combinations.
- [ ] 37. Include current sourced meal prices where available.
- [ ] 38. Improve allergen certainty/unknown visibility.
- [ ] 39. Activate and verify menu-photo recognition.
- [ ] 40. Add temporary travel searches.

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
