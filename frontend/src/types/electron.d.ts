export interface ElectronAPI {
  isElectron: boolean;
  checkBackend: () => Promise<boolean>;
  startBackend: () => Promise<{ success: boolean; message?: string }>;
  openExternal: (url: string) => Promise<void>;
  getBackendUrl: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
