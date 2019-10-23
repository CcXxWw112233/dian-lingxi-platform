export const beforeChangeCommunicationUpdateFileList = ({ dispatch, board_id }) => {
    dispatch({
        type: 'gantt/updateDatas',
        payload: {
            gantt_board_id: board_id,
        }
    })
    dispatch({
        type: 'gantt/getGanttBoardsFiles',
        payload: {
          board_id: board_id == '0' ? '': board_id,
          query_board_ids: [],
        }
      })
}
