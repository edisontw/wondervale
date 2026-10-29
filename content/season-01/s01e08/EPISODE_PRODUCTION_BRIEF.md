# S01E08 Episode Production Brief — When the Steps Light Up

> **Gate 1 DRAFT (2026-10-29). NOT approved for production script, art, canonical Chronicle, E09 unlock or MN4 deployment.** Scene 09 of the existing 12-scene / 11-episode Season 1 plan. Any diagram or lamp behavior used in an authoring prototype is **synthetic**; it cannot establish real geometry, electrical safety, a historical date or the location of the final mystery.

## 1. Identity and authority

```yaml
episode_id: s01e08
season_id: s01
arc_id: s01a02
working_title: "When the Steps Light Up"
brief_revision: 1
brief_status: draft
release_scene_id: s01e08-lantern-steps
release_scene_number: 9
estimated_duration_min: 10 # design estimate only
estimated_duration_max: 16 # design estimate only
```

Authority: [Season 1 architecture](../../../docs/SEASON_1_ARCHITECTURE.md), [learning weave](../../../docs/SEASON_1_LEARNING_WEAVE.md), [12-scene delivery plan](../../../docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md), [E07 brief](../s01e07/EPISODE_PRODUCTION_BRIEF.md), [E07 interaction](../s01e07/INTERACTION_SPEC.md). Preserve C01 trio identity, E01–E03 approved gameplay/art, E06 garden and E07 connector hypotheses as unapproved until their gates close.

**Locked story:** E07's proposed connector reaches only the **base** of Lantern Steps. E08 is a quieter evening visual investigation: restore **part** of the lower-step lighting, compare a striking apparent bracket/marker alignment from more than one safe viewpoint, then find a **candidate** maintenance/date clue leading toward North Hill. The upper unsafe hill segment remains closed in E08 and E09; no Common reveal before E10. Exact light positions, electrical restoration method, date, historical attribution and safe walking geometry are **not** approved.

## 2. Story and character contract

- **Trigger:** after verified canonical E07 completion, the trio arrives at the accessible lower Steps near dusk. Only a few low lanterns can be lit; the dark upper segment is out of bounds. A partial bracket pattern catches Milo's eye.
- **Question:** does the pattern really indicate a direction, or does it only look that way from here? A single striking view is **not** a historical proof.
- **Milo:** child moves him between safe observation anchors, chooses a bounded light test and changes viewpoint before drawing a conclusion. He is curious but does not jump from one view to certainty.
- **Nia:** separates observations from explanations; proposes checking a second view without declaring the correct result.
- **Finn:** suggests a **minimal reversible test** with existing lower fixtures rather than adding more equipment or overriding a safety boundary.
- **Turning point:** first view appears to line up; a side view visibly changes the overlap/spacing. The child can return to the first view and check again. Neither outcome is a wrong answer.
- **Resolution:** a partial warm light returns to the accessible lower Steps (proposed future world change), and the Chronicle records two distinct views, the uncertainty and an **unverified** service-plate/maintenance lead. The group plans a safe North Hill survey in E09; it does not enter the closed route.
- **World growth:** lower-step lanterns stay visibly lit in later visits **only after canonical approval**. Upper Steps and North Hill remain closed. No points, badges, timers, mandatory audio or full electrical repair.

## 3. Beat map — one substantial location

| Beat | In-world trigger | Child-controlled action | Visible consequence |
| --- | --- | --- | --- |
| `s01e08-sc00` | E07 connector reaches the Steps base | Notice dark lower fixtures and a marked safe observation area | Light-test idea introduced, not automatically solved |
| `s01e08-sc01` | Two accessible lower lantern fixtures are inspectable | Walk Milo to inspect brackets, boundary and the unlit plate | Visible features separated from a guess |
| `s01e08-sc02` | Finn offers a **model** of a bounded two-lamp test | Select and activate only the safe lower test fixtures; retry/undo | Partial light and shadow/marker projections appear |
| `s01e08-sc03` | From the base, brackets seem to point one way | Move Milo to a second safe viewpoint and observe again | Different perspective visibly changes the apparent pattern |
| `s01e08-sc04` | Nia asks what stayed the same | Return to first viewpoint or check a third; compare two observations | First/second view evidence panel, not a forced yes/no quiz |
| `s01e08-sc05` | An accessible service plate catches the light | Inspect plate **without inventing a date**; mark source as pending | Provisional clue toward North Hill, source approval needed |
| `s01e08-sc06` | Lower Steps remain gently lit | Record observation vs interpretation; view E09 safe-survey hook | Proposed Chronicle and visible lower-light persistence only |

