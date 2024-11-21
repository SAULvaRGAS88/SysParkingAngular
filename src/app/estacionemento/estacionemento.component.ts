import { Component, OnInit } from '@angular/core';
import { Estacionamento } from '../models/estacionamento.model';
import { EstacionamentoService } from '../services/estacionamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estacionamento',
  templateUrl: './estacionemento.component.html',
  styleUrls: ['./estacionemento.component.css'],
})
export class EstacionamentoComponent implements OnInit {
  estacionamentos: Estacionamento[] = [];
  novoEstacionamento: Estacionamento = {
    nome: '',
    endereco: '',
    numeroVagasDisponiveis: 0,
  };
  editandoEstacionamento: Estacionamento | null = null;

  constructor(
    private estacionamentoService: EstacionamentoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listarEstacionamentos();
  }

  // Listar todos os estacionamentos
  listarEstacionamentos(): void {
    this.estacionamentoService.getEstacionamentos()
      .then(estacionamentos => {
        console.log('Lista de estacionamentos:', estacionamentos);
        this.estacionamentos = estacionamentos;
      })
      .catch(error => {
        console.error('Erro ao carregar estacionamentos:', error);
      });
  }

  // Adicionar estacionamento COMPONENTE
  adicionarEstacionamento(): void {
    this.estacionamentoService
      .addEstacionamento(this.novoEstacionamento)
      .then(() => {
        this.snackBar.open('Estacionamento adicionado com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'

        });
        this.listarEstacionamentos();
        this.novoEstacionamento = {
          nome: '',
          endereco: '',
          numeroVagasDisponiveis: 0,
        };
      })
      .catch((error: any) => {
        this.snackBar.open('Erro ao adicionar estacionamento: ' + error.message, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });
  }


  // Editar estacionamento clonando o objeto
  editarEstacionamento(estacionamento: Estacionamento): void {
    this.editandoEstacionamento = { ...estacionamento };
  }

  // Salva a edição
  salvarEdicao(): void {
    if (this.editandoEstacionamento) {
      this.estacionamentoService
        .updateEstacionamento(this.editandoEstacionamento)
        .then(() => {
          console.log('Estacionamento atualizado com sucesso!');
          this.editandoEstacionamento = null;
          this.snackBar.open('Estacionamento Atualizado com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top' });
          this.listarEstacionamentos();
        })
        .catch((error: any) => {
          this.snackBar.open('Erro ao Atualizar estacionamento: ' + error.message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
    }
  }

  // Deletar estacionamento COMPONENTE
  deletarEstacionamento(estacionamento: Estacionamento): void {
    if (estacionamento) {
      this.estacionamentoService
        .deleteEstacionamento(estacionamento)
        .then(() => {
          console.log('Estacionamento deletado com sucesso!');
          this.snackBar.open('Estacionamento Excluido com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top' });
          this.listarEstacionamentos();
        })
        .catch((error) => console.error('Erro ao deletar estacionamento:', error));
    }
  }

  // Selecionar Estacionamento
  selecionarEstacionamento(estacionamento: Estacionamento): void {
    this.router.navigate([`estacionamento/${estacionamento.id}`]);
  }
}
