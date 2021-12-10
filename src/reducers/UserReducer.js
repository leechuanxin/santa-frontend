export const initialState = {};

const ADD = 'ADD';
const DELETE = 'DELETE';

export function userReducer(state, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        ...action.payload.user,
      };
    case DELETE:
      return {};
    default:
      return { ...state };
  }
}

export function addUser(user) {
  return {
    type: ADD,
    payload: {
      user: {
        ...user,
      },
    },
  };
}

export function deleteUser(user) {
  return {
    type: DELETE,
    payload: {
      user: {
        ...user,
      },
    },
  };
}
