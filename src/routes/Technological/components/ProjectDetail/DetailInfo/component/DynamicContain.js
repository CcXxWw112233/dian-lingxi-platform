// 动态列表
import React, { Component } from 'react'
import DrawDetailInfoStyle from '../DrawDetailInfo.less'
import { connect } from 'dva'
import { Icon } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import {currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermission, checkIsHasPermissionInBoard} from "@/utils/businessFunction";
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP, ORG_TEAM_BOARD_QUERY, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_INTERVIEW,
  PROJECT_FILES_FILE_INTERVIEW,
  PROJECT_FLOW_FLOW_ACCESS,
} from "@/globalset/js/constant";
import {newsDynamicHandleTime, timestampToTime, timestampToHM, timestampToTimeNormal2} from '@/utils/util'

@connect(({projectDetail: { datas: { projectDynamicsList = [], p_next_id } } }) => ({
  projectDynamicsList, p_next_id
}))
export default class DynamicContain extends Component {

  componentDidMount() {
    const { board_id } = this.props
    this.props.getDispatchDynamicList(board_id)
  }

  routingJump(path) {
    this.props.dispatch({
      type: 'projectDetail/routingJump',
      payload: {
        route: path
      }
    })
  }

  // 去到项目详情
  goToBoard({org_id, content}) {
    // console.log(checkIsHasPermission(ORG_TEAM_BOARD_QUERY, org_id), 'sss')
    if(!checkIsHasPermission(ORG_TEAM_BOARD_QUERY, org_id)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.routingJump(`/technological/projectDetail?board_id=${content && content.board && content.board.id}`)
  }

   // 去任务详情
   goToTask({board_id, content}) {
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW, board_id)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.routingJump(`/technological/projectDetail?board_id=${content && content.board && content.board.id}&appsSelectKey=3&card_id=${content && content.card && content.card.id}`)
  }

