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
  tempoPermanencia: string = "";

  constructor(
    private route: ActivatedRoute,
    private notaService: NotaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.carroId = params['id'];
      console.log('Carro ID:', this.carroId);
    });

    this.route.queryParams.subscribe(params => {
      this.estacionamentoId = params['estacionamentoId'];
      console.log('Estacionamento ID:', this.estacionamentoId);
    });

    if (this.carroId) {
      this.buscarCarroPorId(this.carroId, this.estacionamentoId).then(() => {
        if (this.carroDetalhes?.horaEntrada) {
          this.calcularTempoPermanencia(); // Só chama quando o carroDetalhes estiver pronto
        } else {
          console.warn('Detalhes do carro ou hora de entrada não encontrados.');
        }
      });
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

  /** Método para calcular o tempo de permanência */
  async calcularTempoPermanencia() {

    const getHoraAtual = new Date();

    const horaEntradaString = this.carroDetalhes?.horaEntrada

    const horaEntrada = this.reconstruirHora(horaEntradaString);

    const diferenca = getHoraAtual.getTime() - horaEntrada.getTime();

    this.tempoPermanencia = this.formatarDuracao(diferenca);

  }

  /** Reconstrói um objeto Date a partir de uma string no formato HH:mm:ss */
  private reconstruirHora(horaString: string): Date {
    const [horas, minutos, segundos] = horaString.split(':').map(Number);
    const agora = new Date();
    agora.setHours(horas, minutos, segundos || 0);
    return agora;
  }

  /** Formata a diferença de tempo em horas e minutos */
  private formatarDuracao(diferenca: number): string {
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}min`;
  }
}