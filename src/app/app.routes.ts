import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { DashboardPage } from './features/dashboard/dashboard-page/dashboard-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegisterPage } from './features/auth/register-page/register-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPage,
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
