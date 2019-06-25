import { formSubmit, requestVerifyCode,wechatAccountBind, changePicVerifySrc } from '../../services/login'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from 'js-cookie'
import QueryString from 'querystring'
import {getUSerInfo} from "../../services/technological";
import { selectLoginCaptchaKey } from './selects'
let redirectLocation
export default {
  namespace: 'login',
  state: {
    datas: {
      is_show_pic_verify_code: false, //是否显示图片验证码
      pic_verify_src: '',
      captcha_key: ''
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/login') {
          Cookies.set('is401', false, {expires: 30, path: ''})
          redirectLocation = location.search.replace('?redirect=', '')
          dispatch({
            type: 'updateDatas',
            payload: {
              is_show_pic_verify_code: false, //是否显示图片验证码
              pic_verify_src: '',
              captcha_key: ''
            }
          })
        } else {
          localStorage.removeItem('bindType')
        }
        if(location.pathname.indexOf('/login') !== -1) {
          dispatch({
            type: 'updateDatas',
            payload:{
              is_show_pic_verify_code: false, //是否显示图片验证码
              pic_verify_src: ''
            }
          })
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
      const captcha_key = yield select(selectLoginCaptchaKey)
      let res = yield call(formSubmit, {...payload, captcha_key})
      const code = res.code
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
        if(code == '4005' || code == '4006' ) {
          yield put({
            type: 'updateDatas',
            payload: {
              is_show_pic_verify_code: true,
              pic_verify_src: res.data && `data:image/png;base64,${res.data['base64_img']}`,
              captcha_key: res.data && res.data.captcha_key
            }
          })
        }else if(code == '4007') {
          yield put({
            type: 'updateDatas',
            payload: {
              is_show_pic_verify_code: true,
            }
          })
        }
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
    * changePicVerifySrc({ payload }, { select, call, put }) { //更新图片验证码
      const captcha_key = yield select(selectLoginCaptchaKey)
      const res = yield call(changePicVerifySrc, {captcha_key})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            pic_verify_src: `data:image/png;base64,${res.data['base64_img']}`,
            captcha_key: res.data.captcha_key
          }
        })

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
    updateDatas(state, action) {
      return {
        ...state,
        datas: {...state.datas, ...action.payload},
      }
    }
  },
};
