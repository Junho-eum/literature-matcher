# RefCheck

An AI-powered reference validator for academic researchers. Upload your PDFs once, extract structured findings, and match them against your discussion sentences to find the best citation support — all backed by a persistent Supabase database.

---

## What It Does

RefCheck helps you answer: **"Which papers in my library best support this sentence?"**

You paste discussion sentences from your manuscript, and RefCheck scores every paper in your database (0–10) on how well it supports each sentence, with specific citation notes explaining how to use each paper.

---

## Features

- **One-time PDF extraction** — Upload a PDF once, Claude reads the full text and extracts structured findings. Saved to Supabase permanently. Never re-read the same PDF again.
- **Smart Extractor** — Uses Claude Sonnet to auto-generate citation keys, titles, authors, and year directly from any PDF — no filename matching needed.
- **Sentence-level matching** — Each discussion sentence gets an individual score and a citation note per paper.
- **Supabase backend** — Extracted findings persist across devices and browser sessions.
- **Abstract fallback** — Papers without uploaded PDFs can still be extracted from their abstracts.
- **CSV export** — Download extracted paper metadata as a CSV file.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| AI | Anthropic Claude API (Haiku + Sonnet) |
| Database | Supabase (Postgres) |
| Proxy | http-proxy-middleware (dev) |

---

## Project Structure

```
src/
├── App.js          # Main application component
├── supabase.js     # Supabase client initialization
├── index.js        # React entry point
├── index.css       # Global styles (light mode enforcement)
└── setupProxy.js   # Dev proxy for Anthropic API

public/
└── index.html      # App title and favicon
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/literature-matcher.git
cd literature-matcher
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run this SQL in the **SQL Editor**:

```sql
create table papers (
  id uuid default gen_random_uuid() primary key,
  citation_key text unique not null,
  title text,
  authors text[],
  year text,
  url text,
  findings jsonb,
  source text default 'abstract',
  extracted_at timestamp default now()
);

alter table papers enable row level security;

create policy "Allow all" on papers
  for all using (true) with check (true);
```

3. Go to **Project Settings → API** and copy your Project URL and anon key.

### 3. Configure environment variables

Create a `.env` file in the project root:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=your-anon-public-key
```

### 4. Start the app

```bash
npm start
```

Opens at `http://localhost:3000`.

---

## Usage

### Step 1 — API Key
Go to **① API Key** and enter your Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

### Step 2 — Extract PDFs
Two options:

- **② Upload PDFs** — Upload PDFs from your predefined paper list. Uses Claude Haiku. Auto-matches filename to paper metadata.
- **⑥ Smart Extract** — Upload any PDF. Uses Claude Sonnet. Auto-generates all metadata from the paper content itself.

Each PDF is read once and findings are saved to Supabase. You never need to re-upload the same PDF.

### Step 3 — Check your library
Go to **③ Library** to see all extracted papers, sample findings, and which papers haven't been extracted yet.

### Step 4 — Run analysis
Go to **④ Discussion**, paste the sentences from your manuscript that need citation support, and click **▶ Run Analysis**.

### Step 5 — Review results
Go to **⑤ Results** to see papers ranked by relevance with:
- Overall relevance score (0–10)
- Key findings from the paper
- Per-sentence match scores and citation notes
- **FULL EXTRACT** or **ABSTRACT** badge

---

## Rate Limits

The Anthropic free tier has token-per-minute limits:

| Model | Limit | Recommended wait |
|---|---|---|
| Claude Haiku | 50k tokens/min | 30s between PDFs |
| Claude Sonnet | 40k tokens/min | 60s between PDFs |

**Upload one PDF at a time** and wait for `✓ saved` before uploading the next.

---

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL |
| `REACT_APP_SUPABASE_KEY` | Your Supabase anon public key |

Your Anthropic API key is entered via the app UI and stored in browser localStorage — it is never hardcoded or committed to the repo.

---

## Deployment

### Build

```bash
npm run build
```

Creates an optimized bundle in `/build`.

### Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://your-username.github.io/literature-matcher",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

```bash
npm run deploy
```

> **Note:** For production deployment, move the Anthropic API proxy to a server-side function (Vercel Edge Functions, Netlify Functions, etc.) to avoid exposing your API key.

---

## Database Schema

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Auto-generated primary key |
| `citation_key` | text | Unique identifier (e.g. `harbachAcceptance2013`) |
| `title` | text | Full paper title |
| `authors` | text[] | Author list |
| `year` | text | Publication year |
| `url` | text | DOI or paper URL |
| `findings` | jsonb | Extracted findings JSON |
| `source` | text | `"pdf"` or `"abstract"` |
| `extracted_at` | timestamp | When extraction occurred |

---

## License

MIT
