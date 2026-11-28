# Feature illustrations

Use a short sequence of two or three steps where the reader benefits from seeing what changes. Start with simple UI shapes and add visible labels. Use a caption to connect the steps to the article. When the caption and step labels explain the entire visual, keep the SVG shapes hidden from assistive technology and leave the labels and caption readable.

## Style

Use the existing feature figure in `scripts/feature-figures.js`. Draw in a 160 by 90 viewBox and keep each step in its own tile so the sequence can wrap on phones. Use the site’s paper and wash tokens for surfaces, ink for outlines, focus for emphasis, and accent for the part that changes. Preserve enough contrast for outlines in light and dark modes. Reserve larger illustrations for an idea that needs more room.

Use inline SVG for themeable diagrams. CSS can add a brief, optional change in emphasis. GIFs can replay a fixed sequence but keep the colors they were exported with. A still illustration should tell the full story, including when reduced motion is on. The Atomic Design figure has a small hover effect that highlights the reused parts.

For the future typography feature, apply this same style to large text specimens. Compare the same words across font choice, text size, tracking, or kerning. Label the specific setting that changed and keep the text readable if it wraps. Use live HTML text for specimens so the site font and text controls still apply.

## Reusable prompt

> Read the article below. Suggest two places between sections where an illustration would help somebody understand a specific step or comparison. For each suggestion, name the paragraph or heading it follows, describe the idea in one sentence, and propose two or three clearly labeled visual steps. Use only scenarios supported by the article and preserve my first-person wording. Suggest a short visible caption. If the caption and labels fully explain the illustration, say that the SVG can be decorative. Otherwise give a concise text alternative. Prefer inline SVG with the site's existing light, dark, and accent tokens. If motion adds information, describe what moves and what the still version shows. For a typography example, use the same live words across specimens and change one setting at a time. Return the ideas for review before editing the article.
>
> Article draft: [paste here]

## Adding a figure

Register a figure in `scripts/feature-figures.js`, then put `[[illustration:your-key]]` on its own line in the Markdown. Preview the draft in the publishing studio and check it in the full page at a narrow viewport and in both color modes.
