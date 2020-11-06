import { Injectable } from '@angular/core';
import { Client } from './client';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';

@Injectable({
  providedIn: 'root'
})

export class ClientApiService {

  endpoint: string = 'http://localhost:8000/api/client';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  clients: Observable<Client[]>;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) { }

  // Add client
  AddClient(data: Client): Observable<any> {
    console.log('data client: ', data);
    let API_URL = `${this.endpoint}/add-client`;
    this.store.dispatch({
      type: 'ADD_CLIENT',
      payload: data
      //   {
      //   _id: data._id,
      //   business_name: data.business_name,
      //   person_name: data.person_name,
      //   department_name: data.department_name,
      //   address: data.address,
      //   zip_code: data.zip_code,
      //   city: data.city,
      //   rate: data.rate,
      //   finance_email_address: data.finance_email_address,
      //   invoice_inner: data.invoice_inner,
      //   payment_days: data.payment_days,
      //   start_date: data.start_date,
      //   end_date: data.end_date,
      //   vat: data.vat
      // } as Client
    });

    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all clients
  GetClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.endpoint}`);
  }

  // Get client
  GetClient(id): Observable<any> {
    let API_URL = `${this.endpoint}/read-client/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  // Update client
  UpdateClient(id, data): Observable<any> {
    let API_URL = `${this.endpoint}/update-client/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Delete client
  DeleteClient(id): Observable<any> {
    var API_URL = `${this.endpoint}/delete-client/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
