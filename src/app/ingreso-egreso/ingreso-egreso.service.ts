import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngressoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnSetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(private afDB: AngularFirestore,
               private authService: AuthService,
              private store: Store<AppState>) { }


  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store.select('auth')
        .pipe(
          filter(auth => auth.user != null)
        )
        .subscribe((auth) => {
        this.ingresoEgresoItems(auth.user.uid);
    });
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscription =
    this.afDB.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( (docData) => {
          return docData.map( doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe( (collection: any[]) => {
        this.store.dispatch( new SetItemsAction(collection));
      });
  }

  createIncomeOutcome(incomeOutcome: IngressoEgreso) {

    const user = this.authService.getCurrentUser();

    return this.afDB.doc(`${user.uid}/ingresos-egresos`)
      .collection('items').add({...incomeOutcome});
  }

  cancelSubscriptions() {
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.store.dispatch( new UnSetItemsAction());
  }

  deleteIngresoIngreso( uid: string) {
    const user = this.authService.getCurrentUser();
    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
      .delete();
  }
}
