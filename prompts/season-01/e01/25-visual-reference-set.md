# Task 25 — S01E01 Visual Reference Candidate Set (NEXT)

**Status:** approved for a **small, controlled reference-candidate generation and review**. This does not authorize producing all character poses/scenes or integrating artwork into the game.

## Inputs (read only these + bootstrap)

- `prompts/season-01/e01/01-master-context.md`.
- `docs/VISUAL_STYLE_BIBLE.md` v1 — selected Illustrated Living Diorama visual system.
- `docs/VISUAL_STYLE_DECISION.md` — evaluated alternatives, no need to redo the comparison.
- `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md` — Square topology and symbol recipe.
- `docs/CORE_TRIO.md` and E01 EPB visual/character sections.
- `prompts/season-01/e01/ASSET_MANIFEST.md`.

## Prompt

> Produce **candidate reference imagery** in the selected **Illustrated Living Diorama** style. Focus on cross-scene repeatability, not illustration quantity. Work in strict sequence. Do not proceed to the next dependency when the earlier reference is rejected.
>
> **Reference A — core trio:** one shared comparison sheet of Milo (~8; active player-controlled), Nia (~8; observant/sketching), Finn (~9; inventive/playful), same scale and coherent silhouettes. Prefer neutral three-quarter front views plus side/gray silhouette checks. Use one prompt/reference family. Avoid committing final costumes/lore based on an isolated attractive image.
>
> **Reference B — Town Square:** one overview from a fixed readable three-quarter angle, round fountain central/near-central, mature tree along onward route, noticeboard near an accessible Square edge, marker further along the path near an off-screen Riverside-facing exit. Do not depict E02's blocked route or full world. Use the approved trio reference for scale, but do not rely on character poses to make the location geometry correct. Provide reviewer annotation/anchor overlay separately.
>
> **Reference C — glyph:** render `s01-missing-place-glyph-v1` based on the versioned path/shape recipe in the E01 contract as a sharp vector/reference candidate. Show monochrome at original/phone-thumbnail sizes. Ensure it is unlabelled, different from round fountain/tree icons, not a treasure X or an icon that suggests its eventual meaning. Preserve geometry consistently in later media.
>
> **Reference D — layered state sample:** one composed sheet with noticeboard front/old paper layer; one low route plate dirty/clear pair. The pre-clean version contains **no readable RIVERSIDE**; in clean state destination text and arrow are **separate editable application overlays**, not baked text. Old paper stays intact.
>
> **Reference E — Chronicle reuse preview:** a lightweight composition using already approved trio/scene/glyph/marker references, not an unrelated new illustration. This can be reviewed after A–D and does not need to be a fully polished page.
>
> For each return a stable reference ID (`ref-wv-trio-neutral-v1`, `ref-wv-town-square-v1`, `ref-wv-map-symbol-v1`, `ref-wv-board-plate-v1`, `ref-wv-chronicle-v1`), candidate file path, generator/model, any source-image/reference ID, prompt revision/seed if available, generation date, and PASS/REVISE/REJECT notes. Check desktop and phone-size layouts and grayscale silhouettes before accepting.
>
> These reference outputs must reflect the approved drawing grammar (2.5D illustrated layers, warm natural contour, controlled texture, light direction) and **cannot** be copied into production as approved assets automatically. No exact scene dialogue in image pixels, magical map glow, villain, Common identification, premature RIVERSIDE sign or new fictional prop with a plot function.

## Approval order / stop conditions

1. **A:** Trio identity/silhouette readable and internally consistent. If rejected, do not make batch poses.
2. **B:** One Square topology understandable and traversable; phone portrait crop can navigate it without relocating anchors.
3. **C:** Symbol geometry legible and non-spoiling at reduced scale; persist as a shared vector identity.
4. **D:** State pairs unambiguous, text editable, no spoiler leak.
5. **E:** Chronicle genuinely reuses prior references.

When an item is approved, update `ASSET_MANIFEST.md` reference state and the E01 reference contract with the actual approved reference paths/versions. All actual files/bytes must be verified before linking; do not fabricate output links. Only **after** the reference gate passes should tasks 21–24 produce complete scene/pose/prop/animation assets.

## Deliverables

- A small set of **rendered reference candidate assets**, not full episode scene assets.
- A comparison/review table with reduced-size previews and clear next action.
- A single approved visual reference set, if quality gates pass; otherwise a targeted revision request.
- GitHub writeback of reference approval and provenance, not a claim based on generator success alone.
