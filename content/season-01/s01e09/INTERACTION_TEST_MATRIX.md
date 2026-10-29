# S01E09 Interaction Test Matrix — The Closed Hill

> **Gate 1 DRAFT — all 40 production acceptance cases NOT RUN.** They describe a proposed release, not evidence that a real hill route is safe. The future synthetic authoring engine may separately pass a subset; never mark production cases PASS from model tests.

| ID | Area | Acceptance case | Status |
| --- | --- | --- | --- |
| E09-01 | Gate | E08 canonical completion required for production; isolated lab clearly marked | NOT RUN |
| E09-02 | Story | Milo child-controlled; Nia bounded survey; Finn respects closure | NOT RUN |
| E09-03 | Safety | Closed upper segment remains visible and inaccessible in every state | NOT RUN |
| E09-04 | Geometry | Only declared safe model nodes and edges exist | NOT RUN |
| E09-05 | Walk | Only adjacent safe-edge movement; no teleport | NOT RUN |
| E09-06 | Walk | Attempt upper_closed never changes Milo position or opens fence | NOT RUN |
| E09-07 | Walk | Unknown nodes and malformed IDs fail closed | NOT RUN |
| E09-08 | Inspect | Sign inspected only from declared safe anchor | NOT RUN |
| E09-09 | Inspect | Terrain/runoff feature observed without invented cause/date | NOT RUN |
| E09-10 | Inspect | Remote clues cannot be inspected from wrong anchor | NOT RUN |
| E09-11 | Evidence | Seen, hypothesis and unknown remain distinct | NOT RUN |
| E09-12 | Evidence | No source year or closure reason invented | NOT RUN |
| E09-13 | Survey | Walked edge recorded as surveyed | NOT RUN |
| E09-14 | Survey | Unwalked model edge cannot be marked | NOT RUN |
| E09-15 | Survey | Closed or unknown edge cannot be marked | NOT RUN |
| E09-16 | Survey | Mark can be removed and revised without penalty | NOT RUN |
| E09-17 | Survey | Direct old-line attempt ends safely at fence | NOT RUN |
| E09-18 | Route | Route continuity computed from marked surveyed edges | NOT RUN |
| E09-19 | Route | Disconnected partial marks cannot pass | NOT RUN |
| E09-20 | Route | Alternative route reaches overlook only via declared safe model edges | NOT RUN |
| E09-21 | Route | Unmarked edge does not count despite Milo walking it | NOT RUN |
| E09-22 | Route | Route check invalidated after unmarking a required edge | NOT RUN |
| E09-23 | Symbol | Distant mark inspectable only from overlook | NOT RUN |
| E09-24 | Symbol | Comparison references E01 shape, not destination identity | NOT RUN |
| E09-25 | Mystery | No Common name/reveal or E10 content leak | NOT RUN |
| E09-26 | Chronicle | Preview distinguishes seen/think/unknown and is in-memory only | NOT RUN |
| E09-27 | Unlock | No production event, E09 completion or E10 unlock from lab | NOT RUN |
| E09-28 | Replay | Valid history yields deterministic identical state | NOT RUN |
| E09-29 | Replay | Forged completion, date, graph, unlock or safety flag rejected | NOT RUN |
| E09-30 | Reset | Restart clears lab only, fence remains closed | NOT RUN |
| E09-31 | Accessibility | Keyboard/touch parity and >=44px target size | NOT RUN |
| E09-32 | Accessibility | Text labels for closed/gaps; reduced-motion/static equivalent | NOT RUN |
| E09-33 | Browser | 1366x900 desktop full child journey | NOT RUN |
| E09-34 | Browser | 568x320 landscape full child journey | NOT RUN |
| E09-35 | Browser | 667x375 landscape full child journey | NOT RUN |
| E09-36 | Browser | 390x844 portrait full child journey | NOT RUN |
| E09-37 | Regression | E01/E02/E03/C01 accepted runtime, assets and package bytes untouched | NOT RUN |
| E09-38 | Release | Authoring lab excluded from production package; MN4/HTTPS/rollback separately verified | NOT RUN |
| E09-39 | Owner | Actual public access, terrain and overlook evidence approved before promotion | NOT RUN |
| E09-40 | Art | Approved painterly scene and symbol composition, no placeholder masquerade | NOT RUN |

## Evidence gates

**Gate 1 — Story/source/safety:** approve actual accessible boundary, safe survey anchors and public alternate route/overlook, attributed evidence for terrain/closure interpretation, E08 handoff and E01-symbol visibility. Do not invent a date, cause or permit. **Gate 2 — Visual:** approved painterly art and truthful collision/ground topology; label all synthetic previews. **Gate 3 — Playable:** Node deterministic safe graph + Chromium desktop/phone journeys, E01–E03 regression, Chronicle and unlock tests. **Gate 4 — Release:** actual canonical integration, package/hash/rollback integrity, MN4 HTTPS checks, and separate physical-device/family acceptance. Never confuse GitHub Actions SUCCESS with deployment or Owner approval.

**Next unique task:** implement an isolated deterministic E09 graph/survey Node engine and targeted tests. Production route and symbol identity remain blocked-design until one Owner batch.
