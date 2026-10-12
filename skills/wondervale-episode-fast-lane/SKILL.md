---
name: wondervale-episode-fast-lane
description: >-
  Run Wondervale episode production quickly and safely: verify live GitHub main,
  lock story/EFL/interaction decisions, select and package approved PNG/WebP art,
  verify a single manual media upload, assemble and test the playable episode,
  and deploy without breaking earlier episodes. Use for new episodes, art intake,
  episode integration, regression QA, release handoff, or when a user says
  "下一步" in the Wondervale project.
---

# Wondervale Episode Fast Lane

Use this skill for **Wondervale** only (`edisontw/wondervale`). Follow the current GitHub `main`, not a remembered SHA or an old handoff. This skill defines procedure, **not** character canon or a new release status.

## Start each substantial task

1. Fetch and report the current GitHub `main` SHA. Read `README.md`, `docs/WORK_SEQUENCE.md`, `docs/OPEN_DECISIONS.md`, and only the episode-specific source files needed for this step. The canonical process is `docs/EPISODE_PRODUCTION_FAST_LANE.md` on the **current** main; its newer instructions take precedence over this packaged snapshot.
2. Read the episode's approved Production Brief, script, interaction spec, prior decisions, and applicable E01 lessons. Keep upstream canon immutable unless the user expressly changes it. Ages 6–9, EFL-first, parent-guided and child-driven; Milo is player-controlled, with Nia and Finn as the initial companions.
3. Determine the **one current gate** below and the single deliverable that will unblock it. Do not silently change scope to artwork, audio, runtime, or deployment.

## Four production gates

**1. Canon and interaction** — approve the Episode Production Brief, reasoning/evidence, child agency, simple but intellectually meaningful English, parent cues, exact line IDs, Chronicle, continuity and save/event contracts. No artwork or runtime completion is implied.

**2. Artwork and media intake** — generate a small number of useful images, show the real pictures, reject only *material* story/safety/spoiler/identity defects. Accept good art without demanding that separate illustrated views be geometrically identical. Reuse approved C01 character assets. Preserve the full-size PNG, derive appropriately sized WebP without degrading the master, and prepare **one ZIP** with repository-relative source and runtime directories plus hash manifest. If direct binary GitHub transfer is unproven, **do not retry it repeatedly**: hand the ZIP to the user for one manual upload. On "已上傳", re-fetch **current** main, verify the exact paths, sizes and Git blob IDs; inspect an unmerged branch if needed. Run `python3 scripts/verify_episode_media.py` and the targeted media CI for SHA-256, PNG CRC, WebP headers/dimensions. Never ask to upload files that already match. Art PASS is not playable PASS.

**3. Working playable slice** — reuse E01 RPG dialogue dock, Listen/captions, C01 sprites, parent views and accessibility patterns, **not** the E01 scratch/board mini-game or coordinates. Implement actual movement and safe feet targets, evidenced choices and recovery, correct once-only ledger writes, restore, Chronicle and read-only replay. Use episode-owned art asset lists; never glob another episode's assets into a release. Run actual E02-specific tests and the E01 baseline on the latest PR HEAD. Inspect real browser renders, not only source geometry.

**4. Device acceptance and deployment** — check 320/360/390/430 px mobile, desktop/short desktop, scene visibility, sprite names/feet, captions, interaction, touch/keyboard, storage, replay and spoiler timing. Obtain **playable** owner PASS separately from visual PASS. Package only runtime-required assets, verify build SHA and HTTPS-served build, preserve atomic rollback, and record the resulting `main` SHA.

For concrete exit criteria read `references/acceptance-gates.md`; for source media paths, ZIP structure and verification read `references/media-handoff.md`.

## Failure prevention and pacing

- Distinguish **visual choice**, **file uploaded and hash verified**, **automated CI**, **browser QA**, **real device/family QA**, and **production deployment**. Claim only stages evidenced by real tests.
- Do not regenerate owner-approved art for cosmetic variations, or produce a series of throwaway concept reports when a playable scene would expose the actual defect.
- Work in focused layers; batch accepted docs and related small changes into one PR. Full existing runtime regression is essential when behavior/build changes, but a dedicated short media CI is sufficient for isolated image integrity checks where the repository policy permits.
- Before merging, ensure required checks are PASS **for the PR's current head SHA**. E01's accepted storyline, line IDs, art, save behavior and release remain frozen unless the user asks to modify them.
- Record durable accepted decisions, exact asset/provenance references, meaningful failures and test evidence in GitHub. End with `main SHA`, **locked**, **tested**, **open**, and **one next task**. Do not confuse a GitHub upload or green E01 CI with E02 gameplay completion.