  // 去文件详情
  goToFile({board_id, content}) {
    if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW, board_id)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.routingJump(`/technological/projectDetail?board_id=${content && content.board && content.board.id}&appsSelectKey=4&file_id=${content && content.board_file && content.board_file.id}`)
  }

  // 去流程详情
  goToProcess({board_id, content}) {
    if(!checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS, board_id)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.routingJump(`/technological/projectDetail?board_id=${content && content.board && content.board.id}&appsSelectKey=2&flow_id=${content && content.flow_instance && content.flow_instance.id}`)
  }


  render() {
    const { projectDynamicsList } = this.props

    //过滤消息内容
    const filterTitleContain = (activity_type, messageValue) => {
      let contain = ''
      let messageContain = (<div></div>)
      let jumpToBoard = (
        <span 
          style={{color:'rgba(0,0,0,0.65)'}} 
          // onClick={ () => { this.goToBoard({org_id: messageValue.org_id, content: messageValue.content}) } }
        >{messageValue.content.board.name}</span>
      )
      let jumpToTask = (
        <span 
          style={{color: '#1890FF', cursor: 'pointer'}} 
          onClick={ () => { this.goToTask({board_id: messageValue.content.board.id, content: messageValue.content}) } }
        >{messageValue.content && messageValue.content.card && messageValue.content.card.name}</span>
      )

      let jumpToFile = (
        // <span style={{color: '#1890FF', cursor: 'pointer', maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'top'}} onClick={this.routingJump.bind(this, `/technological/projectDetail?board_id=${messageValue.content && messageValue.content.board && messageValue.content.board.id}&appsSelectKey=4&file_id=${messageValue.content && messageValue.content.board_file && messageValue.content.board_file.id}`)}>{messageValue.content && messageValue.content.board_file && messageValue.content.board_file.name}</span>
        <span 
          style={{color: '#1890FF', cursor: 'pointer', display: 'inline-block'}} 
          onClick={ () => { this.goToFile({ board_id: messageValue.content.board.id, content: messageValue.content}) } }
        >{messageValue.content && messageValue.content.board_file && messageValue.content.board_file.name}</span>
      )

      let jumpToProcess = (
        // <span style={{color: '#1890FF', cursor: 'pointer', maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'top'}} onClick={this.routingJump.bind(this, `/technological/projectDetail?board_id=${messageValue.content && messageValue.content.board && messageValue.content.board.id}&appsSelectKey=2&flow_id=${messageValue.content && messageValue.content.flow_instance && messageValue.content.flow_instance.id}`)}>{messageValue.content && messageValue.content.flow_instance && messageValue.content.flow_instance.name}</span>
        <span 
          style={{color: '#1890FF', cursor: 'pointer', display: 'inline-block'}} 
          onClick={ () => { this.goToProcess({ board_id: messageValue.content.board.id, content: messageValue.content }) } }
        >{messageValue.content && messageValue.content.flow_instance && messageValue.content.flow_instance.name}</span>
      )

      switch (activity_type) {
        //项目 ----------------------------------------
        case 'board.create':
          contain = `创建${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建{currentNounPlanFilterName(PROJECTS)}「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.name':
          contain = `更新${currentNounPlanFilterName(PROJECTS)}信息`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了原项目名 「{messageValue.content.rela_data}」为「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}名称。</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.description':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了项目描述 为「{jumpToBoard}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.archived':
          contain = `${currentNounPlanFilterName(PROJECTS)}归档`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 归档了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.quit':
          contain = `退出${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 退出了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.attach.upload':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在流程【{jumpToProcess}】上传了文件「{<span style={{color: '#1890FF', cursor: 'pointer'}} 
              onClick={() => this.props.dispatch({
                type: 'newsDynamic/routingJump',
                payload: {
                  route: `/technological/projectDetail?board_id=${messageValue.content.board.id}&appsSelectKey=4&file_id=${messageValue.content.rela_data.id}`
                }
              })}>{messageValue.content && messageValue.content.rela_data && messageValue.content.rela_data.name}</span>}」#{jumpToBoard} #{jumpToProcess} #{messageValue.content.flow_node_instance.name}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.cc.notice':
            messageContain = (
              <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
                <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在流程「{<span style={{color: '#1890FF', cursor: 'pointer'}} 
                onClick={() => this.props.dispatch({
                  type: 'newsDynamic/routingJump',
                  payload: {
                    route: `/technological/projectDetail?board_id=${messageValue.content.board.id}&appsSelectKey=2&flow_id=${messageValue.content.flowInstance.id}`
                  }
                })}>{messageValue.content && messageValue.content.flowInstance && messageValue.content.flowInstance.name}</span>}」中 {messageValue.title}</div>
                <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
              </div>
            )
          break
        case 'board.delete':
          contain = `删除${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 删除了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.add':
          contain = `添加${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 邀请 「<span className={DrawDetailInfoStyle.news_name}>{messageValue.content.rela_users}</span>」加入了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.content.link.add':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 新增了关联内容「{messageValue.content.link_name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.content.link.remove':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 移除了关联内容「{messageValue.content.link_name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.content.link.update':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了关联内容「{messageValue.content.link_name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.card.update.executor.remove':
          // console.log({messageValue})
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 将 「{ messageValue.content.rela_data && messageValue.content.rela_data.name}」 移出了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        // 任务 ----------------------------------------------------
        case 'board.card.create':
          messageContain = (
              <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
                <span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建了{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 
                <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
              </div>
           )
           contain = `创建${currentNounPlanFilterName(TASKS)}`
           break;
        case 'createChildCard':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>创建了子{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `创建子${currentNounPlanFilterName(TASKS)}`
          break
        case 'updCard':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>更新了{currentNounPlanFilterName(TASKS)}信息「{jumpToTask}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `更新${currentNounPlanFilterName(TASKS)}信息`
          break
        case 'board.card.update.archived':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>归档了{currentNounPlanFilterName(TASKS)}「{jumpToBoard}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(TASKS)}归档`
          break
        case 'board.card.update.finish':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>完成了{currentNounPlanFilterName(TASKS)}「{jumpToBoard}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.cancel.finish':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>取消完成{currentNounPlanFilterName(TASKS)}「{jumpToBoard}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `取消完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.delete':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>删除了{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.name':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改卡片名称为{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.startTime':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改了开始时间在{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.dutTime':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改结束时间在{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.description':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改了{currentNounPlanFilterName(TASKS)}描述「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.card.update.executor.add':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>把{currentNounPlanFilterName(TASKS)}指派给 {messageValue.content.rela_data && messageValue.content.rela_data.name}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `添加任${currentNounPlanFilterName(TASKS)}执行人`
          break
        case 'board.card.update.label.add':
        if(messageValue.content.rela_data !==undefined) {
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>添加了标签「{messageValue.content.rela_data.name}」「{jumpToTask}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
        } else {
          messageContain = (<div></div>)
        }

          contain = `添加${currentNounPlanFilterName(TASKS)}标签`
          break
        case 'board.card.update.label.remove':
          if(messageValue.content.rela_data !==undefined) {
            messageContain = (
              <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
                <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>删除了标签「{messageValue.content.rela_data.name}」「{jumpToTask}」</div>
                <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
              </div>
            )
            } else {
              messageContain = (<div></div>)
            }
          contain = `移除${currentNounPlanFilterName(TASKS)}标签`
          break
        case 'createLabel':
          contain = '添加标签'
          break
        case 'updLabel':
          contain = '更新标签信息'
          break
        // 评论 ---------------------------------------
        case 'addComment':
          contain = '新评论'
          break
        case 'deleteComment':
          contain = '删除评论'
        // 流程 ----------------------------------------
        case 'createWrokflowTpl':
          contain = `创建${currentNounPlanFilterName(FLOWS)}模板`
          break
        case 'board.flow.instance.initiate':
          contain = `启动${currentNounPlanFilterName(FLOWS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div>{messageValue.creator.name} 启动{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.remove':
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 将「{messageValue.content.rela_users}」移出了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}。</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.recall':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 撤回{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」节点「{messageValue.content.flow_node_instance.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reject':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 驳回{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」节点「{messageValue.content.flow_node_instance.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reassign':
          contain = '重新指派审批人'
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」节点「{messageValue.content.flow_node_instance.name}」中重新指定审批人 {messageValue.content.user.name}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'uploadWorkflowFile':
          contain = `${currentNounPlanFilterName(FLOWS)}文件上传`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」 上传了文件「{jumpToFile}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.pass':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」 中完成了任务「{messageValue.content.flow_node_instance.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.instance.discontinue':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」中 中止了流程</div> 
              {/* 「{messageValue.content.flow_node_instance.name}」 */}
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'waitingWorkflowTaskNotice':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div>您有一个{currentNounPlanFilterName(FLOWS)}任务待处理</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(FLOWS)}待处理任务通知`
          break
        // 文件 ------------------------------------------------
        case 'board.folder.add':
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建了文件夹「{messageValue.content.board_folder.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `创建文件夹`
          break
        case 'updFolder':
          contain = `更新文件夹`
          break
        case 'board.file.upload':
          contain = `上传${currentNounPlanFilterName(FILES)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 上传了{currentNounPlanFilterName(FILES)}「{jumpToFile}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.version.upload':
          contain = `${currentNounPlanFilterName(FILES)}版本更新`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 更新了{currentNounPlanFilterName(FILES)}「{jumpToFile}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.folder.remove.recycle':
          contain = '移除文件夹到回收站'
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 移动文件夹「{messageValue.content.board_folder.name}」到回收站</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.remove.recycle':
          contain = `移除${currentNounPlanFilterName(FILES)}到回收站`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 移动{currentNounPlanFilterName(FILES)}「{jumpToFile}」到回收站</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.move.to.folder':
          contain = `移动${currentNounPlanFilterName(FILES)}到某个文件夹中`
          let showList = []
          let hideList = []
          messageValue.content.board_file_list.forEach((item, i) => {
            if(i>=1){
              hideList.push([<span>{item.fileName}</span>, <br />])
            } else {
              showList.push(item.fileName)
            }
          })
          if(messageValue.content.board_file_list.length > 1){
            showList.push('...')
          }

          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div>{messageValue.creator && messageValue.creator.name} 移动{currentNounPlanFilterName(FILES)}「{<Tooltip title={<div>{hideList}</div>}>
                <span className={styles.fileName} onClick={() => console.log('hello')}>{showList}</span></Tooltip>}」到文件夹「{messageValue.content.target_folder.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.copy.to.folder':
          contain = `复制${currentNounPlanFilterName(FILES)}到某个文件夹中`
          let showCopyList = []
          let hideCopyList = []
          messageValue.content.board_file_list.forEach((item, i) => {
            if(i>=1){
              hideCopyList.push([<span>{item.fileName}</span>, <br />])
            } else {
              showCopyList.push(item.fileName)
            }
          })
          if(messageValue.content && messageValue.content.board_file_list.length > 1){
            showCopyList.push('...')
          }
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div>{messageValue.creator && messageValue.creator.name} 复制{currentNounPlanFilterName(FILES)}「{<Tooltip title={<div>{hideCopyList}</div>}>
                <span className={styles.fileName} onClick={() => console.log('hello')}>{showCopyList}</span></Tooltip>}」到文件夹「{messageValue.content && messageValue.content.target_folder && messageValue.content.target_folder.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'restoreFile':
          contain = `还原${currentNounPlanFilterName(FILES)}`
          break
        case 'restoreFolder':
          contain = '还原文件夹'
        case 'board.milestone.add':
          break    
        default:
          break;
      }
      return { contain, messageContain }
    }

    // 项目动态
    const projectNews = (value) => {
      const { content = {}, org_id, action, creator} = value
      const { avatar } = creator
      const { board = {}, card = {}, lists = {} } = content
      const list_name = lists['name']
      const board_name = board['name']
      return (
        <div style={{display:'flex'}}>
            <div className={DrawDetailInfoStyle.left}>
             {
               avatar ? (
                 <img src={avatar} />
               ) : (
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 5}}/>
                </div>
               )
             }
            </div>
            <div className={DrawDetailInfoStyle.right}>
              {filterTitleContain(action, value).messageContain}
            </div>
        </div>
      )
    }

    //任务动态
    const taskNews = (value) =>{
      const { content = {}, org_id, action, creator} = value
      const { avatar } = creator
      const { board = {}, card = {}, lists = {} } = content
      const card_name = card['name']
      const card_id = card['id']
      const list_name = lists['name']
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div style={{display:'flex'}}>
            <div className={DrawDetailInfoStyle.left}>
             {
               avatar ? (
                 <img src={avatar} />
               ) : (
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 5}}/>
                </div>
               )
             }
            </div>
            <div className={DrawDetailInfoStyle.right}>
              {filterTitleContain(action, value).messageContain}
            </div>
        </div>
      )
    }

    // 评论动态
    const commentNews = (value) => {
      const { content = {}, org_id, action, creator} = value
      const { avatar } = creator
      const { board = {}, card = {}, lists = {} } = content
      const list_name = lists['name']
      const board_name = board['name']
      return (
        <div style={{display:'flex'}}>
            <div className={DrawDetailInfoStyle.left}>
             {
               avatar ? (
                 <img src={avatar} />
               ) : (
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 5}}/>
                </div>
               )
             }
            </div>
            <div className={DrawDetailInfoStyle.right}>
              {filterTitleContain(action, value).messageContain}
            </div>
        </div>
      )
    }

    // 流程动态
    const processNews = (value) => {
      const { content = {}, action, org_id, creator} = value
      const { avatar } = creator
      const { board = {}, flow_instance = {} } = content
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div style={{display:'flex'}}>
            <div className={DrawDetailInfoStyle.left}>
             {
               avatar ? (
                 <img src={avatar} />
               ) : (
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 5}}/>
                </div>
               )
             }
            </div>
            <div className={DrawDetailInfoStyle.right}>
              {filterTitleContain(action, value).messageContain}
            </div>
        </div>
      )
    }

    // 文件动态
    const fileNews = (value) => {
      const { content = {}, action, org_id, creator} = value
      const { avatar } = creator
      const { board = {}, flow_instance = {} } = content
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div style={{display:'flex'}}>
            <div className={DrawDetailInfoStyle.left}>
             {
               avatar ? (
                 <img src={avatar} />
               ) : (
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 5}}/>
                </div>
               )
             }
            </div>
            <div className={DrawDetailInfoStyle.right}>
              {filterTitleContain(action, value).messageContain}
            </div>
        </div>
      )
    }



     //具体详细信息
     const filterNewsType = (type, value,childrenKey) => {
      //  console.log(type, value, 'ssssss')
      let containner = (<div></div>)
      switch (type) {
        case '10':
          containner = ( projectNews(value) )
          break
        case '11':
          containner = ( taskNews(value) )
          break
        case '12':
            containner = ( processNews(value) )
            break
          case '13':
            containner = ( fileNews(value) )
            break
          case '14':
            containner = ( commentNews(value) )
            break
          case '6':
            containner = ( processNews(value) )
            break
        default:
          break
      }
      return containner
    }

    return (
      <ul>   
        {
          projectDynamicsList && projectDynamicsList.length ? projectDynamicsList.map((item, childrenKey) => {
            const { rela_type } = item
            return (
              <li key={childrenKey}>{filterNewsType(rela_type, item, childrenKey)}</li>
            )
          }) : (
            <li>
              <div style={{margin: 'auto', textAlign: 'center'}}>
                <div style={{fontSize: 48, color: 'rgba(0,0,0,0.15)'}} className={`${globalStyles.authTheme}`}>&#xe683;</div>
                <span style={{color: 'rgba(217,217,217,1)'}}>暂无动态</span>
              </div>
            </li>
          )
        }
        {/* <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li> */}
      </ul>
    )
  }
}
