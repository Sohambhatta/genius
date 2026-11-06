# Genius · Chapter 1 — The Sleeping Mountain

Genius is an educational adventure concept for grades K–5. The first chapter previews Rowan's journey to Mount Ember in four scroll sections and a playable gate encounter.

## Run and publish

Serve this folder over HTTP. GitHub Pages serves the root of main. Three.js and GSAP/ScrollTrigger load from pinned CDN URLs. The story and questions work with the illustrated background if WebGL is unavailable. Fixed layout utilities are local CSS.

## Contributor handoff

- index.html defines the four scroll sections and demo HUD.
- world.js renders the fixed orthographic scene and interpolates four camera shots. It animates the seed pickup, character traversal, gate, chest, and stars in response to the quest state.
- game.js contains three question sets and the quest state machine. Changing level resets the encounter and cancels pending transitions.
- style.css defines responsive overlays, edge blur, and reduced-motion styling.
- Test each level through hints, pickup, path choice, gate, walk, treasure, and replay.

## References

- [Three.js](https://github.com/mrdoob/three.js) and [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Bruno Simon's portfolio source](https://github.com/brunosimon/folio-2025)
- [Minnesota Questions Tool](https://testing123.education.mn.gov/test/assess/ques) and [Massachusetts released grade 3 items](https://www.doe.mass.edu/mcas/2025/release/g3-math.pdf)

## Environment references

- [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) and its [GitHub Pages asset index entry](https://tmhsdigital.github.io/Free-Game-Dev-Assets/entry/kenney-nature-kit/) are CC0 prop references.
- [Quaternius Stylized Nature MegaKit](https://quaternius.itch.io/stylized-nature-megakit) is a CC0 source for more detailed glTF foliage. Import selected meshes and batch repeats by geometry and material.
- The current bridge, foliage, shoreline, and village details are authored procedurally in world.js. No third-party model files are shipped.

## Level 2 / Lantern Ridge

After collecting the bridge chest, follow the summit map to a new diorama. The reading clue distinguishes the open ridge from a blocked tunnel. The water problem spends three seeds to grow lantern flowers. The lookout completes the two-level demo at 200 XP.
