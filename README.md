# 🔎 PrivSearch

> **Search privately. Discover freely.**

PrivSearch is a privacy-focused, local-first search engine interface powered by **SearXNG**.

It provides a clean search experience while keeping the search backend running locally on your computer.

![PrivSearch](frontend/src/assets/hero.png)

---

## ✨ Features

- 🔍 Web search
- 🖼️ Image search
- 🎥 Video search
- 📰 News search
- 🗺️ Maps search
- 🎵 Music search
- 🔬 Science search
- 📁 Files search
- 🌓 Light / Dark / System theme
- 🎨 Custom accent colors
- 🖼️ Custom background image
- 🔐 SafeSearch controls
- 💾 Persistent settings
- 📝 Search history
- 🐳 Local SearXNG backend
- 🖥️ Windows desktop application
- 📦 Portable Windows executable
- 🌐 Web development mode
- 🔒 Local-first architecture

---

# 🚀 Quick Start

There are **two parts** to PrivSearch:

```text
PrivSearch
│
├── Frontend
│   └── React + TypeScript + Vite
│
└── Backend
    └── SearXNG + Docker
```

You need both parts running when using the development version.

---

# 🪟 Windows Installation

## Step 1 — Install the requirements

Before starting, install:

### 1. Node.js

Download Node.js from:

https://nodejs.org/

After installing, check:

```cmd
node --version
```

and:

```cmd
npm --version
```

Node.js 20+ is recommended.

---

### 2. Docker Desktop

Download Docker Desktop:

https://www.docker.com/products/docker-desktop/

Install it and make sure Docker Desktop is running.

Check:

```cmd
docker --version
```

and:

```cmd
docker compose version
```

---

# 📥 Step 2 — Download PrivSearch

Clone the repository:

```cmd
git clone https://github.com/govindofficial727-afk/PrivSearch.git
```

Enter the project:

```cmd
cd PrivSearch
```

---

# 🐳 Step 3 — Start the Search Backend

Open CMD inside the PrivSearch folder.

Run:

```cmd
cd searxng
docker compose up -d
```

Wait for Docker to start the SearXNG backend.

You can check it by opening:

http://127.0.0.1:8080

If SearXNG opens, the backend is working.

---

# 💻 Step 4 — Start PrivSearch

Open another CMD window.

Go to:

```cmd
cd PrivSearch\frontend
```

Install the frontend dependencies:

```cmd
npm install
```

Start PrivSearch:

```cmd
npm run dev
```

You should see something similar to:

```text
Local: http://localhost:5173/
```

Open:

http://localhost:5173/

🎉 PrivSearch is now running.

---

# 🔎 Step 5 — Search

Enter something such as:

```text
Python
```

and press **Search**.

PrivSearch sends the request to your local SearXNG backend.

The general flow is:

```text
You
 ↓
PrivSearch UI
 ↓
Local API
 ↓
SearXNG
 ↓
Search engines
 ↓
Results
 ↓
PrivSearch
```

---

# 🖼️ Image Search

Use the **Images** category to search for images.

For example:

```text
Python
```

Then select:

**Images**

The frontend requests image results from SearXNG and displays them in the image-results interface.

---

# ⚙️ Settings

Open:

```text
Settings
```

PrivSearch supports configurable options such as:

- Light mode
- Dark mode
- System theme
- Accent color
- SafeSearch
- Language
- Search preferences
- Custom background image
- Search history

Settings are stored locally in the application/browser storage.

---

# 🖼️ Custom Background

PrivSearch supports a custom background image.

Open:

```text
Settings → Appearance
```

Choose the background image option and select an image from your computer.

The selected background is stored locally so that it can remain available when PrivSearch is opened again.

---

# 🌙 Dark Mode

Open:

```text
Settings → Appearance
```

Choose:

```text
Dark
```

You can also use:

```text
Light
```

or:

```text
System
```

---

# 🛑 How to Stop PrivSearch

If you started the frontend with:

```cmd
npm run dev
```

press:

```text
Ctrl + C
```

in that CMD window.

To stop the SearXNG backend:

```cmd
cd PrivSearch\searxng
docker compose down
```

---

# 🔄 How to Start It Again

Every time you want to use the development version:

