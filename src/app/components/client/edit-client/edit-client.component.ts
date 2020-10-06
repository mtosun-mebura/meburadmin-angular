import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ClientApiService } from '../../../shared/client/clientapi.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})

export class EditClientComponent implements OnInit {
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

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private clientApi: ClientApiService
  ) {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.clientApi.GetClient(id).subscribe(data => {
      this.clientForm = this.fb.group({
        business_name: [data.business_name, [Validators.required]],
        person_name: [data.person_name, [Validators.required]],
        department_name: [data.department_name, [Validators.required]],
        address: [data.address, [Validators.required]],
        zip_code: [data.zip_code, [Validators.required]],
        city: [data.city, [Validators.required]],
        rate: [data.rate, [Validators.required]],
        finance_email_address: [data.finance_email_address, [Validators.required, Validators.email]],
        invoice_inner: [data.invoice_inner, [Validators.required]],
        payment_days: [data.payment_days, [Validators.required]],
        start_date: [data.start_date, [Validators.required]],
        end_date: [data.end_date, [Validators.required]]
      })
    })
  }

  /* Reactive book form */
  updateBookForm() {
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
      end_date: ['', []]
    })
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove dynamic languages */
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
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

  /* Update book */
  updateClientForm() {
    var id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.clientApi.UpdateClient(id, this.clientForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/clients-list'))
      });
    }
  }

  cancel() {
      this.router.navigateByUrl('/clients-list');
  }

}
