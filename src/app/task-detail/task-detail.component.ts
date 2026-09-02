import { Component, Input, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem,
  IonLabel, IonBadge, ModalController,
} from '@ionic/angular';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem,
    IonLabel, IonBadge,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Detalle</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>{{ task.title }}</h2>
      <ion-list>
        <ion-item>
          <ion-label>Prioridad</ion-label>
          <ion-badge slot="end">{{ task.priority }}</ion-badge>
        </ion-item>
        <ion-item>
          <ion-label>Vencimiento</ion-label>
          <ion-label slot="end">{{ task.dueDate }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Estado</ion-label>
          <ion-label slot="end">{{ task.done ? 'Completada' : 'Pendiente' }}</ion-label>
        </ion-item>
      </ion-list>
      @if (task.description) {
        <p class="ion-margin-top">{{ task.description }}</p>
      }
    </ion-content>
  `,
})
export class TaskDetailComponent {
  @Input() task!: Task;
  private modalCtrl = inject(ModalController);

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
