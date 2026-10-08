# S01E01 — Character Visual References

## Identity reference: APPROVED (scope limited)

**[Candidate 01 — Milo, Nia, Finn identity sheet](s01e01-trio-neutral-candidate-01.png)** · 1448×1086 PNG · Git blob `aeb4fcf6cef5ca354bd3be495ea1226081f26604`.

The project owner explicitly said **PASS** on 2026-10-08. These character **faces, hair silhouettes, outfits, colors and age proportions** are the visual identity v1. This sheet is a reference, **not** transparent game-ready sprites. Source provenance/rights and small-size sprite readability remain to be checked.

[Candidate 01 verification metadata](.review/trio-neutral-metadata.json) · [GitHub Actions verification PASS](https://github.com/edisontw/wondervale/actions/runs/37731077246) · [identity approval record](TRIO_CANDIDATE_01.md).

## Later manually uploaded turnaround attempts: not identity-approved

- [Candidate 02 — no goggles](s01e01-trio-turnaround-candidate-02-no-goggles.png): **REVISE**, useful turnaround/expressions **layout** only; hairstyles/outfits differ from the accepted trio.
- [Candidate 03 — goggles](s01e01-trio-turnaround-candidate-03-goggles.png): **REJECT as identity**, additionally gives Finn oversized goggles and overalls.
- [Verification and visual mismatch report](TRIO_TURNAROUND_REVIEW.md) (both full-resolution uploads verified; no corruption).

**Rule:** approved Candidate 01 identity **overrides** both 02/03. Do not use 02/03 as a character image reference in downstream generation.

## Next steps

1. Regenerate **one** C01-anchored turnaround sheet by passing Candidate 01 as an **actual reference image**; [prompt 27](../../../prompts/season-01/e01/27-trio-turnaround-identity-locked.md).
2. Review the candidate for **same faces/hair/clothes**, back/side angle logic and phone-size readability. Accept only if identities remain stable.
3. Then produce the shared Town Square reference using the **same** approved trio, approved E01 Square topology and `docs/VISUAL_STYLE_BIBLE.md`.
4. Keep production sprite extraction, rights/provenance, accessibility, scene art and app integration as separate future gates.

### Technical workflow

`.github/workflows/wondervale-reference-preview.yml` and `scripts/make_art_preview.py` verified the uploaded first original by decoding it on GitHub Actions and generating a small preview plus metadata; source PNG remained unchanged. Candidate 02/03 were verified against their source-file hashes; the current GitHub Actions script only targets candidate 01. Only candidate 01 is **identity-approved**.
