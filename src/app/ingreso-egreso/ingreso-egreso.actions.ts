import { Action } from '@ngrx/store';
import { IngressoEgreso } from './ingreso-egreso.model';


export const SET_ITEMS = '[Ingreso Egreso] set items';
export const UNSET_ITEMS = '[Ingreso Egreso] unset items';

export class SetItemsAction implements Action {
  readonly type = SET_ITEMS;

  constructor(public items: IngressoEgreso[]) {}
}
export class UnSetItemsAction implements Action {
  readonly type = UNSET_ITEMS;
}


export type actions = SetItemsAction | UnSetItemsAction;
