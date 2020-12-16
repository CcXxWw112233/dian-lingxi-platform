import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class FixedDateTop extends Component {
  renderFixedDateTop = () => {
    const {
      target_scrollLeft,
      gold_date_arr,
      gantt_view_mode,
      width_area_section = []
    } = this.props
    if (gantt_view_mode != 'month') return <></>
    const index = width_area_section.findIndex(item => target_scrollLeft < item)
    const title = (gold_date_arr[index] || {}).date_top
    return (
      <div
        id={'gantt_date_buoy'}
        style={{
          position: 'absolute',
          left: target_scrollLeft,
          top: 9,
          fontWeight: 'bold',
          backgroundColor: '#fff',
          zIndex: 0,
          paddingLeft: 6,
          color: 'rgba(0, 0, 0, .45)'
        }}
      >
        {title}
      </div>
    )
  }
  render() {
    return <>{this.renderFixedDateTop()}</>
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: {
    datas: {
      target_scrollLeft,
      gold_date_arr = [],
      gantt_view_mode,
      width_area_section = []
    }
  }
}) {
  return {
    target_scrollLeft,
    width_area_section,
    gold_date_arr,
    gantt_view_mode
  }
}
