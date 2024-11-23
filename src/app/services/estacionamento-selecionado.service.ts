import { Injectable } from '@angular/core';
import { Estacionamento } from '../models/estacionamento.model';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Carro } from '../models/carro.model';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class EstacionamentoSelecionadoService {

  estacionamentos: Estacionamento[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private firestore: Firestore
  ) { }

  // Buscar estacionameto por ID
  async buscarEstacionamentoPorIdFirebase(id: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, `estacionamentos/${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn(`Estacionamento com ID ${id} não encontrado.`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar estacionamento por ID:', error);
      throw error;
    }
  }

  // Adicionar carro (estacionar) ao estacionamento selecionado
  async addCarro(carro: Carro, id: string): Promise<void> {
    const estacionamentoCollections = collection(this.firestore, `estacionamentos/${id}/carros`);

    try {
      await addDoc(estacionamentoCollections, carro);
      console.log('Carro adicionado com sucesso ao estacionamento!');
    } catch (error) {
      console.error('Erro ao adicionar carro ao estacionamento:', error);
      throw error;
    }
  }

  // Mostrar todos os carros estacionanados
  async getCarrosEstacionados(id: string): Promise<any> {
    const estacionamentoCollections = collection(this.firestore, `estacionamentos/${id}/carros`);
    try {
      const snapshot = await getDocs(estacionamentoCollections);
      const carros = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return carros;
    } catch (error) {
      console.error('Erro ao buscar carros estacionados:', error);
      throw error;
    }
  }

  // Atualizar carro
  async updateCarro(carro: Carro, estacionamentoId: string): Promise<void> {
    const carroRef = doc(this.firestore, `estacionamentos/${estacionamentoId}/carros/${carro.id}`);

    try {
      await updateDoc(carroRef, {
        marca: carro.marca,
        modelo: carro.modelo,
        cor: carro.cor,
        placa: carro.placa,
      });
      console.log('Carro adicionado com sucesso ao estacionamento!');
    } catch (error) {
      console.error('Erro ao adicionar carro ao estacionamento:', error);
      throw error;
    }
  }

  // Deletar carro (desestacionar) do estacionamento selecionado
  async deletarCarro(carro: Carro, estacionamentoId: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Confirmar exclusão',
      text: `Tem certeza que deseja deletar o carro com placa: ${carro.placa}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const carroRef = doc(this.firestore, `estacionamentos/${estacionamentoId}/carros/${carro.id}`);
      try {
        await deleteDoc(carroRef);
        this.snackBar.open(`Carro com placa "${carro.placa}" deletado com sucesso!`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      } catch (error: any) {
        console.error('Erro ao deletar carro:', error);
        this.snackBar.open(`Erro ao deletar carro: ${error.message || 'Erro desconhecido'}`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    } else {
      console.log('Exclusão cancelada.');
      this.snackBar.open('Exclusão cancelada pelo usuário.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

  }


}
