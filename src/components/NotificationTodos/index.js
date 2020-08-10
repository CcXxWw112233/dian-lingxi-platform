import { notification, message, Button } from 'antd'
import { revokeCardDo } from '../../services/technological/task'
import { isApiResponseOk } from '../../utils/handleResponseData'
function defer(fn) {
    return Promise.resolve().then(fn)
}

function handleParams({ code, data = [], message, id }) {
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

class ExcuteTodo {
    constructor(options) {
        const { code, message, id, board_id, undo_id } = options
        this.id = id //操作对象的id
        this.board_id = board_id
        this.notification_duration = 5
        this.code = code
        this.message = message
        this.undo_id = undo_id

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
                    this.notification_timer = 5
                    clearTimer()
                    this.notification_timer = null
                    // return
                }
                openNoti(this.notification_duration)
            }, 1000)
        }
        clearTimer()
        notification.close(id) //先关掉旧的
        setTimer()
    }
}
// 处理弹窗队列
export class EnequeueNotifyTodos {
    constructor(options) {
        const { code, data, message, id, board_id } = options
        this.data = data
        this.id = id //操作对象的id
        this.board_id = board_id
        const { code: $code, message: $message, undo_id: $undo_id } = handleParams({ code, data, message, id })
        this.code = $code
        this.message = $message
        this.undo_id = $undo_id //撤回id
        this.todoQueue = []
        this.addTodos({ id, code: $code, message: $message, undo_id: $undo_id, board_id })
    }

    addTodos = (todoInstance) => { //如果改变时间了，则该组件会销毁重新渲染，需要添加进redux代办，在重新渲染时执行
        this.todoQueue.push(todoInstance)
        console.log('notify', this.todoQueue)
        defer(this.flush)
    }
    flush = () => {
        let item
        while (item = this.todoQueue.shift()) { //队列遍历
            const { code, message, undo_id, id, board_id } = item
            console.log('notify', item)
            const excute = new ExcuteTodo({ code, message, undo_id, id, board_id }) //执行当前一条的弹窗
            excute.createNotify() //弹出
        }
    }
}