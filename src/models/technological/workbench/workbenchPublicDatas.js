import { message } from 'antd'
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import modelExtend from 'dva-model-extend'
import technological from '../index'

//用于存放工作台公共的数据
export default modelExtend(technological, {
  namespace: 'workbenchPublicDatas',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/technological/workbench') {
          dispatch({
            type: 'updateDatas',
            payload: {
              board_id: '',
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
    },
  },

  reducers: {
    updateDatas(state, action) {
      return {
        ...state,
        datas: { ...state.datas, ...action.payload },
      }
    }
  },
});
