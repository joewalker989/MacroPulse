# Requested 15-feature expansion

Baseline inspected: main `7948987`, GitHub Pages served matching 4.0.1 scripts with HTTP 200. Existing 16 Node tests passed. The existing release includes the prior Complete Upgrade and equipment planner; the newly requested list is additive.

Storage remains browser-local under `macropulse_pwa_v1`. The optional `complete` extension is initialized only on an explicit save. No startup migration writes. Existing records and unknown fields remain intact. Version-1 backups include this extension automatically. Invalid or future extensions block saves. Existing pre-upgrade, pre-import recovery and raw export paths remain available. Browser recovery copies are not independent backups: export JSON before upgrading or clearing browser data.

Stages: (1) additive schema and migration tests; (2) training, goals and analytics; (3) nutrition workflows and templates; (4) speech, weekly review and accessibility; (5) regression, offline release and deployment verification.

Local validation: 26 Node tests and both Chromium browser suites. The original browser suite covers prior features, backups, corrupt data, offline reload and a stale 3.1 service worker upgrade. The expansion suite exercises goals, keyboard map, volume, calendar, replacement exclusions, program archiving, commands/timer, confirmed meals, sourced menus, manual photo servings, nutrient coverage, templates, preferences, modal keyboard behavior, full JSON restore, original records, future schemas and offline new modules. Speech result/permission branches use a mock; no microphone or live provider accuracy is claimed.

Release changes all runtime URLs to `v=4.0.2` and precaches both added modules under `macropulse-v4-complete-5`. Existing tabs must close before a waiting release activates. Feature boundaries are detailed in FEATURE_STATUS.md. No user-browser storage was accessed during development or testing; synthetic data was used throughout.
