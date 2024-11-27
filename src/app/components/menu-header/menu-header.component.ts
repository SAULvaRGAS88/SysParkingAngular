import { Component, ChangeDetectorRef } from '@angular/core';
import {Recuperahorario} from '../utils/Recuperahorario';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent {
  isAuth = false;
  horaAtual: string = '';
  gethoras = Recuperahorario

  constructor(
    private auth: Auth, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

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

  ngOnInit() {
    this.atualizarHora();
  }

  /**Realiza o logout */
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

  /**Metodo para pegar a hora e ficar resnderizando sua mudança a cada segundo*/

  atualizarHora() {
    setInterval(() => {
      this.horaAtual = this.gethoras();
      this.cdr.detectChanges(); // Força a atualização
    }, 1000);

  }
}