### Terminal 1

```cmd
cd PrivSearch\searxng
docker compose up -d
```

### Terminal 2

```cmd
cd PrivSearch\frontend
npm run dev
```

Then open:

http://localhost:5173/

---

# 🖥️ Desktop Application

PrivSearch also contains an Electron desktop application.

Start the desktop development version:

```cmd
cd PrivSearch\frontend
npm run electron:dev
```

This opens PrivSearch as a Windows desktop application.

---

# 📦 Build the Windows Application

To create a Windows application:

```cmd
cd PrivSearch\frontend
npm install
npm run build
npm run electron:build
```

After a successful build, Electron generates Windows application files.

Depending on the build configuration, these can include:

```text
PrivSearch Setup.exe
PrivSearch.exe
```

The installer can be used to install PrivSearch on Windows.

The portable executable can be copied to another location and launched directly.

---

# 🧩 Project Structure

```text
PrivSearch/
│
├── frontend/
│   │
│   ├── electron/
│   │   ├── main.ts
│   │   └── preload.ts
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── searxng/
│   ├── core-config/
│   ├── .env.example
│   └── docker-compose.yml
│
├── .gitignore
└── README.md
```

---

# 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Desktop | Electron |
| Search Backend | SearXNG |
| Backend Runtime | Docker |
| Storage | Browser Local Storage / IndexedDB |

---

# 🔐 Privacy Architecture

PrivSearch is designed around a local-first architecture.

```text
┌──────────────────────────────┐
│        PrivSearch UI         │
│      React + TypeScript      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Local API Proxy        │
│       Vite / Electron        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Local SearXNG          │
│      127.0.0.1:8080         │
└──────────────┬───────────────┘
               │
               ▼
        Search providers
```

PrivSearch does not require a PrivSearch account to use the local interface.

---

# 🛠️ Troubleshooting

## `localhost:5173` does not open

Make sure the frontend server is running:

```cmd
cd PrivSearch\frontend
npm run dev
```

Then open:

http://localhost:5173/

---

## Search does not work

Check that Docker is running.

Then:

```cmd
cd PrivSearch\searxng
docker compose up -d
```

Open:

http://127.0.0.1:8080

If SearXNG is unavailable, PrivSearch cannot retrieve search results.

---

## `npm` is not recognized

Install Node.js:

https://nodejs.org/

Then close and reopen CMD.

Check:

```cmd
node --version
npm --version
```

---

## Docker is not recognized

Install Docker Desktop:

https://www.docker.com/products/docker-desktop/

Restart Docker Desktop and try again.

---

## Port 5173 is already being used

Vite may automatically select another available port.

Check the terminal output for:

```text
Local:
```

and open the address shown there.

---

# 🧑‍💻 Development

Clone the project:

```cmd
git clone https://github.com/govindofficial727-afk/PrivSearch.git
cd PrivSearch
```

Start the backend:

```cmd
cd searxng
docker compose up -d
```

Start the frontend:

```cmd
cd ..\frontend
npm install
npm run dev
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a branch:

```cmd
git checkout -b feature/my-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes:

```cmd
git add .
git commit -m "Add my feature"
```

6. Push your branch:

```cmd
git push origin feature/my-feature
```

7. Open a Pull Request on GitHub.

---

# 🗺️ Roadmap

- [x] Local SearXNG integration
- [x] React frontend
- [x] Web search
- [x] Image search interface
- [x] Settings
- [x] Light / Dark theme
- [x] Custom backgrounds
- [x] Electron desktop application
- [x] Windows packaging
- [ ] Improve image-search experience
- [ ] More search categories
- [ ] Better result filtering
- [ ] Additional desktop features
- [ ] More operating-system support

---

# 📸 Screenshots

Screenshots and demo media can be added here as the project evolves.

---

# 📄 License

Add your chosen open-source license before treating this project as formally licensed for reuse.

---

# 👨‍💻 Author

**Govind Sharma**

GitHub:

https://github.com/govindofficial727-afk

---

# ⭐ Support the Project

If you find PrivSearch useful:

⭐ Star the repository  
🐛 Report bugs through Issues  
💡 Suggest improvements  
🤝 Contribute code

---

**PrivSearch — Search privately. Discover freely.**