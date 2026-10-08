# Wondervale Visual Mini-Bible — Illustrated Living Diorama

```yaml
visual_style_id: wondervale-illustrated-living-diorama
visual_style_version: 1
direction_status: locked_for_e01_reference_production
actual_visual_reference_assets: trio_identity_approved_remaining_references_pending
generated_media: 3_trio_reference_candidates_no_game_assets
source_project: edisontw/wondervale
```

## Purpose and approval boundary

This document locks the **shared visual production direction** for the first Wondervale vertical slice and establishes a reusable baseline for later episodes. Reference A trio identity sheet is **visually approved** by the project owner (Candidate 01, see `docs/ART_REFERENCE_PROGRESS.md`); two subsequent turnarounds are not identity-approved. This does not approve game-ready sprites, animation, environment reference art or phone-runtime performance. Remaining production **reference sheets** still require review before batch/scene asset production.

Canon remains governed by the current project documents and E01 EPB/script/interaction specification. This mini-bible cannot change trio ages/roles, scene/landmark geography, mystery meaning or gameplay logic.

## Considered approaches

These are design assessments, **not measured child-study results**.

| Direction | Strength | Main risk | Decision |
|---|---|---|---|
| **A. Watercolor Storybook Plates** — richly painted fixed illustrations with isolated clickable inserts | Strong storybook atmosphere, soft charm, expressive illustrated moments | State transitions and real-space comparison may feel like disconnected static slides; generated illustrations drift between panels | Not selected as base; allow watercolor *texture* within selected system |
| **B. Illustrated Living Diorama** — 2.5D layered painterly sprites, fixed readable three-quarter spatial view, storybook crops sharing identical refs | Strong balance of readable playable world, warm narrative art, consistent variants, manageable animation and mobile delivery | Needs a disciplined master layout/reference pipeline; parallax and layers can cause unwanted visual occlusion | **SELECTED** |
| **C. Stylized Real-time 3D Town** — fully modeled characters, navigable camera and environment | Potential for movement and dynamic lighting | More modeling, rigging, performance, camera control, hit-target, and appearance-consistency work than E01 needs | Defer unless vertical-slice testing provides a compelling reason |

**Rationale:** B preserves the “storybook shell + living interactive scenes” as **one world**, while allowing Milo to move between fountain, tree, noticeboard and route marker. It supports state overlays and smaller production increments without committing E01 to a seamless 3D city.

### Selection status

Selected: **B, Illustrated Living Diorama**, as **project-level visual production direction v1**. This is a decision about style grammar, *not* a claim that particular generated character designs have already been accepted. Any future redesign of the visual grammar must explicitly revise this file and assess downstream assets.

## 1. Visual grammar

**Imagery:** illustrated, tactile and gently dimensional: 2D hand-drawn/painterly character and environment assets arranged in depth-ordered layers, creating a **2.5D storybook-diorama look**. This describes appearance; it does **not** mandate a particular framework or a true 3D engine.

- Shapes: rounded, varied natural forms; clear civic architecture; soft but deliberate contours and readable props.
- Lines: coherent warm-dark ink edges, medium stroke on characters/interaction-critical silhouettes; finer quiet detail reserved for close views; avoid inconsistent thick cartoon outlining per asset.
- Finish: restrained brush/paper texture only in non-critical surfaces. Clue lines, map symbols, focus outlines and typography must remain sharply legible.
- Depth: background / midground / interaction layer / foreground accents / characters / UI overlays. Use compositional overlap and light parallax sparingly; never hide target landmarks or Milo with foreground art.
- Lighting: stable soft daytime with a plausible upper-left light direction in reference compositions; gentle shadows show depth without changing clue information.
- Surface: warm civic materials such as painted wood, stone, foliage, cloth and paper; no glossy plastic toyworld and no photoreal human skin.
- Tone: curious, familiar, inhabited and safe; old map/plate look *historically ordinary*, not supernatural, dangerous or sinister.

### Color and contrast

Palette policy for first references (adjust exact shades during reference review, but keep functional relationships):

| Role | Initial color token | Suggested reference | Use |
|---|---|---|---|
| paper/light surfaces | warm ivory | `#F5EEDD` | storybook shell, calm notices |
| structure/ink | dark blue-charcoal | `#344653` | legible contour, icons, dark text |
| nature/support | sage green | `#8DA789` | tree/planted areas |
| water/exploration | muted teal | `#5B9E9D` | fountain and gentle environmental accents |
| lively accent | muted coral | `#DF866A` | selective warmth and Milo focus cues |
| discovery light | soft amber | `#D8AC5F` | small accent, never sole state indicator |
| secondary neutral | muted blue-gray | `#8498A3` | structures, noncritical UI |

