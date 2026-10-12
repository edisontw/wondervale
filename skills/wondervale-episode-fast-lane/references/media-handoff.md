# Wondervale original-image → GitHub transfer

**Source of truth:** GitHub `main` and the episode's current production manifest. Never hard-code a prior SHA in an action that is supposed to use the newest main.

## One handoff

1. Choose and visually approve 1–2 appropriate compositions per distinct state; reject missing required evidence, unsafe apparent shortcuts, baked future clues and C01 character identity drift. Separate illustrations do not require pixel-for-pixel shared world geometry.
2. Save the **original bytes** of each full-size PNG under `assets/production-candidates/<episode-id>/` and a visually checked WebP in `public/art/`. Do not use a thumbnail or a screenshot as the source master.
3. Produce one ZIP preserving those repository-relative paths, plus a manifest containing `path`, `format`, `bytes`, `[width,height]`, `sha256` and `git_blob` for each item. Git blob = SHA-1 of `b"blob " + str(len(data)).encode() + b"\\0" + data`.
4. If direct upload cannot transfer actual binary bytes, supply the ZIP to the owner and request **one** manual GitHub upload. Avoid speculative connector or repeated ImageGen regeneration to work around missing transfer support.
5. When the owner says “已上傳”, check current `main` **before** asking for any re-upload. Confirm exact paths, file lengths and Git blob IDs for every image. If absent, inspect the named upload branch/PR, not just old `main`.
6. Run `python3 scripts/verify_episode_media.py --manifest assets/production-candidates/<episode-id>/<manifest-name>.json` in a checkout containing the actual bytes. The verifier checks SHA-256, Git blob, PNG CRC and dimensions, WebP RIFF and dimensions. Also use the lightweight `Wondervale episode media intake integrity` GitHub Action.
7. Only after this passes mark the manifest `uploaded_verified`; then integrate art into a playable scene and run full browser QA. Never mistake media CI or E01's successful CI for E02 acceptance.

## Verified E02 example (historical example, not a current SHA)

R0/R1/R2 each use a 1672×941 PNG; corresponding WebP derivatives belong to `public/art/s01e02-riverside-r0.webp`, `-r1.webp`, `-r2.webp`. E02 image selection and one manual GitHub transfer are already approved and verified in project history. **Do not regenerate or request this exact upload again** unless current GitHub evidence shows an actual change or defect.

## Common traps

- GitHub text-file write APIs cannot be assumed to support binary PNG/WebP; a successful text commit is not an image upload.
- A GitHub content URL/thumbnail is not proof of exact bytes; compare content size, original/hash and source role.
- A script that packages `public/art/*.webp` globally leaks future episode art into earlier releases; package only per-episode allowlisted assets.
- Keep labels/spoilers in separately gated UI state, not permanently painted on initial backgrounds.
- Distinguish source-image visual QA from rendered browser interaction QA: actors, feet, names, captions and hotspots need actual runtime screenshots.
