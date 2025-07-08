# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Link Saver Progressive Web App (PWA) that allows users to save and manage links locally with offline support. The project currently has two separate implementations that need to be integrated:

1. **Traditional PWA** - A standalone HTML/JS implementation with service worker and IndexedDB
2. **Next.js App** - A modern React framework setup that hasn't been connected to the PWA features yet

## Development Commands

```bash
# Next.js development (runs on http://localhost:3000)
npm run dev

# Build Next.js for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Serve static PWA files (runs on http://localhost:8000)
python3 serve.py

# Generate PWA icons
python3 generate-icons.py
```

## Architecture

### Current State
The project has two disconnected parts:

1. **Next.js Application**:
   - Standard Next.js 15 app with TypeScript
   - Uses App Router and Tailwind CSS v4
   - No PWA functionality integrated yet

### PWA Features
- **Share Target**: Can receive shared links from other apps via Web Share API
- **Offline Storage**: Uses IndexedDB to store links locally
- **Offline Support**: Service worker caches app resources
- **Link Management**: Save, view, and delete links with custom titles

### Key Technical Details
- The manifest.json configures the app as "Link Saver PWA" with share target capability
- Service worker implements cache-first strategy (cache version: my-pwa-v1)
- IndexedDB database: "LinkSaverDB" with "links" object store
- Links have: id, title, url, timestamp, synced, visited fields
- Share parameters: title, text, url (received via GET params)

## Important Notes

- The static PWA and Next.js app are not integrated - they run on different ports
- To test the full PWA functionality, use `python3 serve.py` and visit http://localhost:8000
- The service worker in the static version references files that don't exist in Next.js
- Future work should integrate PWA features into Next.js using next-pwa or similar