import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import {filter} from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  userName: string;
  subscription: Subscription = new Subscription();
  constructor(private authService: AuthService,
              private ingresoEgresoSevice: IngresoEgresoService,
              private store: Store<AppState>) { }

              ngOnInit() {
                this.subscription =
                this.store.select('auth')
                .pipe( filter( auth => auth.user != null))
                .subscribe( (auth) => {
                  this.userName = auth.user.name;
                });
              }

  signoutUser() {
    this.authService.logoutUser();
    this.ingresoEgresoSevice.cancelSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
