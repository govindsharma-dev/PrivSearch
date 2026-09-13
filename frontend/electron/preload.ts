import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  isElectron: boolean;
  checkBackend: () => Promise<boolean>;
  startBackend: () => Promise<{ success: boolean; message?: string }>;
  openExternal: (url: string) => Promise<void>;
  getBackendUrl: () => Promise<string>;
}

const api: ElectronAPI = {
  isElectron: true,
  checkBackend: async (): Promise<boolean> => {
    return ipcRenderer.invoke('searxng:check');
  },
  startBackend: async (): Promise<{ success: boolean; message?: string }> => {
    return ipcRenderer.invoke('searxng:start');
  },
  openExternal: async (url: string): Promise<void> => {
    return ipcRenderer.invoke('shell:openExternal', url);
  },
  getBackendUrl: async (): Promise<string> => {
    return ipcRenderer.invoke('searxng:getUrl');
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
