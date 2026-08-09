# Field Bilingual Aid

Offline-first bilingual interview aid for EMT field use: the patient (or informant) answers in a second language while the crew works primarily from Chinese summary and prompts.

## Language

**Case**:
One interview episode for a single patient encounter, from language choice through summary finish.
_Avoid_: Session (ambiguous with browser session), ticket

**Start phase**:
The two-page prelude before the chief-complaint interview: choose second language, then on the informant page choose who is answering and Scene type.
_Avoid_: Onboarding, wizard, splash

**Informant**:
Who is answering the interview questions (patient, family, friend, or other). Chinese label for friend is「朋友(友人)」.
_Avoid_: Respondent, user, speaker, 有人 (as the friend option)

**Scene type**:
PCR-aligned branch on the informant Start page: trauma or non-trauma. Required with Informant before the interview; changing it clears primary／secondary-path answers and keeps history mnemonic answers.
_Avoid_: Case type, call type, complaint class

**Gate reason**:
A stable code naming why the current step cannot advance yet; UI maps it to copy. Soft only: Next may stay disabled, Back / unknown / skip stay available.
_Avoid_: Error, validation message, hard block

**CaseSession**:
The module that owns Case state transitions and orchestration facts (including Start phase and gate reasons). The DOM layer is an adapter across this seam.
_Avoid_: App controller, main logic, interview service

**Chief complaint quality**:
Interview step for how the discomfort feels (qualities) and pain score when relevant. Step id: `chief_complaint_quality`. Appears only when `needsQualityStep` is true (minimal set: trauma after body map; non-trauma `abdominal_pain`／legacy `pain`). Other non-OPQRST primaries skip to duration; chest OPQRST skips both quality and shared duration.
_Avoid_: chief_complaint_2, CC2, combined chief complaint detail, showing quality for every primary

**OPQRST chest page**:
Non-trauma path after primary「胸悶／胸痛」: onset, provocation, quality, region/radiation, 0–10 severity, and time (pattern + approx duration or unknown). Step id: `chest_opqrst`. Writes chief complaint duration and skips the shared duration step (and quality).
_Avoid_: Full OPQRST for every complaint, free-text history

**Chief complaint duration**:
Interview step for how long the problem has lasted (numeric duration, buckets, period, EMT refine). Step id: `chief_complaint_duration`. May be filled by the OPQRST chest page T fields instead of visiting this step.
_Avoid_: Treating duration as part of “step 2”

**Primary reason**:
First discomfort step after Start under Scene type:「哪裡不舒服」— non-trauma flat catalog or trauma mechanism → body map. Stored on `chief_complaint_1`.
_Avoid_: Generic chief-complaint type list as the long-term model

**Secondary reason**:
Final other-discomfort step「還有其他感覺不舒服的地方」(step id still `other_symptoms`): multi-select, skippable. Non-trauma = primary catalog minus OHCA; trauma = short sensation list only (no second body map / traffic / injury round).
_Avoid_: Accompanying「感」scan with body map, replaying trauma mechanism

**Option selection**:
The shared rule for how tapping an interview option changes the selected id set (single-select, exclusive options, mutex groups). Module entry: `nextSelectedIds`. Does not own body-lock or drilldown policy.
_Avoid_: Toggle helper, checkbox logic

**Body selection**:
Shared ops for coarse body region, optional subregion drilldown, and clearing drilldown (`toggleRegion` / `toggleSubregion` / `clearDrilldown`). Steps persist into their own answer detail; policies like “exclusive symptom locks the body map” stay in the calling step.
_Avoid_: Body map UI, hotspot layout

**Bilingual primacy**:
Which language line is shown first in a bilingual pair (`second` | `chinese`). Interview and on-screen summary are second-language-primary (Chinese secondary) so the informant can reconfirm; clipboard copy of the summary is always Chinese for the record. Presentation module owns bilingual primacy ordering; CaseSession orchestration is `apply` / `viewFacts`.
_Avoid_: Hard-coding “other on top” in every screen
