import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { TabelaPreco } from '../models/tabelaPreco.model';

@Injectable({
  providedIn: 'root'
})
export class TabelaPrecoService {

  constructor(
    private firestore: Firestore,
  ) { }

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
}
