import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import { StoreUtil } from "../utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: StoreUtil.state(),
    postEvents: StoreUtil.state(),
    deleteEvent: StoreUtil.state(),
    users: StoreUtil.state(),
    postUsers: StoreUtil.state(),
    deleteUser: StoreUtil.state()
  },
  mutations: {
    [types.SET_CCCAL_GETEVENTS](state, payload) {
      state.events = StoreUtil.updateState(state.events, payload);
    },
    [types.SET_CCCAL_POSTEVENTS](state, payload) {
      state.postEvents = StoreUtil.updateState(state.postEvents, payload);
    },
    [types.SET_CCCAL_DELETEEVENTS](state, payload) {
      state.deleteEvent = StoreUtil.updateState(state.deleteEvent, payload);
    },
    [types.SET_CCCAL_GETUSERS](state, payload) {
      state.users = StoreUtil.updateState(state.users, payload);
    },
    [types.SET_CCCAL_POSTUSERS](state, payload) {
      state.postUsers = StoreUtil.updateState(state.postUsers, payload);
    },
    [types.SET_CCCAL_DELETEUSERS](state, payload) {
      state.deleteUser = StoreUtil.updateState(state.deleteUser, payload);
    }
  },
  actions: {
    getEvents ({ commit }) {
      commit(types.SET_CCCAL_GETEVENTS);

      let url = 'http://127.0.0.1:8000/events'
      return fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Content-Type': 'application/json'
        }
      })
          .then(res => {
              return res.json()
          })
          .then(res => {
            commit(types.SET_CCCAL_GETEVENTS, res);
          })
          .catch(e => {
            commit(types.SET_CCCAL_GETEVENTS, e);
          })
    },
    postEvents ({ commit }, events) {
      let url = 'http://127.0.0.1:8000/events'
      return fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(events),
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
          .then(res => {
            return res.json()
          })
          .then(res => {
            commit(types.SET_CCCAL_POSTEVENTS, (res.result));
          })
          .catch(e => {
            commit(types.SET_CCCAL_POSTEVENTS, e);
          })
    },
    deleteEvents ({ commit }, id) {
      let url = `http://127.0.0.1:8000/events/` + id;
      return fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
          .then(() => {
            console.log('removed')
          })
          .catch(e => {
            commit(types.SET_CCCAL_DELETEEVENTS, e);
          })
    },
    getUsers ({ commit }) {
      commit(types.SET_CCCAL_GETUSERS);

      let url = 'http://127.0.0.1:8000/users';
      return fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Content-Type': 'application/json'
        }
      })
          .then(res => {
            return res.json()
          })
          .then(res => {
            commit(types.SET_CCCAL_GETUSERS, res);
          })
          .catch(e => {
            commit(types.SET_CCCAL_GETUSERS, e);
          })
    },
    postUsers ({ commit }, user) {
      let url = 'http://127.0.0.1:8000/users';
      return fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(user),
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
          .then(res => {
            return res.json()
          })
          .then(res => {
            commit(types.SET_CCCAL_POSTUSERS, (res.result));
          })
          .catch(e => {
            commit(types.SET_CCCAL_POSTUSERS, e);
          })
    },
    deleteUsers ({ commit }, id) {
      let url = `http://127.0.0.1:8000/users/` + id;
      return fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
          .then(() => {
            console.log('removed')
          })
          .catch(e => {
            commit(types.SET_CCCAL_DELETEUSERS, e);
          })
    }
  },
  getters: {
    events: state => state.events,
    postEvents: state => state.postEvents,
    deleteEvent: state => state.deleteEvent,
    users: state => state.users,
    postUsers: state => state.postUsers,
    deleteUser: state => state.deleteUser
  }
});
