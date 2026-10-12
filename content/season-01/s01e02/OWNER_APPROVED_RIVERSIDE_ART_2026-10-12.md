# S01E02 Riverside — Owner-PASS visual image intake (2026-10-12)

**Decision:** The owner replied **PASS** to the three newly generated **separate** full-resolution Riverside PNGs in the preceding conversation. Stop repeatedly regenerating the approved visual direction; adopt them as the **R0/R1/R2 scene illustration candidates for E02 MVP**. This is a visual/art acceptance, not a statement that the E02 browser implementation or all evidence geometry is already validated.

Starting GitHub `main`: `b85c4c2e6c472a05dbc4824cf8426ed04448b998`. Current acceptance assets are held as **original conversation PNGs** and are supplied in a [user-downloadable ZIP]. They are **not yet in this GitHub repository**. Their exact expected SHA-256/Git blob hashes, full dimensions, WebP derivatives and pending upload paths are recorded in [PRODUCTION_INTAKE_PENDING.json](../../assets/production-candidates/s01e02/PRODUCTION_INTAKE_PENDING.json). GitHub PR merges containing only this intake manifest do not mean binary upload succeeded.

## Approved three distinct images

| Role | Original PNG from image generation | Repository path after upload | Use |
|---|---|---|---|
| R0 | `河畔小鎮與斷橋花園.png` | `assets/production-candidates/s01e02/riverside-r0-original.png` | Child's Riverside exploration / promenade and lookout framing |
| R1 | `湖畔古村的斷橋午後.png` | `assets/production-candidates/s01e02/riverside-r1-original.png` | Inspect the old bridge path and historical stone landing |
| R2 | `陽光下的斷橋山村景致.png` | `assets/production-candidates/s01e02/riverside-r2-original.png` | From protected public lookout, inspect the open gap and current changed bank edge |

All three PNG originals: **1672×941, RGB**, with separate **WebP quality-83 runtime derivatives** named `public/art/s01e02-riverside-r0.webp`, `s01e02-riverside-r1.webp`, `s01e02-riverside-r2.webp`. The images have no extra NPC/pet, no continuous live bridge, and no pre-baked Market Lane text. The PDF/illustration authoring v3 SVGs and earlier image-generation experiment sheets are not the approved chosen PNGs.

## Respect upstream E02 and E01

- **Owner approval does not change bridge facts:** the historical near and far shore footings are aligned and the deck no longer exists, the old spur remains **fenced and closed**, and the already-public path to the **same-bank protected overlook** exists. The original [R0 v2 geometry and path graph](../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v2.svg) and [walkable JSON](../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.json) retain *movement* authority. The approved three paintings are **separate views**, not images guaranteed to be crops of one pixel-identical master, and must not override movement masks.
- **Artistically acceptable is not identical physical alignment:** R0 predominantly depicts the distant stone pier; R1/R2 can make old landings seem offset/isolated. At E02 scene assembly, present two clear factual evidence observations (old-aligned bases and present-day missing deck) using safe closeups, true readable text and, if necessary, a small **registered old-stones evidence overlay derived from the accepted SVG topology**. Do not claim visual evidence the child cannot actually see.
- The player's Milo/Nia/Finn sprite/portrait identities must reuse original C01/E01 approved artwork, added as independent actor layers. Do not insert new generated actor identities into the environment images.
- The only readable Market Lane location mark is a **separate state layer R4** and remains hidden in R0/R1/R2 until the child deliberately inspects it *after* the evidence-based revision.
- Save/event triggers follow the approved [E02 interaction spec](INTERACTION_SPEC.md), not image filenames. No crossing, automatic correct answer, or notebook clone of E01 scratching.
- **E01 remains unchanged** including all accepted assets, 121 story lines, movement and the deployed build.

## Byte-exact media ingestion: one remaining manual transfer

1. Extract the user-delivered `wondervale_e02_approved_art_originals_and_webp_2026-10-12.zip` (about 11 MB). There are six binary files under two repository-relative directories, plus a preview, integrity JSON and verifier.
2. On a **new GitHub media branch**, upload the three source originals to `assets/production-candidates/s01e02/` and the three WebPs to `public/art/`. **Do not upload or commit only the ZIP**: the release pipeline needs the six actual files. No renaming, recompression or cropped “resave.”
3. After upload, execute `python3 scripts/verify_e02_art_intake.py` from a checkout of that branch. It fails on missing images, byte/size/hash mismatches, bad PNG CRC or bad RIFF/WebP signatures.
4. Confirm GitHub blob hashes and original size via fresh GitHub readback on the uploaded branch; only then update manifest status to `media_uploaded_verified`, run the relevant CI at the PR HEAD and merge the media PR.
5. Implement the E02 runtime scene and C01 character placement in a **separate engineering PR**, run the full E01 baseline plus the E02 acceptance matrix on the latest HEAD, verify actual mobile/desktop renders and owner playable PASS.

The dedicated preview/contact sheet and original-transfer ZIP are stored in the **conversation download surface**, not available from GitHub until actually uploaded; the hash manifest is the cross-runtime bridge.

## Status and next focused task

**Locked:** R0/R1/R2 approved visual selection and output file names; use of existing E02 canonical topology and C01 actor identity; no regeneration for stylistic nitpicking.

**Pending:** actual GitHub binary transfer/integrity readback; registration into the runtime asset manifest; C01 sprites and mobile scene QA; R1 old-stones evidence legibility, R4 gated clue; 30 E02 browser/device/family acceptance cases and MN4 deployment.

**Next task:** upload and verify the exact six binary files, then assemble an E02 browser integration slice without touching E01. Do not describe approval of art as completion of the E02 runtime.
