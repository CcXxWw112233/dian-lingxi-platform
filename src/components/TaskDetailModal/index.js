import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'

export default class TaskDetailModal extends Component {

  onCancel = () => {
    this.props.set_task_detail_modal_visible && this.props.set_task_detail_modal_visible()
  }

  //评论
  commentSubmitPost = (data) => {
    let { text } = data
    const { dispatch, task_id, metting_id } = this.props
    if(text) {
      text = text.replace(/\r|\n/gim, '')
    }
    if(!text) {
      return
    }
    // dispatch({
    //   type: 'publicModalComment/submitPublicModalDetailComment',
    //   payload: {
    //     origin_type: '1',
    //     comment: text,
    //     id: type == '0' ? task_id : metting_id,
    //     flag: '1',
    //   }
    // })
  }

  deleteComment = (data) => {
    const { id } = data
    const { dispatch, type, task_id, metting_id } = this.props
    const del_id = type == '0' ? task_id : metting_id
    // dispatch({
    //   type: 'publicModalComment/deletePublicModalDetailComment',
    //   payload: {
    //     id,
    //     del_id,
    //     flag: '1',
    //   }
    // })
  }

  render() {
    const { task_detail_modal_visible, type, task_id, metting_id, users, handleTaskDetailChange } = this.props
    const commentUseParams = { //公共评论模块所需要的参数
      commentSubmitPost: this.commentSubmitPost,
      deleteComment: this.deleteComment,
      content_detail_use_id: type == '0' ? task_id : metting_id,
      origin_type: '1', //	string评论来源类型 1=任务 2=流程 3=文件 4=里程碑
      // flag: '1', //0或不传：评论和动态，1只显示评论，2只动态
    }
    return (
      <div>
        <PublicDetailModal 
          modalVisible={task_detail_modal_visible}
          onCancel={this.onCancel}
          commentUseParams={commentUseParams}
          mainContent={<MainContent users={users} handleTaskDetailChange={handleTaskDetailChange} />}
          headerContent={<HeaderContent users={users}/>}
        />
      </div>
    )
  }
}

TaskDetailModal.defaultProps = {
  task_detail_modal_visible: false, // 设置任务详情弹窗是否显示, 默认为 false 不显示
  set_task_detail_modal_visible: function() { }, // 设置任务详情弹窗是否显示
  task_id: '', // 任务id
  metting_id: '', // 会议id
  type: '', // 区分是任务还是会议的类型
  users: [], // 用户列表
  handleTaskDetailChange: function() { },
}
