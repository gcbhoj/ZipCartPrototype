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
  {
    path: 'transaction-history',
    loadComponent: () => import('./pages/transaction-history/transaction-history.page').then( m => m.TransactionHistoryPage)
  },
  {
    path: 'transaction-detail',
    loadComponent: () => import('./pages/transaction-detail/transaction-detail.page').then( m => m.TransactionDetailPage)
  },
  {
    path: 'qr',
    loadComponent: () => import('./pages/qr/qr.page').then( m => m.QrPage)
  },
  {
    path: 'insights',
    loadComponent: () => import('./pages/insights/insights.page').then( m => m.InsightsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
  path: 'email-verification',
  loadComponent: () =>
    import('./pages/email-verification/email-verification.page')
      .then(m => m.EmailVerificationPage)
},

{
  path: 'email-verification-success',
  loadComponent: () =>
    import('./pages/email-verification-success/email-verification-success.page')
      .then(m => m.EmailVerificationSuccessPage)
}
];
