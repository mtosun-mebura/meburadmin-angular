import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ClientApiService} from '../../../shared/client/clientapi.service';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from '../../../shared/client/client';
import {ProjectApiService} from '../../../shared/project/projectapi.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  ClientData: any = [];
  dataSource: MatTableDataSource<Client>;
  @ViewChild('resetProjectForm', { static: true }) myNgForm;
  projectForm: FormGroup;
  selected = true;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private projectApi: ProjectApiService,
    private clientApi: ClientApiService
  ) {
    this.clientApi.GetClients().subscribe(data => {
      this.ClientData = data;
      this.dataSource = new MatTableDataSource<Client>(this.ClientData);
    })
  }

  ngOnInit(): void {
    this.submitFieldsForm();
  }

  /* Reactive field form */
  submitFieldsForm() {
    this.projectForm = this.fb.group({
      client_id: ['', [Validators.required]],
      project_code: ['', [Validators.required]],
      project_name: ['', [Validators.required]]
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.projectForm.controls[controlName].hasError(errorName);
  }

  /* Submit project */
  submitProjectForm() {
    if (this.projectForm.valid) {
      this.projectApi.AddProject(this.projectForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/projects-list'))
      });
    }
  }
}
