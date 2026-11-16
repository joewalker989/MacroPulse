# Full-catalogue anatomical model render

This optional development tool creates MP4s and posters for all 23 generated exercise references. The app only serves those small files; it does not download Three.js, use WebGL on phones, or load the source GLB.

The neutral MakeHuman model comes from the pinned OpenGym3D ZIP recorded in `media/exercise-3d/provenance.json`. The pack is MIT-licensed (notice retained here); MakeHuman core graphical assets are CC0. The embedded squat animation is **not played or retargeted**. The renderer resets the skeleton to its bind pose and authors new bone directions. MakeHuman and OpenGym3D do not endorse this app or certify these exercises.

Motion rules:

- Leg raise: 15–80° hip flexion with a small fixed knee bend and a fixed supine trunk, six seconds per cycle.
- Dead bug: six seconds extending/returning the left leg and right arm, then six seconds on the opposite side; fixed supine trunk, with knee extension during the lowering phase.
- Band row: fixed upright trunk and feet; elbow flexion and shoulder extension pull a band from a fixed anchor toward the ribs. Tubing endpoints follow the wrist joints.
- Cosine interpolation provides zero velocity at the endpoints. No generated pose is marketed as a qualified form review or used to assess a user's movement.

Install the root project's test dependencies and Chromium first, then run `npm install` and `npm run render` in this folder. Windows can use the optional pinned encoder; on other platforms set `FFMPEG_PATH` to a compatible FFmpeg executable. Rendering uses local Chromium, Three.js and FFmpeg. No network is used during rendering.

Re-rendering overwrites only these 23 named MP4/JPG pairs and automatically refreshes catalogue sizes and provenance hashes. Re-inspect the videos after any change. Do not admit the clips to RealMotion's specialist-reviewed manifest without its separate review evidence. Maintain source notices in `OPENGYM3D_LICENSE` and `THREE_LICENSE`.

Run `node render.cjs --review` to create a start/end contact sheet before encoding, or `node render.cjs --only=lunge` to rebuild one known reference. The full catalogue adds limb placement, grounded feet, exercise-specific weights/supports and a stationary bike. Plank is an isometric hold; lunge, marching and Dead Bug alternate sides. Rendering rejects unknown IDs. The manifest updater changes only public asset metadata, never application records.
