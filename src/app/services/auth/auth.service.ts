import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getDoc, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  async isAuthorizedTechnician(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    const ref = doc(this.firestore, 'tecnicos', user.uid);
    const snap = await getDoc(ref);
    return snap.exists();
  }

  async getUser() {
    const user = this.auth.currentUser;
    if (!user) return;

    const ref = doc(this.firestore, 'tecnicos', user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data();
    } else {
      return null;
    }
  }
}
