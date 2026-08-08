# Field Bilingual Aid

Offline-first bilingual interview aid for EMT field use: the patient (or informant) answers in a second language while the crew works primarily from Chinese summary and prompts.

## Language

**Case**:
One interview episode for a single patient encounter, from language choice through summary finish.
_Avoid_: Session (ambiguous with browser session), ticket

**Start phase**:
The two-page prelude before the chief-complaint interview: choose second language, then choose who is answering.
_Avoid_: Onboarding, wizard, splash

**Informant**:
Who is answering the interview questions (patient, family, someone present, or other).
_Avoid_: Respondent, user, speaker

**Gate reason**:
A stable code naming why the current step cannot advance yet; UI maps it to copy. Soft only: Next may stay disabled, Back / unknown / skip stay available.
_Avoid_: Error, validation message, hard block

**CaseSession**:
The module that owns Case state transitions and orchestration facts (including Start phase and gate reasons). The DOM layer is an adapter across this seam.
_Avoid_: App controller, main logic, interview service

**Chief complaint quality**:
Interview step for how the discomfort feels (qualities) and pain score when relevant. Step id: `chief_complaint_quality`.
_Avoid_: chief_complaint_2, CC2, combined chief complaint detail

**Chief complaint duration**:
Interview step for how long the problem has lasted (numeric duration, buckets, period, EMT refine). Step id: `chief_complaint_duration`.
_Avoid_: Treating duration as part of “step 2”

**Option selection**:
The shared rule for how tapping an interview option changes the selected id set (single-select, exclusive options, mutex groups). Module entry: `nextSelectedIds`. Does not own body-lock or drilldown policy.
_Avoid_: Toggle helper, checkbox logic

**Body selection**:
Shared ops for coarse body region, optional subregion drilldown, and clearing drilldown (`toggleRegion` / `toggleSubregion` / `clearDrilldown`). Steps persist into their own answer detail; policies like “exclusive symptom locks the body map” stay in the calling step.
_Avoid_: Body map UI, hotspot layout

**Bilingual primacy**:
Which language line is shown first in a bilingual pair (`second` | `chinese`). Interview and on-screen summary are second-language-primary (Chinese secondary) so the informant can reconfirm; clipboard copy of the summary is always Chinese for the record. Presentation module: `src/presentation/bilingual.ts`.
_Avoid_: Hard-coding “other on top” in every screen
