export const date_area_height = 64
export const task_item_height = 40 //进度条高度
export const task_item_height_fold = 24 //进度条高度（折叠后）
export const task_item_margin_top = 20
export const ceil_height = 60 // task_item_height + task_item_margin_top 单元格高度
export const ceil_height_fold = 24 //折叠的单元格高度
export const group_rows_fold = 4

export const ganttIsFold = ({ group_view_type, gantt_board_id, show_board_fold }) => { //gantt是否折叠
    if (group_view_type == '1' && gantt_board_id == '0' && show_board_fold) {
        return true
    } else {
        return false
    }
}
// 转义时间
export const getDigitTime = (timestamp) => {
    if (!timestamp) {
        return 0
    }
    let new_timestamp = timestamp.toString()
    if (new_timestamp.length == 10) {
        new_timestamp = Number(new_timestamp) * 1000
    } else {
        new_timestamp = Number(new_timestamp)
    }
    return new_timestamp
}

export const test_card_item = [
    {
        id: "1232147328316608510",
        name: "测试用的",
        board_id: "1230737131983474688",
        user_id: "1192753179570343936",
        is_deleted: "0",
        // start_time: "1580400000",
        // due_time: "1580659140",
        is_realize: "0",
        is_archived: "0",
        id_list: ["1192753179570343936"],
        type: "0",
        is_privilege: "0",
        label_data: [],
    }, {
        id: "1232147328316608511",
        name: "测试用的2",
        board_id: "1230737131983474688",
        user_id: "1192753179570343936",
        is_deleted: "0",
        // start_time: "1580400000",
        // due_time: "1580659140",
        time_span: 4,
        is_realize: "0",
        is_archived: "0",
        id_list: ["1192753179570343936"],
        type: "0",
        is_privilege: "0",
        label_data: [],
    },
]

const list_group = [//大分组
    {
        lane_data: {  //原始数据
            card_no_times: [],
            cards: [
                {
                    id: '',
                    is_open: false
                }
            ]
        },
        outline_tree: {},//转化后的树
        list_data: [], //转化后的数组，用于渲染中间部分任务条

    }
]

export const visual_item = {
    id: "1232147328316608asd0",
    name: "里程碑头",
    board_id: "1230737131983474688",
    is_group_head: true
}