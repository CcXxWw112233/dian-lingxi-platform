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
  render() {
    const {
      group_not_allow_drag_area = [],
      ceiHeight,
      task_is_drag_moving,
      group_list_area_fold_section = []
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
                display:
                  task_is_drag_moving &&
                  !group_list_area_fold_section[index].is_group_folded
                    ? 'block'
                    : 'none',
                position: 'absolute',
                zIndex: 2,
                width: panel_width,
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
      group_not_allow_drag_area,
      group_list_area_fold_section
    }
  }
}) {
  return {
    date_total,
    ceiHeight,
    ceilWidth,
    group_not_allow_drag_area,
    group_list_area_fold_section
  }
}
