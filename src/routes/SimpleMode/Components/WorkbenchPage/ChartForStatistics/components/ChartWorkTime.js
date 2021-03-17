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
 * 任务工时统计图表
 */
export default class ChartWorkTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.ChartId = 'worktime_chart'
    this.chart = null
    this.resize = debounce(this.resize, 100)
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  componentDidMount() {
    this.initEcharts()
  }

  resize = () => {
    this.chart && this.chart.resize()
  }

  componentDidUpdate() {
    this.updateChart()
  }

  /**
   * 动态更新echarts
   */
  updateChart = () => {
    const { data = {} } = this.props
    const { legend = [], users = [], series = [] } = data
    let newSeries = series.map(item => {
      // 将字符串data转换成number
      let data = item.data.map(a => +a)
      let new_item = {
        ...item,
        type: 'bar',
        stack: '项目',
        data: data,
        barMaxWidth: series.length <= 5 ? 30 : null
      }
      return new_item
    })
    const option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        extraCssText:
          'max-width:200px;max-height:200px;overflow:auto;white-space:pre-wrap;word-break:break-all;',
        enterable: true
      },
      legend: {
        data: legend,
        type: 'scroll', //分页类型
        left: 16,
        formatter: function(params) {
          //标签输出形式 ---请开始你的表演
          var index = 10
          var newstr = ''
          for (var i = 0; i < params.length; i += index) {
            var tmp = params.substring(i, i + index)
            newstr += tmp + '\n'
          }
          if (newstr.length > 20) return newstr.substring(0, 20) + '...'
          else return '\n' + newstr
        },
        triggerEvent: true,
        tooltip: {
          show: true,
          enterable: true
        },
        animation: true
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          // type: 'category',
          data: users,
          // axisTick: {
          //   alignWithLabel: true,
          //   interval: 0
          // },
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          left: '9%',
          bottom: -5,
          start: 0,
          end: 50 //初始化滚动条
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            // formatter: '{value} (h)'
          },
          name: '(时)', //坐标名字

          nameLocation: 'end', //坐标位置，支持start,end，middle

          nameTextStyle: {
            //字体样式

            fontSize: 12 //字体大小
          },
          nameGap: 5
        }
      ],
      series: newSeries
    }
    this.chart.clear()
    this.chart.setOption(option)
    this.chart.hideLoading()
  }

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

  handleEchartClick = () => {}
  render() {
    return <div id={this.ChartId} className={styles.chart_box_content}></div>
  }
}
