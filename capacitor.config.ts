import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.netlinetelecom',
  appName: 'Tracker',
  webDir: 'www',
  plugins: {
    "StatusBar": {
      "overlaysWebView": false,
      "style": "DARK",
      "backgroundColor": "#00000000"
    }
  }
};

export default config;
