import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from '../../../shared/client/client';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectApiService} from '../../../shared/project/projectapi.service';
import {ClientApiService} from '../../../shared/client/clientapi.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  ClientData: any = [];
  dataSource: MatTableDataSource<Client>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  projectForm: FormGroup;
  selected = true;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private projectApi: ProjectApiService,
    private actRoute: ActivatedRoute,
    private clientApi: ClientApiService
  ) {
    this.clientApi.GetClients().subscribe(data => {
      this.ClientData = data;
      this.dataSource = new MatTableDataSource<Client>(this.ClientData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    })
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.projectApi.GetProject(id).subscribe(data => {
      this.projectForm = this.fb.group({
        client_id: [data.client_id, [Validators.required]],
        project_code: [data.project_code, [Validators.required]],
        project_name: [data.project_name, [Validators.required]],
      })
    })
  }

  ngOnInit(): void {
    this.updateFieldsForm();
  }

  /* Reactive field form */
  updateFieldsForm() {
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

  /* Update book */
  updateProjectForm() {
    var id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.projectApi.UpdateProject(id, this.projectForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/projects-list'))
      });
    }
  }

  cancel() {
    this.router.navigateByUrl('/projects-list');
  }
}
