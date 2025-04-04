import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonInput, IonButton, IonIcon, IonTitle, IonCardSubtitle, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, lockClosed, logInOutline, planetOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonTitle, IonSpinner, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
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

  login() {}
}
