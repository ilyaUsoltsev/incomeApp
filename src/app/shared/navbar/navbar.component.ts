import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string;
  subscription: Subscription = new Subscription();
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription =
    this.store.select('auth')
    .pipe( filter( auth => auth.user != null))
    .subscribe( (auth) => {
      this.userName = auth.user.name;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
