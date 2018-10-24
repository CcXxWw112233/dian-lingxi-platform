import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { setMemberWitchGroup, removeMembersWithGroup, CreateGroup} from "../../services/technological/organizationMember";
import modelExtend from 'dva-model-extend'
import technological from './index'
import {getAppsList} from "../../services/technological/project";

export default modelExtend(technological, {
  namespace: 'organizationMember',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/organizationMember') {
          dispatch({
            type: 'updateDatas',
            payload: {

            }
          })
        }
      })
    },
  },
  effects: {
    * CreateGroup({ payload }, { select, call, put }) {
      let res = yield call(CreateGroup, payload)
      if(isApiResponseOk(res)) {}
    },
    * removeMembersWithGroup({ payload }, { select, call, put }) {
      let res = yield call(removeMembersWithGroup, payload)
      if(isApiResponseOk(res)) {}
    },
    * setMemberWitchGroup({ payload }, { select, call, put }) {
      let res = yield call(setMemberWitchGroup, payload)
      if(isApiResponseOk(res)) {}
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
});
