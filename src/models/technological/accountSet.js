import { formSubmit, requestVerifyCode } from '../../services/login'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { getUserInfo, updateUserInfo, changePassWord, checkEmailIsRegisted, changeEmail,changeMobile,checkMobileIsRegisted } from "../../services/technological/accountSet";
import queryString from 'query-string';

export default {
  namespace: 'accountSet',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        if (location.pathname === '/technological/accoutSet') {
          dispatch({
            type: 'getUserInfo'
          })
          const SelectedKeys = queryString.parse(location.search).selectedKeys
          dispatch({
            type: 'updateDatas',
            payload: {
              SelectedKeys: SelectedKeys || '1', //正常默认进来menu选项‘1’,通过外部邮件进来其他
            }
          })
        }else{
          // console.log(2)
        }
      })
    },
  },
  effects: {
    * getUserInfo({ payload }, { select, call, put }) {
      let res = yield call(getUserInfo, payload)
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

    * updateUserInfo({ payload }, { select, call, put }) {
      const { data } = payload
      let res = yield call(updateUserInfo, data)
      if(isApiResponseOk(res)) {
        message.success('修改成功', MESSAGE_DURATION_TIME)
        yield put({
          type: 'getUserInfo',
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * changePassWord({ payload }, { select, call, put }) {
      const { data } = payload
      let res = yield call(changePassWord, data)
      if(isApiResponseOk(res)) {
        message.success('修改密码成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * formSubmit({ payload }, { select, call, put }) { //提交表单
      let res = yield call(formSubmit, payload)
      if(isApiResponseOk(res)) {
        message.success('登录成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * getVerificationcode({ payload }, { select, call, put }) { //获取验证码
      console.log(payload)
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

    * checkMobileIsRegisted({ payload }, { select, call, put }) {
      const { data } = payload
      let res = yield call(checkMobileIsRegisted, data)
      if(isApiResponseOk(res)) {
        if(res.data) {
          message.warn('该手机号已被注册', MESSAGE_DURATION_TIME)
        }else{
          let res2 = yield call(changeMobile, data)
          if(isApiResponseOk(res2)) {
            message.success('更换手机号成功。', MESSAGE_DURATION_TIME)
          }else{
            message.warn(res2.message, MESSAGE_DURATION_TIME)
          }
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * checkEmailIsRegisted({ payload }, { select, call, put }) {
      const { data } = payload
      let res = yield call(checkEmailIsRegisted, data)
      if(isApiResponseOk(res)) {
        if(res.data) {
          message.warn('该邮箱已被注册', MESSAGE_DURATION_TIME)
        }else{
          let res2 = yield call(changeEmail, data)
          if(isApiResponseOk(res2)) {
            message.success('邮件发送成功。', MESSAGE_DURATION_TIME)
          }else{
            message.warn(res2.message, MESSAGE_DURATION_TIME)
          }
        }
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
