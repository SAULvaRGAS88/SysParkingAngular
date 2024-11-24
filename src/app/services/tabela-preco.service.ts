import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { TabelaPreco } from '../models/tabelaPreco.model';

@Injectable({
  providedIn: 'root'
})
export class TabelaPrecoService {

  constructor(
    private firestore: Firestore,
  ) { }

  /**Adiciona tabela de preço ao Firebase relacionado ao estacionamento */
  async addTabelaPreco(id: string, tabelaPreco: TabelaPreco): Promise<void> {
    console.log('tabelaPreco', tabelaPreco);
    const tabelaPrecoRef = collection(this.firestore, `estacionamentos/${id}/tabelaPreco`);
    console.log('tabelaPrecoRef', tabelaPrecoRef);

    try {
      await addDoc(tabelaPrecoRef, tabelaPreco);
    } catch (error) {
      console.error('Erro ao adicionar Tabela de Preço:', error);
    }
  }

  /**Carrega a Tabela de Preço do estacionamento do Firebase */
  async getTabelaPreco(id: string): Promise<any> {
    try {
      const tabelaPrecoRef = collection(this.firestore, `estacionamentos/${id}/tabelaPreco`);
      const docSnap = await getDocs(tabelaPrecoRef);
      const tabelaPreco = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return tabelaPreco;

    } catch (error) {
      console.error('Erro ao buscar Tabela de Preço:', error);
    }
  }

  /**Atualiza a Tabela de Preço do estacionamento do Firebase */
  async updateTabelaPreco(id: string, tabelaPreco: TabelaPreco): Promise<void> {
    try {
      const tabelaPrecoRef = doc(this.firestore, `estacionamentos/${id}/tabelaPreco/${tabelaPreco.id}`);

      await updateDoc(tabelaPrecoRef, {
        preco15Min: tabelaPreco.preco15Min,
        preco30Min: tabelaPreco.preco30Min,
        preco1Hora: tabelaPreco.preco1Hora,
        precoDiaria: tabelaPreco.precoDiaria,
        precoPernoite: tabelaPreco.precoPernoite,
        precoMensal: tabelaPreco.precoMensal
      })

    } catch (error) {
      console.error('Erro ao atualizar Tabela de Preço:', error);
    }
  }
}
