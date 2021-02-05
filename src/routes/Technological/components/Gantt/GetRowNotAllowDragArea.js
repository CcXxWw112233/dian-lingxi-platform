import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class GetRowNotAllowDragArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panel_width: 2000
    }
  }
  componentDidMount() {
    this.setState({
      panel_width: this.setCanvasWidth(this.props)
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      panel_width: this.setCanvasWidth(nextProps)
    })
  }
  setCanvasWidth = props => {
    const { date_total, ceilWidth } = props
    return date_total * ceilWidth
  }
  // setCanvasHeight = props => {
  //   const {
  //     gantt_card_height,
  //     group_list_area_section_height = [],
  //     ceiHeight,
  //     group_view_type,
  //     outline_tree_round = [],
  //     list_group_length
  //   } = props
  //   const outline_tree_round_length = outline_tree_round.length
  //   const gantt_area_height = gantt_card_height - date_area_height - 30 //视图区域高度
  //   const latest_group_height =
  //     group_list_area_section_height[list_group_length - 1] //最后一个分组的位置，即为最高
  //   let _finally_height = gantt_area_height
  //   if (ganttIsOutlineView({ group_view_type })) {
  //     _finally_height = Math.max(
  //       outline_tree_round_length * ceiHeight + date_area_height + 20, //在大纲头部渲染那里，添加利一个高度为date_area_height的div,加上未知的差异24
  //       gantt_area_height
  //     )
  //   } else {
  //     _finally_height = Math.max(
  //       latest_group_height || gantt_area_height,
  //       gantt_area_height
  //     )
  //   }
  //   return _finally_height
  // }
  render() {
    const {
      group_not_allow_drag_area = [],
      ceiHeight,
      task_is_drag_moving
    } = this.props
    const { panel_width } = this.state
    return (
      <div>
        {group_not_allow_drag_area.map((item, index) => {
          const { start_area, end_area } = item
          const top = start_area + (index == 0 ? 0 : ceiHeight * 0.5)
          return (
            <div
              style={{
                display: task_is_drag_moving ? 'block' : 'none',
                position: 'absolute',
                zIndex: 2,
                width: panel_width,
                // background: 'rgba(205,20,22,.1)',
                background: 'rgba(255,0,0,.1)',
                top,
                height:
                  end_area == start_area
                    ? 0
                    : end_area - top + ceiHeight * 0.5 - 6,
                backgroundImage:
                  '-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, rgba(255, 255, 255, .3)), color-stop(.25, transparent), color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .3)), color-stop(.75, rgba(255, 255, 255, .3)), color-stop(.75, transparent), to(transparent))',
                backgroundSize: '8px 8px'
              }}
            />
          )
        })}
      </div>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      date_total,
      ceiHeight,
      ceilWidth,
      group_list_area_section_height,
      group_view_type,
      outline_tree_round = [],
      date_arr_one_level,
      gold_date_arr,
      gantt_view_mode,
      list_group,
      group_not_allow_drag_area
    }
  }
}) {
  return {
    date_total,
    ceiHeight,
    ceilWidth,
    group_list_area_section_height,
    group_view_type,
    outline_tree_round,
    date_arr_one_level,
    gold_date_arr,
    gantt_view_mode,
    list_group_length: list_group.length,
    group_not_allow_drag_area
  }
}
