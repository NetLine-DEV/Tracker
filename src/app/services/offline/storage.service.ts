import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async saveUser(user: any) {
    await this._storage?.set('usuario', user);
  }

  async getUser(): Promise<any> {
    return (await this._storage?.get('usuario')) || null;
  }

  async saveOS(os: any[]) {
    await this._storage?.set('os', os);
  }

  async getOS(): Promise<any[]> {
    return (await this._storage?.get('os')) || [];
  }

  async addFinishOSPending(finish: any) {
    const pendings = await this._storage?.get('finsh_pendings') || [];
    pendings.push(finish);
    await this._storage?.set('finsh_pendings', pendings);
  }

  async getFinishOSPending(): Promise<any[]> {
    return (await this._storage?.get('finsh_pendings')) || [];
  }

  async clearFinishPendings() {
    this._storage?.remove('finsh_pendings');
  }

}
