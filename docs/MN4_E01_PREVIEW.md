# MN4 E01 preview release

Status: packaged prototype, not deployed. No MN4 connection/hostname credentials were available in this session. Keep the selected MN4 hosting baseline.

## Build and verify

From repository root: `npm run build`, `python3 scripts/verify_production_assets.py`, `npm test`, `python3 scripts/package_static.py`.

Serve only `dist/wondervale-e01-static` from an isolated HTTPS document root. The folder contains 12 runtime files plus RELEASE_INTEGRITY.json; no private foundation/future episode sources. GitHub Actions also publishes this exact folder as the `wondervale-e01-static` artifact after actual packaged-browser tests pass. Check every extracted file's SHA-256 against RELEASE_INTEGRITY.json before transfer.

Use a reversible versioned directory and switch the site's root only after static health checks. Preserve origin to retain this-device progress. Serve index.html / sw.js with revalidation; immutable long-cache headers are inappropriate for their current unversioned names. The service worker cache is build-versioned and deletes old Wondervale caches on activation.

## Preview acceptance

Check HTTPS, main page/content/art availability and no missing assets; finish desktop and phone paths with audio off; confirm optional Parent View never gates progress; compare both landmarks before marker cleaning; verify RIVERSIDE plus arrow become legible only at reveal; reload and revisit the clear present-day marker; run a historical replay without changing current progress. Check actual iOS Safari and Android Chrome, keyboard focus and storage-failure behavior on the preview origin.

## Family cases (remain pending)

UX-11: observe a fresh child-led playthrough, record active play duration and pauses, assess the 14–18 minute target without forcing it. The automated skip path's duration is not evidence.

UX-12: observe what the child notices before guessing and how they use map shapes to choose a real place. Record spontaneous action/talk and the effect of optional parent prompts. Button completion alone is not learning evidence. No microphone or stored child-response capture is required; use the project's privacy defaults.

Final recorded voices, music/SFX and richer actor poses are still required before final media acceptance. Preview does not imply public launch or final product approval.
