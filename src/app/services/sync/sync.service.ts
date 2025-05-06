import { Injectable, inject } from '@angular/core';
import localforage from 'localforage';
import { OsService } from '../os/os.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private osService = inject(OsService);

  async salvarFinalizacaoOffline(finalizacao: any) {
    const pendentes = (await localforage.getItem('osPendentes')) || [];
    const lista = Array.isArray(pendentes) ? [...pendentes, finalizacao] : [finalizacao];
    await localforage.setItem('osPendentes', lista);
  }

  async sincronizarFinalizacoes() {
    const status = await Network.getStatus();
    if (!status.connected) return;

    const pendentes = await localforage.getItem('osPendentes');
    if (Array.isArray(pendentes) && pendentes.length > 0) {
      for (const os of pendentes) {
        try {
          await this.osService.postFinishOS(os).toPromise();
        } catch (e) {
          console.warn('[Sync] Falha ao sincronizar:', os);
          continue;
        }
      }
      await localforage.removeItem('osPendentes');
    }
  }
}
