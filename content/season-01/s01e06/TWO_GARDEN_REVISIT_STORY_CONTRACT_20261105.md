# E06 two-garden revisit — child-driven PAPER consequence contract (2026-11-05)

**Status:** implementation-ready story/interaction contract, **NOT IMPLEMENTED / NOT CANON / NOT RELEASED**. Applies to the existing E06 Current Garden and Lower Garden playable authoring shells, without adding an episode. This contract does not approve real planting, terrain, growth, access, history, art or an E07 production unlock.

## Dramatic question

Milo sees healthy present-day beds above a lower pocket that *might* support a small future planting. A paper water experiment can look successful once, but that is not enough to promise a real garden. Returning to the upper beds should make the difference between **a real place that already grows** and **a possible lower PAPER plan** legible to a child, not merely show a status badge.

## Child-playable beat sequence

| Beat / trigger | Child action and visible world consequence | Character/EFL response | Nonpunitive revision |
| --- | --- | --- | --- |
| 1. Current Garden first visit | Milo walks to and inspects the healthy bed, slope and shared path. The upper bed remains visibly healthy and unchanged. | Nia: “This bed grows here now.” Finn: “Where does the rain go?” | Child can revisit observations; no forced answer. |
| 2. Lower pocket first attempt | After two distinct rain-tray runs, Milo enters the lower model, inspects runoff/path and puts the removable marker in water route or footpath. Show the existing WET/BLOCKS feedback on the same spatial board. | Milo: “That spot does not work yet.” Nia: “What could we move?” | Marker is removable; no penalty or invented real path. |
| 3. Revised trial | Milo moves the marker to the raised pocket, checks the path and tests LOTS then LITTLE water. The PAPER seed changes soggy → possible sprout on the lower board only after valid actions. | Finn: “Too wet. Try a little.” Milo: “It might grow.” | LOTS can be retried; child may choose LITTLE first; do not require deliberately making a mistake. |
| 4. Revisit comparison | Milo deliberately returns to Current Garden and then Lower Garden. Show **NOW: healthy upper bed** beside **POSSIBLE: lower PAPER sprout**, with two distinct provenance labels and a short child-controlled comparison action. | Nia: “One is here now. One is only our idea.” Milo: “What must we check before planting?” | Child can return to either place, retest care and compare again; upper bed never becomes fictional new growth. |
| 5. Provisional Chronicle / hook | Existing PAPER note records what Milo *tried*, where the marker was moved and what is still UNKNOWN; the E07 connector remains a separate rehearsal, not an earned canonical unlock. | Finn: “A path must work for everyone.” | Restart clears the PAPER experiment and comparison, not any accepted E01–E03 state. |

## Implementation constraints

1. Derive the comparison entirely from strictly replayed E06 scene-model state; no second progress boolean, browser storage, time-based plant growth or unverifiable state injection.
2. Reuse the existing upper-bed tile, lower-growth tile, spatial spot buttons, `view(state)` and `can/dispatch` guards. A small accessible comparison control is allowed; **no new generated art**. The comparison must be invisible or explicitly locked until the child has performed the relevant upper observation and lower care comparison.
3. Keep upper and lower places distinct. Never assert that the historic garden *actually* moved, that a real seed was planted, or that elapsed time made a plant grow. The lower sprout is a hypothetical PAPER outcome only.
4. For ages 6–9, use one or two short EFL sentences at each action and an optional parent cue: “What would we need to know before we plant in a real place?” Parent does not choose for Milo.
5. Preserve E04/E05 production entry guards, source replay, existing E06↔E07 fragment transfer, accepted E01/E02/C01 and E03 art/story. No Common reveal, dates, voice recording or production Chronicle grant.

## Acceptance to implement in the next code PR

- **Node:** valid first-visit → unsafe marker → raised-pocket revision → two care trials → revisit yields the comparison; a direct URL, forged comparison event, tampered history or missing prerequisite does not.
- **Node:** upper bed remains unchanged after lower-paper sprout; restart clears lower experiment and comparison; reverse trial order and nonpunitive retry remain valid.
- **Chromium:** at desktop, 568×320 landscape and 390×844 portrait, Milo can operate each place with tap/keyboard; labels clearly distinguish NOW vs POSSIBLE PAPER, and comparison is not shown prematurely.
- **Regression:** E05↔E06 and E06↔E07 strict transfer tests; 12-scene PAPER/canonical exclusion; unchanged E01 runtime and static package.
- **Release:** even green Node/Chromium is **authoring acceptance only**. MN4 HTTPS/deployment/rollback and family/device/Owner gates remain independent and NOT RUN until actually executed.

**Single next action:** implement beat 4 as a child-controlled, strictly replay-derived comparison in `e06-scene` and add targeted Node/Chromium tests; do not create a separate E06 episode, production unlock or fake growth timer.
