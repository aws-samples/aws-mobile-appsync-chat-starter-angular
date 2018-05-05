import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentAgo'
})
export class MomentAgoPipe implements PipeTransform {

  transform(value: any): any {
    const date = moment(value);
    return date.calendar(null, {
      sameDay: 'LT',
      lastDay: 'MMM D LT',
      lastWeek: 'MMM D LT',
      sameElse: 'l'
    });
  }

}
