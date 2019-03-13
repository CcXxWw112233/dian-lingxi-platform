import { message } from 'antd'
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import modelExtend from 'dva-model-extend'
import technological from '../index'
import {isApiResponseOk} from "../../../utils/handleResponseData";
import {getRelationsSelectionPre} from "../../../services/technological/task";
import {MESSAGE_DURATION_TIME} from "../../../globalset/js/constant";

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
              relations_Prefix: []
            }
          })
          dispatch({
            type: 'getRelationsSelectionPre',
            payload: {

            }
          })
        }
      })
    },
  },
  effects: {
    //获取内容关联前半部分
    * getRelationsSelectionPre({ payload }, { select, call, put }) { //
      let res = yield call(getRelationsSelectionPre, payload)
      // debugger
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            relations_Prefix: res.data || []
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
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
});
