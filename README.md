# Custom Project Manager

A simplified monday-style project manager designed to run directly on GitHub Pages.

## Included workspaces

- `CC LLC`
- `LAIRE`
- `OLLIE`

## Default workspace passwords

- `CC LLC`: `CCLLC2026`
- `LAIRE`: `LAIRE2026`
- `OLLIE`: `OLLIE2026`

Important: because this app is static and intended for GitHub Pages, these passwords are front-end only. They help with a basic entry screen, but they are not secure authentication.

## Features

- Workspace selection before entering the board
- Password prompt before entering each workspace
- Simplified board inspired by monday.com
- Editable status, owner, priority, due date, and notes
- Add and remove tasks
- Automatic browser storage per workspace with `localStorage`

## Publish on GitHub Pages

1. Create or use the GitHub repo: `samcbarth/customprojectmanager`
2. Upload these files to the root of the repo:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. In GitHub, open `Settings` -> `Pages`
4. Under `Build and deployment`, set:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
5. Save the settings
6. GitHub will publish the site at a URL similar to:
   - `https://samcbarth.github.io/customprojectmanager/`

## If you want real password protection

GitHub Pages cannot securely protect private workspace access by itself. For real login protection, move this project to a hosted app with a backend such as:

- Cloudflare Pages + password/auth layer
- Vercel + Next.js auth
- Firebase Hosting + Firebase Auth
- Netlify + Identity or edge middleware
