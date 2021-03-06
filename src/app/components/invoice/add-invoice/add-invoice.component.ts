import {ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {UtilsService} from '../../../shared/utils/utils.service';
import {PdfService} from '../../../shared/pdf/pdf.service';

import htmlToPdfmake from 'html-to-pdfmake';
import {MatTableDataSource} from '@angular/material/table';
import {Timesheet} from '../../../shared/timesheet/timesheet';
import {TimesheetApiService} from '../../../shared/timesheet/timesheetapi.service';
import {ClientApiService} from '../../../shared/client/clientapi.service';
import {InvoiceApiService} from '../../../shared/invoice/invoiceapi.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddInvoiceComponent implements OnInit {
  TimesheetData: any = [];
  ClientData: any = [];
  filteredData: any = [];
  clientInfo: any = [];
  invoiceData: any = [];
  invoicesData: any = [];
  dataSource: MatTableDataSource<Timesheet>;
  invoiceForm: FormGroup;
  chosenYear = moment().year();
  chosenMonth = moment().month();
  chosenClient = '';
  invoiceNumber = '';
  selectedDate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  invoiceNumberIndex: number = 1;
  monthsArray: any = moment.months();

  constructor(
    private timesheetApi: TimesheetApiService,
    private clientApi: ClientApiService,
    private invoiceApi: InvoiceApiService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    public utils: UtilsService,
    private pdfService: PdfService
  ) {
  }

  ngOnInit(): void {
    this.submitFieldsForm();
    this.getInvoiceNumber();
  }

  /* Reactive field form */
  submitFieldsForm() {
    this.invoiceForm = this.fb.group({
      year: [this.chosenYear, [Validators.required]],
      month: [this.chosenMonth, [Validators.required]],
      client_id: [this.chosenClient, [Validators.required]],
      date: ['', [Validators.required]],
      partial_invoice: [false, [Validators.required]],
      invoice_number: ['', [Validators.required]],
      invoice_number_index: ['', [Validators.required]],
    });

    this.invoiceForm.get('year').valueChanges.subscribe(yearValue => {
      this.chosenYear = yearValue;
      this.getTimesheetData(this.chosenYear, this.chosenMonth);
    });

    // onchange year update the data
    this.invoiceForm.get('month').valueChanges.subscribe(monthValue => {
      this.chosenMonth = monthValue;
      this.getTimesheetData(this.chosenYear, this.chosenMonth);
    });

    // onchange client update the data
    this.invoiceForm.get('client_id').valueChanges.subscribe(clientValue => {
      this.chosenClient = clientValue;
      this.filteredData = this.TimesheetData.filter(client => client.project_id.client_id._id === clientValue);
      this.clientInfo = this.getClientData(clientValue);
      this.getInvoiceData(this.chosenYear, this.chosenMonth, clientValue);
    });

    this.getTimesheetData(this.chosenYear, this.chosenMonth);

    this.clientsFromTimesheetData();
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.invoiceForm.controls[controlName].hasError(errorName);
  }

  getTimesheetData(chosenYear, chosenMonth) {
    this.timesheetApi.GetTimesheetsMonth(chosenYear, chosenMonth).subscribe(data => {
      this.TimesheetData = data;
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

  getInvoiceData = (chosenYear, chosenMonth, chosenClient) => {
    this.invoiceApi.GetInvoices(chosenYear, chosenMonth, chosenClient).subscribe(data => {
      this.invoiceData = data;
    });
  }

  getInvoiceNumber = () => {
    let invoice_number = '';
    let invoice_number_index = 1;
    this.invoiceApi.GetAllInvoices().subscribe(data => {
      this.invoicesData = data;
      if (this.invoicesData.length > 0) {
        invoice_number = this.chosenYear + '-' + this.utils.addZero(Number(this.invoicesData[0].invoice_number_index) + 1, 4);
        invoice_number_index = Number(this.invoicesData[0].invoice_number_index) + 1;
      } else {
        invoice_number = '';
        invoice_number_index = 1;
      }

      this.invoiceNumber = invoice_number;
      this.invoiceForm.patchValue({
        invoice_number
      });

      this.invoiceNumberIndex = invoice_number_index;
      this.invoiceForm.patchValue({
        invoice_number_index
      });
    });
  }

  /* Submit clientForm */
  submitInvoiceForm() {
    if (this.invoiceForm.valid) {
      this.invoiceApi.AddInvoice(this.invoiceForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/invoices-list'));
      });
    }
  }

  formatDate(e) {
    this.invoiceForm.get('date').setValue(this.utils.convertDate(e.target.value), {
      onlyself: true
    });

    this.selectedDate = moment(new Date(e.target.value).toISOString()).format("DD-MM-YYYY");
  }

}
