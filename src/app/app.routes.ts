import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tareas',
    loadComponent: () => import('./task-list/task-list.page').then((m) => m.TaskListPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
];
