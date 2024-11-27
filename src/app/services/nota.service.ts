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

  //**Metodo para Salvar dados no firebase para o relatório (id do estacionamento, nome do veiculo, hora de entrada, hora de saida, valor pago, tempo de permanência e data) */
  async salvarDadosRelatorioFirebase(
    estacionamentoId: string,
    carro: Carro,
    valorPago: number,
    tempoPermanencia: string,
    formaPagamento: string
  ): Promise<void> {
    const relatorioCollections = collection(this.firestore, 'relatorios');

    // Criar o objeto do relatório usando os atributos da instância `carro`
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
      formaPagamento
    };
    this.deletarCarro(carro, estacionamentoId);

    try {
      // Salvar o objeto no Firebase
      await addDoc(relatorioCollections, relatorio);
      console.log('Dados salvos para o relatório:', relatorio);
    } catch (error) {
      console.error('Erro ao salvar os dados no relatório:', error);
    }
  }

  
  // Deletar carro (desestacionar) do estacionamento selecionado
  async deletarCarro(carro: Carro, estacionamentoId: string): Promise<void> {
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
      } catch (error: any) {
        console.error('Erro ao Finalizar Serviço:', error);
        this.snackBar.open(`Erro ao Finalizar Serviço: ${error.message || 'Erro desconhecido'}`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    } else {
      console.log('Serviço cancelado pelo usuário.');
      this.snackBar.open('Serviço cancelada pelo usuário.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

  }
}
