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
      const docRef = doc(this.firestore, `estacionamentos/${estacionamentoId}/carros/${carroId}`);
      console.log("docRef", docRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
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
      return;
    } else {
      const deletado = await this.deletarCarro(carro, estacionamentoId);

      if (!deletado) {
        console.log('A deleção do carro foi cancelada ou falhou!');
        return
      } else {
        const usuarioNome = await this.pegarNomeUsuario();

        const relatorioCollections = collection(this.firestore, 'relatorios');


        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.uid || null;
        const useremail = user.email || 'Usuário não identificado';


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
          await addDoc(relatorioCollections, relatorio);
          console.log('Dados salvos para o relatório:', relatorio);
        } catch (error) {
          console.error('Erro ao salvar os dados no relatório:', error);
        }
      }
    }
  }

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
        this.router.navigate([`/estacionamento/${estacionamentoId}`]);
        return true;
      } catch (error: any) {
        console.error('Erro ao Finalizar Serviço:', error);
        this.snackBar.open(`Erro ao Finalizar Serviço: ${error.message || 'Erro desconhecido'}`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return false;
      }
    } else {
      console.log('Serviço cancelado pelo usuário.');
      this.snackBar.open('Serviço cancelado pelo usuário.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return false;
    }
  }

  // Método para obter o nome do usuário e o tipo
  async pegarNomeUsuario(): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('credential') || '{}');
      const userId = user.uid;

      if (!userId) {
        console.warn('Nenhum userId encontrado no localStorage.');
        return { usuarioNome: 'Usuário não identificado', tipoUsuario: 'Usuário' };
      }

      const docRef = doc(this.firestore, `users/${userId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const usuarioNome = userData?.['nome'] || 'Colaborador';
        const tipoUsuario = userData?.['tipoUsuario'];
        return { usuarioNome, tipoUsuario };
      } else {
        return { usuarioNome: 'Colaborador', tipoUsuario: 'Usuário' };
      }
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error);
      return { usuarioNome: 'Usuário não identificado', tipoUsuario: 'Usuário' };
    }
  }

}
