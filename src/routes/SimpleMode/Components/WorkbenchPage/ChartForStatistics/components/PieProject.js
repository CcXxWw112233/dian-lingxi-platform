import React from 'react'
import styles from '../index.less'
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

/**
 * 饼图
 */
export default class PieProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    /**
     * echarts节点的id
     */
    this.ChartId = 'project_pie'
    /**
     * echarts的主体
     */
    this.chart = null
  }

  componentDidMount() {
    this.getPieOptionData()
  }

  /**
   * 获取饼图数据
   */
  getPieOptionData = () => {
    this.initEcharts()
  }

  /**
   * 构建echarts
   */
  initEcharts = () => {
    this.chart = echarts.init(document.getElementById(this.ChartId))
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 16
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '90%',
          center: ['35%', '50%'],
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ],
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    this.chart.setOption(option)
  }

  render() {
    return (
      <div className={styles.chart_box_content} id={this.ChartId}></div>
    )
  }
}
