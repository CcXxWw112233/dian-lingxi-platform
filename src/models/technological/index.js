import { getUSerInfo, logout } from '../../services/technological'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";

export default {
  namespace: 'technological',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname.indexOf('/technological') !== -1) {
          // dispatch({
          //   type:'updateDatas',
          //   payload: {
          //     chirldRoute: location.pathname.replace('/technological',''),
          //   }
          // })
          // dispatch({
          //   type:'getUSerInfo',
          // })
        }else{
        }
      })
    },
  },
  effects: {
    * getUSerInfo({ payload }, { select, call, put }) { //提交表单
      let res = yield call(getUSerInfo, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            userInfo: res.data
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * logout({ payload }, { select, call, put }) { //提交表单
      let res = yield call(logout, payload)
      if(isApiResponseOk(res)) {
        yield put(routerRedux.push('/login'));
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
    },
    * setChirldrenRoute ({ payload }, { call, put }) {
      const { chirldRoute } = payload
      yield put({
        type:'updateDatas',
        payload: {
          chirldRoute,
        }
      })
    }
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
