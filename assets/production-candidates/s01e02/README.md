# S01E02 approved Riverside raster references — MEDIA UPLOADED

The owner has **PASSed** three colorful Riverside scene images (R0 main, R1 old stones, R2 lookout) on 2026-10-12. This directory intentionally contains **only a pending manifest**, not the actual PNG data: the original PNG bytes have been preserved in the user-visible download ZIP in the conversation.

**Do not mistake the approval record for GitHub production assets.** To complete the import:

1. Download and extract `wondervale_e02_approved_art_originals_and_webp_2026-10-12.zip` from the same conversation.
2. Open a fresh media branch in `edisontw/wondervale`. Drag the three source PNGs from `assets/production-candidates/s01e02/` in the extracted ZIP into **this repository directory**.
3. Drag the three WebPs from `public/art/` in the extracted ZIP to **`public/art/`** in the repository. Do not upload the ZIP alone.
4. On a checkout of the media branch, run `python3 scripts/verify_e02_art_intake.py`. Expected: **six exact-byte PASSes** (Git blob, SHA-256, sizes, original PNG CRCs).
5. Submit the media PR; before merging, independently check GitHub blobs and true rendered image dimensions. Then start the separate E02 scene/character runtime PR. Leave the E01 playable state unchanged.

Files named and hashed in [PRODUCTION_INTAKE_PENDING.json](PRODUCTION_INTAKE_PENDING.json).

Only if actual verification succeeds should manifest status be changed to “uploaded verified.” The R0 v2 SVG movement/collision graph and script remain the gameplay source of truth; R0/R1/R2 are separately framed artistic images, not guaranteed coordinate-identical photographs.

## Upload verified on current GitHub main (2026-10-12)

All three PNG originals and three WebPs have been uploaded and **GitHub blob IDs plus byte sizes match** the intake manifest as of `038f9f48a53feaf4ee7a72d2fd0bd490f0de0a2f`. The upload steps above remain **historical recovery instructions only**. Do not upload a second copy. The reusable `python3 scripts/verify_episode_media.py` and lightweight GitHub art CI perform further byte/format/dimension verification. Continue with E02 playable integration after validation.
