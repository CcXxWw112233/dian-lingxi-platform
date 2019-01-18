import { formSubmit, requestVerifyCode, checkAccountRestered } from '../../services/register'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';



export default {
  namespace: 'register',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/register') {

        }
      })
    },
  },
  effects: {
    * formSubmit({ payload }, { select, call, put }) { //提交表单
      const { mobile, email } = payload
      let res = yield call(formSubmit, payload)

      if(isApiResponseOk(res)) {
        message.success(res.message, MESSAGE_DURATION_TIME)
        yield put(routerRedux.push({
          pathname: '/registerSuccess',
          search: queryString.stringify({ mobile, email, type: 'register' })
        }))
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * getVerificationcode({ payload }, { select, call, put }) { //获取验证码
      const { data, calback } = payload
      calback && typeof calback === 'function' ? calback() : ''
      let res = yield call(requestVerifyCode, data)
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
    * checkAccountRestered ({ payload }, { select, call, put }) {
      const { mobile, email, accountType } = payload
      let res = yield call(checkAccountRestered, payload)
      if(isApiResponseOk(res)) {
        if(res.data) {
          message.warn(accountType === 'mobile' ? '该手机号已被注册' : '该邮箱已被注册', MESSAGE_DURATION_TIME)
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    }
  },

  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};
