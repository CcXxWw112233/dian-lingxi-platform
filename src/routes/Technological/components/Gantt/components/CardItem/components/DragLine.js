import { message } from 'antd'
import React from 'react'
import { rebackCreateNotify } from '../../../../../../../components/NotificationTodos'
import { isApiResponseOk } from '../../../../../../../utils/handleResponseData'
import { onChangeCardHandleCardDetail } from '../../../ganttBusiness'
import styles from './DragLine.less'

/** 依赖连线的组件 */
export default class DragLine extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 线条长度 */
      lineHeight: 0,
      /** 角度 */
      angle: 0,
      /** 长度 */
      length: 0,
      /** 隐藏 */
      show: 'none'
    }
    /** 拖拽线条最大误差 */
    this.maxRange = 5
    /** 鼠标按下的xy坐标 */
    this.startEvent = {
      x: 0,
      y: 0
    }
    /** 点击的起始点记录 */
    this.point1 = {
      x: 0,
      y: 0
    }
  }

  /** 获取元素到html的滚动高度 */
  getScrollTop = (elm, key = 'scrollTop') => {
    var mOffsetTop = elm[key]
    var mOffsetParent = elm.parentElement
    while (mOffsetParent) {
      mOffsetTop += mOffsetParent[key]
      mOffsetParent = mOffsetParent.parentElement
    }
    return mOffsetTop
  }

  /** 检测禁用是方法还是bool并且返回禁用状态
   * @returns {boolean}
   */
  checkDisabled = () => {
    const { disabled } = this.props
    if (disabled instanceof Function) {
      return disabled.call(this, this.props.valueKey)
    }
    return disabled
  }

  /**
   * 获取鼠标事件的坐标
   * @param {React.MouseEvent} e 事件
   */
  getMouseXY = e => {
    return { x: e.pageX, y: e.pageY + this.getScrollTop(e.target) }
  }

  /** 鼠标按下的事件
   * @param {React.MouseEvent} e 事件
   */
  onMouseDown = e => {
    if (this.checkDisabled()) return
    e.stopPropagation()
    e.preventDefault()
    document.onmousemove = this.onMove
    document.onmouseup = this.onMouseUp.bind(this)
    this.startEvent = this.getMouseXY(e)
    this.point1 = this.startEvent
    this.setState({
      show: 'block'
    })
    const { setRelyLineDrawing } = this.props
    setRelyLineDrawing && setRelyLineDrawing(true)
  }

  /** 鼠标移动
   * @param {React.MouseEvent} e
   */
  onMove = e => {
    // e.stopPropagation()
    /** 移动中的每一帧坐标 */
    const moveEvent = this.getMouseXY(e)
    this.setState({
      ...this.calHypotenuse({
        x2: moveEvent.x - this.point1.x,
        y2: moveEvent.y - this.point1.y
      })
    })
  }

  /** 鼠标松开 */
  onMouseUp = e => {
    document.onmousemove = null
    document.onmouseup = null

    const { setRelyLineDrawing } = this.props
    setRelyLineDrawing && setRelyLineDrawing(false)

    this.setState({
      length: 0,
      angle: 0,
      show: 'none'
    })

    this.handleCreateRely(e)
  }

  /** 鼠标移出 */
  onMouseOut = () => {}

  /** 计算斜边长度和角度 */
  calHypotenuse = ({ x2, y2 }) => {
    const length = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)) //勾股定理求出斜边长度
    let angle = 0 //夹角角度
    let deg = 0 ////夹角弧度
    deg = Math.acos(y2 / length) // 三角函数公式求得
    // deg = 2 * Math.PI * angle / 360
    angle = (deg * 180) / Math.PI
    if (x2 > 0) {
      angle = -angle
    }
    return {
      length,
      angle
    }
  }

  /** 放开鼠标后的逻辑处理 */
  handleCreateRely = e => {
    //当落点在具体任务上
    const {
      data: { id: move_id, parent_id, board_id },
      dispatch
    } = this.props
    const target = e.target
    const { rely_top, rely_right, rely_left, rely_type } = e.target.dataset
    if (!rely_top && !rely_right && !rely_left) return
    let line_to
    const line_id = rely_top || rely_right || rely_left
    if (parent_id == line_id) {
      message.warn('已和父任务存在依赖')
      return
    }
    if (move_id == line_id) return
    if (rely_left) {
      //落点在左耳朵
      line_to = 'start'
    } else if (rely_right) {
      //落点在右耳朵
      line_to = 'end'
    } else if (rely_top) {
      //hover 到具体的任务上
      const clientX = e.clientX
      const { clientWidth } = target
      const target_1 = document.getElementById('gantt_card_out_middle')
      const offsetLeft = this.props.getX(target)
      const rela_left = clientX - offsetLeft - 2 + target_1.scrollLeft //鼠标在该任务内的相对位置
      if (rely_type == 'flow') {
        //流程的依赖关联只有start|end => start
        line_to = 'start'
      } else {
        if (clientWidth - rela_left < clientWidth / 2) {
          line_to = 'end'
        } else {
          line_to = 'start'
        }
      }
    } else {
    }
    dispatch({
      type: 'gantt/addCardRely',
      payload: {
        from_id: move_id,
        to_id: line_id,
        relation: `end_${line_to}`
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        // 添加依赖之后 需撤回 以及 更新弹窗数据
        const { selected_card_visible, group_view_type } = this.props
        rebackCreateNotify.call(this, {
          res,
          id: move_id,
          board_id,
          group_view_type,
          dispatch,
          parent_card_id: parent_id,
          card_detail_id: move_id,
          selected_card_visible
        })
        // 甘特图删除依赖后更新任务弹窗依赖数据
        onChangeCardHandleCardDetail({
          card_detail_id: move_id,
          selected_card_visible,
          parent_card_id: parent_id,
          operate_id: move_id,
          dispatch
        })
      }
    })
  }

  render() {
    const { angle, length, show } = this.state
    const { children } = this.props
    return (
      <div className={styles.container} onMouseDown={this.onMouseDown}>
        <div
          className={styles.lines}
          style={{
            display: show,
            height: length - 10 < 0 ? 0 : length - 10,
            transform: `rotate(${angle}deg)`
          }}
        ></div>
        {children}
      </div>
    )
  }
}
