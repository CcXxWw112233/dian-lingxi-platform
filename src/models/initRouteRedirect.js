
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
          dispatch({
            type: 'routingJump',
            payload: {
              route: '/technological/workbench'
            }
          })
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
