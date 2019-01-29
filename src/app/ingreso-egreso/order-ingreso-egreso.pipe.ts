import { Pipe, PipeTransform } from '@angular/core';
import { IngressoEgreso } from './ingreso-egreso.model';

@Pipe({
  name: 'orderIngresoEgreso'
})
export class OrderIngresoEgresoPipe implements PipeTransform {

  transform(items: IngressoEgreso[]): IngressoEgreso[] {
    return items.sort( (a, b) => {
      if ( a.type === 'income' ) {
        return -1;
      } else {
        return 1;
      }
    });
  }

}
