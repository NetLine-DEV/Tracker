import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { SyncService } from './services/sync/sync.service';
import { Network } from '@capacitor/network';
import { ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private platform = inject(Platform);
  private syncService = inject(SyncService);
  private toast = inject(ToastService);

  async ngOnInit() {
    await this.platform.ready();
    await StatusBar.show();
    this.syncService.sincronizarFinalizacoes();

    Network.addListener('networkStatusChange', async status => {
      if (status.connected) {
        this.toast.show('Conexão restaurada. Sincronizando...', 'success');
        await this.syncService.sincronizarFinalizacoes();
      }
    });
  }
}
