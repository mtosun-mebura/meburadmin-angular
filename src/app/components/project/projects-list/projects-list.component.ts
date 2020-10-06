import { Component, ViewChild, OnInit } from '@angular/core';
import { Project } from '../../../shared/project/project';
import { ProjectApiService } from '../../../shared/project/projectapi.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Client} from '../../../shared/client/client';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  ProjectData: any = [];
  dataSource: MatTableDataSource<Project>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['business_name', 'project_code', 'project_name', 'action'];

  constructor(private projectApi: ProjectApiService) {
    this.projectApi.GetProjects().subscribe(data => {
      this.ProjectData = data;
      this.dataSource = new MatTableDataSource<Project>(this.ProjectData);
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
      this.projectApi.DeleteProject(e._id).subscribe()
    }
  }
}
