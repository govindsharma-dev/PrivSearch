# PrivSearch

PrivSearch is a modern, privacy-respecting, local-first search engine desktop application and web interface powered by a local SearXNG backend instance.

---

## Requirements

- **Windows 10/11** (64-bit)
- **Node.js** (v20+ recommended)
- **Docker Desktop** (running, for local SearXNG backend)

---

## Start SearXNG

Before searching, start the local SearXNG Docker container:

```powershell
cd C:\Users\GameXspace\PrivSearch\searxng
docker compose up -d
```

Verify it is running by checking:
[http://127.0.0.1:8080](http://127.0.0.1:8080)

---

## Start Development Frontend (Web)

Run the Vite development server:

```powershell
cd C:\Users\GameXspace\PrivSearch\frontend
npm install
npm run dev
```

Then open your browser to:
[http://localhost:5173](http://localhost:5173)

---

## Start Development Desktop App (Electron)

To run the desktop application in live development mode:

```powershell
cd C:\Users\GameXspace\PrivSearch\frontend
npm run electron:dev
```

---

## Build Windows Application

To compile and package the production Windows desktop application:

```powershell
cd C:\Users\GameXspace\PrivSearch\frontend
npm install
npm run build
npm run electron:build
```

### Generated Executable Locations

Upon a successful build, the production Windows application files are output to:

1. **Root Directory `dist/`**:
   - `C:\Users\GameXspace\PrivSearch\dist\PrivSearch Setup.exe` (Windows NSIS installer)
   - `C:\Users\GameXspace\PrivSearch\dist\PrivSearch.exe` (Portable standalone executable)

2. **Frontend `release/` Directory**:
   - `C:\Users\GameXspace\PrivSearch\frontend\release\PrivSearch Setup.exe`
   - `C:\Users\GameXspace\PrivSearch\frontend\release\PrivSearch.exe`
   - `C:\Users\GameXspace\PrivSearch\frontend\release\win-unpacked\PrivSearch.exe` (Unpacked binary)

---

## Portable Mode

You can copy `PrivSearch.exe` to any folder, USB drive, or location on your Windows PC and launch it directly without installation.

> [!NOTE]
> **Docker & SearXNG Dependency:** PrivSearch uses a local-first search architecture. Ensure Docker Desktop is running with the SearXNG container (`docker compose up -d` in `searxng/`) for search queries. If the backend is stopped, the application displays a "PrivSearch backend is offline" banner with convenient **[Start Backend]** and **[Retry Connection]** actions.

---

## Downloadable Source Code ZIP

To package the complete project source code into a clean, distributable ZIP archive (omitting `node_modules`, `dist`, `.git`, temporary files, and secrets):

```powershell
cd C:\Users\GameXspace\PrivSearch\frontend
npm run package:source
```

The resulting archive is created at:
- `C:\Users\GameXspace\PrivSearch\PrivSearch-source.zip`
- `C:\Users\GameXspace\PrivSearch\frontend\PrivSearch-source.zip`

---

## Architecture & Security

```
PrivSearch Desktop (.exe / Portable / NSIS)
       ↓
Electron (main.ts + preload.ts)
  - Security: contextIsolation: true, nodeIntegration: false
  - External link handler (opens external websites in default browser)
  - Restricted IPC bridge: check backend status & trigger 'docker compose up -d'
       ↓
PrivSearch React Frontend (Vite build)
  - LocalStorage / IndexedDB settings persistence across app restarts
  - Offline backend detection banner
       ↓
Local SearXNG Backend (http://127.0.0.1:8080)
```

- **Electron Security**: Runs with `contextIsolation: true` and `nodeIntegration: false`. No Node.js APIs or arbitrary shell execution are exposed to renderer processes.
- **External Links**: Search results open safely in your default Windows web browser (Chrome, Edge, Firefox, etc.) without navigating the PrivSearch desktop app window away.
- **Settings Persistence**: Custom theme (Light/Dark/System), Accent colors, uploaded custom background images, SafeSearch, Language, and Search history persist across closing and reopening the desktop app.
