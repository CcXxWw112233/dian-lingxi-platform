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
}