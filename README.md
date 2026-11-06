# Genius · The Emberwake

Innovation + Tech / UserBob. Genius is a K–5 adventure game concept where students use reading and math to progress. This static landing page previews the first adventure in the kingdom of Bramblewick.

## Run and publish

Serve this directory with a static HTTP server. GitHub Pages publishes the repository root from main. The illustrated experience and playable quest use local assets. The optional WebGL atlas loads pinned Three.js from jsDelivr only when opened. If it cannot load, the illustrated atlas remains available.

## Contributor handoff

- index.html and style.css define the hero, illustrated atlas, demo and educator section.
- game.js holds the two routes, three difficulty bands, hints, the shared reading/math finale, XP and route-dependent outcomes.
- world.js builds a rotatable WebGL atlas with procedural characters, terrain and animated lighting. It responds to map selection and quest state.
- emberwake.webp and kingdom.webp are original generated artwork for this project. Three.js is MIT licensed, and the scene geometry is authored here.
- Check both routes, all difficulty bands, wrong-answer hints, final rewards, keyboard controls, reduced motion and the illustrated fallback.
- The questions are original, informed by elementary assessment item formats. They have not been validated as a formal assessment or mapped to a full curriculum.

## Research references

- [Bruno Simon's MIT portfolio source](https://github.com/brunosimon/folio-2025) shows how the environment can act as the interface.
- [Continuous scroll-driven 3D scene discussion](https://www.reddit.com/r/threejs/comments/1wacigy/rebuilt_my_portfolio_scrolldriven_one_continuous/) shows both the appeal of camera choreography and the friction of requiring it.
- [Three.js](https://github.com/mrdoob/three.js) supplies the WebGL atlas. [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) offers CC0 models for future expansion.
- [Minnesota Questions Tool](https://testing123.education.mn.gov/test/assess/ques) and [Massachusetts Grade 3 released items](https://www.doe.mass.edu/mcas/2025/release/g3-math.pdf) informed question structures.
- [Stack Overflow discussion on batching repeated meshes](https://stackoverflow.com/questions/60852311/threejs-vertices-and-faces-optimization) and the [Three.js InstancedMesh API](https://threejs.org/docs/pages/InstancedMesh.html) informed the atlas batching.
