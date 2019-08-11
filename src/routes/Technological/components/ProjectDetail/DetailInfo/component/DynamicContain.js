// 动态列表
import React, { Component } from 'react'
import DrawDetailInfoStyle from '../DrawDetailInfo.less'
import { connect } from 'dva'
import { Icon, Tooltip } from 'antd'
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
          style={{color: 'rgba(0,0,0,0.65)'}} 
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

      let jumpToMilestone = (
        <span 
          style={{color: '#1890FF', cursor: 'pointer', display: 'inline-block'}} 
          // onClick={ () => { this.goToMilestone({ board_id: messageValue.content.board.id, content: messageValue.content }) } }
        >{messageValue.content && messageValue.content.milestone && messageValue.content.milestone.name}</span>
      )

      let jumpToMeeting = (
        <span 
          style={{color: '#1890FF', cursor: 'pointer', display: 'inline-block'}} 
          // onClick={ () => { this.goToMilestone({ board_id: messageValue.content.board.id, content: messageValue.content }) } }
        >{messageValue.content && messageValue.content.meeting && messageValue.content.meeting.meetingName}</span>
      )

      switch (activity_type) {
        //项目 ----------------------------------------
        case 'board.create': // 创建项目
          contain = `创建${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建{currentNounPlanFilterName(PROJECTS)}「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.name': // 修改项目名称
          contain = `更新${currentNounPlanFilterName(PROJECTS)}信息`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了原项目名 「<span className={DrawDetailInfoStyle.news_name}>{messageValue.content.rela_data}</span>」为「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}名称。</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.description': // 修改项目详情
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了「{jumpToBoard}」看板的描述</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.archived': // 归档
          contain = `${currentNounPlanFilterName(PROJECTS)}归档`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 归档了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.quit': // 用户退出项目
          contain = `退出${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 退出了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.attach.upload': // 在流程上传文件
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
        case 'board.flow.cc.notice': // 在流程抄送通知
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
        case 'board.delete': // 删除项目
          contain = `删除${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 删除了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.add': // 项目中添加用户
          contain = `添加${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 邀请 「<span className={DrawDetailInfoStyle.news_name}>{messageValue.content.rela_users.join(',')}</span>」加入了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.content.link.add': // 关联内容添加
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 新增了关联内容「{messageValue.content.link_name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.content.link.remove': // 关联内容移除
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 移除了关联内容「{messageValue.content.link_name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.content.link.update': // 关联内容名称修改
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了关联内容「{messageValue.content.link_name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.app.add': // 添加项目功能

          break
        case 'board.update.contentprivilege': // 设置项目内容特权
            
          break
        case 'board.update.user.role': // 设置用户在项目的角色

          break
        // case 'board.card.update.executor.remove':
        case 'board.update.user.remove': // 用户被移出项目
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 将 「<span className={DrawDetailInfoStyle.news_name}>{ messageValue.content.rela_users && messageValue.content.rela_users.join(',')}</span>」 移出了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        // 任务 ----------------------------------------------------
        case 'board.card.create': // 创建任务
          messageContain = (
              <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
                <span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建了{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 
                <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
              </div>
           )
           contain = `创建${currentNounPlanFilterName(TASKS)}`
           break
        case 'board.card.update.archived': // 归档任务
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>归档了{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(TASKS)}归档`
          break
        case 'board.card.update.finish': // 任务标记完成
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>完成了{currentNounPlanFilterName(TASKS)}「{jumpToBoard}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.cancel.finish': // 取消完成
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>取消完成{currentNounPlanFilterName(TASKS)}「{jumpToBoard}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `取消完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.delete': // 删除任务
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>删除了{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.name': // 修改任务名称
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改卡片名称为{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.startTime': // 修改任务开始时间
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改了开始时间在{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.dutTime': // 修改任务结束时间
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改结束时间在{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.description': // 修改任务描述
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>修改了{currentNounPlanFilterName(TASKS)}描述「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.card.update.executor.add': // 添加执行人
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>把{currentNounPlanFilterName(TASKS)}指派给 {messageValue.content.rela_data && messageValue.content.rela_data.name}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `添加任${currentNounPlanFilterName(TASKS)}执行人`
          break
        case 'board.card.update.label.add': // 添加标签
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
        case 'board.card.update.label.remove': // 移除标签
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
        case 'board.card.update.finish.child': // 标记子任务完成
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>完成了子{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.cancel.finish.child': // 取消子任务完成
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span>取消完成子{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 </div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.executor.remove': // 移除执行人
          break
        case 'board.card.update.file.add': // 添加附件
          break
        case 'board.card.update.file.remove': // 移除附件
          break
        case 'board.card.update.contentprivilege': // 设置任务内容特权
          break
        case 'board.card.add.to.milestone': // 添加任务到里程碑
          break
        case 'board.card.remove.to.milestone': // 把任务从里程碑中移除
          break
        case 'board.card.list.group.add': // 新增分组
          break
        case 'board.card.list.group.remove': // 移除分组
          break
        case 'board.card.list.group.update.name': // 更新分组名
          break
        case 'board.card.list.group.update.contentprivilege': // 设置任务分组内容特权
          break
        // 评论 ---------------------------------------------
        case 'board.card.update.comment.add': // 添加任务评论
          break
        case 'board.card.update.comment.remove': // 移除任务评论
          break
        case 'board.file.comment.add': // 添加文件评论
          contain = `发表了一条${currentNounPlanFilterName(FILES)}的评论`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 发表了一条{currentNounPlanFilterName(FILES)}「{jumpToFile}」的评论</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.comment.remove': // 移除文件评论
          contain = `删除了一条${currentNounPlanFilterName(FILES)}的评论`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 删除了一条{currentNounPlanFilterName(FILES)}「{jumpToFile}」的评论</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.comment.add': // 添加流程评论
          contain = `发表了一条${currentNounPlanFilterName(FLOWS)}的评论`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 发表了一条{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」的评论</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.comment.remove': // 流程评论的删除
          contain = `删除了一条${currentNounPlanFilterName(FLOWS)}的评论`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 删除了一条{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」的评论</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.card.comment.at.notice': // 任务评论@通知
          break
        case 'board.file.comment.at.notice': // 文件评论@通知
          break
        // 流程 ----------------------------------------
        case 'board.flow.tpl.add.or.delete': // 创建或删除流程模板
          contain = `创建${currentNounPlanFilterName(FLOWS)}模板`
          break
        case 'board.flow.instance.initiate': // 启动流程
          contain = `启动了一个${currentNounPlanFilterName(FLOWS)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div>{messageValue.creator.name} 启动了一个{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.remove': // 删除
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 将「{messageValue.content.rela_users}」移出了「{jumpToBoard}」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.recall': // 流程撤回
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 撤回{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」节点「{messageValue.content.flow_node_instance.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reject': // 流程驳回
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 驳回{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」节点「{messageValue.content.flow_node_instance.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reassign': // 流程重新指审批人
          contain = '重新指派审批人'
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」节点「{messageValue.content.flow_node_instance.name}」中重新指定审批人 {messageValue.content.user.name}</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.attach.upload': // 流程附件上传
          contain = `${currentNounPlanFilterName(FLOWS)}文件上传`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」 上传了文件「{jumpToFile}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.pass': // 流程通过
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」 中完成了任务「{messageValue.content.flow_node_instance.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.instance.discontinue': // 中止流程
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
        case 'board.flow.instance.delete': // 删除流程
          break
        case 'board.flow.node.deadline.set': // 设置流程节点截止时间
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 在{currentNounPlanFilterName(FLOWS)}「{jumpToProcess}」设置了截止时间</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(FLOWS)}待处理任务通知`
          break
        case 'board.flow.update.contentprivilege': // 设置流程内容特权
          break
        case '"board.flow.instance.deadline.set': // 设置流程实例的截止时间
          break
        // 文件 ------------------------------------------------
        case 'board.folder.add': // 添加文件夹
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建了文件夹「{messageValue.content.board_folder.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          contain = `创建文件夹`
          break
        case 'board.file.upload': // 文件上传
          contain = `上传${currentNounPlanFilterName(FILES)}`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 上传了{currentNounPlanFilterName(FILES)}「{jumpToFile}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.version.upload': // 文件版本更新上传
          contain = `${currentNounPlanFilterName(FILES)}版本更新`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 更新了{currentNounPlanFilterName(FILES)}「{jumpToFile}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.folder.remove.recycle': // 文件夹移除到回收站
          contain = '移除文件夹到回收站'
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 移动文件夹「{messageValue.content.board_folder.name}」到回收站</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.remove.recycle': // 文件移除到回收站
          contain = `移除${currentNounPlanFilterName(FILES)}到回收站`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 移动{currentNounPlanFilterName(FILES)}「{jumpToFile}」到回收站</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.move.to.folder': // 移动文件
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
              <div>{messageValue.creator && messageValue.creator.name} 移动{currentNounPlanFilterName(FILES)}「{<Tooltip>
                <span className={DrawDetailInfoStyle.fileName} onClick={() => console.log('hello')}>{showList}</span></Tooltip>}」到文件夹「{messageValue.content.target_folder.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.copy.to.folder': // 复制文件
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
              <div>{messageValue.creator && messageValue.creator.name} 复制{currentNounPlanFilterName(FILES)}「{<Tooltip>
                <span className={DrawDetailInfoStyle.fileName} onClick={() => console.log('hello')}>{showCopyList}</span></Tooltip>}」到文件夹「{messageValue.content && messageValue.content.target_folder && messageValue.content.target_folder.name}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.update.contentprivilege': // 设置文件内容特权
          break
        case 'board.folder.update.contentprivilege': // 设置文件内容特权
          break
        case 'meeting.create': // 会议----------------------------
          contain = '创建会议'
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 发起了会议「{jumpToMeeting}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        // 里程碑 --------------------------------------------
        case 'board.milestone.add':
          contain = `创建里程碑`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 创建了里程碑「{jumpToMilestone}」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.milestone.upd':
          contain = `修改里程碑`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 修改了原里程碑名「{messageValue.content.rela_data}」为「{jumpToMilestone}」里程碑名称</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.milestone.principal.add': // 设置里程碑负责人
          contain = `设置了里程碑负责人`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 添加了里程碑负责人为「<span className={DrawDetailInfoStyle.news_name}>{messageValue.content.relaUser.name}</span>」</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.milestone.principal.remove': // 移除负责人
          break
        case 'board.milestone.content.add': // 添加内容到里程碑
          break    
        case 'board.milestone.content.remove': // 从里程碑当中移除内容
          break
        case 'board.milestone.comment.add': // 添加里程碑评论
          break
        case 'board.milestone.commetn.del': // 删除里程碑评论
          break
        case 'board.common.comment.add': // 添加里程碑的评论
          contain = `发表了一条里程碑的评论`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 发表了一条里程碑「{messageValue.content.relaContent && messageValue.content.relaContent.name}」的评论</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.common.comment.del':
          contain = `删除了一条里程碑的评论`
          messageContain = (
            <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
              <div><span className={DrawDetailInfoStyle.news_name}>{messageValue.creator.name}</span> 删除了一条里程碑「{jumpToMilestone}」的评论</div>
              <div className={DrawDetailInfoStyle.news_time}>{timestampToTime(messageValue.created)}</div>
            </div>
          )
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
        <div style={{display: 'flex'}}>
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
        <div style={{display: 'flex'}}>
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
        <div style={{display: 'flex'}}>
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
        <div style={{display: 'flex'}}>
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
        <div style={{display: 'flex'}}>
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

    // 里程碑动态
    const milestoneNews = (value) => {
      const { content = {}, action, org_id, creator} = value
      const { avatar } = creator
      const { board = {}, milestone = {} } = content
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div style={{display: 'flex'}}>
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

    // 会议动态
    const meetingNews = (value) => {
      const { content = {}, action, org_id, creator} = value
      const { avatar } = creator
      const { board = {}, metting = {} } = content
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div style={{display: 'flex'}}>
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
     const filterNewsType = (type, value, childrenKey) => {
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
        case '15':
          containner = (commentNews(value))
          break
        case '22':
          containner = (commentNews(value))
          break
        case '6':
          containner = ( processNews(value) )
          break
        case '18':
          containner = ( milestoneNews(value) )
          break
        case '20':
          containner = (meetingNews(value))
        case '23':
          containner = (commentNews(value))
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
              <li style={{marginBottom: '8'}} key={childrenKey}>{filterNewsType(rela_type, item, childrenKey)}</li>
            )
          }) : (
            <li style={{marginBottom: '8'}}>
              <div style={{margin: 'auto', textAlign: 'center'}}>
                <div style={{fontSize: 48, color: 'rgba(0,0,0,0.15)'}} className={`${globalStyles.authTheme}`}>&#xe683;</div>
                <span style={{color: 'rgba(217,217,217,1)'}}>暂无动态</span>
              </div>
            </li>
          )
        }
      </ul>
    )
  }
}
