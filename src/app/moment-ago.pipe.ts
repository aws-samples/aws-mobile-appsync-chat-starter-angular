import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentAgo'
})
export class MomentAgoPipe implements PipeTransform {

  transform(value: any, format?: any): any {
    format = format || 'YYYY-MM-DD';
    const date = moment(parseInt(value)); // , format);
    return date.calendar(null, {
      sameDay: 'LT',
      lastDay: 'MMM D LT',
      lastWeek: 'MMM D LT',
      sameElse: 'l'
    });
  }

}
