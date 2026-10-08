# Wondervale Image Generation → GitHub Upload Runbook v1

**Purpose:** prevent repeat failures when moving actual generated image files into `edisontw/wondervale`.

## 0. Respect source-of-truth and asset approval

Before art production, fetch current `main`, read `README.md`, `docs/PROJECT_INDEX.md`, `docs/WORK_SEQUENCE.md`, `docs/OPEN_DECISIONS.md`, then the relevant visual/style/episode sources. Create only **reference candidates** while the E01 reference gate is open; do not merge visually unreviewed AI images into canonical runtime asset folders.

Approved visual grammar: `docs/VISUAL_STYLE_BIBLE.md`. E01 glyph/topology: `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md`. Generator prompts: `prompts/season-01/e01/25-visual-reference-set.md`.

## 1. Generate and preserve source image

- Produce **one** candidate at a time in a supported image generator. Record generator/service, model when provided, date, exact prompt, reference IDs and generation metadata/rights.
- Ensure the tool actually returns either (a) a usable local file/download, or (b) a media asset URL that supports an actual download. A Canva media ID or image-preview link alone does **not** give the GitHub connector access to raw bytes.
- Check the image against canon **before** approval; generated does not mean accepted.
- Initial reference targets: trio neutral sheet → Town Square master → mystery glyph vector → board/plate state variants → Chronicle reuse.

## 2. Automatic GitHub upload when bytes are available in the same runtime

GitHub connector supports a *real binary blob*:

```js
const encoded = bytesToBase64(binaryBytes); // bytes actually read in this SAME runtime
const blob = await tools.mcp__GitHub__create_blob({
  repository_full_name: "edisontw/wondervale",
  content: encoded,
  encoding: "base64"
});
// verify blob.result.sha, add it to a Git tree on a dedicated branch,
// commit via create_commit and update_ref (check expected SHA)
```

Do not supply a `/mnt/data/file.png` path or a source-file ID as `content`: those are **not** image bytes. Do not copy huge Base64 by hand: bytes can be omitted/transcribed incorrectly. **Never declare success without readback.** Git Data API `create_blob` supports both `encoding: base64` (actual binary) and `encoding: utf-8` (text/SVG).

Recommended binary verification for committed files:

```js
const result = await tools.mcp__GitHub__fetch_file({
  repository_full_name: "edisontw/wondervale",
  path: "assets/reference-candidates/s01e01/candidate.png",
  ref: "<branch-or-commit>",
  encoding: "base64"
});
// Decode base64 bytes locally; verify PNG signature, dimensions,
// IHDR/IDAT/IEND CRCs, and compare Git blob SHA/size against Git tree metadata.
```

**Warning:** `mcp__GitHub__fetch_blob` and generic GitHub `fetch` may reject binary due to UTF-8 decoding. Use the tested `fetch_file(encoding: "base64")` method instead.

## 3. If the generated file is only accessible to another runtime

**Current connector limitation:** ChatGPT generated files may reside at `/mnt/data` in the image/container runtime while the GitHub Code Mode runtime cannot access that filesystem. The connected Canva generator returned a **MEDIA ID**, not directly portable binary bytes; fal was blocked by account credits. In those cases do not pretend a media URL or filepath was uploaded.

Use this reliable manual full-quality fallback:

1. Download the original image from the ChatGPT generation output or Canva asset view.
2. In GitHub open `edisontw/wondervale`, make a new candidate branch from the latest `main` (e.g. `art/s01e01-reference-candidates`).
3. Navigate to `assets/reference-candidates/s01e01/` and use **Add file → Upload files**, commit to that branch, then open a PR.
4. Check the GitHub image preview and actual dimensions/bytes; compare a local SHA256 or Git blob hash when available.
5. Attach prompt/provenance/visual QA notes to the candidate. Only after human/art QA approve it update the visual reference contract and asset manifest.

Do **not** use GitHub Issues attachments, transient third-party signed image URLs, or raw Base64 markdown strings as an authoritative replacement for a committed file.

## 4. Troubleshooting outcomes seen in E01 smoke test

| Symptom | Cause | Reliable next action |
|---|---|---|
| AI generator blocked before run | fal credit exhausted | Use another available generation tool or seek explicit billing action; don't silently charge |
| Generator says SUCCESS but only returns media ID | bytes still owned by generator | Open/save/download actual image; do not assume GitHub can dereference the ID |
| `create_blob` SHA mismatches local `git hash-object` | binary corruption during Base64 copy | Stop; use same-runtime bytes-to-base64; do not commit corrupted blob |
| GitHub generic fetch fails Unicode decode for PNG | text decoder is not a binary reader | `fetch_file(encoding=base64)` on a committed path |
| GitHub stored test PNG but art still looks wrong | transport success ≠ visual quality/canon | Keep in experiments, mark rejected/revise, preserve upstream visual gate |
| Candidate link expires | CDN signed URL, not durable GitHub asset | download and commit actual bytes, record provenance |

### Last verified smoke test

2026-10-08: two real PNG binary blobs committed on a test branch and re-read in Base64; PNG signatures, dimensions and chunk CRCs all **PASS**. One was a 48×30 image-derived transport proof, **not full-quality art**. Full-resolution automated transfer still unresolved; manual upload path is verified as the operational fallback, not tested by assistant.
