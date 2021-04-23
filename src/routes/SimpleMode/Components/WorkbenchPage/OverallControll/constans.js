/** 固定里程碑之间一天的长度
 * @default number 6 // 6个像素
 */
export const DaysWidth = 6
/** 一条列表的高度 */
export const OverallRowHeight = 68
/** 单个控制点的边距样式 */
export const OverallItem = {
  /** 右侧内边距的距离 */
  paddingRight: 45,
  /** 左侧内边距 */
  paddingLeft: 6,
  /** 最小高度 */
  minHeight: 46
}
/** 图标宽度 */
export const IconWidth = 32
/** 图标的外边距 */
export const IconMarginRight = 8

/** 默认的最小时间，里程碑不允许小与这个时间 */
export const beforeStartMilestoneDays = 10

/** 里程碑宽度常量
 * @default number 260
 */
export const MilestoneWidth = 260
/** 一级节点的高度 */
export const MilestoneTotalHeight = 48
/** mini的二级里程碑的高度 */
export const SubMilestoneMiniHeight = 18
/** large展开的二级里程碑高度 */
export const SubMilestoneHeight = 46
/** 二级里程碑的边距 */
export const SubMilestoneMargin = 10
/** 二级里程碑合集的外层高度 */
export const ParentSubMilestoneHeight = 42

/** 会议类型的固定id */
export const MeetingId = '1384743449475026945'
/** 动作类型的固定id */
export const ActionId = '1384743449475026946'

/** 会议类型 */
export const MeetingType = '1'
/** 动作类型 */
export const ActionType = '2'

/** 里程碑状态和颜色 */
export const MilestoneTypes = {
  /** 正常未完成状态(未开始) */
  NormalIncomplete: {
    /** 正常未完成状态字段
     * @default string '0'
     */
    status: '0',
    /** 正常未完成颜色
     * @default string '#98A9B9'
     */
    color: '#98A9B9',
    /** 透明度 */
    opacity: 1
  },
  /** 逾期未完成状态 */
  IncompleteDone: {
    /** 逾期未完成状态字段
     * @default string '1'
     */
    status: '1',
    /** 逾期未完成状态颜色
     * @default string '#FD5C45'
     */
    color: '#FD5C45',
    /** 透明度 */
    opacity: 1
  },
  /** 正常完成状态 */
  NormalDone: {
    /** 正常完成状态字段
     * @default string '2'
     */
    status: '2',
    /** 正常完成颜色
     * @default string '#52C41A'
     */
    color: '#52C41A',
    /** 透明度 */
    opacity: 0.45
  },
  /** 逾期完成的状态 */
  beOverdue: {
    /** 逾期完成状态字段
     * @default string '3'
     */
    status: '3',
    /** 逾期完成颜色
     * @default string '#8D1700'
     */
    color: '#8D1700',
    /** 透明度 */
    opacity: 0.45
  },
  /** 预警未完成状态 */
  WarnWillIncomplete: {
    /** 逾期完成状态字段
     * @default string '4'
     */
    status: '4',
    /** 逾期完成颜色
     * @default string '#FEAE02'
     */
    color: '#FEAE02',
    /** 透明度 */
    opacity: 1
  }
}

/** 根据状态获取状态详情
 * @param {'0' | '1' | '2' | '3'} type 状态
 * @returns {{status: string, color: string}}
 */
export const getStatus = type => {
  switch (type) {
    case MilestoneTypes.NormalDone.status:
      return MilestoneTypes.NormalDone
    case MilestoneTypes.IncompleteDone.status:
      return MilestoneTypes.IncompleteDone
    case MilestoneTypes.NormalIncomplete.status:
      return MilestoneTypes.NormalIncomplete
    case MilestoneTypes.beOverdue.status:
      return MilestoneTypes.beOverdue
    case MilestoneTypes.WarnWillIncomplete.status:
      return MilestoneTypes.WarnWillIncomplete
    default:
      return {}
  }
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
