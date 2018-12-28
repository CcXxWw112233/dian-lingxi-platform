import { getUSerInfo, logout } from '../../services/technological'
import { getOrganizationMemberPermissions,changeCurrentOrg,getSearchOrganizationList,createOrganization,updateOrganization,applyJoinOrganization,inviteJoinOrganization, getCurrentUserOrganizes } from '../../services/technological/organizationMember'
import { selectCurrentUserOrganizes, selectCurrentSelectOrganize} from "./select";
import { getCurrentNounPlan } from '../../services/organization'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import {MEMBERS, MESSAGE_DURATION_TIME, ORGANIZATION} from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { initWs}  from '../../components/WsNewsDynamic'
import { selectNewMessageItem } from './select'
import QueryString from 'querystring'
import {currentNounPlanFilterName} from "../../utils/businessFunction";

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
          if(!Cookies.get('userInfo')) {
            dispatch({
              type:'getUSerInfo',
              payload: {}
            })
          }else {
            const { current_org } = JSON.parse(Cookies.get('userInfo'))
            if(current_org) {
              dispatch({
                type:'setcurrentSelectOrganizeByCookiesUSerInfo',
                payload: {}
              })
              dispatch({
                type:'getOrganizationMemberPermissions',
                payload: {}
              })
            }
          }
          //查询所在组织列表
          dispatch({
            type:'getCurrentUserOrganizes',
            payload: {}
          })
          //websocket连接判定
          if(Cookies.get('wsLinking') === 'false' || !Cookies.get('wsLinking')){
            initWs()
          }
          //页面移出时对socket和socket缓存的内容清除
          window.onbeforeunload = function () {
            Cookies.set('wsLinking', false,{expires: 30, path: ''})
            localStorage.removeItem(`newMessage`)
          }

          //当前名词定义的方案
          const currentNounPlan = localStorage.getItem('currentNounPlan')
          console.log('currentNounPlan',currentNounPlan)
          if (!currentNounPlan) {
            dispatch({
              type: 'getCurrentNounPlan',
              payload: {}
            })
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
        if(res.data.current_org ) {
          localStorage.setItem('currentSelectOrganize', JSON.stringify(res.data.current_org))
           yield put({  //  获取当前成员在组织中的权限列表
             type: 'getOrganizationMemberPermissions',
             payload: {}
           })
        }
        //组织切换重新加载
        const { operateType } = payload
        if(operateType === 'changeOrg') {
          let redirectHash =  locallocation.pathname
          if(locallocation.pathname === '/technological/projectDetail') {
            redirectHash = '/technological/project'
          }
          yield put(routerRedux.push(`/technological?redirectHash=${redirectHash}`));
        }
        //存储
        Cookies.set('userInfo', res.data,{expires: 30, path: ''})
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * setcurrentSelectOrganizeByCookiesUSerInfo({ payload }, { select, call, put }) { //c从cookie中拿到当前组织
      const { current_org } = JSON.parse(Cookies.get('userInfo'))
      localStorage.setItem('currentSelectOrganize', JSON.stringify(current_org))
      yield put({
        type: 'updateDatas',
        payload: {
          currentSelectOrganize: current_org,
        }
      })
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

        //创建后做切换组织操作
        const { operateType } = payload
        if(operateType === 'create') {
           yield put({
             type: 'changeCurrentOrg',
             payload: {
               org_id: res.data[res.data.length - 1].id
             }
           })
        }

        if(res.data.length) { //当前选中的组织id OrgId要塞在sessionStorage
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
        yield put({
          type: 'getUSerInfo',
          payload: {
            operateType: 'changeOrg',
          }
        })
        yield put({ //重新获取名词方案
          type: 'getCurrentNounPlan',
          payload: {
          }
        })
        // //组织切换重新加载
        // const redirectHash =  locallocation.pathname
        // if(locallocation.pathname === '/technological/projectDetail') {
        //   redirectHash === '/technological/project'
        // }
        // yield put(routerRedux.push(`/technological?redirectHash=${redirectHash}`));
      }else{
        message.warn(`${currentNounPlanFilterName(ORGANIZATION)}切换出了点问题`, MESSAGE_DURATION_TIME)
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
        //查询一遍
        yield put({
          type: 'getCurrentUserOrganizes',
          payload: {
            operateType: 'create',
            calback : function () {
              message.success(`创建${currentNounPlanFilterName(ORGANIZATION)}成功`,MESSAGE_DURATION_TIME)
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
              message.success(`申请加入${currentNounPlanFilterName(ORGANIZATION)}成功`,MESSAGE_DURATION_TIME)
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
        message.success(`已成功添加${currentNounPlanFilterName(ORGANIZATION)}${currentNounPlanFilterName(MEMBERS)}`,MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * getOrganizationMemberPermissions({ payload }, { select, call, put }) {
      let res = yield call(getOrganizationMemberPermissions, payload)
      if(isApiResponseOk(res)) {
         yield put({
           type: 'updateDatas',
           payload: {
             organizationMemberPermissions: res.data || [], //组织成员权限列表
           }
         })
        localStorage.setItem('organizationMemberPermissions', JSON.stringify(res.data || []))
      }else{
        localStorage.setItem('organizationMemberPermissions', JSON.stringify([]))
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    //组织 -----------

    //名词定义------start
    * getCurrentNounPlan({ payload }, { select, call, put }) {
      let res = yield call(getCurrentNounPlan, payload)
      if(isApiResponseOk(res)) {
        localStorage.setItem('currentNounPlan', JSON.stringify(res.data || []))
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },

    //名词定义------end


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
