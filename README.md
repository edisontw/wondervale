# Wondervale

**Parent-guided EFL learning adventures for ages 6–9.**

Wondervale is an EFL-first interactive story world designed for children ages 6–9 and the adults learning alongside them.

Children directly control **Milo**, a recurring protagonist, alongside **Nia** and **Finn**. The trio explores an evolving world, solves story problems, experiments, reads, calculates, observes, and makes choices. Parents act as conversation partners through short, well-timed prompts rather than as teachers or answer-givers.

## Core principles

- **Story first.** Learning exists inside meaningful situations.
- **Parent-guided, child-driven.** Adults prompt prediction, explanation, observation, and connection without taking over.
- **The world remembers.** Characters can learn, relationships can change, and places can be built, repaired, opened, or transformed across episodes.
- **Learning accumulates.** Skills are revisited and transferred into new contexts rather than taught once and forgotten.
- **Reusable engine, non-repetitive experience.** Technical activity components may be reused; stories and surface interactions should not feel templated.
- **EFL-first, multilingual-ready.** English is the initial story language, with visual/audio scaffolding and separate child/parent language channels for future localization.
- **Privacy and accessibility by default.** The first version should work without child accounts, unnecessary personal data, or a narrow assumption about reading/motor ability.
- **Living-world reward.** Story, character, and location growth are the primary rewards; scores and streaks are not.
- **Static-first.** Early versions should not require a backend merely to play an episode.

## Experience model

Wondervale uses a **storybook shell + living interactive scenes**.

- Storybook: chapters, recaps, transitions, Chronicle, parent preview/reflection.
- Living scenes: direct control of Milo, exploration, dialogue, manipulation, experiments and problem solving.
- Desktop: the child controls a single large story/game viewport; adult guidance appears in the chapter opening.
- Mobile: landscape-first scene plus dialogue, with a functional portrait fallback and no Parent View switch.

## Content structure

```
World
└── Season
    └── Story Arc
        └── Episode
            └── Scene
                ├── Story beats
                ├── Activities
                ├── Parent cues
                └── Continuity effects
```

Learning is modeled separately through a skill graph and can span many episodes.

World/character state is derived from an event/progress ledger rather than being stored only as a mutable snapshot.

## Current work sequence

**Current next-work handoff (2026-10-18, E03 runtime perspective):** Integrated the previously owner-accepted M1 perspective curve and shoe-anchored Milo crop into the E03 playable outer-lane scene. Milo, Nia, Finn and their carried props now scale continuously with foot positions, including travel and restored checkpoints. Candidate build `20261018-e03-perspective1`. M1 foreground masking polygons remain review-only because S/N paths and cart clearance have not passed. The approved Market Lane WebP, all script/route/save semantics, E01/E02 and C01 remain unchanged. **Next:** inspect opening/bookstall/flower stages on a phone, then verify physically plausible S/N connections and wide-cart turns. Full Gate 3 and prerecorded voices remain OPEN.ner approved the latest Market Lane painterly scene and specifically requested transparent-background carried books, improved flowers, and dialogue portraits for Market coordinator and Garden resident. The current E03 runtime WebP matches the Q88 derivative of the supplied image; the original PNG in the repository is a different RGB encoding, with exact distinctions recorded in the updated E03 media manifest. E03 build `20261017-e03-market-props-npc1` incorporates these presentation updates; **C01 and E01/E02 are unchanged**. The two NPC illustrated role portraits are provisional E03-only visuals, not new C01 identities or story decisions. **Next:** inspect the resulting playable E03 on a real device, then validate S/N/L physical cart clearance, save/replay and full Gate 3. Recorded voices/audio and hidden S/N routes remain OPEN.


1. Core trio — **locked**
2. Season 1 story architecture — **approved**
3. Season 1 learning weave — **approved**
4. Episode Production Brief format — **approved**
5. E01 full vertical slice — **in progress: V1 references owner-approved; first playable static E01 assembled; browser acceptance and production media tracked below**
6. E02–E04 connected MVP — **E02 first playable deployed to MN4 `/e02/` (2026-10-12)**; dedicated E02 CI/browser packaging and remote smoke PASS; owner gameplay/physical-device QA remains open
7. Season 1 production

