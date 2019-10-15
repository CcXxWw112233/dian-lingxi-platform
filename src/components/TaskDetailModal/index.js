import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'

export default class TaskDetailModal extends Component {

  onCancel = () => {
    this.props.setTaskDetailModalVisible && this.props.setTaskDetailModalVisible()
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

  // 外部容器的点击事件
  commonDrawerContentOutClick = () => {
    this.props.dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        is_edit_title: false
      }
    })
  }

  render() {
    const { task_detail_modal_visible, users, handleTaskDetailChange } = this.props
    // const siderRightWidth = document.getElementById('siderRight').clientWidth
    // const commentUseParams = { //公共评论模块所需要的参数
    //   commentSubmitPost: this.commentSubmitPost,
    //   deleteComment: this.deleteComment,
    //   content_detail_use_id: card_id,
    //   origin_type: '1', //	string评论来源类型 1=任务 2=流程 3=文件 4=里程碑
    //   // flag: '1', //0或不传：评论和动态，1只显示评论，2只动态
    // }
    return (
      <div>
        <PublicDetailModal
          // width={1200}
          style={{padding: '20px 84px 0'}}
          modalVisible={task_detail_modal_visible}
          onCancel={this.onCancel}
          // commentUseParams={commentUseParams}
          mainContent={<MainContent users={users} handleTaskDetailChange={handleTaskDetailChange} />}
          headerContent={<HeaderContent users={users} />}
          commonDrawerContentOutClick={this.commonDrawerContentOutClick}
        />
      </div>
    )
  }
}

TaskDetailModal.defaultProps = {
  task_detail_modal_visible: false, // 设置任务详情弹窗是否显示, 默认为 false 不显示
  setTaskDetailModalVisible: function() { }, // 设置任务详情弹窗是否显示
  users: [], // 用户列表
  handleTaskDetailChange: function() { }, // 外部修改内部弹窗数据的回调
  // updateParentTaskList: function() { }, // 内部数据修改后用来更新外部数据的回调
}
