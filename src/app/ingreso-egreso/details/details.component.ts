import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngressoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  items: IngressoEgreso[];
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription =
    this.store.select('ingresoEgreso')
      .subscribe( ingresoEgreso => {
        this.items = ingresoEgreso.items;
      });
  }

  deleteItem(item: IngressoEgreso) {
    this.ingresoEgresoService.deleteIngresoIngreso( item.uid )
      .then( () => {
        Swal.fire('Deleted!', item.description, 'success' );
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
