import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  email:        string = '';
  password:     string = '';
  errorMessage: string = '';
  isDark:       boolean = false;

  totalTickets: number = 0;

  constructor(
    private authService:  AuthService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticketService.getAllTickets().subscribe({
      next: (data) => this.totalTickets = data.length,
      error: ()    => this.totalTickets = 0
    });
  }

  login(): void {
    this.errorMessage = '';
    this.authService.login({
      email:    this.email,
      password: this.password
    }).subscribe({
      next: (response: LoginResponse) => {
        console.log('==============================');
        console.log('Utilisateur connecté :', response.email);
        console.log('Role :', response.role);
        console.log('JWT Token :', response.token);
        console.log('==============================');

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (response.role === 'BUSINESS_ANALYST') {
          this.router.navigate(['/analyse-dashboard']);
        } else if (response.role === 'METIER') {
          this.router.navigate(['/metier']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Erreur login :', err);
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}