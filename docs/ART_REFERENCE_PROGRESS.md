# S01E01 Visual References — Approved Identity / Remaining Gates

```yaml
episode_id: s01e01
reference_id: ref-wv-trio-neutral-v1
status: approved_visual_identity_reference
approval: project_owner_PASS_2026-10-08
scope: milo_nia_finn_identity_only
production_sprites_approved: false
reference_sheet_file: assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png
reference_git_blob_sha: aeb4fcf6cef5ca354bd3be495ea1226081f26604
reference_format: PNG
reference_dimensions: [1448, 1086]
original_sha256: 46559b83c3a8f79e985d5e35c97f2b7653243ef515d5adc1bf2854991daa6448
turnaround_02_status: revise_layout_only
turnaround_03_status: rejected_as_identity
exact_source_generator: unconfirmed
image_rights_provenance: review_pending
```

## What is verified and locked

- [**Approved C01 reference PNG**](../assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png): 1448×1086, 2,438,208 bytes; user PASS on 2026-10-08. This is **the visual identity for all three**; future images must preserve the actual pictured faces, hair, clothing and child proportions.
- [GitHub Actions run #37731077246](https://github.com/edisontw/wondervale/actions/runs/37731077246) successfully decoded the original, verified Git blob SHA and produced a separate [review preview](../assets/reference-candidates/s01e01/.review/trio-neutral-preview-512.jpg). Original PNG unchanged.
- [**C02/C03 comparison**](../assets/reference-candidates/s01e01/TRIO_TURNAROUND_REVIEW.md): original PNGs both matched their own GitHub blobs byte-for-byte; however both **deviate visually** from C01. C02 useful only for turn/expressions layout; C03 rejected as identity due to orange hair / goggles / jumpsuit for Finn.
- [PR #12](https://github.com/edisontw/wondervale/pull/12) merged with accepted source and **historical noncanonical candidates distinctly marked**; the latter are never production identity references.

## Approved character appearance invariants

| Character | C01 source identity (descriptive aid, **not** replacement for reference image) |
|---|---|
| Milo | tousled brown hair; red jacket/outer layer; olive shorts; explorer backpack |
| Nia | dark voluminous curly hair; green jacket; blue trousers; restrained backpack; observational/sketching manner |
| Finn | light blond side-swept hair; blue outer layer; tan trousers; no stereotyped oversized goggles/overalls |

For generation, attach **actual** C01 reference pixels as primary image input. A verbal-only prompt cannot demonstrate preservation of source identity.

## Still open

1. Exact original generator/model/prompt/use-rights provenance for C01 (the earlier Canva 1536×1024 image metadata **does not prove** that it is identical to the 1448×1086 GitHub PNG). Do not invent a producer or usage license.
2. Corrected full-front/3⁄4/side/rear turnaround **from C01 image reference**; C02 and C03 fail this identity task.
3. Sprite segmentation/transparent exports, small-size grayscale recognition, movement/expression consistency, runtime performance and accessibility tests.
4. Town Square master reference and mystery glyph/plate/Chronicle visuals, no imagery approved yet.
5. No audio/runtime/EFL test results change.

## Next one task

Run [**Prompt 27 — C01-Anchored Trio Turnaround**](../prompts/season-01/e01/27-trio-turnaround-identity-locked.md). Pass C01 **as an image input** to produce only one corrected candidate and manually upload to `assets/reference-candidates/s01e01/` if necessary. Compare side by side with C01 before accepting. Then begin `ref-wv-town-square-v1`.
