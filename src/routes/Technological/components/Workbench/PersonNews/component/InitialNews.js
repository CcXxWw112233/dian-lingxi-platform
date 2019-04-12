import React from 'react';
import { Card, Icon, Input, Tooltip } from 'antd'
import NewsListStyle from './NewsList.less'
import styles from './index.css'
import QueueAnim from 'rc-queue-anim'
import {newsDynamicHandleTime, timestampToTime, timestampToTimeNormal2} from '../../../../../../utils/util'
// import Comment from './Comment'
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP} from "../../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../../utils/businessFunction";

export default class InitialNews extends React.Component {
  allSetReaded() { //全部标记为已读

  }
  getNewsDynamicListNext(next_id) {
    this.props.getNewsDynamicList(next_id)
  }
  updateNewsDynamic() {
    this.props.updateDatas({
      isHasNewDynamic: false
    })
    this.props.getNewsDynamicList('0')
  }

  render() {
    
    const { datas: { newsDynamicList = [], next_id, isHasMore = true, isHasNewDynamic }} = this.props.model
    console.log('this is issues model ---->>>', this.props.model.datas  )
    //过滤消息内容
    const filterTitleContain = (activity_type, messageValue) => {
      let contain = ''
      let messageContain = (<div></div>)
      let jump = (
        <span>{messageValue.content.board.name}</span>
      )

      switch (activity_type) {
        //项目
        case 'board.create':
          contain = `创建${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 创建{currentNounPlanFilterName(PROJECTS)}「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.name':
          contain = `更新${currentNounPlanFilterName(PROJECTS)}信息`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 修改了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}名称。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.archived':
          contain = `${currentNounPlanFilterName(PROJECTS)}归档`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 归档了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.quit':
          contain = `退出${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 退出了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.attach.upload':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 在流程【{messageValue.content.flow_instance.name}】上传了文件【{messageValue.content.rela_data}】#{messageValue.content.board.name} #{messageValue.content.flow_instance.name} #{messageValue.content.flow_node_instance.name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.delete':
          contain = `删除${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 删除了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.add':
          contain = `添加${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 邀请「{messageValue.content.rela_users}」加入了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.card.update.executor.remove':
          console.log({messageValue})
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 将 「{ messageValue.content.rela_data && messageValue.content.rela_data.name}」 移出了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        //任务
        case 'board.card.create':
          messageContain = (
           <div className={NewsListStyle.news_3}>
             <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 创建了{currentNounPlanFilterName(TASKS)}</div>
             <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
             <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
             <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
             <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
          </div>
          )
          contain = `创建${currentNounPlanFilterName(TASKS)}`
          break
        case 'createChildCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 创建了子{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `创建子${currentNounPlanFilterName(TASKS)}`
          break
        case 'updCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 更新了{currentNounPlanFilterName(TASKS)}信息</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `更新${currentNounPlanFilterName(TASKS)}信息`
          break
        case 'board.card.update.archived':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 归档了{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(TASKS)}归档`
          break
        case 'board.card.update.finish':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 完成了{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.cancel.finish':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 取消完成{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `取消完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.delete':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 删除了{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.executor.add':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 把{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_text}>指派给 {messageValue.content.rela_data && messageValue.content.rela_data.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `添加任${currentNounPlanFilterName(TASKS)}执行人`
          break
        case 'board.card.update.label.add':
        if(messageValue.content.rela_data !==undefined) {
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 添加了标签「{messageValue.content.rela_data.name}」</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
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
              <div className={NewsListStyle.news_3}>
                <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 删除了标签「{messageValue.content.rela_data.name}」</div>
                <div className={NewsListStyle.news_3_card}>{messageValue.content.card.name}</div>
                <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.content.board.name}</div>
                <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name?messageValue.list_name:'无'}</div>
                <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
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
        //评论
        case 'addComment':
          contain = '新评论'
          break
        case 'deleteComment':
          contain = '删除评论'
          break
        //流程
        case 'createWrokflowTpl':
          contain = `创建${currentNounPlanFilterName(FLOWS)}模板`
          break
        case 'board.flow.instance.initiate':
          contain = `启动${currentNounPlanFilterName(FLOWS)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 启动{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.update.user.remove':
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 将「{messageValue.content.rela_users}」移出了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.recall':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 撤回{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」节点「{messageValue.content.flow_node_instance.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reject':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 撤回{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」节点「{messageValue.content.flow_node_instance.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reassign':
          contain = '重新指派审批人'
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」节点「{messageValue.content.flow_node_instance.name}」中重新指定审批人 {messageValue.content.user.name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'uploadWorkflowFile':
          contain = `${currentNounPlanFilterName(FLOWS)}文件上传`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」 上传了文件「{messageValue.content.board_file.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.pass':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」 中完成了任务「{messageValue.content.flow_node_instance.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'waitingWorkflowTaskNotice':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>您有一个{currentNounPlanFilterName(FLOWS)}任务待处理</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(FLOWS)}待处理任务通知`
          break
        //文档
        case 'board.folder.add':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 创建了文件夹「{messageValue.content.board_folder.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
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
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 上传了{currentNounPlanFilterName(FILES)}「{messageValue.content.board_file.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.version.upload':
          contain = `${currentNounPlanFilterName(FILES)}版本更新`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 更新了{currentNounPlanFilterName(FILES)}「{messageValue.content.board_file.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.folder.remove.recycle':
          contain = '移除文件夹到回收站'
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 移动文件夹「{messageValue.content.board_folder.name}」到回收站</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.remove.recycle':
          contain = `移除${currentNounPlanFilterName(FILES)}到回收站`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 移动{currentNounPlanFilterName(FILES)}「{messageValue.content.board_file.name}」到回收站</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.move.to.folder':
          contain = `移动${currentNounPlanFilterName(FILES)}到某个文件夹中`
          let showList = []
          let hideList = []
          messageValue.content.board_file_list.forEach((item, i) => {
            if(i>=1){
              hideList.push([<span>{item.fileName}</span>,<br />])
            } else {
              showList.push(item.fileName)
            }
          })
          if(messageValue.content.board_file_list.length > 1){
            showList.push('...')
          }

          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator && messageValue.creator.name} 移动{currentNounPlanFilterName(FILES)}「{<Tooltip title={<div>{hideList}</div>}>
                <span className={styles.fileName} onClick={() => console.log('hello')}>{showList}</span></Tooltip>}」到文件夹「{messageValue.content.target_folder.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.copy.to.folder':
          contain = `复制${currentNounPlanFilterName(FILES)}到某个文件夹中`
          let showCopyList = []
          let hideCopyList = []
          messageValue.content.board_file_list.forEach((item, i) => {
            if(i>=1){
              hideCopyList.push([<span>{item.fileName}</span>,<br />])
            } else {
              showCopyList.push(item.fileName)
            }
          })
          if(messageValue.content && messageValue.content.board_file_list.length > 1){
            showCopyList.push('...')
          }
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator && messageValue.creator.name} 复制{currentNounPlanFilterName(FILES)}「{<Tooltip title={<div>{hideCopyList}</div>}>
                <span className={styles.fileName} onClick={() => console.log('hello')}>{showCopyList}</span></Tooltip>}」到文件夹「{messageValue.content && messageValue.content.target_folder && messageValue.content.target_folder.name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.created)}</div>
            </div>
          )
          break
        case 'restoreFile':
          contain = `还原${currentNounPlanFilterName(FILES)}`
          break
        case 'restoreFolder':
          contain = '还原文件夹'
          break
        default:
          break
      }
      return { contain, messageContain }
    }
    //项目动态
    const projectNews = (value) => {
      const { action } = value
      return (
        <div className={NewsListStyle.news_1}>{filterTitleContain(action, value).messageContain}</div>
      )
    }
    //任务动态
    const taskNews = (value) =>{
      return (
        <div className={NewsListStyle.containr}>
          {value.map((val, key) => {
            const { action} = val
            return(
              <div className={NewsListStyle.news_1} key={key}>{filterTitleContain(action, val).messageContain}</div>
            )
          })}
        </div>
      )
    }
    //评论动态
    const commentNews = (value, parentKey, childrenKey) => {
      const { content = {}} = value[0]
      const { board = {}, card = {}, card_list = {} } = content
      const card_name = card['name']
      const card_id = card['id']
      const list_name = card_list['name']
      const board_name = board['name']
      const board_id = board['id']

      return (
        <div className={NewsListStyle.containr}>
          {value.map((val, key) => {
            const { action } = val
            return(
              <div className={NewsListStyle.news_3} key={key}>
                <div className={NewsListStyle.news_3_text}> {val.creator.name} 评论了{currentNounPlanFilterName(TASKS)}</div>
                <div className={NewsListStyle.news_3_card}>{val.content.card.name}</div>
                <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：#{val.content.board.name}</div>
                <div className={NewsListStyle.news_3_group}>分组：{val.list_name?val.list_name:'无'}</div>
                <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(val.created)}</div>
              </div>
            )
          })}
        </div>
      )
    }
    //流程动态
    const processNews = (value) => {
      const { action } = value
      return (
        <div className={NewsListStyle.news_1} >{filterTitleContain(action, value).messageContain}</div>
      )
    }
    //文档动态
    const fileNews = (value, key) => {
      const { action } = value
      return (
        <div className={NewsListStyle.news_1}>{filterTitleContain(action, value).messageContain}</div>
      )
    }

    //@评论动态
    const commentNews_2 = (value, parentKey, childrenKey) => {
      return (
        <div className={NewsListStyle.containr}>
          {value.map((val, key) => {
            const { creator} = val
            return(
              <div className={NewsListStyle.news_3} key={key}>
                {/*<div className={NewsListStyle.news_3_text}> {creator.name} {text} {activity_type == 'cardCommentAt' && currentNounPlanFilterName(TASKS)}</div>*/}
                {/*<div className={NewsListStyle.news_3_card}>{card_name || file_name}</div>*/}
                {/*<div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：#{board_name}</div>*/}
                {/*{activity_type == 'cardCommentAt' && <div className={NewsListStyle.news_3_group}>分组：{list_name}</div>}*/}
                {/*<div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(val.created)}</div>*/}
              </div>
            )
          })}
        </div>
      )
    }

    //具体详细信息
    const filterNewsType = (type, value, parentKey, childrenKey) => {
      let containner = (<div></div>)
      switch (type) {
        case '10':
          containner = ( value.map((val, key) => (<div key={key}>{projectNews(val)}</div>)) )
          break
        case '11':
          containner = ( taskNews(value) )
          break
        case '12':
          containner = ( value.map((val, key) => (<div key={key}>{processNews(val)}</div>)) )
          break
        case '13':
          containner = ( value.map((val, key) => (<div key={key}>{fileNews(val)}</div>)) )
          break
        case '14':
          containner = ( commentNews(value, parentKey, childrenKey))
          break
        case '6':
          containner = ( value.map((val, key) => (<div key={key}>{processNews(val)}</div>)) )
          break
        case '8':
          containner = ( commentNews_2(value, parentKey, childrenKey))
          break
        default:
          break
      }
      return containner
    }

    return (
      <div style={{paddingBottom: 100, transform: 'none', display: 'inline'}} >
        {/*{isHasNewDynamic?(*/}
          {/*<div className={NewsListStyle.newsConfirm} onClick={this.updateNewsDynamic.bind(this)}>您有新消息，点击更新查看</div>*/}
        {/*): ('')}*/}
        {newsDynamicList.map((value, parentkey)=> {
          const { date, dataList = [], newDataList = []} = value
          return (
            <div className={NewsListStyle.itemOut} key={parentkey}>
              {newDataList.map((value, childrenKey) => {
                const { rela_type, TypeArrayList = [] } = value
                return (
                  <div key={childrenKey}>{filterNewsType(rela_type, TypeArrayList, parentkey, childrenKey)}</div>
                )
              })}
            </div>
          )
        })}
        {/*<div style={{marginBottom: 20,maxWidth: 770, minWidth: 600}}>*/}
          {/*{isHasMore?(*/}
            {/*<div onClick={this.getNewsDynamicListNext.bind(this,next_id)} style={{height: 30,maxWidth: 770, minWidth: 600, margin: '0 auto',lineHeight: '30px', textAlign: 'center', backgroundColor: '#e5e5e5',borderRadius: 4,marginTop: 20, cursor: 'pointer'}}>点击加载更多<Icon type="arrow-down" theme="outlined" /></div>*/}
          {/*):(*/}
            {/*<div  style={{height: 30,maxWidth: 770, minWidth: 600,  margin: '0 auto',lineHeight: '30px', textAlign: 'center',marginTop: 20,color: '#8c8c8c'}}>没有更多了...</div>*/}
          {/*)}*/}
        {/*</div>*/}
      </div>
    )
  }
}




