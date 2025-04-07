import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonList, IonItem, IonInput, IonButton, IonIcon, IonTitle, IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { ToastService } from '../services/toast/toast.service';
import { addIcons } from 'ionicons';
import { eye, eyeOff, lockClosed, logInOutline, planetOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonTitle, IonSpinner, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage {
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private toast = inject(ToastService);
  private router = inject(Router);
  public showPassword: boolean = false;
  public loading: boolean = false;

  constructor() {
    addIcons({ lockClosed, eye, eyeOff, logInOutline, planetOutline })
  }

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.form.invalid) {
      this.toast.show('Dados inválidos.', 'danger');
      return;
    }

    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password)
    .then(() => {
      this.form.reset();
      this.toast.show('Login realizado com sucesso!', 'success');
      this.router.navigate(['/tabs/list-os']);
    })
    .catch((error) => {
      this.toast.show('Dados inválidos.', 'danger');
    })
    .finally(() => {
      this.loading = false;
    })
  }
}
