# MacroPulse 8.0.1 — verified, optional label-reader downloads

The first-stage feature scope and all remaining integrations are listed in
[RELEASE_8_0.md](RELEASE_8_0.md). This patch changes OCR delivery, not that scope.

Food → Read a nutrition-label photo explains the first-use download before
the user presses Read label. The app fetches five public files from exact
jsDelivr package versions, checks their SHA-256 hashes, and stores them in a
separate local cache. No picture, diary, health record or credential is uploaded.
Service-worker execution also checks each cached file's hash. Invalid bytes
are deleted and rejected; failed or offline first-time setup offers typed text.

After successful setup the reader works offline after reopening the app.
Clearing browser cache requires downloading the files again. App upgrades keep
the compatible OCR cache. Main app installation does not download the model.
Dependency licenses, model license, and distribution notices remain in vendor/ocr.

Validation: 89 unit tests and all 12 browser suites. The connected-tool test
reads a real generated label with the OCR worker, rejects a deliberately corrupt
download, repeats recognition after offline reload with no new download,
and rejects tampered cached script bytes before execution. A separate run used
actual public CDN downloads rather than fixtures and passed offline recognition.
These checks use disposable browser profiles and synthetic data; physical
iPhone/camera accuracy and native health authorization remain unverified.
