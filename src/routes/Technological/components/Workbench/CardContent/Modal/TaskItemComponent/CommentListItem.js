import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload, Tooltip, Avatar } from 'antd'
import CommentStyles from './Comment.less'
import {timestampToTimeNormal} from "../../../../../../../utils/util";

const Dragger = Upload.Dragger

export default class CommentListItem extends React.Component {
  state = {
    closeNormal: true,
    isShowAll: false
  }

  boxOnMouseOver() {
    this.setState({
      closeNormal: false
    })
  }
  hideBeyond(){
    this.setState({
      closeNormal: true
    })
  }
  showAll() {
    this.setState({
      isShowAll: !this.state.isShowAll
    })
  }
  deleteComment(id) {
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    this.props.deleteCardNewComment({id, card_id})
  }

  render() {

    const { datas:{ cardCommentList = [] } } = this.props.model

    const { closeNormal } = this.state
    const listItem = (value) => {
      const { full_name, avatar, text, create_time, id } = value
      return (
        <div className={CommentStyles.commentListItem}>
          <div className={CommentStyles.left}>
            <Avatar src={avatar} icon="user" style={{color:'#8c8c8c'}}></Avatar>
          </div>
          <div className={CommentStyles.right}>
            <div>
              <div className={CommentStyles.full_name}>{full_name}</div>
              <div className={CommentStyles.text}>{text}</div>
            </div>
            <div className={CommentStyles.bott} >
              <div className={CommentStyles.create_time}>
                {create_time?timestampToTimeNormal(create_time).substring(0, 16): ''}
              </div>
              <div className={CommentStyles.delete} onClick={this.deleteComment.bind(this,id)}>
                 删除
              </div>
            </div>
          </div>
        </div>
      )
    }
    const filterIssues = (data) => {
      const { action } = data
      let container = ''
      let messageContainer = (<div></div>)
      switch (action) {
        case 'board.card.create':
          messageContainer = (
            <div>
              {`${data.creator.name} 创建了 ${data.content.card.name} 任务`}
            </div>
          )
          break
        case 'board.card.delete':
          messageContainer=(
            <div>
              {`${data.creator.name} 删除了 ${data.content.card.name} 任务`}
            </div>
          )
          break
        case 'board.card.update.name':
          messageContainer=(
            <div>
              {`${data.creator.name} 修改了 ${data.content.card.name} 任务的名称 为 *`}
            </div>
          )
          break
        case 'board.card.update.executor.add':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 添加了执行人 ${data.content.rela_data.name}`}
            </div>
          )
          break
        case 'board.card.update.executor.remove':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 移除了执行人 ${data.content.rela_data.name}`}
            </div>
          )
          break
        case 'board.card.update.description':
            messageContainer=(
              <div>
                {`${data.creator.name} 在任务 ${data.content.card.name} 修改了任务描述`}
              </div>
            )
            break
        case 'board.card.update.startTime':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 修改了开始时间`}
            </div>
          )
          break
        case 'board.card.update.dutTime':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 修改了结束时间`}
            </div>
          )
          break
        case 'board.card.update.finish':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 标记完成`}
            </div>
          )
          break
        case 'board.card.update.finish.child':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 标记子任务完成`}
            </div>
          )
          break
        case 'board.card.update.cancel.finish':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 取消完成`}
            </div>
          )
          break
        case 'board.card.update.cancel.finish.child':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 取消子任务完成`}
            </div>
          )
          break
        case 'board.card.update.archived':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 归档任务`}
            </div>
          )
          break
        case 'board.card.update.file.add':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 添加了附件 *`}
            </div>
          )
          break
        case 'board.card.update.file.remove':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 移除了附件 *`}
            </div>
          )
          break
        case 'board.card.update.label.add':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 添加了标签 *`}
            </div>
          )
          break
        case 'board.card.update.label.remove':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 移除了标签 *`}
            </div>
          )
          break
        case 'board.card.list.group.add':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 新增了分组 *`}
            </div>
          )
          break
        case 'board.card.list.group.remove':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 移除了分组 *`}
            </div>
          )
          break
        case 'board.card.list.group.update.name':
          messageContainer=(
            <div>
              {`${data.creator.name} 在任务 ${data.content.card.name} 更新了分组名 *`}
            </div>
          )
          break
        default:
          break
      }
      return messageContainer
    }
    return (
      <div style={{overflowY: 'auto'}} className={CommentStyles.commentListItemBox}>
        <div>
          {
            this.props.model.datas.cardCommentAll.map((item, key) => {
              if(!this.state.isShowAll) {
                if(key < 4){
                  return filterIssues(item)
                }
              } else {
                return filterIssues(item)
              }
            })
          }
        </div>
        <span style={{cursor: 'pointer', color: '#499BE6' }} onClick={this.showAll.bind(this)}>{!this.state.isShowAll?'查看全部':'收起部分'}</span>
        {cardCommentList.length > 20 ?(
          <div className={CommentStyles.commentListItemControl}>
            {closeNormal?(
              <div>
                <Icon type="eye" />
              </div>
            ):(
              <div>
                <Icon type="arrow-up" onClick={this.hideBeyond.bind(this)}/>
              </div>
            )}
          </div>
        ) : ('')}
        <div  onMouseOver={this.boxOnMouseOver.bind(this)}>
          {cardCommentList.map((value, key) => {
            if(closeNormal && key > 19) {
              return false
            }
            return (
              <div key={key}>
                {listItem(value)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}


