
import { message } from 'antd'
import { routerRedux } from "dva/router";

let redirectLocation
export default {
  namespace: 'initRouteRedirect',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/') {
          const { user_set: { is_simple_model } } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
          if (is_simple_model && is_simple_model == '1') {
            dispatch({
              type: 'routingJump',
              payload: {
                route: '/technological/simplemode/home'
              }
            })
          } else {
            dispatch({
              type: 'routingJump',
              payload: {
                route: '/technological/workbench'
              }
            })
          }
          // dispatch({
          //   type: 'routingJump',
          //   payload: {
          //     route: '/technological/workbench'
          //   }
          // })
        }
      })
    },
  },
  effects: {

    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
    }
  },

  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};
