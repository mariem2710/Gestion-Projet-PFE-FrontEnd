import { Component } from '@angular/core';
import { AdminUsersComponent } from '../admin-users/admin-users.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminUsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}