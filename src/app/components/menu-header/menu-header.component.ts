import { Component, ChangeDetectorRef } from '@angular/core';
import {Recuperahorario} from '../utils/Recuperahorario';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NotaService } from '../../services/nota.service';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent {
  isAuth = false;
  horaAtual: string = '';
  gethoras = Recuperahorario
  nomeUsuarioHeader: string = '';

  constructor(
    private auth: Auth, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notaService: NotaService
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
    this.nomeUsuario();
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

  async nomeUsuario() {
    try {
      // Aguarda a resolução da Promise para pegar o nome do usuário
      const nome = await this.notaService.pegarNomeUsuario();
      console.log('Nome do usuário:', nome);
      this.nomeUsuarioHeader = nome;
      return nome;
    } catch (error) {
      console.error('Erro ao obter o nome do usuário:', error);
      return 'Erro ao obter nome';  // Retorna uma mensagem de erro, se necessário
    }
  }
  
}
