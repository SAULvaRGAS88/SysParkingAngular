import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ColaboradorService } from '../services/colaborador.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: any = { email: '', senha: '' };

  constructor(
    private auth: Auth,
    private router: Router,
    private colaboradorService: ColaboradorService
  ) { }

  async onLogin() {
    const { email, senha } = this.usuario;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, senha);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        alert('Erro ao autenticar o usuário.');
        return;
      }

      if (firebaseUser.email === 'admin@admin.com') {
        alert('Bem-vindo, administrador!');
        this.router.navigate(['/dashboard']);
        return;
      }

      const colaboradores = await this.colaboradorService.getTodosColaboradores();

      const colaborador = colaboradores.find(c => c.uid === firebaseUser.uid);

      if (!colaborador) {
        alert('Usuário não encontrado.');
        return;
      }

      if (colaborador.tipoUsuario === 'usuario') {
        alert('Login realizado com sucesso!');
        this.router.navigate([`/estacionamento/${colaborador.idEstacionamento}`]);
      } else {
        alert('Tipo de usuário desconhecido.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      alert('Email ou senha inválidos.');
    }
  }
}
