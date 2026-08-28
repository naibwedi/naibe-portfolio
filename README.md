# naibe-portfolio

Personal portfolio site for **Naibe Mehari Tekle** — Software Engineer.

🔗 **Live:** https://naibtech.dev

## Stack

Static single-page site — hand-written **HTML**, **CSS**, and vanilla **JavaScript**.
No framework, no build step. Deployed on Vercel.

- `index.html` — page structure and content
- `style.css` — all styling (dark theme, custom properties)
- `main.js` — particle background, scroll reveal, typed roles, project filter, nav state
- `gen-og.mjs` — generates the Open Graph preview image
- `Naibe-Mehari-CV.pdf` — downloadable CV

## Local preview

```bash
npx serve .
```

## Notes

- Animations respect `prefers-reduced-motion`.
- Custom cursor is disabled on touch / coarse-pointer devices.
