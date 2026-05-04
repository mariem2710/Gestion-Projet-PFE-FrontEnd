import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { MetierDashboardComponent } from './metier/metier-dashboard/metier-dashboard.component';
import { AnalyseDashboardComponent } from './analyse/analyse-dashboard/analyse-dashboard.component';
import { AnalyseTicketComponent } from './analyse/analyse-ticket/analyse-ticket.component';
import { DemandecompteComponent } from './app/demandecompte/demandecompte.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard, metierGuard } from './guards/role.guard';

export const routes: Routes = [

  // ── Routes publiques (sans garde) ────────────────
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: DemandecompteComponent },

  // ── Routes ADMIN uniquement ───────────────────────
  {
    path: 'admin-dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin-users',
    component: AdminUsersComponent,
    canActivate: [authGuard, adminGuard]
  },

  // ── Routes METIER + ADMIN ─────────────────────────
  {
    path: 'add-ticket',
    component: AddTicketComponent,
    canActivate: [authGuard, metierGuard]
  },
  {
    path: 'metier',
    component: MetierDashboardComponent,
    canActivate: [authGuard, metierGuard]
  },

  // ── Routes BUSINESS ANALYST + ADMIN ──────────────
  {
    path: 'analyse-dashboard',
    component: AnalyseDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'analyse-tickets',
    component: AnalyseTicketComponent,
    canActivate: [authGuard]
  },

  // ── Fallback ──────────────────────────────────────
  { path: '**', redirectTo: 'login' }
];