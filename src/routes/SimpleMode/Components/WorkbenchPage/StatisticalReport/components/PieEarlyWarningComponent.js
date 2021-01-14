import React, { Component } from 'react'
import { Table } from 'antd'
import indexStyles from '../index.less'
import { connect } from 'dva'
import globalStyles from '@/globalset/css/globalClassName.less'
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import {
  getReportBoardCode,
  getReportBoardWarnStatus
} from '../../../../../../services/technological/statisticalReport'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import echartTheme from '../echartTheme.json'
import { timestampToTimeNormal } from '../../../../../../utils/util'
@connect(mapStateToProps)
class PieEarlyWarningComponent extends Component {
  state = {
    noData: false,
    data: [],
    code_url: ''
    // count: ['33', '40', '50', '60'],
    // status: ['预警', '逾期', '未完成', '已完成']
  }
  initState = () => {
    this.setState({
      noData: false,
      data: [],
      code_url: ''
    })
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

  getReportBoardCode = board_id => {
    if (!board_id || board_id == 0) {
      this.setState({
        code_url: ''
      })
      return
    }
    getReportBoardCode({ board_id }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          code_url: res.data.code_url
        })
      }
    })
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
    let flag = Object.keys(data.find(item => item.value == 0) || {}).length
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
          radius: '75%',
          center: ['45%', '50%'],
          data: data,
          label: {
            normal: {
              position: !!flag ? 'inside' : 'outside',
              formatter: !!flag
                ? function(params) {
                    if (params.value > 0) {
                      return `${params.name} \n ${params.value}`
                    } else {
                      return ''
                    }
                  }
                : '{b|{b}}  \n  {c|{c}}',
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
                  color: 'rgba(0,0,0,0.65)'
                },
                c: {
                  //value 文字样式
                  fontSize: 16,
                  lineHeight: 30,
                  color: 'rgba(0,0,0,0.65)', //'#63BF6A',
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

  getReportBoardWarnStatus = board_id => {
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
    if (!board_id || board_id == 0) {
      myChart.hideLoading()
      this.setState({
        noData: true
      })
      return
    }
    getReportBoardWarnStatus({ board_id }).then(res => {
      if (isApiResponseOk(res)) {
        let flag = false
        let data = res.data.count
        if (data && data instanceof Object) {
          if (Object.keys(data).length) {
            flag = true
          }
        } else if (data instanceof Array) {
          if (data.length) {
            flag = true
          }
        }
        this.setState({
          data: res.data.items
        })
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
      } else {
        myChart.hideLoading()
        this.setState({
          noData: true
        })
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
    const {
      simplemodeCurrentProject: { board_id }
    } = this.props
    this.getReportBoardWarnStatus(board_id)
    this.getReportBoardCode(board_id || '')
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
      this.getReportBoardWarnStatus(next_board_id)
      this.getReportBoardCode(next_board_id)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
    this.initState()
  }

  setTableData = (arr = []) => {
    return arr.map(item => {
      let new_item = { ...item }
      new_item.key = item.id
      if (new_item.children.length == 0) delete new_item.children
      if (new_item.children && !!new_item.children.length) {
        new_item.children = this.setTableData(new_item.children)
      }
      return new_item
    })
  }

  renderTableContent = () => {
    let { data = [] } = this.state
    const { workbenchBoxContent_height } = this.props
    const scroll_height = workbenchBoxContent_height - 800
    const columns = [
      { title: '事件名称', dataIndex: 'name', key: 'name', width: 164 },
      {
        title: '责任方',
        dataIndex: 'group_name',
        key: 'group_name',
        width: 164
      },
      { title: '进度/状态', dataIndex: 'status', key: 'status', width: 164 },
      {
        title: '截止日期',
        dataIndex: 'end_time',
        key: 'end_time',
        width: 164,
        render: (text, record, index) => {
          const { end_time, overdue_day, warning_day } = record
          return (
            <span>
              <span style={{ marginRight: '15px' }}>
                {end_time && timestampToTimeNormal(end_time)}
              </span>
              {''}
              {overdue_day ? (
                <span
                  style={{ color: '#F5222D' }}
                >{`逾期${overdue_day}天`}</span>
              ) : warning_day ? (
                <span
                  style={{ color: '#FAAD14' }}
                >{`剩余${warning_day}天`}</span>
              ) : (
                ''
              )}
            </span>
          )
        }
      }
    ]
    data = this.setTableData(data)
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 450 }}
          style={{ maxHeight: 500 }}
          rowKey="id"
        />
      </div>
    )
  }

  // 渲染饼图
  renderPieDraw = () => {
    return (
      <>
        <div
          id="pieEarlyWarnContent"
          style={{
            width: '60%',
            height: 480,
            padding: '0px 2px'
          }}
        ></div>
        {this.state.noData && (
          <div className={indexStyles.chart_noData}>暂无数据</div>
        )}
      </>
    )
  }

  render() {
    const { data = [] } = this.state
    return (
      <>
        <div className={indexStyles.chart_c_top}>
          {this.renderPieDraw()}
          <div className={indexStyles.chart_d_code}>
            <div>
              <img
                src={this.state.code_url}
                style={{
                  width: '206px',
                  height: '206px'
                  // backgroundColor: 'pink'
                }}
                alt="二维码"
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span>
                {' '}
                <span
                  style={{ color: '#2BA244', fontSize: '18px' }}
                  className={globalStyles.authTheme}
                >
                  &#xe837;
                </span>
                微信扫一扫
              </span>
              <div>手机上随时掌握最新动态</div>
            </div>
          </div>
        </div>
        <div className={indexStyles.chart_c_bottom}>
          {this.renderTableContent(data)}
        </div>
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
