import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Carro } from '../models/carro.model';
import { NotaService } from '../services/nota.service';
import { TabelaPreco } from '../models/tabelaPreco.model';
import { TabelaPrecoService } from '../services/tabela-preco.service';

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
  totalAPagar: number = 0;
  tabelaPrecoCarregada: TabelaPreco[] = [];
  tabelaPreco: TabelaPreco[] = [];
  relatorios = {};
  formaPagamento: string = ''; 


  constructor(
    private route: ActivatedRoute,
    private notaService: NotaService,
    private tabelaPRecoService: TabelaPrecoService,
    private router: Router,
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
          this.calcularTotalAPagar();
        } else {
          console.warn('Detalhes do carro ou hora de entrada não encontrados.');
        }
      });
    }

    this.tabelaPRecoService.getTabelaPreco(this.estacionamentoId!)
      .then(data => {
        this.tabelaPrecoCarregada = data;
        console.log('Tabela de preço carregada:', this.tabelaPrecoCarregada);

        // Agora podemos calcular o total a pagar
        this.calcularTotalAPagar();
      })
      .catch(error => console.error('Erro ao carregar tabela de preço:', error));
    this.usarTabelaPreco()
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

    // Reconstruir a hora de entrada em formato Date
    const horaEntradaString = this.carroDetalhes?.horaEntrada;
    const horaEntrada = this.reconstruirHora(horaEntradaString);

    if (!horaEntrada) {
      console.error("Erro: Hora de entrada inválida.");
      this.tempoPermanencia = "Hora de entrada não registrada.";
      return;
    }

    // Calcular a diferença em milissegundos
    const diferenca = getHoraAtual.getTime() - horaEntrada.getTime();

    // 3 horas em milissegundos
    const tresHorasEmMilissegundos = 3 * 60 * 60 * 1000;

    if (diferenca > tresHorasEmMilissegundos) {
      this.tempoPermanencia = `${this.formatarDuracao(diferenca)} - diferenca Tempo maior que 3 horas, valor referente a 1 diária.`;
    } else {
      // Formatar duração (assumindo que formatarDuracao existe)
      this.tempoPermanencia = this.formatarDuracao(diferenca);
    }
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

  /** Metodo para calcular o total a pagar */
  async calcularTotalAPagar() {
    try {
      if (!this.tempoPermanencia || !this.tabelaPrecoCarregada) {
        console.error('Tempo de permanência ou tabela de preço não definidos!');
        return;
      }

      const minutos = this.transformarHorarioEmMinutos(this.tempoPermanencia);
      let total = 0;

      // Use a lógica baseada em intervalos da tabela de preços
      if (minutos <= 15) {
        total = this.tabelaPrecoCarregada[0]?.preco15Min;
      } else if (minutos <= 30) {
        total = this.tabelaPrecoCarregada[0]?.preco30Min;
      } else if (minutos <= 60) {
        total = this.tabelaPrecoCarregada[0]?.preco1Hora;
      } else if (minutos <= 180) { // Mais de 1 hora até 3 horas
        const horasAdicionais = Math.ceil((minutos - 60) / 60); // Calcula horas extras
        total = this.tabelaPrecoCarregada[0]?.preco1Hora +
          (horasAdicionais * this.tabelaPrecoCarregada[0]?.preco1Hora);
      } else { // Acima de 3 horas (diária)
        total = this.tabelaPrecoCarregada[0]?.precoDiaria;
      }


      this.totalAPagar = total;
      console.log('Total a pagar:', this.totalAPagar);
    } catch (error) {
      console.error('Erro ao calcular o total a pagar:', error);
      throw error;
    }
  }

  /** Função auxiliar para transformar horário em minutos */
  transformarHorarioEmMinutos(horario: string): number {
    try {
      // Exemplo de entrada: "4h 36min"
      const horasMatch = horario.match(/(\d+)h/); // Captura as horas
      const minutosMatch = horario.match(/(\d+)min/); // Captura os minutos

      const horas = horasMatch ? parseInt(horasMatch[1], 10) : 0;
      const minutos = minutosMatch ? parseInt(minutosMatch[1], 10) : 0;

      console.log('Horas:', horas, 'Minutos:', minutos);

      return horas * 60 + minutos;
    } catch (error) {
      console.error('Erro ao transformar horário em minutos:', error);
      return 0; // Valor padrão em caso de erro
    }
  }

  async usarTabelaPreco(): Promise<void> {
    if (!this.tabelaPrecoCarregada.length) {
      await this.tabelaPRecoService.getTabelaPreco(this.estacionamentoId!)
        .then(data => {
          this.tabelaPrecoCarregada = data;
          // console.log('Dados carregados:', this.tabelaPrecoCarregada);
        })
        .catch(error => console.error('Erro ao carregar tabela de preço:', error));
    }

    // Agora você pode usar os dados aqui
    console.log('Tabela de preço carregada para uso:', this.tabelaPrecoCarregada);
  }

  //**Metodo para pagamento e saida de veiculo */
  async pagarEstacionamento(): Promise<void> {
    try {
      console.log('Vaga Liberada!')
      this.salvarDadosRelatorio();

    } catch (error) {
      console.error('Erro ao carregar tabela de preço:', error);
    }
  }


  //**Metodo para Salvar dados para o relatório (id do estacionamento, nome do veiculo, hora de entrada, hora de saida, valor pago, tempo de permanência e data) */
  async salvarDadosRelatorio(): Promise<void> {
    try {
      if (Array.isArray(this.carro) && this.carro.length > 0) {
        const carroSelecionado = this.carro[0];
        await this.notaService.salvarDadosRelatorioFirebase(this.estacionamentoId!, carroSelecionado, this.totalAPagar!, this.tempoPermanencia!, this.formaPagamento!);

        console.log('Dados salvos para o relatório');
      } else {
        console.error('Nenhum carro selecionado para salvar no relatório.');
      }
    } catch (error) {
      console.error('Erro ao carregar tabela de preço:', error);
    } 
  }

}