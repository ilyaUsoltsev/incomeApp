import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngressoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { StartLoadingAction, StopLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  type = 'income';

  loadingSubs: Subscription = new Subscription();
  isLoading: boolean;

  constructor(private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnInit() {

    this.loadingSubs = this.store.select('ui')
      .subscribe( ui => this.isLoading = ui.isLoading);

    this.forma = new FormGroup({
      'description': new FormControl('', Validators.required),
      'amount': new FormControl(0, Validators.min(0))
    });
  }

  createInputOutput() {

    this.store.dispatch( new StartLoadingAction());

    const inputOutput = new IngressoEgreso({...this.forma.value, type: this.type});
    this.ingresoEgresoService.createIncomeOutcome(inputOutput)
      .then(() => {
        this.store.dispatch( new StopLoadingAction());
        Swal.fire('Create', inputOutput.description, 'success');
        this.forma.reset({
          amount: 0
        });
        }
      )
      .catch();
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

}
