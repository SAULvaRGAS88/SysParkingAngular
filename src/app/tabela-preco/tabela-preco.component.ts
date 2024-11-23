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
  isLoading: boolean = false;
  estacionamentoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tabelaPRecoService: TabelaPrecoService
  ) { }

  ngOnInit() {
    this.estacionamentoId = this.route.snapshot.paramMap.get('id');
  }

  async salvarTabelaPreco(): Promise<void> {
    if (!this.estacionamentoId) {
      console.error('Estacionamento ID não definido!');
      return;
    }

    this.isLoading = true;
    try {
      console.log('NOVAtabelaPreco', this.novaTabelaPreco);
      await this.tabelaPRecoService.addTabelaPreco(this.estacionamentoId, this.novaTabelaPreco);
      this.tabelaPreco.push(this.novaTabelaPreco);
      console.log('Tabela de Preço adicionada com sucesso!');
      // Exibir mensagem de sucesso ao usuário
      alert('Tabela de Preço adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar Tabela de Preço:', error);
      // Exibir mensagem de erro ao usuário
      alert('Erro ao adicionar Tabela de Preço. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }
}

