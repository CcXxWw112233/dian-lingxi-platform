export const date_area_height = 64
export const task_item_height = 40
export const task_item_margin_top = 12
export const ceil_height = 52 // task_item_height + task_item_margin_top
export const ceil_height_fold = 46 //折叠的高度

export const ganttIsFold = ({ group_view_type, gantt_board_id }) => { //gantt是否折叠
    if (group_view_type == '1' && gantt_board_id == '0') {
        return true
    } else {
        return false
    }
}
