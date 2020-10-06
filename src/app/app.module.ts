import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddClientComponent } from './components/client/add-client/add-client.component';
import { EditClientComponent } from './components/client/edit-client/edit-client.component';
import { ClientsListComponent } from './components/client/clients-list/clients-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { ClientApiService } from './shared/client/clientapi.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { EditProjectComponent } from './components/project/edit-project/edit-project.component';
import { ProjectsListComponent } from './components/project/projects-list/projects-list.component';
import { AddTimesheetComponent } from './components/timesheet/add-timesheet/add-timesheet.component';
import { EditTimesheetComponent } from './components/timesheet/edit-timesheet/edit-timesheet.component';
import { TimesheetListComponent } from './components/timesheet/timesheet-list/timesheet-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AddClientComponent,
    EditClientComponent,
    ClientsListComponent,
    AddProjectComponent,
    EditProjectComponent,
    ProjectsListComponent,
    AddTimesheetComponent,
    EditTimesheetComponent,
    TimesheetListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule
  ],
  providers: [ClientApiService, DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'nl-NL'}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
