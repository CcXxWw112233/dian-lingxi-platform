import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload, Tooltip, Avatar } from 'antd'
import CommentStyles from './Comment2.less'
import commonCommentStyles from './commonComment.less'
import {judgeTimeDiffer, judgeTimeDiffer_ten} from "../../../utils/util";
import { connect } from 'dva'

const Dragger = Upload.Dragger

@connect(mapStateToProps)
export default class CommentListItem extends React.Component {
  state = {
    closeNormal: true,
    content_detail_use_id_local: '',
  }

  componentDidMount() {
    this.getCommentList(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getCommentList(nextProps)
  }

  //获取评论列表
  getCommentList = (props) => {
    const { dispatch, commentUseParams = {}, isShowAllDynamic } = props
    const { content_detail_use_id, flag, type } = commentUseParams
    const { content_detail_use_id_local } = this.state
    if(!content_detail_use_id || content_detail_use_id == content_detail_use_id_local) {
      return
    }
    this.setState({
      content_detail_use_id_local: content_detail_use_id
    })
    if (type && type == '1') { // 表示是任务
      dispatch({
        type: 'publicModalComment/getCardCommentListAll',
        payload: {
          id: content_detail_use_id,
          flag: isShowAllDynamic ? '0' : '1'
        }
      })
      return
    }
    dispatch({
      type: 'publicModalComment/getPublicModalDetailCommentList',
      payload: {
        id: content_detail_use_id,
        flag: isShowAllDynamic ? '0' : '1'
      }
    })
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
    const { commentUseParams = {} } = this.props
    const { deleteComment } = commentUseParams
    deleteComment && deleteComment({id})
  }

  commitClicShowEdit(data) {
    this.props.commitClicShowEdit(data)
  }

  getSpeicalTime = () => {
    let now = new Date()
    now.setMinutes(now.getMinutes() + 10)
    return now.getMinutes()
  }

  render() {

    const { comment_list = [], isShowAllDynamic } = this.props
    const { closeNormal } = this.state
    // const listItem = (value) => {
    //   const { full_name, avatar, text, create_time, id, flag, type } = value
    //   return (
    //     <div className={CommentStyles.commentListItem}>
    //       <div className={CommentStyles.left}>
    //         <Avatar src={avatar} icon="user" style={{ color: '#8c8c8c' }}></Avatar>
    //       </div>
    //       <div className={CommentStyles.right}>
    //         <div>
    //           <div className={CommentStyles.full_name}>
    //             {full_name}
    //             {type == '1'?(
    //               <span style={{marginLeft: 6}}>评论了</span>
    //             ):('')}
    //             {type == '1'?(
    //               <span className={CommentStyles.full_name_quan} onClick={this.commitClicShowEdit.bind(this, value)}>圈点{flag}</span>
    //             ):('')}

    //             </div>
    //           <div className={CommentStyles.text}>{text}</div>
    //         </div>
    //         <div className={CommentStyles.bott} >
    //           <div className={CommentStyles.create_time}>
    //             {timestampToTimeNormal(create_time, '', true)}
    //           </div>
    //           <div className={CommentStyles.delete} onClick={this.deleteComment.bind(this, id)}>
    //              删除
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }

    const commentNews = (data) => {
      const { action, create_time, text, id } = data
      let container = ''
      let messageContainer = (<div></div>)
      switch (action) {
        case 'board.common.comment.add': // 添加评论
          messageContainer = (
            <div className={commonCommentStyles.common_item}>
              {/* 头像 */}
              <div className={commonCommentStyles.common_left}>
                <Avatar src={(data.creator && data.creator.avatar) && data.creator.avatar} icon="user" style={{ color: '#8c8c8c' }}></Avatar>
              </div>
              {/* 右边内容 */}
              <div className={commonCommentStyles.common_right}>
                <div className={commonCommentStyles.common_top}>
                  <div className={commonCommentStyles.common_name}>
                    {data.creator && data.creator.name}
                  </div>
                  {/* <div className={commonCommentStyles.common_delete} onClick={this.deleteComment.bind(this,id)}>
                    撤回
                  </div> */}
                  {
                    judgeTimeDiffer_ten(create_time) ? (
                      <div className={commonCommentStyles.common_create_time}>
                        {judgeTimeDiffer(create_time)}
                      </div>
                    ) : (
                      <div className={commonCommentStyles.common_delete} onClick={this.deleteComment.bind(this, id)}>
                        撤回
                      </div> 
                    )
                  }
                </div>
                <div className={commonCommentStyles.common_bott} >
                  <span className={commonCommentStyles.common_text}>{text}</span>
                </div>
              </div>
            </div>
          )
          break;
        default:
          break;
      }
      return messageContainer
    }

    return (
      <div className={CommentStyles.commentListItemBox}>
        {/*{comment_list.length > 20 ?(*/}
          {/*<div className={CommentStyles.commentListItemControl}>*/}
            {/*{closeNormal?(*/}
              {/*<div>*/}
                {/*<Icon type="eye" />*/}
              {/*</div>*/}
            {/*):(*/}
              {/*<div>*/}
                {/*<Icon type="arrow-up" onClick={this.hideBeyond.bind(this)}/>*/}
              {/*</div>*/}
            {/*)}*/}
          {/*</div>*/}
        {/*) : ('')}*/}
        <div onMouseOver={this.boxOnMouseOver.bind(this)}>
          {comment_list.map((value, key) => {
            if(isShowAllDynamic && key > 19) {
              return false
            }
            return (
              <div key={key}>
                {/* {listItem(value)} */}
                {commentNews(value)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}


//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ publicModalComment: { comment_list = [] } }) {
  return { comment_list }
}
