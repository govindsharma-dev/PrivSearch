import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import http from 'http';

const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
const BACKEND_URL = 'http://127.0.0.1:8080';
const BACKEND_DIR = 'C:\\Users\\GameXspace\\PrivSearch\\searxng';

let mainWindow: BrowserWindow | null = null;

function checkSearxngAlive(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/search?q=test&format=json`, { timeout: 3000 }, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on('error', () => {
      resolve(false);
    });
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 880,
    minWidth: 840,
    minHeight: 600,
    title: 'PrivSearch',
    backgroundColor: '#ffffff',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Inject permissive CORS for local SearXNG requests in the desktop app
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.startsWith(BACKEND_URL)) {
      const responseHeaders = { ...details.responseHeaders };
      responseHeaders['Access-Control-Allow-Origin'] = ['*'];
      responseHeaders['Access-Control-Allow-Methods'] = ['GET, POST, OPTIONS'];
      responseHeaders['Access-Control-Allow-Headers'] = ['*'];
      callback({ responseHeaders });
    } else {
      callback({ responseHeaders: details.responseHeaders });
    }
  });

  // Open search result external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (!url.startsWith('http://localhost:5173') && !url.startsWith('http://127.0.0.1:5173')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  // Intercept navigation away from PrivSearch to prevent taking over window
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isDevUrl = url.startsWith('http://localhost:5173') || url.startsWith('http://127.0.0.1:5173');
    const isFileUrl = url.startsWith('file://');
    if (!isDevUrl && !isFileUrl) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // In production, load the built index.html from dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Secure IPC handlers
ipcMain.handle('searxng:check', async () => {
  return await checkSearxngAlive();
});

ipcMain.handle('searxng:getUrl', () => {
  return BACKEND_URL;
});

ipcMain.handle('searxng:start', async () => {
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    // Strictly restricted hardcoded command only. No arbitrary arguments from renderer.
    exec('docker compose up -d', { cwd: BACKEND_DIR, timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, message: error.message || stderr });
      } else {
        resolve({ success: true, message: stdout });
      }
    });
  });
});

ipcMain.handle('shell:openExternal', async (_event, url: unknown) => {
  if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'))) {
    await shell.openExternal(url);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
