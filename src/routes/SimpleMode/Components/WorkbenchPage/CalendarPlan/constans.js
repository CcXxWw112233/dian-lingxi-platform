/** 全选了项目的标识
 * @default string '0'
 */
export const TotalBoardKey = '0'

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
    /** 标题 */
    title: '里程碑',
    /** 图标 */
    icon: '&#xe85d;',
    /** 颜色 */
    color: '#FF0404'
  },
  /** 子里程碑样式 */
  submilestone: {
    /** 标题 */
    title: '子里程碑',
    /** 图标 */
    icon: '&#xe85f;',
    /** 颜色 */
    color: '#FF8A00'
  },
  /** 任务样式 */
  card: {
    /** 标题 */
    title: '任务',
    /** 图标 */
    icon: '&#xe861;',
    /** 颜色 */
    color: '#6A9AFF'
  }
}
