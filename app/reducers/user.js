import { combineReducers } from 'redux';

import { polyfill } from 'es6-promise';
import request from 'axios';
import { push } from 'react-router-redux';

polyfill();

export const TOGGLE_LOGIN_MODE = 'goodstick/user/TOGGLE_LOGIN_MODE';
export const MANUAL_LOGIN_USER = 'goodstick/user/MANUAL_LOGIN_USER';
export const LOGIN_SUCCESS_USER = 'goodstick/user/LOGIN_SUCCESS_USER';
export const LOGIN_ERROR_USER = 'goodstick/user/LOGIN_ERROR_USER';
export const SIGNUP_USER = 'goodstick/user/SIGNUP_USER';
export const SIGNUP_SUCCESS_USER = 'goodstick/user/SIGNUP_SUCCESS_USER';
export const SIGNUP_ERROR_USER = 'goodstick/user/SIGNUP_ERROR_USER';
export const LOGOUT_USER = 'goodstick/user/LOGOUT_USER';
export const LOGOUT_SUCCESS_USER = 'goodstick/user/LOGOUT_SUCCESS_USER';
export const LOGOUT_ERROR_USER = 'goodstick/user/LOGOUT_ERROR_USER';

const isLogin = (
  state = true,
  action
) => {
  switch (action.type) {
    case TOGGLE_LOGIN_MODE:
      return !state;
    default:
      return state;
  }
};

const messageProcessor = (
  state = '',
  action
) => {
  switch (action.type) {
    case TOGGLE_LOGIN_MODE:
    case MANUAL_LOGIN_USER:
    case SIGNUP_USER:
    case LOGOUT_USER:
    case LOGIN_SUCCESS_USER:
    case SIGNUP_SUCCESS_USER:
      return '';
    case LOGIN_ERROR_USER:
    case SIGNUP_ERROR_USER:
      return action.message;
    default:
      return state;
  }
};

const isWaiting = (
  state = false,
  action
) => {
  switch (action.type) {
    case MANUAL_LOGIN_USER:
    case SIGNUP_USER:
    case LOGOUT_USER:
      return true;
    case LOGIN_SUCCESS_USER:
    case SIGNUP_SUCCESS_USER:
    case LOGOUT_SUCCESS_USER:
    case LOGIN_ERROR_USER:
    case SIGNUP_ERROR_USER:
    case LOGOUT_ERROR_USER:
      return false;
    default:
      return state;
  }
};

const authenticated = (
  state = false,
  action
) => {
  switch (action.type) {
    case LOGIN_SUCCESS_USER:
    case SIGNUP_SUCCESS_USER:
    case LOGOUT_ERROR_USER:
      return true;
    case LOGIN_ERROR_USER:
    case SIGNUP_ERROR_USER:
    case LOGOUT_SUCCESS_USER:
      return false;
    default:
      return state;
  }
};

const userReducer = combineReducers({
  isLogin,
  isWaiting,
  authenticated,
  message: messageProcessor
});

export default userReducer;

const getMessage = res => res.response && res.response.data && res.response.data.message;
/*
 * Utility function to make AJAX requests using isomorphic fetch.
 * You can also use jquery's $.ajax({}) if you do not want to use the
 * /fetch API.
 * @param Object Data you wish to pass to the server
 * @param String HTTP method, e.g. post, get, put, delete
 * @param String endpoint - defaults to /login
 * @return Promise
 */
function makeUserRequest(method, data, api = '/login') {
  return request[method](api, data);
}


// Log In Action Creators
export function beginLogin() {
  return { type: MANUAL_LOGIN_USER };
}

export function loginSuccess(message) {
  return {
    type: LOGIN_SUCCESS_USER,
    message
  };
}

export function loginError(message) {
  return {
    type: LOGIN_ERROR_USER,
    message
  };
}

// Sign Up Action Creators
export function signUpError(message) {
  return {
    type: SIGNUP_ERROR_USER,
    message
  };
}

export function beginSignUp() {
  return { type: SIGNUP_USER };
}

export function signUpSuccess(message) {
  return {
    type: SIGNUP_SUCCESS_USER,
    message
  };
}

// Log Out Action Creators
export function beginLogout() {
  return { type: LOGOUT_USER};
}

export function logoutSuccess() {
  return { type: LOGOUT_SUCCESS_USER };
}

export function logoutError() {
  return { type: LOGOUT_ERROR_USER };
}

export function toggleLoginMode() {
  return { type: TOGGLE_LOGIN_MODE };
}

export function manualLogin(data) {
  return dispatch => {
    dispatch(beginLogin());

    return makeUserRequest('post', data, '/login')
      .then(response => {
        if (response.status === 200) {
          dispatch(loginSuccess(response.data.message));
          dispatch(push('/'));
        } else {
          dispatch(loginError('Oops! Something went wrong!'));
        }
      })
      .catch(err => {
        dispatch(loginError(getMessage(err)));
      });
  };
}

export function signUp(data) {
  return dispatch => {
    dispatch(beginSignUp());

    return makeUserRequest('post', data, '/signup')
      .then(response => {
        if (response.status === 200) {
          dispatch(signUpSuccess(response.data.message));
          dispatch(push('/'));
        } else {
          dispatch(signUpError('Oops! Something went wrong'));
        }
      })
      .catch(err => {
        dispatch(signUpError(getMessage(err)));
      });
  };
}

export function logOut() {
  return dispatch => {
    dispatch(beginLogout());

    return makeUserRequest('post', null, '/logout')
      .then(response => {
        if (response.status === 200) {
          dispatch(logoutSuccess());
        } else {
          dispatch(logoutError());
        }
      });
  };
}

