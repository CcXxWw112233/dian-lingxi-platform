import { connect } from 'dva'
import React, { Component } from 'react'
import { milestone_base_height, showMilestoneBase } from '../../constants'
import styles from './index.less'

// 分组和大纲视图最顶部的里程碑那一栏
@connect(mapStateToProps)
export default class MilestonesBody extends Component {
  render() {
    const {
      ceilWidth,
      date_total,
      group_view_type,
      gantt_board_id
    } = this.props
    return (
      <div
        className={`${styles.base}`}
        style={{
          height: milestone_base_height,
          width: ceilWidth * date_total,
          display: showMilestoneBase({ group_view_type, gantt_board_id })
            ? 'block'
            : 'none'
        }}
      ></div>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: { date_total, ceilWidth, group_view_type, gantt_board_id }
  }
}) {
  return {
    date_total,
    ceilWidth,
    group_view_type,
    gantt_board_id
  }
}
