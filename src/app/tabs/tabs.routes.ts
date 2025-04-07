import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'os',
        loadComponent: () =>
          import('../os/os.page').then((m) => m.OsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/os',
        pathMatch: 'full',
      },
    ],
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
