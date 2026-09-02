import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Guard funcional: permite la ruta si hay sesión; si no, redirige a /login.
 * Aplicar con: { path: '...', canActivate: [authGuard], ... }
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