Storybook and Chronicle panels are not additional release scenes. No upper-step movement is simulated as legal traversal.

## 4. Distinct child actions and nonpunitive retries

1. **Explore/inspect:** Milo must walk between actual visible lower anchors and inspect at least two features (brackets and closed boundary) before the light test. Visual focus and readable text; no invisible floor.
2. **Try limited light:** use two **clearly labeled synthetic lower fixtures** in a reversible authoring model. A different combination can be tested; insufficient illumination shows what remains hard to see, not failure. Do not equate a model switch with safe real electrical repair.
3. **Test a viewpoint hypothesis:** observe the same three markers from at least two separated, safe vantage points. Geometry computes apparent angular separation, not a hard-coded correct button. From one point they may overlap; from another they spread. Let the child return and retest.
4. **Compare/record:** child points to what changed with position and what did not (fixtures remained fixed). A service plate may be recorded as **source pending**, never a fabricated dated historical card. Completion of the authoring model is provisional, never a canonical unlock.

**Wrong/uncertain outcomes:** changing lamps or viewpoint never loses story progress, damages equipment, enters the upper route, or shames the child. Feedback says e.g. “From here, they line up.” / “From here, I see a gap.” / “We need another view.” Distinguish seeing an alignment from proving an old route.

## 5. Learning, EFL, parent cue

Primary: test visual pattern from multiple viewpoints; reason about position and apparent alignment. Secondary: smallest sufficient test rather than overbuilding. Transfer: E01 observation vs guess; E04 uncertain sources; E07 Finn's design/testing. EFL functions: `from here / from there`, `higher / lower`, `looks like`, `lines up`, `again`, `maybe`, `I see a gap`. Short draft lines: “Look from here.” “They line up!” “Try from there.” “Now I see a gap.” “The lamps did not move.” “Maybe it points uphill.” Spoken/audio production remains deferred; captions and Listen affordance are retained.

**One optional parent cue**, after the first apparent alignment and before the second view: “What could Milo do to check this from another place?” Adult does not select a viewpoint or assert that the clue is true. Help ladder: (1) free move, (2) highlight second safe viewing marker, (3) demonstrate control only, (4) show side-by-side first/now outlines; do not auto-complete inference.

## 6. Proposed continuity — inactive

```yaml
requires:
  episodes_completed: [s01e07] # validate actual ledger schema before integration
release_scene_id: s01e08-lantern-steps
proposed_events:
  - id: s01e08_lower_lanterns_relit
    consequences: [lower_steps_partially_lit]
  - id: episode_completed:s01e08
    consequences: [s01e09_eligible]
proposed_chronicle:
  id: s01e08_two_views
  fields: [first_view, second_view, lamps_unchanged, hypothesis_uncertain, service_plate_source_pending]
callbacks:
  - s01e09: safe_north_hill_survey_only
  - s01e11: lower_lanterns_remain_lit
```

IDs are proposals, not activated. Authoring preview must expose `canonicalEvents=[]`, `unlocks=[]`, `historicalClaims=[]`, no localStorage, no production import and no E09 playable link. Replays/corrupted checkpoints must never award progress.

## 7. Art, safety, sources and Gate 1

**Reuse** approved C01 trio and established painterly world grammar. A later **single Work art batch** may require one painterly lower-Steps scene with explicit safe ground/closed upper boundary, partial warm lamp-on/off layers, three legible brackets/markers and two safe observation anchors; use existing suitable assets first. Any synthetic model must be visibly labeled **MODEL — NOT THE REAL STEPS**. No new SVG portrait polishing, repeated full-scene generation, or unapproved production art. Avoid flashing/strobing; supply static reduced-motion alternative. No prerecorded voice/music/SFX for now. Keyboard/touch parity, >=44px touch targets, readable narrow portrait fallback, no mandatory fine drag, no location tracking.

**Grouped Owner Gate 1:** (a) safe lower-step topology and which fixtures can plausibly light, (b) source/rights/meaning of any maintenance plate and **exact date only if sourced**, (c) whether actual markers/brackets support the proposed two-view observation, (d) production lighting and visual approval, (e) canonical E07 handoff. If source absent, show an **undated observation**, not a synthetic dated card. Upper North Hill stays inaccessible.

**Acceptance:** [interaction spec](INTERACTION_SPEC.md) and [test matrix](INTERACTION_TEST_MATRIX.md) define the next isolated Node/browser model. This brief is a substantial story/content deliverable, **not** a playable or tested E08 scene. **Next task:** build deterministic noncanonical light/viewpoint authoring engine with Node tests; then Chromium/mobile scene.
