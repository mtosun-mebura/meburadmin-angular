import { Client } from '../../../shared/client/client';
import { ClientApiService } from '../../../shared/client/clientapi.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})

export class ClientsListComponent implements OnInit {
  ClientData: any = [];
  dataSource: MatTableDataSource<Client>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['business_name', 'city', 'start_date', 'end_date', 'rate', 'payment_days', 'action'];

  constructor(private clientApi: ClientApiService) {
    this.clientApi.GetClients().subscribe(data => {
      this.ClientData = data;
      this.dataSource = new MatTableDataSource<Client>(this.ClientData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    })
  }

  ngOnInit() { }

  deleteClient(index: number, e){
    if(window.confirm('Weet je zeker dat je wilt verwijderen?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.clientApi.DeleteClient(e._id).subscribe()
    }
  }

  convertDate(date) {
    const convertDate = moment(new Date(date).toISOString()).format("DD-MM-YYYY");
    return convertDate;
  }

}
