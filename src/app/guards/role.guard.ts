import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getRole() === 'ADMIN') return true;
  router.navigate(['/login']);
  return false;
};

export const metierGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getRole();

  if (role === 'METIER' || role === 'ADMIN') return true;
  router.navigate(['/login']);
  return false;
};

export const analysteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getRole();

  if (role === 'BUSINESS_ANALYST' || role === 'ADMIN') return true;
  router.navigate(['/login']);
  return false;
};