# Genius · The Lantern Isles

**Project** — Innovation + Tech UserBob Landing Page

Genius is a K–5 learning game concept inspired by elementary-school reading and math games. A quest ties the skills together. The story clue tells the player what to count or calculate, and the answer changes the world.

## Run it

Open index.html in a browser or serve this directory with any static file server. There is no install, account, backend, or asset download. The optional read-aloud feature uses browser speech synthesis.

## Guide for future contributors and AI agents

- index.html contains the landing page, character story, quest controls, and audience explanation.
- style.css handles the sticky scene, title reveal, mobile layout, and reduced-motion styling.
- game.js defines the challenge data and the procedural scene. The camera travels between four views, and the quest result lights the bridge and reveals the story reward.
- Juniper is a fox librarian carrying a book. Pip is a moth mapmaker whose search depends on the player restoring the bridge lights. Keep character details tied to what players do.
- Before publishing, try an incorrect answer, the correct answers (4, 7, 12), the story reward, and replay. Check the flyover, scrolling, keyboard input, reduced motion, and a narrow screen.
- The scene and character meshes are original procedural geometry. Keep new dependencies free to use and record licenses and credits for any imported assets.

## GitHub Pages

Use a public GitHub repository named **genius** for the free project URL at `https://YOUR-USERNAME.github.io/genius/`. Set its description to **Innovation + Tech UserBob Landing Page**. Push this directory to main, then enable **Settings → Pages → Deploy from a branch → main → / (root)**. All asset paths are relative to the project URL.
