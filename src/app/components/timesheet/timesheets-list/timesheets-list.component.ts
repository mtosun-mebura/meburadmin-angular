import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Timesheet} from '../../../shared/timesheet/timesheet';
import {MatPaginator} from '@angular/material/paginator';
import {TimesheetApiService} from '../../../shared/timesheet/timesheetapi.service';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProjectApiService} from '../../../shared/project/projectapi.service';
import {UtilsService} from '../../../shared/utils/utils.service';
import 'moment/locale/nl';

@Component({
  selector: 'app-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.css']
})

export class TimesheetsListComponent implements OnInit {
  TimesheetData: any = [];
  ProjectData: any = [];
  ELEMENT_DATA: Timesheet[] = [];
  dataSource: MatTableDataSource<Timesheet>;
  dataSourceInput = new MatTableDataSource<Timesheet>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('resetTimesheetForm', { static: true }) myNgForm;
  displayedColumns: string[] = ['day', 'date', 'project_name', 'description', 'hours', 'action'];
  weekDaysArray = moment.weekdays(true);
  chosenYear = moment().year();
  chosenWeek = moment().week();
  timesheetForm: FormGroup;
  selected: true;
  selectedDay = '';
  selectedWeek = '';
  selectedYear = '';
  startYear = 2018;
  yearLength = (moment().year() - this.startYear) + 1;
  day = '';

  constructor(
    private timesheetApi: TimesheetApiService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private projectApi: ProjectApiService,
    public utils: UtilsService
  ) {
    this.getTimesheetData(this.chosenYear, this.chosenWeek);

    this.projectApi.GetProjects().subscribe(data => {
      this.ProjectData = data;
    });
  }

  ngOnInit(): void {
    this.submitFieldsForm();
  }

  getTimesheetData(chosenYear, chosenWeek) {
    this.timesheetApi.GetTimesheets(chosenYear, chosenWeek).subscribe(data => {
      this.TimesheetData = data;
      console.log('TimesheetData: ', data);
      this.dataSource = new MatTableDataSource<Timesheet>(this.TimesheetData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  /* Reactive field form */
  submitFieldsForm() {
    this.timesheetForm = this.fb.group({
      year: [this.chosenYear, [Validators.required]],
      week: [this.chosenWeek, [Validators.required]],
      day: ['', ''],
      date: ['', [Validators.required]],
      project_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      hours: ['', [Validators.required]]
    });

    // onchange year update the data
    this.timesheetForm.get('date').valueChanges.subscribe(date => {
      this.selectedDay = this.utils.getDayByDate(date);
    })

    this.timesheetForm.get('year').valueChanges.subscribe(yearValue => {
      this.chosenYear = yearValue;
      this.getTimesheetData(this.chosenYear, this.chosenWeek);
    })

    // onchange year update the data
    this.timesheetForm.get('week').valueChanges.subscribe(weekValue => {
      this.chosenWeek = weekValue;
      this.getTimesheetData(this.chosenYear, this.chosenWeek);
    })
  }

  /* Submit project */
  submitTimesheetForm() {
    if (this.timesheetForm.valid) {
      this.timesheetApi.AddTimesheet(this.timesheetForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/timesheets-list'));
        this.getTimesheetData(this.chosenYear, this.chosenWeek);
      });
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.timesheetForm.controls[controlName].hasError(errorName);
  }

  deleteTimesheet(index: number, e){
    if (window.confirm('Weet je zeker dat je wilt verwijderen?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.timesheetApi.DeleteTimesheet(e._id).subscribe();
    }
  }

  formatDate(e) {
    this.timesheetForm.get('date').setValue(this.utils.convertDate(e.target.value), {
      onlyself: true
    });
  }

}
