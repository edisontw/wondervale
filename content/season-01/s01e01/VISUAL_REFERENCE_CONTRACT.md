# S01E01 Visual Reference Contract — Town Square and Mystery Mark

```yaml
episode_id: s01e01
visual_reference_contract_version: 1
status: layout_and_symbol_design_locked_pending_rendered_reference_approval
style: wondervale-illustrated-living-diorama@1
character_identity_images: pending
town_square_master_image: pending
mystery_symbol_rendered_reference: pending
```

## Scope

This is the E01-specific **design/reference contract**, not a rendered location file or a completed asset pack.

Use with [Wondervale Visual Mini-Bible](../../../docs/VISUAL_STYLE_BIBLE.md), the approved E01 EPB, detailed script, interaction spec and prompt-pack [Asset Manifest](../../../prompts/season-01/e01/ASSET_MANIFEST.md).

## 1. Town Square topology — locked

The location is an inhabited, bounded Square with four recurring anchors:

1. `town_square_noticeboard`: ordinary board with a loose front paper; old layer **behind**.
2. `town_square_fountain`: distinct round central/near-central fountain.
3. `town_square_large_tree`: mature shade tree; distinct broad canopy and trunk.
4. `town_square_old_route_marker`: low public post/plate near the **Riverside-facing Square exit**, weathered before E01 reveal and visibly cleared afterwards.

**Topological relationship (not measured distance, no north arrow):**

```text
[noticeboard area] — [open civic Square / round fountain]
                               |
                         [large tree]
                               |
                  [old marker at outward path]
                               |
               [Riverside-facing Square exit]
```

The old map's route line proceeds **past the large tree** toward the exit-area marker. Fountain and tree are both recognizable from their old map symbols. No exact compass directions, street plan, distances, bridges, or unvisited districts are introduced here.

### Reference composition sketch (proposal, not engine geometry)

For a shared three-quarter landscape **reference shot**, aim for:

- noticeboard on a clearly accessible Square edge, approximately left side;
- round fountain toward the open middle, with play space around it;
- large tree along the visible onward path, toward far/right middle;
- low old marker near an outward-path edge beyond the tree;
- exit visibly leads off-screen, **not** a fully shown Riverside destination.

These are *layout reference targets* to check for compatibility, not permanent normalized world coordinates. Character navigation and camera can show different crops while preserving the topology. SC01 storybook, SC02/SC04 interactive Square, SC05 marker view and SC06 Chronicle all reuse **one** coherent layout.

### Required reference shots

- **Square master:** one unobstructed oblique overview with marked anchor overlays/reference labels in reviewer copy (not player UI).
- **Square mobile crop:** same anchors shown through reachable framing/focus, not relocated to fit a portrait illustration.
- **SC02 board:** closed/loose current sheet plus old layer behind, with physical depth and no tearing.
- **SC03 map close-up:** evidence regions faded line A, unnamed mark B, age/holes C, separated and clear.
- **SC04 map-vs-place:** fountain and tree symbols correspond unambiguously to real landmarks; no UI-only matching test.
- **SC05 marker:** before/after with destination held back until clear state.
- **SC06 Chronicle:** evidence and changed marker reference the same visual components.

## 2. Unknown symbol — visual design reference v1

**Identity:** `s01-missing-place-glyph-v1` (visual symbol ID only, not a new canonical event).

### Lock *shape language*, not meaning

Approved **geometric recipe for the first vector/reference candidate**:

- a slightly asymmetric, **open oval/rounded polygon outline**, approximately taller than it is wide;
- one deliberate short **gap** on its lower-left contour; its opening is clearly visible when scaled;
- a short detached off-center diagonal dash **inside**, not touching the outline;
- no fill, words, letters, cardinal arrow, “X”, map pin, roof/house icon, keyhole, crown, human figure, or dotted treasure trail;
- same silhouette/orientation in old map, Nia's sketch, Chronicle and future payoff references.

For reproducibility, the first vector candidate may start on a **100×100 normalized canvas** with this shape-language path pair:

```text
outline: M 25 34 Q 26 17 45 15 Q 68 11 78 34
         Q 83 59 65 75 Q 43 86 25 69
interior: M 47 43 L 57 49
stroke: single dark contour, rounded ends, no fill
```

The outline begins at (25,34) and ends at (25,69), **leaving an open lower-left gap** between the ends. The slightly off-center dash makes it distinct from ordinary round fountain or tree symbols.

The path is a **reference recipe**, not yet an approved rendered vector file. The actual rendered candidate must be checked for readability, accidental icon/letter resemblance and reproducibility. If a minor geometric revision is needed after the first reference test, update this contract **before** generating other media from it; never diverge in individual prompts.

### Semantic firewall

- Symbol **means unknown in E01**, even to the author of its render prompt.
- **Do not** embed its eventual answer in filenames, alt text, captions, labels, or image metadata visible during E01.
- No “The Common” wording, village logo, treasure symbol, magic rune, destination name or explanatory map key.
- The unlabelled symbol is a **different class** from the round fountain mark and the tree mark; don't visually confuse them.
- E10/E11 should reuse the source symbol reference/identity after narrative review rather than invent a new mark.

## 3. Evidence and state visual requirements

| State | Must be visible | Must remain hidden / unchanged |
|---|---|---|
| current noticeboard | modern, useful town notices | old map not shown on front |
| repair/open board | **old layer behind front**; no tearing | no magical glow, no full answer |
| map close-up | faded line, glyph, physical old holes/edges | symbol remains unlabelled |
| Square comparison | round fountain / distinctive tree both stable | map anchor validation requires Milo's movement |
| pre-clean plate | recognizably dirty plate on post | no readable RIVERSIDE/arrow early |
| post-clean plate | readable arrow + app-rendered RIVERSIDE on plate surface | blank mystery symbol still unknown |
| Chronicle | same sketch/map symbol and marker before/after | no scoring badge or inferred place name |

**Editable text strategy:** Generate plate surface and clean-state texture **without baked destination lettering**. The runtime places `RIVERSIDE` and the arrow only when `marker_revealed`, with a correct accessible text/caption description. In historical replay the dirty plate is a presentation state, not removal of saved canon.

## 4. Reference identity and asset workflow

Reference IDs required before bulk image generation:

- `ref-wv-trio-neutral-v1` — single frame common-scale front/side/three-quarter comparisons; include grayscale silhouette crop.
- `ref-wv-town-square-v1` — ground/topology review shot plus phone framing.
- `ref-wv-map-symbol-v1` — actual reviewed vector shape at multiple sizes.
- `ref-wv-board-plate-v1` — front/old paper and dirty/clean plate state comparisons.
- `ref-wv-chronicle-v1` — concept layout reusing source geometry (can follow first four).

These names are **reference requirements only**; no image file is claimed.

Minimum reviewer checks:

1. approve style coherence and character differentiation;
2. approve map-to-Square geometry and child accessibility at phone size;
3. approve unknown symbol is distinct, non-spoiling and remains consistent;
4. approve pre-clean plate hides destination and clean version can overlay text;
5. approve scene/Chronicle crop continuity;
6. record image paths, generator/model, references, prompt revision, creation date, licensing/usage notes and review disposition **after** generation.

## 5. Allowed next production step

Next produce a **small and controlled reference candidate set** (not all E01 assets) and review it. Reference generation may be done from this approved direction; **bulk/scene image generation remains blocked until the references are accepted**. Do not revise the story, characters' roles, mystery meaning, or interaction guards during reference production.
