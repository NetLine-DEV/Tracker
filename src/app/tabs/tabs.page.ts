import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { construct, logOutOutline } from 'ionicons/icons';
import { ToastService } from '../services/toast/toast.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ construct, logOutOutline });
  }

  logout() {
    this.authService.logout()
    .then(() => {
      this.toast.show('Sucesso ao sair da aplicação', 'success');
    })
    .catch((error) => {
      this.toast.show('Erro ao sair da aplicação', 'danger');
    });
  }
}
