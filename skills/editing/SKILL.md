---
name: editing
description: Quality-check and edit an Acme Waterproofing LinkedIn draft. Use after the writing skill, or when asked to review, proofread or check a draft against the brand and LinkedIn best practices. Returns a pass or fail report, fixes small issues, and routes bigger failures back to the right skill.
---

# Editing skill

The quality check. Reviews a draft in `content/drafts/` against the brand files and the LinkedIn rules. It fixes small issues and sends bigger ones back to the agent that owns them, so only the failing step is redone.

## Step 1: Load

Read the draft, then:

- `brand/voice.md`
- `brand/audience.md`
- `brand/content-pillars.md`
- `skills/writing/references/linkedin-best-practices.md`
- The research brief named in the draft's front matter, if any.

## Step 2: Check

Score each item pass or fail.

**Brand**
- [ ] Voice: plain, reassuring, one light humor line at most (about 10 to 15 percent).
- [ ] Speaks as "we" from the company page.
- [ ] Commercial or industrial focus. No residential, no prices.
- [ ] No competitor named or hinted at.
- [ ] Fits the stated pillar and answers the buyer's fear.
- [ ] UK spelling, sentence case.

**Accuracy**
- [ ] Every fact matches the research brief and has a source there.
- [ ] No invented clients, projects, certifications, names or quotes.
- [ ] Any number is sourced or an approved placeholder tagged `[DEMO FIGURE]`, and `demo_figures: yes` is set in the front matter.
- [ ] Regulation and warranty claims are flagged for review, and grade A only is stated as fact.

**LinkedIn**
- [ ] Hook lands in the first 140 characters, no opening hashtag or emoji, no announcement opener.
- [ ] One idea, 150 to 300 words (text) or 6 to 10 slides (carousel).
- [ ] Short paragraphs, blank lines between.
- [ ] Exactly one CTA, matching the pillar.
- [ ] No external link in the body unless the review notes justify it.
- [ ] No engagement bait. Up to three hashtags. At most one emoji.
- [ ] No em dashes.

**Readability**
- [ ] Technical terms are explained once.
- [ ] No filler, no stacked adjectives, no jargon.
- [ ] Reads naturally aloud, not like generic AI copy.

## Step 3: Act

- **Small issues** (typos, em dashes, spelling, a long paragraph, a weak CTA line): fix them directly in the draft and list each change.
- **Writing issues** (wrong hook, wrong voice, off-pillar, too long): send back to the writing skill with specific notes.
- **Fact issues** (unsourced claim, a regulatory claim stated as fact, an invented detail): send back to the research skill, or remove the claim.
- **Brand violations** (competitor, residential, price): remove or rewrite, and note it.

Do not rewrite the whole post unless asked. Keep the author's best lines.

## Step 4: Report

Save to `memory/sessions/` under the current session file, or print in chat, using:

```markdown
## Quality check: <draft file>
Result: PASS | FAIL (<n> items)

### Fixed
- ...

### Needs another pass
- Writing: ...
- Research: ...

### For Amit
- Claims to verify:
- Placeholder figures used:
```

Update the draft's front matter:

- `status: reviewed` when it passes, or `status: needs-work` when it fails.

## Hard rules

- A draft is never marked ready to publish. At best it is `reviewed`, and Amit approves publishing.
- Nothing is published or sent.
- Never invent facts to fix a gap. Remove the claim or ask.
