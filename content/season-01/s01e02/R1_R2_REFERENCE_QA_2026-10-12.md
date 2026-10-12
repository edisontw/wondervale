# E02-3 R1/R2 observation-image candidate QA — 2026-10-12

**Status:** TWO CONSISTENT INSPECTION VIEW CANDIDATES CREATED; SOURCE QA PASS / FINAL ART & OWNER PASS OPEN. E01 frozen; no E02 runtime implemented.

## Current sources

- Starting `main` verified: `316ac55697bed364f51807eb0837e7c34e66f54d`.
- Owner-PASS E02-0 topology, approved EPB rev 2, script dialogue v1, interaction spec revision 1 and [R0 v2 geometric reference](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v2.svg).
- **Production dependency:** in a portrait Child View, a legal-lookout arrival and a `Look across` inspection are different camera modes; zoom/pan never moves Milo across the water.

## New source-controlled authoring artifacts

| Stable state | Candidate | Exact viewBox in R0 v2 1600×900 source | Proposed role |
|---|---|---|---|
| R1 / old stones | [R1 old footings SVG](../../../assets/reference-candidates/s01e02/riverside-r1-old-footings-inspect-v1.svg) | `270 285 950 534.375` | Deliberate inspection from legal old-spur stand-off shows alignment of historical near/far bridge ends and no continuous deck. Does not explain cause |
| R2 / look across | [R2 protected lookout SVG](../../../assets/reference-candidates/s01e02/riverside-r2-look-across-inspect-v1.svg) | `475 310 1020 573.75` | From legal lookout, intentional camera pan/cut to water gap, absent deck and changed present edge, without moving Milo or unveiling the Market Lane sign |
| Source contracts | [R1/R2 manifest](../../../assets/reference-candidates/s01e02/riverside-r1-r2-visual-manifest-v1.json) | Both preserve master geometry | Explicit station guards, evidence IDs, safe camera semantics, C01 composition dependency, locked line references, authoring vs execution status |

The two SVGs **re-use the complete original geometry from the same R0 v2 Git blob** (only SVG viewBox, alt description and source comment differ). This is the practical safeguard against the previous image-generation failure where stone piers appeared side-by-side in mid-river, a complete bridge appeared in the distance, or the protected overlook seemed to move across the water.

## Executed QA

| Check | Outcome | Evidence / limitation |
|---|---|---|
| All R0 v2 vector geometry retained identically in R1/R2 | PASS | Programmatically compared each rendered-shape/definition body to R0 v2; same exact source art, only viewport & description changed |
| R1 and R2 both 16:9 | PASS | R1 `950 / 534.375 = 16:9`, R2 `1020 / 573.75 = 16:9` |
| No baked text, Market Lane answer, role actor or raster embed | PASS | Source assertions against both SVGs |
| Old crossing remains closed and safe lookout stays on same bank | PASS (source-only) | Derived from identical v2 R0 geometry and original walkable graph, not new engine mask |
| 320 and 390 px sample framing with separated RPG caption dock | STATIC MOCK COMPLETE | [Conversation review preview] screenshots produced from previous geometry-equivalent R0 v2 raster, not byte-identical browser rendering of GitHub SVG; speaker captions mock-only |
| Comparison against new painterly image-generation candidate | REJECTED as canonical geometry | Artistically stronger two-panel illustration shows separate closed entry + lookout but the historical piers stand partially in open water rather than clearly terminating at near/far *shoreline*. **Never silently use painting as R0 or R1/R2 production master** |
| C01 true character sprite overlay and speaker/label clearance | NOT RUN | Need previously approved identity assets and genuine runtime composition; no fabricated characters as QA substitutes |
| Exact Git SVG browser rendering and mobile responsive runtime | NOT RUN | Browser/E02 gameplay is a separate later engineering test; static PNGs are not evidence of implementation |
| Owner art review | PENDING | Candidates are not approved production media |

### Review raster files in the present conversation

These generated images are available as sandbox downloads **in the conversation, not imported to GitHub**:
- `e02_r1_geometry_reference_v1.png`: SHA-256 `675c7a9148ce3550c35ad61863ea7d966ea8a743dd17011f81ac283ddcc2b588`.
- `e02_r2_geometry_reference_v1.png`: SHA-256 `b0ff337c1542a43178493fcdf60f08ab32ae7b7059dc5983e5c5cd7a70134ce6`.
- `e02_r1_r2_qa_comparison.png`: SHA-256 `2cd6f6eb5a1d35a47e139b04da99ed5386ff2307f8488a1146280cb5264ba6a1`.
- `e02_r1_r2_phone_dock_proof.png`: SHA-256 `7893b8fb65c97241ec25c5d0cc96c18902e5982dd9738f3c8fc716b99ce397f3`.
- `wide_cinematic_split_panel_landscape_illustratio.png`: painterly style-only candidate; **not** approved or in GitHub.

The geometry crops were rasterized from the previously present **geometry-equivalent** v2 rendering, not retrieved from the exact GitHub SVG; they are visual review aids only. The source-controlled SVGs themselves are self-contained and auditable at current GitHub main after merge.

**Caption correction in phone QA mock:** Sample text was adjusted to existing script line content `UI-003 / NIA-003` and `UI-006 / MILO-008`, with no additional dialogue authored. UI staging is not evidence of real speaking/Listen behavior.

## Next independent acceptance gate

1. Inspect rendered **GitHub-authored** SVG R1/R2 with an actual browser at mobile and desktop sizes (not just mockups).
2. Refine high-quality painterly scene with **near stone footing at near bank and far landing on opposite shore**, aligned across the water; no independent midpoint piers, no new crossing, no bridge repairs.
3. Preserve C01 identity by separately compositing existing sprites; verify feet, labels and RPG dock across all major stops at 320/360/390/430 and desktop.
4. Keep R4 Market Lane destination mark **separate and invisible until accepted evidence revision plus deliberate inspection**. Do not pre-bake in R0–R2.
5. After owner visual PASS and original-media hash integrity, add a production asset manifest. Then and only then proceed to E02 assembly; all 30 runtime E02 test cases remain NOT RUN.

**No E01 files, save schema, actors, engine, E02 runtime or deployed sites have been changed in this production slice.**
