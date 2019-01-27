import * as fromUI from './ui.actions';
import { Statement } from '@angular/compiler';


export interface State {
  isLoading: boolean;
}

const initState: State = {
  isLoading: false
};


export function uiReducer( state = initState, action: fromUI.actions): State {
  switch (action.type) {

    case fromUI.START_LOADING:
      return {
        isLoading: true
      };
    case fromUI.STOP_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
}
