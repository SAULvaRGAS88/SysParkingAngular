import { Component } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent {
  isAuth = false;

  constructor(private auth: Auth, private router: Router) {

    this.isAuth = !!localStorage.getItem('credential');

    this.auth.onAuthStateChanged((user) => {
      this.isAuth = !!user;
      if (user) {
        localStorage.setItem('credential', JSON.stringify(user));
      } else {
        localStorage.removeItem('credential');
      }
    });
  }

  realizarLogOut() {
    signOut(this.auth)
      .then(() => {
        this.isAuth = false;
        localStorage.removeItem('credential');
        alert("Desconectado com sucesso");
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error("Erro ao desconectar:", error);
        alert("Erro ao desconectar");
      });
  }
}
