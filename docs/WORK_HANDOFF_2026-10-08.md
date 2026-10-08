# Wondervale — Work Mode Handoff (2026-10-08)

```yaml
handoff_date: 2026-10-08
handoff_status: paused_in_chat_moving_to_work
repository: edisontw/wondervale
last_verified_main_at_handoff: efba7c67b7d3b195bed8e9f047bb1b263d5579f6
source_of_truth: current_github_main_not_handoff_sha
episode: s01e01
core_trio_identity: approved_C01
game_runtime_complete: false
actual_runtime_cases_passed: 0
```

## 0. Immediate Work bootstrap

Verify **current GitHub main** before any substantial work (never assume the SHA above remains current). Read `README.md`, `docs/WORK_SEQUENCE.md`, `docs/PROJECT_INDEX.md`, `docs/OPEN_DECISIONS.md`, and only the specific art/content/engineering source documents needed. Work autonomously within one bounded layer at a time and write durable accepted results back to main via reviewed branches/PRs.

**Task:** unblock the image generation → reference consistency QA → original byte access → candidate branch upload → GitHub binary integrity → human visual approval → usable scene assets chain. Do not restart story/learning planning or regenerate canonical dialogue.

## 1. Locked product/story/content

- Ages 6–9, **EFL-first**, parent-guided/child-driven, *simple English must not mean simple thinking*.
- Player-controlled Milo; Nia observes/sketches; Finn challenges/invents; 2.5D **Illustrated Living Diorama** design, persistent changed world and Chronicle.
- Season 1 11-episode story/language weave approved; E01: find old map **behind** current Town Square noticeboard, investigate evidence, compare round fountain/tree, discover and clean low route plate before `RIVERSIDE →` appears. Unnamed symbol/Common remain unexplained in E01.
- `content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md` revision 1, `DETAILED_SCRIPT.md` v1, `INTERACTION_SPEC.md` v1 approved; **121** exact voice-text lines in `prompts/season-01/e01/40-voice-lines.tsv`. E01 test matrix has **51 planned but NOT RUN** cases.

## 2. Art asset provenance and precise approval boundaries

| Target | Status | Current authority / gap |
|---|---|---|
| **Milo/Nia/Finn identity** | **PASS**, locked for faces/hair/costumes/proportions only | `assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png`; blob `aeb4fcf6cef5ca354bd3be495ea1226081f26604`. Must use **actual image** as generation reference, not just a verbal description. |
| Candidate 02 & 03 older turnarounds | **not approved as identities** | 02 layout-only; 03 rejected due goggles & changed wardrobe/hair. `TRIO_TURNAROUND_REVIEW.md`. |
| **`wondervale-trio-turnaround-front-side-back.png`** | **user explicitly said PASS in chat**, BUT exact filename **not found on main** at handoff | Locate in other GitHub branches/PR or conversation attachments. Validate actual image/file/blob before writing formal approval. Do not claim it is in main or silently substitute 02/03. |
| **Town Square empty master** | User discussed as visually promising/candidate; **not approved/committed** | ChatGPT-generated `寧靜花香村莊廣場.png` (1672×941). Canon topology: left board, central round fountain, mature tree near outward path, low old post at exit; no pre-reveal signs/bridge. |
| **Board state sheet** | **REVISE** | ChatGPT `鄉村公告板與隱藏地圖_prop_sheet.png` (1448×1086). Keep board structure but replace invented compass/stars/mountain/route with approved old-paper physical evidence and actual mystery glyph. |
| **Route plate state sheet** | **REVISE** | ChatGPT `鄉村路標三聯資產表.png` (1448×1086). Dirty/clean texture direction useful, but RIVERSIDE + arrow currently **baked into image**. Real game must place editable text/arrow overlay **only after cleaning**. |
| **Mystery symbol** | Shape/geometry defined; no approved reusable production vector | `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md`, `s01-missing-place-glyph-v1`. Test SVG in `experiments/` is not approved media. |
| Scene backgrounds/sprites/Chronicle | **OPEN** | No production-ready composited/layered media and no media-to-runtime validation. |
| Music, SFX, actual voices, E01 runtime | **OPEN** | Prompt direction and exact dialogue text exist, actual files/feature tests do not. |

