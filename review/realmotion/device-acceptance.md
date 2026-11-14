# Physical-phone acceptance sheet

Do not fill this from desktop emulation. Test a disposable app profile with synthetic
records and a backup; avoid exposing real health or diary data in screenshots.

Candidate commit / media-manifest revision: _________________________________________

Repeat for **iOS Safari** and **Android Chrome**:

Tester: __________________  Date: __________________  Device: ______________________

OS / browser version: __________________  Evidence ID / private link: _______________

| Check | Expected result | Pass / fail / issue |
| --- | --- | --- |
| Playback | All 15 exact clips decode; selected clip only, no autoplay | |
| Angles | Each label matches the approved camera; switching stops old stream/voice | |
| Speeds | 0.25 / 0.5 / 0.75 / 1 work; image remains useful at quarter speed | |
| Rep loop | Approved cycle repeats cleanly; seek/pause/end and next rep behave correctly | |
| Voice sync | Enable after unmuting; text and audio stay aligned at every speed and after seek/loop | |
| Captions/transcript | Full coaching text is readable with audio off; timing and accents correct | |
| Mute | All audio stops; original clip audio does not compete with coaching | |
| Offline fallback | After app shell is installed, airplane mode/reload retains pictures/cues and records; no pretend cached video | |
| Screen reader / keyboard | VoiceOver/TalkBack announces labels and unavailable states; focus stays in dialog and returns on close; test Bluetooth keyboard if available | |
| Saved data | Opening, playing and closing do not write routine/log/photo data; synthetic backup remains equal | |

Also check 320/390px layouts where applicable, large text, landscape, reduced motion,
slow-network startup, publisher failure, backgrounding, audio interruption and reopening.
Attach one issue per failure with exact device/build/clip and reproduction steps.
Developer fixes and affected-case retest are required before final sign-off.

Decision: pending / changes requested / approved

Tester / date / exact commit / evidence: ____________________________________________

The release owner reviews both platform sheets and current CI. A successful Apple
companion build does not establish iOS Safari media or accessibility behavior.
