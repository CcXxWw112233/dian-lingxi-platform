import { formSubmit, requestVerifyCode } from '../../services/login'
import { isApiResponseOk } from '../../utils/handleResponseData'
export default {
  namespace: 'login',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/login') {
        }
      })
    },
  },
  effects: {
    * formSubmit({ payload }, { select, call, put }) { //提交表单
      let res = yield call(formSubmit, payload)
      console.log(res)
      if(isApiResponseOk(res)) {

      }
    },
    * getVerificationcode({ payload }, { select, call, put }) { //获取验证码
      const { data, calback } = payload
      calback && typeof calback === 'function' ? calback() : ''
      let res = yield call(requestVerifyCode, data)
    }
  },

  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};
