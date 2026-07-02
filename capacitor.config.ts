import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.luxestate.app',
  appName: 'LuxEstate',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
