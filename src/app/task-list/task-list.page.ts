import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
  IonMenuButton, IonSpinner, IonText, IonChip, IonButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, cloudOfflineOutline } from 'ionicons/icons';

import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
    IonMenuButton, IonSpinner, IonText, IonChip, IonButton,
  ],
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  private taskService = inject(TaskService);
  private storage = inject(StorageService);

  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  usandoCache = signal(false);

  constructor() {
    addIcons({ add, cloudOfflineOutline });
  }

  ngOnInit() {
    this.cargarTareas();
  }

  async cargarTareas() {
    this.loading.set(true);
    this.error.set(null);
    this.usandoCache.set(false);

    if (await this.storage.isOnline()) {
      this.taskService.getTasks().subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.storage.saveTasks(tasks); // guardar la última lista en caché
          this.loading.set(false);
        },
        error: async () => {
          // fallback offline: mostrar la caché guardada
          this.tasks.set(await this.storage.loadTasks());
          this.usandoCache.set(true);
          this.error.set('Sin conexión: mostrando datos guardados');
          this.loading.set(false);
        },
      });
    } else {
      this.tasks.set(await this.storage.loadTasks());
      this.usandoCache.set(true);
      this.loading.set(false);
    }
  }

  colorFor(priority: Task['priority']) {
    return priority === 'alta' ? 'danger' : priority === 'media' ? 'warning' : 'medium';
  }

  toggleDarkMode(event: CustomEvent) {
    document.body.classList.toggle('dark', (event as CustomEvent<{ checked: boolean }>).detail.checked);
  }
}
