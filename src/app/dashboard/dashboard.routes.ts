import { Routes } from '@angular/router';
import { StatisticaComponent } from '../ingreso-egreso/statistica/statistica.component';
import { IngresoEgresoComponent } from '../ingreso-egreso/ingreso-egreso.component';
import { DetailsComponent } from '../ingreso-egreso/details/details.component';



export const dashboardRoutes: Routes = [
  {path: '', component: StatisticaComponent},
  {path: 'ingreso-egreso', component: IngresoEgresoComponent},
  {path: 'details', component: DetailsComponent}
];

