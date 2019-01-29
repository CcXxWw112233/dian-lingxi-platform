import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload, Tooltip, Avatar } from 'antd'
import CommentStyles from './Comment.less'
import {timestampToTimeNormal} from "../../../../../utils/util";

const Dragger = Upload.Dragger

export default class CommentListItem extends React.Component {
  state = {
    closeNormal: true,
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

  deleteComment(id) {
    const { datas: { drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    this.props.deleteCardNewComment({id, card_id})
  }

  render() {

    const { datas: { cardCommentList = [] } } = this.props.model

    const { closeNormal } = this.state
    const listItem = (value) => {
      const { full_name, avatar, text, create_time, id } = value
      return (
        <div className={CommentStyles.commentListItem}>
          <div className={CommentStyles.left}>
            <Avatar src={avatar} icon="user" style={{color: '#8c8c8c'}}></Avatar>
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
              <div className={CommentStyles.delete} onClick={this.deleteComment.bind(this, id)}>
                 删除
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className={CommentStyles.commentListItemBox}>
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
        <div onMouseOver={this.boxOnMouseOver.bind(this)}>
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


