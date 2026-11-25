# Season 1 Integrated Playable Alpha

This local developer entry opens the intended 12-scene order across the existing E01–E11 scene experiences. E06's Current Garden and Lower Garden remain two scenes in one live E06 page. Scene step buttons are preview navigation; they do not mark a scene complete or grant an unlock. Follow an in-scene PAPER handoff when it is available to carry strict replay-checked actions to the next episode. The launcher follows these existing links, keeps their PAPER URL fragments intact, and reloads a scene on return so its reducer can replay the incoming record. E08→E09→E08 is covered as a playable round trip.

## Start locally on Windows

From the repository root:

```powershell
npm install --ignore-scripts --package-lock=false
npx playwright install chromium
npm run serve:alpha
```

Open <http://127.0.0.1:4174/season-alpha/>. The server binds only to loopback. Port 4174 creates a separate browser origin from the production site and the existing development preview on port 4173; E01–E03 local browser saves and E04 draft notes cannot be read by the deployed production origin. The launcher itself keeps its opened-scene list in memory and writes no progress.

E04 uses the existing chronology authoring UI with clearly labelled fictional model cards. It opens only when E02 and E03 have valid saves in the alpha origin. The cards are not approved evidence, and the draft cannot write Canon or unlock E05.

## Local checks

Keep a second terminal at the repository root serving the other origin:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

In a third terminal run:

```powershell
node tests/season1-alpha-entry-browser.mjs
node tests/season1-alpha-continuous-browser.mjs
node --test tests/season1-e09-scene-shell.test.mjs tests/s01e09-authoring-prototype.test.mjs tests/season1-unnamed-story.test.mjs tests/s01e10-authoring-prototype.test.mjs tests/season1-e10-use-staging.test.mjs tests/s01e11-authoring-prototype.test.mjs tests/season1-e11-scene-shell.test.mjs tests/season1-e03-e11-paper-chronicle.test.mjs
node tests/season1-e09-scene-shell-browser.mjs
node tests/season1-e10-scene-shell-browser.mjs
node tests/season1-e11-scene-shell-browser.mjs
node tests/season1-e03-e11-paper-chronicle-browser.mjs
```

The twelve-scene GitHub regression remains the broader regression gate. It reports engineering and PAPER evidence only; it does not approve E04 sources, real site access, art, production saves, deployment, or family/device acceptance.
