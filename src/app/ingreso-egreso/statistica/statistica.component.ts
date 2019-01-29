import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngressoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-statistica',
  templateUrl: './statistica.component.html',
  styleUrls: ['./statistica.component.css']
})
export class StatisticaComponent implements OnInit, OnDestroy {

  incomes: number;
  outcomes: number;

  totalIncome: number;
  totalOutcome: number;

  subscription: Subscription = new Subscription();

  doughnutChartLabels = ['Income', 'Outcome'];
  doughnutChartData: number[];
  doughnutChartType = 'doughnut';

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
                            .subscribe( ingresoEgreso => {
                              this.countIncomeOutcome( ingresoEgreso.items);
                            });
  }

  countIncomeOutcome( items: IngressoEgreso[] ) {

    this.incomes = 0;
    this.outcomes = 0;

    this.totalIncome = 0;
    this.totalOutcome = 0;

    items.forEach( item => {
      if (item.type === 'income') {
        this.totalIncome += item.amount;
        this.incomes++;
      } else {
        this.totalOutcome += item.amount;
        this.outcomes++;
      }
    });

    this.doughnutChartData = [this.totalIncome, this.totalOutcome];

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
