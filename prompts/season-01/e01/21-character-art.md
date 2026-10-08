# Character Art Prompt — reusable layered recipe

**STATUS:** visual grammar v1 is approved. **SMALL REFERENCE CANDIDATES ARE NOW ALLOWED** via `25-visual-reference-set.md`; generating many character poses/episode assets remains BLOCKED until actual shared trio model sheet is reviewed.

**Inputs:** master context; `docs/VISUAL_STYLE_BIBLE.md`; E01 `VISUAL_REFERENCE_CONTRACT.md`; approved character reference media **once available**; Core Trio canon; E01 EPB; script SC01–SC06; asset manifest.

**Prompt:**
> Produce one coherent character **reference family**, not four uncoordinated illustrations. Milo around 8: action-oriented curious playable hero. Nia around 8: observant/sketching/communicative. Finn around 9: inventive, playful, examines physical clues. Adult steward: helpful practical civilian, no omniscient authority or new biography. Distinct silhouettes at small size; consistent approximate size and recognizable identities across living scene and storybook portraits.
>
> Reference sheet first: full/three-quarter/profile views for the three children at common scale plus facial expression comparison. Then request only needed pose/expressions keyed to character IDs: Milo exploring/excited idea/close inspection/discovery; Nia observing/sketching/comparing/uncertain; Finn inspecting holes/challenging/confirming; steward working on board/handing cloth.
>
> Each generator prompt must be assembled from `APPROVED_VISUAL_STYLE + APPROVED_CHARACTER_REF + scene action/pose + composition/UI-safe-area + negative constraints`. Do not invent a permanent wardrobe lore, school-subject stereotypes, new sidekick, weapon, magic aura or unapproved dramatic style.
>
> Return prompts keyed by asset ID, reference sheet and pose QA criteria, transparent/background variants where needed, consistency checks, source/model metadata fields. Any resulting images remain **candidates** until reviewed.

**Output:** compact generation-ready **conditional** prompts, not files or claimed finished art.
