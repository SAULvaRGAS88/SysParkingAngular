import { Component } from '@angular/core';
import { Estacionamento } from '../models/estacionamento.model';
import { EstacionamentoService } from '../services/estacionamento.service';
import { Usuario } from '../models/usuario.model';
import { ColaboradorService } from '../services/colaborador.service';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrl: './colaboradores.component.css'
})
export class ColaboradoresComponent {

  estacionamentoSelecionado: any | null = null;
  nomeEstacionamento: string | null = null;
  estacionamentoId: string | null = null;
  estacionamentos: Estacionamento[] = [];
  listarColaboradores: any[] = [];
  usuario: Usuario[] = [];
  editandoUsuario: Usuario | null = null;
  newUsuario: Usuario = {
    nome: '',
    telefone: '',
    endereco: '',
    senha: '',
    email: '',
  };

  constructor(
    private estacionamentoService: EstacionamentoService,
    private colaboradorService: ColaboradorService
  ) { }

  ngOnInit() {

    this.listarEstacionamentos();
    this.buscarColaboradores();
  }

  // Identificar o estacionamento selecionado
  onEstacionamentoChange(): void {
    const estacionamentoSelecionado = this.estacionamentos.find(e => e.id === this.estacionamentoId);
    this.nomeEstacionamento = estacionamentoSelecionado ? estacionamentoSelecionado.nome : null;
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

  /**Salvando colaborador */
  async addcolaborador(): Promise<void> {
    // Validação de dados antes de chamar o serviço
    const estacionamentoSelecionado = this.estacionamentos.find(e => e.id === this.estacionamentoId);
    this.nomeEstacionamento = estacionamentoSelecionado ? estacionamentoSelecionado.nome : null;

    const lObjUsuario = {
      ...this.newUsuario,
      idEstacionamento: this.estacionamentoId,
      nomeEstacionamento: this.nomeEstacionamento
    };

    try {
      // Chama o serviço para adicionar o colaborador
      await this.colaboradorService.addColaboradorService(lObjUsuario);

      // Limpar os dados após salvar
      this.newUsuario = {
        id: '',
        nome: '',
        telefone: '',
        endereco: '',
        senha: '',
        email: ''
      };

      console.log('Colaborador adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
    }
  }

  /**Buscar todos os colaboradores */
  buscarColaboradores(): void {
    this.colaboradorService.getColaboradores()
      .then((colaboradores) => { // Aqui a variável 'colaboradores' deve refletir o retorno da API
        console.log('Colaboradores carregados:', colaboradores);
        this.listarColaboradores = colaboradores;
      })
      .catch((error) => {
        console.error('Erro ao buscar colaboradores:', error); // Alterei a mensagem para refletir corretamente o que está sendo buscado
      });
  }

  editarColaborador(colaborador: Usuario): void {
    console.log('Editar colaborador', colaborador);
    this.editandoUsuario = { ...colaborador };
  }

  salvarColaborador() {
    if (this.editandoUsuario) {
      this.colaboradorService.updateColaborador(this.editandoUsuario)
        .then(() => {
          console.log('Colaborador atualizado com sucesso!');
          this.editandoUsuario = null;
          this.buscarColaboradores();
        })
        .catch((error) => {
          console.error('Erro ao atualizar colaborador:', error);
        });
    }

  }

  deletarColaborador(colaborador: Usuario) {
    this.colaboradorService.deleteColaboradorFirestore(colaborador)
      .then(() => {
        console.log('Colaborador deletado com sucesso!');
        this.buscarColaboradores();
      })
      .catch((error: any) => {
        console.error('Erro ao deletar colaborador:', error);
      });
  }


}
