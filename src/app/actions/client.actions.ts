import { Action } from '@ngrx/store';
import { ClientActionTypes } from '../shared/client/client.types';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from '../shared/client/client';
import {ClientApiService} from '../shared/client/clientapi.service';
import { select, Store } from '@ngrx/store';

export class ActionParent implements Action {
  type: any;
  payload: any;
}

export class FetchAllClients implements ActionParent {
  type: ClientActionTypes.FETCH_ALL_CLIENTS;
  constructor(public payload: any) {}
}

export class DeleteClient implements ActionParent {
  type: ClientActionTypes.DELETE_CLIENT;
  constructor(public payload: any) {}
}
