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
import { ECHARTSTHEME } from '../constans'
import theme from '../../StatisticalReport/echartTheme.json'
import { debounce } from '../../../../../../utils/util'

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
    this.resize = debounce(this.resize, 100)
    window.addEventListener('resize', this.resize)
  }

  componentDidMount() {
    this.getPieOptionData()
  }

  resize = () => {
    this.chart && this.chart.resize()
  }

  /**
   * 获取饼图数据
   */
  getPieOptionData = () => {
    this.initEcharts()
  }

  /**
   * 通过数据重组一个数据
   * @returns [{name: '', value}]
   */
  getPieData = (object = {}) => {
    const { data = {} } = this.props
    const { status = [], count = [] } = data
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
  }

  componentDidUpdate() {
    this.updateChart()
  }

  /**
   * 动态更新echarts
   */
  updateChart = () => {
    /**
     * data {status} legend的文字列表
     * count series数据
     */
    const { data, selectedParam } = this.props
    const sData = this.getPieData(selectedParam)
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 16,
        data: data.status,
        type: 'scroll'
      },
      series: [
        {
          name: '状态分布',
          type: 'pie',
          radius: '90%',
          center: ['35%', '50%'],
          data: sData,
          label: {
            show: true,
            formatter: params =>
              params.value > 0 ? params.name + '\n' + params.value : '',
            position: 'inside'
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
    if (sData.length) this.chart.hideLoading()
  }

  /**
   * 构建echarts
   */
  initEcharts = () => {
    echarts.registerTheme(ECHARTSTHEME, theme)
    this.chart = echarts.init(
      document.getElementById(this.ChartId),
      ECHARTSTHEME
    )
    this.chart.showLoading()
    this.updateChart()
    this.chart.on('click', this.handleEchartClick)
  }

  /**
   * echarts点击事件处理
   */
  handleEchartClick = params => {
    const { onHandleClick } = this.props
    const { data } = params
    if (data.value > 0) onHandleClick && onHandleClick(data)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {
    return <div className={styles.chart_box_content} id={this.ChartId}></div>
  }
}
