/** 组织架构统一redux管理 */
export const OrgStructureModel = {
  /** 命名空间
   * @default string 'orgStructure'
   * @param {boolean} openPanel 是否打开右侧权限的弹窗
   * @param {boolean} showStructure 是否显示组织架构图
   */
  namespace: 'orgStructure',
  /** 初始变量 */
  state: {
    /** 是否打开右侧权限的弹窗
     * @default boolean false
     */
    openPanel: false,
    /** 是否显示组织架构图 */
    showStructure: false
  },
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
  effects: {},
  reducers: {
    [OrgStructureModel.reducers.updateDatas](state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
