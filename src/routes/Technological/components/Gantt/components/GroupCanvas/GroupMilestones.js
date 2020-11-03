import { connect } from 'dva'
import React, { Component } from 'react'

@connect(mapStateToProps)
export default class GroupMilestones extends Component {
  render() {
    return (
      <div
        id="sssaa"
        style={{
          position: 'absolute',
          zIndex: 0,
          height: '100%',
          width: '100%'
        }}
      ></div>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: {
      gantt_view_mode,
      gold_date_arr = [],
      group_list_area_section_height,
      ceiHeight,
      gantt_board_id,
      about_user_boards,
      milestoneMap,
      group_view_type,
      show_board_fold,
      ceilWidth,
      date_arr_one_level,
      gantt_head_width,
      date_total
    }
  }
}) {
  return {
    gantt_view_mode,
    gold_date_arr,
    ceiHeight,
    gantt_board_id,
    about_user_boards,
    milestoneMap,
    group_view_type,
    show_board_fold,
    group_list_area_section_height,
    ceilWidth,
    date_arr_one_level,
    gantt_head_width,
    date_total
  }
}
