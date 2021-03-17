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
import theme from '../../StatisticalReport/echartTheme.json'
import { ECHARTSTHEME } from '../constans'
import { message } from 'antd'
import { debounce } from '../../../../../../utils/util'
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
    this.resize = debounce(this.resize, 100)
    window.addEventListener('resize', this.resize)
  }

  resize = () => {
    this.chart && this.chart.resize()
  }

  componentDidMount() {
    this.initChart()
  }
  componentDidUpdate() {
    this.updateChart()
  }

  /**
   * 通过数据重组一个数据
   * @returns [{name: '', value}]
   */
  getData = (object = {}) => {
    const { data = {} } = this.props
    const { status = [], count = [] } = data
    if (status.length || count.length)
      return count.map((item, index) => {
        if (object.name === status[index]) {
          return {
            ...object,
            name: status[index],
            value: item
          }
        }
        return {
          name: status[index],
          value: item
        }
      })
    else if (!status.length && !count.length)
      return [
        {
          name: '暂无阶段分布数据',
          value: 100,
          emptyData: true,
          itemStyle: {
            color: '#ccc'
          },
          emphasis: {
            scale: false,
            label: {
              fontSize: 12
            }
          }
        }
      ]
  }

  /**
   * 动态更新echarts
   */
  updateChart = () => {
    const { data = {} } = this.props
    const chart_data = this.getData()
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: param => {
          if (param.data.emptyData) {
            return '暂无阶段分布数据'
          }
          return param.name + '\n' + param.value
        }
      },
      legend: {
        data: data.status,
        orient: 'vertical',
        right: 16
      },

      series: [
        {
          name: '阶段分布',
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
          gap: 0,
          selectedMode: 'single',
          label: {
            show: true,
            formatter: params => {
              if (params.data.emptyData) {
                return '暂无阶段分布数据'
              }
              return params.name + '\n' + params.value
            },
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
          data: chart_data
        }
      ]
    }
    // this.chart.clear()
    this.chart.setOption(option)
  }
  /**
   * 构建echarts
   */
  initChart = () => {
    const { data = {} } = this.props
    echarts.registerTheme(ECHARTSTHEME, theme)
    this.chart = echarts.init(
      document.getElementById(this.ChartId),
      ECHARTSTHEME
    )
    this.updateChart()
    this.chart.on('click', this.handleEchartClick)
  }

  /**
   * echarts点击事件处理
   */
  handleEchartClick = params => {
    const { onHandleClick } = this.props
    if (params.data.emptyData) return
    if (params.data.value > 0) onHandleClick && onHandleClick(params.data)
    else message.warn('所选图表无数据，无法作为过滤条件')
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {
    return <div className={styles.chart_box_content} id={this.ChartId}></div>
  }
}
