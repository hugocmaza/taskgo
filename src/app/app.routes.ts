import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: 'tareas', loadComponent: () => import('./task-list/task-list.page').then((m) => m.TaskListPage) },
      { path: 'estadisticas', loadComponent: () => import('./stats/stats.page').then((m) => m.StatsPage) },
      { path: 'perfil', loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage) },
      { path: '', redirectTo: 'tareas', pathMatch: 'full' },
    ],
  },
  {
    path: 'nueva',
    loadComponent: () => import('./task-form/task-form.page').then((m) => m.TaskFormPage),
  },
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
];
