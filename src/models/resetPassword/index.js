import { formSubmit, requestVerifyCode } from '../../services/resetPassword'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';

export default {
  namespace: 'resetPassword',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/resetPassword') {
          dispatch({
            type: 'updateDatas',
            payload: queryString.parse(location.search)
          })
        }
      })
    },
  },
  effects: {
    * formSubmit({ payload }, { select, call, put }) { //提交表单
      const { accountType = '', mobile = '', email = '' } = payload
      console.log(payload)
      let res = yield call(formSubmit, payload)
      if(isApiResponseOk(res)) {
        message.success(res.message, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
    },
    * getVerificationcode({ payload }, { select, call, put }) { //获取验证码
      const { data, calback } = payload
      calback && typeof calback === 'function' ? calback() : ''
      let res = yield call(requestVerifyCode, data)
      if(isApiResponseOk(res)) {
        message.success(res.message, MESSAGE_DURATION_TIME)
        yield put({
          type: 'updateDatas',
          payload: {
            showGetVerifyCode: true,
          },
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
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
