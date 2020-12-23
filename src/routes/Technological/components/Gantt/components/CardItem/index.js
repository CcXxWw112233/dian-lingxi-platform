import React, { Component } from 'react'
import indexStyles from './index.less'
import classNames from 'classnames/bind'
import { connect } from 'dva'
import AvatarList from '@/components/avatarList'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  task_item_height,
  task_item_margin_top,
  ganttIsOutlineView,
  ganttIsSingleBoardGroupView
} from '../../constants'
import { updateTaskVTwo } from '../../../../../../services/technological/task'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import { message, Dropdown, Tooltip } from 'antd'
import {
  filterDueTimeSpan,
  cardItemIsHasUnRead,
  setDateWithPositionInYearView,
  setDateWidthPositionWeekView,
  onChangeCardHandleCardDetail,
  setHourViewCardTimeSpan
} from '../../ganttBusiness'
import {
  transformTimestamp,
  isSamDay,
  isSamHour,
  caldiffDays,
  isOverdueTime
} from '../../../../../../utils/util'
import HoverEars from './HoverEars'
import DragCard from './DragCard'
import GroupChildCards from './GroupChildCards.js'
import { rebackCreateNotify } from '../../../../../../components/NotificationTodos'

const cx = classNames.bind(indexStyles)

// 参考自http://www.jq22.com/webqd1348

// const dateAreaHeight = date_area_height //日期区域高度，作为修正
const card_width_diff = 8 //宽度误差微调
const card_left_diff = 4 //位置误差微调
@connect(mapStateToProps)
export default class CardItem extends Component {
  constructor(props) {
    super(props)
    this.out_ref = React.createRef()
    this.is_down = false
    this.state = {
      local_width: 0,
      local_top: 0,
      local_left: 0,
      drag_type: 'position', // position/left/right 拖动位置/延展左边/延展右边
      is_moved: false, //当前mouseDown后，是否被拖动过
      parent_card: {
        //父级任务详细信息
        ele: null,
        min_position: 0,
        max_position: 0
      },
      drag_lock: false, //拖拽的锁，必须要先点击一下出现状态条才能够拖拽
      notification_duration: 5 //弹出提示的时间
    }
    this.notification_timer = null //notification_duration定时器

    this.x = 0
    this.y = 0
    this.l = 0
    this.t = 0
    this.drag_type_map = {
      position: 'pointer',
      left: 'w-resize',
      right: 'e-resize'
    }
    this.notify = null
  }

  componentDidMount() {
    this.initSetPosition(this.props)
    this.handleEffectParentCard('getParentCard') //大纲模式下获取父级任务实例
  }

  componentWillReceiveProps(nextProps) {
    this.handleEffectParentCard('getParentCard') //大纲模式下获取父级任务实例
  }

  // 设置位置
  initSetPosition = props => {
    const { itemValue = {} } = props
    const { left, top, width } = itemValue

    this.setState({
      local_top: top,
      local_left: left,
      local_width: width, //实时变化
      local_width_flag: width, //作为local_width实时变化在拖动松开后的标志宽度
      local_width_origin: width, //记载原始宽度，不变，除非传递进来的改变
      local_left_origin: left
    })
  }

  // 标签的颜色
  setLableColor = ({
    label_data,
    is_realize,
    active_compare_height,
    is_show_warning_time: early_warning
  }) => {
    let bgColor = ''
    let b = ''
    if (label_data && label_data.length) {
      const color_arr = label_data.map(item => {
        return `rgb(${item.label_color}${is_realize == '1' ? ',1' : ''})`
      })
      const color_arr_length = color_arr.length
      const color_percent_arr = color_arr.map((item, index) => {
        return ((index + 1) / color_arr_length) * 100
      })
      bgColor = color_arr.reduce((total, color_item, current_index) => {
        return `${total},  ${color_item} ${color_percent_arr[
          current_index - 1
        ] || 0}%, ${color_item} ${color_percent_arr[current_index]}%`
      }, '')

      b = `linear-gradient(to right${bgColor})`
    } else {
      if (is_realize == '1') {
        if (active_compare_height) {
          b = '#5BB48F'
        } else {
          b = '#CDD1DF'
        }
      } else {
        b = early_warning ? '#FFA000' : '#B3D0FF'
      }
      // b =
      //   is_realize == '1'
      //     ? active_compare_height
      //       ? '#5BB48F'
      //       : '#CDD1DF'
      //     : '#B3D0FF' //'rgb(212, 216, 228)' : '#cbddf7'
    }
    return b
  }

  // 任务弹窗
  setSpecilTaskExample = data => {
    const { task_is_dragging, ganttPanelDashedDrag } = this.props
    const { is_moved } = this.state
    // console.log('这是什么', '松开回调', task_is_dragging, is_moved, ganttPanelDashedDrag)
    if (
      is_moved ||
      ganttPanelDashedDrag //这是表示创建中
    ) {
      this.props.setTaskIsDragging && this.props.setTaskIsDragging(false, 1) //当拖动完成后，释放创建任务的锁，让可以正常创建任务
      return
    }
    const { setSpecilTaskExample } = this.props
    setSpecilTaskExample(data)
    // 恢复最初状态
    setTimeout(() => {
      this.setState({
        is_moved: false
      })
      this.props.setTaskIsDragging && this.props.setTaskIsDragging(false, 2) //当拖动完成后，释放创建任务的锁，让可以正常创建任务
    }, 700)

    // 设置已读
    const { dispatch, im_all_latest_unread_messages } = this.props
    const { id } = data
    if (
      cardItemIsHasUnRead({ relaDataId: id, im_all_latest_unread_messages })
    ) {
      dispatch({
        type: 'imCooperation/imUnReadMessageItemClear',
        payload: {
          relaDataId: id
        }
      })
    }
  }

  onMouseDown = e => {
    e.stopPropagation()
    e.preventDefault && e.preventDefault() //解决拖拽卡顿？(尚未明确)
    const target = this.out_ref.current
    setTimeout(() => {
      this.is_down = true
    }, 50)
    const { drag_type, local_top } = this.state
    if ('position' == drag_type) {
      //在中间
      // target.style.cursor = 'move';
    }
    this.x = e.clientX || e.changedTouches[0].clientX
    this.y = e.clientY || e.changedTouches[0].clientY
    //获取左部和顶部的偏移量
    this.l = target.offsetLeft
    this.t = target.offsetTop

    const { getCurrentGroup } = this.props
    getCurrentGroup({ top: local_top }) //设置当前操作的list_id

    // window.onmousemove = this.onMouseMove.bind(this)
    // window.onmouseup = this.onMouseUp.bind(this)

    document.addEventListener('mousemove', this.onMouseMove, false)
    document.addEventListener('mouseup', this.onMouseUp, false)
    document.addEventListener('touchmove', this.onTouchMove, false)
    document.addEventListener('touchend', this.onTouchEnd, false)
    setTimeout(() => {
      this.props.setTaskIsDragging && this.props.setTaskIsDragging(true, 3) //当拖动时，有可能会捕获到创建任务的动作，阻断
    }, 300)
    // target.onmouseleave = this.onMouseUp.bind(this);
  }

  onMouseMove = e => {
    e.stopPropagation()
    this.handleMouseMove(e) //设置flag依赖
    // console.log('s_event', 'onTouchMove2', this.is_down)
    if (this.is_down == false) {
      return
    }
    this.setState({
      is_moved: true
    })
    const { drag_type } = this.state
    // console.log('s_event', 'onTouchMove3', drag_type)
    if ('position' == drag_type) {
      this.changePosition(e)
    } else if ('left' == drag_type) {
      // this.extentionLeft(e)
    } else if ('right' == drag_type) {
      this.extentionRight(e)
    }
  }

  onTouchStart = e => {
    const class_names = e.target.getAttribute('class') || 'nothing'
    const drag_right = class_names.indexOf('drag_right') != -1 //点击在向右的箭头上
    this.setState(
      {
        drag_type: drag_right ? 'right' : 'position'
      },
      () => {}
    )
    this.onMouseDown(e)
    // this.touchCanScroll('hidden')
  }

