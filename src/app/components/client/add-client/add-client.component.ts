import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ClientApiService } from '../../../shared/client/clientapi.service';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})

export class AddClientComponent implements OnInit {
  visible = true;
  selectable = true;
  selected = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList') chipList;
  @ViewChild('resetClientForm') myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clientForm: FormGroup;
  subjectArray: Subject[] = [];
  DepartmentArray: any = ['Financiën', 'Administratie', 'Debiteuren'];
  floatLabelControl = new FormControl('always');

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private clientApi: ClientApiService,
    public datePipe: DatePipe
  ) {
    this.clientForm = fb.group({
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {
    this.submitFieldsForm();
  }

  /* Reactive field form */
  submitFieldsForm() {
    this.clientForm = this.fb.group({
      business_name: ['', [Validators.required]],
      person_name: ['', [Validators.required]],
      department_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zip_code: ['', [Validators.required]],
      city: ['', [Validators.required]],
      rate: ['75', [Validators.required]],
      finance_email_address: ['', [Validators.required, Validators.email]],
      invoice_inner: ['week', [Validators.required]],
      payment_days: ['14', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', []],
      vat: [true, []],
      floatLabel: this.floatLabelControl,
    })
  }

  /* Date */
  formatStartDate(e) {
    const convertDate = moment(new Date(e.target.value).toISOString()).format("YYYY-MM-DD");
    this.clientForm.get('start_date').setValue(convertDate, {
      onlyself: true
    })
  }

  formatEndDate(e) {
    const convertDate = moment(new Date(e.target.value).toISOString()).format("YYYY-MM-DD");
    this.clientForm.get('end_date').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.clientForm.controls[controlName].hasError(errorName);
  }

  /* Submit clientForm */
  submitClientForm() {
    if (this.clientForm.valid) {
      this.clientApi.AddClient(this.clientForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/clients-list'))
      });
    }
  }
}
