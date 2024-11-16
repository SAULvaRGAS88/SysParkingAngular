import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: any = { email: '', senha: '' };

  constructor(private auth: Auth, private router: Router) {

  }

  onLogin() {
    const { email, senha } = this.usuario;
    signInWithEmailAndPassword(this.auth, email, senha)
      .then((userCredential) => {

        localStorage.setItem('user', JSON.stringify(userCredential.user));
        const user = userCredential.user;
        console.log("user", user);

        alert("Logado com sucesso");

        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorCode, errorMessage);
        alert("Email ou senha inválidos");
      });
    console.log('Email:', this.usuario.email);
    console.log('Senha:', this.usuario.senha);

  }
}
