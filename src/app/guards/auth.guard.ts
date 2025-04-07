import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth/auth.service';
import { User } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = await new Promise<User | null>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      unsubscribe();
      resolve(currentUser);
    });
  });

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const temPermissao = await authService.isAuthorizedTechnician();

  if (!temPermissao) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
