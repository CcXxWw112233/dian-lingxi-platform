import { confirmEmail } from '../../services/emailRedirect'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from 'js-cookie'
import QueryString from 'querystring'

// 这个界面是用来做邮件跳转的，分别带几个参数 operateType = 'changeEmail  (这是更改邮箱)' , token = ''
export default {
  namespace: 'emailRedirect',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname.indexOf('emailRedirect') !== -1) {
          const param =  QueryString.parse(location.search.replace('?', ''))
          const { operateType, token } = param
          if(operateType === 'changeEmail') {
            dispatch({
              type: 'confirmEmail',
              payload: {
                token
              }
            })
          }
        }else {
        }
      })
    },
  },
  effects: {
    * confirmEmail({ payload }, { select, call, put }) { //获取验证码
      let res = yield call(confirmEmail, payload)
      if(isApiResponseOk(res)) {
        message.success('验证成功,即将跳转到用户界面...', MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, 3000)
        yield put(routerRedux.push('/technological/accoutSet?selectedKeys=2'))
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
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
