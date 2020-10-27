import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {UtilsService} from '../../../shared/utils/utils.service';
import {PdfService} from '../../../shared/pdf/pdf.service';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
//
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import {MatTableDataSource} from '@angular/material/table';
import {Timesheet} from '../../../shared/timesheet/timesheet';
import {TimesheetApiService} from '../../../shared/timesheet/timesheetapi.service';
import {ClientApiService} from '../../../shared/client/clientapi.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})

export class AddInvoiceComponent implements OnInit {
  TimesheetData: any = [];
  ClientData: any = [];
  filteredData: any = [];
  clientInfo: any = [];
  dataSource: MatTableDataSource<Timesheet>;
  invoiceForm: FormGroup;
  chosenYear = moment().year();
  chosenMonth = moment().month();
  chosenClient = '';
  monthsArray: any = moment.months();

  constructor(
    private timesheetApi: TimesheetApiService,
    private clientApi: ClientApiService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    public utils: UtilsService,
    private pdfService: PdfService
  ) {
    console.log(this.chosenMonth);
  }

  ngOnInit(): void {
    this.submitFieldsForm();
  }

  /* Reactive field form */
  submitFieldsForm() {
    this.invoiceForm = this.fb.group({
      year: [this.chosenYear, [Validators.required]],
      month: [this.chosenMonth, [Validators.required]],
      client: [this.chosenClient, [Validators.required]],
    });

    this.invoiceForm.get('year').valueChanges.subscribe(yearValue => {
      this.chosenYear = yearValue;
      console.log('year: ', this.chosenYear);
      this.getTimesheetData(this.chosenYear, this.chosenMonth);
    });

    // onchange year update the data
    this.invoiceForm.get('month').valueChanges.subscribe(monthValue => {
      this.chosenMonth = monthValue;
      console.log('month: ', this.chosenMonth);
      this.getTimesheetData(this.chosenYear, this.chosenMonth);
    });

    // onchange client update the data
    this.invoiceForm.get('client').valueChanges.subscribe(clientValue => {
      this.chosenClient = clientValue;
      console.log('chosenClient: ', clientValue);
      this.filteredData = this.TimesheetData.filter(client => client.project_id.client_id._id === clientValue);
      console.log('filter data: ', this.filteredData);
      this.clientInfo = this.getClientData(clientValue);
      console.log('clientInfo: ',this.clientInfo);
      // this.getTimesheetData(this.chosenYear, this.chosenMonth);
    });

    this.getTimesheetData(this.chosenYear, this.chosenMonth);

    this.clientsFromTimesheetData();
    console.log('datasource: ', this.TimesheetData);
    // const grouped = this.groupBy(this.dataSource, client => client.project_id.client_id);
    // console.log(grouped);
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.invoiceForm.controls[controlName].hasError(errorName);
  }

  getTimesheetData(chosenYear, chosenMonth) {
    console.log('getTimesheetData');
    this.timesheetApi.GetTimesheetsMonth(chosenYear, chosenMonth).subscribe(data => {
      console.log('data month: ', data);
      this.TimesheetData = data;
      console.log('TimesheetData: ', data);
      this.dataSource = new MatTableDataSource<Timesheet>(this.TimesheetData);
    });
  }

  generatePdf() {
    this.pdfService.generatePdf(htmlToPdfmake(document.getElementById('timesheetPdf').innerHTML, {window:window, tableAutoSize:true}));
  }

  groupBy = (list, keyGetter) => {
    const clientArray: any = [];
    if (list !== undefined) {
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = clientArray[key];

        if (!collection) {
          if (!this.containsObject(key, clientArray)) {
            clientArray.push(key);
          }
        } else {
          if (collection.indexOf(item) === -1) {
            collection.push(item);
          }
        }
      });
      return clientArray;
    }
  }

  containsObject = (obj, list) => {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i]._id === obj._id) {
        return true;
      }
    }

    return false;
  }

  clientsFromTimesheetData() {
    console.log('clientsFromTimesheetData');
    const clients: any = [];
    this.timesheetApi.GetTimesheetsMonth(this.chosenYear, this.chosenMonth).subscribe(data => {
      const result = this.groupBy(data, client => client.project_id.client_id);
      result.forEach(function (value) {
        clients.push(value);
      });
      this.ClientData = clients;
    });
  }

  getClientData = (id) => {
    this.clientApi.GetClient(id).subscribe(data => {
      this.clientInfo = data;
    });
  }
}
