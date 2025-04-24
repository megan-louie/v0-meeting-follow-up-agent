# GitHub Pages Deployment Guide

This document explains how to deploy the Meeting Follow-Up Agent to GitHub Pages.

## Automatic Deployment via GitHub Actions

This repository is configured to automatically deploy to GitHub Pages whenever you push to the main branch.

The deployment process is defined in `.github/workflows/deploy.yml` and includes:
1. Checking out the repository
2. Setting up Node.js
3. Installing dependencies
4. Building the application (static export)
5. Deploying to the gh-pages branch

## Manual Deployment

To deploy manually:

1. Build the static site:
   ```
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Important Configuration Files

The following files have been configured for GitHub Pages deployment:

1. **next.config.mjs**: 
   - Contains `output: 'export'` for static HTML export
   - Configures trailing slashes and other static hosting options

2. **package.json**:
   - Includes `deploy` script that uses `gh-pages` package
   - Adds an `.nojekyll` file to prevent Jekyll processing

3. **lib/static-api-mock.ts**:
   - Provides client-side implementations of API routes
   - Uses `localStorage` to save and retrieve data
   - Gracefully falls back to mock data when needed

## How It Works

Since GitHub Pages only supports static hosting (no server-side code), the application has been modified to:

1. Detect when it's running on GitHub Pages (`window.location.hostname.includes('github.io')`)
2. Use client-side implementations of API routes in `lib/static-api-mock.ts`
3. Store processed data in browser's localStorage
4. Process transcripts directly in the browser using the same Gemini API

## Updating the Repository URL

After hosting on your own GitHub account, you need to update:

1. The `basePath` in `next.config.mjs` (uncomment and set to your repository name)
2. The demo URL in `README.md`

## Troubleshooting

If you encounter deployment issues:

1. Check GitHub Actions tab for error details
2. Ensure your repository has GitHub Pages enabled (Settings → Pages)
3. Make sure the `gh-pages` branch is set as the source for GitHub Pages
4. Check browser console for errors when running the deployed site