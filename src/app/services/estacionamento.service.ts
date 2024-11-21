import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Estacionamento } from '../models/estacionamento.model';
import { Observable } from 'rxjs';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EstacionamentoService {

  estacionamentos: Estacionamento[] = [];

  constructor(private firestore: Firestore) { }

  // Adicionar estacionamento SERVICE
  async addEstacionamento(estacionamento: Estacionamento): Promise<void> {
    const estacionamentoCollections = collection(this.firestore, 'estacionamentos');
    try {
      if (!estacionamento.nome || !estacionamento.endereco || !estacionamento.numeroVagasDisponiveis) {
        throw new Error('Todos os campos devem ser preenchidos.');
      }
      if (estacionamento.numeroVagasDisponiveis < 0) {
        throw new Error('O número de vagas disponíveis não pode ser negativo.');
      }

      await addDoc(estacionamentoCollections, estacionamento);
      console.log('Estacionamento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar estacionamento:', error);
      throw error;
    }
  }


  // Listar todos os estacionamentos
  async getEstacionamentos(): Promise<any[]> {
    const estacionamentoCollections = collection(this.firestore, 'estacionamentos');
    try {
      const snapshot = await getDocs(estacionamentoCollections);
      const estacionamentos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return estacionamentos;
    } catch (error) {
      console.error('Erro ao recuperar estacionamentos:', error);
      throw error;
    }
  }

  // Atualizar estacionamento SERVICE
  async updateEstacionamento(estacionamento: Estacionamento): Promise<void> {

    const estacionamentoRef = doc(this.firestore, `estacionamentos/${estacionamento.id}`);

    try {
      if (!estacionamento.nome || !estacionamento.endereco || !estacionamento.numeroVagasDisponiveis) {
        throw new Error('Todos os campos devem ser preenchidos.');
      }
      if (estacionamento.numeroVagasDisponiveis < 0) {
        throw new Error('O número de vagas disponíveis não pode ser negativo.');
      }
      await updateDoc(estacionamentoRef, {
        id: estacionamento.id,
        nome: estacionamento.nome,
        endereco: estacionamento.endereco,
        numeroVagasDisponiveis: estacionamento.numeroVagasDisponiveis,
      });

      console.log('Estacionamento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar estacionamento:', error);
      throw error;
    }
  }


  // Deletar estacionamento com confirmação
  async deleteEstacionamento(estacionamento: Estacionamento): Promise<void> {
    const confirmacao = confirm("Tem certeza que deseja deletar o estacionamento?");

    if (confirmacao) {
      const estacionamentoRef = doc(this.firestore, `estacionamentos/${estacionamento.id}`);
      try {
        await deleteDoc(estacionamentoRef);
      } catch (error) {
        console.error('Erro ao deletar estacionamento:', error);
      }
    } else {
      console.log('Ação de exclusão cancelada.');
      return Promise.resolve();
    }
  }
}
