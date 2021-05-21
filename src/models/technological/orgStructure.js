import {
  getOrgPermissions,
  savePermission,
  orgAaccessInviteWeb,
  getRolePermissionsAndMenber,
  addNewMemberTag,
  updateMemberTag,
  deleteMemberTag,
  getMemberTagList,
  addRoleMenberTag,
  deleteRelaMemberTag
} from '../../services/organization'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  ORG_UPMS_ORGANIZATION_ROLE_EDIT
} from '../../globalset/js/constant'
import { MarkDefaultType } from '../../routes/SimpleMode/Components/SimpleHeader/Components/OrganizationalStructure/constans'

/** 组织架构统一redux管理 */
export const OrgStructureModel = {
  /** 组织架构命名空间
   * @default string 'orgStructure'
   * @param {boolean} openPanel 是否打开右侧权限的弹窗
   * @param {boolean} showStructure 是否显示组织架构图
   * @param {{role_group_id: string, role_group_name: string}} activeRoleData 选中的角色信息
   * @param {boolean} canHandle 是否可编辑
   * @param {*} currentOrgTagList   当前组织标签列表
   * @param {*} orgPermissionsList  组织权限列表
   */
  namespace: 'orgStructure',
  /** 初始变量 */
  state: {
    /** 是否打开右侧权限的弹窗
     * @default boolean false
     */
    openPanel: false,
    /** 是否显示组织架构图 */
    showStructure: false,
    /**组织权限列表 */
    orgPermissionsList: [],
    /**当前组织标签列表 */
    currentOrgTagList: [],
    /**是否可编辑 */
    canHandle: true,
    /** 选中的角色信息 */
    activeRoleData: null
  },
  /** 添加成员标签
   * @param {string} member_id 成员ID
   * @param {string} label_id 标签id
   */
  addNewMemberTag: 'addNewMemberTag',
  /** 获取角色详情，展开权限面板
   * @example {role_group_id: '0', role_group_name: ''} role_info '角色信息'
   * @param {string} markType 角色是否是默认类型
   */
  getRoleInfo: 'getRoleInfo',
  /** 更新的方法 */
  reducers: {
    /** 更新state里的所有变量 */
    updateDatas: 'updateDatas'
  }
}

/** 组织架构的redux */
export default {
  namespace: OrgStructureModel.namespace,
  state: { ...OrgStructureModel.state },
  effects: {
    /**组织菜单、功能权限列表 */
    *getOrgPermissions({ payload }, { select, call, put }) {
      let res = yield call(getOrgPermissions, payload)
      if (isApiResponseOk(res)) {
        // message.success('已保存', MESSAGE_DURATION_TIME)
        // const result = JSON.stringify(res.data || [])
        yield put({
          type: 'updateDatas',
          payload: {
            orgPermissionsList: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    /**保存权限 */
    *savePermission({ payload }, { select, call, put }) {
      let res = yield call(savePermission, payload)
      const { function_data } = payload
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentPermissionList: function_data
          }
        })
      } else {
        message.warn('保存失败', MESSAGE_DURATION_TIME)
      }
    },
    /** web端各种入口邀请人员加入组织逻辑处理*/
    *orgAaccessInviteWeb({ payload }, { select, call, put }) {
      debugger
      let res = yield call(orgAaccessInviteWeb, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getRolePermissionsAndMenber',
          payload: {
            org_id: payload._organization_id,
            role_id: payload.role_id
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    /** 角色信息（包括权限，成员） */
    *getRolePermissionsAndMenber({ payload }, { select, call, put }) {
      let res = yield call(getRolePermissionsAndMenber, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            orgMembersList: res.data.members,
            currentPermissionList: res.data.permissions
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    /** 添加成员标签 */
    *[OrgStructureModel.addNewMemberTag]({ payload }, { select, call, put }) {
      let res = yield call(addNewMemberTag, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getMemberTagList',
          payload: {}
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
      return res.data
    },
    /** 修改成员标签 */
    *updateMemberTag({ payload }, { select, call, put }) {
      let res = yield call(updateMemberTag, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getMemberTagList',
          payload: {}
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    /** 删除成员标签 */
    *deleteMemberTag({ payload }, { select, call, put }) {
      let res = yield call(deleteMemberTag, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getMemberTagList',
          payload: {}
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    /** 获取成员标签 */
    *getMemberTagList({ payload }, { select, call, put }) {
      let res = yield call(getMemberTagList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentOrgTagList: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    /**  为成员打标签 */
    *addRoleMenberTag({ payload }, { select, call, put }) {
      let res = yield call(addRoleMenberTag, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'getMemberTagList',
          payload: {}
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    /**  移除成员标签 */
    *deleteRelaMemberTag({ payload }, { select, call, put }) {
      let res = yield call(deleteRelaMemberTag, payload)
      if (isApiResponseOk(res)) {
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *[OrgStructureModel.getRoleInfo]({ payload }, { put, call }) {
      /** 先显示右侧弹框数据 */
      if (payload.markType !== MarkDefaultType)
        yield put({
          type: OrgStructureModel.reducers.updateDatas,
          payload: {
            activeRoleData: payload.role_info
          }
        })
      /** 请求详情代码 */
    }
  },
  reducers: {
    [OrgStructureModel.reducers.updateDatas](state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
