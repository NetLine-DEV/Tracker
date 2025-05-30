import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'os',
        loadComponent: () =>
          import('../os/os.page').then((m) => m.OsPage),
      },
      {
        path: '',
        redirectTo: 'os',
        pathMatch: 'full',
      },
    ],
  }
];
