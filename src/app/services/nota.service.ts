import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Carro } from '../models/carro.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  usuarioNome: string | null = null;

  constructor(
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  // Buscar carro por ID
  async buscarCarroPorIdFirebase(carroId: string, estacionamentoId: string): Promise<any> {
    try {
      // Referência ao documento
      const docRef = doc(this.firestore, `estacionamentos/${estacionamentoId}/carros/${carroId}`);
      console.log("docRef", docRef);
      // Obter dados do documento
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Retorna os dados junto com o ID do documento
        return { id: docSnap.id, ...docSnap.data() } as Carro;
      } else {
        console.warn(`Carro com ID ${carroId} não encontrado.`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar Carro por ID:', error);
      throw new Error('Não foi possível buscar o carro. Tente novamente mais tarde.');
    }
  }

  async salvarDadosRelatorioFirebase(
    estacionamentoId: string,
    carro: Carro,
    valorPago: number,
    tempoPermanencia: string,
    formaPagamento: string = '',
    erro: string | null = null
  ): Promise<void> {

    if (formaPagamento === '') {
      this.snackBar.open('Selecione uma forma de pagamento', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      erro = 'Forma de pagamento não selecionada';
      return;  // Interrompe a execução caso não seja selecionada uma forma de pagamento
    } else {
      // Espera a conclusão da deleção do carro antes de continuar
      const deletado = await this.deletarCarro(carro, estacionamentoId);  // Verifica se a deleção foi bem-sucedida

      if (!deletado) {
        console.log('A deleção do carro foi cancelada ou falhou!');
        return
      } else {
        // Espera o nome do usuário
        const usuarioNome = await this.pegarNomeUsuario();

        const relatorioCollections = collection(this.firestore, 'relatorios');

        // Recuperar o usuário
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.uid || null;
        const useremail = user.email || 'Usuário não identificado';

        // Criar o objeto do relatório
        const relatorio = {
          estacionamentoId,
          nomeVeiculo: `${carro.marca} ${carro.modelo}`,
          placa: carro.placa,
          cor: carro.cor,
          tipoVeiculo: carro.tipoVeiculo,
          horaEntrada: carro.horaEntrada,
          dataEntrada: carro.dataEntrada,
          valorPago,
          tempoPermanencia,
          formaPagamento,
          usuarioId: userId,
          usuarioNome: useremail,
          userNome: usuarioNome
        };

        try {
          // Salvar no Firestore
          await addDoc(relatorioCollections, relatorio);
          console.log('Dados salvos para o relatório:', relatorio);
        } catch (error) {
          console.error('Erro ao salvar os dados no relatório:', error);
        }
      }
    }
  }

  // Deletar carro (desestacionar) do estacionamento selecionado
  async deletarCarro(carro: Carro, estacionamentoId: string): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Finalizar Serviço',
      text: `Tem certeza que deseja finalizar o Serviço com placa: ${carro.placa}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const carroRef = doc(this.firestore, `estacionamentos/${estacionamentoId}/carros/${carro.id}`);
      try {
        await deleteDoc(carroRef);
        this.snackBar.open(`Carro com placa "${carro.placa}" Serviço finalizado com sucesso!`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['/estacionamento']);
        return true; // Retorna true para indicar que o carro foi deletado com sucesso
      } catch (error: any) {
        console.error('Erro ao Finalizar Serviço:', error);
        this.snackBar.open(`Erro ao Finalizar Serviço: ${error.message || 'Erro desconhecido'}`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return false; // Retorna false em caso de erro
      }
    } else {
      console.log('Serviço cancelado pelo usuário.');
      this.snackBar.open('Serviço cancelado pelo usuário.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return false; // Retorna false caso o usuário cancele a operação
    }
  }


  // Método para obter o nome do usuário
  async pegarNomeUsuario(): Promise<string> {
    try {
      // Recuperar o usuário do localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.uid;

      // Verifica se o userId existe
      if (!userId) {
        console.warn('Nenhum userId encontrado no localStorage.');
        return 'Usuário não identificado'; // Retorna um nome padrão
      }

      // Busca o documento do Firestore
      const docRef = doc(this.firestore, `users/${userId}`);
      const docSnap = await getDoc(docRef);

      // Verifica se o documento existe
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const usuarioNome = userData?.['nome'] || 'Usuário não identificado'; // Valor padrão
        console.log('Nome do usuário:', usuarioNome);
        this.usuarioNome = usuarioNome; // Atualiza o nome na instância, se necessário
        return usuarioNome; // Retorna o nome do usuário
      } else {
        console.warn(`Usuário com ID ${userId} não encontrado.`);
        return 'Usuário não identificado'; // Retorna um nome padrão se não encontrar o documento
      }
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error);
      return 'Usuário não identificado'; // Retorna um nome padrão em caso de erro
    }
  }
}
