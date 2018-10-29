import { getPermissions, savePermission, getRolePermissions, saveRolePermission,createRole,updateRole,deleteRole,copyRole,updateOrganization, setDefaultRole} from '../../services/organization'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../services/technological/project";
import modelExtend from 'dva-model-extend'
import technological from './index'

export default  {
  namespace: 'organization',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/organization') {
          const currentSelectOrganize = sessionStorage.getItem('currentSelectOrganize') ? JSON.parse(sessionStorage.getItem('currentSelectOrganize')) : {}//JSON.parse(sessionStorage.getItem('currentSelectOrganize'))
          const {name, member_join_model, member_join_content, logo, logo_id, id} = currentSelectOrganize
          dispatch({
            type: 'updateDatas',
            payload:{
              currentOrganizationInfo: { //组织信息
                name,
                member_join_model,
                member_join_content,
                logo,
                logo_id,
                id
              },
              content_tree_data: [], //可访问内容
              function_tree_data: [],
              role_data: [], //角色数据
              permission_data: [], //权限数据
            }
          })
          dispatch({
            type: 'getRolePermissions',
            payload:{

            }
          })
          dispatch({
            type: 'getPermissions',
            payload: {}
          })
        } else {
        }
      })
    },
  },
  effects: {
    * updateOrganization({ payload }, { select, call, put }) {
      let res = yield call(updateOrganization, payload)
      if(isApiResponseOk(res)) {
         message.success('更新组织信息成功',MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * getRolePermissions({ payload }, { select, call, put }) {
      let res = yield call(getRolePermissions, {})
      if(isApiResponseOk(res)) {
        const { content_tree_data = [], function_tree_data = [], role_data= [],  } = res.data
        for (let i = 0; i < role_data.length; i++ ) {
          const { already_has_content_permission = [], already_has_function_permission = [] } = role_data[i]
          role_data[i]['content_tree_data'] = JSON.parse(JSON.stringify(content_tree_data))
          role_data[i]['function_tree_data'] = JSON.parse(JSON.stringify(function_tree_data))

          const authDataChild =  role_data[i]['function_tree_data']
          for(let j = 0; j < authDataChild.length ; j ++) { //取出相同的
            let selects = []
            for(let k = 0; k < authDataChild[j].child_data.length; k++) {
              for(let z = 0; z < already_has_function_permission.length; z++) {
                if(already_has_function_permission[z] === authDataChild[j].child_data[k].id) {
                  selects.push(already_has_function_permission[z])
                }
              }
            }
            role_data[i]['function_tree_data'][j]['selects'] = selects
            if(selects.length ===   authDataChild[j].child_data.length) {
              role_data[i]['function_tree_data'][j]['checkedAll'] = true
              role_data[i]['function_tree_data'][j]['indeterminate'] = false
            }else {
              role_data[i]['function_tree_data'][j]['checkedAll'] = false
              if (selects.length) {
                role_data[i]['function_tree_data'][j]['indeterminate'] = true
              }else{
                role_data[i]['function_tree_data'][j]['indeterminate'] = false
              }
            }
          }

          let already_has_content_permission_trans = []
          for(let i = 0; i < already_has_content_permission.length; i++) {
            for(let j = 0; j < already_has_content_permission[i]['pitch_on_data'].length; j ++) {
              already_has_content_permission_trans.push(`${already_has_content_permission[i]['board_id']}__${ already_has_content_permission[i]['pitch_on_data'][j]}`)
            }
          }
          role_data[i]['already_has_content_permission_trans'] = already_has_content_permission_trans
        }
        yield put({
          type: 'updateDatas',
          payload: {
            content_tree_data,
            function_tree_data,
            role_data,
          }
        })
        const { calback } = payload
         if (typeof calback === 'function') {
          calback()
         }
      }else{

      }
    },
    * saveRolePermission({ payload }, { select, call, put }) {
      let res = yield call(saveRolePermission, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            calback: function () {
              message.success('保存成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('保存失败', MESSAGE_DURATION_TIME)
      }
    },
    * createRole({ payload }, { select, call, put }) {
      let res = yield call(createRole, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            calback: function () {
              message.success('添加角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('添加角色失败', MESSAGE_DURATION_TIME)
      }
    },
    * updateRole({ payload }, { select, call, put }) {
      let res = yield call(updateRole, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            calback: function () {
              message.success('更新角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('更新角色失败', MESSAGE_DURATION_TIME)
      }
    },
    * deleteRole({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(deleteRole, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            calback: function () {
              message.success('删除角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('删除角色失败', MESSAGE_DURATION_TIME)
      }
    },
    * copyRole({ payload }, { select, call, put }) {
      let res = yield call(copyRole, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            calback: function () {
              message.success('复制角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('复制角色失败', MESSAGE_DURATION_TIME)
      }
    },
    * setDefaultRole({ payload }, { select, call, put }) {
      let res = yield call(setDefaultRole, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            calback: function () {
              message.success('设置默认角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('设置默认角色失败', MESSAGE_DURATION_TIME)
      }
    },

    //权限
    * getPermissions({ payload }, { select, call, put }) {
      let res = yield call(getPermissions, payload)
      if(isApiResponseOk(res)) {
        const { role_data, function_data } = res.data
        const newData = JSON.parse(JSON.stringify(function_data))
        for(let i = 0; i < newData.length; i++ ) {
          for(let j = 0; j < newData[i].child_data.length; j++) {
            newData[i].child_data[j]['role_data'] = role_data
            if(newData[i].child_data[j]['role_data'].length <= newData[i].child_data[j]['already_has_role'].length ) {
              newData[i].child_data[j]['indeterminate'] = false
              newData[i].child_data[j]['checkedAll'] = true
            }else {
              newData[i].child_data[j]['checkedAll'] = false
              if(newData[i].child_data[j]['already_has_role'].length) {
                newData[i].child_data[j]['indeterminate'] = true
              }else {
                newData[i].child_data[j]['indeterminate'] = false
              }
            }

          }
        }
        yield put({
          type: 'updateDatas',
          payload: {
            permission_data: newData
          }
        })

        const{ calback } = payload
        if(typeof calback === 'function') {
          calback()
        }
      }else{

      }
    },
    * savePermission({ payload }, { select, call, put }) {
      let res = yield call(savePermission, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getPermissions',
          payload: {
            calback: function () {
              message.success('保存成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('保存失败', MESSAGE_DURATION_TIME)
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
