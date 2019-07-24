import React, { Component } from 'react';
import { message } from 'antd'
import {connect} from "dva/index";
import GanttFace from './GanttFace'
import TaskDetailModal from '../Workbench/CardContent/Modal/TaskDetailModal';
import FileDetailModal from '../Workbench/CardContent/Modal/FileDetailModal';
import AddTaskModal from '../Workbench/CardContent/Modal/AddTaskModal';
import {getProjectGoupList} from "../../../../services/technological/task";

const getEffectOrReducerByName = name => `workbench/${name}`
const getEffectOrReducerByName_4 = name => `workbenchTaskDetail/${name}`
const getEffectOrReducerByName_5 = name => `workbenchFileDetail/${name}`

class Gantt extends Component{
  state = {
    TaskDetailModalVisibile: false,
    previewFileModalVisibile: false,
    projectGroupLists: [],
    board_users: [],
    projectGroupListsIsRequest: false
  }

  componentDidMount() {
    this.getProjectGoupLists()
    // this.setBoardUsers()
  }

  componentWillReceiveProps(nextProps) {

  }

  setBoardUsers(projectId) {
    const { dispatch } = this.props
    dispatch({
      type: 'workbench/fetchCurrentSelectedProjectMembersList',
      payload: {
        projectId
      }
    });
  }

