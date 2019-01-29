import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import {map} from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { StartLoadingAction, StopLoadingAction } from '../shared/ui.actions';
import { SetUserAction, UnSetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';
import { UnSetItemsAction } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private currentUser: User;

  constructor(private afAuth: AngularFireAuth,
      private afDB: AngularFirestore,
     private router: Router,
      private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      if (fbUser) { this.userSubscription =
        this.afDB.doc(`${ fbUser.uid }/user`).valueChanges()
          .subscribe( (userObj: any) => {
            const newUser = new User( userObj);
            this.store.dispatch(new SetUserAction(newUser));
            this.currentUser = newUser;
          });
      } else {
        this.currentUser = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  createUser (name: string, email: string, password: string) {

    this.store.dispatch(new StartLoadingAction());

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
            this.store.dispatch(new StopLoadingAction());
          });
      })
      .catch(error => {
        this.store.dispatch(new StopLoadingAction());
        Swal.fire('error', error.message, 'error');
      });
  }

  loginUser (email: string, password: string ) {
    this.store.dispatch(new StartLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((response) => {
      this.router.navigate(['/']);
      this.store.dispatch(new StopLoadingAction());
    })
    .catch(error => {
      this.store.dispatch(new StartLoadingAction());
      Swal.fire('error');
    });
  }

  logoutUser() {
    this.afAuth.auth.signOut().then(
      () => {
        this.store.dispatch(new UnSetUserAction());
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

  getCurrentUser() {
    return {...this.currentUser};
  }

}
