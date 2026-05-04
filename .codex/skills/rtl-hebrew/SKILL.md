---
name: rtl-hebrew
description: "Use when creating Hebrew or mixed Hebrew/English content, Markdown, HTML, slides, landing pages, PDFs or workshop materials that need correct RTL layout."
---

# RTL Hebrew

Use this skill whenever the output contains meaningful Hebrew text and will be read as a document, page, slide, PDF, social post or workshop asset.

## Core Rule

Hebrew content should be explicitly marked RTL. Do not rely on the viewer to infer direction.

## Markdown

For Markdown files that will be rendered in GitHub, Obsidian or a browser, wrap long Hebrew sections in:

```html
<div dir="rtl" lang="he">

תוכן בעברית...

</div>
```

For short tables, prefer an HTML table inside the RTL wrapper when normal Markdown table rendering becomes visually confusing.

## HTML / Web

Set document-level direction:

```html
<html lang="he" dir="rtl">
```

Set CSS defaults:

```css
body {
  direction: rtl;
  text-align: right;
}

:where(code, pre, kbd, samp, .ltr) {
  direction: ltr;
  text-align: left;
}
```

Use `dir="ltr"` for code blocks, URLs, commands, emails, file paths and technical identifiers.

## Slides / Presentations

Every Hebrew slide should specify:

```markdown
**Language:** Hebrew
**Direction:** RTL - content flows right to left
```

Layout rules:
- Title aligned right.
- Primary visual can sit left or full-bleed.
- Numbered steps flow from right to left.
- Code snippets stay LTR.

## PDFs / Documents

Use HTML/CSS or a renderer that supports Hebrew shaping and RTL. Always render and visually verify the final output.

Minimum CSS:

```css
html {
  direction: rtl;
}

body {
  font-family: "Arial", "Noto Sans Hebrew", sans-serif;
  text-align: right;
}
```

## Chat Output

When replying in Hebrew, write normal Hebrew prose. If providing a copy-paste artifact that may render incorrectly, include RTL wrappers in the artifact itself.

## Verification

Before finishing a Hebrew visual/document artifact, check:
- Hebrew reads right to left.
- Numbers and English terms appear in the intended order.
- Tables are not visually reversed in a confusing way.
- Code/URLs remain LTR.
- Text does not overlap or get clipped.

