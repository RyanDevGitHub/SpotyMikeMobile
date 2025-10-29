import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Clean-SpotyMike',
  webDir: 'www', // ❌ RETRAIT DU BLOC DE PLUGINS INCORRECT

  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'Default',
      backgroundColor: '#00000000',
    },
    Keyboard: {
      resizeOnFullScreen: false,
    },
    EdgeToEdge: {
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
