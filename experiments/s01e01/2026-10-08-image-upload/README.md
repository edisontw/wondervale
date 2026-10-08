# Wondervale S01E01 — Image Generation / GitHub Upload Smoke Test

**Status:** partial success — experimental generation succeeded, actual PNG/SVG blob writes succeeded, **full-resolution generated image automatic ingestion not yet solved**.

This folder stores only **experimental, unapproved** technical artifacts. It does **not** approve visual identities, scene art, map symbols, or image quality. It is not an E01 production asset path.

## Inputs and source lock

- GitHub `main` at start: `511aef1befe40fbddef000937f9fad0322849bc4`.
- Style: `wondervale-illustrated-living-diorama@1` in `docs/VISUAL_STYLE_BIBLE.md`.
- Reference planning: E01 `VISUAL_REFERENCE_CONTRACT.md` and `prompts/season-01/e01/25-visual-reference-set.md`.
- This work is **production-path testing**, not approval of reference stage V1.

## Generation probes

| Attempt | Result | Caveat |
|---|---|---|
| fal (connected account) | **BLOCKED** — `balance_exhausted` at 2026-10-08 00:10 UTC; no paid run submitted | Do not retry or enable billing without user action |
| Canva text-to-image, 3-child reference sheet | **SUCCESS** — media ID `MAHXYFZZA0A`; [open candidate](https://www.canva.com/M/MAHXYFZZA0A) | Generation is **not** a quality/canon approval; Canva returns an asset ID / preview, not a local file or direct GitHub blob |
| ChatGPT image generation | **SUCCESS**, local PNG 1536×1024 (~2.9 MB) within the conversation runtime | This visual direction **has not passed E01 source/canon review**, so do not promote as a reference; full-resolution image file cannot currently be forwarded directly from the container to the GitHub connector |

## Binary GitHub tests

The GitHub connector offers `create_blob(content, encoding=base64)`; it **does not accept a container filepath**. Transcribing lengthy Base64 between isolated tools produced mismatched Git blob SHA on early trials (orphan blobs, **not referenced by a commit**). **Never mark success without SHA/size comparison.**

To test safe binary uploads without manually copying Base64, generate exact PNG binary in a single `functions.exec` JavaScript call, Base64-encode its bytes *inside that call*, and pass them directly to `mcp__GitHub__create_blob`. Use returned blob SHA to assemble a Git tree/commit. This method worked for:

1. `missing-place-glyph-upload-test.svg` — exact provisional SVG candidate from versioned E01 glyph geometry; source text (not approved rendered glyph).
2. `missing-place-glyph-upload-test.png` — 128×128, 1-bit grayscale technical raster rendered from the contract geometry in pure JS; PNG binary blob.
3. `generated-image-transfer-test-48x30.png` — **48×30**, 16-color indexed PNG derived from a downsampled/cropped generated image; only a **bitwise transport proof**, far too small for production reference art.

All three are tests/visual candidates, not canonical assets. Full-resolution original is **not** stored in GitHub by this probe.

## Verification and known connector limitation

- Blob uploads returned real Git blob SHA values; a committed Git tree can verify each expected filename, blob SHA and byte size.
- IMPORTANT: `GitHub.fetch_blob` / generic `GitHub.fetch` may reject non-UTF-8 binary (UnicodeDecodeError / UTF-8-only). **The tested reliable readback is `GitHub.fetch_file({encoding: "base64"})` on a committed path**: it returns the PNG Base64 content, size can be checked after decoding, and PNG signature, IHDR dimensions and CRCs can be validated. Also verify SHA/size from Git tree metadata. Both committed PNGs passed independent readback+CRC tests.
- For locally produced files, compute `git hash-object <file>` and compare with GitHub returned blob SHA. Do **not** paste long Base64 strings if a direct byte/file upload is unavailable; mismatched SHA invalidates verification.
- After a successful image import, separately review content, consistency, mobile readability, provenance, and source-of-truth constraints before marking `reference_approved`.

## Reliable routes going forward

**Route A (preferred automatic, only when same tool can access image bytes):** generate in a tool exposing an accessible file path/byte stream **inside the GitHub-write runtime**; Base64 directly and use GitHub Git Data API, verify blob SHA/tree and inspect real image. Code Mode's JS runtime currently has no access to the image tool's local container file path; passing the path as blob text will not upload the bytes.

**Route B (currently reliable manual full-quality image):** from this conversation download an actual generated PNG/JPG to device → GitHub `edisontw/wondervale` → create `art/s01e01-reference-candidates` branch → Add file → Upload files into `assets/reference-candidates/s01e01/` → commit → PR → verify preview and original dimensions. **Do not merge candidate as final art without V1 review.**

**Route C (small exact technical assets):** use GitHub connector `create_tree` for SVG source, and `create_blob(encoding=base64)` with PNG bytes constructed within `functions.exec`. This is robust for glyphs/icons/test patterns, not a direct transport path for large AI-generated raster files from a separate runtime.

## Next

1. Decide whether the Canva character-sheet candidate is visually acceptable enough to retain; do not approve without viewing.
2. For final-resolution generated art, use the manual GitHub upload fallback (or a later same-runtime file-write connector).
3. Produce small E01 reference candidate set in order, starting with the **trio neutral sheet** and validating consistent small-size silhouettes; only then Square/map/plate.
4. Record asset file paths, rights/provenance, and approval in E01 reference contract; keep experimental tests segregated.

## Concrete readback results (PASS; 2026-10-08)

| Path | GitHub blob SHA | Bytes | PNG dimensions | CRC check |
|---|---|---:|---|---|
| `missing-place-glyph-upload-test.png` | `83a85d16a0305dbc18537cc301cc1b9610969494` | 2,244 | 128×128 | PASS (IHDR, IDAT, IEND) |
| `generated-image-transfer-test-48x30.png` | `0cb466ac2753da52b50faf6cb8c30adf50823440` | 878 | 48×30 | PASS (IHDR, PLTE, IDAT, IEND) |

Both files were committed and verified by decoding the **base64-form** `fetch_file` response from GitHub and checking the PNG magic and every chunk CRC. No corruption found. Note that the latter is **only 48×30**; this proves transfer of image-derived pixels but is not usable visual reference quality.
