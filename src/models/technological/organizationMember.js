import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { setMemberRole, getCurrentOrgRole,inviteMemberToGroup,getGroupTreeList, discontinueMember, approvalMember,setMemberWitchGroup, removeMembersWithGroup, CreateGroup, getGroupList, updateGroup, deleteGroup, getGroupPartialInfo} from "../../services/technological/organizationMember";
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
            payload:{
              groupList: [], //全部分组
              TreeGroupModalVisiblie: false, //树状分组是否可见
              groupTreeList: [], //树状分组数据
              currentBeOperateMemberId: '', //当前被操作的成员id
              roleList: [], //当前组织角色列表
            }
          })
          //获取分组列表
          dispatch({
            type: 'getGroupList',
            payload: {
            }
          })
          // 获取分组树状列表
          dispatch({
            type: 'getGroupTreeList',
            payload: {}
          })
          //查询当前角色
          dispatch({
            type: 'getCurrentOrgRole',
            payload: {}
          })
        }
      })
    },
  },
  effects: {
    * getGroupList({ payload }, { select, call, put }) {
      let res = yield call(getGroupList, {})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            groupList: res.data.data,
            member_count: res.data.member_count
          }
        })
        const { calback } = payload
        if(typeof calback === 'function') {
          calback()
        }
      }else {

      }
    },
    * getGroupTreeList({ payload }, { select, call, put }) {
      let res = yield call(getGroupTreeList,{})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            groupTreeList: res.data
          }
        })
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
        yield put({
          type: 'getGroupTreeList',
          payload: {}
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
        yield put({
          type: 'getGroupTreeList',
          payload: {}
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
        yield put({
          type: 'getGroupTreeList',
          payload: {}
        })
      }else {
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * removeMembersWithGroup({ payload }, { select, call, put }) {
      let res = yield call(removeMembersWithGroup, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success('已将成员移出该分组',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * setMemberWitchGroup({ payload }, { select, call, put }) {
      let res = yield call(setMemberWitchGroup, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success('设置成员分组成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn('设置成员分组失败', MESSAGE_DURATION_TIME)
      }

    },
    * getGroupPartialInfo({ payload }, { select, call, put }) {
      let res = yield call(getGroupPartialInfo, payload)
      if(isApiResponseOk(res)) {}
    },
    * inviteMemberToGroup ({ payload }, { select, call, put }) {
      let res = yield call(inviteMemberToGroup, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success('邀请成员加入分组成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * approvalMember({ payload }, { select, call, put }) {
      const { status } = payload
      let res = yield call(approvalMember, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success(status === '0'?'已拒绝成员加入':'已通过审批',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * discontinueMember({ payload }, { select, call, put }) {
      let res = yield call(discontinueMember, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload:{
            calback: function () {
              message.success('已停用该成员',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * getCurrentOrgRole({ payload }, { select, call, put }) {
      let res = yield call(getCurrentOrgRole, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            roleList: res.data
          }
        })
      } else {

      }
    },
    * setMemberRole({ payload }, { select, call, put }) {
      let res = yield call(setMemberRole, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getGroupList',
          payload: {
            calback: function () {
              message.success('设置成功', MESSAGE_DURATION_TIME)
            }
          }
        })
        yield put({
          type: 'getGroupTreeList',
          payload: {}
        })
      } else {
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
});
