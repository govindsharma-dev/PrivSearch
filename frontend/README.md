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

---

## Downloadable Source Code ZIP

To package the complete project source code into a clean, distributable ZIP archive:

```powershell
cd C:\Users\GameXspace\PrivSearch\frontend
npm run package:source
```

The resulting archive is created at:
- `C:\Users\GameXspace\PrivSearch\PrivSearch-source.zip`
- `C:\Users\GameXspace\PrivSearch\frontend\PrivSearch-source.zip`
