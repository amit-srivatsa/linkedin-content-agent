---
name: writing
description: Write LinkedIn posts and carousels for the Acme Waterproofing company page. Use after a research brief exists, or when asked to draft, rewrite or adapt a LinkedIn post. Applies the brand voice, audience, content pillars and LinkedIn best practices, and saves a draft for human review.
---

# Writing skill

Turns a topic and a research brief into a LinkedIn draft that fits the Acme brand and the platform. Never publishes.

## Inputs

1. A topic or idea, and ideally a research brief from `content/ideas/` (see the research skill).
2. The pillar it belongs to. If none is given, choose from `brand/content-pillars.md` and say which.

## Step 1: Load the brand (always)

Read these before writing a word. Do not rely on memory of them.

- `brand/voice.md`: voice, format rules, off-limits list, demo figure rule.
- `brand/audience.md`: buyers, main fear, positioning, CTAs, approved placeholder figures.
- `brand/content-pillars.md`: pillar, angle, CTA for that pillar.
- `skills/writing/references/linkedin-best-practices.md`: platform rules.
- `memory/agent-memory.md`: lessons and past decisions, if it has content.

If a brand file is empty, stop and say so. Do not guess the brand.

## Step 2: Plan

Write a short plan before drafting:

- Pillar and angle.
- The single idea of the post.
- The reader (developer, contractor, facilities manager, consultant) and their fear.
- Format: text post, document carousel, or image post. Use a carousel for checklists and step-by-step processes.
- The one CTA, matched to the pillar: request a site survey, download the checklist, or book a call.
- The proof used: a point from the research brief, or an approved `[DEMO FIGURE]` from `audience.md`.

## Step 3: Hooks

Write 3 hook options. Each one:

- Lands the point in the first 140 characters.
- Names a real situation, a buyer question or a specific claim.
- Does not start with a hashtag or emoji, and does not announce ("We are excited").

Pick the strongest and say why in one line.

## Step 4: Draft

Text post:

- 150 to 300 words.
- One idea.
- One to three sentences per paragraph, blank line between.
- Plain words, technical terms explained once.
- Humor at 10 to 15 percent: at most one light line, aimed at the situation (water, weather), never at the reader or a client.
- One CTA at the end.
- Up to three hashtags at the end.
- No em dashes. Sentence case. UK spelling. "We" for the company.

Carousel:

- 6 to 10 slides. Slide 1 is the hook. One idea per slide, under 30 words each. Last slide has the CTA.
- Also write a short caption (under 80 words) using the same hook rules.

Links:

- No external link in the body by default. Put the link in the first comment, and note it in the review notes.

## Step 5: Self-check before saving

Fix these yourself. If you cannot fix one, list it in the review notes.

- [ ] Hook works inside 140 characters.
- [ ] One idea, one CTA.
- [ ] No competitor named or hinted at.
- [ ] No prices, no residential content.
- [ ] No em dashes.
- [ ] Every number is either from the research brief with a source, or an approved placeholder tagged `[DEMO FIGURE]`.
- [ ] No invented clients, projects, certifications, names or quotes.
- [ ] Regulation or warranty claims match the research brief, and are flagged for review.
- [ ] Voice matches `brand/voice.md`.

## Step 6: Save

Save to `content/drafts/YYYY-MM-DD-short-slug.md` using this format:

```markdown
---
status: draft
pillar: <pillar name>
format: text | carousel | image
cta: site survey | checklist | call
audience: <primary reader>
research: <path to research brief or none>
demo_figures: yes | no
created: YYYY-MM-DD
---

## Chosen hook
<hook>

## Post
<final copy, ready to paste>

## Alternative hooks
1. ...
2. ...

## First comment (if a link is needed)
<text and link, or none>

## Visual brief
<what image, diagram or slide design is needed, or none>

## Review notes for Amit
- Claims to check:
- Placeholder figures used:
- Suggestion: ask staff to reshare with their own comment (company pages have lower reach).
```

Then hand off to the editing skill. Do not edit the draft further after editing signs off unless asked.

## Hard rules

- Nothing is published or sent. Drafts are saved for Amit's review.
- Never invent employers, metrics or authorship. The only invented figures allowed are the approved placeholders in `audience.md`, tagged `[DEMO FIGURE]`.
- If a request conflicts with the brand files (for example it asks for residential content or to name a competitor), say so and offer the closest on-brand version.
