# S01E01 — Trio Reference Candidate 01: Upload and Visual Review

```yaml
candidate_id: s01e01-trio-neutral-candidate-01
target_reference_id: ref-wv-trio-neutral-v1
episode: s01e01
style_version: wondervale-illustrated-living-diorama@1
asset_status: uploaded_binary_verified
art_review_status: recommended_candidate_pending_user_confirmation
reference_approved: false
production_asset_approved: false
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
prompt_source: prompts/season-01/e01/26-trio-reference-manual.md
exact_generation_prompt_used: unknown
generator_model: unknown
seed: unknown
license_rights_review: pending
```

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
| Final user sign-off | PENDING | Ask project owner to approve/revise this particular character family before locking identity |

**Recommendation:** `ACCEPT_AS_PROMISING_CANDIDATE`, not `reference_approved` yet. Preserve this file unchanged. The next decision is whether to **lock these faces / costumes / hair silhouettes** as Milo/Nia/Finn identity v1, revise individual characters, or generate a different neutral trio sheet. Do not commission Town Square or character pose batches before the trio reference decision is recorded.

## Action on approval

Once the owner explicitly accepts this trio appearance, mark `reference_approved: true`, record the reference identity in `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md`, update `prompts/season-01/e01/ASSET_MANIFEST.md`, and merge this draft PR after checking workflow/scripts and candidate file provenance. Then prepare **Square master reference** `ref-wv-town-square-v1` anchored on this trio's approved identity. Do not silently change story/learning/script/interaction canon.

If not accepted, leave the binary as a historical candidate and write the specific visual change request before generating version 02.
