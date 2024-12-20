import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstacionamentoSelecionadoService } from '../../services/estacionamento-selecionado.service';
import { Estacionamento } from '../../models/estacionamento.model';
import { Carro } from '../../models/carro.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recuperadata, Recuperahorario } from '../../components/utils/Recuperahorario';
import { NotaService } from '../../services/nota.service';

@Component({
  selector: 'app-estacionamento-selecionado',
  templateUrl: './estacionamento-selecionado.component.html',
  styleUrls: ['./estacionamento-selecionado.component.css']
})
export class EstacionamentoSelecionadoComponent implements OnInit {

  estacionamento: Estacionamento[] = [];
  estacionamentoId: string | null = null;
  estacionamentoDetalhes: any = null;
  novoCarro: Carro = {
    marca: '',
    modelo: '',
    cor: '',
    placa: '',
    tipoVeiculo: '',
    horaEntrada: Recuperahorario(),
    dataEntrada: Recuperadata()
  }
  editandoCarro: Carro | null = null;
  abrirFormulario: boolean = false;
  carros: Carro[] = [];
  carrosFiltrados: Carro[] = [];
  searchText: string = '';
  usuarioAutorizado: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private estacionamentoSelecionadoService: EstacionamentoSelecionadoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notaService: NotaService
  ) { }

  ngOnInit() {
    this.estacionamentoId = this.route.snapshot.paramMap.get('id');
    this.pegarTipoUsuario();
    this.carrosFiltrados = [...this.carros];

    if (this.estacionamentoId) {
      this.buscarEstacionamentoPorId(this.estacionamentoId);
      this.buscarCarrosEstacionados();
    }
  }

  tipoUsuario$: Promise<string> = this.notaService.pegarNomeUsuario();


  //Metodo para contabilizar o numero de vagas restantes
  vagasRestantes(): number {
    if (!this.estacionamentoDetalhes || this.estacionamentoDetalhes.numeroVagasDisponiveis == null) {
      return 0;
    }
    return this.estacionamentoDetalhes.numeroVagasDisponiveis - this.carros.length;
  }

  // Manipulação de exebição do formulário 
  adicionarCarroForm(): void {
    this.abrirFormulario = !this.abrirFormulario;
  }

  // Busca detalhes do estacionamento pelo ID
  async buscarEstacionamentoPorId(id: string): Promise<void> {
    try {
      this.estacionamentoDetalhes = await this.estacionamentoSelecionadoService.buscarEstacionamentoPorIdFirebase(id);
      this.estacionamento.push(this.estacionamentoDetalhes);
      // console.log('Detalhes do Estacionamento:', this.estacionamentoDetalhes);
    } catch (error) {
      console.error('Erro ao buscar detalhes do estacionamento:', error);
    }
  }

  // Adiciona um carro ao estacionamento
  async estacionarCarro(): Promise<void> {
    try {
      if (!this.novoCarro.marca || !this.novoCarro.modelo || !this.novoCarro.cor || !this.novoCarro.placa) {
        this.snackBar.open('Preencha todos os campos!', 'Fechar', { duration: 3000, verticalPosition: 'top' });
        return;
      }
      await this.estacionamentoSelecionadoService.addCarro(this.novoCarro, this.estacionamentoId!);
      this.carros.push(this.novoCarro);
      this.novoCarro = {
        marca: '',
        modelo: '',
        cor: '',
        placa: '',
        tipoVeiculo: '',
        horaEntrada: '',
        dataEntrada: '',
      }
      this.abrirFormulario = false;
      console.log('Carro estacionado com sucesso!');
    } catch (error) {
      console.error('Erro ao estacionar carro:', error);
    }
  }

  // Editar Carro clonando o objeto
  editarCarro(carro: Carro): void {
    this.editandoCarro = { ...carro };
  }

  //Salvar carro
  salvarCarro(): void {
    if (this.editandoCarro) {
      this.estacionamentoSelecionadoService
        .updateCarro(this.editandoCarro, this.estacionamentoId!)
        .then(() => {
          console.log('Carro atualizado com sucesso!');
          this.editandoCarro = null;
          this.snackBar.open('Carro Atualizado com sucesso!', 'Fechar', { duration: 3000, verticalPosition: 'top' });
          this.buscarCarrosEstacionados();
        })
        .catch((error: any) => {
          this.snackBar.open('Erro ao Atualizar Carro: ' + error.message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
    }
  }

  // Buscar todos os carros do estacionamento
  buscarCarrosEstacionados(): void {
    if (!this.estacionamentoId) {
      console.error('ID do estacionamento não está disponível.');
      return;
    }

    this.estacionamentoSelecionadoService.getCarrosEstacionados(this.estacionamentoId)
      .then(carros => {
        console.log('Carros estacionados:', carros);
        this.carros = carros;
      })
      .catch(error => {
        console.error('Erro ao buscar carros estacionados:', error);
      });
  }


  // Seleciona um carro para aplicar nota
  selecionarCarro(carro: Carro): void {

    this.router.navigate([`nota/${carro.id}`], {
      queryParams: {
        estacionamentoId: this.estacionamentoId
      }
    });
  }

  // Remove um carro do estacionamento
  deletarCarroEstacionado(carro: Carro): void {
    if (!this.estacionamentoId) {
      this.snackBar.open('Erro: ID do estacionamento não encontrado.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    this.estacionamentoSelecionadoService.deletarCarro(carro, this.estacionamentoId)
      .then(() => {
        this.buscarCarrosEstacionados();
      })
      .catch((error) => {
        console.error('Erro ao deletar carro:', error);
      });
  }

  // Metodo para filtrar os carros por texto digitado
  get filtrarCarros(): Carro[] {
    if (this.searchText === '') {
      return [...this.carros];
    } else {
      return this.carros.filter(carro =>
        carro.modelo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        carro.marca.toLowerCase().includes(this.searchText.toLowerCase()) ||
        carro.cor.toLowerCase().includes(this.searchText.toLowerCase()) ||
        carro.placa.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  /**Metodo para direcionar para Tabela de Preços */
  mostrarTabelaPrecos(): void {
    this.router.navigate([`tabela-precos/${this.estacionamentoId}`]);
  }

  async pegarTipoUsuario() {
    const { usuarioNome, tipoUsuario } = await this.notaService.pegarNomeUsuario();

    this.usuarioAutorizado = tipoUsuario;

    console.log('Nome do usuário:', usuarioNome);
    console.log('Tipo de usuário:', tipoUsuario);

    return { usuarioNome, tipoUsuario };
  } catch(error: any) {
    console.error('Erro ao obter o nome do usuário:', error);
    return { usuarioNome: 'Erro ao obter nome', tipoUsuario: 'Erro' };
  }

}
