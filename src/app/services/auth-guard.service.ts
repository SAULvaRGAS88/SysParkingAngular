import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

interface UserData {
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser;

    if (user) {
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      const userData = (await getDoc(userDoc)).data() as UserData;

      if (userData?.role === 'master') {
        return true; // Acesso permitido para "master"
      }
    }

    this.router.navigate(['/unauthorized']); // Redireciona se não for "master"
    return false;
  }
}
