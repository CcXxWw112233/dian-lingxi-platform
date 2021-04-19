/**
 * 项目统计分布
 */
export const DefaultFilterConditions = {
  /**
   * 状态分布
   */
  STATUS: {
    key: '1',
    value: '1',
    name: '状态分布',
    filterName: '',
    /**
     * 查询条件需要过滤的字段 status
     */
    filterKey: 'status',
    /**
     * 图表类型 Pie
     */
    chartKey: 'Pie',
    /**
     * 高亮的样式
     */
    itemStyle: {
      borderColor: '#000',
      borderWidth: 2,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 10
    }
  },
  /**
   * 阶段分布
   */
  STEPS: {
    key: '2',
    value: '2',
    name: '阶段分布',
    filterName: '',
    /**
     * 查询条件需要过滤的字段 stages
     */
    filterKey: 'stages',
    /**
     * 图表类型 Funnel
     */
    chartKey: 'Funnel'
  },
  /**
   * 时间分布
   */
  TIME: {
    key: '3',
    value: '3',
    name: '时间分布',
    filterName: '',
    /**
     * 查询条件需要过滤的字段 create_time
     */
    filterKey: 'start_time',
    /**
     * 图表类型 Line
     */
    chartKey: 'Line',
    itemStyle: {
      color: '#ff0000'
    },
    symbol: 'circle',
    symbolSize: 16
  },
  /**
   * 状态分布
   */
  CARD_STATUS: {
    key: '4',
    value: '4',
    name: '状态分布',
    filterName: '',
    /**
     * 查询条件需要过滤的字段 status_value
     */
    filterKey: 'status_value',
    /**
     * 图表类型 card_pie
     */
    chartKey: 'card_pie',
    /**
     * 高亮的样式
     */
    itemStyle: {
      borderColor: 'rgba(0, 0, 100, 0.5)',
      borderWidth: 3,
      shadowColor: 'rgba(0, 0, 100, 0.5)',
      shadowBlur: 10
    }
  },
  /**
   * 任务工时分布
   */
  CARD_TIME: {
    key: '5',
    value: '5',
    name: '工时分布',
    filterName: '',
    /**
     * 查询条件需要过滤的字段 executors
     */
    filterKey: 'executors',
    /**
     * 图表类型 card_time
     */
    chartKey: 'card_time',
    /**
     * 高亮的样式
     */
    itemStyle: {
      borderColor: 'rgba(0, 0, 100, 0.5)',
      borderWidth: 3
      // shadowColor: 'rgba(0, 0, 100, 0.5)',
      // shadowBlur: 15
    }
  },
  /**
   * 任务数量分布
   */
  CARD_NUMBER: {
    key: '6',
    value: '6',
    name: '数量分布',
    filterName: '',
    /**
     * 查询条件需要过滤的字段 executors
     */
    filterKey: 'executors',
    /**
     * 图表类型 card_number
     */
    chartKey: 'card_number',
    /**
     * 高亮的样式
     */
    itemStyle: {
      borderColor: 'rgba(0, 0, 100, 0.5)',
      borderWidth: 3
      // shadowColor: 'rgba(0, 0, 100, 0.5)',
      // shadowBlur: 15
    }
  }
}

/**
 * 是否全选项目
 */
export const ALLBOARD = '0'

/**
 * echarts主题名称
 */
export const ECHARTSTHEME = 'walden'

/**
 * 项目类型标识
 */
export const BOARDQRCODE = 'board_statistic'
/**
 * 任务类型标识
 */
export const CARDQRCODE = 'card_statistic'
