# Voice Text Export & Manual Production Handoff

**Current status:** `40-voice-lines.tsv` contains **121 exact approved spoken-text records** from `DETAILED_SCRIPT.md` v1. No voice or narration audio has been generated/recorded by the prompt-pack step. Steward is a role code, not final cast/name.

**Inputs:** master context; exact `40-voice-lines.tsv`; approved E01 script; future approved voice direction/provider/casting/recording settings.

**Prompt:**
> Build a manual production worklist from TSV fields `line_id`, `scene_id`, `speaker`, `exact_text`, `playback_condition`, `delivery_direction`, `pronunciation_note`. **Do not paraphrase, extend or translate exact_text**. Export one asset keyed by the stable line ID. Every caption uses the same source text.
>
> Ensure mutually exclusive speculation A/B/C line pairs are individually available but not played together; likewise the missing-C fallback, optional UI help and repeat lines, and one of three resume recap pairs. Do not record UI help as mandatory autoplay; first launch has no recap.
>
> Proposed character deliveries: Milo energetic/curious; Nia attentive; Finn inventive/light humor; steward kind/practical; narrator calm storybook. Pace naturally for EFL, never babyish. Review proper names including Riverside and consistency of levels. Provide audio-format, gain/quality, file naming and pronunciation plan for approval **before** actually generating or recording. Track all files/tool/voice model or performer/rights/provenance and confirm word-for-word transcription after creation.

**Output:** line-ID recording sheet, approved casting/format proposals, later verified audio filenames. Script edits require a new approved script revision and regenerated TSV.
