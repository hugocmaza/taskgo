import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
  IonMenuButton, IonSpinner, IonText, IonChip, IonButton,
  IonRefresher, IonRefresherContent, IonItemSliding, IonItemOptions, IonItemOption,
  ModalController, createAnimation, Animation,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, cloudOfflineOutline, trash, checkmark } from 'ionicons/icons';

import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { StorageService } from '../services/storage.service';
import { TaskDetailComponent } from '../task-detail/task-detail.component';

// Animación de entrada del modal (slide-up + fade).
const enterAnimation = (baseEl: HTMLElement): Animation => {
  const root = baseEl.shadowRoot!;
  const backdrop = createAnimation()
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
  const wrapper = createAnimation()
    .addElement(root.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '0', transform: 'translateY(100%)' },
      { offset: 1, opacity: '1', transform: 'translateY(0)' },
    ]);
  return createAnimation().addElement(baseEl).easing('ease-out').duration(300).addAnimation([backdrop, wrapper]);
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonCheckbox, IonBadge, IonFab, IonFabButton, IonIcon, IonButtons, IonToggle,
    IonMenuButton, IonSpinner, IonText, IonChip, IonButton,
    IonRefresher, IonRefresherContent, IonItemSliding, IonItemOptions, IonItemOption,
  ],
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  private taskService = inject(TaskService);
  private storage = inject(StorageService);
  private modalCtrl = inject(ModalController);

  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  usandoCache = signal(false);

  constructor() {
    addIcons({ add, cloudOfflineOutline, trash, checkmark });
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
          this.storage.saveTasks(tasks);
          this.loading.set(false);
        },
        error: async () => {
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

  doRefresh(event: CustomEvent) {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => (event.target as HTMLIonRefresherElement).complete(),
    });
  }

  eliminar(task: Task) {
    this.tasks.update((list) => list.filter((t) => t.id !== task.id));
    if (task.id) this.taskService.deleteTask(task.id).subscribe({ error: () => {} });
  }

  completar(task: Task) {
    const actualizada = { ...task, done: !task.done };
    this.tasks.update((list) => list.map((t) => (t.id === task.id ? actualizada : t)));
    this.taskService.updateTask(actualizada).subscribe({ error: () => {} });
  }

  async abrirDetalle(task: Task) {
    const modal = await this.modalCtrl.create({
      component: TaskDetailComponent,
      componentProps: { task },
      enterAnimation,
    });
    await modal.present();
  }

  colorFor(priority: Task['priority']) {
    return priority === 'alta' ? 'danger' : priority === 'media' ? 'warning' : 'medium';
  }

  toggleDarkMode(event: CustomEvent) {
    document.body.classList.toggle('dark', (event as CustomEvent<{ checked: boolean }>).detail.checked);
  }
}