**Important: no new official reference files from the three recent images were verified on GitHub main.** These three full-resolution PNGs were consolidated in this chat as `wondervale_work_handoff_assets_2026-10-08.zip` with a README, SHA256 manifest, and explicit PROMISING/REVISE states. **The ZIP exists as a chat download, NOT in GitHub; attach/import it into Work** for use. Do not invent a GitHub URL to it.

Earlier generated scene illustrations with child design drift or prematurely visible Riverside/Old Bridge were rejected. User prefers **ChatGPT image generation over Canva** based on previous quality; do not waste time forcing repeated Canva attempts.

## 3. The operational problem and verified solution

The conversation could generate high-resolution AI PNGs but not reliably bridge image tool's filesystem into the GitHub connector's isolated runtime, causing repeated stops. Successful manual user upload and [PR #12](https://github.com/edisontw/wondervale/pull/12) demonstrated full-resolution original PNG in GitHub; `.github/workflows/wondervale-reference-preview.yml` + `scripts/make_art_preview.py` verified original source bytes and produced a small review preview. See `docs/IMAGE_ASSET_UPLOAD_WORKFLOW.md`.

**Work should attempt end-to-end transfer using its own cloud browser/computer only if it can actually access/download the original file.** Verify file SHA/dimensions after committing. If direct transport fails, **batch files into one clearly labeled candidate ZIP and request a single manual upload**, rather than spending multiple cycles generating ineffective link/bytes workarounds.

The distinction must remain explicit:

`generated_candidate` → `original_bytes_accessible` → `github_uploaded_and_binary_verified` → `visually_approved_reference` → `production_asset_integrated`.

## 4. Recommended next focused Work session

1. **Resolve reality first:** fetch current main, search branches/PRs for user-PASS `wondervale-trio-turnaround-front-side-back.png`; verify exact content/provenance and compare against C01. Locate/import the conversation ZIP; do not reopen approved visual identity.
2. **Establish reproducible asset intake** in GitHub/Work with original dimensions, SHA, generator, prompt/references, quality and approval state. Test with the Town Square candidate. Avoid remaking good art just because previous upload failed.
3. **Reference B**: evaluate and lock one true Town Square empty master (same board/fountain/tree/low marker topology) with phone legibility and 2.5D extraction/layering plan.
4. **Reference C/D**: produce the versioned unnamed glyph SVG deterministically from fixed path (no invented meaning), and revise board/plate to layered unspoiling states. Use small candidate batches and a **single meaningful approval gate** for visual decisions; don't interrupt the user for every minor tool step.
5. **After reference gate**: proceed with E01 small vertical slice as approved by `docs/WORK_SEQUENCE.md`; actual sprites, dialogue/captions and voice, optional parent cues, state/ledger, Chronicle, desktop/mobile and **51 real acceptance tests**. Provisional placeholders may be used in technical prototyping only if clearly labeled and reversible.

## 5. Work execution contract

- GitHub main outranks old chat memory; do not silently change Season/EFL/canon or guess unknown glyph meaning.
- No text baked into essential UI/plate. RIVERSIDE is revealed **only after** cleaning in the actual interaction.
- Avoid re-rendering Milo/Nia/Finn in every background: source approved C01 reference and combine via consistent assets/layers.
- Separate narrative, learning, visual, audio, engineering and QA. One layer must not quietly redefine an earlier locked one.
- **Commit accepted decisions, review outcomes, generation prompts/metadata, files, implementation contracts and real tests** to GitHub main through PRs. Trial/reject imagery may remain candidates but must not be called production art.
- Before each stage concludes, report verified main SHA, exact outputs, what passed, what remains open and the **next single focused work task**. Present only essential milestone approvals to the user.

## Key links

- [Main repository](https://github.com/edisontw/wondervale)
- [Work Sequence](WORK_SEQUENCE.md)
- [Visual Style Bible](VISUAL_STYLE_BIBLE.md)
- [E01 Visual Reference Contract](../content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md)
- [Approved Core Trio C01](../assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png)
- [Image/GitHub runbook](IMAGE_ASSET_UPLOAD_WORKFLOW.md)
- [Town Square trial record](TOWN_SQUARE_REFERENCE_PROGRESS.md)
- [E01 Prompt Pack](../prompts/season-01/e01/00-README.md)
- [GitHub input/reference art PR #12](https://github.com/edisontw/wondervale/pull/12)

**Do not start with another unrelated generated picture. Start by verifying/importing the known accepted/pending artwork and making the file pipeline reliable.**
