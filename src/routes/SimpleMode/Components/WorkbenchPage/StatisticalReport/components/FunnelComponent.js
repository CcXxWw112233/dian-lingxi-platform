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
import { getReportBoardFunnel } from '../../../../../../services/technological/statisticalReport'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import echartTheme from '../echartTheme.json'
import { removeEmptyArrayEle } from '../../../../../../utils/util'
@connect(mapStateToProps)
class FunnelComponent extends Component {
  state = {
    noData: false
  }

  getChartOptions = props => {
    const { status = [], count = [] } = props
    let data = [...count]
    data = data.map((item, index) => {
      let new_item = {
        value: item,
        name: status[index]
      }
      return new_item
    })
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}个'
      },
      legend: {
        data: status,
        orient: 'vertical',
        left: 38,
        bottom: 0,
        type: 'scroll'
      },

      series: [
        {
          // name: '漏斗图',
          type: 'funnel',
          left: '10%',
          top: 60,
          //x2: 80,
          bottom: 60,
          width: '80%',
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
          data: data
        }
      ]
    }

    return option
  }

  getReportBoardFunnel = (selectedKeys = []) => {
    echarts.registerTheme('walden', echartTheme)
    let myChart = echarts.init(
      document.getElementById('funnelComponent'),
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
    let selectedKeys_ = removeEmptyArrayEle(selectedKeys)
    if (selectedKeys_.length == 0) {
      myChart.hideLoading()
      this.setState({
        noData: true
      })
      return
    }
    // option = newline(option, 3, 'xAxis')
    // 使用刚指定的配置项和数据显示图表。
    getReportBoardFunnel({ board_ids: selectedKeys_ }).then(res => {
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
      document.getElementById('funnelComponent'),
      'walden'
    )
    myChart.resize()
  }

  componentDidMount() {
    const { selectedKeys = [] } = this.props
    this.getReportBoardFunnel(selectedKeys)
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
    const {
      simplemodeCurrentProject: { board_id },
      selectedKeys = []
    } = this.props
    const {
      simplemodeCurrentProject: { board_id: next_board_id },
      selectedKeys: new_selectedKeys = []
    } = nextProps
    if (
      board_id != next_board_id ||
      new_selectedKeys.length != selectedKeys.length
    ) {
      this.getReportBoardFunnel(new_selectedKeys)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <div
          id="funnelComponent"
          style={{ width: '100%', height: 580, padding: '0px 2px' }}
        ></div>
        {this.state.noData && (
          <div className={indexStyles.chart_noData}>暂无数据</div>
        )}
      </div>
    )
  }
}

export default FunnelComponent

function mapStateToProps({
  simplemode: { simplemodeCurrentProject = {}, chatImVisiable },
  workbench: {
    datas: { projectList = [] }
  }
}) {
  return {
    simplemodeCurrentProject,
    chatImVisiable,
    projectList
  }
}
