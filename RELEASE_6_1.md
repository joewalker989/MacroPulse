# MacroPulse 6.1 — photo library and visual comparison studio

Adds explicit **Choose from photo library** (without a camera capture hint) and a separate **Take a photo** chooser, with a local preview before saving, editable capture timestamp/view and existing explicit consent. JPEG/PNG/WebP up to 12 MB remain supported. Browser camera/library chooser behavior varies; actual iPhone hardware and HEIC conversion are not verified/integrated.

Comparison improvements:

- Side-by-side and slider remain; transparent overlay adds adjustable opacity.
- Optional orange pixel-difference map runs entirely on device, after manual alignment. Adjustable threshold suppresses smaller pixel changes. It highlights image differences, including lighting, pose, clothes and distance; it does not detect or measure fat, muscle, health or anatomical change. No AI service or image upload.
- Add numbered boxes with labels such as shoulders, arms, waist outline or posture and optional observations. Tap the later image to position a box, or use exact percentage controls. Edit/remove labels without changing images. Labels are user observations attached to the exact selected photo pair, not automatic body tracking.
- Existing pan/zoom alignment is retained. A warning appears when alignment has changed since saved identifiers; review/reposition those boxes. Consistent 4:5 comparison frames match PNG export geometry.
- Pair date interval, reversed-date warning, swap control and a consistency checklist improve comparison quality.
- Comparison PNGs include the chosen side/slider/overlay view, optional difference map, grid, numbered regions and readable observation legend. Photos remain unmodified.

Data protection:

- Existing IndexedDB database/store/version retained. Optional validated comparison metadata is added only after saving an identifier. No startup migration or photo rewrites. Existing timestamps, measurements, notes, alignment, blobs and unknown fields remain intact.
- Photo metadata updates use optimistic revision checks so stale saves cannot overwrite a newer edit. Future/malformed comparison versions and invalid/out-of-frame regions are rejected.
- Full/per-photo backups include comparison metadata with the existing checksum. Restore remains atomic and add-only; IDs already present are never replaced. Standard app JSON still excludes photos and their annotations: export photo JSON separately.
- Service-worker cache v6-1-1 precaches the new local comparison module; existing offline behavior and other features are retained. Source backup branch backup/pre-photo-studio-6.1 and local Git bundle precede this change.

Validation: 50 passing Node tests and seven local browser suites, including all prior 5.0/5.1/6.0 regression suites. New acceptance covers library/camera input separation, selected-file preview, consent, add/edit/remove identifiers, pixel map, transparent overlay, annotated PNG download, changed-alignment warning, stale-revision rejection, backup/restore, offline reload, mobile width and retention of both original images. Tests use isolated synthetic images and browser profiles; a camera chooser is simulated by supplying a file, not verified on physical hardware. No personal photo library was inspected.
