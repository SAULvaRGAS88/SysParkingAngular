import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  constructor(
    private firestore: Firestore,
  ) { }

  async buscarRlatorioFirebase() : Promise<any> {
    try{
      const relatorioRef = collection(this.firestore, 'relatorios');
      const docSnap = await getDocs(relatorioRef);
      const relatorio = docSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
      return relatorio;
    }catch(error){
      console.log('Erro ao buscar relatorio', error);
    }
  }
}
