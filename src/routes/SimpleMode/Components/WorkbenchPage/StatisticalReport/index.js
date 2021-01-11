import React, { Component } from 'react'
import { connect } from 'dva'
import { Table } from 'antd'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import HistogramComponent from './components/HistogramComponent'
import BarDiagramentComponent from './components/BarDiagramentComponent'
import PieComponent from './components/PieComponent'
import LineComponent from './components/LineComponent'
import PieEarlyWarningComponent from './components/PieEarlyWarningComponent'
import { timestampToTimeNormal } from '../../../../../utils/util'
import { currentNounPlanFilterName } from '../../../../../utils/businessFunction'
import { PROJECTS } from '../../../../../globalset/js/constant'
import { getReportBoardCode } from '../../../../../services/technological/statisticalReport'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
@connect(mapStateToProps)
export default class index extends Component {
  state = {
    data: [
      {
        id: '1348552555843686400',
        name: '宗地踏勘',
        parent_id: '0',
        group_name: '深国际',
        end_time: '1611590340',
        overdue_day: '1',
        overdue_count_day: '1',
        warning_day: '1',
        warning_count_day: '1',
        status: '50%',
        children: [
          {
            id: '1348552560616804352',
            name: '投资论证',
            parent_id: '0',
            group_name: '波涛',
            end_time: '1611935940',
            overdue_day: '1',
            warning_day: '1',
            status: '未完成'
          },
          {
            id: '1348552564240683008',
            name: '策划定位与规划设计',
            parent_id: '0',
            group_name: '深圳中技',
            end_time: '1612195140',
            overdue_day: '1',
            warning_day: '1',
            status: '完成'
          }
        ]
      }
    ]
  }

  getReportBoardCode = board_id => {
    if (!board_id) return
    getReportBoardCode({ board_id }).then(res => {
      if (isApiResponseOk(res)) {
        // console.log(res)
        this.setState({
          code_url: res.data.code_url
        })
      }
    })
  }

  componentDidMount() {
    // console.log('进来了')
    const { simplemodeCurrentProject = {} } = this.props
    this.getReportBoardCode(simplemodeCurrentProject.board_id || '')
  }

  componentWillReceiveProps(nextProps) {
    const { board_id } = this.props.simplemodeCurrentProject
    const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
    if (board_id != next_board_id) {
      this.getReportBoardCode(next_board_id)
    }
  }

  renderTableContent = () => {
    const columns = [
      { title: '事件名称', dataIndex: 'name', key: 'name' },
      { title: '责任方', dataIndex: 'group_name', key: 'group_name' },
      { title: '进度/状态', dataIndex: 'status', key: 'status' },
      {
        title: '截止日期',
        dataIndex: 'end_time',
        key: 'end_time',
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
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
        />
      </div>
    )
  }

  render() {
    const {
      workbenchBoxContent_height,
      workbenchBoxContentWapperModalStyle = {},
      simplemodeCurrentProject = {}
    } = this.props
    let chart_item_width =
      workbenchBoxContentWapperModalStyle.width == '100%'
        ? document.getElementById('statisticalReportContainer')
          ? document.getElementById('statisticalReportContainer').clientWidth /
              2 -
            60
          : document.body.clientWidth / 2 - 60
        : parseInt(workbenchBoxContentWapperModalStyle.width) / 2 - 60

    return (
      <div
        id={'statisticalReportContainer'}
        className={`${globalStyles.global_vertical_scrollbar} ${indexStyles.statisticalReportContainer}`}
        style={{
          height: workbenchBoxContent_height,
          // width: workbenchBoxContentWapperModalStyle.width
          width: '100%'
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '27px 38px',
            height: '100%',
            borderRadius: '4px'
          }}
        >
          <div className={indexStyles.chart_title}>
            {`${
              !!simplemodeCurrentProject.board_id &&
              simplemodeCurrentProject.board_id != '0'
                ? simplemodeCurrentProject?.board_name || ''
                : ''
            }`}
            {`${currentNounPlanFilterName(PROJECTS)}`}
            统计报表
          </div>
          <div className={indexStyles.chart_content_1}>
            <div className={indexStyles.chart_c_top}>
              <PieEarlyWarningComponent />
              <div className={indexStyles.chart_d_code}>
                <div>
                  <img
                    src={this.state.code_url}
                    style={{
                      width: '206px',
                      height: '206px'
                      // backgroundColor: 'pink'
                    }}
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
              {this.renderTableContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  simplemode: {
    workbenchBoxContentWapperModalStyle = {},
    simplemodeCurrentProject = {}
  }
}) {
  return {
    workbenchBoxContentWapperModalStyle,
    simplemodeCurrentProject
  }
}
