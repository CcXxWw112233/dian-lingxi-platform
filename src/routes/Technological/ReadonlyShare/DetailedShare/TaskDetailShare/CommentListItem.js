import React from 'react'
import { Icon, Avatar } from 'antd'
import CommentStyles from './Comment.less'
import {
  timestampToTimeNormal,
  judgeTimeDiffer,
  judgeTimeDiffer_ten
} from '../../../../../utils/util'
import { connect } from 'dva'

@connect(mapStateToProps)
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
  hideBeyond() {
    this.setState({
      closeNormal: true
    })
  }

  deleteComment(id) {
    const { drawContent = {} } = this.props
    const { card_id } = drawContent
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailTask/deleteCardNewComment',
      payload: {
        id,
        card_id
      }
    })
  }
  showAll() {
    this.setState({
      isShowAll: !this.state.isShowAll
    })
  }
  render() {
    const { cardCommentList = [], cardCommentAll = [] } = this.props

    const { closeNormal } = this.state
    const listItem = value => {
      const { full_name, avatar, text, create_time } = value
      const pId = value.user_id
      const { id } = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : ''
      return (
        <div className={CommentStyles.commentListItem}>
          <div className={CommentStyles.left}>
            <Avatar
              src={avatar}
              icon="user"
              style={{ color: '#8c8c8c' }}
            ></Avatar>
          </div>
          <div className={CommentStyles.right}>
            <div>
              <div className={CommentStyles.full_name}>{full_name}</div>
              <div className={CommentStyles.text}>{text}</div>
            </div>
            <div className={CommentStyles.bott}>
              <div className={CommentStyles.create_time}>
                {create_time
                  ? timestampToTimeNormal(create_time).substring(0, 16)
                  : ''}
              </div>
              {pId === id && !judgeTimeDiffer_ten(create_time) ? (
                <div
                  className={CommentStyles.delete}
                  onClick={this.deleteComment.bind(this, value.id)}
                >
                  ??????
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      )
    }
    const filterIssues = data => {
      const { action, create_time } = data
      let container = ''
      let messageContainer = <div></div>
      switch (action) {
        case 'board.card.create':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ${
                data.content && data.content.card_type == '0' ? '??????' : '??????'
              }`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.delete':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.name':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ???${data.content.rela_data &&
                data.content.rela_data.name} ??????????????? ??? ${data.content
                .card && data.content.card.name}`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.executor.add':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????? ${data.content.rela_data.name}`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.executor.remove':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????? ${data.content.rela_data.name}`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.description':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.startTime':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.dutTime':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.finish':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.finish.child':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.cancel.finish':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.cancel.finish.child':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.archived':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ????????????`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.file.add':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.file.remove':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.label.add':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.update.label.remove':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.list.group.add':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.list.group.remove':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ??????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        case 'board.card.list.group.update.name':
          messageContainer = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${data.creator.name} ????????? ${data.content.card.name} ?????????????????? *`}</div>
              <div style={{ color: '#BFBFBF', fontSize: '12px' }}>
                {judgeTimeDiffer(create_time)}
              </div>
            </div>
          )
          break
        default:
          break
      }
      return messageContainer
    }
    return (
      <div
        style={{ overflowY: 'auto' }}
        className={CommentStyles.commentListItemBox}
      >
        <div>
          {cardCommentAll.map((item, key) => {
            return filterIssues(item)
          })}
        </div>
        {/* <span style={{cursor: 'pointer', color: '#499BE6' }} onClick={this.showAll.bind(this)}>{!this.state.isShowAll?'????????????':'????????????'}</span> */}
        {cardCommentList.length > 20 ? (
          <div className={CommentStyles.commentListItemControl}>
            {closeNormal ? (
              <div>
                <Icon type="eye" />
              </div>
            ) : (
              <div>
                <Icon type="arrow-up" onClick={this.hideBeyond.bind(this)} />
              </div>
            )}
          </div>
        ) : (
          ''
        )}
        <div onMouseOver={this.boxOnMouseOver.bind(this)}>
          {cardCommentList.map((value, key) => {
            if (closeNormal && key > 19) {
              return false
            }
            return <div key={key}>{listItem(value)}</div>
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  projectDetailTask: {
    datas: { drawContent = {}, cardCommentAll = [], cardCommentList = [] }
  }
}) {
  return {
    drawContent,
    cardCommentList,
    cardCommentAll
  }
}
