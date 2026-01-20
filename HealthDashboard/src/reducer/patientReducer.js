export const initialState = {
  patients: [],
  filter: 'All',
  searchQuery: ''
};

export const patientReducer = (state, action) => {
  switch(action.type){
    case 'ADD_PATIENT':
      return {...state, patients: [...state.patients, action.payload]};
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PATIENT':
      return {...state, patients: state.patients.filter(p => p.id !== action.payload)};
    case 'SET_FILTER':
      return {...state, filter: action.payload};
    case 'SET_SEARCH':
      return {...state, searchQuery: action.payload};
    default:
      return state;
  }
};
