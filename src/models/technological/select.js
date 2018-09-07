
export const selectAppsSelectKey = state => state[(`projectDetail`)].datas.appsSelectKey //应用key
export const selectAppsSelectKeyIsAreadyClickArray = state => state[(`projectDetail`)].datas.appsSelectKeyIsAreadyClickArray ////点击过的appsSelectKey push进数组，用来记录无需重新查询数据

export const selectTaskGroupList = state => state[(`projectDetail`)].datas.taskGroupList //任务列表
export const selectTaskGroupListIndex = state => state[(`projectDetail`)].datas.taskGroupListIndex  //当前选中任务分组index
export const selectTaskGroupListIndexIndex = state => state[(`projectDetail`)].datas.taskGroupListIndex_index //当前选中任务分组里的任务index
export const selectDrawContent = state => state[(`projectDetail`)].datas.drawContent  //任务右方抽屉

