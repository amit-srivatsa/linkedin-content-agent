---
name: research
description: Research a topic for an Acme Waterproofing LinkedIn post. Use before writing, when asked to find facts, angles, sources or ideas for waterproofing, UAE construction, warranties, diagnostics or materials. Produces a sourced research brief and idea list, with claims graded and regulation claims flagged.
---

# Research skill

Finds facts and angles for a post and records where each one came from. Does not write the post.

## Inputs

A topic, a pillar from `brand/content-pillars.md`, or a request for ideas. If none is given, propose 5 ideas spread across the pillars.

## Step 1: Load the brand

Read before searching:

- `brand/content-pillars.md`: pillar, angles, CTA.
- `brand/audience.md`: buyers, main fear (a leak after handover), positioning.
- `brand/voice.md`: off-limits list.

Research serves the reader's fear and the three positioning points: warranty, systems and materials, diagnostics.

## Step 2: Search

1. Run 3 to 6 focused searches. Prefer sources in this order:
   1. Official: Dubai Municipality and other UAE authorities, standards bodies, manufacturer technical data sheets.
   2. Industry: construction trade press, technical associations, manufacturer guides.
   3. General press and blogs. Use for angles only, never as the sole source for a fact.
   4. Competitor marketing. Use only to understand what the market says. Never quote, name or link them in output.
2. Read the page, not just the search snippet, before relying on a fact.
3. Search for what buyers get wrong or fear, not only what is true.

## Step 3: Grade each claim

Record every fact the post might use in a claims table:

| Claim | Source (URL) | Grade | Use in post? |
|---|---|---|---|
| ... | ... | A, B or C | yes, no, or with caveat |

Grades:

- **A:** official or primary source, read directly.
- **B:** reputable secondary source, or two independent sources agree.
- **C:** single marketing source, or vendor claim. Do not use as fact. May inspire an angle.

Always flag as **REGULATORY, check before use** any claim about codes, approvals, certificates or warranty law. Only grade A counts as confirmed.

## Step 4: Stay on brand

- Commercial and industrial only. Skip residential angles.
- No competitor names in output, even if the sources name them.
- No prices.
- Do not invent facts, numbers, clients or quotes. If a fact is missing, say it is missing. The only invented figures allowed are the approved placeholders in `audience.md`, which belong to the writing skill.

## Step 5: Save

Save to `content/ideas/YYYY-MM-DD-short-slug-research.md`:

```markdown
---
status: research
pillar: <pillar>
topic: <topic>
created: YYYY-MM-DD
---

## Summary
Three to five lines: what we learned and the best angle.

## Reader and fear
Who this is for and what they worry about.

## Recommended angle
One angle, with a draft one-line hook idea.

## Claims
<claims table>

## Other angles
- ...

## Gaps and risks
- What could not be confirmed.
- Regulatory points to check.

## Sources
- [Title](URL), accessed YYYY-MM-DD
```

If asked only for ideas, save a list of 5 to 10 ideas to `content/ideas/YYYY-MM-DD-ideas.md`, each with pillar, one-line angle and the reader's fear.

## Hard rules

- Cite a source for every factual claim.
- Never present a grade C claim as fact.
- Nothing is published or sent.
