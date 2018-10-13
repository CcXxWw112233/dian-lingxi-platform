import { getUSerInfo, logout } from '../../services/technological'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { initWs}  from '../../components/WsNewsDynamic'
import { selectNewMessageItem } from './select'

let naviHeadTabIndex //导航栏naviTab选项
export default {
  namespace: 'technological',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        //头部table key
        if (location.pathname.indexOf('/technological') !== -1) {
          if(location.pathname === '/technological/projectDetail' || location.pathname === '/technological/project' ) {
            naviHeadTabIndex = '3'
          }else if(location.pathname === '/technological/workbench'){
            naviHeadTabIndex = '2'
          }else if(location.pathname === '/technological/newsDynamic'){
            naviHeadTabIndex = '1'
          }
          dispatch({
            type: 'upDateNaviHeadTabIndex',
          })
          //如果cookie存在用户信息，则部请求，反之则请求
          if(!Cookies.get('userInfo')) {
            dispatch({
              type:'getUSerInfo',
            })
          }
          //websocket连接判定
          if(Cookies.get('wsLinking') === 'false' || !Cookies.get('wsLinking')){
            initWs()
          }
          window.onbeforeunload = function () {
            Cookies.set('wsLinking', false,{expires: 30, path: ''})
            localStorage.removeItem(`newMessage`)
          }

        }
      })
    },
  },
  effects: {
    * upDateNaviHeadTabIndex({ payload }, { select, call, put }) {
      yield put({
        type: 'updateDatas',
        payload: {
          naviHeadTabIndex
        }
      })
    },
    * getUSerInfo({ payload }, { select, call, put }) { //提交表单
      let res = yield call(getUSerInfo, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            userInfo: res.data,
          }
        })
        Cookies.set('userInfo', res.data,{expires: 30, path: ''})
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * logout({ payload }, { select, call, put }) { //提交表单
      let res = yield call(logout, payload)
      if(isApiResponseOk(res)) {
        // yield put(routerRedux.push('/login'));
        Cookies.remove('userInfo', { path: '' })
        window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
      }else{
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
};