  onTouchMove = e => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    // console.log('ssssapreventDefault', e.preventDefault)
    this.onMouseMove(e)
  }

  onTouchEnd = e => {
    this.onMouseUp(e)
    // this.touchCanScroll('scroll')
  }

  onMouseEnter = () => {
    //在鼠标hover到任务条上，非创建任务时，将虚线框隐藏
    const { ganttPanelDashedDrag } = this.props
    if (!ganttPanelDashedDrag) {
      this.props.setDasheRectShow && this.props.setDasheRectShow(false)
    }
  }

  // 延展左边
  extentionLeft = e => {
    const nx = e.clientX || e.changedTouches[0].clientX
    //计算移动后的左偏移量和顶部的偏移量
    const nl = nx - (this.x - this.l)
    const nw = this.x - nx //宽度
    this.setState({
      local_left: nl,
      local_width: nw < 44 ? 44 : nw
    })
  }

  // 延展右边
  extentionRight = e => {
    const nx = e.clientX || e.changedTouches[0].clientX
    const { local_width_flag } = this.state
    const { ceilWidth } = this.props
    //计算移动后的左偏移量和顶部的偏移量
    const nw = nx - this.x + local_width_flag //宽度
    // console.log('sssss', {
    //     nx,
    //     x: this.x,
    //     pageX: e.pageX
    // })
    const local_width = Math.max(nw, ceilWidth) //nw < ceilWidth ? ceilWidth : nw
    this.setState(
      {
        local_width
      },
      () => {
        this.handleEffectParentCard('handleParentCard')
      }
    )
  }

  // 整条拖动
  changePosition = e => {
    //获取x和y
    const nx = e.clientX || e.changedTouches[0].clientX
    const ny = e.clientY || e.changedTouches[0].clientY
    //计算移动后的左偏移量和顶部的偏移量
    const nl = nx - (this.x - this.l)
    const nt = ny - (this.y - this.t)
    const { gantt_view_mode } = this.props
    if (gantt_view_mode == 'relative_time') {
      if (nl <= 0) return
    }
    this.setState(
      {
        // local_top: nt,
        local_left: nl
      },
      () => {
        this.handleEffectParentCard('handleParentCard')
      }
    )

    // 在分组和特定高度下才能设置高度
    const {
      gantt_board_id,
      group_list_area_section_height = [],
      ceiHeight,
      group_view_type
    } = this.props
    const item_height = (ceiHeight + task_item_margin_top) / 2
    if (
      gantt_board_id != '0' &&
      group_view_type == '1' &&
      nt <
        group_list_area_section_height[
          group_list_area_section_height.length - 1
        ] -
          item_height &&
      !ganttIsOutlineView({ group_view_type })
    ) {
      //只有在分组的情况下才能拖上下
      this.setState({
        local_top: nt
      })
    }
  }

  // 针对于在某一条任务上滑动时，判别鼠标再不同位置的处理，(ui箭头, 事件处理等)
  handleMouseMove = event => {
    const { ganttPanelDashedDrag } = this.props
    if (this.is_down || ganttPanelDashedDrag) {
      //准备拖动时不再处理, 拖拽生成一条任务时也不再处理
      return
    }
    const { currentTarget } = event
    const clientX = event.clientX || event.changedTouches[0].clientX
    const { clientWidth } = currentTarget
    const oDiv = currentTarget
    const target_1 = document.getElementById('gantt_card_out_middle')
    const offsetLeft = this.getX(oDiv)
    const rela_left = clientX - offsetLeft - 2 + target_1.scrollLeft //鼠标在该任务内的相对位置
    const rela_pos = clientWidth - rela_left
    // console.log('s_event', rela_pos, rela_pos >= -21 && rela_pos <= -3)
    const { drag_type } = this.state
    if (isNaN(rela_pos)) {
      this.setTargetDragTypeCursor(drag_type)
      return
    }
    if (rela_pos >= -21 && rela_pos <= -3) {
      //滑动到右边 //clientWidth - rela_left <= 6
      this.setTargetDragTypeCursor('right')
    }
    // else if (rela_left <= 6) { //滑动到左边
    //     this.setTargetDragTypeCursor('left')
    // }
    else {
      //中间
      this.setTargetDragTypeCursor('position')
    }
  }

  // 设置鼠标形状和拖拽类型
  setTargetDragTypeCursor = cursorTypeKey => {
    this.setState({
      drag_type: cursorTypeKey
    })
    const cursorType = this.drag_type_map[cursorTypeKey]
    const target = this.out_ref.current
    if (this.props.card_rely_draging) {
      target.style.cursor = 'pointer'
      return
    } //拖拽依赖中不做鼠标样式设置
    if (target) {
      target.style.cursor = cursorType
    }
  }
  getX = obj => {
    var parObj = obj
    var left = obj.offsetLeft
    while ((parObj = parObj.offsetParent)) {
      left += parObj.offsetLeft
    }
    return left
  }

  getY = obj => {
    var parObj = obj
    var top = obj.offsetTop
    while ((parObj = parObj.offsetParent)) {
      top += parObj.offsetTop
    }
    return top
  }

  // 拖拽完成后松开鼠标
  onMouseUp = e => {
    e.stopPropagation()
    this.x = 0
    this.y = 0
    this.l = 0
    this.t = 0
    if (this.is_down) {
      this.overDragCompleteHandle() //松开拖拽完成，继续操作
    }
    this.is_down = false
    this.setTargetDragTypeCursor('pointer')
    this.setState({
      local_width_flag: this.state.local_width
    })
    // window.onmousemove = null
    // window.onmouseup = null
    document.removeEventListener('mousemove', this.onMouseMove, false)
    document.removeEventListener('mouseup', this.onMouseUp, false)
    document.removeEventListener('touchmove', this.onTouchMove, false)
    document.removeEventListener('touchend', this.onTouchEnd, false)
    setTimeout(() => {
      this.setState({
        is_moved: false
      })
      this.props.setTaskIsDragging && this.props.setTaskIsDragging(false, 4) //当拖动完成后，释放创建任务的锁，让可以正常创建任务
    }, 300)
  }

  // 批量更新甘特图数据
  updateGanttData = (datas = []) => {
    const { group_view_type, dispatch } = this.props
    const type = ganttIsOutlineView({ group_view_type })
      ? 'updateOutLineTree'
      : 'updateListGroup'
    dispatch({
      type: `gantt/${type}`,
      payload: {
        datas
      }
    })
  }
  overDragCompleteHandle = () => {
    const { drag_type, local_top } = this.state
    if ('right' == drag_type) {
      this.overDragCompleteHandleRight()
    } else if ('position' == drag_type) {
      this.overDragCompleteHandlePositon()
    } else {
    }
  }
  // 获取行高参数
  getRowsParam = async top => {
    const { gantt_board_id, group_view_type } = this.props
    if (!ganttIsSingleBoardGroupView({ gantt_board_id, group_view_type }))
      return {}
    let param = {}
    const { getCurrentGroup } = this.props
    if (typeof getCurrentGroup == 'function') {
      const {
        current_list_group_id,
        belong_group_row
      } = await getCurrentGroup({ top })
      if (!!belong_group_row) param.row = Math.round(belong_group_row)
      if (!!current_list_group_id) param.list_id = current_list_group_id
    }
    return param
  }

  overDragCompleteHandleRight = async () => {
    //右侧增减时间
    const {
      itemValue: {
        id,
        end_time,
        start_time,
        board_id,
        is_has_start_time,
        parent_card_id,
        row
      },
      group_view_type,
      gantt_view_mode,
      gantt_board_id,
      dispatch,
      card_detail_id,
      selected_card_visible
    } = this.props
    const { local_left, local_width, local_width_origin } = this.state
    const { date_arr_one_level, ceilWidth } = this.props
    let updateData = {}
    const end_time_position = local_left + local_width
    let start_date = {}
    let end_date = {}
    if (['month', 'relative_time', 'hours'].includes(gantt_view_mode)) {
      const end_time_index = Math.floor((end_time_position - 6) / ceilWidth)
      const start_time_index = Math.floor(local_left / ceilWidth)
      start_date = date_arr_one_level[start_time_index] || {}
      end_date = date_arr_one_level[end_time_index]
    } else if (gantt_view_mode == 'year') {
      start_date = setDateWithPositionInYearView({
        _position: local_left,
        date_arr_one_level,
        ceilWidth,
        width: local_width,
        x: local_left,
        flag: 1
      })
      end_date = setDateWithPositionInYearView({
        _position: end_time_position,
        date_arr_one_level,
        ceilWidth,
        width: local_width,
        x: local_left,
        flag: 2
      })
    } else if (gantt_view_mode == 'week') {
      start_date = setDateWidthPositionWeekView({
        position: local_left,
        date_arr_one_level,
        ceilWidth
      })
      end_date = setDateWidthPositionWeekView({
        position: end_time_position,
        date_arr_one_level,
        ceilWidth
      })
    } else {
    }
    const start_time_timestamp = parseInt(start_date.timestamp)
    const end_time_timestamp = parseInt(end_date.timestampEnd)
    updateData.start_time = start_time //!is_has_start_time ? '' : parseInt(start_time_timestamp)
    updateData.due_time = parseInt(end_time_timestamp)
    // console.log('date_string', updateData)

    if (
      (gantt_view_mode == 'hours' && isSamHour(end_time, end_time_timestamp)) ||
      (gantt_view_mode != 'hours' && isSamDay(end_time, end_time_timestamp))
    ) {
      //向右拖动时，如果是在同一格子，则不去更新
      const time_span_ =
        gantt_view_mode != 'hours'
          ? Math.floor((end_time - start_time) / (24 * 3600 * 1000)) + 1
          : setHourViewCardTimeSpan(start_time, end_time)
      const time_width = time_span_ * ceilWidth
      this.setState(
        {
          local_width: time_width,
          local_width_flag: time_width
        },
        () => {
          console.log('ssssssss_fl', 1)
          this.excuteHandleEffectHandleParentCard(['recoveryParentCard'])
        }
      )
      console.log('ssssssss_fl', 2, end_time, end_time_timestamp, time_width)
      return
    }
    const single_board_view = ganttIsSingleBoardGroupView({
      group_view_type,
      gantt_board_id
    }) //分组视图下
    const row_param = single_board_view ? { row } : {}
    console.log('ssssssss_fl', 3)
    updateTaskVTwo(
      {
        card_id: id,
        due_time: end_time_timestamp,
        board_id: board_id || gantt_board_id,
        ...row_param
      },
      { isNotLoading: false }
    )
      .then(res => {
        if (isApiResponseOk(res)) {
          rebackCreateNotify.call(this, {
            res,
            id,
            board_id,
            group_view_type,
            dispatch,
            parent_card_id,
            card_detail_id,
            selected_card_visible
          })
          // 更新甘特图数据
          this.updateGanttData([
            { id, ...updateData },
            ...res.data.scope_content.filter(item => item.id != id)
          ])
          // 拖动完成需要清除对应选中日期数据
          this.props.dispatch({
            type: 'gantt/updateDatas',
            payload: {
              gantt_card_date_no_section: {}
            }
          })
          // 当任务弹窗弹出来时，右边要做实时控制
          this.onChangeTimeHandleCardDetail()
        } else {
          // this.notificationEffect(this.handleNotifiParams(res))
          this.setState(
            {
              local_width: local_width_origin,
              local_width_flag: local_width_origin
            },
            () => {
              this.excuteHandleEffectHandleParentCard(['recoveryParentCard'])
            }
          )
          message.warn(res.message)
        }
      })
      .catch(err => {
        console.log('notify_err', err)
        message.error('更新失败')
      })
  }
  overDragCompleteHandlePositon = () => {
    const {
      gantt_board_id,
      current_list_group_id,
      group_view_type
    } = this.props

    if (
      gantt_board_id == '0' ||
      current_list_group_id == this.getDragAroundListId() ||
      ganttIsOutlineView({ group_view_type })
    ) {
      // 不在分组里面 ，获取分组拖拽时只在当前分组拖拽
      this.overDragCompleteHandlePositonAbout()
    } else {
      this.overDragCompleteHandlePositonAround()
    }
  }
  // 获取分组拖拽后分组id,
  getDragAroundListId = () => {
    const { group_view_type } = this.props
    if (ganttIsOutlineView({ group_view_type })) {
      return 0
    }
    const { local_top } = this.state
    const {
      group_list_area_section_height = [],
      ceiHeight,
      list_group = []
    } = this.props
    const item_height = (ceiHeight + task_item_margin_top) / 2
    const gold_area_position = local_top + item_height
    const length = group_list_area_section_height.length
    let list_group_index = 0
    for (let i = 0; i < length; i++) {
      if (gold_area_position < group_list_area_section_height[i]) {
        list_group_index = i
        break
      }
    }
    // console.log('ssss', local_top, gold_area_position)
    return list_group[list_group_index].list_id
  }
  // 不在项目分组内，左右移动
  overDragCompleteHandlePositonAbout = async () => {
    const {
      itemValue: { id, top, start_time, board_id, left, parent_card_id, row },
      group_view_type,
      gantt_view_mode,
      gantt_board_id,
      dispatch,
      card_detail_id,
      selected_card_visible
    } = this.props
    const { local_left, local_width, local_top } = this.state
    const { date_arr_one_level, ceilWidth } = this.props
    let updateData = {}
    const date_span = local_width / ceilWidth
    const start_time_index = Math.floor(local_left / ceilWidth)
    let start_date = {}
    let end_date = {}
    if (['month', 'relative_time'].includes(gantt_view_mode)) {
      start_date = date_arr_one_level[start_time_index] || {}
    } else if (gantt_view_mode == 'year') {
      start_date = setDateWithPositionInYearView({
        _position: local_left,
        date_arr_one_level,
        ceilWidth,
        width: local_width,
        x: local_left
      })
    } else if (gantt_view_mode == 'week') {
      start_date = setDateWidthPositionWeekView({
        position: local_left,
        date_arr_one_level,
        ceilWidth
      })
    } else if (gantt_view_mode == 'hours') {
      const end_time_position = local_left + local_width
      const end_time_index = Math.floor((end_time_position - 6) / ceilWidth)
      const start_time_index = Math.floor(local_left / ceilWidth)
      start_date = date_arr_one_level[start_time_index] || {}
      end_date = date_arr_one_level[end_time_index]
    } else {
    }
    const start_time_timestamp = parseInt(start_date.timestamp)
    // console.log('ssssssssssaaaa', 0, start_date.timestamp)
    if (!start_time_timestamp) return
    //截至时间为起始时间 加上间隔天数的毫秒数, - 60 * 1000为一分钟的毫秒数，意为截至日期的23:59
    let end_time_timestamp = parseInt(
      start_time_timestamp + 24 * 60 * 60 * 1000 * date_span - 60 * 1000
    )
    if (gantt_view_mode == 'hours') {
      end_time_timestamp = parseInt(end_date.timestamp)
    }
    updateData.start_time = parseInt(start_time_timestamp)
    updateData.due_time = parseInt(end_time_timestamp)
    // console.log('ssssssssssaaaa', 1)
    // 改变行
    const single_board_view = ganttIsSingleBoardGroupView({
      group_view_type,
      gantt_board_id
    }) //分组视图下
    const { row: new_row } = await this.getRowsParam(local_top)
    const row_param = single_board_view ? { row: new_row } : {}
    updateData = { ...updateData, ...row_param }

    if (
      ((gantt_view_mode == 'hours' &&
        isSamHour(start_time, start_time_timestamp)) ||
        (gantt_view_mode != 'hours' &&
          isSamDay(start_time, start_time_timestamp))) &&
      (single_board_view ? !!row && row == new_row : true) //分组模式下行高微信
    ) {
      //向右拖动时，如果是在同一天, 同一行，则不去更新
      this.setState(
        {
          local_left: left,
          local_top: top
        },
        () => {
          this.excuteHandleEffectHandleParentCard(['recoveryParentCard'])
        }
      )
      return
    }
    const request_param = {
      card_id: id,
      due_time: end_time_timestamp,
      start_time: start_time_timestamp,
      board_id: board_id || gantt_board_id,
      ...row_param
    }
    if (
      (gantt_view_mode == 'hours' &&
        isSamHour(start_time, start_time_timestamp)) ||
      (gantt_view_mode != 'hours' && isSamDay(start_time, start_time_timestamp))
      // isSamDay(start_time, start_time_timestamp)
    ) {
      //时间一样时只改变行
      delete request_param.start_time
      delete request_param.due_time
    }
    // console.log('ssssssssssaaaa', 2)
    updateTaskVTwo({ ...request_param }, { isNotLoading: false })
      .then(res => {
        if (isApiResponseOk(res)) {
          rebackCreateNotify.call(this, {
            res,
            id,
            board_id,
            group_view_type,
            dispatch,
            parent_card_id,
            card_detail_id,
            selected_card_visible
          })
          this.updateGanttData([
            { id, ...updateData },
            ...res.data.scope_content.filter(item => item.id != id)
          ])
          // 拖动完成需要清除对应选中日期数据
          this.props.dispatch({
            type: 'gantt/updateDatas',
            payload: {
              gantt_card_date_no_section: {}
            }
          })
          this.onChangeTimeHandleCardDetail()
        } else {
          // this.notificationEffect(this.handleNotifiParams(res))
          this.setState(
            {
              local_left: left,
              local_top: top
            },
            () => {
              this.excuteHandleEffectHandleParentCard(['recoveryParentCard'])
            }
          )
          message.warn(res.message)
        }
      })
      .catch(err => {
        message.error('更新失败')
      })
  }
  // 在项目分组内，上下左右移动
  overDragCompleteHandlePositonAround = async (data = {}) => {
    const {
      itemValue: {
        id,
        end_time,
        start_time,
        board_id,
        left,
        top,
        parent_card_id
      },
      gantt_board_id,
      gantt_view_mode,
      group_view_type,
      dispatch,
      card_detail_id,
      selected_card_visible
    } = this.props
    const { local_left, local_width, local_top } = this.state
    const { date_arr_one_level, ceilWidth } = this.props
    let updateData = {}
    const date_span = local_width / ceilWidth
    // const start_date = date_arr_one_level[start_time_index] || {}

    let start_date = {}
    let end_date = {}
    if (['month', 'relative_time'].includes(gantt_view_mode)) {
      const start_time_index = Math.floor(local_left / ceilWidth)
      start_date = date_arr_one_level[start_time_index] || {}
    } else if (gantt_view_mode == 'year') {
      start_date = setDateWithPositionInYearView({
        _position: local_left,
        date_arr_one_level,
        ceilWidth,
        width: local_width,
        x: local_left
      })
    } else if (gantt_view_mode == 'week') {
      start_date = setDateWidthPositionWeekView({
        position: local_left,
        date_arr_one_level,
        ceilWidth
      })
    } else if (gantt_view_mode == 'hours') {
      const end_time_position = local_left + local_width
      const end_time_index = Math.floor((end_time_position - 6) / ceilWidth)
      const start_time_index = Math.floor(local_left / ceilWidth)
      start_date = date_arr_one_level[start_time_index] || {}
      end_date = date_arr_one_level[end_time_index]
    } else {
    }
    const start_time_timestamp = start_date.timestamp
    if (!start_time_timestamp) return
    //截至时间为起始时间 加上间隔天数的毫秒数, - 60 * 1000为一分钟的毫秒数，意为截至日期的23:59
    let end_time_timestamp = parseInt(
      start_time_timestamp + 24 * 60 * 60 * 1000 * date_span - 60 * 1000
    )
    if (gantt_view_mode == 'hours') {
      end_time_timestamp = parseInt(end_date.timestamp)
    }
    updateData.start_time = start_time_timestamp
    updateData.due_time = end_time_timestamp

    const group_row_param = await this.getRowsParam(local_top)
    updateData = { ...updateData, ...group_row_param }

    // const params_list_id = this.getDragAroundListId()
    const params = {
      card_id: id,
      due_time: end_time_timestamp,
      start_time: start_time_timestamp,
      board_id,
      ...group_row_param
    }
    // debugger
    // if (group_row_param.list_id == '0') {
    //     delete params.list_id
    // }
    if (
      (gantt_view_mode == 'hours' &&
        isSamHour(start_time, start_time_timestamp)) ||
      (gantt_view_mode != 'hours' && isSamDay(start_time, start_time_timestamp))
      // isSamDay(start_time, start_time_timestamp)
    ) {
      //时间一样时只改变行
      delete params.start_time
      delete params.due_time
    }
    updateTaskVTwo({ ...params }, { isNotLoading: false })
      .then(res => {
        if (isApiResponseOk(res)) {
          rebackCreateNotify.call(this, {
            res,
            id,
            board_id,
            group_view_type,
            dispatch,
            parent_card_id,
            card_detail_id,
            selected_card_visible
          })
          this.changeCardBelongGroup({
            card_id: id,
            new_list_id: group_row_param.list_id,
            updateData,
            rely_datas: [
              { id, ...updateData },
              ...res.data.scope_content.filter(item => item.id != id)
            ]
          })
          // 拖动完成需要清除对应选中日期数据
          this.props.dispatch({
            type: 'gantt/updateDatas',
            payload: {
              gantt_card_date_no_section: {}
            }
          })
          this.onChangeTimeHandleCardDetail()
        } else {
          // this.notificationEffect(this.handleNotifiParams(res))
          this.setState({
            local_left: left,
            local_top: top
          })
          message.warn(res.message)
        }
      })
      .catch(err => {
        this.setState({
          local_left: left,
          local_top: top
        })
        message.error('更新失败')
        console.log('ssss', err)
      })
  }
  // 拖拽完成后的事件处理------end---------

  // 拖拽完成后，修改成功，在弹出右方详情页的情况下，作比较更新
  onChangeTimeHandleCardDetail = () => {
    const {
      card_detail_id,
      selected_card_visible,
      itemValue = {},
      dispatch
    } = this.props
    const { id, parent_card_id } = itemValue
    onChangeCardHandleCardDetail({
      card_detail_id, //来自任务详情的id
      selected_card_visible, //任务详情弹窗是否弹开
      dispatch,
      operate_id: id, //当前操作的id
      operate_parent_card_id: parent_card_id //当前操作的任务的父任务id
    })
  }

  // 改变任务分组
  changeCardBelongGroup = ({
    new_list_id,
    card_id,
    updateData = {},
    rely_datas = []
  }) => {
    // 该任务在新旧两个分组之间交替
    const {
      list_group = [],
      list_id,
      dispatch,
      current_list_group_id
    } = this.props
    const list_group_new = [...list_group]
    const group_index = list_group_new.findIndex(
      item => item.lane_id == list_id
    ) //老分组的分组位置
    const group_index_cards_index = list_group_new[
      group_index
    ].lane_data.cards.findIndex(item => item.id == card_id) //老分组的该分组的该任务的位置
    let group_index_cards_item =
      list_group_new[group_index].lane_data.cards[group_index_cards_index] //当前这条
    group_index_cards_item = { ...group_index_cards_item, ...updateData } //更新这条

    const group_index_gold_index = list_group_new.findIndex(
      item => item.lane_id == new_list_id
    ) //新分组的分组位置
    list_group_new[group_index_gold_index].lane_data.cards.push(
      group_index_cards_item
    ) //添加进新分组
    list_group_new[group_index].lane_data.cards.splice(
      group_index_cards_index,
      1
    ) //从老分组移除

    dispatch({
      type: 'gantt/updateListGroup',
      payload: {
        datas: rely_datas,
        origin_list_group: list_group_new
      }
    })
  }
  // 修改有排期的任务
  handleHasScheduleCard = ({ card_id, updateData = {} }) => {
    const { list_group = [], list_id, dispatch } = this.props
    const list_group_new = [...list_group]
    const group_index = list_group_new.findIndex(
      item => item.lane_id == list_id
    )
    const group_index_cards_index = list_group_new[
      group_index
    ].lane_data.cards.findIndex(item => item.id == card_id)
    list_group_new[group_index].lane_data.cards[group_index_cards_index] = {
      ...list_group_new[group_index].lane_data.cards[group_index_cards_index],
      ...updateData
    }

    if (
      list_group_new[group_index].lane_data.cards[group_index_cards_index]
        .type == '1'
    ) {
      //如果是会议，会议的完成状态由截至时间控制
      let is_realize = '0'
      if (
        transformTimestamp(
          list_group_new[group_index].lane_data.cards[group_index_cards_index]
            .due_time
        ) > new Date().getTime()
      ) {
        is_realize = '0'
      } else {
        is_realize = '1'
      }
      list_group_new[group_index].lane_data.cards[
        group_index_cards_index
      ].is_realize = is_realize
    }

    dispatch({
      type: 'gantt/handleListGroup',
      payload: {
        data: list_group_new,
        not_set_scroll_top: true
      }
    })
  }

  // 大纲视图下，如果该条任务是子任务，拖动择会影响父任务位置和长度
  handleEffectParentCard = (func_name, data) => {
    const {
      group_view_type,
      itemValue: { parent_card_id },
      gantt_view_mode,
      dispatch
    } = this.props
    if (!ganttIsOutlineView({ group_view_type })) return
    if (!parent_card_id) return
    const is_year_view = gantt_view_mode == 'year'
    const _self = this
    const obj = {
      getParentCard: () => {
        //获取父任务的详细信息
        const parent_card_ele = document.getElementById(parent_card_id)
        return new Promise((resolve, reject) => {
          return obj.getSameLevelNode().then(res => {
            // const { min_position, max_position, second_min_position, second_max_position, max_time, min_time, time_span, left } = res
            resolve(res)
            _self.setState(
              {
                parent_card: {
                  ele: parent_card_ele,
                  ...res
                }
              },
              () => {
                return resolve(res)
              }
            )
          })
        })
      },
      getSameLevelNode: () => {
        //获取默认最小和最大点
        return new Promise((resolve, reject) => {
          const { outline_tree_round = [] } = _self.props
          const { time_span, left } =
            outline_tree_round.find(item => item.id == parent_card_id) || {}
          const same_leve_node =
            outline_tree_round.filter(
              item => item.parent_card_id == parent_card_id
            ) || {}
          const left_arr = same_leve_node
            .map(item => item.left)
            .filter(item => item)
            .sort()
          const width_arr = same_leve_node
            .map(item => item.left + item.width)
            .filter(item => item)
            .sort()
          const due_time_arr = same_leve_node
            .map(item => item.due_time)
            .filter(item => item)
          const start_time_arr = same_leve_node
            .map(item => item.start_time)
            .filter(item => item)

          const min_position = Math.min.apply(null, left_arr) //最左边的位置
          const max_position = Math.max.apply(null, width_arr)
          const left_arr_length = left_arr.length
          const width_arr_length = width_arr.length
          const second_min_position = left_arr[1]
          const second_max_position = width_arr[width_arr_length - 2]
          const max_time = Math.max.apply(null, due_time_arr)
          const min_time = Math.min.apply(null, start_time_arr)
          const o = {
            min_position,
            max_position,
            second_min_position,
            second_max_position,
            max_time,
            min_time,
            time_span,
            left
          }
          resolve(o)
        })
      },
      handleParentCard: () => {
        //移动过程中改变父任务位置和长度
        return new Promise((resolve, reject) => {
          const {
            parent_card: {
              ele,
              min_position,
              max_position,
              second_min_position,
              second_max_position
            },
            local_width,
            local_left,
            local_width_origin,
            local_left_origin
          } = _self.state
          const local_right = local_left + local_width
          const local_right_origin = local_left_origin + local_width_origin
          if (ele) {
            let min_left
            let max_right
            // 设置最左
            if (local_left_origin <= min_position) {
              min_left = Math.min(local_left, second_min_position || local_left) // 所拖动是最左边的任务条， left取当前任务条的最左位置和所有的第二靠左比
            } else {
              min_left = Math.min(local_left, min_position || local_left) // 所拖动不是最左边的任务条， left取当前任务条的最左位置和所有的第一靠左比较
            }
            // 设置最右位置
            if (local_right_origin >= max_position) {
              max_right = Math.max(
                local_right,
                second_max_position || local_right
              ) // 所拖动是最右边的任务条， right取当前任务条的最左位置 和 所有的第二靠右比
            } else {
              max_right = Math.max(local_right, max_position || local_right) // 所拖动不是最右边的任务条， right取当前任务条的最右位置 和 所有的第一靠右比较
            }
            ele.style.left = `${min_left +
              (is_year_view ? 0 : card_left_diff)}px`
            ele.style.width = `${max_right -
              min_left -
              (is_year_view ? 0 : card_width_diff)}px`
            return resolve()
          } else {
            reject()
          }
        })
      },
      updateParentCard: data => {
        //方法废弃。由子任务更新后后台返回区间，父任务更新由返回的时间确认
        // console.log('更新的data', data)
        if (data.success == '1') {
          console.log(
            '要更新的父级0',
            data,
            Object.prototype.toString.call(data)
          )
          // this.props.changeOutLineTreeNodeProto(parent_card_id, { due_time: data.due_time, start_time: data.start_time })
          if (Object.prototype.toString.call(data.data) == '[object Array]') {
            dispatch({
              type: 'gantt/updateOutLineTree',
              payload: {
                datas: data.data
              }
            })
          }
          return
        }
        const {
          parent_card: { max_time, min_time, ele, time_span, left }
        } = this.state
        const { ceilWidth } = this.props
        const due_time = Math.max(
          transformTimestamp(data.due_time),
          transformTimestamp(max_time)
        )
        const start_time = Math.min(
          transformTimestamp(data.start_time),
          transformTimestamp(min_time)
        )
        ele.style.width = `${time_span * ceilWidth -
          (is_year_view ? 0 : card_width_diff)}px`
        ele.style.left = `${left + (is_year_view ? 0 : card_left_diff)}px`

        console.log('要更新的父级1', { start_time, due_time })
        this.props.changeOutLineTreeNodeProto(parent_card_id, {
          start_time,
          due_time
        })
      },
      recoveryParentCard: () => {
        const {
          parent_card: { ele, left }
        } = this.state
        const { ceilWidth, outline_tree_round } = this.props
        const { start_time, due_time, time_span } =
          outline_tree_round.find(item => item.id == parent_card_id) || {}
        ele.style.width = `${time_span * ceilWidth -
          (is_year_view ? 0 : card_width_diff)}px`
        ele.style.left = `${left + (is_year_view ? 0 : card_left_diff)}px`
        dispatch({
          type: 'gantt/updateOutLineTree',
          payload: {
            datas: [
              {
                id: parent_card_id,
                start_time,
                due_time
              }
            ]
          }
        })
      }
    }
    return obj[func_name].call(this, data)
  }

  excuteHandleEffectHandleParentCard = async (actions = []) => {
    for (let val of actions) {
      if (typeof val == 'object') {
        await this.handleEffectParentCard(val.action, val.payload)
      } else {
        await this.handleEffectParentCard(val)
      }
    }
  }

  /**
   * 获取大纲视图父任务的截止和开始位置的三角形边框颜色
   * @param {Array} label_data 标签列表
   * @param {String} index start|end 表示是左角标还是右角标
   * @param {Boolean} is_realize 是否完成
   * @param {Boolean} is_show_progress_percent 是否是在有进度的情况下
   * @param {String} status_label 表示逾期状态
   */
  setTriangleTreeColor = ({
    label_data = [],
    index,
    is_realize,
    is_show_progress_percent,
    status_label,
    is_show_warning_time
  }) => {
    let label_color = '#B3D0FF'
    const length = label_data.length
    if (length == 0) {
      if (is_realize == '1') {
        if (status_label == 'ahead_time_middle' && index == 'end') {
          label_color = 'rgb(91, 180, 143)'
        } else {
          label_color = 'rgb(205, 209, 223)'
        }
      } else {
        if (is_show_progress_percent) {
          label_color = '#5A86F5'
        } else if (is_show_warning_time) {
          label_color = '#FFA000'
        } else {
          label_color = '#B3D0FF'
        }
      }
      // label_color =
      //   is_realize == '1'
      //     ? status_label == 'ahead_time_middle' && index == 'end'
      //       ? 'rgb(91, 180, 143)'
      //       : 'rgb(212, 216, 228)'
      //     : is_show_progress_percent
      //     ? '#5A86F5'
      //     : '#B3D0FF'
    } else {
      if (index == 'start') {
        if (label_data[0]) {
          label_color = `rgb(${label_data[0].label_color})`
        } else {
          if (is_realize == '1') {
            label_color = 'rgb(212, 216, 228)'
          } else {
            if (is_show_progress_percent) {
              label_color = '#5A86F5'
            } else {
              label_color = '#B3D0FF'
            }
          }
        }
        // label_color = label_data[0]
        //   ? `rgb(${label_data[0].label_color})`
        //   : is_realize == '1'
        //   ? 'rgb(212, 216, 228)'
        //   : is_show_progress_percent
        //   ? '#5A86F5'
        //   : '#B3D0FF'
      } else if (index == 'end') {
        if (label_data[length - 1]) {
          label_color = `rgb(${label_data[length - 1].label_color})`
        } else {
          if (is_realize == '1') {
            label_color = 'rgb(212, 216, 228)'
          } else {
            if (is_show_progress_percent) {
              label_color = '#5A86F5'
            } else {
              label_color = '#B3D0FF'
            }
          }
        }
        // label_color = label_data[length - 1]
        //   ? `rgb(${label_data[length - 1].label_color})`
        //   : is_realize == '1'
        //   ? 'rgb(212, 216, 228)'
        //   : is_show_progress_percent
        //   ? '#5A86F5'
        //   : '#B3D0FF'
      }
    }
    return label_color
  }

  // 是否可以拖动
  couldChangeCard = () => {
    const {
      itemValue: { child_card_status = {} },
      group_view_type
    } = this.props
    const { has_child, max_due_time, min_start_time } = child_card_status
    // 大纲视图下的任务，存在子任务并且子任务有时间
    if (
      ganttIsOutlineView({ group_view_type }) &&
      has_child == '1' &&
      (!!max_due_time || min_start_time)
    ) {
      return false
    }
    return true
  }
  set_drag_else_over_in = bool => {
    const { card_rely_draging } = this.props
    const { rely_down } = this.state
    if (card_rely_draging && !rely_down) {
      //拖拽别条任务依赖生成过程中，鼠标指针hover到本条任务上面
      this.setState({
        drag_else_over_in: bool
      })
    }
  }
  handleObj = () => {
    const { itemValue = {}, card_rely_draging } = this.props
    const { drag_lock } = this.state
    const {
      top,
      id,
      board_id,
      parent_card_id,
      start_time,
      end_time,
      width,
      left
    } = itemValue
    return {
      onClick: e => {
        // console.log('s_event', 'onClick')
        if ('specific_example' != e.target.dataset.targetclassname) return //必须在任务条上点击
        if (!drag_lock) {
          this.props.setTaskIsDragging && this.props.setTaskIsDragging(true) //当拖动时，有可能会捕获到创建任务的动作，阻断
          setTimeout(() => {
            this.setState(
              {
                drag_lock: true
              },
              () => {
                this.props.dispatch({
                  type: 'gantt/updateDatas',
                  payload: {
                    gantt_card_date_no_section: {
                      id,
                      parent_card_id,
                      start_time,
                      end_time,
                      width,
                      left
                    }
                  }
                })
              }
            )
          }, 200)
          return
        }
        return
      },
      // 拖拽
      onMouseDown: e => {
        // console.log('s_event', 'onMouseDown')
        if (!drag_lock) {
          this.props.setTaskIsDragging && this.props.setTaskIsDragging(true) //当拖动时，有可能会捕获到创建任务的动作，阻断
          // setTimeout(() => {
          //     this.setState({
          //         drag_lock: true
          //     })
          // }, 200)
          return
        }
        if (!this.couldChangeCard()) return
        this.onMouseDown(e)
      },
      onMouseMove: e => {
        // console.log('s_event', 'onMouseMove')
        if (card_rely_draging || !drag_lock) return
        if (!this.couldChangeCard()) return
        this.onMouseMove(e)
      },
      onMouseUp: () => {
        // console.log('s_event', 'onMouseUp')
        setTimeout(() => {
          this.setState({
            drag_else_over_in: false
          })
        }, 200)
        if (card_rely_draging || !drag_lock) return
        this.setSpecilTaskExample({ id: parent_card_id || id, top, board_id })
      }, //查看子任务是查看父任务

      onTouchStart: e => {
        // console.log('s_event', 'onTouchStart')
        if (!drag_lock) {
          this.props.setTaskIsDragging && this.props.setTaskIsDragging(true) //当拖动时，有可能会捕获到创建任务的动作，阻断
          // setTimeout(() => {
          //     this.setState({
          //         drag_lock: true
          //     })
          // }, 200)
          return
        }
        if (!this.couldChangeCard()) return
        this.onTouchStart(e)
      },
      onTouchMove: e => {
        // console.log('s_event', 'onTouchMove')
        if (!this.couldChangeCard() || !drag_lock) return
        this.onTouchMove(e)
      },
      onTouchEnd: e => {
        // console.log('s_event', 'onTouchEnd')
        // if (!drag_lock) return
        // this.onTouchEnd(e)
        setTimeout(() => {
          this.setState({
            drag_else_over_in: false
          })
        }, 200)
        if (card_rely_draging || !drag_lock) return
        this.setSpecilTaskExample({ id: parent_card_id || id, top, board_id })
      }, //查看子任务是查看父任务
      onMouseEnter: () => {
        // console.log('s_event', 'onMouseEnter')
        this.onMouseEnter()
        this.set_drag_else_over_in(true)
      },
      onMouseLeave: () => {
        // console.log('s_event', 'onMouseLeave')
        this.set_drag_else_over_in(false)
      },
      onBlur: () => {
        this.props.setTaskIsDragging && this.props.setTaskIsDragging(false) //当拖动时，有可能会捕获到创建任务的动作，阻断
        this.setState(
          {
            drag_lock: false
          },
          () => {
            this.props.dispatch({
              type: 'gantt/updateDatas',
              payload: {
                gantt_card_date_no_section: {}
              }
            })
          }
        )
      }
    }
  }

  // 相关元素绘制点击拖拽中
  setRelyDown = bool => {
    this.props.setCardRelyDraging(bool)
    this.setState({
      rely_down: bool
    })
  }

  // 计算父任务中子任务时间占比
  computeCardsTimePercentageWithChildren = node => {
    let complete_time_diff = 0 // 已完成时间差总数
    let all_time_diff = 0 // 所有时间差总数
    function recusion(node) {
      if (node.children && node.children.length) {
        node.children.forEach(item => {
          // 只存在开始和结束时间的任务
          if (!!item.start_time && !!item.due_time) {
            if (item.is_realize == '1') {
              complete_time_diff =
                item.due_time - item.start_time + complete_time_diff
            }
            all_time_diff = item.due_time - item.start_time + all_time_diff
          }
          recusion(item)
        })
      }
    }
    recusion(node)
    let percent_card_non
    if (complete_time_diff || all_time_diff) {
      percent_card_non = (
        parseFloat(complete_time_diff / all_time_diff) * 100
      ).toFixed(2)
    }
    return percent_card_non
  }

  // 当前任务完成时间与计划时间对比
  compareCardsRealPlanTimer = node => {
    const { local_width } = this.state
    const { gantt_view_mode, itemValue = {} } = this.props
    const { width } = itemValue
    let compare_width = 0
    const default_width =
      (width || 6) - (gantt_view_mode == 'year' ? 0 : card_width_diff)
    // 状态标识
    let status_label = ''
    // 定义一个被除数
    let dividend = ''
    let finish_time_ =
      !!node.finish_time &&
      (String(node.finish_time).length == 10
        ? node.finish_time * 1000
        : node.finish_time)
    // 表示是 已完成的任务 并且存在完成时间 并且存在开始、结束时间
    //注：同一天创建的任务 截止时间为当天的23:59 所以即使在当天完成 时间戳也会比截止时间小 所以不能用时间戳来比较大小
    if (
      node.tree_type == '2' &&
      node.is_realize == '1' &&
      !!finish_time_ &&
      (node.start_time || node.due_time)
    ) {
      // 表示存在开始和结束时间
      if (!!node.due_time && !!node.start_time) {
        if (caldiffDays(finish_time_, node.due_time) == 0) {
          // 表示刚好完成
          compare_width = default_width
          status_label = 'on_time'
        } else if (finish_time_ > node.due_time) {
          // 表示逾期完成
          dividend =
            node.due_time == node.start_time
              ? node.start_time
              : node.due_time - node.start_time
          // 表示逾期完成
          status_label = 'overdue_time'
          compare_width =
            gantt_view_mode == 'hours'
              ? caldiffDays(finish_time_, node.due_time) * 198 + default_width
              : caldiffDays(finish_time_, node.due_time) *
                  this.props.ceilWidth +
                default_width
          // node.due_time == node.start_time
          //   ? caldiffDays(finish_time_, node.due_time) * 34 + default_width
          //   : parseFloat((finish_time_ - node.start_time) / dividend).toFixed(
          //       2
          //     ) *
          //       default_width +
          //     10
        } else if (finish_time_ < node.start_time) {
          // 表示提前完成
          compare_width = default_width
          status_label = 'ahead_time'
        } else if (
          finish_time_ >= node.start_time &&
          finish_time_ < node.due_time
        ) {
          compare_width =
            caldiffDays(finish_time_, node.start_time) == 0
              ? this.props.ceilWidth
              : gantt_view_mode == 'hours'
              ? caldiffDays(finish_time_, node.start_time) * 198
              : caldiffDays(finish_time_, node.start_time) *
                this.props.ceilWidth
          status_label = 'ahead_time_middle'
        }
      } else if (!!node.start_time && !node.due_time) {
        compare_width =
          caldiffDays(finish_time_, node.start_time) == 0
            ? this.props.ceilWidth
            : finish_time_ < node.start_time
            ? 0
            : gantt_view_mode == 'hours'
            ? caldiffDays(finish_time_, node.start_time) * 198
            : caldiffDays(finish_time_, node.start_time) * this.props.ceilWidth
        status_label =
          caldiffDays(finish_time_, node.start_time) == 0
            ? 'on_time'
            : finish_time_ < node.start_time
            ? 'ahead_time'
            : 'overdue_time'
      }
    }
    return { compare_width, status_label }
  }

  // 获取预警时间
  getCardsWarningTime = ({ time_warning, start_time, due_time }) => {
    // 23:59:00
    let ahead_timestamp = time_warning * (24 * 60 * 60 * 1000)
    let warning_timer = due_time - Number(ahead_timestamp)
    const today = new Date()
    const today_timestamp = today.getTime()
    const today_year = today.getFullYear()
    const today_month = today.getMonth()
    const today_day = today.getDate()
    const today_start_time = new Date(
      today_year,
      today_month,
      today_day,
      '00',
      '00',
      '00'
    ).getTime()
    return (
      (warning_timer <= today_start_time && warning_timer <= due_time) ||
      caldiffDays(warning_timer, today_timestamp) == 0
    )
  }

  render() {
    const {
      itemValue = {},
      im_all_latest_unread_messages,
      gantt_view_mode,
      group_view_type,
      gantt_board_id,
      card_name_outside,
      ceilWidth
    } = this.props
    const {
      left,
      top,
      width,
      height,
      name,
      id,
      board_id,
      is_realize,
      type,
      executors = [],
      label_data = [],
      is_has_start_time,
      is_has_end_time,
      start_time,
      due_time,
      is_privilege,
      parent_card_id,
      time_span,
      child_card_status = {},
      progress_percent,
      tree_type,
      time_warning
    } = itemValue
    const {
      has_child,
      min_start_time: child_min_start_time,
      max_due_time: child_max_due_time
    } = child_card_status //子任务状态，实现大纲的父任务三角
    const {
      local_left,
      local_top,
      local_width,
      rely_down,
      drag_lock,
      drag_else_over_in
    } = this.state
    const { is_overdue, due_description } = filterDueTimeSpan({
      start_time,
      due_time,
      is_has_end_time,
      is_has_start_time
    })
    const percent_card_non =
      this.computeCardsTimePercentageWithChildren(itemValue) ||
      progress_percent ||
      0
    //大纲视图下才显示任务进度 存在开始、结束时间的任务 并且是未完成的父任务 并且进度占比存在的时候
    const is_show_progress_percent =
      ganttIsOutlineView({ group_view_type }) &&
      is_has_start_time &&
      is_has_end_time &&
      is_realize == '0' &&
      !parent_card_id &&
      !!percent_card_non &&
      !!parseInt(percent_card_non)
    // 计划时间与完成时间对比
    const is_show_compare_real_plan_timer =
      ganttIsOutlineView({ group_view_type }) &&
      (is_has_start_time || is_has_end_time) &&
      is_realize == '1' &&
      tree_type == '2'
    const { status_label, compare_width } = this.compareCardsRealPlanTimer(
      itemValue
    )
    const active_compare_height =
      ganttIsOutlineView({ group_view_type }) &&
      is_show_compare_real_plan_timer &&
      status_label == 'ahead_time_middle' &&
      !label_data.length
    // 定义预警位置
    const early_warning_position =
      gantt_view_mode == 'hours'
        ? time_warning * 9 * ceilWidth
        : time_warning * ceilWidth
    // 选择的预警日期
    let ahead_timestamp = time_warning * (24 * 60 * 60 * 1000)
    let warning_timer_day = new Date(
      due_time - Number(ahead_timestamp)
    ).getDate()
    warning_timer_day =
      warning_timer_day >= 10 ? warning_timer_day : '0' + warning_timer_day
    // 判断是否是今天之前
    const is_overdue_task = isOverdueTime(due_time)
    // 显示预警
    const is_show_warning_time =
      ganttIsOutlineView({ group_view_type }) &&
      !parent_card_id &&
      is_realize == '0' &&
      is_has_end_time &&
      is_has_start_time &&
      start_time != due_time &&
      !is_overdue_task &&
      !!time_warning &&
      time_warning != '0' &&
      this.getCardsWarningTime({ time_warning, start_time, due_time })
    // 定义左边触角样式
    const card_left_triangle = cx({
      left_triangle: true,
      // 进度
      lr_triangle_pro_color: is_show_progress_percent,
      // 完成
      lr_triangle_com_color: is_show_compare_real_plan_timer,
      // 预警
      lr_triangle_warn_color: !is_show_progress_percent && is_show_warning_time
    })
    // 定义右边触角
    const card_right_triangle = cx({
      right_triangle: true,
      // 进度
      lr_triangle_pro_color:
        is_show_progress_percent && Number(percent_card_non) >= 100,
      // 完成占比
      lr_triangle_com_color: is_show_compare_real_plan_timer,
      // 提前完成 右边触角是绿的
      right_triangle_com_color:
        is_show_compare_real_plan_timer && status_label == 'ahead_time_middle',
      // 预警
      lr_triangle_warn_color:
        !(is_show_progress_percent && Number(percent_card_non) >= 100) &&
        is_show_warning_time
    })

    return (
      <div
        className={`${'gantt_card_flag_special'} ${
          indexStyles.specific_example
        } ${!is_has_start_time &&
          indexStyles.specific_example_no_start_time} ${!is_has_end_time &&
          indexStyles.specific_example_no_due_time}`}
        data-targetclassname="specific_example"
        id={id} //大纲视图需要获取该id作为父级id来实现子任务拖拽影响父任务位置
        ref={this.out_ref}
        tabindex="0"
        data-rely_top={id}
        style={{
          left: local_left + (gantt_view_mode == 'year' ? 0 : card_left_diff),
          top: local_top,
          width:
            (local_width || 6) -
            (gantt_view_mode == 'year' ? 0 : card_width_diff),
          height: height || task_item_height,
          marginTop: task_item_margin_top,
          boxShadow: 'none',
          zIndex: rely_down || this.is_down || drag_lock ? 2 : 1
        }}
        {...this.handleObj()}
      >
        {/* 这里放 完成时 逾期的进度 */}
        {is_show_compare_real_plan_timer && status_label == 'overdue_time' && (
          <div
            data-targetclassname="specific_example"
            // data-rely_top={id}
            onMouseMove={e => e.preventDefault()}
            className={`${
              indexStyles.gatt_card_compare_prop
            } ${!is_has_start_time &&
              indexStyles.specific_example_no_start_time} ${!is_has_end_time &&
              indexStyles.specific_example_no_due_time}`}
            style={{
              left: '1px',
              // borderRadius:
              //   ((is_has_start_time && is_has_end_time) || !is_has_end_time) &&
              //   '40px',
              width: compare_width,
              height: height || task_item_height,
              lineHeight: `${height || task_item_height}px`,
              backgroundColor: '#FF5A5A', //'rgba(255,32,32,0.4)'
              zIndex: 0,
              boxShadow: 'none',
              overflow:
                ganttIsOutlineView({ group_view_type }) &&
                card_name_outside &&
                is_show_compare_real_plan_timer &&
                status_label == 'overdue_time' &&
                'visible'
            }}
          >
            {ganttIsOutlineView({ group_view_type }) &&
              card_name_outside &&
              is_show_compare_real_plan_timer &&
              status_label == 'overdue_time' && (
                <div
                  style={{
                    position: 'absolute',
                    left: '100%',
                    paddingLeft: 8,
                    marginTop: -3,
                    width: name.length * 20,
                    fontSize: 14,
                    height: 16,
                    lineHeight: '16px'
                  }}
                >
                  {name}
                </div>
              )}
          </div>
        )}
        <div
          className={`${'gantt_card_flag_special'} ${
            indexStyles.specific_example
          } ${!is_has_start_time &&
            indexStyles.specific_example_no_start_time} ${!is_has_end_time &&
            indexStyles.specific_example_no_due_time}`}
          data-targetclassname="specific_example"
          // id={id} //大纲视图需要获取该id作为父级id来实现子任务拖拽影响父任务位置
          // data-rely_top={id}
          title={name}
          style={{
            touchAction: 'none',
            left: 0,
            top: 0,
            zIndex: 2,
            width: '100%',
            height: height || task_item_height,
            background: this.setLableColor({
              label_data,
              is_realize,
              active_compare_height,
              is_show_warning_time
            }),
            boxShadow: 'none'
          }}
        >
          <div
            data-targetclassname="specific_example"
            className={`${
              indexStyles.specific_example_content
            } ${!is_has_start_time &&
              indexStyles.specific_example_no_start_time} ${!is_has_end_time &&
              indexStyles.specific_example_no_due_time}`}
            data-rely_top={id}
            onMouseMove={e => e.preventDefault()}
            style={{
              backgroundColor:
                is_realize == '1'
                  ? status_label == 'ahead_time_middle'
                    ? '#5BB48F' //'rgb(175,241,213)'
                    : '#CDD1DF' //'rgb(212,216,228)'
                  : is_show_warning_time
                  ? '#FFA000'
                  : '#B3D0FF',
              padding:
                gantt_view_mode != 'month' && time_span < 6 ? '0' : '0 8px',
              zIndex: 1,
              height: active_compare_height && (height || task_item_height)
            }}
          >
            {/* 这里放提前完成时 进度对比 */}
            {is_show_compare_real_plan_timer &&
              status_label == 'ahead_time_middle' && (
                <div
                  data-targetclassname="specific_example"
                  onMouseMove={e => e.preventDefault()}
                  className={`${
                    indexStyles.gatt_card_compare_prop
                  } ${!is_has_start_time &&
                    indexStyles.specific_example_no_start_time} ${!is_has_end_time &&
                    indexStyles.specific_example_no_due_time}`}
                  style={{
                    left: !label_data.length ? 0 : '2px',
                    // borderRadius:
                    //   ((is_has_start_time && is_has_end_time) ||
                    //     !is_has_end_time) &&
                    //   '40px',
                    width: compare_width,
                    height: !label_data.length
                      ? height || task_item_height
                      : (height || task_item_height) - 4,
                    lineHeight: `${
                      !label_data.length
                        ? height || task_item_height
                        : (height || task_item_height) - 4
                    }px`,
                    backgroundColor: '#CDD1DF', //'rgba(255,32,32,0.4)'
                    zIndex: 0
                  }}
                ></div>
              )}
            {/* 这里放置进行中父任务进度 */}
            {is_show_progress_percent && (
              <div
                data-targetclassname="specific_example"
                className={`${indexStyles.gatt_card_percentage_prop}`}
                style={{
                  // backgroundColor: '#cbddf7',
                  backgroundColor: '#5A86F5',
                  width: !label_data.length
                    ? ((local_width || 6) -
                        (gantt_view_mode == 'year' ? 0 : card_width_diff)) *
                      (percent_card_non / 100)
                    : ((local_width || 6) -
                        (gantt_view_mode == 'year' ? 0 : card_width_diff)) *
                        (percent_card_non / 100) -
                      4,
                  // width: !label_data.length ? '100%' : '98%',
                  borderRadius: '40px',
                  borderTopRightRadius:
                    Number(percent_card_non) >= 100 ? '40px' : '0px',
                  borderBottomRightRadius:
                    Number(percent_card_non) >= 100 ? '40px' : '0px',
                  height: !label_data.length
                    ? task_item_height
                    : task_item_height - 4,
                  lineHeight: `${
                    !label_data.length ? task_item_height : task_item_height - 4
                  }px`,
                  left: !label_data.length && 0
                }}
              ></div>
            )}
            <div
              data-targetclassname="specific_example"
              data-rely_top={id}
              className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}
              onMouseMove={e => e.preventDefault()}
              style={{
                display: 'flex',
                color:
                  is_realize == '1'
                    ? is_show_compare_real_plan_timer
                      ? 'rgba(0,0,0,0.45)'
                      : 'rgba(0,0,0,.25)'
                    : is_show_progress_percent
                    ? '#fff'
                    : '',
                height: task_item_height - 4,
                lineHeight: `${task_item_height - 4}px`,
                zIndex:
                  ((is_show_compare_real_plan_timer &&
                    status_label == 'ahead_time_middle') ||
                    is_show_progress_percent) &&
                  3
              }}
            >
              {/* 非大纲视图下一定有，大纲视图下需要开启名称外置才能在任务条内显示名称 */}
              {(!ganttIsOutlineView({ group_view_type }) ||
                (ganttIsOutlineView({ group_view_type }) &&
                  !card_name_outside)) &&
                name}
              {is_privilege == '1' && (
                <Tooltip title="已开启访问控制" placement="top">
                  <span
                    className={`${globalStyles.authTheme}`}
                    style={{ color: 'rgba(0,0,0,0.50)', marginLeft: '5px' }}
                    data-targetclassname="specific_example"
                  >
                    &#xe7ca;
                  </span>
                </Tooltip>
              )}
              <span
                data-rely_top={id}
                className={indexStyles.due_time_description}
                data-targetclassname="specific_example"
              >
                {is_overdue && is_realize != '1' && due_description}
              </span>
            </div>
            <div
              data-targetclassname="specific_example"
              onMouseMove={e => e.preventDefault()}
              style={{
                opacity: is_realize == '1' ? 0.5 : 1
              }}
            >
              <AvatarList
                users={executors}
                size={21}
                targetclassname={'specific_example'}
              />
            </div>
          </div>
        </div>
        {/* 存在未读 */}
        {cardItemIsHasUnRead({
          relaDataId: id,
          im_all_latest_unread_messages
        }) && (
          <div
            className={indexStyles.has_unread_news}
            data-targetclassname="specific_example"
            style={{}}
          ></div>
        )}
        {ganttIsOutlineView({ group_view_type }) &&
          card_name_outside &&
          status_label != 'overdue_time' && (
            <div
              style={{
                position: 'absolute',
                left: '100%',
                paddingLeft: 8,
                marginTop: -3,
                width: name.length * 20,
                fontSize: 14,
                height: 16,
                lineHeight: '16px'
              }}
            >
              {name}
            </div>
          )}
        <Dropdown
          trigger={['click']}
          getPopupContainer={() => document.getElementById(id)}
          placement="bottomLeft"
          // visible
          visible={
            drag_lock &&
            !ganttIsOutlineView({ group_view_type }) &&
            !parent_card_id &&
            !rely_down
          }
          overlay={
            <GroupChildCards visible={drag_lock} parent_value={itemValue} />
          }
        >
          <div
            data-targetclassname="specific_example"
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            data-rely_top={id}
          ></div>
        </Dropdown>
        {/* )
                } */}
        {//大纲视图有子任务时间的父任务(父任务开始截止位置有 区间标识)
        ganttIsOutlineView({ group_view_type }) &&
          !parent_card_id &&
          has_child == '1' &&
          (child_max_due_time || child_min_start_time) &&
          (gantt_view_mode != 'month' ? time_span > 6 : true) && (
            <>
              {/* 因为完成后 去除了任务条的阴影 所以变小了 那么触角位置需要调整 */}
              <div
                className={card_left_triangle}
                style={{
                  borderColor: `${this.setTriangleTreeColor({
                    label_data,
                    index: 'start',
                    is_realize,
                    is_show_progress_percent,
                    is_show_warning_time
                  })} transparent transparent transparent`
                }}
              ></div>
              {/* 一点点弧度覆盖 */}
              <div
                style={{
                  backgroundColor:
                    is_realize == '0'
                      ? is_show_progress_percent
                        ? '#5a86f5'
                        : is_show_warning_time
                        ? '#FFA000'
                        : '#B3D0FF'
                      : 'rgb(205, 209, 223)'
                }}
                className={indexStyles.left_radian_mask}
              ></div>
              <div
                style={{
                  backgroundColor:
                    is_realize == '0'
                      ? is_show_progress_percent
                        ? '#5a86f5'
                        : is_show_warning_time
                        ? '#FFA000'
                        : '#B3D0FF'
                      : 'rgb(205, 209, 223)'
                }}
                className={indexStyles.left_radian_mask2}
              ></div>
              <div className={indexStyles.left_triangle_mask}></div>
              <div
                className={indexStyles.left_triangle_mask2}
                style={{
                  backgroundColor:
                    is_show_progress_percent && !label_data.length
                      ? '#5A86F5'
                      : this.setTriangleTreeColor({
                          label_data,
                          index: 'start',
                          is_realize,
                          is_show_progress_percent,
                          is_show_warning_time
                        })
                }}
              ></div>

              <div
                className={card_right_triangle}
                style={{
                  borderColor: `${this.setTriangleTreeColor({
                    label_data,
                    index: 'end',
                    is_realize,
                    is_show_progress_percent:
                      is_show_progress_percent &&
                      Number(percent_card_non) >= 100,
                    status_label,
                    is_show_warning_time
                  })} transparent transparent transparent`,
                  zIndex:
                    (is_show_progress_percent ||
                      is_show_compare_real_plan_timer) &&
                    0
                }}
              ></div>
              <div className={indexStyles.right_triangle_mask}></div>
              <div
                className={indexStyles.right_triangle_mask2}
                style={{
                  backgroundColor:
                    is_show_progress_percent &&
                    Number(percent_card_non) >= 100 &&
                    !label_data.length
                      ? '#5A86F5'
                      : this.setTriangleTreeColor({
                          label_data,
                          index: 'end',
                          is_realize,
                          is_show_progress_percent:
                            is_show_progress_percent &&
                            Number(percent_card_non) >= 100,
                          status_label,
                          is_show_warning_time
                        })
                }}
              ></div>
              <div
                style={{
                  backgroundColor:
                    is_realize == '0'
                      ? is_show_progress_percent &&
                        Number(percent_card_non) >= 100
                        ? '#5a86f5'
                        : is_show_warning_time
                        ? '#FFA000'
                        : '#B3D0FF'
                      : status_label == 'ahead_time_middle'
                      ? '#5BB48F'
                      : 'rgb(205, 209, 223)'
                }}
                className={indexStyles.right_radian_mask}
              ></div>
              <div
                style={{
                  backgroundColor:
                    is_realize == '0'
                      ? is_show_progress_percent &&
                        Number(percent_card_non) >= 100
                        ? '#5a86f5'
                        : is_show_warning_time
                        ? '#FFA000'
                        : '#B3D0FF'
                      : status_label == 'ahead_time_middle'
                      ? '#5BB48F'
                      : 'rgb(205, 209, 223)'
                }}
                className={indexStyles.right_radian_mask2}
              ></div>
            </>
          )}
        {/* //hover出现的耳朵效果 */}
        {drag_lock &&
          !parent_card_id &&
          // gantt_view_mode != 'year' &&
          gantt_board_id != '0' &&
          !['2', '5'].includes(group_view_type) && (
            <HoverEars
              getX={this.getX}
              itemValue={itemValue}
              dispatch={this.props.dispatch}
              setRelyLineDrawing={this.setRelyDown}
              rely_down={rely_down}
            />
          )}
        {(drag_lock || drag_else_over_in) && (
          <DragCard
            drag_else_over_in={drag_else_over_in}
            id={id}
            width={
              (local_width || 6) -
              (gantt_view_mode == 'year' ? 0 : card_width_diff)
            }
          />
        )}
        {/* 大纲视图下显示任务预警 */}
        {is_show_warning_time && (
          <div
            style={{ right: early_warning_position - 12 }}
            className={indexStyles.early_warning}
            title={`预警时间为：${warning_timer_day}号`}
          >
            <span className={globalStyles.authTheme}>&#xe61f;</span>
          </div>
        )}
      </div>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      list_group = [],
      date_arr_one_level = [],
      ceilWidth,
      ceiHeight,
      gantt_board_id,
      group_list_area,
      current_list_group_id,
      group_list_area_section_height = [],
      group_view_type,
      gantt_view_mode,
      outline_tree_round = [],
      selected_card_visible,
      notification_todos,
      card_name_outside
    }
  },
  imCooperation: { im_all_latest_unread_messages = [] },
  publicTaskDetailModal: { card_id: card_detail_id }
}) {
  return {
    list_group,
    date_arr_one_level,
    ceilWidth,
    ceiHeight,
    gantt_board_id,
    group_list_area,
    current_list_group_id,
    group_list_area_section_height,
    im_all_latest_unread_messages,
    group_view_type,
    gantt_view_mode,
    outline_tree_round,
    card_detail_id,
    selected_card_visible,
    notification_todos,
    card_name_outside
  }
}
