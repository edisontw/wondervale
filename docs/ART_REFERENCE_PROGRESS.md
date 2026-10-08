# S01E01 Visual Reference Progress — Reference A

```yaml
reference_id: ref-wv-trio-neutral-v1
status: candidate_uploaded_binary_validated_pending_owner_approval
art_direction: wondervale-illustrated-living-diorama@1
review_date_utc: 2026-10-08
current_pr: 12
pr_state: draft
reference_approved: false
```

## Confirmed technical completion

- [Draft PR #12](https://github.com/edisontw/wondervale/pull/12), branch `art/s01e01-reference-candidates`.
- Original: [s01e01-trio-neutral-candidate-01.png](https://github.com/edisontw/wondervale/blob/art/s01e01-reference-candidates/assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png).
- Review derivative: [640×480 preview](https://github.com/edisontw/wondervale/blob/art/s01e01-reference-candidates/assets/reference-candidates/s01e01/.review/trio-neutral-preview-512.jpg).
- Technical report: [GitHub-verified JSON](https://github.com/edisontw/wondervale/blob/art/s01e01-reference-candidates/assets/reference-candidates/s01e01/.review/trio-neutral-metadata.json).
- Workflow: [GitHub Actions run 37731077246](https://github.com/edisontw/wondervale/actions/runs/37731077246), **success**.
- Source PNG: **1448 × 1086**, **2,438,208 bytes**; SHA256 `46559b83c3a8f79e985d5e35c97f2b7653243ef515d5adc1bf2854991daa6448`.
- Source Git blob: `aeb4fcf6cef5ca354bd3be495ea1226081f26604`; verified against GitHub Actions' `git hash-object` read of the original.
- Original not changed by workflow; 640×480 preview generated separately.

## Visual review — not final approval

The rendered GitHub-hosted preview displays a coherent same-style concept sheet with full standing Milo, Nia and Finn; smaller side/back views, close-up facial expressions, palette swatches and grayscale silhouettes. Ages and role expressions are appropriate as first candidate; the picture does not introduce E01 mystery spoilers. The aesthetic aligns with the approved Illustrated Living Diorama direction.

**Recommendation:** keep Candidate 01 for owner review rather than generate a new trio immediately. It is a **reference sheet**, **not separate production sprites**. Reviewer labels/swatches need not and must not be embedded into in-game character sprites. Dedicated mobile-size sprite readability is still untested.

## Blocking decisions

1. **Owner approval:** keep or revise this specific visual identity for Milo, Nia and Finn. Until owner acceptance, do not declare `reference_approved`.
2. **Provenance:** exact generator/model, prompt and asset use rights not yet grounded. Previously saved Canva metadata says 1536×1024 whereas the GitHub original is 1448×1086, so identity with that Canva job cannot be assumed.
3. **Next reference** if accepted: prepare `ref-wv-town-square-v1` using the identical trio identity and the approved E01 town topology. Do not batch scenes ahead of Square/glyph/marker reference review.

## Production workflow learned

GitHub's Contents API can return empty inline `content` for a committed file over 1 MB; **this is not evidence of a missing upload**. A small branch-local GitHub Actions process read the original in place, verified it, recorded SHA256 + dimensions, and committed a smaller preview. The GitHub connector then successfully read/rendered the preview. This **closes this upload/visual-preview problem for PR #12** and avoids another manual chat attachment.

Durable trial scripts currently live in PR #12:

- `.github/workflows/wondervale-reference-preview.yml`
- `scripts/make_art_preview.py`

Treat the infrastructure as **candidate branch implementation**, not a project-global approved workflow until reviewed and merged. The reference itself remains pending visual approval.
