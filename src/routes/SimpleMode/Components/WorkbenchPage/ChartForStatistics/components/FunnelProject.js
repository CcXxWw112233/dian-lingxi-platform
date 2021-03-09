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
 * 项目统计漏斗图
 */
export default class FunnlProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    /**
     * echarts 节点名称
     */
    this.ChartId = 'project_funnl'
    /**
     * echarts的主体
     */
    this.chart = null
  }

  componentDidMount() {
    this.initChart()
  }

  /**
   * 构建echarts
   */
  initChart = () => {
    this.chart = echarts.init(document.getElementById(this.ChartId))
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      legend: {
        data: ['展现', '点击', '访问', '咨询', '订单'],
        orient: 'vertical',
        right: 16
      },

      series: [
        {
          name: '漏斗图',
          type: 'funnel',
          left: '5%',
          top: 20,
          //x2: 80,
          bottom: 20,
          width: '50%',
          // height: {totalHeight} - y - y2,
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: [
            { value: 60, name: '访问' },
            { value: 40, name: '咨询' },
            { value: 20, name: '订单' },
            { value: 80, name: '点击' },
            { value: 100, name: '展现' }
          ]
        }
      ]
    }

    this.chart.setOption(option)
  }

  render() {
    return <div className={styles.chart_box_content} id={this.ChartId}></div>
  }
}
