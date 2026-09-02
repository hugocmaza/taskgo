import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
  IonMenuButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

interface Task {
  title: string;
  priority: 'alta' | 'media' | 'baja';
  done: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
    IonMenuButton,
  ],
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage {
  tasks: Task[] = [
    { title: 'Entregar informe', priority: 'alta', done: false },
    { title: 'Comprar materiales', priority: 'media', done: false },
    { title: 'Revisar mail', priority: 'baja', done: true },
  ];

  constructor() {
    addIcons({ add });
  }

  colorFor(priority: Task['priority']) {
    return priority === 'alta' ? 'danger' : priority === 'media' ? 'warning' : 'medium';
  }

  toggleDarkMode(event: CustomEvent) {
    document.body.classList.toggle('dark', (event as CustomEvent<{ checked: boolean }>).detail.checked);
  }
}
