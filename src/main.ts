import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule, provideStorage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';

import { getApp } from 'firebase/app';
import { environment } from './environments/environment.prod';


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const app = getApp();
      return initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    }),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(IonicStorageModule.forRoot({
      name: 'database',
      driverOrder: [Drivers.IndexedDB]
    }))
  ],
});
