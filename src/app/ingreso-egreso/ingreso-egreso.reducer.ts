



import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngressoEgreso } from './ingreso-egreso.model';

export interface IngresoEgresoState {
  items: IngressoEgreso[];
}

const initialState: IngresoEgresoState = {
  items: []
};

export function ingresoEgresoReducer(state = initialState, action: fromIngresoEgreso.actions): IngresoEgresoState {

  switch ( action.type ) {
    case fromIngresoEgreso.SET_ITEMS:
      return {
        items: [...action.items.map(i => {
          return {...i};
        } )]
      };

    case fromIngresoEgreso.UNSET_ITEMS:
      return {
        items: []
      };

    default:
      return state;
  }

}



