# MacroPulse Apple companion

This source adds a native iOS shell, a WidgetKit extension and an independently built watchOS app. It is not an App Store release. Browser installations cannot acquire HealthKit access by deploying this source to GitHub Pages.

## Build and device setup

On a Mac with Xcode, install XcodeGen, run `xcodegen generate --spec project.yml` here and open the generated project. The Apple companion workflow builds unsigned simulator targets; a successful build does not verify HealthKit, notifications, biometrics, watch pairing or Live Activities on a physical device.

Before installing, select your Apple Developer team for each target, register the bundle IDs and `group.com.joewalker989.macropulse` App Group, enable the required HealthKit and App Group capabilities, and provision your iPhone and Watch. Install the iOS app and independent Watch target. App Store/TestFlight distribution, paired Watch embedding and review are not configured.

## Preserve existing data first

The companion's WKWebView has its own storage. It does not automatically share Safari or a Home Screen web app's records or photos. Export app JSON and a separate photo backup from the existing installation. Import both in the companion, or restore reviewed encrypted cloud records and encrypted photo versions. Keep the originals until you verify counts, images and history. Native setup does not migrate or delete the existing installation.

## Behavior and limits

- The hosted web page accepts native messages only through the companion bridge. Native handlers require the main frame and the exact HTTPS GitHub Pages origin and MacroPulse path.
- Health access is user initiated, read only on iPhone and limited to chosen recent records. The Apple permission sheet controls which types are readable. Empty results do not prove access was granted. Imported observations preserve their source and never silently become logged workouts, measured weight or calorie adjustments.
- The Watch collects actual workout heart rate and active energy through HealthKit after explicit authorization. Its Stop & save action saves the Watch workout to Apple Health. Phone controls queue until the phone app is open. Commands for other sessions or older than two minutes cannot operate a phone workout.
- Widget water entries queue with unique IDs and are saved once by the phone. Widget values are the last shared snapshot; they are not a background cloud feed. Snapshot metadata uses the App Group container, not end-to-end encryption.
- Hydration reminders require notification permission and are scheduled for seven days. Open the app to renew them. Reaching the synced goal cancels today's remaining hydration notifications.
- Live Activities require iOS authorization and an active phone workout. No remote push service is configured. The native device-security screen uses device authentication; it does not encrypt existing local web storage.

Physical-device acceptance remains required: permission denial/limited grants, duplicate imports, Watch disconnection/reconnection, stale command rejection, widget hydration after relaunch, pause/resume/stop elapsed time, notification denial and cancellation, background locking and encrypted backup transfer.
