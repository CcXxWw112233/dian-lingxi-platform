import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import {MESSAGE_DURATION_TIME, ORGANIZATION} from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from 'js-cookie'
import QueryString from 'querystring'
import {applyJoinOrganization, createOrganization} from "../../services/technological/organizationMember";

export default {
  namespace: 'noviceGuide',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/noviceGuide') {
        }
      })
    },
  },
  effects: {
    * applyJoinOrganization({ payload }, { select, call, put }) {
      let res = yield call(applyJoinOrganization, payload)
      if(isApiResponseOk(res)) {
        message.success(`已申请加入`,MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, 2000)
        yield put({
          type: 'routingJump',
          payload: {
            route: '/technological/project'
          }
        })
      }else{
        message.warn(`${res.message},请稍后访问...`,MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, 2000)
        window.location.href = 'http://www.di-an.com/'
      }
    },
    * createOrganization({ payload }, { select, call, put }) {
      let res = yield call(createOrganization, payload)
      if(isApiResponseOk(res)) {
        //查询一遍
        message.success(`创建组织成功`,MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, 2000)
        yield put({
          type: 'routingJump',
          payload: {
            route: '/technological/project'
          }
        })
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
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
