import { Component } from '@angular/core';
import { TabelaPreco } from '../models/tabelaPreco.model';
import { ActivatedRoute } from '@angular/router';
import { TabelaPrecoService } from '../services/tabela-preco.service';

@Component({
  selector: 'app-tabela-preco',
  templateUrl: './tabela-preco.component.html',
  styleUrl: './tabela-preco.component.css'
})
export class TabelaPrecoComponent {

  tabelaPreco: TabelaPreco[] = [];
  novaTabelaPreco: TabelaPreco = {
    preco15Min: null,
    preco30Min: null,
    preco1Hora: null,
    precoDiaria: null,
    precoPernoite: null,
    precoMensal: null
  } as unknown as TabelaPreco;
  estacionamentoId: string | null = null;
  tabelaPrecoCarregada: TabelaPreco[] = [];
  abrirFormularioAtualizacao: boolean = false;
  abrirFormularioInsersao: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tabelaPRecoService: TabelaPrecoService
  ) { }

  ngOnInit() {
    this.estacionamentoId = this.route.snapshot.paramMap.get('id');
    this.tabelaPRecoService.getTabelaPreco(this.estacionamentoId!)
      .then(data => {
        console.log('Dados carregados:', data); // Verifique os dados no console
        this.tabelaPrecoCarregada = data;
      })
      .catch(error => console.error('Erro ao carregar Tabela de Preço:', error));
  }

  /**Metodo para salvar a Tabela de Preço */
  async salvarTabelaPreco(): Promise<void> {
    if (!this.estacionamentoId) {
      console.error('Estacionamento ID não definido!');
      return;
    }
    if (this.tabelaPrecoCarregada.length > 0) {
      alert('Tabela de Preço ja cadastrada!');
      return
    }

    try {
      await this.tabelaPRecoService.addTabelaPreco(this.estacionamentoId, this.novaTabelaPreco);
      this.tabelaPreco.push(this.novaTabelaPreco);
      console.log('Tabela de Preço adicionada com sucesso!');
      alert('Tabela de Preço adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar Tabela de Preço:', error);
      alert('Erro ao adicionar Tabela de Preço. Tente novamente.');
    }
  }

  /** Carrega os dados da tabela de preços */
  async carregarTabelaPreco(estacionamentoId: string): Promise<void> {
    if (!estacionamentoId) {
      console.error('Estacionamento ID não definido em carregarTabelaPreco!');
      return;
    }

    try {
      const tabelaPrecoResponse = await this.tabelaPRecoService.getTabelaPreco(estacionamentoId);

      if (Array.isArray(tabelaPrecoResponse)) {
        this.tabelaPrecoCarregada = tabelaPrecoResponse;
        this.tabelaPreco = [...this.tabelaPrecoCarregada];
      } else {
        console.error('Resposta inesperada ao carregar tabela de preços:', tabelaPrecoResponse);
      }

      console.log('Tabela de Preço carregada com sucesso!', this.tabelaPrecoCarregada);
    } catch (error) {
      console.error('Erro ao carregar Tabela de Preço no TS:', error);
    }
  }

  /**Função para manipular o formulário de atualização */
  abrirFormulariosAtualizacao() {
    this.abrirFormularioAtualizacao = !this.abrirFormularioAtualizacao
  }

  /**Função para manipular o formulário de insersão */
  abrirFormulariosInsersao() {
    this.abrirFormularioInsersao = !this.abrirFormularioInsersao
  }

  /** Metodo para atualizar a Tabela de Preço */
  atualizarTabelaPreco(): void {
    if (!this.tabelaPrecoCarregada || !this.estacionamentoId) {
      console.error('Dados inválidos: tabela de preço ou ID do estacionamento não definidos!');
      return;
    }

    this.tabelaPRecoService
      .updateTabelaPreco(this.estacionamentoId, this.tabelaPrecoCarregada[0])
      .then(() => {
        console.log('Tabela de Preço atualizada com sucesso!');
        alert('Tabela de Preço atualizada com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao atualizar Tabela de Preço:', error);
        alert('Erro ao atualizar a tabela de preços. Por favor, tente novamente.');
      });
  }

}

