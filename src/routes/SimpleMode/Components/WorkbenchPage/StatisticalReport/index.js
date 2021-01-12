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
    data: []
  }

  updateStateDatas = ({ name, value }) => {
    this.setState({
      [name]: value
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

  componentDidMount() {
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
          scroll={{ y: '100%' }}
          style={{ maxHeight: 500 }}
          rowKey="id"
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
    const { data = [] } = this.state
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
          width: '100%',
          overflowY: 'auto'
        }}
      >
        <div
          className={`${globalStyles.global_vertical_scrollbar}`}
          style={{
            backgroundColor: '#fff',
            padding: '27px 38px',
            // height: '100%',
            borderRadius: '4px',
            minHeight: workbenchBoxContent_height,
            paddingBottom: '24px'
            // overflowY: 'auto'
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
              <PieEarlyWarningComponent
                updateStateDatas={this.updateStateDatas}
              />
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
