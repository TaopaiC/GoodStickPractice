/* eslint-env node, jest */
/* eslint no-unused-vars: 0 */ // since fetch is needed but not used
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import md5 from 'spark-md5';
import { polyfill } from 'es6-promise';
import axios from 'axios';
import * as actions from 'reducers/topic';
import sinon from 'sinon';

polyfill();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Topic Actions', () => {
  describe('Asynchronous actions', () => {
    let sandbox;

    const index = 0;
    const topic = 'A time machine';
    const id = md5.hash(topic);
    const data = {
      id,
      count: 1,
      text: topic
    };

    const initialState = {
      topic: {
        topics: [],
        newtopic: ''
      }
    };

    beforeEach(() => {
      sandbox = sinon.sandbox.create(); // eslint-disable-line
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('dispatches request and success actions when status is 200', done => {
      const expectedActions = [
        {
          type: actions.CREATE_TOPIC_REQUEST,
          id,
          count: 1,
          text: data.text
        }, {
          type: actions.CREATE_TOPIC_SUCCESS
        }
      ];

      sandbox.stub(axios, 'post').returns(Promise.resolve({ status: 200 }));

      const store = mockStore(initialState);
      store.dispatch(actions.createTopic(topic))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('dispatches request and failed actions when status is NOT 200', done => {
      const expectedActions = [
        {
          type: actions.CREATE_TOPIC_REQUEST,
          id,
          count: 1,
          text: data.text
        }, {
          type: actions.CREATE_TOPIC_FAILURE,
          id,
          error: 'Oops! Something went wrong and we couldn\'t create your topic'
        }
      ];
      sandbox.stub(axios, 'post').returns(Promise.reject({status: 404, data: 'Oops! Something went wrong and we couldn\'t create your topic'}));

      const store = mockStore(initialState);
      store.dispatch(actions.createTopic(topic))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('dispatches a duplicate action for a duplicate topic', () => {
      initialState.topic.topics.push(data);

      const expectedActions = [
        {
          type: actions.CREATE_TOPIC_DUPLICATE
        }
      ];

      const store = mockStore(initialState);
      store.dispatch(actions.createTopic(topic));
      expect(store.getActions()).toEqual(expectedActions);
      initialState.topic.topics.pop();
    });

    it('incrementCount dispatches an increment count action on success', done => {
      const expectedActions = [
        {
          type: actions.INCREMENT_COUNT,
          id
        }];
      sandbox.stub(axios, 'put').returns(Promise.resolve({ status: 200 }));
      const store = mockStore();
      store.dispatch(actions.incrementCount(data.id))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('incrementCount should not dispatch a failure action on failure', done => {
      const expectedActions = [
        {
          type: actions.CREATE_TOPIC_FAILURE,
          id: data.id,
          error: 'Oops! Something went wrong and we couldn\'t add your vote'
        }];
      sandbox.stub(axios, 'put').returns(Promise.reject({ status: 400 }));
      const store = mockStore();
      store.dispatch(actions.incrementCount(data.id, index))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('decrementCount dispatches an decrement count action on success', done => {
      const expectedActions = [
        {
          type: actions.DECREMENT_COUNT,
          id
        }];
      sandbox.stub(axios, 'put').returns(Promise.resolve({ status: 200 }));
      const store = mockStore();
      store.dispatch(actions.decrementCount(data.id))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('decrementCount should not dispatch a decrement count action on failure', done => {
      const expectedActions = [
        {
          type: actions.CREATE_TOPIC_FAILURE,
          error: 'Oops! Something went wrong and we couldn\'t add your vote',
          id: data.id
        }];
      sandbox.stub(axios, 'put').returns(Promise.reject({ status: 400 }));
      const store = mockStore(initialState);
      store.dispatch(actions.decrementCount(data.id))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('destroyTopic dispatches a decrement count action on success', done => {
      const expectedActions = [
        {
          type: actions.DESTROY_TOPIC,
          id
        }];
      sandbox.stub(axios, 'delete').returns(Promise.resolve({ status: 200 }));
      const store = mockStore();
      store.dispatch(actions.destroyTopic(data.id))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });

    it('destroyTopic should not dispatch an decrement count action on failure', done => {
      const expectedActions = [
        {
          type: actions.CREATE_TOPIC_FAILURE,
          id: data.id,
          error: 'Oops! Something went wrong and we couldn\'t add your vote'
        }];
      sandbox.stub(axios, 'delete').returns(Promise.reject({ status: 400 }));
      const store = mockStore();
      store.dispatch(actions.destroyTopic(data.id))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        }).then(done)
        .catch(done);
    });
  });
  describe('Action creator unit tests', () => {
    const index = 0;
    const topic = 'A time machine';
    const id = md5.hash(topic);
    const data = {
      id,
      count: 1,
      text: topic
    };
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create(); // eslint-disable-line
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should create an action object to increment the count', () => {
      const expectedAction = {
        type: actions.INCREMENT_COUNT,
        id
      };
      expect(actions.increment(id)).toEqual(expectedAction);
    });

    it('should create an action object to decrement count', () => {
      const expectedAction = {
        type: actions.DECREMENT_COUNT,
        id
      };
      expect(actions.decrement(id)).toEqual(expectedAction);
    });

    it('should create an action object to destroy a topic', () => {
      const expectedAction = {
        type: actions.DESTROY_TOPIC,
        id
      };
      expect(actions.destroy(id)).toEqual(expectedAction);
    });

    it('should create an action object with a new topic', () => {
      const expectedAction = {
        type: actions.TYPING,
        newTopic: data.text
      };
      expect(actions.typing(data.text)).toEqual(expectedAction);
    });

    it('should create an action object with a new topic request', () => {
      const expectedAction = {
        type: actions.CREATE_TOPIC_REQUEST,
        id: data.id,
        count: data.count,
        text: data.text
      };
      expect(actions.createTopicRequest(data)).toEqual(expectedAction);
    });

    it('should create an action object on a new topic success', () => {
      const expectedAction = {
        type: actions.CREATE_TOPIC_SUCCESS
      };
      expect(actions.createTopicSuccess()).toEqual(expectedAction);
    });

    it('should create an action object on a new topic failure', () => {
      const dataFail = Object.assign({}, {
        error: 'Oops! Something went wrong and we couldn\'t create your topic',
        id: data.id
      });
      const expectedAction = {
        type: actions.CREATE_TOPIC_FAILURE,
        id: dataFail.id,
        error: dataFail.error
      };
      expect(actions.createTopicFailure(dataFail)).toEqual(expectedAction);
    });

    it('should create an action on a topic duplicate', () => {
      const expectedAction = {
        type: actions.CREATE_TOPIC_DUPLICATE
      };
      expect(actions.createTopicDuplicate()).toEqual(expectedAction);
    });

    it('should create an action when fetching topics', () => {
      sandbox.stub(axios, 'get').returns('hello');
      const expectedAction = {
        type: actions.GET_TOPICS,
        promise: 'hello'
      };
      expect(actions.fetchTopics()).toEqual(expectedAction);
    });
  });
});