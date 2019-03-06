import React from 'react';
import { Card, Icon, Input } from 'antd'
import NewsListStyle from './NewsList.less'
import QueueAnim from 'rc-queue-anim'
import {newsDynamicHandleTime, timestampToTime, timestampToHM} from '../../../../utils/util'
import Comment from './Comment'
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP} from "../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../utils/businessFunction";

export default class NewsListNewDatas extends React.Component {

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
    const { datas: { newsDynamicList = [], next_id, isHasMore = true, isHasNewDynamic, newsList = [] }} = this.props.model

    //过滤消息内容
    const filterTitleContain = (activity_type, messageValue) => {
      let contain = ''
      let messageContain = (<div></div>)
      switch (activity_type) {
        //项目
        case 'board.create':
          contain = `创建${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (<div>{messageValue.creator.name} 创建{currentNounPlanFilterName(PROJECTS)}「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>)
          break
        case 'updBoard':
          contain = `更新${currentNounPlanFilterName(PROJECTS)}信息`
          messageContain = (<div>{messageValue.user_name} 更新了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.board_name}</span>」{currentNounPlanFilterName(PROJECTS)}信息。</div>)
          break
        case 'board.update.archived':
          contain = `${currentNounPlanFilterName(PROJECTS)}归档`
          messageContain = (<div>{messageValue.creator.name} 归档了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>)
          break
        case 'board.update.user.quit':
          contain = `退出${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (<div>{messageValue.creator.name} 退出了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>)
          break
        case 'board.delete':
          contain = `删除${currentNounPlanFilterName(PROJECTS)}`
          messageContain = (<div>{messageValue.creator.name} 删除了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>)
          break
        case 'board.update.user.add':
          contain = `添加${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (<div>{messageValue.creator.name} 邀请{messageValue.member || '新成员'}加入了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>)
          break
        case 'board.update.user.remove':
          contain = `移除${currentNounPlanFilterName(PROJECTS)}成员`
          messageContain = (<div>{messageValue.creator.name} 将{messageValue.removed_user_name}移出了「<span style={{color: '#1890FF', cursor: 'pointer'}}>{messageValue.content.board.name}</span>」{currentNounPlanFilterName(PROJECTS)}。</div>)
          break
        //任务
        case 'board.card.create':
          messageContain = (
           <div className={NewsListStyle.news_3}>
            <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 创建了{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」。</div>
            <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
          </div>
          )
          contain = `创建${currentNounPlanFilterName(TASKS)}`
          break
        case 'createChildCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 创建了子{currentNounPlanFilterName(TASKS)}「{messageValue.card_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `创建子${currentNounPlanFilterName(TASKS)}`
          break
        case 'updCard':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 更新了{currentNounPlanFilterName(TASKS)}信息「{messageValue.card_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `更新${currentNounPlanFilterName(TASKS)}信息`
          break
        case 'board.card.update.archived':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 归档了{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(TASKS)}归档`
          break
        case 'board.card.update.finish':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 完成了{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.cancel.finish':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 取消完成{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `取消完成${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.delete':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 删除了{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `删除${currentNounPlanFilterName(TASKS)}`
          break
        case 'board.card.update.executor.add':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 把{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」指派了任务执行人。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `添加任${currentNounPlanFilterName(TASKS)}执行人`
          break
        case 'board.card.update.executor.remove':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 把{currentNounPlanFilterName(TASKS)}「{messageValue.content.card.name}」移除了任务执行人。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `添加任${currentNounPlanFilterName(TASKS)}执行人`
          break

        case 'board.card.update.label.add':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 添加了标签「{messageValue.label_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `添加${currentNounPlanFilterName(TASKS)}标签`
          break
        case 'board.card.update.label.remove':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 删除了标签「{messageValue.label_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
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
        case 'board.flow.tpl.add.or.delete':
          contain = `创建${currentNounPlanFilterName(FLOWS)}模板`
          break
        case 'board.flow.instance.initiate':
          contain = `启动${currentNounPlanFilterName(FLOWS)}`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 启动{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.flow.task.recall':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 撤回{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」节点「{messageValue.content.flow_node_instance.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reject':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 驳回{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」节点「{messageValue.content.flow_node_instance.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `撤回${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'board.flow.task.reassign':
          contain = '重新指派审批人'
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」节点「{messageValue.content.flow_node_instance.name}」中重新指定审批人 {messageValue.assignee || ''}。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'uploadWorkflowFile':
          contain = `${currentNounPlanFilterName(FLOWS)}文件上传`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.user_name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.flow_instance_name}」 上传了文件「{messageValue.file_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.map.create_time)}</div>
            </div>
          )
          break
        case 'board.flow.task.pass':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 在{currentNounPlanFilterName(FLOWS)}「{messageValue.content.flow_instance.name}」 中完成了任务「{messageValue.content.flow_node_instance.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          contain = `完成${currentNounPlanFilterName(FLOWS)}任务`
          break
        case 'waitingWorkflowTaskNotice':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>您有一个{currentNounPlanFilterName(FLOWS)}任务待处理。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.map.create_time)}</div>
            </div>
          )
          contain = `${currentNounPlanFilterName(FLOWS)}待处理任务通知`
          break
        //文档
        case 'board.folder.add':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 创建了文件夹「{messageValue.content.board_folder.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
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
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 上传了{currentNounPlanFilterName(FILES)}「{messageValue.content.board_file.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.version.upload':
          contain = `${currentNounPlanFilterName(FILES)}版本更新`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 更新了{currentNounPlanFilterName(FILES)}「{messageValue.content.board_file.name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.folder.remove.recycle':
          contain = '移除文件夹到回收站'
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 移动文件夹「{messageValue.content.board_folder.name}」到回收站。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
        case 'board.file.remove.recycle':
          contain = `移除${currentNounPlanFilterName(FILES)}到回收站`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 移动{currentNounPlanFilterName(FILES)}「{messageValue.content.board_file.name}」到回收站。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
            </div>
          )
          break
           //暂未联调完毕
        case 'board.file.move.to.folder':
          contain = `移动${currentNounPlanFilterName(FILES)}到某个文件夹中`
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 移动{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」到文件夹「{messageValue.folder_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.create_time)}</div>
            </div>
          )
          break
        case 'board.file.copy.to.folder':
          messageContain = (
            <div className={NewsListStyle.news_3}>
              <div className={NewsListStyle.news_3_text}>{messageValue.creator.name} 复制{currentNounPlanFilterName(FILES)}「{messageValue.file_name}」到文件夹「{messageValue.folder_name}」。</div>
              <div className={NewsListStyle.news_3_time}>{timestampToHM(messageValue.created)}</div>
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
    const projectNews = (value, key) => {
      const { content = {}, action, created } = value
      const { board = {}, card = {}, card_list = {} } = content

      return (
        <div className={NewsListStyle.containr} key={key}>
          <div className={NewsListStyle.top}>
            <div className={NewsListStyle.left}>
              <div className={NewsListStyle.l_l}>
                <div style={{background: '#E6F7FF', width: 40, height: 40, borderRadius: 40}}></div>
                {/*<img src="" />*/}
              </div>
              <div className={NewsListStyle.l_r}>
                <div>{filterTitleContain(action, value).contain}</div>
                <div>{timestampToTime(created)}</div>
              </div>
            </div>
            <div className={NewsListStyle.right}>
              <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
            </div>
          </div>
          <div className={NewsListStyle.bott}>
            <div className={NewsListStyle.news_1}>{filterTitleContain(action, value).messageContain}</div>
          </div>
        </div>
      )
    }
    //任务动态
    const taskNews = (value) =>{
      const { content = {}} = value[0]
      const { board = {}, card = {}, card_list = {} } = content
      const card_name = card['name']
      const card_id = card['id']
      const list_name = card_list['name']
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div className={NewsListStyle.containr}>
          <div className={NewsListStyle.top}>
            <div className={NewsListStyle.left}>
              <div className={NewsListStyle.l_l}>
                <div style={{background: '#E6F7FF', width: 40, height: 40, borderRadius: 40}}></div>
                {/*<img src="" />*/}
              </div>
              <div className={NewsListStyle.l_r}>
                <div>{card_name}</div>
                <div>{currentNounPlanFilterName(PROJECTS)}：{board_name}<Icon type="caret-right" style={{fontSize: 8}}/> 分组 {list_name || ''}</div>
              </div>
            </div>
            <div className={NewsListStyle.right}>
              <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
            </div>
          </div>
          <div className={NewsListStyle.bott}>
            {value.map((val, key) => {
              const { action } = val
              return(
                <div className={NewsListStyle.news_1} key={key}>{filterTitleContain(action, val).messageContain}</div>
              )
            })}
          </div>
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
          <div className={NewsListStyle.top}>
            <div className={NewsListStyle.left}>
              <div className={NewsListStyle.l_l}>
                <div style={{background: '#E6F7FF', width: 40, height: 40, borderRadius: 40}}></div>
                {/*<img src="" />*/}
              </div>
              <div className={NewsListStyle.l_r}>
                <div>{card_name}</div>
                <div>{currentNounPlanFilterName(PROJECTS)}：{board_name} <Icon type="caret-right" style={{fontSize: 8}}/> 分组 {list_name}</div>
              </div>
            </div>
            <div className={NewsListStyle.right}>
              <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
            </div>
          </div>
          <div className={NewsListStyle.bott}>
            {/*{news_4}*/}
            <div className={NewsListStyle.news_4}>
              {value.map((val, key) => {
                const { creator, created } = val
                const { avatar } = creator
                return (
                  <div className={NewsListStyle.news_4_top} key={key}>
                    <div className={NewsListStyle.news_4_left}>
                      {/*<img src="" />*/}
                      {avatar?(
                        <img src={avatar} />
                      ): (
                        <div style={{width: 40, height: 40, borderRadius: 40, backgroundColor: '#f5f5f5', textAlign: 'center'}}>
                          <Icon type={'user'} style={{fontSize: 18, marginTop: 12, color: '#8c8c8c'}}/>
                        </div>
                      )}
                    </div>
                    <div className={NewsListStyle.news_4_right}>
                      <div className={NewsListStyle.r_t}>
                        <div className={NewsListStyle.r_t_l}>{creator.name}</div>
                        <div className={NewsListStyle.r_t_r}>{timestampToHM(created)}</div>
                      </div>
                      <div className={NewsListStyle.r_b}>
                        {'评论内容未返回'}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className={NewsListStyle.news_4_middle}>
                {/*<img src="" />*/}
                {/*<img src="" />*/}
              </div>
              <div className={NewsListStyle.news_4_bottom}>
                <Comment {...this.props} parentKey={parentKey} childrenKey={childrenKey} card_id={card_id} />
              </div>
            </div>
          </div>
        </div>
      )
    }
    //流程动态
    const processNews = (value) => {
      const { content = {}, action} = value
      const { board = {}, flow_instance = {} } = content
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div className={NewsListStyle.containr}>
          <div className={NewsListStyle.top}>
            <div className={NewsListStyle.left}>
              <div className={NewsListStyle.l_l}>
                <div style={{background: '#E6F7FF', width: 40, height: 40, borderRadius: 40}}></div>
                {/*<img src="" />*/}
              </div>
              <div className={NewsListStyle.l_r}>
                <div>{flow_instance['name']}</div>
                <div>{currentNounPlanFilterName(PROJECTS)}： {board_name}</div>
              </div>
            </div>
            <div className={NewsListStyle.right}>
              <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
            </div>
          </div>
          <div className={NewsListStyle.bott}>
            <div className={NewsListStyle.news_1}>{filterTitleContain(action, value).messageContain}</div>
          </div>
        </div>
      )
    }
    //文档动态
    const fileNews = (value, key) => {
      const { content = {}, action} = value
      const { board = {}, flow_instance = {} } = content
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div className={NewsListStyle.containr}>
          <div className={NewsListStyle.top}>
            <div className={NewsListStyle.left}>
              <div className={NewsListStyle.l_l}>
                <div style={{background: '#E6F7FF', width: 40, height: 40, borderRadius: 40}}></div>
                {/*<img src="" />*/}
              </div>
              <div className={NewsListStyle.l_r}>
                <div>{filterTitleContain(action, value).contain}</div>
                <div>{currentNounPlanFilterName(PROJECTS)}： {board_name}</div>
              </div>
            </div>
            <div className={NewsListStyle.right}>
              <Icon type="pushpin-o" className={NewsListStyle.timer}/><Icon type="check" className={NewsListStyle.check} />
            </div>
          </div>
          <div className={NewsListStyle.bott}>
            <div className={NewsListStyle.news_1}>{filterTitleContain(action, value).messageContain}</div>
          </div>
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
        default:
          break
      }
      return containner
    }

    return (
      <div style={{paddingBottom: 100, transform: 'none', display: 'inline'}} >
        {newsDynamicList.map((value, parentkey)=> {
         console.log('newDataList_item', value)
          const { date, dataList = [], newDataList = []} = value
          return (
            <div className={NewsListStyle.itemOut} key={parentkey}>
              <div className={NewsListStyle.head}>
                <div>{date}</div>
                {/*全部标为已读*/}
                {/*<div onClick={this.allSetReaded.bind(this)}>全部标为已读</div>*/}
              </div>
              {newDataList.map((value, childrenKey) => {
                const { rela_type, TypeArrayList = [] } = value
                return (
                  <div key={childrenKey}>{filterNewsType(rela_type, TypeArrayList, parentkey, childrenKey)}</div>
                )
              })}
            </div>
          )
        })}
        <div style={{marginBottom: 20}}>
          {isHasMore?(
            <div onClick={this.getNewsDynamicListNext.bind(this, next_id)} style={{height: 30, maxWidth: 770, minWidth: 600, margin: '0 auto', lineHeight: '30px', textAlign: 'center', backgroundColor: '#e5e5e5', borderRadius: 4, marginTop: 20, cursor: 'pointer'}}>点击加载更多<Icon type="arrow-down" theme="outlined" /></div>
          ):(
            <div style={{height: 30, maxWidth: 770, minWidth: 600, margin: '0 auto', lineHeight: '30px', textAlign: 'center', marginTop: 20, color: '#8c8c8c'}}>没有更多了...</div>
          )}
        </div>
      </div>
    )
  }
}




