import { getUSerInfo, logout } from '../../services/technological/workbench'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../services/technological/project";

let naviHeadTabIndex //导航栏naviTab选项
export default {
  namespace: 'workbench',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/workbench') {
          console.log(1)
        }
      })
    },
  },
  effects: {
    * getAppsList({ payload }, { select, call, put }) {
      let res = yield call(getUSerInfo, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            appsList: res.data
          }
        })
      }else{

      }
    },
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
};
