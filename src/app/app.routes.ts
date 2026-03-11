import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { DashboardPage } from './features/dashboard/dashboard-page/dashboard-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegisterPage } from './features/auth/register-page/register-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [{ path: '', component: DashboardPage }],
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard]
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
