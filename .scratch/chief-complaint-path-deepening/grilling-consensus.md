# Chief complaint path deepening — Grilling Consensus

Status: confirmed  
Date: 2026-08-09  
Source: `/improve-codebase-architecture` grilling (candidates 1–4)

## Locked decisions

| Topic | Decision |
| --- | --- |
| Order | 1 → 2 → 3 → 4 as one sequenced path |
| #5 / #6 | Out of this effort (orchestrate switch collapse; barrel shrink) |
| Path module name | **Chief complaint path** |
| Path extent | Through entry into `before`; history + Secondary reason not on this graph |
| Intra-primary | Trauma mechanism ↔ body stays inside primary step |
| Callers | `orchestrate` + step `complete*` / `goBack*` set `currentStep` via path (no hard-coded cross-step strings) |
| Soft gate | Owned by the path (split gate helper to avoid import cycles) |
| Duration ownership | Sole owner `chief_complaint_duration`; remove OPQRST detail `timePattern`; T UI reads duration |
| Summary | CaseSession emits ordered bilingual fragments + `editStep` + `obtained`; summary joins/wraps |
| ScreenFacts | main must not call step getters or read `state.answers`; catalogs/UI copy may stay in main |
| Primary seam | CaseSession `apply` / `viewFacts` |

## Landing

Implemented and committed as `c5ed91a` (`refactor: deepen chief complaint path and ScreenFacts seam`). Glossary terms updated in `CONTEXT.md`.
