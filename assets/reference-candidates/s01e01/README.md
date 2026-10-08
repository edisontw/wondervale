# S01E01 — Candidate Images (Draft Review Area)

This branch holds **unapproved** visual references, separate from game-ready asset paths. The original PNG upload succeeded and was verified on GitHub.

## Current first candidate

- [Full-resolution trio reference sheet](s01e01-trio-neutral-candidate-01.png), **1448 × 1086 PNG**, 2,438,208 bytes.
- [Compact review preview](.review/trio-neutral-preview-512.jpg), auto-generated **640 × 480 JPEG**.
- [Verified source metadata (JSON)](.review/trio-neutral-metadata.json).
- [Assessment and decision tracker](TRIO_CANDIDATE_01.md).

GitHub Actions preview validator: [run #37731077246](https://github.com/edisontw/wondervale/actions/runs/37731077246) **SUCCESS**. It verified image signature/decode, dimensions, committed blob hash and SHA256, and generated an accessible preview **without altering the original PNG**.

**Reviewer recommendation:** character sheet appears coherent and is worth retaining as a **candidate**. User appearance sign-off is outstanding; exact source prompt/generator/right-to-use is not yet documented. Do not call any art here `reference_approved`.

**Next decision:** owner accepts this Milo/Nia/Finn identity or requests specific changes. Upon approval, record in E01 reference contract and asset manifest, then move to the Town Square master reference in the prescribed sequence.

## Technical workflow

The included `.github/workflows/wondervale-reference-preview.yml` and `scripts/make_art_preview.py` constitute a tested **GitHub-hosted readback bridge** for files over the connector's ~1MB inline-content limit. Original image is uploaded once on GitHub, GitHub Actions generates a small committed preview plus dimensions/checksums, and the GitHub connector can fetch and render that preview for visual QA. Reuse carefully for further images; only reviewed references become approved.

This is **not** the old 48×30 upload smoke test. Do not use a technical thumbnail or combined reference sheet as game-ready sprite art.
