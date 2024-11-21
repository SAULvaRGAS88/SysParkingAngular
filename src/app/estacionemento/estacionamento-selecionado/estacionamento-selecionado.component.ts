import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstacionamentoSelecionadoService } from '../../services/estacionamento-selecionado.service';
import { Estacionamento } from '../../models/estacionamento.model';

@Component({
  selector: 'app-estacionamento-selecionado',
  templateUrl: './estacionamento-selecionado.component.html',
  styleUrls: ['./estacionamento-selecionado.component.css']
})
export class EstacionamentoSelecionadoComponent implements OnInit {

  estacionamentos: Estacionamento[] = [];
  estacionamentoId: string | null = null;
  estacionamentoDetalhes: any = null;


  constructor(
    private route: ActivatedRoute,
    private estacionamentoSelecionadoService: EstacionamentoSelecionadoService
  ) {}

  ngOnInit(): void {
    // Captura o ID do estacionamento da rota
    this.estacionamentoId = this.route.snapshot.paramMap.get('id');
    console.log('ID do Estacionamento:', this.estacionamentoId);

    // Busca os detalhes do estacionamento, se o ID estiver disponível
    if (this.estacionamentoId) {
      this.buscarEstacionamentoPorId(this.estacionamentoId);
    }
  }

  // Busca detalhes do estacionamento pelo ID
  async buscarEstacionamentoPorId(id: string): Promise<void> {
    try {
      this.estacionamentoDetalhes = await this.estacionamentoSelecionadoService.buscarEstacionamentoPorIdFirebase(id);
      this.estacionamentos.push(this.estacionamentoDetalhes);
      console.log('Detalhes do Estacionamento:', this.estacionamentoDetalhes);
    } catch (error) {
      console.error('Erro ao buscar detalhes do estacionamento:', error);
    }
  }
}
