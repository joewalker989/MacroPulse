# Integration setup and actual activation

No server secret belongs in GitHub, app settings, a screenshot or a chat message. The browser config contains only the Supabase project URL and publishable key. Account tokens and the backup encryption passphrase remain in memory.

## AI recognition

In the connected Supabase project's Edge Function secrets, securely set `OPENAI_API_KEY` and `OPENAI_MODEL` to a model available to your provider account that supports images and structured output. Then sign in to MacroPulse and submit a consented test description/photo. Review the returned nutrition before logging. Until a real provider request succeeds, this is an implemented integration awaiting activation, not verified AI recognition. Requests may incur provider charges. The function uses `store:false`; provider retention policies still apply.

## USDA production search

Public limited demo search does not need a private key. For production server lookup set `USDA_API_KEY` securely in Edge secrets. The existing data source retains USDA IDs, source links, per-100 g basis and all supplied nutrients. Missing macros are rejected rather than invented. Public demo quotas and provider outages remain visible.

## Open Food Facts combined search

Name search uses the fixed Search-a-licious HTTPS endpoint through authenticated mp-services action off-search; no provider API key is needed. It shares the 20/day/account server recipe/recognition quota. JWT verification and getUser authentication remain enabled. The query alone is forwarded; it is not stored by MacroPulse beyond the existing per-account usage count. Provider logging policies still apply. Public API 3.6 barcode lookup, saved foods and USDA demo search work without sign-in. API 3.6 nutrition uses complete labelled as-sold input sets, excluding inferred estimates. Missing package basis must be confirmed before logging.

## Strava browser authorization

Register a Strava developer application with callback domain `joewalker989.github.io`. The exact callback is `https://joewalker989.github.io/MacroPulse/oauth.html`. Securely set `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET` and `FITNESS_TOKEN_KEY` in Supabase Edge secrets. The last value must be a cryptographically random 32-byte key encoded as base64. Keep it safe: rotating or losing it requires reconnecting stored provider authorizations. Do not reuse the user's backup passphrase.

Sign in to the cloud account in a normal browser, authorize `activity:read` and verify a real recent-activity preview. This scope excludes private-only activities and has no write permission. Review and save only the returned elapsed-duration observations. Provider access/refresh tokens stay encrypted server-side; they are not part of app backups and are never returned to the browser. Database leases serialize refresh, revoke and reconnect across devices; an interrupted request can retain a lease for up to ten minutes. Revocation requires a working provider response; imported local observations remain saved. No background provider job or webhook is configured.

The iOS companion's Strava system-browser session is not implemented. Use Safari/Chrome for this separate browser flow; the companion's HealthKit path can read data other apps actually write to Apple Health, after permission.

Google's current Health API registration and authorization differ from legacy Fitbit OAuth. A separate Google Cloud registration, consent/scopes and provider-specific implementation are still required; no Google Health/Fitbit connection is claimed. Official migration guidance: https://developers.google.com/health/migration/data-access . Garmin and other proprietary provider programs are not integrated.

## Apple Health, Watch, widgets and native permissions

The iOS/widget and Watch simulator builds passed GitHub Actions. Follow `native/apple/README.md` on a Mac with Xcode to configure the Apple team, bundle IDs, App Group, capabilities and signed device installation. Then verify actual Health permissions, Watch workout metrics/pairing, widget queue delivery, Live Activity pause/resume, notification delivery and device authentication. No Apple Developer credentials or physical devices were available during server/web testing.

The native WebView has separate storage from Safari/Home Screen installations. Transfer and verify app records and photos before relying on it. Never remove the original installation to perform a migration.

## Recipes and barcode images

Signed-in server recipe retrieval allows only Budget Bytes, Skinnytaste, EatingWell and Allrecipes HTTPS pages. It rejects other hosts, private redirects, credentials, custom ports, pages over 2 MB and missing Recipe JSON-LD. A publisher can still block the request. Only passive recipe JSON is returned for review; no publisher scripts/cookies are used. This is not an arbitrary scraper or ingredient nutrition engine. Recipe retrieval and AI recognition share a 20/day per-account limit.

The barcode-picture decoder downloads pinned `@zxing/browser@0.1.5` from jsDelivr after a user action and checks its SHA-256 before caching/execution. The selected image stays on the device. Subsequent scans work offline; food database lookup is a separate online step. This path does not require the browser's native BarcodeDetector. Actual iPhone camera optics, focus and HEIC handling still need device verification. Source/license: https://github.com/zxing-js/browser .

## Licensed exercise clips

Fitness includes 78 wger publisher clips across 46 movements, with per-clip author/source/Creative Commons attribution. The 24 H.264 clips have broader support; 54 HEVC clips require compatible devices. Actual browser metadata loading was verified for an H.264 clip. No autoplay, startup media request, media mirroring or offline video cache is used. Publisher failures and unavailable codecs are shown explicitly. See VIDEO_SOURCES.md.

## Existing-project security setting

Enable leaked-password protection in Supabase Auth settings: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . The advisor also reports informational “RLS Enabled No Policy” entries for provider state/token/lease tables. These are intentionally server-only: all anon/authenticated table privileges are revoked, no client policies exist and only service-role code can access them. They must not be opened to client roles to clear an informational notice.