See [Work Sequence](docs/WORK_SEQUENCE.md), the reusable [four-gate episode/media fast lane](docs/EPISODE_PRODUCTION_FAST_LANE.md), and the [installable Wondervale ChatGPT Skill](skills/wondervale-episode-fast-lane/README.md).

## Documentation

### Product and content
- [Product Vision](docs/PRODUCT_VISION.md)
- [Content Strategy](docs/CONTENT_STRATEGY.md)
- [Core Trio](docs/CORE_TRIO.md)
- [Character & World Bible](docs/CHARACTER_WORLD_BIBLE.md)
- [World & Continuity Model](docs/WORLD_CONTINUITY.md)
- [Learning Framework](docs/LEARNING_FRAMEWORK.md)
- [Season 1 Story Architecture](docs/SEASON_1_ARCHITECTURE.md)
- [Season 1 Learning Weave](docs/SEASON_1_LEARNING_WEAVE.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [Episode Production Brief Standard](docs/EPISODE_PRODUCTION_BRIEF.md)
- [S01E01 Production Brief](content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md)
- [S01E01 Detailed Script](content/season-01/s01e01/DETAILED_SCRIPT.md)
- [S01E01 Interaction Specification](content/season-01/s01e01/INTERACTION_SPEC.md)
- [S01E01 Interaction Test Matrix](content/season-01/s01e01/INTERACTION_TEST_MATRIX.md)
- [S01E01 Prompt Pack](prompts/season-01/e01/00-README.md)
- [Visual Style Bible](docs/VISUAL_STYLE_BIBLE.md)
- [Approved Trio Identity Reference](assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png)
- [Turnaround Candidate QA](assets/reference-candidates/s01e01/TRIO_TURNAROUND_REVIEW.md)
- [Image Generation & GitHub Upload Workflow](docs/IMAGE_ASSET_UPLOAD_WORKFLOW.md)
- [Visual Style Decision](docs/VISUAL_STYLE_DECISION.md)
- [S01E01 Visual Reference Contract](content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md)
- [Parent Guide System](docs/PARENT_GUIDE_SYSTEM.md)
- [Parent / Child Display Model](docs/PARENT_DISPLAY_MODEL.md)
- [Experience Design](docs/EXPERIENCE_DESIGN.md)
- [Prompt & Production Pipeline](docs/PROMPT_PIPELINE.md)
- [Design Decisions](docs/OPEN_DECISIONS.md)

### Engineering and quality
- [Architecture](docs/ARCHITECTURE.md)
- [Content Versioning & State](docs/CONTENT_VERSIONING.md)
- [Accessibility, Privacy & Safety](docs/ACCESSIBILITY_PRIVACY_SAFETY.md)
- [Research & Validation](docs/RESEARCH_VALIDATION.md)
- [Work Sequence](docs/WORK_SEQUENCE.md)
- [E01 Lessons / Reusable Episode QA](docs/E01_LESSONS_LEARNED_2026-10-10.md)
- [E02 Kickoff / Handoff](docs/E02_KICKOFF_2026-10-10.md)
- [E02 Production Brief (approved for script)](content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md)
- [Roadmap](docs/ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)

## Status

**E02 Riverside mobile game shell DEPLOYED to MN4 (2026-10-14 12:42 Taipei):** [play E02](https://wondervale.pepepow.net/e02/), source `2f7d88016f1bbda5df68f35b825140ed33722211`, build `20261014-e02-mobile-shell1`. Improved full scene-first iPhone landscape at 568×320 and 667×375 CSS, bounded one-row explicit walking controls, bottom caption when real dialogue exists, no idle placeholder caption, independent Parent View on mobile and contained scroll for notebook/Chronicle. [E02 main browser #38512581820](https://github.com/edisontw/wondervale/actions/runs/38512581820) PASS, [MN4 E02 release #38512581602](https://github.com/edisontw/wondervale/actions/runs/38512581602) PASS and [E01 full regression #38512581573](https://github.com/edisontw/wondervale/actions/runs/38512581573) PASS. Remote deploy verified frozen **E01 byte-identical**, E02 package intact. **E02 real iPhone visual/interaction acceptance remains OPEN.** Original E02 81 script lines, safe-route/evidence decisions, persistence and all approved E01 art/story remain unchanged. [E02 mobile QA and release record](docs/E02_MOBILE_QA_2026-10-14.md).

**E01 map-choice buttons compact and DEPLOYED (2026-10-14 01:15 Taipei):** code `9e5fe72667e4bf360bc359f5ff3fc6cdd2dbf94c`, build `20261014-e01-map-choice-compact1`; [live E01](https://wondervale.pepepow.net/). Owner reported the `Maybe it's a treasure map!` hypothesis boxes were too wide. The map choice buttons now hug their exact text rather than filling the whole paper, wrap by row on narrow phone screens, and retain ≥44px tappable height with 14px legible text. Newly added Chromium tests verify all three original exact answer strings, no horizontal overflow and unchanged guesses at **390×844, 568×320, 667×375 CSS** plus desktop 1366×900. [E01 main browser #38436788865](https://github.com/edisontw/wondervale/actions/runs/38436788865) PASS and [MN4 immutable release #38436788929](https://github.com/edisontw/wondervale/actions/runs/38436788929) PASS; E02 bytes unchanged. Previous iPhone short-landscape whole-art and stable walking fixes remain. **Real owner iPhone map-choice visual acceptance OPEN**; full E01 script/C01 actor art/gesture/save state and E02 remain locked. [E01 field/release record](docs/E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

Previous baseline: **E01 vertical slice in progress.** Core trio, Season 1 story architecture, learning weave, and the Episode Production Brief standard are approved. S01E01's Production Brief and detailed script are approved; the S01E01 task-specific prompt pack and 121-line voice-text export are prepared. The illustrated living diorama visual style v1 and E01 reference contract are locked; the core trio C01 visual identity has been accepted. The matching owner-approved turnaround has been recovered and verified. Original Square art and non-spoiling clue reference candidates are preserved; see [Work reference gate review](assets/reference-candidates/s01e01/WORK_REFERENCE_GATE_REVIEW.md). V1 references are now owner-passed; the first playable runtime and source actors are assembled. See the dated runtime QA record for executed results and remaining production/family work.

## First playable E01

Run `npm run build`, then `python3 scripts/package_static.py` to produce the runtime-only static release. The first playable S01E01 is available for HTTPS preview on MN4 at `https://wondervale.pepepow.net/`. Owner previously passed opening spacing build `20261010-e01-opening-spacing1`, and reported the new desktop layout OK. The current mobile correction has passed deployed-server HTTPS and automated browser tests; **real phone visual acceptance remains open**. Earlier operator deployment evidence remains in the deployment record. The release contains no future-episode source documents. See [runtime contract](docs/E01_RUNTIME_IMPLEMENTATION.md) and [actual QA evidence](docs/E01_RUNTIME_QA_2026-10-08.md). Recorded voices/music, full pose animation, real-device and family acceptance remain separate work.

**E02 engineering preview:** [first playable implementation and test scope](content/season-01/s01e02/PLAYABLE_SLICE_QA_2026-10-12.md). It is a standalone `/e02/` URL on a locally served or staged copy of this repo; do not treat its source merge as MN4 deployment or a completed family UX test.

## E01 fullscreen / landscape refresh (2026-10-12)

An owner-requested E01 presentation revision replaces Parent View with a chapter-opening briefing and makes phone landscape and desktop/full-window play the design priorities. Options retains accessibility/reset controls, and original story/visuals/ledger remain unchanged. [Revision and QA scope](docs/E01_FULLSCREEN_LANDSCAPE_2026-10-12.md). **Baseline promotion completed:** MN4's E01 baseline was explicitly refreshed after verified E01+E02 composite promotion and HTTPS checks; E02-only deploys continue to preserve the currently accepted E01 bytes.
