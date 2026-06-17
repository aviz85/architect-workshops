---
name: contract-pdf
description: "Create branded Hebrew/RTL contract PDFs for Aviz. Use this whenever the user asks to create, draft, generate, brand, update, or export a contract/agreement/הסכם/חוזה as PDF, especially for workshops, lectures, consulting, AI services, quotes that need contractual terms, or client-facing legal-style documents. The skill gathers missing deal details, applies AVIZ branding, renders HTML to PDF, creates a preview image, and verifies the result before delivery."
---

# Contract PDF

Create branded Hebrew contract PDFs for Aviz - The Architect.

This skill captures the workflow proven in the example contract:

1. Draft a Hebrew RTL contract.
2. Apply AVIZ branding.
3. Render from HTML to PDF.
4. Create a preview image.
5. Visually verify the preview before giving the user the file.

## When to Use

Use this skill for:

- חוזה, הסכם, הסכם התקשרות, contract, agreement.
- Workshop, lecture, consulting, training, retainer, implementation, AI service agreements.
- Turning rough deal details into a polished PDF.
- Applying Aviz branding to an existing contract draft.
- Creating a demo/sample contract when the user explicitly says to invent details.

If the user asks for an invoice, use `morning-invoice` instead. If the user asks for a workshop summary PDF rather than a contract, use `workshop-pdf-summary`.

## Important Boundaries

- A contract can affect real money and obligations. If details are missing for a real client, ask for the minimum missing details before finalizing.
- If the user says this is only an example/demo, invented details are allowed, but mark the document clearly as "דוגמה בלבד".
- Do not send the PDF to a client or channel unless the user explicitly approves the final file.
- Do not save contracts to `~/sb`, because contracts may contain private/client data. Save to `~/Documents/contracts/`.
- This is not legal advice. Include a short disclaimer in demo drafts and when appropriate for first drafts.

## Required Inputs

For a real contract, collect or derive:

- Client: name/company, ID/ח.פ. if relevant, address, contact person, email/phone.
- Service: type, scope, deliverables, what is excluded.
- Logistics: date, time, location/Zoom, duration, participant count if relevant.
- Money: price, VAT, deposit, payment deadline, invoice terms.
- Cancellation/postponement terms.
- Rights: copyright, recordings, reuse, confidentiality.
- Signature names and dates.

If the user gives partial details, proceed only for non-critical gaps. Use reasonable placeholders such as `__________` for missing signature fields, but do not invent real client identifiers unless the user requested a demo.

## Date Safety

Before writing a weekday next to a specific date, verify it:

```bash
date -j -f '%Y-%m-%d' 'YYYY-MM-DD' '+%A'
```

Friday/Saturday require explicit approval for real scheduling. For demo documents, still avoid accidental weekday mismatches.

## Branding

Read `references/aviz-contract-brand.md` before styling the document.

Default brand:

- Name: `אביץ הארכיטקט` / `AVIZ - The Architect`
- Logo: `/Users/aviz/architect-workshops/brand/avatars/aviz-logo.png`
- Primary green: `#22C55E`
- Keep contracts clean and official. Use the logo, green accents, structured tables, and restrained typography. Do not use poster-style avatars unless the user explicitly wants a playful/marketing contract.

## HTML Requirements

Use HTML/CSS as the source format because it gives reliable Hebrew RTL rendering and a good PDF path.

Minimum document setup:

```html
<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 20mm 18mm; }
    html, body {
      direction: rtl;
      text-align: right;
      font-family: Arial, "Noto Sans Hebrew", "Noto Sans", sans-serif;
    }
    .ltr {
      direction: ltr;
      text-align: left;
      unicode-bidi: embed;
    }
  </style>
</head>
```

Use `dir="ltr"` or `.ltr` for email addresses, URLs, file paths, and English technical identifiers.

## Recommended Contract Structure

Use this structure unless the client context suggests otherwise:

1. כותרת: `הסכם התקשרות למתן שירותי ...`
2. Notice/disclaimer if draft/demo.
3. הצדדים להסכם.
4. מהות השירות והיקף העבודה.
5. מועד, אופן ביצוע ולוגיסטיקה.
6. תמורה ותנאי תשלום.
7. אחריות הצדדים.
8. ביטול או דחייה.
9. זכויות יוצרים ושימוש בחומרים.
10. סודיות.
11. שונות.
12. חתימות.

Keep clauses clear and practical. Aviz's client-facing tone is warm, professional, direct, and not coercive.

## Render Workflow

1. Create the HTML in `~/Documents/contracts/`.
2. Render it with the bundled script:

```bash
node /Users/aviz/architect-workshops/.codex/skills/contract-pdf/scripts/render-contract-pdf.mjs \
  --html /Users/aviz/Documents/contracts/contract.html \
  --pdf /Users/aviz/Documents/contracts/contract.pdf \
  --preview /Users/aviz/Documents/contracts/contract-preview.png
```

If Node cannot find Playwright, run with the bundled runtime:

```bash
NODE_PATH=/Users/aviz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
/Users/aviz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
/Users/aviz/architect-workshops/.codex/skills/contract-pdf/scripts/render-contract-pdf.mjs \
  --html /Users/aviz/Documents/contracts/contract.html \
  --pdf /Users/aviz/Documents/contracts/contract.pdf \
  --preview /Users/aviz/Documents/contracts/contract-preview.png
```

3. View the preview image before replying:

```bash
# Use the app's image viewer when available.
```

4. Run a quick PDF sanity check:

```bash
/Users/aviz/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 - <<'PY'
from pypdf import PdfReader
path = "/Users/aviz/Documents/contracts/contract.pdf"
reader = PdfReader(path)
text = "\n".join(page.extract_text() or "" for page in reader.pages)
print("pages:", len(reader.pages))
print("chars:", len(text))
PY
```

5. Return links to the PDF and HTML source.

## Visual Verification Checklist

Before final response:

- Hebrew reads right-to-left.
- Logo appears and is not stretched.
- Green accents are present but restrained.
- Tables are readable.
- No text is clipped or overlapping.
- Signature area appears clean.
- PDF has text and is not blank.
- If the file will be sent via WhatsApp or another channel, visually inspect the exact file/preview first.

## Output Policy

Final response should include:

- Link to the PDF.
- Link to the editable HTML source.
- Short note that visual/PDF sanity checks passed.
- Open loops: missing real client details, legal review needed, or user approval needed before sending.

