import {Client} from '../../../shared/client/client';
import {ClientApiService} from '../../../shared/client/clientapi.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {ClientActionTypes} from '../../../shared/client/client.types';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})

export class ClientsListComponent implements OnInit {
  clientDataLength = 0;
  dataSource: MatTableDataSource<Client>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = ['business_name', 'city', 'start_date', 'end_date', 'rate', 'payment_days', 'action'];
  client: Observable<Client[]>;

  constructor(
    private clientApi: ClientApiService,
    private store: Store<{ client: Client[] }>
  ) {
    this.store.select(state => state.client).subscribe(values => {
      console.log('constructor: ', this.client);
      this.clientDataLength = values.length;
      this.dataSource = new MatTableDataSource<Client>(values);
    });
    // get clients from store
    // store.pipe(select('client')).subscribe(values => {
    //   this.clientDataLength = values.length;
    //   this.dataSource = new MatTableDataSource<Client>(values);
    //   setTimeout(() => {
    //     this.dataSource.paginator = this.paginator;
    //   }, 0);
    // });
  }

  ngOnInit(): void {
    console.log('oninit');
    this.setClientsToStore();
  }

  setClientsToStore = () => {
    console.log('set clients to store');
    // get clients from api and add to store
    this.clientApi.GetClients().subscribe(data => {
      this.store.dispatch({
        type: ClientActionTypes.FETCH_ALL_CLIENTS,
        payload: data
      });
    });
  }

  deleteClient = (index: number, e) => {
    if (window.confirm('Weet je zeker dat je wilt verwijderen?')) {
      // delete item from store
      this.store.dispatch({
        type: ClientActionTypes.DELETE_CLIENT,
        payload: {id: e._id}
      });

      // delete item from mongodb
      this.clientApi.DeleteClient(e._id).subscribe();
    }
  }

  convertDate = (date) => {
    return moment(new Date(date).toISOString()).format('DD-MM-YYYY');
  }
}
