import {Injectable} from '@angular/core';
import {Invoice} from './invoice';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class InvoiceApiService {

  endpoint: string = 'http://localhost:8000/api/invoice';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Add invoice
  AddInvoice(data: Invoice): Observable<any> {
    let API_URL = `${this.endpoint}/add-invoice`;
    data.month = moment(data.date).month();
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all invoices by year, month and client
  GetInvoices(chosenYear = null, chosenMonth = null, chosenClient = null) {
    return this.http.get(`${this.endpoint}/${chosenYear}/${chosenMonth}/${chosenClient}`);
  }

  // Get invoice number
  GetAllInvoices() {
    return this.http.get(`${this.endpoint}`);
  }

  // Get invoice
  GetInvoice(id): Observable<any> {
    let API_URL = `${this.endpoint}/read-invoice/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  // Update invoice
  UpdateInvoice(id, data): Observable<any> {
    let API_URL = `${this.endpoint}/update-invoice/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Delete invoice
  DeleteInvoice(id): Observable<any> {
    var API_URL = `${this.endpoint}/delete-invoice/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get invoice-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
