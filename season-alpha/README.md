# Season 1 Integrated Playable Alpha

This local developer entry opens the intended 12-scene order across the existing E01–E11 scene experiences. E06's Current Garden and Lower Garden remain two scenes in one live E06 page. Scene step buttons are preview navigation; they do not mark a scene complete or grant an unlock. E04 now offers an in-scene **Go to the Station** action only after Milo completes the draft Chronicle. The E05 Alpha arrival replays the E04 action history and checks the current replayed E02/E03 saves and draft; it carries attributed, undated memories and the paper-order clue without creating Canon, an official Chronicle or a production unlock. The launcher follows in-scene links, keeps PAPER fragments intact and reloads scenes on return so reducers replay incoming records. E08→E09→E08 remains a playable round trip.

## Start locally on Windows

From the repository root:

```powershell
npm install --ignore-scripts --package-lock=false
npx playwright install chromium
npm run serve:alpha
```

Open <http://127.0.0.1:4174/season-alpha/>. The server binds only to loopback. Port 4174 creates a separate browser origin from the production site and the existing development preview on port 4173; E01–E03 local browser saves and E04 draft notes cannot be read by the deployed production origin. The launcher itself keeps its opened-scene list in memory and writes no progress.

E04 uses the existing chronology authoring UI with the Owner-selected **fictional script model**: a station route-board copy marked Version 1, a garden route update marked Version 2, and an undated way-sign photo. The child inspects both attributed E03 memories, tries and revises an order from the visible version clue, keeps the photo uncertain, and reads the draft Chronicle. The clue orders the two papers only; it supplies no date for either memory or cause for a route change. E04 opens only when E02 and E03 have valid saves on the alpha origin. Completing E04 carries its replayed draft into the E05 PAPER scene, where Nia and Finn respond to the paper order and open question. E05 still requires its own child actions, and production remains locked. Restarting E04 or resetting E02/E03 invalidates the handoff. The launcher’s **Next scene** control remains preview navigation and does not create or stand in for a replay record.

## Local checks

Keep a second terminal at the repository root serving the other origin:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

In a third terminal run:

```powershell
node tests/season1-alpha-entry-browser.mjs
node tests/season1-alpha-canonical-start-browser.mjs
node tests/season1-alpha-continuous-browser.mjs
node --test tests/s01e04-chronology.test.mjs tests/s01e04-authoring-ui.test.mjs tests/s01e03-e04-handoff.test.mjs tests/s01e03-e04-paper-source-entry.test.mjs
node --test tests/season1-alpha-e04-e05-handoff.test.mjs
node --test tests/season1-e09-scene-shell.test.mjs tests/s01e09-authoring-prototype.test.mjs tests/season1-unnamed-story.test.mjs tests/s01e10-authoring-prototype.test.mjs tests/season1-e10-use-staging.test.mjs tests/s01e11-authoring-prototype.test.mjs tests/season1-e11-scene-shell.test.mjs tests/season1-e03-e11-paper-chronicle.test.mjs
node tests/season1-e09-scene-shell-browser.mjs
node tests/season1-e10-scene-shell-browser.mjs
node tests/season1-e11-scene-shell-browser.mjs
node tests/season1-e03-e11-paper-chronicle-browser.mjs
```

The twelve-scene GitHub regression remains the broader regression gate. It reports engineering and PAPER evidence only; it does not approve E04 sources, real site access, art, production saves, deployment, or family/device acceptance.
