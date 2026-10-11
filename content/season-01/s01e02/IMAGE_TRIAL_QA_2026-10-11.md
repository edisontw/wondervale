# E02-3 Riverside concept image trial and QA — 2026-10-11

**Gate:** NOT PASSED; no concept image is approved, no E02 art asset is available on GitHub, no E01 files changed.

## Verified preflight

Starting GitHub `main`: `df3a272affd24e4328b0720be2820c80ecd16eaf`.
Inputs checked: `README.md`, `docs/WORK_SEQUENCE.md`, `docs/OPEN_DECISIONS.md`, E02 `VISUAL_REFERENCE_CONTRACT.md`, `RIVERSIDE_E02_0_DESIGN.md`, existing E01 C01 reference contract, and visual-style decision.

Three new image-generation trial concept sheets were produced in the active conversation. All are PNG 1536×1024. They are **rejected as game reference masters**, not silently transformed into E02 canon.

| Trial | SHA-256 original PNG | Visual QA failures |
|---|---|---|
| Trial 1 | `12f37c476ef85d31c4535366d5b8abe33f756dd9fa9837525b77db890bbe92d8` | Extra dog (not one of Milo/Nia/Finn), Market Lane legible on first view, an intact background bridge, additional apparent cross-water connection in the minimap; layout may mislead child into thinking closure can be bypassed |
| Trial 2 | `7d4a3eb536a40a568b0895e97c1713f29f93fd23177ee7efd40906644df53729` | Intact arched bridge still in distant background; same-bank lookout path and far/near orientation not sufficiently proven; character identity not checked against exact C01. Market Lane presented only in a named reveal panel, but needs a separately gated art layer |
| Trial 3 | `45ca6a6d8d0ba38f2941a618d2a59d9513252ede4ef92b9b4ee9c06c3119ffd1` | Extra dog, Market Lane sign in main state, intact far-background bridge, questionable walkable topology; trio identity not verified |

These hashes describe **generated conversation files, not repository assets**. A GitHub binary source upload/integrity gate has NOT occurred. The files are not imported into the runtime or content repository, and cannot be relied upon as a master.

## Root issue and corrected production approach

The image generator followed the broad “adventure level-design infographic” grammar but repeatedly introduced tempting composition extras that violate **upstream** constraints. Further prompting with every deliverable simultaneously invites hallucinated bridge crossings, companions, labels and spoiler props.

**Next candidate should be a single unlabelled 16:9 environment-only master**, without characters, pets, lettering, maps or decorative inset panels. Generate one coherent landscape in the E01 illustrated living-diorama grammar, with only (1) current near-bank public path, (2) a physically closed old spur before the river, (3) pair of matching old stone bridge footings, (4) unmistakably absent old bridge deck/open water, (5) a **separate continuous same-bank signed public footpath to a fully protected overlook**. Sign lettering should be composited as a separate game UI/state layer after art approval rather than entrusted to text-rendering in the image. Exclude **every intact bridge in all backgrounds**, including arches and decorative pedestrian crossings. Keep distant scenery as trees/buildings only.

After environment topology PASS, use the already-approved **C01 trio sprite identity** as independent actor layers rather than generating new characters in the master. Market Lane direction mark should be **an independent reveal-state layer**, not part of the master. Draw/verify real walkable feet polygons and phone cropping against the actual final art before using it in game.

## Specific E02-3 asset gate

- [ ] Scene master has no complete bridge, misleading bypass, dog or early Market Lane lettering.
- [ ] Near-bank side path and overlook connect continuously; water and far bank clearly unwalkable; closure blocked both visually and geometrically.
- [ ] Near/far historical foundations align; clear open water/deck gap can be inspected on mobile.
- [ ] 16:9 master plus actual phone crop exhibits readable fixed observation stations, actor footprints and RPG dock safe region.
- [ ] Source-original full-resolution PNG/hash and alpha handling are verified after ingest into GitHub.
- [ ] E01 C01 identity reused as **separate** actors and portraits; new environment image not used to redefine character models.
- [ ] Owner visual review PASS before this state is raised from CANDIDATE to REFERENCE APPROVED.

**Safety/status:** Nothing above modifies canonical E02 design, approved E02 script v1, E01 gameplay or existing visual assets. E02 runtime/tests still NOT RUN.
