# Wondervale production gates — review card

This is a compact fallback snapshot. For any live work prefer current GitHub `main` versions of `docs/EPISODE_PRODUCTION_FAST_LANE.md`, the episode EPB, and the episode interaction test matrix.

## Gate 1 — Story, EFL, continuity

- The episode is worth playing as a story, not a disguised English quiz.
- The child's evidence, meaningful action and opportunity to revise a first idea are explicit.
- Only genuine observed clues enable the correct reasoning, not mere taps, automatic success or a parent answer.
- Parent cue is brief, optional and triggered after the child sees the relevant evidence.
- Chronicle and once-only story ledger events are defined; old mysteries are not spoiled.
- Script/line IDs and cross-episode prerequisites are locked before voice generation.

## Gate 2 — Art selection and delivery

- Reject a picture only for material safety, canon, identity, spoiler or unusability; do not overfit scenery perspective.
- Original PNG remains full resolution, and WebP is a versioned derivative.
- Each file has correct path, dimension, byte size, SHA-256 and Git blob SHA.
- One directory-preserving ZIP is offered when reliable direct GitHub binary upload is unavailable.
- After the upload message, check fresh `main`/relevant branch and run the exact-byte verifier; never assume the previous main still applies.
- No claim of runtime completion from an approved PNG or a matching Git blob.

## Gate 3 — Actual gameplay

- Real child-controlled Milo movement is safe; feet targets are walkable, paths avoid fences/water/props, companions and speaker labels remain legible.
- Inspection visibly displays the required evidence **before** the state is marked observed.
- Correct/uncertain choices recover without punishment; post-revision clue cannot appear early.
- Save, restore, repeated taps, historical replay and persistent Chronicle pass without double writes.
- E01 regression and episode-specific engine/browser tests run on latest PR head, with real screenshots.

## Gate 4 — Owner and release

- Portrait phone widths 320/360/390/430, landscape and desktop parent/child layout examined in actual running browser.
- Touch, keyboard, audio-off/listen and motor-accessible alternatives work.
- Owner's gameplay PASS is separate from artwork PASS.
- Build identifier and GitHub SHA match the packaged assets and actually served HTTPS version.
- Rollback release exists; repository decisions and next focused task are committed.

## Stop rule

When a gate passes, advance to the next *unfinished* gate. Do not reopen an accepted upstream decision for ordinary downstream polish. If a material problem genuinely forces reopening, record why and how it affects downstream artifacts.
