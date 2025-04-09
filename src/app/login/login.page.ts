import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonList, IonItem, IonInput, IonButton, IonIcon, IonTitle, IonText, IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, lockClosed, logInOutline, planetOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonTitle, IonSpinner, IonText, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage {
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  public showPassword: boolean = false;
  public loading: boolean = false;
  public loginError: boolean = false;

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
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password)
    .then(() => {
      this.router.navigate(['/tabs/os']);
      this.form.reset();
    })
    .catch((error) => {
      this.loginError = true;
    })
    .finally(() => {
      this.loading = false;
    })
  }
}
