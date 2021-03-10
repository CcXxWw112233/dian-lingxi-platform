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
    filterKey: 'create_time',
    /**
     * 图表类型 line
     */
    chartKey: 'line',
    itemStyle: {
      color: '#ff0000'
    },
    symbol: 'circle',
    symbolSize: 16
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
