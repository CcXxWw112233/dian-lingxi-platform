export const beforeCreateBoardUpdateGantt = (dispatch) => {
    dispatch({
        type: 'gantt/getGanttData',
        payload: {

        }
    })
    dispatch({
        type: 'gantt/getAboutAppsBoards',
        payload: {

        }
    })

    dispatch({
        type: 'gantt/getAboutGroupBoards',
        payload: {

        }
    })
    dispatch({
        type: 'gantt/getAboutUsersBoards',
        payload: {

        }
    })
    dispatch({
        type: 'gantt/getContentFiterBoardTree',
        payload: {

        }
    })
    dispatch({
        type: 'gantt/getContentFiterUserTree',
        payload: {

        }
    })
}
export const beforeChangeBoardUpdateGantt = ({ dispatch, board_id }) => {
    dispatch({
        type: 'gantt/updateDatas',
        payload: {
            gantt_board_id: board_id,
        }
    })
    beforeCreateBoardUpdateGantt(dispatch)
}
export const handleChangeBoardViewScrollTop = ({ group_view_type, gantt_board_id, target_scrollTop_board_storage }) => {
    const target = document.getElementById('gantt_card_out_middle')
    if (!target) {
        return
    }
    if (gantt_board_id == '0' && group_view_type == '1') { //在查看项目的情况下
        target.scrollTop = target_scrollTop_board_storage
    } else {
        target.scrollTop = 0
    }
}


// 计算时间跨度
const calTimeSpan = (init_time, end_time) => {
    const start_due_time_span_time = init_time - end_time
    const start_due_time_span = start_due_time_span_time / (24 * 60 * 60 * 1000)
    const span_date = Math.floor(start_due_time_span)
    const span_hour = ((start_due_time_span - span_date) * 24).toFixed(1)
    return {
        span_date,
        span_hour
    }
}

const handleDescription = (date, hour) => {
    // console.log('sssss', 'ss', 0 != '0')
    let date_des = `${date}天`
    let hour_des = `${hour}时`
    if (date == 0) {
        date_des = ``
    }
    if (hour == '0.0') {
        hour_des = ``
    } else if (hour == '24.0') {
        hour_des = ''
        date_des = `${Number(date) + 1}天`
    }
    return {
        date_des,
        hour_des
    }
}
// 计算任务的逾期情况和时间跨度
export const filterDueTimeSpan = ({ start_time, due_time, is_has_end_time, is_has_start_time, is_realize }) => {
    let due_description = ''
    if (!!!due_time) {
        return {
            is_overdue: false,
            due_description
        }
    }
    const now = new Date().getTime()
    const new_start_time = start_time.toString().length > 10 ? Number(start_time) : Number(start_time) * 1000
    const new_due_time = due_time.toString().length > 10 ? Number(due_time) : Number(due_time) * 1000

    // 计算逾期
    const due_time_span = now - new_due_time

    //逾期
    const aready_due_date = calTimeSpan(now, new_due_time).span_date
    const aready_due_hour = calTimeSpan(now, new_due_time).span_hour

    //总长
    const { span_date, span_hour } = calTimeSpan(new_due_time, new_start_time)

    if (due_time_span < 0 || is_realize == '1') { //非逾期
        const { date_des, hour_des } = handleDescription(span_date, span_hour)
        if (is_has_end_time && is_has_start_time) {
            due_description = `共${date_des}${hour_des}`
        }
        return {
            is_overdue: false,
            due_description
        }
    } else {
        const { date_des, hour_des } = handleDescription(aready_due_date, aready_due_hour)
        return {
            is_overdue: true,
            due_description: `已逾期${date_des}${hour_des}`
        }
    }
}
