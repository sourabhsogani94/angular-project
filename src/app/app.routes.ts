import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { Profile } from './pages/profile/profile';

import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  // 🔥 NEW ROUTES
  { path: 'users', component: Users, canActivate: [authGuard, adminGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];