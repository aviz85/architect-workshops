# AVIZ Workshop Studio

Dynamic local app for managing `architect-workshops`.

## Run

```bash
cd workshop-studio
npm install
npm run dev
```

Open http://localhost:3017.

## What It Does

- Lists real workshops from `../workshops/*/workshop.md`
- Creates a new workshop folder and `workshop.md`
- Blocks Friday/Saturday creation unless explicit Dalit approval is checked
- Opens and saves existing workshop Markdown files
- Generates poster, slides, WhatsApp, and follow-up drafts through local API routes
- Serves AVIZ brand assets from `../brand/avatars`

## API

- `GET /api/workshops`
- `POST /api/workshops`
- `GET /api/workshops/:slug`
- `PUT /api/workshops/:slug`
- `POST /api/materials`
- `GET /api/brand/:file`
