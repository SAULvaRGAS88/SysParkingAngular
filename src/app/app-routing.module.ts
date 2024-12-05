import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { EstacionamentoComponent } from './estacionemento/estacionemento.component';
import { EstacionamentoSelecionadoComponent } from './estacionemento/estacionamento-selecionado/estacionamento-selecionado.component';
import { NotaComponent } from './nota/nota.component';
import { TabelaPrecoComponent } from './tabela-preco/tabela-preco.component';
import { AuthGuard } from './auth.guard';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'relatorios', component: RelatoriosComponent, canActivate: [AuthGuardService] },
  { path: 'estacionamento', component: EstacionamentoComponent, canActivate: [AuthGuardService] },
  { path: 'estacionamento/:id', component: EstacionamentoSelecionadoComponent,},
  { path: 'nota/:id', component: NotaComponent},
  { path: 'colaboradores', component: ColaboradoresComponent, canActivate: [AuthGuardService] },
  { path: 'tabela-precos/:id', component: TabelaPrecoComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
