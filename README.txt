MACROPULSE 9.2 - DAILY FLOW AND REVIEWED SETUP

Open https://joewalker989.github.io/MacroPulse/ . Today prioritizes daily tracking; Guided setup reviews profile, goals, units, equipment and Home detail without automatically changing calorie targets. Optional cloud controls reflect sign-in/passphrase state. USDA foods can save without diary logging; planning preferences persist; reviewed recipe nutrients retain coverage; inventory sync keeps quantities and ledgers together.

See RELEASE_9_2.md and ROADMAP_PROGRESS.md for exact shipped versus pending scope. Local browser data is not encrypted by the privacy screen. Native Apple Health/Watch permissions and AI/Strava provider activation still require real acceptance. Export app records and a separate photo backup before migrations.

HISTORICAL RELEASE NOTES FOLLOW

MACROPULSE 8.0 - LOCAL TRACKING WITH REVIEWED FOOD AND HEALTH IMPORTS

See RELEASE_8_0.md for exact current feature status. Apple Health export.xml and standard fitness CSV can be imported locally with review; this is not live Apple Health or fitness-app sync. English nutrition-label OCR runs locally with verified downloads cached after first use. Optional online food/barcode queries use Open Food Facts community data, which needs review and may be unavailable. AI meal recognition, cloud sync, native watches/widgets and background app notifications are not integrated. The passphrase privacy screen does not encrypt stored records or photos. Older version notes follow.

1. Unzip all files into the same folder.
2. Upload the folder to any HTTPS static host (for example GitHub Pages, Netlify, or Cloudflare Pages).
3. Open the HTTPS URL in Safari on iPhone.
4. Tap Share > Add to Home Screen > Add.
5. Open MacroPulse from your Home Screen. Visit online once to cache app files before using offline.

Data: Stored only in browser localStorage. Export backups regularly from Settings. Clearing website data or deleting the app may erase local entries. The app does not sync with Apple Health and has no AI camera or voice scanner. Nutrition figures are illustrative. The default calorie and macro goals are editable examples, not medical advice.

This is a static application: no server, account, or subscription required. Files must be served over HTTPS (or localhost) for the service worker to operate.

3.2 adds My Equipment, local equipment-based routine generation, exercise cues and substitutions, planned-exercise logging, and an in-app rest timer. Custom equipment names are stored but do not automatically map to exercises. The planner is rule-based, not an AI coach. Close all app tabs after an update so the new offline release can activate.

4.0 adds the Daily Fitness Command Center, adaptive scheduling, body transformation measurements, meal planning and grocery lists, difficulty feedback, warm-ups, deload previews, manual video form review, a plate calculator, supersets, habits, hydration and a privacy center. Existing data stays under the same storage key. Pre-upgrade and pre-import recovery downloads are available in Settings > Data Privacy Center. Use Export backup for independent copies.

Native iPhone Lock Screen widgets are NOT implemented; the app includes an in-app quick view and Home Screen links. Automated AI analysis, Apple Health, cloud sync and background notifications are not live.

See FEATURE_STATUS.md for exact feature status, limits, migration behavior and tests. Run npm test with Node 22 or newer. Browser regression tests additionally need npm ci, npx playwright install chromium, and npm run test:browser.

4.0.2 adds goals/milestones, an interactive muscle map, recorded training volume, consistency calendar, equipment/avoidance-based replacements, strength trend estimates, program library, confirmed meal drafts, sourced menu-item search, manual photo/serving estimates, sourced nutrient coverage, user templates, weekly review and accessibility preferences. Optional browser speech supports workouts and meal drafts where available; typed input works without it. Speech may use the browser provider's servers after explicit dictation/permission. Live restaurant search and automated food-photo recognition are NOT connected. Read FEATURE_STATUS.md before relying on any integration claim.

Before the first save using these features, a separate local recovery copy is retained even for existing 4.0 users. Download it from Settings > Data Privacy Center > Download before feature expansion. Full backups include the optional new fields. Export before clearing browser data; no cloud copy exists.
