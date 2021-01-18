import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import HistogramComponent from './components/HistogramComponent'
import BarDiagramentComponent from './components/BarDiagramentComponent'
import PieComponent from './components/PieComponent'
import LineComponent from './components/LineComponent'
import PieEarlyWarningComponent from './components/PieEarlyWarningComponent'
import { currentNounPlanFilterName } from '../../../../../utils/businessFunction'
import { PROJECTS } from '../../../../../globalset/js/constant'
@connect(mapStateToProps)
export default class index extends Component {
  // 渲染title
  renderTitle = () => {
    const {
      simplemodeCurrentProject: { board_id, board_name }
    } = this.props
    let title_dec = '我的报表'
    if (!!board_id && board_id != '0') {
      title_dec = `${
        !!board_id && board_id != '0' ? board_name || '' : ''
      } ${currentNounPlanFilterName(PROJECTS)} 统计报表`
    }
    return title_dec
  }

  render() {
    const {
      workbenchBoxContent_height,
      workbenchBoxContentWapperModalStyle = {},
      simplemodeCurrentProject = {}
    } = this.props
    let chart_item_width =
      workbenchBoxContentWapperModalStyle.width == '100%'
        ? document.body.clientWidth / 2 - 100
        : parseInt(workbenchBoxContentWapperModalStyle.width) / 2 - 100
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
          <div className={indexStyles.chart_title}>{this.renderTitle()}</div>
          {simplemodeCurrentProject.board_id != '0' &&
            !!simplemodeCurrentProject.board_id && (
              <div
                className={indexStyles.chart_content_1}
                style={{ marginBottom: '24px' }}
              >
                <PieEarlyWarningComponent />
              </div>
            )}
          <div className={indexStyles.chart_content}>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>工时统计</div>
              </div>
              {/* 柱状图 */}
              <div className={indexStyles.chart_item_bottom}>
                <HistogramComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>任务数统计</div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <BarDiagramentComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>项目状态</div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <PieComponent width={chart_item_width} />
              </div>
            </div>
            <div
              className={indexStyles.chart_item}
              style={{ width: chart_item_width }}
            >
              <div className={indexStyles.chart_item_top}>
                <div className={indexStyles.chart_item_t_left}>
                  新增项目数{' '}
                  <span className={indexStyles.chart_item_t_left_date}>
                    (每月)
                  </span>
                </div>
              </div>
              {/* 条形图 */}
              <div className={indexStyles.chart_item_bottom}>
                <LineComponent width={chart_item_width} />
              </div>
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
