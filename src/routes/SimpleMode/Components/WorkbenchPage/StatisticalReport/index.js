import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import HistogramComponent from './components/HistogramComponent'
import EchartsTest from './components/EchartsTest'
import BarDiagramentComponent from './components/BarDiagramentComponent'
import PieComponent from './components/PieComponent'
import LineComponent from './components/LineComponent'

export default class index extends Component {
  render() {
    const { workbenchBoxContent_height } = this.props
    return (
      <div id={'statisticalReportContainer'} className={`${globalStyles.global_vertical_scrollbar} ${indexStyles.statisticalReportContainer}`} style={{height: workbenchBoxContent_height}}>
        <div className={indexStyles.chart_title}>我的报表</div>
        <div className={indexStyles.chart_content}>
          <div className={indexStyles.chart_item}>
            <div className={indexStyles.chart_item_top}>
              <div className={indexStyles.chart_item_t_left}>工时统计 <span className={indexStyles.chart_item_t_left_date}>(本月)</span></div>
              {/* <div className={`${indexStyles.chart_item_t_right} ${globalStyles.authTheme}`}>&#xe7fd;</div> */}
            </div>
            {/* 柱状图 */}
            <div className={indexStyles.chart_item_bottom}>
              <HistogramComponent />
            </div>
          </div>
          <div className={indexStyles.chart_item}>
            <div className={indexStyles.chart_item_top}>
              <div className={indexStyles.chart_item_t_left}>任务数统计 <span className={indexStyles.chart_item_t_left_date}>(本月)</span></div>
              <div className={`${indexStyles.chart_item_t_right} ${globalStyles.authTheme}`}>&#xe7fd;</div>
            </div>
            {/* 条形图 */}
            <div className={indexStyles.chart_item_bottom}>
              <BarDiagramentComponent />
            </div>
          </div>
          <div className={indexStyles.chart_item}>
            <div className={indexStyles.chart_item_top}>
              <div className={indexStyles.chart_item_t_left}>项目状态 <span className={indexStyles.chart_item_t_left_date}>(本月)</span></div>
              <div className={`${indexStyles.chart_item_t_right} ${globalStyles.authTheme}`}>&#xe7fd;</div>
            </div>
            {/* 条形图 */}
            <div className={indexStyles.chart_item_bottom}>
              <PieComponent />
            </div>
          </div>
          <div className={indexStyles.chart_item}>
            <div className={indexStyles.chart_item_top}>
              <div className={indexStyles.chart_item_t_left}>新增项目数 <span className={indexStyles.chart_item_t_left_date}>(每月)</span></div>
              <div className={`${indexStyles.chart_item_t_right} ${globalStyles.authTheme}`}>&#xe7fd;</div>
            </div>
            {/* 条形图 */}
            <div className={indexStyles.chart_item_bottom}>
              <LineComponent />
            </div>
          </div>
          {/* <div className={indexStyles.chart_item}>
            <div className={indexStyles.chart_item_top}>
              <div className={indexStyles.chart_item_t_left}>测试内容</div>
              <div className={`${indexStyles.chart_item_t_right} ${globalStyles.authTheme}`}>&#xe7fd;</div>
            </div>
            <div className={indexStyles.chart_item_bottom}>
              <EchartsTest />
            </div>
          </div> */}
          {/* <div className={`${indexStyles.chart_item} ${indexStyles.no_chart_data}`}>
            <span>暂无更多数据</span>
          </div> */}
        </div>
      </div>
    )
  }
}
