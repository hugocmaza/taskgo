import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage) },
  { path: 'registro', loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage) },
  {
    path: '',
    canActivate: [authGuard],
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
    canActivate: [authGuard],
    loadComponent: () => import('./task-form/task-form.page').then((m) => m.TaskFormPage),
  },
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
];
