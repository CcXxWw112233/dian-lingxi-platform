import { notification, message as antMessage, Button } from 'antd'
import {
  revokeCardDo,
  revokeMilestoneDo
} from '../../services/technological/task'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { ganttIsOutlineView } from '../../routes/Technological/components/Gantt/constants'
import { onChangeCardHandleCardDetail } from '../../routes/Technological/components/Gantt/ganttBusiness'
import { timestampToTimeNormal } from '../../utils/util'
function defer(fn) {
  return Promise.resolve().then(fn)
}

const DESCRIPTION_TIME_RANGE = {
  start: '开始',
  start_end: '起止',
  end: '截止'
}

export function handleReBackNotiParams({
  code,
  data = [],
  message,
  id,
  time_range
}) {
  const {
    scope_content = [],
    undo_id,
    scope_number,
    scope_user,
    scope_day,
    scope_date
  } = data
  const length = scope_content.filter(item => item.id != id).length
  let operate_code = code
  let comfirm_message = `${message}。`
  let confirm_title = ''
  if (!scope_day && !scope_date) {
    confirm_title = '变更成功'
  }
  if (scope_date) {
    confirm_title = `已将${
      DESCRIPTION_TIME_RANGE[time_range]
    }时间调整至${timestampToTimeNormal(scope_date, '/', false, true)}`
  } else if (scope_day) {
    confirm_title = `已将${DESCRIPTION_TIME_RANGE[time_range]}时间${
      Number(scope_day) > 0 ? '延后' : '提前'
    }${Math.abs(Number(scope_day))}天`
  }
  if (code == '0') {
    //成功的时候存在依赖影响
    if (length || !!Number(scope_number)) {
      //当存在影响其它任务的时候 需要warn
      operate_code = '1'

      comfirm_message = `此操作将影响${scope_user || '0'}个人，${scope_number ||
        '0'}条任务。`
    }
  } else {
    operate_code = '2'
  }
  return {
    code: operate_code,
    message: comfirm_message,
    undo_id,
    confirm_title: confirm_title
  }
}
const init_notification_duration = 11

const excuteQueue = [] //执行中的队列

class ExcuteTodo {
  constructor(options) {
    const {
      code,
      message,
      confirm_title,
      id,
      board_id,
      undo_id,
      group_view_type,
      dispatch,
      parent_card_id,
      selected_card_visible,
      card_detail_id,
      operate_in_card_detail_panel,
      targt_type
    } = options
    this.id = id //操作对象的id
    this.board_id = board_id
    this.code = code
    this.message = message
    this.confirm_title = confirm_title
    this.undo_id = undo_id
    this.notification_timer = null
    this.notification_duration = init_notification_duration
    this.group_view_type = group_view_type
    this.dispatch = dispatch
    this.parent_card_id = parent_card_id //当是子任务的时候
    this.card_detail_id = card_detail_id
    this.selected_card_visible = selected_card_visible
    this.operate_in_card_detail_panel = operate_in_card_detail_panel
    this.targt_type = targt_type
    console.log('notify_queue', excuteQueue)
    if (excuteQueue.length) {
      const index = excuteQueue.findIndex(item => item.id === id)
      if (index !== -1) {
        const timer = excuteQueue[index].timer
        clearInterval(timer)
        excuteQueue.splice(index, 1)
      }
    }
  }
  // 批量更新甘特图数据
  updateGanttData = (datas = []) => {
    const { group_view_type, dispatch } = this
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
  // 拖拽后弹出提示窗
  createNotify = () => {
    const {
      code,
      message,
      id,
      board_id,
      undo_id,
      parent_card_id,
      selected_card_visible,
      card_detail_id,
      confirm_title,
      dispatch,
      operate_in_card_detail_panel
    } = this
    if (['0', '2'].includes(code)) return
    const type_obj = {
      '0': {
        action: 'success',
        title: '已变更'
      },
      '1': {
        action: 'warning',
        title: '确认编排范围'
      },
      '2': {
        action: 'error',
        title: '变更失败'
      }
    }
    const operator = type_obj[code] || {}
    const { action = 'config', title = '提示' } = operator

    const reBackCard = () => {
      revokeCardDo({ undo_id, board_id }).then(res => {
        if (isApiResponseOk(res)) {
          antMessage.success('撤回成功')
          this.updateGanttData(res.data)
          if (operate_in_card_detail_panel) {
            //如果在详情弹窗种操作时间，只需直接查询，否则在其它地方操作就要做校验
            this.dispatch({
              type: 'publicTaskDetailModal/getCardWithAttributesDetail',
              payload: {
                id: parent_card_id || id
              }
            })
          } else {
            onChangeCardHandleCardDetail({
              card_detail_id, //来自任务详情的id
              selected_card_visible, //任务详情弹窗是否弹开
              dispatch,
              operate_id: id, //当前操作的id
              operate_parent_card_id: parent_card_id //当前操作的任务的父任务id
            })
          }
        } else {
          antMessage.warn(res.message)
        }
      })
    }
    const reBackMilestone = () => {
      revokeMilestoneDo({ undo_id }).then(res => {
        if (isApiResponseOk(res)) {
          if (this.group_view_type == '1') {
          } else if (this.group_view_type == '4') {
            this.updateGanttData(res.data)
          } else {
          }
          dispatch({
            type: 'gantt/getGttMilestoneList',
            payload: {}
          })
        } else {
          antMessage.warn(res.message)
        }
      })
    }
    const renderBtn = () => (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          clearTimer()
          notification.close(id)
          if (this.targt_type == 'milestone') {
            reBackMilestone()
          } else {
            reBackCard()
          }
        }}
      >
        撤销
      </Button>
    )
    const openNoti = notification_duration => {
      const countdown_message = notification_duration
        ? `${notification_duration}秒后关闭`
        : ''
      notification[action]({
        placement: 'bottomRight',
        bottom: 50,
        duration: this.notification_duration - 1,
        message: confirm_title,
        description: `${message}`, //${countdown_message}`,
        btn: code == '1' ? renderBtn() : '',
        key: id,
        onClose: () => {
          clearTimer()
          notification.close(id)
        }
      })
    }

