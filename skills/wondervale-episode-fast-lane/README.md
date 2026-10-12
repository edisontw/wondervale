# Wondervale Episode Fast Lane — ChatGPT Skill

This directory contains a standard, portable ChatGPT Skill that applies the [Wondervale Episode Production Fast Lane](../../docs/EPISODE_PRODUCTION_FAST_LANE.md) to episode work.

## Install, if ChatGPT Skills is available for your account/workspace

1. Download the skill ZIP attached in the conversation, or create one from this repository by running `python3 scripts/package_wondervale_skill.py`.
2. In ChatGPT, open **Plugins → Skills → Create → Upload from your computer**.
3. Select the `wondervale-episode-fast-lane.skill.zip` package and complete any required review/installation.
4. In a Wondervale conversation, ask “用 Wondervale Episode Fast Lane 繼續 E02” or “下一步”.

**Availability note:** ChatGPT Skills and uploading are currently dependent on product plan and workspace access. Saving this source or downloading the ZIP does not install or enable it in a personal account. The project-level `docs/EPISODE_PRODUCTION_FAST_LANE.md` remains applicable even where skill installation is unavailable.

## Structure

- `SKILL.md`: automatic trigger description and four production gates.
- `references/acceptance-gates.md`: story/art/gameplay/deployment checks.
- `references/media-handoff.md`: once-only PNG/WebP packaging, manual upload and exact-byte validation.

The installed Skill is a **procedural snapshot**. It explicitly fetches current GitHub `main` and defers to the latest project decisions; it does not include image binaries, API credentials, or a hard-coded project SHA. After editing these files, rebuild and re-upload a new ZIP when you need to update the installed Skill.