**Not fixed character costume colors.** Character identity must remain legible as grayscale silhouette, not from assigned accent color. Palette is a **family**, not a rule that every object uses these exact hex values. Test actual caption/UI contrast, including overlays on detailed scenes; do not claim contrast compliance until measured on rendered compositions.

Art should favor calm larger shapes over detailed textures that become visual noise on phones. Avoid saturated primaries dominating the entire screen, dark mystery-blue scenes, and generic stock-game gradients.

## 2. Character identity and proportions

Canonical ages/behavior: Milo ~8, Nia ~8, Finn ~9, as in `docs/CORE_TRIO.md`. All are children of credible similar scale; Finn may read slightly older but never an adult/taller teenager. Do not infantilize with giant baby-like heads.

### Silhouette grammar (visual-direction lock, not final costume)

| Character | Target readable shape/movement | Expression and posture | Prohibited inference |
|---|---|---|---|
| **Milo** | compact, agile, gently forward/active silhouette; readable from fixed game camera | eagerness, helping, scanning; body language shows the player is directing Milo | not a school mascot or silent avatar; no magic pointer |
| **Nia** | quieter, balanced upright/open body language, visible sketching/record gesture when needed | attentive gaze, confident communication, sometimes tentative | not permanently frozen or framed as “the smart bookish one” |
| **Finn** | subtly more angular, ready-to-handle-objects posture; visually distinct arm/pose rhythm | amused challenge, close physical examination, curiosity | not an inventor caricature with mandatory oversized tools/goggles |
| **Steward** | ordinary local adult with grounded practical gestures; secondary hierarchy | focused on routine noticeboard repair | not a magical guide, historian, narrator or answer giver |

A neutral **front, profile, three-quarter** sheet of the trio at common relative scale must precede any action-pose batch. An 80–120 px approximate on-screen-height silhouette check is an initial **reference review suggestion**, not a hard runtime camera size. Test grayscale and small-size recognition and allow outline/pose improvement before locking generated identity.

Character consistency across storybook portraits and in-scene sprites requires the same approved shape language, facial structure, accessories **if later approved**, clothing pattern, palette relationship and expression/pose references. Avoid per-image redesign and excessive generated outfit variants.

### Approved trio identity reference v1

On 2026-10-08 the user approved the **actual** [Candidate 01 reference sheet](../assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png) as the visual identity anchor for Milo, Nia and Finn. See [C01 decision](../assets/reference-candidates/s01e01/TRIO_CANDIDATE_01.md) and [turnaround comparison](../assets/reference-candidates/s01e01/TRIO_TURNAROUND_REVIEW.md). The image is authoritative for hair/face/outfit/proportions: Milo brown tousled hair/red jacket/shorts; Nia dark curly hair/green jacket/blue trousers; Finn blond side-swept hair/blue jacket/tan trousers. **Never use uploaded C02/C03 as substitute identity sources.** They change faces/hair/clothing, and C03 introduces goggles.

New character images **must actually reference C01 as an image**, not simply this text. Character sprite/expression/turnaround output remains gated by same-identity review and production/rights QA.

### Player visual priority

Milo is distinguishable as controlled protagonist by consistent scene staging and a restrained **interactive selection treatment** (contextual focus/position), not a permanently flashing ring, dominant glow, cartoon crown, or an exclusive color. Nia and Finn may reposition naturally but should not obstruct the player's actionable targets.

## 3. Storybook and living-scene translation

**Same visual universe, two presentation uses:**

- Storybook shell: compositions/crops of the same scene assets, with editorial framing, legible captions, softer non-critical detail and intentional breathing space.
- Living Square: fixed-orientation **three-quarter view** with a stable playable ground plane, readable footpaths and landmarks, shallow layer motion only.
- Chronicle: illustrative memory panels based on the **same** characters, map fragment, marker and place references. Before/after presentation is truthful to saved canon, not a second invented environment.
- Parent panel: intentionally quieter UI; must not make child interactions invisible or cover them.

The **visual grammar** is locked; camera elevation angle, exact screen positions, engine, navigation method, parallax amplitude and render pipeline are **prototype values** to be validated in the next reference-composition stage.

For mobile, prefer controlled reframing, accessible focus-to-destination and camera-follow/limited scroll within the **same** Town Square over separately drawn portrait backgrounds with incompatible landmark positions. Do not force an entire 16:9 world to fit into a tiny phone viewport.

## 4. Layer and variation strategy

Recommended logical visual layers:

