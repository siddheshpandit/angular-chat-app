import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { ToastrService } from 'ngx-toastr';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireAuth: AngularFireAuth,
    private firedb: AngularFireDatabase,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register(user: User) {
    this.fireAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        console.log(result);
        user.uid = result.user?.uid || '';
        user.displayName = result.user?.displayName || user.name;
        user.emailVerified = result.user?.emailVerified || false;
        user.imageUrl =
          result.user?.photoURL || 'https://i.stack.imgur.com/l60Hf.png';
        this.saveUserData(user)
          .then((data) => {
            console.log(data);
            this.saveUserDataToLocalStorage(user);
            this.toastr.success('User Saved Successfully');
            this.router.navigate(['dashboard'])
          })
          .catch(() => {
            console.log('Error Saving Data');
            this.toastr.error('Error Saing');
          });
      })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Error in signup.');
      });
  }

  saveUserData(user: User) {
    const userObjRef: AngularFireObject<User> = this.firedb.object(
      `users/${user.uid}`
    );
    return userObjRef.set(user);
  }

  saveUserDataToLocalStorage(user: User | null){
    localStorage.setItem('user',JSON.stringify(user));
  }
  get LoggedInStatus() {
    const userString = localStorage.getItem('user');
    if (userString == null) {
      return false;
    }
    return JSON.parse(userString);
  }

  logoutFromLocalStorage() {
    localStorage.removeItem('user');
  }

  logoutFromFirebase() {
    this.fireAuth
      .signOut()
      .then(() => {
        this.logoutFromLocalStorage();
        this.router.navigate(['login']);
      })
      .catch((error) => {
        this.toastr.error('Error Logging out');
      });
  }

  login(email: string, password: string) {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      
  }


  getUserByUserId(uid:string | undefined):Observable<User| null>{
    const objRef:AngularFireObject<User>= this.firedb.object(`users/${uid}`);
    return objRef.valueChanges();
  }
}
