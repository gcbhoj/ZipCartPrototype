import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'testpage',
    loadComponent: () =>
      import('./pages/test/testpage/testpage.page').then((m) => m.TestpagePage),
  },
  {
    path: 'scanitems',
    loadComponent: () =>
      import('./pages/scanitems/scanitems.page').then((m) => m.ScanitemsPage),
  },
  {
    path: 'fruits-and-veg',
    loadComponent: () =>
      import('./pages/fruits-and-veg/fruits-and-veg.page').then(
        (m) => m.FruitsAndVegPage,
      ),
  },
];
