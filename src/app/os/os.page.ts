import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel } from '@ionic/angular/standalone';
import { OsService } from '../services/os/os.service';
import { ToastService } from '../services/toast/toast.service';
import { Auth, onAuthStateChanged  } from '@angular/fire/auth';
import { AuthService } from '../services/auth/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { OS } from '../models/os.models';
import { Observable } from 'rxjs';
import { StorageService } from '../services/offline/storage.service';
import { IonList, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-os',
  templateUrl: './os.page.html',
  styleUrls: ['./os.page.scss'],
  standalone: true,
  imports: [CardComponent, IonContent, IonItem, IonLabel, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonList, CommonModule, FormsModule, NgFor]
})
export class OsPage implements OnInit {
  private osService: OsService = inject(OsService);
  private storageService: StorageService = inject(StorageService);
  private toast = inject(ToastService);
  private auth: Auth = inject(Auth);
  private authService: AuthService = inject(AuthService);
  private firestore = inject(Firestore);
  public listOS$: Observable<OS[]> = new Observable<OS[]>();
  public os: OS[] = [];
  public user: any;

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        this.user = await this.authService.getUser();
        await this.storageService.saveUser(this.user);
        this.fetchOS();
      } else {
        this.user = await this.storageService.getUser();
        if (!this.user) {
          console.error('[auth] Nenhum usuário no cache. Não é possível continuar.');
          return;
        }
        this.fetchOS();
      }
    });
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  fetchOS() {
    this.osService.getOSByUSer(this.user.idColaborador).subscribe({
      next: async (response: OS[]) => {
        this.os = response;
        await this.storageService.saveOS(response);
      },
      error: async (err) => {
        console.warn('[fetchOS] Erro na API. Buscando cache:', err);

        const cachedOS = await this.storageService.getOS();
        if (cachedOS.length > 0) {
          this.os = cachedOS;
        } else {
          console.error('[fetchOS] Nenhum dado no cache.');
        }
      }
    });
  }

  getColorStatus(status: string): string {
    switch(status) {
      case 'A': //Aberta
        return 'primary';
      case 'AN': //Análise
        return 'dark'
      case 'EN': //Encaminhada
        return 'medium';
      case 'AS': //Assumida
        return 'medium';
      case 'AG': //Agendada
        return 'warning';
      case 'DS': //Deslocamento
        return 'primary';
      case 'EX': //Execução
        return 'danger';
      case 'RAG': //Aguardando reagendamento
        return 'danger';
      default:
        return 'dark';
    }
  }

  getStatus(status: string): string {
    switch(status) {
      case 'A':
        return 'Aberta';
      case 'AN':
        return 'Análise'
      case 'EN':
        return 'Encaminhada';
      case 'AS':
        return 'Assumida';
      case 'AG':
        return 'Agendada';
      case 'DS':
        return 'Deslocamento';
      case 'EX':
        return 'Execução';
      case 'RAG':
        return 'Aguardando reagendamento';
      default:
        return 'dark';
    }
  }

  handleRefresh(event: CustomEvent) {
    this.osService.getOSByUSer(this.user.idColaborador).subscribe({
      next: async (response) => {
        this.os = response;
        await this.storageService.saveOS(response);
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: async (err) => {
        console.error('Erro ao recarregar OS:', err);

        const cachedOS = await this.storageService.getOS();
        this.os = cachedOS;

        (event.target as HTMLIonRefresherElement).complete();
      }
    });
  }

}
