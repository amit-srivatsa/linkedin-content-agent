# Workflow: create a LinkedIn post

Turns a topic into a reviewed draft for the Acme Waterproofing company page. Nothing is published or sent. Amit approves every post.

## Flow

```text
Brief -> Research -> Writing -> Visual -> Quality check -> Package -> Local web skin
                        ^                      |
                        |______ if it fails ___|
                          (only the failing step is redone)
```

| Step | Owner | Status | Output |
|---|---|---|---|
| 1. Brief | Agent, with Amit | Built into this workflow | Brief in the session note |
| 2. Research | `skills/research/` | Built | `content/ideas/YYYY-MM-DD-slug-research.md` |
| 3. Writing | `skills/writing/` | Built | `content/drafts/YYYY-MM-DD-slug.md` |
| 4. Visual | Not built yet | Manual: the draft's visual brief is the spec | Visual brief in the draft |
| 5. Quality check | `skills/editing/` | Built | Report plus updated draft status |
| 6. Package | Not built yet | Manual for now | See "Package" below |
| 7. Local web skin | Built | Open `index.html` | Local review UI with LinkedIn preview |

## Before you start

Check that these brand files have content. If any is empty, stop and fill it first.

- `brand/voice.md`
- `brand/audience.md`
- `brand/content-pillars.md`

Read `memory/agent-memory.md` for lessons from earlier posts.

## Step 1: Brief

Agree these four things with Amit. Ask only for what is missing, then record the answers in `memory/sessions/YYYY-MM-DD.md`.

1. **Topic or idea.** If none, the research skill proposes 5 ideas across the pillars.
2. **Pillar.** One from `brand/content-pillars.md`. Avoid repeating the previous post's pillar.
3. **Reader.** Developer, main contractor, facilities manager or consultant.
4. **CTA.** Request a site survey, download the checklist, or book a call. Default to the pillar's CTA.

Also confirm the format: text post or document carousel.

## Step 2: Research

Run the research skill with the brief. It saves a sourced brief to `content/ideas/`.

Gate: the brief has a recommended angle, and every claim has a source and a grade. Do not continue with grade C claims as facts.

## Step 3: Writing

Run the writing skill with the research brief. It saves a draft to `content/drafts/` with status `draft`.

Gate: the draft has a chosen hook, final copy, a CTA, a visual brief and review notes.

## Step 4: Visual (manual for now)

No visual skill exists yet. Use the draft's "Visual brief" section as the spec:

- Text post: no visual needed, or one annotated diagram (4:5 portrait).
- Carousel: slide copy is already in the draft. Build the slides in Canva or another design tool.
- Use diagrams and real project material over stock photos. Do not invent site photos.

Record in the draft whether a visual is done, pending or not needed.

## Step 5: Quality check

Run the editing skill on the draft. Handle the result:

| Result | Action |
|---|---|
| PASS | Status becomes `reviewed`. Go to Package. |
| FAIL: writing issue | Back to Step 3, with the notes. Keep the research. |
| FAIL: fact issue | Back to Step 2 for the failing claim only, then Step 3 to apply it. |
| FAIL: visual issue | Redo Step 4 only. |
| Brand violation (competitor, residential, price) | Rewrite the affected lines, then re-check. |

Stop after 3 failed loops and ask Amit for direction.

## Step 6: Package (manual for now)

Prepare a handoff for Amit's review. Put it at the top of the draft or in the session note:

- Final copy, ready to paste.
- First comment text and link, if any.
- Visual files or links, if any.
- Claims to verify, and any `[DEMO FIGURE]` placeholders used.
- Suggested posting day and time. This is a suggestion only.
- Reminder that staff can reshare with their own comment.

## Step 7: Local web skin

Open `index.html` in a browser (or serve the folder with `python3 -m http.server 8765`).

- Studio: LinkedIn company-page preview, hook fold, word count, copy for paste.
- Drafts: every file in `content/drafts/`.
- Assets: generated visuals plus `brand/design-references/`.
- Ideas: the 20-idea board.
- Pipeline: this workflow.

The page does not publish. "Mark reviewed" is local to the browser. After Amit posts, move the file to `content/published/` and update `ui/data.js` if the skin should show it.

## After Amit's review

1. Amit edits and approves. Only then does he post it himself.
2. Move the draft from `content/drafts/` to `content/published/` with the date and post URL, and set `status: published`.
3. Add one or two lessons to `memory/agent-memory.md` (what worked, what he changed, what to avoid).
4. After about a week, add the results to the published file so future posts can learn from them. Do not invent results.

## Rules for every run

- Follow `AGENTS.md`: no invented employers, metrics or authorship, no em dashes, nothing published without Amit's review.
- Placeholder figures only from `brand/audience.md`, tagged `[DEMO FIGURE]`.
- Never name competitors. Commercial and industrial only. No prices.
- Claims about regulations or warranty law stay flagged until a grade A source confirms them.
