# Wondervale

**Parent-guided EFL learning adventures for ages 6–9.**

Wondervale is an EFL-first interactive story world designed for children ages 6–9 and the adults learning alongside them. Children directly control a recurring protagonist within a growing core cast.

The product is not a digital worksheet collection. Children explore an evolving world, follow recurring characters, solve story problems, experiment, read, calculate, observe, and make choices. Parents act as conversation partners through short, well-timed prompts rather than as teachers or answer-givers.

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

## Initial development sequence

1. Foundation documents and world/content schemas
2. Content compiler/validator and minimal application shell
3. Episode 01 vertical slice
4. Real parent-child validation
5. 3–4 connected episode MVP
6. Season 1 alpha
7. Cloud accounts/adaptive systems only after real usage justifies them

## Documentation

### Product and content
- [Product Vision](docs/PRODUCT_VISION.md)
- [Content Strategy](docs/CONTENT_STRATEGY.md)
- [Character & World Bible](docs/CHARACTER_WORLD_BIBLE.md)
- [World & Continuity Model](docs/WORLD_CONTINUITY.md)
- [Learning Framework](docs/LEARNING_FRAMEWORK.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [Parent Guide System](docs/PARENT_GUIDE_SYSTEM.md)
- [Experience Design](docs/EXPERIENCE_DESIGN.md)

### Engineering and quality
- [Architecture](docs/ARCHITECTURE.md)
- [Content Versioning & State](docs/CONTENT_VERSIONING.md)
- [Accessibility, Privacy & Safety](docs/ACCESSIBILITY_PRIVACY_SAFETY.md)
- [Research & Validation](docs/RESEARCH_VALIDATION.md)
- [Roadmap](docs/ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)

## Status

**Foundation phase.** No production learning content has been locked yet. Character names, visual style, Season 1 story details, and public domain are intentionally still open for iteration.
