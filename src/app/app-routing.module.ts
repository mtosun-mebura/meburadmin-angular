import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddClientComponent } from './components/client/add-client/add-client.component';
import { EditClientComponent } from './components/client/edit-client/edit-client.component';
import { ClientsListComponent} from './components/client/clients-list/clients-list.component';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { EditProjectComponent } from './components/project/edit-project/edit-project.component';
import { ProjectsListComponent } from './components/project/projects-list/projects-list.component';
import { AddTimesheetComponent } from './components/timesheet/add-timesheet/add-timesheet.component';
import { EditTimesheetComponent } from './components/timesheet/edit-timesheet/edit-timesheet.component';
import { TimesheetsListComponent } from './components/timesheet/timesheets-list/timesheets-list.component';
import {AddInvoiceComponent} from './components/invoice/add-invoice/add-invoice.component';
import {InvoicesListComponent} from './components/invoice/invoices-list/invoices-list.component';
import {EditInvoiceComponent} from './components/invoice/edit-invoice/edit-invoice.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'add-client' },
  { path: 'add-client', component: AddClientComponent },
  { path: 'edit-client/:id', component: EditClientComponent },
  { path: 'clients-list', component: ClientsListComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'edit-project/:id', component: EditProjectComponent },
  { path: 'projects-list', component: ProjectsListComponent },
  { path: 'add-timesheet', component: AddTimesheetComponent },
  { path: 'edit-timesheet/:id', component: EditTimesheetComponent },
  { path: 'timesheets-list', component: TimesheetsListComponent },
  { path: 'add-invoice', component: AddInvoiceComponent },
  { path: 'edit-invoice/:id', component: EditInvoiceComponent },
  { path: 'invoices-list', component: InvoicesListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