```text
world_background / distant_ambient
town_square_base / architecture
landmarks_fountain_tree
noticeboard_base + front_paper_state + old_layer_state
old_marker_base + plate_dirty_or_clear_state
actors_milo_nia_finn_steward
foreground_nonblocking_accents
interaction_targets_and_focus (vector/UI)
captions_and_parent_ui (app-rendered text)
```

- Persistent location master composition + controlled variants **beats** separately generated backgrounds for each scene.
- Stable asset IDs come from the E01 asset register, not image-file names generated ad hoc.
- For each persistent object: document base, before/after, scene use, layer/occlusion, mobile crop, trigger, historical replay appearance and approved reference.
- Any image containing critical clues must have layered/no-baked-label version.
- Small restrained water motion / paper flap / foliage motion are optional. Their static replacements must preserve the same information.
- A hidden old layer remains behind the current sheet; a cleared plate visibly remains cleared in the **present-world** Square after completion.

## 5. Map, clue and typography rules

- Old/new paper distinction through geometry, edges, holes, line style and layering; do not rely on brown-versus-white alone.
- Fountain icon and tree icon must be different by **shape**, not by color; each visually resembles an actual Square landmark.
- The blank-place symbol is a **single versioned, unlabelled mark** defined in [E01 Visual Reference Contract](../content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md). It cannot be rendered as a treasure X, magical rune, house icon, arrow, named Common glyph, or conventional street-sign logo.
- E01 symbol meaning is **not** settled or depicted; later Season payoff must use the same base mark unless canon deliberately documents a change.
- The marker has dirty/clear visual states. The **editable, accessible word RIVERSIDE and arrow appear together only after cleaning**. The dirty-state image must not visibly show or have alt text spoiling them.
- Narrative dialogue, parent cues, interaction labels, the page title and Chronicle copy remain app-rendered editable strings using approved IDs; do not bake essential text into generated pixels.
- Art must not imply a road/bridge has been restored in E01.

## 6. Accessibility and small-screen targets

Reference evaluations must be performed on **actual reduced-size compositions**, including realistic mobile portrait framing:

- recognizably different character silhouettes and age range in small view;
- fountain, tree, board and marker do not become indistinguishable;
- inspection A/B/C regions are separable by position/shape and have enlarged close-up alternatives;
- no color-only clue/selection, no text-only-in-image, no tiny essential writing, no 3D spatial rotation or precision drag as required input;
- clear main-action/parent-view/caption safe zones (parent may collapse on desktop, switch on phone);
- stable focus indicator and non-movement assisted navigation compatible with visual world;
- text legibility in both bright and dark scenic regions using UI text surfaces as needed;
- reduced-motion and audio-off paths present the same evidence.

Baseline review viewports: **phone portrait**, **phone landscape/tablet**, **desktop split-screen**. Precise sizes and performance budgets are engineering validation inputs, not empirically proven values here.

## 7. Approval gates

| Gate | Required evidence | Current status |
|---|---|---|
| **V0 visual grammar** | one selected direction, palette/shape/shading, storybook/living translation rules | **LOCKED in this mini-bible v1** |
| **V1 physical reference** | approved trio master reference sheet, Square layout shot/position reference and unknown-symbol vector reference; include phone-size crops | **OPEN — next focused task** |
| **V2 production asset candidate** | consistent character poses, Square base/overlays, map/plate/Chronicle assets; metadata and provenance | OPEN — gated by V1 |
| **V3 integrated experience** | actual touch/keyboard, size/readability, animation/reduced motion and runtime performance tests | OPEN — gated by build |

**A style rule is approved; an image is not approved before it exists.** A working asset registry entry must not be marked `reference_approved` or `approved_asset` until reviewed media is available.

### Reference-stage failure rules

Reject and iterate a reference when:

- characters are identifiable only by colors or change identity between views;
- storybook and living-scene images look like different franchises;
- the Town Square/old map geometry is contradictory;
- a rendered map symbol implies a decoded Common, treasure or game answer;
- an occluder hides Milo, board, fountain, tree or exit action;
- an image contains required text not editable in UI;
- pre-reveal image clearly exposes RIVERSIDE;
- important clues disappear at phone scale;
- the reference requires an unbounded open-world camera/large 3D asset pipeline for E01.

## 8. What stays open

No final character hair/face/clothes, adult appearance, architecture detail, calibrated palette, rendered map, exact glyph stroke treatment, final lighting/camera, output format/size, production engine, animation timings or image-generation tool is locked. Actual character and layout **reference images** must be made/reviewed before producing many assets.

**Next:** S01E01 **Visual Reference Sheets — small controlled candidate set** using the approved visual grammar and the E01 reference contract. Compare/approve reference media and then begin the first limited production asset set.
