import React, { Component } from 'react'
import indexStyles from '../index.less'
import { connect } from 'dva'

// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { getReportBoardWarnStatus } from '../../../../../../services/technological/statisticalReport'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import echartTheme from '../echartTheme.json'
@connect(mapStateToProps)
class PieEarlyWarningComponent extends Component {
  state = {
    noData: false,
    count: ['33', '40', '50', '60'],
    status: ['预警', '逾期', '未完成', '已完成']
  }

  //数据为零时隐藏线段
  lineHide = (arr = []) => {
    arr.forEach(item => {
      if (item.value == 0) {
        item.itemStyle.normal.labelLine.show = false
        item.itemStyle.normal.label.show = false
      }
    })
  }

  getChartOptions = props => {
    const { status = [], count = [] } = this.state
    let data = [...count]
    data = data.map((item, index) => {
      let new_item = {
        value: item,
        name: status[index]
      }
      return new_item
    })
    // data = data.map(item => {
    //   let new_item = { ...item }
    //   if (item.value == 0) {
    //     new_item.itemStyle = {
    //       normal: {
    //         label: {
    //           show: false,
    //           position: 'inside'
    //         },
    //         labelLine: {
    //           show: false
    //         }
    //       }
    //     }
    //     return new_item
    //   } else {
    //     new_item.itemStyle = {
    //       normal: {
    //         label: {
    //           show: true,
    //           formatter: `${item.name} \n ${item.value}`
    //         },
    //         labelLine: {
    //           show: true
    //         }
    //       }
    //     }
    //     return new_item
    //   }
    // })
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 38,
        top: '40%',
        data: status,
        type: 'scroll'
      },
      color: ['#F6BD16', '#FF5959', '#CDD1DF', '#95DE64'],
      series: [
        {
          // name: '访问来源',
          type: 'pie',
          radius: '85%',
          center: ['45%', '50%'],
          data: data,
          label: {
            normal: {
              // position: 'inside',
              formatter: '{b|{b}}  \n  {c|{c}}',
              //图形外文字上下显示
              borderWidth: 20,
              borderRadius: 4,
              // padding: [0, -70], //文字和图的边距
              rich: {
                a: {
                  color: '#333',
                  fontSize: 16,
                  lineHeight: 30
                },
                b: {
                  //name 文字样式
                  fontSize: 16,
                  lineHeight: 30,
                  color: '#CDCDD0'
                },
                c: {
                  //value 文字样式
                  fontSize: 16,
                  lineHeight: 30,
                  color: '#CDCDD0', //'#63BF6A',
                  align: 'center'
                }
              }
            }
            // normal: {
            //   formatter: function(params) {
            //     if (params.value > 0) {
            //       return params.value
            //     } else {
            //       return ''
            //     }
            //   },
            //   position: 'inside'
            // }
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
    return option
  }

  getReportBoardWarnStatus = () => {
    echarts.registerTheme('walden', echartTheme)
    let myChart = echarts.init(
      document.getElementById('pieEarlyWarnContent'),
      'walden'
    )
    myChart.clear()
    myChart.showLoading({
      text: 'loading',
      color: '#5B8FF9',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.2)',
      zlevel: 0
    })
    getReportBoardWarnStatus().then(res => {
      if (isApiResponseOk(res)) {
        let flag = false
        let data = res.data
        if (data && data instanceof Object) {
          if (Object.keys(data).length) {
            flag = true
          }
        } else if (data instanceof Array) {
          if (data.length) {
            flag = true
          }
        }
        if (flag) {
          let option = this.getChartOptions(res.data)
          // option = newline(option, 3, 'xAxis')
          // 使用刚指定的配置项和数据显示图表。
          // var opt = option.series
          // this.lineHide(opt)
          // option.series = opt
          myChart.hideLoading()
          myChart.setOption(option)
          this.setState({
            noData: false
          })
        } else {
          this.setState({
            noData: true
          })
        }
        myChart.hideLoading()
      }
    })
  }

  resizeTTY = () => {
    echarts.registerTheme('walden', echartTheme)
    let myChart = echarts.init(
      document.getElementById('pieEarlyWarnContent'),
      'walden'
    )
    myChart.resize()
  }

  componentDidMount() {
    this.getReportBoardWarnStatus()
    window.addEventListener('resize', this.resizeTTY)
  }

  componentDidUpdate(prevProps, prevState) {
    const { chatImVisiable: prev_chatImVisiable } = prevProps
    const { chatImVisiable } = this.props
    if (chatImVisiable != prev_chatImVisiable) {
      this.resizeTTY()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { board_id } = this.props.simplemodeCurrentProject
    const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
    if (board_id != next_board_id) {
      this.getReportBoardWarnStatus()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }

  render() {
    return (
      <>
        <div
          id="pieEarlyWarnContent"
          style={{ width: 780, height: 480, padding: '0px 2px' }}
        ></div>
        {this.state.noData && (
          <div className={indexStyles.chart_noData}>暂无数据</div>
        )}
      </>
    )
  }
}

export default PieEarlyWarningComponent

function mapStateToProps({
  simplemode: { simplemodeCurrentProject = {}, chatImVisiable }
}) {
  return {
    simplemodeCurrentProject,
    chatImVisiable
  }
}
