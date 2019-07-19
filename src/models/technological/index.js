import { getUSerInfo, logout, getUserAllOrgsAllBoards } from '../../services/technological'
import {
  getOrganizationMemberPermissions,
  changeCurrentOrg,
  getSearchOrganizationList,
  createOrganization,
  updateOrganization,
  applyJoinOrganization,
  inviteJoinOrganization,
  getCurrentUserOrganizes,
  getUserOrgPermissions,
  getUserBoardPermissions,
} from '../../services/technological/organizationMember'
import { getMenuList } from '../../services/technological/getMenuList'
import {getProjectList, getCurrentOrgAllMembers, createMeeting} from './../../services/technological/workbench'
import { selectCurrentUserOrganizes, selectCurrentSelectOrganize} from "./select";
import { getCurrentNounPlan } from '../../services/organization'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import {MEMBERS, MESSAGE_DURATION_TIME, ORGANIZATION} from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import QueryString from 'querystring'
import {currentNounPlanFilterName, setOrganizationIdStorage} from "../../utils/businessFunction";

// 该model用于存放公用的 组织/权限/偏好设置/侧边栏的数据 (权限目前存放于localstorage, 未来会迁移到model中做统一)
let naviHeadTabIndex //导航栏naviTab选项
let locallocation //保存location在组织切换
export default {
  namespace: 'technological',
  state: {
    datas: {
      currentUserOrganizes: [], //用户组织列表
      is_show_org_name: true, // 是否显示组织名称
      is_all_org: true, //是否全部组织
      menuList: [],  // 侧边栏功能导航列表
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(async (location) => {
        message.destroy()
        //头部table key
        locallocation = location
        if (location.pathname.indexOf('/technological') !== -1) {

          dispatch({
            type: 'getMenuList',
            payload: {}
          })
          // if(location.pathname.indexOf('/technological/projectDetail') != -1 || location.pathname.indexOf('/technological/project') != -1 ) {
          //   naviHeadTabIndex = 'Projects'
          //   await dispatch({
          //     type: 'upDateNaviHeadTabIndex',
          //   })
          // }else if(location.pathname === '/technological/workbench'){
          //   naviHeadTabIndex = 'Workbench'
          //   await dispatch({
          //     type: 'upDateNaviHeadTabIndex',
          //   })
          // }else{

          // }
          await dispatch({
            type: 'getUserAllOrgsAllBoards',
            payload: {}
          })

          //如果cookie存在用户信息，则部请求，反之则请求
          await dispatch({
            type: 'getUSerInfo',
            payload: {}
          })


          //获取当前的用户当前组织的项目列表,
          await dispatch({
            type: 'getCurrentOrgProjectList',
            payload: {}
          })
          //获取用户当前组织的组织成员(如果非全组织，而是具有确认组织的情况下调用)
          if(localStorage.getItem('OrganizationId') != '0') {
            await dispatch({
              type: 'fetchCurrentOrgAllMembers',
            })
          }
          
          //查询所在组织列表
          await dispatch({
            type: 'getCurrentUserOrganizes',
            payload: {}
          })

          //当前名词定义的方案
          const currentNounPlan = localStorage.getItem('currentNounPlan')
          if (!currentNounPlan) {
            dispatch({
              type: 'getCurrentNounPlan',
              payload: {}
            })
          }
        }

        //切换组织时需要重新加载
        const param = QueryString.parse(location.search.replace('?', '')) || {}
        const { redirectHash } = param
        if(location.pathname === '/technological' && redirectHash) {
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

    // 获取用户信息
    * getUSerInfo({ payload }, { select, call, put }) { //提交表单
      const res = yield call(getUSerInfo)
      // console.log(res, 'current user info includes origanition info----------------------------------------')
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            userInfo: res.data, //当前用户信息
            currentSelectOrganize: res.data.current_org || {}//当前选中的组织
          }
        })
        //当前选中的组织
        localStorage.setItem('currentSelectOrganize', JSON.stringify(res.data.current_org || {}))

        yield put({ //  获取当前成员在组织中的权限列表
          type: 'getUserOrgPermissions',
          payload: {}
        })
        yield put({
         type: 'getUserBoardPermissions',
         payload: {}
         })
        localStorage.setItem('userInfo', JSON.stringify(res.data))

        //组织切换重新加载
        const { operateType } = payload
        if(operateType === 'changeOrg') {
          let redirectHash = locallocation.pathname
          if(locallocation.pathname === '/technological/projectDetail') {
            redirectHash = '/technological/project'
          }
          if(document.getElementById('iframImCircle')) {
            document.getElementById('iframImCircle').src = `/im/index.html?timestamp=${new Date().getTime()}`;
          }
          yield put(routerRedux.push(`/technological?redirectHash=${redirectHash}`));
        }
        //存储
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    // 获取和存储全组织的全部项目
    * getUserAllOrgsAllBoards({ payload }, { select, call, put }) {
      let res = yield call(getUserAllOrgsAllBoards, payload)
      if(isApiResponseOk(res)) {
        localStorage.setItem('userAllOrgsAllBoards', JSON.stringify(res.data))
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    //组织 ----------- start
    * getCurrentUserOrganizes({ payload }, { select, call, put }) { //当前用户所属组织列表
      let res = yield call(getCurrentUserOrganizes, {})
      // console.log(res, 'get current use organization list.+++++++++++++++++++++++++++++++++++')
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
          Cookies.set('org_id', res.data[0].id, {expires: 30, path: ''})
        }
        const { calback } = payload
        if (typeof calback === 'function') {
          calback()
        }
      }else{
      }
    },
    * changeCurrentOrg({ payload }, { select, call, put }) { //切换组织
      const { org_id } = payload
      // const org_id = '0'
      let res = yield call(changeCurrentOrg, { org_id })
      if(isApiResponseOk(res)) {
        setOrganizationIdStorage(org_id)
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
          type: 'updateDatas',
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
            calback: function () {
              message.success(`创建${currentNounPlanFilterName(ORGANIZATION)}成功`, MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
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
            calback: function () {
              message.success(`申请加入${currentNounPlanFilterName(ORGANIZATION)}成功`, MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * inviteJoinOrganization({ payload }, { select, call, put }) {
      let res = yield call(inviteJoinOrganization, payload)
      if(isApiResponseOk(res)) {
        message.success(`已成功添加${currentNounPlanFilterName(ORGANIZATION)}${currentNounPlanFilterName(MEMBERS)}`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    //组织 -----------end

    //权限---start获取用户的全部组织和全部项目权限
    * getUserOrgPermissions({ payload }, { select, call, put }) {
      const res = yield call(getUserOrgPermissions, payload)
      if(isApiResponseOk(res)) {
        const OrganizationId = localStorage.getItem('OrganizationId')
        // 全组织的情况下，直接存【组织=》权限】列表
        if(OrganizationId == '0') {
          localStorage.setItem('userOrgPermissions', JSON.stringify(res.data))
          return
        }
        // 非全组织的情况下需要过滤出对应的当前选择的组织，获取对应的权限
        const userInfo = localStorage.getItem('userInfo') || '{}'
        const { current_org = {} } = JSON.parse(userInfo)
        const current_org_id = current_org['id']
        //返回的全部数据遍历和当前的org_id一致，则赋值权限
        for(let val of res.data) {
          if(val['org_id'] == current_org_id) {
            localStorage.setItem('userOrgPermissions', JSON.stringify(val['permissions'] || []))
            break
          }
        }
      }else{
        localStorage.setItem('userOrgPermissions', JSON.stringify([]))
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * getUserBoardPermissions({ payload }, { select, call, put }) {
      let res = yield call(getUserBoardPermissions, payload)
      if(isApiResponseOk(res)) {
        localStorage.setItem('userBoardPermissions', JSON.stringify(res.data || []))
      }else{
        localStorage.setItem('userBoardPermissions', JSON.stringify([]))
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    //权限---end

    //名词定义------start
    * getCurrentNounPlan({ payload }, { select, call, put }) {
      let res = yield call(getCurrentNounPlan, payload)
      if(isApiResponseOk(res)) {
        localStorage.setItem('currentNounPlan', JSON.stringify(res.data || []))
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    //名词定义------end


    * logout({ payload }, { select, call, put }) { //提交表单
      let res = yield call(logout, payload)
      if(isApiResponseOk(res)) {
        Cookies.remove('sdktoken')
        Cookies.remove('uid')
        Cookies.remove('Authorization')
        Cookies.remove('userInfo', { path: '' })
        window.location.hash = `#/login?redirect=${window.location.hash.replace('#', '')}`
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    // 侧边栏功能导航列表
    * getMenuList({payload}, {call, put}) {
      let res = yield call(getMenuList, payload)
      // console.log('this is model', res)
      yield put({
        type: 'updateDatas',
        payload: {
          menuList: res.data
        }
      })
    },
     // 左侧导航栏
    * upDateNaviHeadTabIndex({ payload }, { select, call, put }) {
      yield put({
        type: 'updateDatas',
        payload: {
          naviHeadTabIndex
        }
      })
    },

    // 视频会议集成---start
    * initiateVideoMeeting({payload}, {call}) {
      const res = yield call(createMeeting, payload)
      return res
    },
    * getCurrentOrgProjectList({ payload }, { select, call, put }) {
      let res = yield call(getProjectList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentOrgProjectList: res.data
          }
        })
      }else{

      }
    },
    * fetchCurrentOrgAllMembers({ payload }, {call, put}) {
      let res = yield call(getCurrentOrgAllMembers, {...payload})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentOrgAllMembersList: res.data.users
          }
        })
      }
    },
    ///视频会议集成end

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
