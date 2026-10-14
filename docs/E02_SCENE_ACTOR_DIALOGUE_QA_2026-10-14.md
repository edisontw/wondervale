# E02 Riverside — scene, grounding and dialogue QA (2026-10-14)

**Scope:** E02-only engineering repair. Before work, `main` was verified as `1e84bb64b3f16ad93100a764c86051ef9a9ba3ed`. E01 remains frozen. Owner-device acceptance is OPEN.

## Reproduced root causes

1. The engine's canonical 1600×900 **abstract near-bank graph** was being projected directly into three separately painted 1672×941 photographs. Those artworks are not pixel-registered: R1 has a paved approach at the left, while R2's paved lookout is on the right. Characters at a graph-relative X/Y could therefore appear **in the water, behind the guardrail or on props**.
2. E02 discarded the backdrop entirely for the 13-line opening sequence (`phase==='intro'`), so the beginning of the episode was text-only despite the owner-approved R0 scene being available.
3. The Old Map was appended below the short-landscape game viewport, while exploration deliberately clipped document scrolling. Users could open it but fail to see the panel.
4. Runtime previously assumed that a valid `<img src>` meant a successful download. A failed or corrupt image could leave a blank painted frame without a reason.
5. On small landscape screens the two caption controls used a fixed large share of the text column; mobile characters were also oversized relative to the illustrated boardwalk.

## Corrective implementation

- R0 has an explicit **paved-foreground presentation map**, with named graph stops mapped to image-specific feet coordinates; the original engine waypoints/edges still decide legal travel, so this is **not** a change to safe route topology or story triggers.
- **Only R0 is an explorable scene.** R1 and R2 are inspection cameras with unoccluded approved artwork and no projected actor/hotspot sprites. Dialogue retains the speaker name, C01 portrait, exact original text and manual Listen. A clear **Back to Riverside** action restores R0 without erasing observations, moving stations or duplicating ledger events.
- The opening uses R0 background and cast behind the opening dialogue. Short-landscape intro follows the same scene-first responsive caption rules as exploration.
- Adjust R0 hotspot targets to painted left gate / public walkway / right lookout, not river pixels. Scale down actors on narrow screens, keep their feet on the existing paving and avoid labels crossing one another.
- Long dialogue scrolls inside the caption text column; controls stay `>=44px`. UI speaker labels use readable casing, while 81 canonical EFL script lines and their IDs remain unchanged.
- Present the Old Map in an accessible centered dialog within the screen. Hide redundant short-phone status visually while retaining its accessibility role, avoiding scene size changes.
- On image load failure, show a human-readable error and **Retry picture**; retries bust stale responses rather than silently displaying a blank frame. Existing R0/R1/R2 WebPs remain unchanged; no image regeneration.
- New E02-only build marker: `20261014-e02-safe-stage-dialogue1`. E01 source, artwork, engine, save format and release were not edited.

## Test and release gates

- Browser checks assert real successful `img.decode()` at the expected 1672-pixel width for R0, R1, R2 (mere asset URLs are insufficient).
- Assert no actor overlays in R1/R2, actor feet in the R0 paved band, restored R0 cast after closing details, opening art and caption visible together, portrait and short-landscape interactions, and actual error/retry behavior when R2's network request is aborted.
- Engine test verifies camera return preserves the state graph position, evidence, played dialogue and ledger.
- Re-run E02 unit/browser/packaging and E01 full regression via Actions. E02 MN4 deploy must confirm byte-identical E01; PR CI is not a production release.
- **OPEN:** actual iPhone Chrome / Home Screen App visual QA at 568×320 and 667×375 CSS equivalent, correct apparent actor feet relative to the approved painting, full text/controls, WebKit picture loading, family UX and recorded voices.
- **Locked:** selected R0/R1/R2 art, C01 trio identity, the 81-line EFL/story, public path graph, closed crossing, evidence/revision/Market spoiler gates, E01 accepted application.
