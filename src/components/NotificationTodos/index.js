import { notification, message, Button } from 'antd'
import { revokeCardDo } from '../../services/technological/task'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { ganttIsOutlineView } from '../../routes/Technological/components/Gantt/constants'
function defer(fn) {
    return Promise.resolve().then(fn)
}

export function handleReBackNotiParams({ code, data = [], message, id }) {
    const { scope_content = [], undo_id, scope_number, scope_user, scope_day } = data
    const length = scope_content.filter(item => item.id != id).length
    let operate_code = code
    let comfirm_message = `${message}。`
    if (code == '0') { //成功的时候存在依赖影响
        if (length) {  //当存在影响其它任务的时候 需要warn
            operate_code = '1'
            comfirm_message = `当前操作偏离原计划${scope_day}天，将影响${scope_user}个人，${scope_number}条任务。`
        }
    } else {
        operate_code = '2'
    }
    return {
        code: operate_code,
        message: comfirm_message,
        undo_id
    }
}

const excuteQueue = [] //执行中的队列

class ExcuteTodo {
    constructor(options) {
        const { code, message, id, board_id, undo_id, group_view_type, dispatch } = options
        this.id = id //操作对象的id
        this.board_id = board_id
        this.code = code
        this.message = message
        this.undo_id = undo_id
        this.notification_timer = null
        this.notification_duration = 6
        this.group_view_type = group_view_type
        this.dispatch = dispatch
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
        const type = ganttIsOutlineView({ group_view_type }) ? 'updateOutLineTree' : 'updateListGroup'
        dispatch({
            type: `gantt/${type}`,
            payload: {
                datas
            }
        })
    }
    // 拖拽后弹出提示窗
    createNotify = () => {
        const { code, message, id, board_id, undo_id } = this
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
            },

        }
        const operator = type_obj[code] || {}
        const { action = 'config', title = '提示' } = operator

        const reBack = () => {
            revokeCardDo({ undo_id, board_id }).then(res => {
                if (isApiResponseOk(res)) {
                    message.success('撤回成功')
                    this.updateGanttData(res.data)
                } else {
                    message.warn(res.message)
                }
            })
        }
        const renderBtn = (notification_duration) => (
            <Button type="primary" size="small" onClick={() => {
                clearTimer()
                notification.close(id)
                reBack()
            }}>
                撤销
            </Button>
        );
        const openNoti = (notification_duration) => {
            const countdown_message = notification_duration ? `${notification_duration}秒后关闭` : ''
            notification[action]({
                placement: 'bottomRight',
                bottom: 50,
                duration: 5,
                message: title,
                description: `${message}${countdown_message}`,
                btn: code == '1' ? renderBtn(notification_duration) : '',
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
                    this.notification_duration = 6
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
        const { code, data, message, id, board_id, group_view_type, dispatch } = options
        // this.data = data
        // this.code = code
        // this.message = message
        // this.undo_id = undo_id //撤回id
        this.group_view_type = group_view_type
        this.dispatch = dispatch
        this.id = id //操作对象的id
        this.board_id = board_id
        this.todoQueue = []
        // this.addTodos({ id, code, message, undo_id, board_id })

    }

    addTodos = (todoInstance, todos = []) => { //添加代办列表
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
        const { group_view_type, dispatch, id, board_id } = this
        let item
        let excute
        while (item = this.todoQueue.shift()) { //队列遍历
            const { code, message, undo_id } = item
            excute = new ExcuteTodo({ code, message, undo_id, id, board_id, group_view_type, dispatch }) //执行当前一条的弹窗
            const timer = excute.createNotify() //弹出
            excute = null

            excuteQueue.push({ timer, id })
            console.log('notify_todos', excuteQueue)

        }
    }
}


// 创建实例弹窗列表代办
export function rebackCreateNotify({ res, id, board_id, group_view_type, dispatch }) {
    const { code, message, undo_id } = handleReBackNotiParams({ ...res, id }) //转化所想要的参数 code message undo_id
    if (code == '0') {
        message.success('变更成功')
    } else {
        console.log('notify_this', this)
        if (!this.notify) {
            this.notify = new EnequeueNotifyTodos({ id, board_id, group_view_type, dispatch })
        }
        this.notify.addTodos({ code, message, undo_id, id })
        this.notify = null
    }
}