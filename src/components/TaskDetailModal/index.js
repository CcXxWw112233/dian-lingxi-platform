import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'
import { connect } from 'dva'
import {
  checkIsHasPermissionInBoard, checkIsHasPermissionInVisitControl,
} from "@/utils/businessFunction";
import { message } from 'antd'
import { lx_utils } from 'lingxi-im'


@connect(mapStateToProps)
export default class TaskDetailModal extends Component {

  onCancel = () => {
    this.props.dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawerVisible: false,
        drawContent: {},
        card_id: '',
        boardTagList: []
      }
    })
    this.props.setTaskDetailModalVisible && this.props.setTaskDetailModalVisible()
    // 圈子关闭联动
    lx_utils && lx_utils.setCommentData(this.props.card_id || null)
  }

  // 检测不同类型的权限控制类型的是否显示
  checkDiffCategoriesAuthoritiesIsVisible = (code) => {
    const { drawContent = {} } = this.props
    const { is_realize = '0', card_id, privileges = [], board_id, is_privilege, executors = [] } = drawContent
    let flag
    return {
      'visit_control_edit': function () {// 是否是有编辑权限
        return checkIsHasPermissionInVisitControl('edit', privileges, is_privilege, executors, checkIsHasPermissionInBoard(code, board_id))
      },
      'visit_control_comment': function () {
        return checkIsHasPermissionInVisitControl('comment', privileges, is_privilege, executors, checkIsHasPermissionInBoard(code, board_id))
      },
    }
  }

  render() {
    const { task_detail_modal_visible, users, handleTaskDetailChange, updateParentTaskList, setTaskDetailModalVisible, handleDeleteCard, card_id, handleChildTaskChange, UIComponent } = this.props

    return (
      <div>
        <PublicDetailModal
          // width={1200}
          // dynamicsContent={<CommentDynamicsList />}
          //style={{padding: '20px 84px 0'}}
          modalVisible={task_detail_modal_visible}
          onCancel={this.onCancel}
          // commentUseParams={commentUseParams}
          isNotShowFileDetailContentRightVisible={true}
          mainContent={<MainContent handleTaskDetailChange={handleTaskDetailChange} handleChildTaskChange={handleChildTaskChange} />}
          headerContent={
            <HeaderContent
              handleDeleteCard={handleDeleteCard}
              setTaskDetailModalVisible={setTaskDetailModalVisible} handleTaskDetailChange={handleTaskDetailChange} updateParentTaskList={updateParentTaskList}
            />}
        />
      </div>
    )
  }
}

TaskDetailModal.defaultProps = {
  task_detail_modal_visible: false, // 设置任务详情弹窗是否显示, 默认为 false 不显示
  setTaskDetailModalVisible: function () { }, // 设置任务详情弹窗是否显示
  handleTaskDetailChange: function () { }, // 外部修改内部弹窗数据的回调
  updateParentTaskList: function () { }, // 内部数据修改后用来更新外部数据的回调
  handleDeleteCard: function () { }, // 删除某条任务
  handleChildTaskChange: function () { }, // 子任务更新或删除回调最终会返回  action?update/add/delete, parent_card_id, card_id, data(要更新的keykode)
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicTaskDetailModal: { drawContent = {}, card_id }, publicModalComment: { isShowAllDynamic },
  technological: {
    datas: {
      userBoardPermissions
    }
  }
}) {
  return { drawContent, card_id, isShowAllDynamic, userBoardPermissions }
}
