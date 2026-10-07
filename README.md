# Wondervale

**Parent-guided interactive learning adventures for ages 6–9.**

Wondervale is an English-first interactive story world designed for children ages 6–9 and the adults learning alongside them.

The product is not a digital worksheet collection. Children explore an evolving world, follow recurring characters, solve story problems, experiment, read, calculate, observe, and make choices. Parents act as conversation partners through short, well-timed prompts rather than as teachers or answer-givers.

## Core principles

- **Story first.** Learning exists inside meaningful situations.
- **Parent-guided, child-driven.** Adults prompt prediction, explanation, observation, and connection without taking over.
- **The world remembers.** Characters can learn, relationships can change, and places can be built, repaired, opened, or transformed across episodes.
- **Learning accumulates.** Skills are revisited and transferred into new contexts rather than taught once and forgotten.
- **Reusable engine, non-repetitive experience.** Technical activity components may be reused; stories and surface interactions should not feel templated.
- **English first, multilingual-ready.** Initial content is written in English, while the content model keeps future localization possible.
- **Privacy by default.** The first version should work without child accounts or unnecessary personal data.

## Product structure

```
World
└── Season
    └── Episode
        └── Scene
            ├── Story
            ├── Activity
            ├── Parent cue
            └── World / character effects
```

Learning is modeled separately through a skill graph and can span many episodes.

## Initial development sequence

1. Foundation documents and world/content schemas
2. Minimal web application shell
3. Episode 01 vertical slice
4. Parent-guidance interaction testing
5. 3–4 episode MVP
6. Season 1 alpha
7. Cloud accounts/adaptive systems only after real usage justifies them

## Documentation

- [Product Vision](docs/PRODUCT_VISION.md)
- [World & Continuity Model](docs/WORLD_CONTINUITY.md)
- [Learning Framework](docs/LEARNING_FRAMEWORK.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [Parent Guide System](docs/PARENT_GUIDE_SYSTEM.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)

## Status

**Foundation phase.** No production learning content has been locked yet. Character names, visual style, Season 1 story details, and public domain are intentionally still open for iteration.
