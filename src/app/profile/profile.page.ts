import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton,
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Perfil del usuario (pantalla de ejemplo).</p>
      <ion-button expand="block" color="danger" (click)="cerrarSesion()">Cerrar sesión</ion-button>
    </ion-content>
  `,
})
export class ProfilePage {
  private auth = inject(AuthService);
  private router = inject(Router);

  async cerrarSesion() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