  //弹窗
  setPreviewFileModalVisibile() {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    });
  }
  setTaskDetailModalVisibile() {
    this.setState({
      TaskDetailModalVisibile: !this.state.TaskDetailModalVisibile
    });
  }

  //用来实现创建任务弹窗方法
  handleShouldUpdateProjectGroupList = () => {
    this.getProjectGoupLists()
  }
  async getProjectGoupLists() {
    const res = await getProjectGoupList()
    const isResOk = res => res && res.code === '0'
    if(!isResOk(res)) {
      message.error('获取项目分组信息失败')
      return
    }
    return await this.setState({
      projectGroupLists: res.data,
      projectGroupListsIsRequest: true
    })
  }
  getNewTaskInfo = obj => {
    this.setState({
      newTask: obj
    });
  };
  addTaskModalVisibleChange = flag => {
    const { projectGroupListsIsRequest } = this.state
    const { datas: { projectTabCurrentSelectedProject, current_list_group_id } } = this.props.model
    if(projectTabCurrentSelectedProject !== '0') {
      this.setBoardUsers(projectTabCurrentSelectedProject)
    } else {
      this.setBoardUsers(current_list_group_id)
    }

    if(!projectGroupListsIsRequest) {
      const that = this
      message.info('您所需要的数据正在赶来的路上，请稍候...', 2, function () {
        that.getProjectGoupLists()
      })
      return false
    }
    this.setState({
      addTaskModalVisible: flag
    });
  };
  addNewTask(data) {
    const { dispatch } = this.props
    Promise.resolve(
      dispatch({
        type: 'workbench/addTask',
        payload: {
          data
        }
      })
    )
      .then(res => {
        if(res) {
          dispatch({
            type: 'gantt/getGanttData',
            payload: {}
          })
        } else {
          message.warn('创建任务失败')
        }
      })
      .catch(err => console.log(err));
  }
  handleGetNewTaskParams(data) {
    const { datas: { create_start_time, create_end_time, projectTabCurrentSelectedProject, current_list_group_id } } = this.props.model

    //设置截止日期最后一秒
    const create_end_time_date = new Date(create_end_time)
    const create_end_time_final = `${create_end_time_date.getFullYear()}/${create_end_time_date.getMonth() + 1}/${create_end_time_date.getDate()} 23:59:59`
    const create_end_time_final_timestamp = new Date(create_end_time_final).getTime()

    const param = {
      start_time: create_start_time,
      due_time: create_end_time_final_timestamp, //create_end_time,
      users: data['users'],
      name: data['name'],
      type: data['type'],
    }
    if(projectTabCurrentSelectedProject == '0') {
      param.board_id = current_list_group_id
      param.list_id = data['list_id']
    } else {
      param.board_id = projectTabCurrentSelectedProject
      param.list_id = current_list_group_id
    }
    this.addNewTask(param)
    this.setState({
      addTaskModalVisible: false
    })
  }

  //修改某一个任务
  handleChangeCard({card_id, drawContent}) {
    const { dispatch } = this.props
    const { datas: { list_group = [], projectTabCurrentSelectedProject, current_list_group_id, board_id }} = this.props.model
    const list_group_new = [...list_group]
    if(projectTabCurrentSelectedProject == '0') {
      for(let i = 0; i < list_group_new.length; i++ ) {
        if(board_id == list_group_new[i].list_id) {
          for(let j = 0; j < list_group_new[i].lane_data.card.length; j++) {
            if(card_id == list_group_new[i].lane_data.card[j].id) {
              list_group_new[i].lane_data.card[j] = {...list_group_new[i].lane_data.card[j], ...drawContent}
              list_group_new[i].lane_data.card[j]['name'] = list_group_new[i].lane_data.card[j]['card_name']
              break
            }
          }
          break
        }
      }

    } else {
      for(let i = 0; i < list_group_new.length; i++ ) {
        let flag = false
        for(let j = 0; j < list_group_new[i].lane_data.card.length; j++) {
          if(card_id == list_group_new[i].lane_data.card[j].id) {
            list_group_new[i].lane_data.card[j] = {...list_group_new[i].lane_data.card[j], ...drawContent}
            list_group_new[i].lane_data.card[j]['name'] = list_group_new[i].lane_data.card[j]['card_name']
            break
          }
        }
        if(flag) {
          break
        }
      }

    }
    dispatch({
      type: 'gantt/handleListGroup',
      payload: {
        data: list_group_new
      }
    })
  }

  render() {
    const { dispatch, model = {}, modal } = this.props
    const { previewFileModalVisibile, TaskDetailModalVisibile, addTaskModalVisible, projectGroupLists = [], board_users = [] } = this.state
    const { datas = {} } = model;
    const {
      projectList = [],
      projectTabCurrentSelectedProject,
      current_list_group_id,
      currentSelectedProjectMembersList = []
    } = datas;

    const CreateTaskProps = {
      modal,
      model,
      getBoardMembers(payload) {
        dispatch({
          type: getEffectOrReducerByName_4('getBoardMembers'),
          payload: payload
        })
      },
      getCardDetail(payload){
        dispatch({
          type: getEffectOrReducerByName_4('getCardDetail'),
          payload: payload
        })
      },
      updateTaskDatas(payload) {
        dispatch({
          type: getEffectOrReducerByName_4('updateDatas'),
          payload: payload
        })
      },
      deleteTaskFile(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteTaskFile'),
          payload: data,
        })
      },
      addTaskGroup(data) {
        dispatch({
          type: getEffectOrReducerByName_4('addTaskGroup'),
          payload: data,
        })
      },
      deleteTaskGroup(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteTaskGroup'),
          payload: data,
        })
      },
      updateTaskGroup(data) {
        dispatch({
          type: getEffectOrReducerByName_4('updateTaskGroup'),
          payload: data,
        })
      },
      getTaskGroupList(data){
        dispatch({
          type: getEffectOrReducerByName_4('getTaskGroupList'),
          payload: data
        })
      },
      addTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('addTask'),
          payload: data
        })
      },
      updateTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('updateTask'),
          payload: data
        })
      },
      deleteTask(id){
        dispatch({
          type: getEffectOrReducerByName_4('deleteTask'),
          payload: {
            id
          }
        })
      },
      updateChirldTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('updateChirldTask'),
          payload: data
        })
      },
      deleteChirldTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('deleteChirldTask'),
          payload: data
        })
      },

      archivedTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('archivedTask'),
          payload: data
        })
      },
      changeTaskType(data){
        dispatch({
          type: getEffectOrReducerByName_4('changeTaskType'),
          payload: data
        })
      },
      addChirldTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('addChirldTask'),
          payload: data
        })
      },
      addTaskExecutor(data){
        dispatch({
          type: getEffectOrReducerByName_4('addTaskExecutor'),
          payload: data
        })
      },
      removeTaskExecutor(data){
        dispatch({
          type: getEffectOrReducerByName_4('removeTaskExecutor'),
          payload: data
        })
      },
      completeTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('completeTask'),
          payload: data
        })
      },
      addTaskTag(data){
        dispatch({
          type: getEffectOrReducerByName_4('addTaskTag'),
          payload: data
        })
      },
      removeTaskTag(data){
        dispatch({
          type: getEffectOrReducerByName_4('removeTaskTag'),
          payload: data
        })
      },
      removeProjectMenbers(data){
        dispatch({
          type: getEffectOrReducerByName_4('removeProjectMenbers'),
          payload: data
        })
      },
      getCardCommentList(id) {
        dispatch({
          type: getEffectOrReducerByName_4('getCardCommentList'),
          payload: {
            id
          }
        })
      },
      addCardNewComment(data) {
        dispatch({
          type: getEffectOrReducerByName_4('addCardNewComment'),
          payload: data
        })
      },
      deleteCardNewComment(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteCardNewComment'),
          payload: data
        })
      },
      getBoardTagList(data) {
        dispatch({
          type: getEffectOrReducerByName_4('getBoardTagList'),
          payload: data
        })
      },
      updateBoardTag(data) {
        dispatch({
          type: getEffectOrReducerByName_4('updateBoardTag'),
          payload: data
        })
      },
      toTopBoardTag(data) {
        dispatch({
          type: getEffectOrReducerByName_4('toTopBoardTag'),
          payload: data
        })
      },
      deleteBoardTag(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteBoardTag'),
          payload: data
        })
      }
    }
    const FileModuleProps = {
      modal,
      model,
      updateFileDatas(payload) {
        dispatch({
          type: getEffectOrReducerByName_5('updateDatas'),
          payload: payload
        })
      },
      getFileList(params){
        dispatch({
          type: getEffectOrReducerByName('getFileList'),
          payload: params
        })
      },
      fileCopy(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileCopy'),
          payload: data
        })
      },
      fileDownload(params){
        dispatch({
          type: getEffectOrReducerByName_5('fileDownload'),
          payload: params
        })
      },
      fileRemove(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileRemove'),
          payload: data
        })
      },
      fileMove(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileMove'),
          payload: data
        })
      },
      fileUpload(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileUpload'),
          payload: data
        })
      },
      fileVersionist(params){
        dispatch({
          type: getEffectOrReducerByName_5('fileVersionist'),
          payload: params
        })
      },
      recycleBinList(params){
        dispatch({
          type: getEffectOrReducerByName_5('recycleBinList'),
          payload: params
        })
      },
      deleteFile(data){
        dispatch({
          type: getEffectOrReducerByName_5('deleteFile'),
          payload: data
        })
      },
      restoreFile(data){
        dispatch({
          type: getEffectOrReducerByName_5('restoreFile'),
          payload: data
        })
      },
      getFolderList(params){
        dispatch({
          type: getEffectOrReducerByName_5('getFolderList'),
          payload: params
        })
      },
      addNewFolder(data){
        dispatch({
          type: getEffectOrReducerByName_5('addNewFolder'),
          payload: data
        })
      },
      updateFolder(data){
        dispatch({
          type: getEffectOrReducerByName_5('updateFolder'),
          payload: data
        })
      },
      filePreview(params) {
        dispatch({
          type: getEffectOrReducerByName_5('filePreview'),
          payload: params
        })
      },
      getPreviewFileCommits(params) {
        dispatch({
          type: getEffectOrReducerByName_5('getPreviewFileCommits'),
          payload: params
        })
      },
      addFileCommit(params) {
        dispatch({
          type: getEffectOrReducerByName_5('addFileCommit'),
          payload: params
        })
      },
      deleteCommit(params) {
        dispatch({
          type: getEffectOrReducerByName_5('deleteCommit'),
          payload: params
        })
      },
    }
    const updateDatasTask = (payload) => {
      dispatch({
        type: getEffectOrReducerByName_4('updateDatas'),
        payload: payload
      })
    }
    const updateDatasFile = (payload) => {
      dispatch({
        type: getEffectOrReducerByName_5('updateDatas'),
        payload: payload
      })
    }

    return (
      <div>
        <GanttFace
          setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}
          addTaskModalVisibleChange={this.addTaskModalVisibleChange.bind(this)}
          projectTabCurrentSelectedProject={projectTabCurrentSelectedProject}
        />
        <FileDetailModal
          {...this.props}
          {...CreateTaskProps}
          {...FileModuleProps}
          setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}
          modalVisible={previewFileModalVisibile}
          setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}
          updateDatasTask={updateDatasTask}
          updateDatasFile={updateDatasFile}
          updateTaskDatas={updateDatasTask}
          updateFileDatas={updateDatasFile}
        />

        <TaskDetailModal
          {...this.props}
          {...CreateTaskProps}
          {...FileModuleProps}
          modalVisible={TaskDetailModalVisibile}
          setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}
          setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}
          updateDatasTask={updateDatasTask}
          updateDatasFile={updateDatasFile}
          updateTaskDatas={updateDatasTask}
          updateFileDatas={updateDatasFile}
          handleChangeCard={this.handleChangeCard.bind(this)}
          updateDatas={updateDatasTask}
        />

        {addTaskModalVisible && (
          <AddTaskModal
            {...this.props}
            setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(
              this
            )}
            isUseInGantt
            projectIdWhenUseInGantt={projectTabCurrentSelectedProject=='0'?current_list_group_id:projectTabCurrentSelectedProject}
            projectMemberListWhenUseInGantt={currentSelectedProjectMembersList}
            projectGroupListId={projectTabCurrentSelectedProject=='0'?'':current_list_group_id}

            handleGetNewTaskParams={this.handleGetNewTaskParams.bind(this)}
            modalTitle="添加任务"
            taskType="RESPONSIBLE_TASK"
            getNewTaskInfo={this.getNewTaskInfo}
            projectTabCurrentSelectedProject={projectTabCurrentSelectedProject}
            projectList={projectList}
            addTaskModalVisible={addTaskModalVisible}
            addTaskModalVisibleChange={this.addTaskModalVisibleChange.bind(this)}
            projectGroupLists={projectGroupLists}
            handleShouldUpdateProjectGroupList={this.handleShouldUpdateProjectGroupList}
          />
        )}
      </div>
    )
  }

}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt, workbench, workbenchTaskDetail, workbenchFileDetail, workbenchDetailProcess, workbenchPublicDatas }) {
  const modelObj = {
    datas: { ...workbench['datas'], ...workbenchTaskDetail['datas'], ...workbenchFileDetail['datas'], ...workbenchDetailProcess['datas'], ...workbenchPublicDatas['datas'], ...gantt['datas']}
  }
  return { model: modelObj }
}
export default connect(mapStateToProps)(Gantt)

