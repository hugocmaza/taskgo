import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonButton, IonText,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonText,
  ],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = '';
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error = '';
    try {
      const { email, password } = this.form.value;
      // register() ya persiste el token -> queda logueado automáticamente.
      await this.auth.register(email!, password!);
      this.router.navigate(['/tareas']);
    } catch {
      this.error = 'No se pudo crear la cuenta (¿el email ya existe?).';
    }
  }
}
