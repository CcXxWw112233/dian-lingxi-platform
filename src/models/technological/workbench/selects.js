export const selectDrawContent = state => state[(`workbenchTaskDetail`)].datas.drawContent
export const selectBoardId = state => state[(`workbenchTaskDetail`)].datas.board_id

export const selectBoardIdFile = state => state[(`workbenchFileDetail`)].datas.board_id
export const selectFilePreviewCommitPointNumber  =  state => state[(`workbenchFileDetail`)].datas.filePreviewCommitPointNumber
export const selectCurrentParrentDirectoryId  =  state => state[(`workbenchFileDetail`)].datas.currentParrentDirectoryId
