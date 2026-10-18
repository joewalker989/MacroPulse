# MacroPulse 5.1 release

Baseline inspected: 3e2ce58 (5.0), all runtime files and persistence validators, Pages HTTP 200, existing backup branches and 32 passing unit tests. Historical assistant messages contain reference markers only; this request supplies scope.

5.1 adds full/half/quarter 40 US fl oz jug buttons to the existing hydration store, daily grouped history, existing configurable ml goal/undo; shared formula profile with cm canonical height and US/metric display; Mifflin BMR and maintenance/loss/gain estimates with all four requested rates, explicit app guardrails, adjustable protein and fat; Navy circumference body-fat estimates; Devine/Robinson/Miller/Hamwi references; persisted input/result history, explicit target approval and weight/profile-change review; weekly mean changes and adequately sampled three-week plateau hints. No calculation claims measured metabolism or guaranteed weight response. Existing activity calories remain separate to avoid double counting.

Explicit approval updates the existing settings used by diary, meal planner and dashboard. Weight check-ins preserve legacy lb records and support kg entry/display through the profile. Existing measurements, workouts and photo progression remain available on the same screens. No photo analysis or implied body-fat measurement. Workout/food history is never rewritten by these calculations.

Data: optional health schema v1, created on explicit use, no startup saves. Immutable byte snapshot macropulse_pwa_v1_before_5_1 before first health save, downloadable in calculator history. Unknown fields preserved. Invalid/future schemas, quota errors and stale writes rejected. Core export/import includes health; photos stay in their original IndexedDB and require separate photo backup. Cache generation v5-1-1 includes new modules; updates wait for old tabs to close. Pre-5.1 Git branch and local bundle preserve source, not personal browser data.

Validation: 37 unit tests; original four browser suites plus 5.1 acceptance cover preview/decline/approval, all jug sizes, unit conversion, review after weight change, formula examples, sparse/duplicate trend gates, snapshots and quota failure, unknown/legacy data, photos, offline reload, mobile width and stale tabs. Local Windows uses installed Chrome; CI uses Chromium. Real iPhone hardware/camera, native iOS, cloud sync, AI and external nutrition APIs are not integrated.

Reference sources: Mifflin et al., https://pubmed.ncbi.nlm.nih.gov/2305711/ ; circumference equations https://api.army.mil/e2/c/downloads/566092.pdf ; weight-loss context https://www.cdc.gov/healthy-weight-growth/losing-weight/ . App guardrails are conservative product limits, not clinical clearance.

6.0 remains pending until this release is deployed and the deployed 5.1 acceptance passes.
