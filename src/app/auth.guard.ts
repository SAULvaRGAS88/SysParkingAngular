import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ColaboradorService } from './services/colaborador.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private colaboradorService: ColaboradorService,
    private router: Router
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      // Obtendo o UID do usuário logado (assumindo que está no localStorage)
      const user = JSON.parse(localStorage.getItem('credential') || '{}');
      const userId = user?.uid;

      // Verifica se o UID está presente
      if (!userId) {
        console.error('Usuário não autenticado');
        this.router.navigate(['/login']);
        return false;
      }

      // Obtém todos os colaboradores
      const colaboradores = await this.colaboradorService.getTodosColaboradores();

      // Filtra o colaborador com base no UID do usuário logado
      const colaborador = colaboradores.find(c => c.id === userId);

      if (colaborador) {
        if (colaborador.tipoUsuario === 'usuario') {
          // Permite acesso apenas à rota do estacionamento
          if (state.url.startsWith('/estacionamento')) {
            return true;
          }

          // Redireciona se tentar acessar rotas proibidas
          this.router.navigate(['/estacionamento']);
          return false;
        } else if (colaborador.tipoUsuario === 'administrador') {
          // Administradores têm acesso total
          return true;
        }
      }

      // Redireciona para login se o colaborador não existir ou não for autorizado
      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('Erro no AuthGuard:', error);
      // Em caso de erro, redireciona para login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
