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
 * 数量分布图表
 */
export default class ChartTaskNumber extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.ChartId = 'chart_task_number'
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
    const { data = {}, selectedParam = {} } = this.props
    const { legend = [], users = [], series = [], user_ids = [] } = data
    let newSeries = series.map(item => {
      // 将字符串data转换成number
      let data = item.data.map((a, index) => {
        if (user_ids[index] === selectedParam.user_id) {
          return {
            ...selectedParam,
            name: users[index],
            value: +a,
            user_id: user_ids[index]
          }
        }
        return {
          name: users[index],
          value: +a,
          user_id: user_ids[index]
        }
      })
      let new_item = {
        ...item,
        type: 'bar',
        stack: '项目',
        label: {
          show: true,
          position: 'inside',
          formatter: function(params) {
            if (params.value > 0) {
              return params.value
            } else {
              return ''
            }
          }
        },
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
        type: 'scroll',
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
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          textStyle: null,
          yAxisIndex: [0],
          left: -2,
          bottom: 30,
          start: 0,
          end: users.length > 8 ? 50 : 90 //初始化滚动条
        }
      ],
      xAxis: {
        type: 'value',
        axisLabel: {
          // formatter: '{value} (个)'
        },
        name: '(个)', //坐标名字
        nameLocation: 'end', //坐标位置，支持start,end，middle
        nameTextStyle: {
          //字体样式
          fontSize: 12, //字体大小
          padding: 5
        },
        nameGap: 5
      },
      yAxis: {
        type: 'category',
        data: users
        // axisLabel: true
      },
      series: newSeries
    }
    this.chart.clear()
    this.chart.setOption(option)
    this.chart.hideLoading()
  }
  /**
   * 构建图表
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

  handleEchartClick = val => {
    const { onHandleClick } = this.props

    const { data } = val
    if (data.value > 0) {
      onHandleClick && onHandleClick(data)
    }
  }

  render() {
    return <div id={this.ChartId} className={styles.chart_box_content}></div>
  }
}
