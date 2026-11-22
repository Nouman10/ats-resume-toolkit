# ATS Resume Keyword & Score Checker

A free, private, browser-based tool that estimates how machine-readable a resume is
against a specific job description. Paste a job posting and a resume, get a keyword
coverage score, formatting audit, and section checklist.

**No backend. No accounts. No analytics. Resume text never leaves the browser.**

Built and hosted for $0 with static HTML, vanilla JavaScript, Tailwind CDN, and
GitHub Pages.

## Files

- `index.html` — the complete app (HTML + Tailwind + vanilla JS)
- `tests/scoring.test.js` — dependency-free scoring regression tests

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Test

```bash
node tests/scoring.test.js
```

## Scoring model

- Keyword coverage (60%): weighted unigram/bigram matching against the posting
- ATS-safe formatting (25%): table artifacts, bullets, glyphs, word count, contact details
- Complete sections (15%): summary, experience, education, skills, contact

The score is an estimate of machine readability, not a judgment of candidate quality.

## License

Free to use. The downloadable premium template bundle is sold separately.
