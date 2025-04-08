import { initializeApp } from '@angular/fire/app';
import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private platform = inject(Platform);
  private toast = inject(ToastService);

  async initializeApp() {
    await this.platform.ready();
    this.toast.show('App Initialized', 'success');
  }

  async ngOnInit() {
    await this.platform.ready();
    await StatusBar.show();
  }
}
