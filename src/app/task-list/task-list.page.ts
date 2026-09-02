import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
  IonMenuButton, IonSpinner, IonText,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { catchError, finalize, of } from 'rxjs';

import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
    IonMenuButton, IonSpinner, IonText,
  ],
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  private taskService = inject(TaskService);

  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
    this.taskService.getTasks().pipe(
      catchError(() => {
        this.error.set('No se pudieron cargar las tareas');
        return of([]);
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe((tasks) => this.tasks.set(tasks));
  }

  colorFor(priority: Task['priority']) {
    return priority === 'alta' ? 'danger' : priority === 'media' ? 'warning' : 'medium';
  }

  toggleDarkMode(event: CustomEvent) {
    document.body.classList.toggle('dark', (event as CustomEvent<{ checked: boolean }>).detail.checked);
  }
}
