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

export default class LineChartProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.chart = null
    this.ChartId = 'project_linechart'

    this.resize = debounce(this.resize, 100)
    window.addEventListener('resize', this.resize)
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
    const { time = [], number = [] } = data
    return [...number].map((item, index) => {
      if (object.name === time[index]) {
        return {
          ...object,
          name: time[index],
          value: item
        }
      }
      return {
        name: time[index],
        value: item
      }
    })
  }

  updateChart = () => {
    const { time = [] } = this.props.data
    const { selectedParam } = this.props
    const option = {
      tooltip: {
        data: 'value',
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: [
        {
          top: '5%'
        }
      ],
      xAxis: {
        type: 'category',
        data: time,
        axisTick: {
          alignWithLabel: true,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '(个)', //坐标名字
        nameLocation: 'end', //坐标位置，支持start,end，middle
        nameTextStyle: {
          //字体样式
          fontSize: 12 //字体大小
        },
        nameGap: 5
      },
      series: [
        {
          top: 0,
          data: [...this.getData(selectedParam)],
          type: 'line'
        }
      ],
      dataZoom:
        time.length > 6
          ? [
              {
                type: 'slider',
                show: true, //flase直接隐藏图形
                xAxisIndex: [0],
                left: '9%', //滚动条靠左侧的百分比
                bottom: -2,
                start: 50, //滚动条的起始位置
                end: 100 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
              }
            ]
          : null
    }
    this.chart.setOption(option)
  }
  /**
   * 构建echarts
   */
  initChart = () => {
    echarts.registerTheme(ECHARTSTHEME, theme)
    this.chart = echarts.init(
      document.getElementById(this.ChartId),
      ECHARTSTHEME
    )
    this.updateChart()
    this.chart.on('click', this.handleEchartClick)
  }

  resize = () => {
    this.chart && this.chart.resize()
  }

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
