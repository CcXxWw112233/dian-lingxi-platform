import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'
import { connect } from 'dva'
import {
  checkIsHasPermissionInBoard, checkIsHasPermissionInVisitControl,
} from "@/utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_COMPLETE, PROJECT_TEAM_CARD_COMMENT_PUBLISH
} from "@/globalset/js/constant";
import { message } from 'antd'

@connect(mapStateToProps)
export default class FileDetailModal extends Component {

  onCancel = () => {
    // this.props.dispatch({
    //   type: 'publicFileDetailModal/updateDatas',
    //   payload: {
    //     currentPreviewFileVisible: false
    //   }
    // })
    this.props.setPreviewFileModalVisibile && this.props.setPreviewFileModalVisibile()
  }

  render() {
    const { file_detail_modal_visible } = this.props
    return (
      <div>
        <PublicDetailModal
          // width={1200}
          // dynamicsContent={<CommentDynamicsList />}
          //style={{padding: '20px 84px 0'}}
          modalVisible={file_detail_modal_visible}
          onCancel={this.onCancel}
          // commentUseParams={commentUseParams}
          mainContent={<MainContent />}
          isNotShowFileDetailContentRightVisible={true}
          headerContent={<HeaderContent/>}
        />
      </div>
    )
  }
}

FileDetailModal.defaultProps = {
  file_detail_modal_visible: false, // 设置文件详情弹窗是否显示, 默认为 false 不显示
  setPreviewFileModalVisibile: function() { }, // 设置文件详情弹窗是否显示
  users: [], // 用户列表
  handleFileDetailChange: function() { }, // 外部修改内部弹窗数据的回调
  updateParentFileList: function() { }, // 内部数据修改后用来更新外部数据的回调
  handleDeleteFileCard: function() { }, // 删除某条文件
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicFileDetailModal: { currentInitFileId } } ) {
  return { currentInitFileId }
}
