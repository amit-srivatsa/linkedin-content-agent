# Agent memory

Lessons from earlier posts and runs. Read before starting a post. Keep entries short, newest last.

## 2026-11-02: image generation with the Canva connector

- The Canva `generate-image` connector returns only a 161x200 preview to the agent. The signed URL returns 403 for larger sizes. Do not save the preview as the final image. Ask Amit to download the full file (1136x1408 for 4:5) from the "Open generated image" link, then check the pixel size with `sips -g pixelWidth -g pixelHeight` before calling it saved.
- The assembled prompt from the visual skill rendered all text correctly in one pass: headline, one highlighted word, clarifier line, CTA pill and the "Acme logo here" placeholder. Reuse that structure: short headline, one accent word, one clarifier, one CTA, placeholder logo, no other text.
