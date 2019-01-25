import React from 'react';
import { Card, Icon, Input } from 'antd'
import NewsListStyle from './NewsList.less'
import QueueAnim from  'rc-queue-anim'
import {newsDynamicHandleTime, timestampToTime, timestampToTimeNormal2} from '../../../../../../utils/util'
// import Comment from './Comment'
import {ORGANIZATION,TASKS,FLOWS,DASHBOARD,PROJECTS,FILES,MEMBERS,CATCH_UP} from "../../../../../../globalset/js/constant";
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

    //过滤消息内容
    const   filterTitleContain = (activity_type, messageValue) => {
      let contain = ''
      let messageContain = (<div></div>)
      switch (activity_type) {
        //项目
        case 'createBoard':
          contain = `创建${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (<div>{messageValue.user_name} 创建{currentNounPlanFilterName(PROJECTS)}「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>)
          break
        case 'updBoard':
          contain = `更新${currentNounPlanFilterName(PROJECTS)}信息`
          messageContain = (<div>{messageValue.user_name} 更新了「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}信息</div>)
          break
        case 'archivedBoard':
          contain = `${currentNounPlanFilterName(PROJECTS)}归档`
          messageContain = (<div>{messageValue.user_name} 归档了「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>)
          break
        case 'quitBoard':
          contain = `退出${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (<div>{messageValue.user_name} 退出了「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>)
          break
        case 'delBoard':
          contain = `删除${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (<div>{messageValue.user_name} 删除了「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>)
          break
        case 'addBoardUser':
          contain = `添加${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (<div>{messageValue.user_name} 邀请{messageValue.member}加入了「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>)
          break
        case 'removeBoardUser':
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (<div>{messageValue.user_name} 将{messageValue.removed_user_name}移出了「<span style={{color: '#1890FF',cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}</div>)
          break
        //任务
        case 'createCard':
          messageContain = (
           <div className={NewsListStyle.news_3}>
             <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 创建了{currentNounPlanFilterName(TASKS)}</div>
             <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
             <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
             <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
             <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
          </div>
          )
          contain = `创建${currentNounPlanFilterName(TASKS)}`
          break
        case 'createChildCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 创建了子{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `创建子${currentNounPlanFilterName(TASKS)}`
          break
        case 'updCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 更新了{currentNounPlanFilterName(TASKS)}信息</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `更新${currentNounPlanFilterName(TASKS)}信息`
          break
        case 'archivedCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 归档了{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(TASKS)}归档`
          break
        case 'realizeCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 完成了{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'cancelRealizeCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 取消完成{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `取消完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'delCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 删除了{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'addCardUser':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 把{currentNounPlanFilterName(TASKS)}</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_text}>执行人指派给 {messageValue.map.full_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `添加任${currentNounPlanFilterName(TASKS)}执行人`
          break
        case 'addCardLabel':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 添加了标签「{messageValue.label_name}」</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `添加${currentNounPlanFilterName(TASKS)}标签`
          break
        case 'removeCardLabel':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 删除了标签「{messageValue.label_name}」</div>
              <div className={NewsListStyle.news_3_card}>{messageValue.card_name}</div>
              <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：# {messageValue.board_name}</div>
              <div className={NewsListStyle.news_3_group}>分组：{messageValue.list_name}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
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
        case 'startWorkflow':
          contain = `启动${currentNounPlanFilterName(FLOWS)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 启动{currentNounPlanFilterName(FLOWS)}「{messageValue.flow_instance_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'recallWorkflowTask':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 撤回{currentNounPlanFilterName(FLOWS)}「{messageValue.flow_instance_name}」节点「{messageValue.flow_node_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'reassignAssignee':
          contain = '重新指派审批人'
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.flow_instance_name}」节点「{messageValue.flow_node_name}」中重新指定审批人 {messageValue.assignee}</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'uploadWorkflowFile':
          contain = `${currentNounPlanFilterName(FLOWS)}文件上传`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.flow_instance_name}」 上传了文件「{messageValue.file_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'completeWorkflowTask':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.flow_instance_name}」 中完成了任务「{messageValue.flow_node_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'waitingWorkflowTaskNotice':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>您有一个{currentNounPlanFilterName(FLOWS)}任务待处理</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(FLOWS)}待处理任务通知`
          break
        //文档
        case 'createFolder':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 创建了文件夹「{messageValue.folder_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `创建文件夹`
          break
        case 'updFolder':
          contain = `更新文件夹`
          break
        case 'uploadFile':
          contain = `上传${currentNounPlanFilterName(FILES)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 上传了{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'updVersionFile':
          contain = `${currentNounPlanFilterName(FILES)}版本更新`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 更新了{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'removeFolder':
          contain = '移除文件夹到回收站'
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 移动文件夹「{messageValue.folder_name}」到回收站</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'removeFile':
          contain = `移除${currentNounPlanFilterName(FILES)}到回收站`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 移动{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」到回收站</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'removeFileToOtherFolder':
          contain = `移动${currentNounPlanFilterName(FILES)}到某个文件夹中`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 移动{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」到文件夹「{messageValue.folder_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'copyFileToOtherFolder':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 复制{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」到文件夹「{messageValue.folder_name}」</div>
              <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `复制${currentNounPlanFilterName(FILES)}到某个文件夹中`
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
      const { map: { activity_type, full_name, create_time }} = value
      return (
        <div className={NewsListStyle.news_1}>{filterTitleContain(activity_type,value).messageContain}</div>
      )
    }
    //任务动态
    const taskNews = (value) =>{
      return (
        <div className={NewsListStyle.containr}>
          {value.map((val, key) => {
            const { map: { activity_type }} = val
            return(
              <div className={NewsListStyle.news_1} key={key}>{filterTitleContain(activity_type,val).messageContain}</div>
            )
          })}
        </div>
      )
    }
    //评论动态
    const commentNews = (value,parentKey, childrenKey) => {
      const {  list_name, board_name, card_name, cardComment, user_name} = value[0]
      if(!cardComment) {
        return false
      }
      const  { card_id } = cardComment
      return (
        <div className={NewsListStyle.containr}>
          {value.map((val, key) => {
            const { map: { activity_type }} = val
            return(
              <div className={NewsListStyle.news_3}>
                <div className={NewsListStyle.news_3_text}> {val.user_name} 评论了{currentNounPlanFilterName(TASKS)}</div>
                <div className={NewsListStyle.news_3_card}>{val.card_name}</div>
                <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：#{val.board_name}</div>
                <div className={NewsListStyle.news_3_group}>分组：{val.list_name}</div>
                <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(val.map.create_time)}</div>
              </div>
            )
          })}
        </div>
      )
    }
    //流程动态
    const processNews = (value) => {
      const { map: { activity_type, full_name, create_time}, flow_instance_name, board_name} = value
      return (
        <div className={NewsListStyle.news_1}>{filterTitleContain(activity_type,value).messageContain}</div>
      )
    }
    //文档动态
    const fileNews = (value, key) => {
      const { map: { activity_type, full_name, create_time }, board_name} = value
      return (
        <div className={NewsListStyle.news_1}>{filterTitleContain(activity_type,value).messageContain}</div>
      )
    }

    //@评论动态
    const commentNews_2 = (value,parentKey, childrenKey) => {
      return (
        <div className={NewsListStyle.containr}>
          {value.map((val, key) => {
            const { map: { activity_type }, text, user_name, card_name, file_name,list_name, board_name} = val
            return(
              <div className={NewsListStyle.news_3}>
                <div className={NewsListStyle.news_3_text}> {user_name} {text} {activity_type == 'cardCommentAt' && currentNounPlanFilterName(TASKS)}</div>
                <div className={NewsListStyle.news_3_card}>{card_name || file_name}</div>
                <div className={NewsListStyle.news_3_project}>{currentNounPlanFilterName(PROJECTS)}：#{board_name}</div>
                {activity_type == 'cardCommentAt' && <div className={NewsListStyle.news_3_group}>分组：{list_name}</div>}
                <div className={NewsListStyle.news_3_time}>{timestampToTimeNormal2(val.map.create_time)}</div>
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
        case  '1':
          containner = ( value.map((val, key) => (<div>{projectNews(val)}</div>)) )
          break
        case  '2':
          containner =  ( taskNews(value) )
          break
        case  '3':
          containner = ( commentNews(value,parentKey, childrenKey))
          break
        case  '4':
          containner = ( value.map((val, key) => (<div>{processNews(val)}</div>)) )
          break
        case  '5':
          containner = ( value.map((val, key) => (<div>{fileNews(val)}</div>)) )
          break
        case  '6':
          containner = ( value.map((val, key) => (<div>{processNews(val)}</div>)) )
          break
        case  '8':
          containner = ( commentNews_2(value,parentKey, childrenKey))
          break
        default:
          break
      }
      return containner
    }

    return (
      <div style={{paddingBottom:100, transform: 'none', display:'inline'}} >
        {/*{isHasNewDynamic?(*/}
          {/*<div className={NewsListStyle.newsConfirm} onClick={this.updateNewsDynamic.bind(this)}>您有新消息，点击更新查看</div>*/}
        {/*): ('')}*/}
        {newsDynamicList.map((value, parentkey)=> {
          const { date, dataList = [], newDataList = []} = value
          return (
            <div className={NewsListStyle.itemOut}  key={parentkey}>
              {newDataList.map((value, childrenKey) => {
                const { type, TypeArrayList = [] } = value
                return (
                  <div key={childrenKey}>{filterNewsType(type, TypeArrayList,parentkey, childrenKey)}</div>
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




