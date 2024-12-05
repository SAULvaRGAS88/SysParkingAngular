import { Inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionGroup, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  constructor(
    private firestore: Firestore,
    @Inject(Auth) private auth: Auth
  ) { }

  /** Método para adicionar colaborador à Firestore e ao Authentication do Firebase */
  async addColaboradorService(objeto: any): Promise<void> {
    // Garantir que o nome e o ID do estacionamento estejam presentes
    if (!objeto.nomeEstacionamento || !objeto.idEstacionamento) {
      console.error('Nome do estacionamento ou ID do estacionamento não fornecido');
      return;
    }

    // Garantir que o colaborador tenha os campos obrigatórios
    if (!objeto.email || !objeto.senha || !objeto.nome) {
      console.error('Campos obrigatórios não preenchidos');
      return;
    }

    try {
      // Criar o colaborador no Authentication do Firebase
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        objeto.email,
        objeto.senha
      );

      console.log('Usuário autenticado criado com sucesso:', userCredential.user.uid);

      // Adicionar o UID gerado ao objeto do colaborador
      objeto.uid = userCredential.user.uid;
      objeto.tipoUsuario = 'usuario';

      // Adicionar o ID do colaborador antes de salvar no Firestore
      // O id do colaborador será o ID gerado automaticamente pelo Firestore
      const colaboradorRef = collection(this.firestore, `estacionamentos/${objeto.idEstacionamento}/colaboradores`);


      // Salvando o colaborador no Firestore
      const docRef = await addDoc(colaboradorRef, objeto);

      // Agora, o objeto inclui o ID do documento
      objeto.id = docRef.id;  // O ID gerado pela coleção Firestore

      console.log('Colaborador adicionado com sucesso na Firestore com ID:', docRef.id);
      console.log('Objeto após adição:', objeto);  // Verificar se o idColaborador foi adicionado

    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
    }
  }



  /** Método para carregar todos os colaboradores de todos os estacionamentos */
  async getColaboradores(): Promise<any> {
    try {
      const estacionamentosRef = collection(this.firestore, 'estacionamentos');
      const estacionamentosSnapshot = await getDocs(estacionamentosRef);
      const colaboradores: any[] = [];

      for (const estacionamentoDoc of estacionamentosSnapshot.docs) {
        const colaboradoresRef = collection(this.firestore, `estacionamentos/${estacionamentoDoc.id}/colaboradores`);
        const colaboradoresSnapshot = await getDocs(colaboradoresRef);

        // Adiciona o ID do documento junto aos dados do colaborador
        colaboradores.push(...colaboradoresSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id  // Inclui o ID do documento no objeto
        })));
      }

      return colaboradores;
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
    }
  }


  /** Método para atualizar um colaborador */
  async updateColaborador(colaborador: any): Promise<void> {
    const colaboradorRef = doc(this.firestore, `estacionamentos/${colaborador.idEstacionamento}/colaboradores/${colaborador.id}`);
    try {
      await updateDoc(colaboradorRef, {
        nome: colaborador.nome,
        telefone: colaborador.telefone,
        endereco: colaborador.endereco,
        email: colaborador.email,
        senha: colaborador.senha
      });
      console.log('Colaborador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
    }
  }

  //**Metodo para deletar um colaborador da coleção colaboradores e do Authentication */
  async deleteColaboradorFirestore(colaborador: any): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, `estacionamentos/${colaborador.idEstacionamento}/colaboradores/${colaborador.id}`));
      console.log('Colaborador deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar colaborador:', error);
    }
  }

  async getTodosColaboradores(): Promise<Partial<Usuario>[]> {
    try {
      const colaboradoresGroupRef = collectionGroup(this.firestore, 'colaboradores');
      const colaboradoresSnapshot = await getDocs(colaboradoresGroupRef);
  
      return colaboradoresSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        estacionamentoId: doc.ref.parent.parent?.id,
      })) as Partial<Usuario>[];
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      throw new Error('Não foi possível carregar os colaboradores.');
    }
  }
  
  

}


