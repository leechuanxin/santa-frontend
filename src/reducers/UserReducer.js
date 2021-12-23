export const initialState = {};

const ADD = 'ADD';
const DELETE = 'DELETE';

export function userReducer(state, action) {
  let obj = {
    ...state,
  };

  if (action && action.payload && action.payload.user) {
    obj = {
      ...obj,
      ...action.payload.user,
    };
  }

  switch (action.type) {
    case ADD:
      if (action.payload.user && !action.payload.user.username) {
        delete obj.username;
      }
      return {
        ...obj,
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
