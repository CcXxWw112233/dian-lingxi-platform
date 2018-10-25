import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { setMemberWitchGroup, removeMembersWithGroup, CreateGroup, getGroupList, updateGroup, deleteGroup, getGroupPartialInfo} from "../../services/technological/organizationMember";
import modelExtend from 'dva-model-extend'
import technological from './index'
import {getAppsList} from "../../services/technological/project";

const org_id = Cookies.get('org_id')
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
            payload:{
              groupList: [], //全部分组
            }
          })
          dispatch({
            type: 'getGroupList',
            payload: {
              org_id
            }
          })

        }
      })
    },
  },
  effects: {
    * getGroupList({ payload }, { select, call, put }) {
      let res = yield call(getGroupList, {org_id})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            groupList: res.data
          }
        })
        const { calback } = payload
        if(typeof calback === 'function') {
          calback()
        }
      }else {

      }
    },
    * CreateGroup({ payload }, { select, call, put }) {
      let res = yield call(CreateGroup, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success('创建分组成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * updateGroup({ payload }, { select, call, put }) {
      let res = yield call(updateGroup, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload: {
            calback: function () {
              message.success('更新分组信息成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * deleteGroup({ payload }, { select, call, put }) {
      let res = yield call(deleteGroup, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success('删除分组成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * removeMembersWithGroup({ payload }, { select, call, put }) {
      let res = yield call(removeMembersWithGroup, payload)
      if(isApiResponseOk(res)) {}
    },
    * setMemberWitchGroup({ payload }, { select, call, put }) {
      let res = yield call(setMemberWitchGroup, payload)
      if(isApiResponseOk(res)) {}
    },
    * getGroupPartialInfo({ payload }, { select, call, put }) {
      let res = yield call(getGroupPartialInfo, payload)
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
