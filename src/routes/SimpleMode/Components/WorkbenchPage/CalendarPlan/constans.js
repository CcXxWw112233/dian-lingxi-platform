/** 全选了项目的标识
 * @default string '0'
 */
export const TotalBoardKey = '0'

/** 模板节点类型 */
export const TempType = {
  /** 里程碑类型 */
  milestoneType: '1',
  /** 任务类型 */
  cardType: '2',
  /** 流程类型 */
  flowType: '3'
}
/** 节点类型 */
export const NodeType = {
  /** 里程碑类型
   * @default string '1'
   */
  milestonetype: '1',
  /** 子里程碑类型
   * @default string '2'
   */
  submilestonetype: '2',
  /** 任务类型
   * @default string '3'
   */
  cardtype: '3',
  /** 子任务类型
   * @default string '4'
   */
  subcardtype: '4',
  /** 未知类型
   * @default string '-1'
   */
  unknowType: '-1'
}

/** 图例列表 */
export const legendList = {
  /** 里程碑样式 */
  milestone: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '里程碑',
    /** 图标 */
    icon: '&#xe85d;',
    /** 颜色 */
    color: '#FF0404'
  },
  /** 子里程碑样式 */
  submilestone: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '子里程碑',
    /** 图标 */
    icon: '&#xe85f;',
    /** 颜色 */
    color: '#FF8A00'
  },
  /** 正常任务样式 */
  card: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '任务',
    /** 图标 */
    icon: '&#xe861;',
    /** 颜色 */
    color: '#6A9AFF'
  },
  /** 已完成任务样式 */
  carddone: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '已完成的任务',
    /** 图标 */
    icon: '&#xe861;',
    /** 颜色 */
    color: '#95DE64'
  },
  /** 未完成任务样式 */
  cardundone: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '未完成的任务',
    /** 图标 */
    icon: '&#xe861;',
    /** 颜色 */
    color: '#CDD1DF'
  },
  /** 逾期任务样式 */
  cardoverdue: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '逾期的任务',
    /** 图标 */
    icon: '&#xe861;',
    /** 颜色 */
    color: '#FF0404'
  },
  /** 预警任务样式 */
  cardwarn: {
    /** 是否显示 */
    visible: true,
    /** 标题 */
    title: '预警的任务',
    /** 图标 */
    icon: '&#xe861;',
    /** 颜色 */
    color: '#FF8A00'
  }
}
