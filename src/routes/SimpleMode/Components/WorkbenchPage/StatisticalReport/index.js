import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import HistogramComponent from './components/HistogramComponent'

export default class index extends Component {
  render() {
    return (
      <div id={'statisticalReportContainer'} className={indexStyles.statisticalReportContainer}>
        <div className={indexStyles.chart_title}>我的报表</div>
        <div className={indexStyles.chart_content}>
          <div className={indexStyles.chart_item}>
            <div className={indexStyles.chart_item_top}>
              <div className={indexStyles.chart_item_t_left}>工时统计 <span className={indexStyles.chart_item_t_left_date}>(本月)</span></div>
              <div className={`${indexStyles.chart_item_t_right} ${globalStyles.authTheme}`}>&#xe7fd;</div>
            </div>
            <div className={indexStyles.chart_item_bottom}>
              <HistogramComponent />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
