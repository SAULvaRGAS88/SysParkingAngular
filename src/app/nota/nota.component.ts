import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Carro } from '../models/carro.model';
import { NotaService } from '../services/nota.service';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrl: './nota.component.css'
})
export class NotaComponent {

  carroId: string | null = null;
  carro: Carro[] = [];
  carroDetalhes: any = null;
  estacionamentoId: any = null;

  constructor(
    private route: ActivatedRoute,
    private notaService: NotaService
  ) { }

  ngOnInit() {
    // Acessar o parâmetro de rota
    this.route.params.subscribe(params => {
      this.carroId = params['id'];
      console.log('Carro ID:', this.carroId);
    });

    // Acessar os queryParams
    this.route.queryParams.subscribe(params => {
      this.estacionamentoId = params['estacionamentoId'];
      console.log('Estacionamento ID:', this.estacionamentoId);
    });

    if (this.carroId) {
      this.buscarCarroPorId(this.carroId, this.estacionamentoId);
    }
  }

  //Busca carro por ID
  async buscarCarroPorId(carroId: string, estacionamentoId: string): Promise<any> {
    try {
      this.carroDetalhes = await this.notaService.buscarCarroPorIdFirebase(carroId, estacionamentoId);
      console.log('Detalhes do Carro:', this.carroDetalhes);
      this.carro.push(this.carroDetalhes);
    } catch (error) {
      console.error('Erro ao buscar carro por ID:', error);
      throw error;
    }
  }
}