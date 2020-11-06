import { Client } from '../../shared/client/client';
import { ActionParent } from '../../actions/client.actions';
import { ClientActionTypes } from '../../shared/client/client.types';

// export const ADD_CLIENT = 'ADD_CLIENT';
export const initialState = {
  client: []
};

export function ClientReducer(state: Client[] = [], action: ActionParent) {
  console.log('action type: ', action.type);
  switch (action.type) {
    case ClientActionTypes.FETCH_ALL_CLIENTS:
      return [
        ...state,
        ...action.payload
      ];
    case ClientActionTypes.ADD_CLIENT:
      return [
        ...state,
        ...action.payload
      ];
    case ClientActionTypes.DELETE_CLIENT:
      console.log('delete');
      return state.filter(client => client._id !== action.payload.id);
    default:
      return state;
  }
}
