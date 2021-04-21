/** 固定里程碑之间一天的长度
 * @default number 2 // 2个像素
 */
export const DaysWidth = 6

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

/** 里程碑状态和颜色 */
export const MilestoneTypes = {
  /** 正常未完成状态 */
  NormalIncomplete: {
    /** 正常未完成状态字段
     * @default string '0'
     */
    status: '0',
    /** 正常未完成颜色
     * @default string '#C6CACF'
     */
    color: '#C6CACF'
  },
  /** 逾期未完成状态 */
  IncompleteDone: {
    /** 逾期未完成状态字段
     * @default string '1'
     */
    status: '1',
    /** 逾期未完成状态颜色
     * @default string '#F5222D'
     */
    color: '#F5222D'
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
    color: '#52C41A'
  },
  /** 逾期完成的状态 */
  beOverdue: {
    /** 逾期完成状态字段
     * @default string '3'
     */
    status: '3',
    /** 逾期完成颜色
     * @default string '#EFC471'
     */
    color: '#EFC471'
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
    default:
      return {}
  }
}
