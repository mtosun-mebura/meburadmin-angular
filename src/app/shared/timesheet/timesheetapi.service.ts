import {Injectable} from '@angular/core';
import {Timesheet} from './timesheet';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class TimesheetApiService {

  endpoint: string = 'http://localhost:8000/api/timesheet';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Add timesheet
  AddTimesheet(data: Timesheet): Observable<any> {
    let API_URL = `${this.endpoint}/add-timesheet`;
    data.month = moment(data.date).month();
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all timesheets
  GetTimesheets(chosenYear = null, chosenWeek = null) {
    return this.http.get(`${this.endpoint}/${chosenYear}/${chosenWeek}`);
  }

  // Get all timesheets
  GetTimesheetsMonth(chosenYear = null, chosenMonth = null) {
    return this.http.get(`${this.endpoint}/invoice/${chosenYear}/${chosenMonth}`);
  }

  // Get timesheet
  GetTimesheet(id): Observable<any> {
    let API_URL = `${this.endpoint}/read-timesheet/val/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  // Update timesheet
  UpdateTimesheet(id, data): Observable<any> {
    let API_URL = `${this.endpoint}/update-timesheet/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Delete timesheet
  DeleteTimesheet(id): Observable<any> {
    var API_URL = `${this.endpoint}/delete-timesheet/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get timesheet-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
