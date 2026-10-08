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
- Desktop: child experience and parent guide can appear side-by-side.
- Mobile: dedicated Child View and Parent View.

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

1. Core trio — **locked**
2. Season 1 story architecture — **approved**
3. Season 1 learning weave — **approved**
4. Episode Production Brief format — **approved**
5. E01 full vertical slice — **in progress: C01 trio identity locked; recovered approved turnaround; remaining visual reference review next**
6. E02–E04 connected MVP
7. Season 1 production

See [Work Sequence](docs/WORK_SEQUENCE.md).

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
- [Roadmap](docs/ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)

## Status

**E01 vertical slice in progress.** Core trio, Season 1 story architecture, learning weave, and the Episode Production Brief standard are approved. S01E01's Production Brief and detailed script are approved; the S01E01 task-specific prompt pack and 121-line voice-text export are prepared. The illustrated living diorama visual style v1 and E01 reference contract are locked; the core trio C01 visual identity has been accepted. The matching owner-approved turnaround has been recovered and verified. Original Square art and non-spoiling clue reference candidates are preserved; see [Work reference gate review](assets/reference-candidates/s01e01/WORK_REFERENCE_GATE_REVIEW.md). Next approve the bounded reference set before production sprite assets and runtime.
