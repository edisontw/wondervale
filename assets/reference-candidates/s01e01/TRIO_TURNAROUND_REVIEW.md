# S01E01 — Uploaded Turnaround Candidates 02/03: File QA and Visual Decision

```yaml
review_status: complete
canonical_identity_source: ref-wv-trio-neutral-v1
canonical_image: s01e01-trio-neutral-candidate-01.png
canonical_git_blob_sha: aeb4fcf6cef5ca354bd3be495ea1226081f26604
candidate_02_disposition: composition_reference_only_identity_mismatch
candidate_03_disposition: rejected_as_identity_goggle_stereotype
scene_asset_production_approved: false
```

## Verified original files

| ID | File | Format / dimensions | Bytes | Git blob SHA (matches original file) | SHA-256 |
|---|---|---|---:|---|---|
| **02** | [No goggles](s01e01-trio-turnaround-candidate-02-no-goggles.png) | PNG / 1448×1086 | 2,546,889 | `6bb10737cc1273bfe13b7d647179025bd0475437` | `ac67cd68633d24bff15127758d84f32abce6c168e15bd01f163c002f0de786a3` |
| **03** | [Goggles](s01e01-trio-turnaround-candidate-03-goggles.png) | PNG / 1448×1086 | 3,016,629 | `98bf5cd42adfac1d9ce8f3febc65947530ac2696` | `98a5e646c81d53557149386237e30ee70695c2d1b2e73e47623cdd493df73e55` |

Review of full-size files and comparison composition: exact bytes tested as readable PNG; computed local Git blob SHA matches the committed GitHub tree blob for both files. This validates **transport and file identity**, **not** that the art is consistent with the previously accepted identity.

## Visual comparison against the owner-PASS Candidate 01

| Aspect | Approved Candidate 01 | Candidate 02 | Candidate 03 |
|---|---|---|---|
| Milo | dark tousled hair, red jacket, olive/khaki shorts | brown tousled hair but red scarf, blue vest and long tan work trousers | analogous wardrobe drift |
| Nia | voluminous dark **curly** hair, soft green jacket, **blue trousers** | straight/braided hair, folk-style green **dress**, dark boots | analogous wardrobe and hairstyle drift |
| Finn | **light blond** hair, blue jacket and tan pants | bright **orange curly** hair, blue vest, tan work trousers | orange curly hair, jumpsuit/overalls **and large goggles** |
| Overall | accepted canonical design sheet, soft illustrated texture | consistent layout & turn/expression views, **new identities** | polished turnaround layout but stronger inventor stereotype |

**Candidate 02:** accept only the **model-sheet layout concept** (neutral three-quarter, side and rear plus expression strip). **Do not** promote faces/outfits/hair to production references. Disposition: **REVISE / noncanonical appearance**.

**Candidate 03:** do not promote faces/outfits/hair to production references. Finn's goggles and technical jumpsuit reinforce the “inventor = mechanical accessories” stereotype explicitly discouraged by `docs/CORE_TRIO.md` and the visual mini-bible. Disposition: **REJECT as identity / keep for audit**.

No impact on story or core trio roles. Neither of the two files is an approved repeat image of the canonical identities. They remain in this candidate directory with status explanations and should not be used in image-to-image generation as identity inputs.

## Next image generation rule: reference-image-first

Use [prompt 27](../../../prompts/season-01/e01/27-trio-turnaround-identity-locked.md) with the **actual full-resolution Candidate 01 image** attached as the primary identity reference. Do not rely on verbal-only prompts or use Candidate 02/03 as visual input when creating the corrected turnarounds. Produce only **one revised turnaround sheet** for review; prioritize exact face, hair and clothing continuity over optional extra expressions. No batch scene artwork until correct reference turnarounds and Square layout pass.
