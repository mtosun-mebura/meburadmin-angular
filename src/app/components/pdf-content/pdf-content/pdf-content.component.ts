import {ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-pdf-content',
  templateUrl: './pdf-content.component.html',
  styleUrls: ['./pdf-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PdfContentComponent implements OnInit {
  @Input() client: string;
  @Input() timesheetData: any[];
  @Input() clientInfo: any[];
  todaysDate = moment(new Date()).format('DD-MM-YYYY');
  listWeekHours: any = [];
  totalExclVat = 0;
  totalVat = 0;
  totalValue = 0;
  clientVat = 21;

  constructor() {
    console.log('timesheet: ', this.timesheetData);
    // this.sumWeekHours();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ', changes);
  }

  sumWeekHours = (timesheetData) => {
    console.log('sumWeekHours: ', timesheetData);
    if (timesheetData !== undefined) {
      const helper = {};
      let totalExclVat = 0;
      let clientVat = '';

      const result = timesheetData.reduce(function(r, o) {
        const key = o.week + '|' + o.project_id.client_id._id;
        o.subtotal = o.hours * o.project_id.client_id.rate;
        totalExclVat += o.subtotal;

        if (clientVat === '') {
          clientVat = o.project_id.client_id.vat;
        }

        if (!helper[key]) {
          helper[key] = Object.assign({}, o);
          r.push(helper[key]);
        } else {
          helper[key].hours += o.hours;
          helper[key].subtotal += o.subtotal;
        }
        return r;
      }, []);

      this.totalExclVat = totalExclVat;

      if (clientVat) {
        this.totalVat = totalExclVat / 100 * 21;
        this.clientVat = 21;
      } else {
        this.totalVat = 0;
        this.clientVat = 0;
      }
      this.totalValue = this.totalExclVat + this.totalVat;

      return result;
    }
  }

  groupBy = (array, f) => {
    const groups = {};
    array.forEach(function(o) {
      const group = JSON.stringify(f(o));

      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    console.log('groups: ', groups);
    return Object.keys(groups).map(function(group) {
      return groups[group];
    });
  }
}
