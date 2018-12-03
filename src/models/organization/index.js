import { getNounList,getPermissions, savePermission, getRolePermissions, saveRolePermission,createRole,updateRole,deleteRole,copyRole,updateOrganization, setDefaultRole} from '../../services/organization'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  ORG_UPMS_ORGANIZATION_ROLE_EDIT
} from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../services/technological/project";
import modelExtend from 'dva-model-extend'
import technological from './index'
import { selectTabSelectKey } from './select'
import {checkIsHasPermission} from "../../utils/businessFunction";
import {getUSerInfo} from "../../services/technological";

export default  {
  namespace: 'organization',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/organization') {
          const currentSelectOrganize = localStorage.getItem('currentSelectOrganize') ? JSON.parse(localStorage.getItem('currentSelectOrganize')) : {}//JSON.parse(localStorage.getItem('currentSelectOrganize'))
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
              orgnization_role_data: [], //组织角色数据
              project_role_data: [], //项目角色数据
              tabSelectKey: '1',
              // permission_data: [], //权限数据
              //名词定义
              current_scheme: '',
              current_scheme_id: '',
              scheme_data: [],
            }
          })

          if(checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_EDIT)){ //如果有权限才去查
            dispatch({
              type: 'getRolePermissions',
              payload:{
                type: '1',
              }
            })
            dispatch({
              type: 'getRolePermissions',
              payload: {
                type: '2',
              }
            })
            dispatch({
              type: 'getNounList',
              payload: {}
            })
          }

        } else {
        }
      })
    },
  },
  effects: {
    * updateOrganization({ payload }, { select, call, put }) {
      let res = yield call(updateOrganization, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getUSerInfo',
          payload: {
            calBack: function () {
              message.success('更新组织信息成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message,MESSAGE_DURATION_TIME)
      }
    },

    * getUSerInfo({ payload }, { select, call, put }) { //提交表单
      let res = yield call(getUSerInfo, {})
      const { calBack } = payload
      if (typeof calBack === 'function') {
        calBack()
      }
      if(isApiResponseOk(res)) {
        //当前选中的组织
        if(res.data.current_org ) {
          localStorage.setItem('currentSelectOrganize', JSON.stringify(res.data.current_org))
        }
        //存储
        Cookies.set('userInfo', res.data,{expires: 30, path: ''})
      }else{
      }
    },

    * getRolePermissions({ payload }, { select, call, put }) {
      const { type } = payload
      let res = yield call(getPermissions, { type })
      if(isApiResponseOk(res)) {
        const { content_tree_data = [], function_tree_data = [], role_data= [],  } = res.data
        for (let i = 0; i < role_data.length; i++ ) {
          const { already_has_content_permission = [], already_has_function_permission = [] } = role_data[i]
          //权限树
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

          //内容树
          // role_data[i]['content_tree_data'] = JSON.parse(JSON.stringify(content_tree_data))
          // let already_has_content_permission_trans = []
          // for(let i = 0; i < already_has_content_permission.length; i++) {
          //   for(let j = 0; j < already_has_content_permission[i]['pitch_on_data'].length; j ++) {
          //     already_has_content_permission_trans.push(`${already_has_content_permission[i]['board_id']}__${ already_has_content_permission[i]['pitch_on_data'][j]}`)
          //   }
          // }
          // role_data[i]['already_has_content_permission_trans'] = already_has_content_permission_trans
        }
        if(type === '1') { //组织角色数据
          yield put({
            type: 'updateDatas',
            payload: {
              orgnization_role_data: role_data,
            }
          })
        }else if(type === '2') { //项目角色数据
          yield put({
            type: 'updateDatas',
            payload: {
              project_role_data: role_data,
            }
          })
        }

        const { calback } = payload
         if (typeof calback === 'function') {
          calback()
         }
      }else{

      }
    },
    * saveRolePermission({ payload }, { select, call, put }) {
      const tabSelectKey = yield select(selectTabSelectKey)
      const type = tabSelectKey === '2'? '1' : '2'
      let res = yield call(savePermission, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            type,
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
      const tabSelectKey = yield select(selectTabSelectKey)
      const type = tabSelectKey === '2'? '1' : '2'
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            type,
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
      const tabSelectKey = yield select(selectTabSelectKey)
      const type = tabSelectKey === '2'? '1' : '2'
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            type,
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
      let res = yield call(deleteRole, payload)
      const tabSelectKey = yield select(selectTabSelectKey)
      const type = tabSelectKey === '2'? '1' : '2'
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            type,
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
      const tabSelectKey = yield select(selectTabSelectKey)
      const type = tabSelectKey === '2'? '1' : '2'
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            type,
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
      const tabSelectKey = yield select(selectTabSelectKey)
      const type = tabSelectKey === '2'? '1' : '2'
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissions',
          payload: {
            type,
            calback: function () {
              message.success('设置默认角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn('设置默认角色失败', MESSAGE_DURATION_TIME)
      }
    },
    * getNounList({ payload }, { select, call, put }) {
      const { type } = payload
      let res = yield call(getNounList, {})
      const data = res.data
      const scheme_data = data['scheme_data']
      for(let i=0; i < scheme_data.length; i++) {
        if(!scheme_data[i]['field_value'] || !scheme_data[i]['field_value'].length) {
          scheme_data[i]['field_value'] = []
          for(let j=0; j < scheme_data[0]['field_value'].length; j ++) {
            const obj = {
              field_value: '',
            }
            scheme_data[i]['field_value'].push(obj)
          }
        }
      }
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            ...res.data
          }
        })
      }else{

      }
    },

    //权限
    * getPermissions({ payload }, { select, call, put }) {
      const { type } = payload
      let res = yield call(getPermissions, { type })
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
