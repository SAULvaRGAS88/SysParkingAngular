import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Carro } from '../models/carro.model';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  constructor(
    private firestore: Firestore,
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

}
