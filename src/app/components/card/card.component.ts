import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonChip, IonIcon, IonButton, IonContent, IonModal, IonHeader, IonButtons, IonItem, IonToolbar, IonInput, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OsService } from 'src/app/services/os/os.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { calendar, addCircleOutline, documentOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { EventEmitter, Output } from '@angular/core';
import type { OverlayEventDetail } from '@ionic/core';
import localforage from 'localforage';
import { SyncService } from 'src/app/services/sync/sync.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonChip, IonIcon, IonButton, IonContent, IonModal, IonHeader, IonButtons, IonItem, IonToolbar, IonInput, IonLabel, DatePipe, FormsModule]
})
export class CardComponent implements OnInit {
  private authService = inject(AuthService);
  private osService = inject(OsService);
  private syncService = inject(SyncService);
  private toast = inject(ToastService);

  public userData: any;
  public user: { uid: string, email: string, idColaborador: number } = {
    uid: '',
    email: '',
    idColaborador: 0
  };
  public init_time_os: string = '';
  public finishDate: string = '';
  public isFinishedOffline: boolean = false;

  @Input() id_os: string = '';
  @Input() description: string = '';
  @Input() init_date: string = '';
  @Input() finish_date: string = '';
  @Input() status: string = '';
  @Input() colorStatus: string = '';

  @ViewChild(IonModal) modal!: IonModal;

  constructor() {
    addIcons({ calendar, addCircleOutline, documentOutline, closeOutline, checkmarkOutline });
  }

  async ngOnInit(): Promise<void> {
    this.userData = await this.authService.getUser();
    this.user.email = this.userData.email;
    this.user.idColaborador = this.userData.idColaborador;

    const pendentes = await localforage.getItem<any[]>('osPendentes') || [];
    this.isFinishedOffline = pendentes.some(os => os.id_os === this.id_os);
  }

  formatDate(date: Date): String {
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC'})
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.finishDate, 'confirm')
  }

  toUTCISOString(dateStr: string): string {
    const localDate = new Date(dateStr);
    const utc = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utc.toISOString();
  }

  async onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      const dadosFinalizacao = {
        id_os: this.id_os,
        mensagem: this.description,
        data_abertura: this.toUTCISOString(this.init_date),
        data_inicio: this.toUTCISOString(this.init_time_os),
        data_fechamento: this.toUTCISOString(this.finishDate),
        usuario: {
          email: this.user.email,
          idColaborador: this.user.idColaborador
        }
      };

      this.osService.postFinishOS(dadosFinalizacao).subscribe({
        next: () => {
          this.toast.show('Dado registrado!', 'success');
        },
        error: async () => {
          const pendentes = await localforage.getItem<any[]>('osPendentes') || [];
          const exist = pendentes.some(os => os.id_os === this.id_os);

          if (!exist) {
            await this.syncService.salvarFinalizacaoOffline(dadosFinalizacao);
            this.isFinishedOffline = true;
          }
        }
      });
    }
  }

}
