import React from 'react';
import { Card, Icon, Input, Button, Mention, Upload, Tooltip, message } from 'antd'
import CommentStyles from './Comment.less'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import CommentListItem from './CommentListItem'
import Cookies from 'js-cookie'
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_COMMENT_PUBLISH,
  PROJECT_FILES_FILE_EDIT
} from "../../../../../../../globalset/js/constant";
import {checkIsHasPermissionInBoard} from "../../../../../../../utils/businessFunction";
import CommentMention from '../../../../../../../components/CommentMention'

const { toString, toContentState } = Mention;

// const TextArea = Input.TextArea
const Dragger = Upload.Dragger

export default class Comment extends React.Component {
  state = {
    editText: toContentState(''),
    submitButtonDisabled: true
  }
  MentionSpacerClick() {
  }
  MentionEditorChange(editorState) {
    this.setState({
      editText: editorState
    }, function () {
      this.setState({
        submitButtonDisabled: !!!toString(this.state.editText)
      })
    })
  }
  submitComment(editText) {
    // if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_COMMENT_PUBLISH)){
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    const { datas: { drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    this.props.addCardNewComment({
      card_id,
      comment: toString(editText)
    })
    this.setState({
      editText: toContentState(''),
      submitButtonDisabled: true
    })
  }
  commentToDynamics(data) {
    const { datas: { drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    this.props.postCommentToDynamics({
      id: card_id,
      type: "1",
      content: [data]
    })
  }

  render() {

    const { editText } = this.state
    const { datas: { drawContent = {}, cardCommentList = [], projectDetailInfoData = {} } } = this.props.model
    const { data = [] } = projectDetailInfoData
    let suggestions = []
    for(let val of data) {
      if(val['full_name']) {
        suggestions.push(val['full_name'])
      }
    }
    const { img } = projectDetailInfoData
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : {}
    const { avatar } = userInfo

    const { leftSpaceDivWH = 40 } = this.props
    const props = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
        } else if (status === 'error') {
        }
      },
    };
    return (
      <div>
        <div className={CommentStyles.out}>
          <div style={{width: leftSpaceDivWH, height: leftSpaceDivWH}}>
          </div>
          <div className={CommentStyles.right}>
            <CommentListItem {...this.props}/>
          </div>
        </div>
        <div className={CommentStyles.out}>
          <div>
            {avatar?(
              <img src={avatar} className={CommentStyles.avartarImg} style={{width: leftSpaceDivWH, height: leftSpaceDivWH}} />
            ): (
              <div style={{width: 26, height: 26, borderRadius: 26, backgroundColor: '#f5f5f5', textAlign: 'center'}}>
                <Icon type={'user'} style={{fontSize: 16, marginTop: 4, color: '#8c8c8c'}}/>
              </div>
            )}
          </div>
          {/*<Dragger {...props} >*/}
          <div className={CommentStyles.right}>

         <CommentMention users={data} submitComment={this.submitComment.bind(this)} commentToDynamics={this.commentToDynamics.bind(this)}/>

            {/*<div className={CommentStyles.comment}>*/}
              {/*/!*<textarea minrows = {1}  maxrows = {6}  className={CommentStyles.textArea}></textarea>*!/*/}
              {/*<Mention*/}
                  {/*multiLines={true}*/}
                  {/*onChange ={this.MentionEditorChange.bind(this)}*/}
                  {/*className={CommentStyles.mention}*/}
                  {/*style={{ width: '100%',border:' none', outline: 'none', height: 48}}*/}
                  {/*value={editText}*/}
                  {/*suggestions={suggestions}*/}
                {/*/>*/}
              {/*<div className={CommentStyles.functionBar}>*/}
                  {/*<div  className={CommentStyles.functionBar_left}>*/}
                    {/*/!*<Icon type="copyright"  onClick={this.MentionSpacerClick.bind(this)}/>*!/*/}
                      {/*<Tooltip title="该功能尚未上线，敬请期待">*/}
                        {/*<span style={{fontSize: 16, color: '#8c8c8c'}}>@</span>*/}
                      {/*</Tooltip>*/}
                      {/*<Tooltip title="该功能尚未上线，敬请期待">*/}
                        {/*<span><Icon type="smile-o" style={{marginTop: 10, color: '#8c8c8c'}}/></span>*/}
                      {/*</Tooltip>*/}
                      {/*<span></span>*/}
                      {/*<Tooltip title="该功能尚未上线，敬请期待">*/}
                        {/*<span className={CommentStyles.dragSpan}><Icon type="database" style={{fontSize: 14, color: '#8c8c8c'}} /> 选择或拖拽文件</span>*/}
                      {/*</Tooltip>*/}
                      {/*/!*<Dragger {...props} className={CommentStyles.drag}>*!/*/}
                        {/*/!*<span className={CommentStyles.dragSpan}><Icon type="database" /> 选择或拖拽文件</span>*!/*/}
                      {/*/!*</Dragger>*!/*/}
                    {/*</div>*/}
                  {/*<div  className={CommentStyles.functionBar_right}>*/}
                    {/*<Button disabled={this.state.submitButtonDisabled} type={'primary'} style={{height:24,width: 58,marginRight: 12}} onClick={this.submitComment.bind(this)}>发布</Button>*/}
                  {/*</div>*/}
                {/*</div>*/}
              {/*</div>*/}
          </div>
          {/*</Dragger>*/}
        </div>
      </div>
    )
  }
}


