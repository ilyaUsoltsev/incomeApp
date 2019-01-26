import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import {map} from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
      private afDB: AngularFirestore,
     private router: Router) { }

  // initAuthListener() {
  //   this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
  //     console.log(fbUser);
  //   });
  // }

  createUser (name: string, email: string, password: string) {

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((response) => {

        const user: User = {
          uid: response.user.uid,
          name: name,
          email: response.user.email
        };

        this.afDB.doc(`${user.uid}/user`)
          .set( user )
          .then( () => {
            this.router.navigate(['/']);
          });

        this.router.navigate(['/']);
      })
      .catch(error => {

      });

  }

  loginUser (email: string, password: string ) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((response) => {

      this.router.navigate(['/']);
    })
    .catch(error => {

      Swal.fire('error');
    });
  }

  logoutUser() {
    this.afAuth.auth.signOut().then(
      () => {
        this.router.navigate(['/login']);
      }
    );

  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {
          if ( fbUser == null ) {
            this.router.navigate(['/login']);
          }
          return fbUser != null;
        })
    );
  }

}