    const clearTimer = () => {
      clearInterval(this.notification_timer)
      this.notification_timer = null
    }
    const setTimer = () => {
      this.notification_timer = setInterval(() => {
        this.notification_duration--
        if (this.notification_duration == 0) {
          openNoti(0)
          this.notification_duration = init_notification_duration
          clearTimer()
          this.notification_timer = null
          return
        }
        openNoti(this.notification_duration)
      }, 1000)
      return this.notification_timer
    }
    clearTimer()
    notification.close(id) //先关掉旧的
    return setTimer()
  }
}
// 处理弹窗队列
export class EnequeueNotifyTodos {
  constructor(options) {
    const {
      code,
      data,
      message,
      id,
      board_id,
      group_view_type,
      dispatch,
      card_detail_id,
      selected_card_visible,
      operate_in_card_detail_panel,
      targt_type
    } = options
    // this.data = data
    // this.code = code
    // this.message = message
    // this.undo_id = undo_id //撤回id
    this.group_view_type = group_view_type
    this.dispatch = dispatch
    this.id = id //操作对象的id
    this.targt_type = targt_type
    this.board_id = board_id
    this.card_detail_id = card_detail_id
    this.selected_card_visible = selected_card_visible
    this.operate_in_card_detail_panel = operate_in_card_detail_panel
    this.todoQueue = []
    // this.addTodos({ id, code, message, undo_id, board_id })
  }

  addTodos = (todoInstance, todos = []) => {
    //添加代办列表
    if (typeof todoInstance == 'object') {
      this.todoQueue.push(todoInstance)
    }
    if (todos.length) {
      this.todoQueue = [].concat(this.todoQueue, todos)
    }
    console.log('notify_todos', this.todoQueue)
    defer(this.flush)
  }
  flush = () => {
    const {
      group_view_type,
      dispatch,
      id,
      board_id,
      selected_card_visible,
      card_detail_id,
      operate_in_card_detail_panel,
      targt_type
    } = this
    let item
    let excute
    while ((item = this.todoQueue.shift())) {
      //队列遍历
      const { code, message, undo_id, parent_card_id, confirm_title } = item
      excute = new ExcuteTodo({
        code,
        message,
        undo_id,
        id,
        board_id,
        group_view_type,
        dispatch,
        parent_card_id,
        selected_card_visible,
        card_detail_id,
        operate_in_card_detail_panel,
        targt_type,
        confirm_title
      }) //执行当前一条的弹窗
      const timer = excute.createNotify() //弹出
      excute = null

      excuteQueue.push({ timer, id })
      console.log('notify_todos', excuteQueue)
    }
  }
}

// 创建实例弹窗列表代办
/**
 *@param {object} res 后台返回的整串数据{code, message, data:{} }具体见方法调用内解析
 *@param {string} id 当前id
 *@param {String} targt_type 处理的类型， 默认是card/任务, milestone/里程碑
 *@param {string} board_id 当前对象id所属的项目id
 *@param {string} group_view_type 甘特图视图
 *@param {fuction} dispatch
 *@param {string} parent_card_id  当前id的父id(子任务 =》 父任务) ,targt_type = =card必传
 *@param {string} card_detail_id  任务详情弹窗的弹窗的任务id ， operate_in_card_detail_panel为ture时不需要
 *@param {boolean} selected_card_visible 甘特图是否打开任务弹窗, operate_in_card_detail_panel为ture时不需要
 *@param {boolean} operate_in_card_detail_panel 是否在任务详情弹窗上操作 为true时不需要 card_detail_id selected_card_visible这两个参数
 *@param {string} time_range 时间范围 'start/end/start_end'
 **/
export function rebackCreateNotify({
  res,
  id,
  board_id,
  group_view_type,
  dispatch,
  parent_card_id,
  card_detail_id,
  selected_card_visible,
  operate_in_card_detail_panel,
  targt_type = 'card',
  time_range = 'end'
}) {
  const { code, message, undo_id, confirm_title } = handleReBackNotiParams({
    ...res,
    id,
    targt_type,
    time_range
  }) //转化所想要的参数 code message undo_id
  if (code == '0') {
    antMessage.success('变更成功')
  } else {
    console.log('notify_this', this)
    if (!this.notify) {
      //没有弹窗队列时
      this.notify = new EnequeueNotifyTodos({
        id,
        board_id,
        group_view_type,
        dispatch,
        card_detail_id,
        selected_card_visible,
        operate_in_card_detail_panel,
        targt_type
      })
    }
    // 往弹窗队列添加任务
    this.notify.addTodos({
      code,
      message,
      confirm_title,
      undo_id,
      id,
      parent_card_id,
      targt_type
    })
    this.notify = null
  }
}
