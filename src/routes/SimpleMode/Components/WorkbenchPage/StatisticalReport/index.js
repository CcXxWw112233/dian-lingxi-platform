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
@connect(mapStateToProps)
export default class index extends Component {
  state = {
    data: [
      {
        key: 1,
        name: '方案设计',
        address: '深国际',
        timer: '1609776000',
        status: '未完成',
        children: [
          {
            key: 1.3,
            name: '方案设计1',
            address: '柏涛',
            timer: '1609776000',
            status: '90%'
          }
        ]
      },
      {
        key: 2,
        name: '基坑支护、桩基招标图',
        address: '深圳中技（装配式、海绵城市、绿建）',
        status: '90%',
        timer: new Date().getTime(),
        description: ''
      }
    ]
  }

  renderTableContent = () => {
    const columns = [
      { title: '事件名称', dataIndex: 'name', key: 'name' },
      { title: '责任方', dataIndex: 'address', key: 'address' },
      { title: '进度/状态', dataIndex: 'status', key: 'status' },
      {
        title: '截止日期',
        dataIndex: 'timer',
        key: 'x',
        render: (text, record, index) => {
          const { timer } = record
          return (
            <span>
              {timestampToTimeNormal(timer)}
              {''}
              {'逾期6天'}
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
      workbenchBoxContentWapperModalStyle = {}
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
          <div className={indexStyles.chart_title}>我的报表</div>
          <div className={indexStyles.chart_content_1}>
            <div className={indexStyles.chart_c_top}>
              <PieEarlyWarningComponent />
              <div className={indexStyles.chart_d_code}>
                <div>
                  <img
                    src=""
                    style={{
                      width: '206px',
                      height: '206px',
                      backgroundColor: 'pink'
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
  simplemode: { workbenchBoxContentWapperModalStyle = {} }
}) {
  return {
    workbenchBoxContentWapperModalStyle
  }
}
