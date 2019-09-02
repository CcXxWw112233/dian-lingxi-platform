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

export const handleChangeBoardViewScrollTop = ({ group_view_type, gantt_board_id, target_scrollTop_board_storage }) => {
    const target = document.getElementById('gantt_card_out_middle')
    if (!target) {
        return
    }
    if(gantt_board_id == '0' && group_view_type == '1') { //在查看项目的情况下
        target.scrollTop = target_scrollTop_board_storage
    } else {
        target.scrollTop = 0
    }
}