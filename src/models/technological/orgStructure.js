import { MarkDefaultType } from '../../routes/SimpleMode/Components/SimpleHeader/Components/OrganizationalStructure/constans'

/** 组织架构统一redux管理 */
export const OrgStructureModel = {
  /** 组织架构命名空间
   * @default string 'orgStructure'
   * @param {boolean} openPanel 是否打开右侧权限的弹窗
   * @param {boolean} showStructure 是否显示组织架构图
   * @param {{role_group_id: string, role_group_name: string}} activeRoleData 选中的角色信息
   */
  namespace: 'orgStructure',
  /** 初始变量 */
  state: {
    /** 是否打开右侧权限的弹窗
     * @default boolean false
     */
    openPanel: false,
    /** 是否显示组织架构图 */
    showStructure: true,
    /** 选中的角色信息 */
    activeRoleData: null
  },
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
