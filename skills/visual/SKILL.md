---
name: visual
description: Create the image or visual brief for a LinkedIn post for the Acme Waterproofing company page. Use after a draft exists and needs a visual, or when asked for a post image, cover slide or image prompt. Picks an image archetype, builds a structured image prompt from the design spec, and applies brand guardrails. Never publishes.
---

# Visual skill

Turns an approved draft into an image prompt and a visual brief that fit the Acme brand. Matches Step 4 in `workflows/create-post.md`.

## Inputs

1. A draft in `content/drafts/` with its hook, final copy and CTA.
2. Your own reference images in `brand/design-references/` (not included in this repo; add a few that match your brand).
3. The design spec: `skills/visual/references/image-prompt-spec.json`.

## Step 1: Load

Read, do not rely on memory:

- The draft and its "Visual brief" section.
- `skills/visual/references/image-prompt-spec.json`.
- `brand/voice.md` and `brand/audience.md` for guardrails.
- A few images from `brand/design-references/` to match the style, if you have added any.
- `memory/agent-memory.md`, if it has content.

## Step 2: Choose the archetype

Pick one from the spec's `core_design_patterns` and say why:

| Archetype | Use for |
|---|---|
| Surreal Metaphor Hook | Reliability and risk hooks, such as a leak after handover |
| Clever Object / Visual Pun | Introductions and conversation starters |
| Curiosity Gap / Editorial Reveal | Myths vs facts, contrarian takes, carousel title slides |
| Direct Service & Social Proof | Process, case-style and survey posts |

## Step 3: Build the image prompt

Follow `visual_hierarchy_framework` (header, focal hero, typography, footer and CTA) and `color_and_style_guidelines`. Output a JSON image prompt following `agent_execution_schema`, plus a short plain-English summary: archetype, hero subject, headline text, CTA text, ratio (4:5 default).

Keep image text short: one headline, one optional clarifier, one CTA. Check every word of rendered text after generation.

## Brand guardrails (override the spec)

The spec was written from general examples. For Acme:

- Do not invent a logo, brand mark, ISO badge, certification, client name, phone number or URL. Leave a labelled placeholder instead.
- Do not invent site photos. Use illustrations, objects, diagrams or 3D-style renders, not fake photographs of real projects.
- Figures only from `brand/audience.md`, shown with `[DEMO FIGURE]` where the post uses them.
- Commercial and industrial settings only. No homes, no residential cues.
- No competitor names, no prices.
- Sentence case. UK spelling. No em dashes in image text.
- One CTA, matching the draft.
- Use the metaphor to reassure, not to frighten. No collapse or disaster imagery.

## Step 4: Output

Save to `content/drafts/` next to the draft, or add a "Visual" section to the draft:

- Archetype and reason.
- The JSON image prompt.
- Text rendered on the image.
- Status: `pending`, `generated` or `approved`.
- Items for Amit to check.

Generating the image needs an image tool (Canva connector or treg image endpoints). Do not call one until Amit says which to use.

## Quality check hand-off

The editing skill should check: style matches the references, text is legible and correct, numbers match the draft, nothing is invented, guardrails hold.
