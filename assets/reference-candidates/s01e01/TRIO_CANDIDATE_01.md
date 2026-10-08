# S01E01 — Trio Reference Candidate 01: **Approved Identity Anchor**

```yaml
candidate_id: s01e01-trio-neutral-candidate-01
target_reference_id: ref-wv-trio-neutral-v1
episode: s01e01
style_version: wondervale-illustrated-living-diorama@1
asset_status: uploaded_binary_verified
art_review_status: owner_approved_character_identity_2026-10-08
reference_approved: true
approval_scope: trio_faces_hair_clothing_colors_and_identity_only
production_asset_approved: false
animation_sprite_approved: false
source:
  type: user_uploaded_github_image
  actual_generator: unconfirmed
  previous_canva_media_id: MAHXYFZZA0A
  previous_canva_dimensions: [1536, 1024]
  provenance_match_to_canva: unverified_dimensions_differ
asset_file: assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png
asset_github_git_blob_sha: aeb4fcf6cef5ca354bd3be495ea1226081f26604
png_width: 1448
png_height: 1086
png_bytes: 2438208
png_sha256: 46559b83c3a8f79e985d5e35c97f2b7653243ef515d5adc1bf2854991daa6448
preview_file: assets/reference-candidates/s01e01/.review/trio-neutral-preview-512.jpg
preview_dimensions: [640, 480]
preview_bytes: 71490
preview_sha256: 33f402fba82992d43a1b7e4a67341870fa3c40f0a850bbf584db4d89100ae7d4
verification_workflow_run: 37731077246
verification_status: success
exact_generation_prompt_used: unknown
generator_model: unknown
seed: unknown
license_rights_review: pending
```

**Approval evidence:** The project owner said **“PASS”** after reviewing this sheet on 2026-10-08. This locks the **identity/look** of all three characters as shown here. It does **not** approve the combined contact sheet as game-ready transparent sprites. Do not re-open the identity decision because later generations drift.

## Approved appearance anchor

- **Milo:** tousled brown hair, red outer layer/jacket, olive/khaki shorts, child-scale explorer backpack; eager, action-first.
- **Nia:** voluminous dark curly hair, soft green outer layer, blue trousers, purple/quiet backpack, sketchbook as optional action prop; observant.
- **Finn:** light blond tousled/side-swept hair, blue outer layer, tan trousers, youthful playful expression; **no permanently required goggles, jumpsuit or oversized toolbox**.
- Maintain face, hairstyle, outfit shape/color relationships and comparable child proportions from **this exact PNG**, not merely these textual descriptors.

**Identity precedence:** Candidate 01 **overrides** Candidate 02/03 for character appearance. Any turnarounds, expressions or Town Square compositions must provide Candidate 01 as an **actual image reference**, with copied/reused character design. Text-only restyling is not sufficient evidence of identity consistency.

## Source and verification evidence

Original file: [s01e01-trio-neutral-candidate-01.png](s01e01-trio-neutral-candidate-01.png)

Automated compressed review image: [trio-neutral-preview-512.jpg](.review/trio-neutral-preview-512.jpg)

Machine-readable source verification: [trio-neutral-metadata.json](.review/trio-neutral-metadata.json)

GitHub Actions [run #37731077246](https://github.com/edisontw/wondervale/actions/runs/37731077246) — **SUCCESS**. The job opened the committed original file as a real PNG, verified PNG decode/structure, read 1448×1086 pixels, computed SHA256, and ran `git hash-object` that matched the branch's committed blob SHA. The 640×480 JPEG is a review derivative, not production media. The original has **not** been recompressed or replaced by automation.

**Important provenance gap:** an earlier Canva job returned a 1536×1024 MEDIA candidate, but this uploaded PNG is 1448×1086. It may be resized or another output. The job metadata alone cannot prove that the GitHub image is identical to Canva `MAHXYFZZA0A`. Record actual generator, source prompt and rights before final approval; do not assert Canva origin.

## Visual assessment from actual GitHub-generated 640×480 preview

| Criterion | Assessment | Specific observation / next action |
|---|---|---|
| Three named children in one consistent visual family | PASS for reference candidate | Left Milo, middle Nia, right Finn; all drawn with same painterly warm-outlined aesthetic |
| Elementary-school age proportions | PASS for candidate | They read as children; no oversized baby-chibi proportions |
| Full body & multi-angle model-sheet utility | PASS for candidate | Large neutral 3/4 standing poses, auxiliary smaller side/back views and expressions |
| Role depiction | PASS for candidate | Milo outward/ready; Nia holding a sketchbook with observant look; Finn approachable and playful, not overloaded with technical gadgets |
| Distinct silhouettes / colors | PASS provisionally | Milo tousled dark-brown hair/red outer layer, Nia curly dark hair/soft green-purple, Finn blond side-swept hair/blue outer layer; sheet includes three small silhouettes |
| E01 mystery/story spoiler | PASS | Neutral light background, no visible Common, route-marker or RIVERSIDE spoiler |
| Match to Illustrated Living Diorama | PASS for reference direction | Soft ink/painterly cutout appearance, no photoreal/plastic world, consistent rendering across three characters |
| Child-facing sprite readiness | **NOT YET** | This is a combined illustrated **reference sheet**, not separate transparent sprite layers. Name labels, swatches and multi-angle insets are fine **for reviewer documentation only**, not in game sprites |
| Actual grayscale / 80–120px interaction test | PENDING | Reduced-scale gameplay view and non-color distinction must be checked after individual sprite/crop extraction |
| Source, licensing, reproduction prompt | PENDING | Unknown exact generator of uploaded image; dimensions differ from previous Canva job metadata |
| Final user sign-off | **PASS** | Explicit project-owner approval for identity/look on 2026-10-08; sprite/provenance QA still open |

**Decision:** `reference_approved` **for trio identity only**, based on explicit PASS. Preserve this exact image unchanged as the Season 1 visual anchor. Candidate 02/03 were evaluated later and are **not replacement identities**; see `TRIO_TURNAROUND_REVIEW.md`. Source provenance, game-ready sprites and small-size testing remain open.

## Remaining production gates

The **identity** is locked. Still required before game use: provenance/rights note, compatible turnarounds actually derived from this image, transparent sprite extraction or rigging, grayscale/phone-size recognition test, and implementation assessment. The next art task is the **corrected C01-anchored turnaround sheet**, then the Town Square master. Do not revise Season story/learning/script/interaction canon.
