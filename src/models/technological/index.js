import { getUSerInfo, logout } from '../../services/technological'
import { changeCurrentOrg,getSearchOrganizationList,createOrganization,updateOrganization,applyJoinOrganization,inviteJoinOrganization, getCurrentUserOrganizes } from '../../services/technological/organizationMember'

import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { initWs}  from '../../components/WsNewsDynamic'
import { selectNewMessageItem } from './select'
import QueryString from 'QueryString'

let naviHeadTabIndex //导航栏naviTab选项
let locallocation //保存location在组织切换
export default {
  namespace: 'technological',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        //头部table key
        locallocation = location
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
          // if(!Cookies.get('userInfo')) {
            dispatch({
              type:'getUSerInfo',
              payload: {}
            })
          // }
          //查询所在组织列表
          dispatch({
            type:'getCurrentUserOrganizes',
            payload: {}
          })
          //websocket连接判定
          if(Cookies.get('wsLinking') === 'false' || !Cookies.get('wsLinking')){
            initWs()
          }
          window.onbeforeunload = function () {
            Cookies.set('wsLinking', false,{expires: 30, path: ''})
            localStorage.removeItem(`newMessage`)
          }

        }

        //切换组织时需要重新加载
        const param =  QueryString.parse(location.search.replace('?', '')) || {}
        const { redirectHash } = param
        if(location.pathname === '/technological'  && redirectHash) {
          dispatch({
            type: 'routingJump',
            payload: {
              route: redirectHash
            }
          })
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
            userInfo: res.data, //当前用户信息
            currentSelectOrganize: res.data.current_org || {}//当前选中的组织
          }
        })
        //当前选中的组织
        sessionStorage.setItem('currentSelectOrganize', JSON.stringify(res.data.current_org))
        Cookies.set('userInfo', res.data,{expires: 30, path: ''})
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * logout({ payload }, { select, call, put }) { //提交表单
      let res = yield call(logout, payload)
      if(isApiResponseOk(res)) {
        Cookies.remove('userInfo', { path: '' })
        window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    //组织 -----------
    * getCurrentUserOrganizes({ payload }, { select, call, put }) { //当前用户所属组织列表
      let res = yield call(getCurrentUserOrganizes, {})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentUserOrganizes: res.data, ////当前用户所属组织列表
            // currentSelectOrganize: res.data.length? res.data[0] : {}  //当前选中的组织
          }
        })
        if(res.data.length) { //当前选中的组织id OrgId要塞在sessionStorage
          // sessionStorage.setItem('currentSelectOrganize', JSON.stringify(res.data[0]))
          Cookies.set('org_id', res.data[0].id,{expires: 30, path: ''})
        }
        const { calback } = payload
        if (typeof calback === 'function') {
          calback()
        }
      }else{
      }
    },
    * changeCurrentOrg({ payload }, { select, call, put }) { //切换组织
      let res = yield call(changeCurrentOrg, payload)
      if(isApiResponseOk(res)) {
        const tokenArray = res.data.split('__')
        Cookies.set('Authorization', tokenArray[0],{expires: 30, path: ''})
        Cookies.set('refreshToken', tokenArray[1], {expires: 30, path: ''})
        //组织切换重新加载
        const redirectHash =  locallocation.pathname
        if(locallocation.pathname === '/technological/projectDetail') {
          redirectHash === '/technological/project'
        }
        yield put(routerRedux.push(`/technological?redirectHash=${redirectHash}`));

      }else{
        message.warn('组织切换出了点问题', MESSAGE_DURATION_TIME)
      }
    },
    * getSearchOrganizationList({ payload }, { select, call, put }) {
      yield put({
        type: 'updateDatas',
        payload: {
          spinning: true
        }
      })
      let res = yield call(getSearchOrganizationList, payload)
      yield put({
        type: 'updateDatas',
        payload: {
          spinning: false
        }
      })
      if(isApiResponseOk(res)) {
        yield put({
          type:'updateDatas',
          payload: {
            searchOrganizationList: res.data
          }
        })
      }else{
      }
    },
    * createOrganization({ payload }, { select, call, put }) {
      let res = yield call(createOrganization, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getCurrentUserOrganizes',
          payload: {
            calback : function () {
              message.success('创建组织成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * updateOrganization({ payload }, { select, call, put }) {
      let res = yield call(updateOrganization, payload)
      if(isApiResponseOk(res)) {
      }else{
      }
    },
    * applyJoinOrganization({ payload }, { select, call, put }) {
      let res = yield call(applyJoinOrganization, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getCurrentUserOrganizes',
          payload: {
            calback : function () {
              message.success('申请加入组织成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * inviteJoinOrganization({ payload }, { select, call, put }) {
      let res = yield call(inviteJoinOrganization, payload)
      if(isApiResponseOk(res)) {
        message.success('已成功添加组织成员',MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    //组织 -----------

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
