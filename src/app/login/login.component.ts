import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onLogin() {
    if(this.email === 'admin@admin.com' || this.password === '123456') {
      window.location.href = '/dashboard';
    }
    // Lógica de autenticação aqui
    console.log('Email:', this.email);
    console.log('Senha:', this.password);

  }
}
