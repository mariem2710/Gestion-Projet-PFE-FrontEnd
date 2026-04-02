import { Routes } from '@angular/router';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { BaDashboardComponent } from './ba/ba-dashboard/ba-dashboard.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { MetierDashboardComponent } from './metier/metier-dashboard/metier-dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'admin-dashboard', component: DashboardComponent },
  { path: 'ba-dashboard', component: BaDashboardComponent },
  { path: 'add-ticket', component: AddTicketComponent },

  { path: 'ma-metier', component: MetierDashboardComponent },

];