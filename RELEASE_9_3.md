# MacroPulse 9.3 — combined food search

Roadmap item 9 adds one search across saved/custom foods, cached USDA and Open Food Facts records, illustrative examples, and selected online sources. Items 1–7 remain shipped. Item 8 remains deferred: the user has neither a Mac/Xcode setup nor an Apple Developer team. XML/CSV import remains available; direct Apple Health is not activated.

## Shipped behavior

- Food opens with combined search; the original library and source-specific tools remain available in disclosures.
- Search runs only on submission, with independent source status, cancellation, partial-success results and offline saved matches. No query history is persisted, and searching never writes diary records or changes targets.
- Source identity, serving basis and nutrition stay visible. Results from different providers remain separate. Cached copies of the same provider ID are combined with fresh results; edited custom foods and different portions are retained.
- USDA results can save without logging. Open Food Facts and saved-food portions require review before logging. Unknown gram/milliliter bases require package confirmation before logging. True zero nutrients remain zero; missing macros are not invented.
- Current Open Food Facts name search uses its Search-a-licious service through MacroPulse's existing authenticated service. Sign-in is required; this shares the existing 20 requests/day/account quota with server recipe import and recognition. Only the submitted query is forwarded, with no diary, profile, image or website cookies. Queries are normalized to plain words; syntax is not treated as provider filters.
- Public barcode lookup uses API 3.6. Modern nutrition is taken from one complete manufacturer/packaging as-sold per-100 g/ml input set, preferring manufacturer data. Estimated, prepared and unsupported serving sets are excluded; sets are never mixed to manufacture complete macros.
- The server relay has a fixed HTTPS destination, rejects redirects, identifies MacroPulse, limits response size to 2 MB and times out. Existing authentication, private storage and quota permissions are retained. No database migration is needed.

## Verification and limits

The full 19-browser regression run passed. Following the modern barcode adapter change, the connected and combined-search browser suites passed again. All 144 unit tests pass, including current nutrition-set selection, source deduplication, partial failures, cancellation, zero/missing nutrients, authentication, quota, fixed-host retrieval and oversized-response handling.

A disposable signed-in account verified actual server name search (17 usable rice results), public API 3.6 barcode lookup and public USDA search (20 results) without diary writes. No real user records or photos were used. The temporary account is removed after deployed verification. Browser regression provider fixtures also exercise errors and offline behavior; those fixtures are not evidence of provider uptime.

Open Food Facts remains community data requiring package review. USDA public demo limits and provider outages still apply. AI recognition and Strava remain awaiting credentials and real activation. Native Health, Watch, background sync and physical-device permissions remain pending. Final GitHub checks and deployed asset/browser evidence are recorded separately in task outputs.

Next: roadmap item 10, guided second-device setup and real-user acceptance. The existing synthetic two-device sync regression passes; this does not establish acceptance on the user's own devices.
