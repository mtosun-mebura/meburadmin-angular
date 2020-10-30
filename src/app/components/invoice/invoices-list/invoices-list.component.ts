import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Project} from '../../../shared/project/project';
import {MatPaginator} from '@angular/material/paginator';
import {InvoiceApiService} from '../../../shared/invoice/invoiceapi.service';
import {UtilsService} from '../../../shared/utils/utils.service';
import {Invoice} from '../../../shared/invoice/invoice';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {
  InvoiceData: any = [];
  dataSource: MatTableDataSource<Invoice>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['date', 'client', 'invoice_number', 'partial_invoice', 'action'];

  constructor(
    private invoiceApi: InvoiceApiService,
    public utils: UtilsService
  ) {
    this.invoiceApi.GetAllInvoices().subscribe(data => {
      this.InvoiceData = data;
      this.dataSource = new MatTableDataSource<Invoice>(this.InvoiceData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    })
  }

  ngOnInit(): void {
  }

  deleteProject(index: number, e){
    if(window.confirm('Weet je zeker dat je wilt verwijderen?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.invoiceApi.DeleteInvoice(e._id).subscribe()
    }
  }
}
