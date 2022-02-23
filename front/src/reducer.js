export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const UPDATE_USER = 'UPDATE_USER';

const initialState = {
  users: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER: {
      return { ...state, users: [...state.users, action.payload] };
    }
    case REMOVE_USER: {
      return {
        ...state,
        users: state.users.filter(({ id }) => id != action.payload),
      };
    }
    case UPDATE_USER: {
      const users = state.users.filter(({ id }) => id != action.payload.id);
      return {
        ...state,
        users: [...users, action.payload],
      };
    }
    default:
      return state;
  }
};

export default reducer;
