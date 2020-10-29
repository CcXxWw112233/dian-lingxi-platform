import { connect } from 'dva'
import React, { Component } from 'react'
import { ganttIsOutlineView, hours_view_total } from '../../constants'

@connect(mapStateToProps)
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas_height: 700,
      canvas_width: 2000
    }
    this.canvas_ref = React.createRef()
    this.canvas = null
    this.ctx = null
    this.setCanvasHeight = this.setCanvasHeight.bind(this)
    this.setCanvasWidth = this.setCanvasWidth.bind(this)
    this.line_color = 'rgba(154,159,166,0.15)'
  }
  componentDidMount() {
    this.initCanvas()
    this.setState(
      {
        canvas_height: this.setCanvasHeight(this.props),
        canvas_width: this.setCanvasWidth(this.props)
      },
      () => {
        this.draw(this.props)
      }
    )
  }
  componentWillReceiveProps(nextProps) {
    this.initCanvas()
    this.setState(
      {
        canvas_height: this.setCanvasHeight(nextProps),
        canvas_width: this.setCanvasWidth(nextProps)
      },
      () => {
        this.draw(nextProps)
      }
    )
  }
  initCanvas = () => {
    this.canvas = this.canvas_ref.current
    this.ctx = this.canvas.getContext('2d')
    console.log('ssssssssaaa_ctx', this.ctx)
  }
  setCanvasWidth = (props, origin) => {
    const { date_total, ceilWidth } = props
    return date_total * ceilWidth
  }
  setCanvasHeight = props => {
    const rows = 7
    const {
      ceiHeight,
      group_view_type,
      outline_tree_round = [],
      group_list_area_section_height
    } = props
    // return '100%'
    if (ganttIsOutlineView({ group_view_type })) {
      const outline_tree_round_length = outline_tree_round.length
      if (outline_tree_round_length > rows) {
        return (outline_tree_round_length + 8) * ceiHeight
      } else {
        return (rows + 5) * ceiHeight
      }
    } else {
      return group_list_area_section_height[
        group_list_area_section_height.length - 1
      ]
    }
  }
  draw = props => {
    const { gantt_view_mode } = props
    const operators = {
      month: this.drawMonths,
      relative_time: this.drawMonths,
      week: this.drawWeeks,
      year: this.drawYears,
      hours: this.drawHours
    }
    if (operators.hasOwnProperty(gantt_view_mode)) {
      const { canvas_width, canvas_height } = this.state
      this.ctx.clearRect(0, 0, canvas_width, canvas_height)
      this.ctx.fillStyle = this.line_color
      operators[gantt_view_mode](props)
      this.draGroup(props)
    }
  }
  // 绘制月视图
  drawMonths = props => {
    const { date_arr_one_level = [], ceilWidth } = props
    const { canvas_height } = this.state
    let i
    for (i = 0; i < date_arr_one_level.length; i++) {
      const { week_day } = date_arr_one_level[i]
      //绘制背景
      if ([5, 6].includes(week_day)) {
        this.ctx.fillStyle = '#FBFBFD'
        this.ctx.fillRect(ceilWidth * (i + 1), 0, ceilWidth, canvas_height)
      }
      //绘制线条
      if ([0, 5, 6].includes(week_day)) {
        this.ctx.fillStyle = this.line_color
        this.ctx.fillRect(ceilWidth * (i + 1), 0, 1, canvas_height)
      }
    }
  }
  // 绘制时间视图
  drawHours = props => {
    const { gold_date_arr = [], ceilWidth } = props
    const { canvas_height } = this.state
    let i
    for (i = 0; i < gold_date_arr.length; i++) {
      this.ctx.fillRect(ceilWidth * (i * hours_view_total), 0, 1, canvas_height)
    }
  }
  // 绘制年视图
  drawYears = props => {
    const { date_arr_one_level = [], ceilWidth } = props
    const { canvas_height } = this.state
    let i
    let cal_pos = 0
    for (i = 0; i < date_arr_one_level.length; i++) {
      const { last_date } = date_arr_one_level[i]
      cal_pos += ceilWidth * last_date
      this.ctx.fillRect(cal_pos, 0, 1, canvas_height)
    }
  }
  // 绘制周视图
  drawWeeks = props => {
    const { date_arr_one_level = [], ceilWidth } = props
    const { canvas_height } = this.state
    let i
    for (i = 0; i < date_arr_one_level.length; i++) {
      this.ctx.fillRect(ceilWidth * (i * 7), 0, 1, canvas_height)
    }
  }
  // 绘制分组线条
  draGroup = props => {
    const { group_list_area_section_height = [] } = props
    const { canvas_width } = this.state
    let i = 0
    this.ctx.fillRect(0, 0, canvas_width, 1)
    for (i = 0; i < group_list_area_section_height.length - 1; i++) {
      this.ctx.fillRect(0, group_list_area_section_height[i], canvas_width, 1)
    }
  }
  render() {
    const {
      date_total,
      ceiHeight,
      ceilWidth,
      group_list_area_section_height
    } = this.props
    const { canvas_height, canvas_width } = this.state
    return (
      <div>
        <canvas
          id={'gantt_canvas_area'}
          style={{
            position: 'absolute',
            zIndex: 0,
            left: 0
          }}
          ref={this.canvas_ref}
          //   width={3000}
          //   height={1000}
          width={canvas_width}
          height={canvas_height}
        ></canvas>
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
      gantt_view_mode
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
    gantt_view_mode
  }
}
