import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  constructor() { }

  getDayByDate(date) {
    const check = moment(date, 'YYYY/MM/DD');
    return check.format('dddd');
  }

  convertDate(date) {
    return moment(new Date(date).toISOString()).format('YYYY-MM-DD');
    // return moment(new Date(date).toISOString()).format('DD-MM-YYYY');
  }

  convertDateNl(date) {
    return moment(new Date(date).toISOString()).format('DD-MM-YYYY');
  }

  getWeeks() {
    // return 53 weeks
    return Array.from({length: 53}, (_, i) => i + 1);
  }

  getYears() {
    // return years from 2018
    const startYear = 2018;
    const yearLength = (moment().year() - startYear) + 1;

    return Array.from(new Array(yearLength), (val, index) => index + startYear);
  }

  getMonths() {
    const months = moment.months();

    // console.log('index months: ', months.splice(index, 0, item));
  }

}
