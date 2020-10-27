import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Timesheet} from '../../../shared/timesheet/timesheet';
import {MatPaginator} from '@angular/material/paginator';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TimesheetApiService} from '../../../shared/timesheet/timesheetapi.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectApiService} from '../../../shared/project/projectapi.service';
import {UtilsService} from '../../../shared/utils/utils.service';

@Component({
  selector: 'app-edit-timesheet',
  templateUrl: './edit-timesheet.component.html',
  styleUrls: ['./edit-timesheet.component.css']
})
export class EditTimesheetComponent implements OnInit {
  TimesheetData: any = [];
  ProjectData: any = [];
  dataSource: MatTableDataSource<Timesheet>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('resetTimesheetForm', { static: true }) myNgForm;
  displayedColumns: string[] = ['day', 'date', 'project_name', 'description', 'hours', 'action'];
  weekDaysArray = moment.weekdays(true);
  timesheetForm: FormGroup;
  selected: true;
  selectedDay = '';

  constructor(
    private timesheetApi: TimesheetApiService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private projectApi: ProjectApiService,
    public utils: UtilsService
  ) {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.timesheetApi.GetTimesheet(id).subscribe(data => {
      this.timesheetForm = this.fb.group({
        day: [data.day, [Validators.required]],
        date: [data.date, [Validators.required]],
        project_id: [data.project_id, [Validators.required]],
        description: [data.description, [Validators.required]],
        hours: [data.hours, [Validators.required]]
      })

      // onchange year update the data
      this.timesheetForm.get('date').valueChanges.subscribe(date => {
        console.log('date: ', date);
        this.selectedDay = this.utils.getDayByDate(date);
      })
    })

    this.projectApi.GetProjects().subscribe(data => {
      this.ProjectData = data;
    })
  }

  ngOnInit(): void {
    this.updateTsForm();
  }

  getTimesheetData() {
    this.timesheetApi.GetTimesheets().subscribe(data => {
      this.TimesheetData = data;
      this.dataSource = new MatTableDataSource<Timesheet>(this.TimesheetData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    })
  }

  /* Reactive field form */
  updateTsForm() {
    this.timesheetForm = this.fb.group({
      day: [{value: '', disabled: true}, Validators.required],
      date: ['', [Validators.required]],
      project_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      hours: ['', [Validators.required]]
    })
  }

  /* Update timesheet */
  updateTimesheetForm() {
    var id = this.actRoute.snapshot.paramMap.get('id');
      this.timesheetApi.UpdateTimesheet(id, this.timesheetForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/timesheets-list'))
      });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.timesheetForm.controls[controlName].hasError(errorName);
  }

  formatDate(e) {
    this.timesheetForm.get('date').setValue(this.utils.convertDate(e.target.value), {
      onlyself: true
    })
  }

  cancel() {
    this.router.navigateByUrl('/timesheets-list');
  }
}
