import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { polyfill } from 'es6-promise';
import axios from 'axios';
import expect from 'expect';
import * as actions from 'reducers/user';

polyfill();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Users Async Actions', () => {
  let sandbox;

  const initialState = {
    isLogin: true,
    message: '',
    isWaiting: false,
    authenticated: false
  };

  const response = {
    data: {
      message: 'Success'
    },
    status: 200
  };

  const data = {
    email: 'hello@world.com',
    password: '2BeOrNot2Be'
  };

  const errMsg = {
    response: {
      data: {
        message: 'Oops! Something went wrong!'
      }
    }
  };

  beforeEach(() => {
      sandbox = sinon.sandbox.create(); // eslint-disable-line
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('User Login', () => {
    it('dispatches MANUAL_LOGIN_USER and LOGIN_SUCCESS_USER when Manual Login returns status of 200 and routes user to /', (done) => {
      const expectedActions = [
        {
          type: actions.MANUAL_LOGIN_USER
        },
        {
          type: actions.LOGIN_SUCCESS_USER,
          message: response.data.message
        },
        {
          payload: {
            args: ['/'],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        }];

      sandbox.stub(axios, 'post').returns(Promise.resolve(response));

      const store = mockStore(initialState);
      store.dispatch(actions.manualLogin(data))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('dispatches MANUAL_LOGIN_USER and LOGIN_ERROR_USER when Manual Login returns status that is NOT 200', (done) => {
      const expectedActions = [
        {
          type: actions.MANUAL_LOGIN_USER
        },
        {
          type: actions.LOGIN_ERROR_USER,
          message: errMsg.response.data.message
        }];

      sandbox.stub(axios, 'post').returns(Promise.reject(errMsg));

      const store = mockStore(initialState);
      store.dispatch(actions.manualLogin(data))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });
  });

  describe('User Signup', () => {
    it('dispatches SIGNUP_USER and SIGNUP_SUCCESS_USER when Sign Up returns status of 200 and routes user to /', (done) => {
      const expectedActions = [
        {
          type: actions.SIGNUP_USER
        },
        {
          type: actions.SIGNUP_SUCCESS_USER,
          message: response.data.message
        },
        {
          payload: {
            args: ['/'],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        }];

      sandbox.stub(axios, 'post').returns(Promise.resolve(response));

      const store = mockStore(initialState);
      store.dispatch(actions.signUp(data))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('dispatches SIGNUP_USER and SIGNUP_ERROR_USER when Sign Up returns status of NOT 200', (done) => {
      const expectedActions = [
        {
          type: actions.SIGNUP_USER
        },
        {
          type: actions.SIGNUP_ERROR_USER,
          message: errMsg.response.data.message
        }
      ];

      sandbox.stub(axios, 'post').returns(Promise.reject(errMsg));

      const store = mockStore(initialState);
      store.dispatch(actions.signUp(data))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });
  });
  describe('User Logout', () => {
    it('dispatches SIGNUP_USER and SIGNUP_SUCCESS_USER when Sign Up returns status of 200 and routes user to /', (done) => {
      const expectedActions = [
        {
          type: actions.LOGOUT_USER
        },
        {
          type: actions.LOGOUT_SUCCESS_USER
        }];

      sandbox.stub(axios, 'post').returns(Promise.resolve({status: 200}));

      const store = mockStore(initialState);
      store.dispatch(actions.logOut(data))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('dispatches SIGNUP_USER and SIGNUP_ERROR_USER when Sign Up returns status of NOT 200', (done) => {
      const expectedActions = [
        {
          type: actions.SIGNUP_USER
        },
        {
          type: actions.SIGNUP_ERROR_USER,
        }];

      sandbox.stub(axios, 'post').returns(Promise.reject());

      const store = mockStore(initialState);
      store.dispatch(actions.logOut(data))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });
  });
});

describe('Users Action Creators', () => {
  describe('User Login', () => {
    it('beginLogin returns action type MANUAL_LOGIN_USER', () => {
      expect(actions.beginLogin()).toEqual({type: actions.MANUAL_LOGIN_USER});
    });

    it('loginSuccess returns action type LOGIN_SUCCESS_USER and a success message', () => {
      const message = 'Success';
      expect(actions.loginSuccess(message)).toEqual({type: actions.LOGIN_SUCCESS_USER, message});
    });

    it('loginError returns action type LOGIN_ERROR_USER and an error message', () => {
      const message = 'Oops! Something went wrong!';
      expect(actions.loginError(message)).toEqual({type: actions.LOGIN_ERROR_USER, message});
    });
  });
  describe('User Signup', () => {
    it('beginSignUp returns action type SIGNUP_USER', () => {
      expect(actions.beginSignUp()).toEqual({type: actions.SIGNUP_USER});
    });
    it('signUpSuccess returns action type SIGNUP_SUCCESS_USER and a success message', () => {
      const message = 'Success';
      expect(actions.signUpSuccess(message)).toEqual({type: actions.SIGNUP_SUCCESS_USER, message});
    });
    it('signUpError returns action type SIGNUP_ERROR_USER and an error message', () => {
      const message = 'Oops! Something went wrong!';
      expect(actions.signUpError(message)).toEqual({type: actions.SIGNUP_ERROR_USER, message});
    });
  });
  describe('User Logout', () => {
    it('beginLogout returns action type LOGOUT_USER', () => {
      expect(actions.beginLogout()).toEqual({type: actions.LOGOUT_USER});
    });
    it('signUpSuccess returns action type SIGNUP_SUCCESS_USER', () => {
      expect(actions.logoutSuccess()).toEqual({type: actions.LOGOUT_SUCCESS_USER});
    });
    it('signUpError returns action type SIGNUP_ERROR_USER', () => {
      expect(actions.logoutError()).toEqual({type: actions.LOGOUT_ERROR_USER});
    });
  });
});
