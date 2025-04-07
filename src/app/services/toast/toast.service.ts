import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastController = inject(ToastController);

  async show(message: string, color: 'success' | 'warning' | 'danger' | 'primary' = 'primary', duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
