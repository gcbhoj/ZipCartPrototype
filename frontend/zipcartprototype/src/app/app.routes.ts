import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'testpage',
    loadComponent: () => import('./pages/test/testpage/testpage.page').then( m => m.TestpagePage)
  },
];
