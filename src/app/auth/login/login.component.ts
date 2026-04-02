import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports:[FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
  this.authService.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: (user) => {

      console.log("Login success", user);

      // ✅ stocker aussi role (optionnel mais propre)
      localStorage.setItem('role', user.role);

      // 🔥 REDIRECTION SELON ROLE
      if (user.role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);

      } else if (user.role === 'BUSINESS_ANALYST') {
        this.router.navigate(['/ba-dashboard']);

      } else if (user.role === 'METIER') {
        this.router.navigate(['/metier']);

      } else {
        this.router.navigate(['/login']);
      }
    },
    error: () => {
      this.errorMessage = "Email ou mot de passe incorrect";
    }
  });
}
}