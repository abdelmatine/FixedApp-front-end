import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'maps',
    loadComponent: () => import('./pages/maps/maps.page').then( m => m.MapsPage)
  },
  {
    path: 'prospection',
    loadComponent: () => import('./pages/prospection/prospection.page').then( m => m.ProspectionPage)
  },
  {
    path: 'activation',
    loadComponent: () => import('./pages/activation/activation.page').then( m => m.ActivationPage)
  },
  {
    path: 'reservation',
    loadComponent: () => import('./pages/reservation/reservation.page').then( m => m.ReservationPage)
  },
  {
    path: 'sla',
    loadComponent: () => import('./pages/sla/sla.page').then( m => m.SlaPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'validation',
    loadComponent: () => import('./pages/prospection/validation/validation.page').then( m => m.ValidationPage)
  },
];
