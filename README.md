# React Reel Studio

React Reel Studio is a browser-based content builder for creating polished React code reels for Instagram and other social platforms.

It provides a live preview, reusable content starters, syntax-highlighted code, multiple canvas layouts, and direct PNG export.

## Features

- Live reel preview with responsive scaling
- Four syntax themes: GitHub Dark, Nord, Dracula, and Vitesse Dark
- Feed canvas in 4:5 format (`1080 × 1350`)
- Reel canvas in 9:16 format (`1080 × 1920`)
- Three layouts:
  - Single code
  - Wrong vs. right comparison
  - Code with console output
- JavaScript JSX, JavaScript, TypeScript, and TypeScript JSX support
- Configurable line highlighting
- Built-in starters for wrong code, correct code, and effect cycles
- PNG export at the selected canvas dimensions

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Material UI
- Emotion
- Shiki
- html-to-image

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Usage

1. Choose a starter: **Wrong code**, **Correct code**, or **Effect cycle**.
2. Update the reel number, category, title, and subtitle.
3. Enter the code and select the language and syntax theme.
4. Add line numbers to highlight, then choose a layout.
5. Switch between **Feed** and **Reel** formats in the preview.
6. Select **Export PNG** to download the reel at `1080 × 1350` or `1080 × 1920`.

## Project Structure

```text
src/
  app/
    layout.tsx       # Root layout and Material UI provider
    page.tsx         # Reel editor and export UI
    page.module.css  # Workspace and canvas styles
    globals.css      # Global styles
public/              # Static assets
```

## Production Build

Create and run the production build:

```bash
npm run build
npm run start
```
