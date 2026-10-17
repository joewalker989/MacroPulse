MACROPULSE 4.0 - COMPLETE UPGRADE PWA

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
