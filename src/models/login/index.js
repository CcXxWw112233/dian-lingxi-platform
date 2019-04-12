import { formSubmit, requestVerifyCode,wechatAccountBind } from '../../services/login'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from 'js-cookie'
import QueryString from 'querystring'
import {getUSerInfo} from "../../services/technological";

let redirectLocation
export default {
  namespace: 'login',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/login') {
          Cookies.set('is401', false, {expires: 30, path: ''})
          redirectLocation = location.search.replace('?redirect=', '')
        } else {
          localStorage.removeItem('bindType')
        }
      })
    },
  },
  effects: {
    * wechatAccountBind({payload}, {select, call, put}) {
      let res = yield call(wechatAccountBind, payload)
      if(isApiResponseOk(res)) {

        const tokenArray = res.data.split('__')
        Cookies.set('Authorization', tokenArray[0], {expires: 30, path: ''})
        Cookies.set('refreshToken', tokenArray[1], {expires: 30, path: ''})
        Cookies.set('is401', false, {expires: 30, path: ''})

        const res2 = yield call(getUSerInfo, payload)
        //如果有重定向路径或者存在组织
        if(isApiResponseOk(res2)) {
          if(!!res2.data['current_org']){
            yield put(routerRedux.push(redirectLocation))
          } else {
            yield put(routerRedux.push('/noviceGuide'))
          }
        } else {
          message.warn(res2.message, MESSAGE_DURATION_TIME)
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * wechatLogin({ payload }, { select, call, put }) { //微信扫码登陆
        const tokenArray = payload.token.split('__')
        Cookies.set('Authorization', tokenArray[0], {expires: 30, path: ''})
        Cookies.set('refreshToken', tokenArray[1], {expires: 30, path: ''})
        Cookies.set('is401', false, {expires: 30, path: ''})
        const res2 = yield call(getUSerInfo, payload)
        //如果有重定向路径或者存在组织
        if(isApiResponseOk(res2)) {
          // debugger
          if(!!res2.data['current_org']){
            yield put(routerRedux.push(redirectLocation))
          } else {
            yield put(routerRedux.push('/noviceGuide'))
          }
        } else {
          message.warn(res2.message, MESSAGE_DURATION_TIME)
        }

    },
    * formSubmit({ payload }, { select, call, put }) { //提交表单
      let res = yield call(formSubmit, payload)
      if(isApiResponseOk(res)) {
        const tokenArray = res.data.split('__')
        Cookies.set('Authorization', tokenArray[0], {expires: 30, path: ''})
        Cookies.set('refreshToken', tokenArray[1], {expires: 30, path: ''})
        Cookies.set('is401', false, {expires: 30, path: ''})

        //当存在路径直接跳转， 不存在重定向路径则作新手判定
        // if(!!redirectLocation) {
        //   yield put(routerRedux.push(redirectLocation))
        //   console.log(1)
        // }else {
        //   const res2 = yield call(getUSerInfo, payload)
        //   //如果有重定向路径或者存在组织
        //   if(isApiResponseOk(res2)) {
        //     console.log(2)
        //     if(!!res2.data['current_org']){
        //       console.log(3)
        //       yield put(routerRedux.push(redirectLocation))
        //     } else {
        //       console.log(4)
        //       yield put(routerRedux.push('/noviceGuide'))
        //     }
        //   } else {
        //     message.warn(res2.message, MESSAGE_DURATION_TIME)
        //   }
        // }
        const res2 = yield call(getUSerInfo, payload)
        //如果有重定向路径或者存在组织
        if(isApiResponseOk(res2)) {
          if(!!res2.data['current_org']){
            yield put(routerRedux.push(redirectLocation))
          } else {
            yield put(routerRedux.push('/noviceGuide'))
          }
        } else {
          message.warn(res2.message, MESSAGE_DURATION_TIME)
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * getVerificationcode({ payload }, { select, call, put }) { //获取验证码
      const { data, calback } = payload
      let res = yield call(requestVerifyCode, data)
      calback && typeof calback === 'function' ? calback() : ''
      if(isApiResponseOk(res)) {
        message.success(res.message, MESSAGE_DURATION_TIME)
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
