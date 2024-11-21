import { Injectable } from '@angular/core';
import { Estacionamento } from '../models/estacionamento.model';
import { collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EstacionamentoSelecionadoService {

  estacionamentos: Estacionamento[] = [];

  constructor(private firestore: Firestore) { }

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

}
