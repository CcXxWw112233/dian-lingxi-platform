import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'

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
    const { file_detail_modal_visible, filePreviewCurrentFileId, fileType } = this.props
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
          headerContent={<HeaderContent filePreviewCurrentFileId={filePreviewCurrentFileId} fileType={fileType}/>}
        />
      </div>
    )
  }
}

FileDetailModal.defaultProps = {
  filePreviewCurrentFileId: '', // 需要一个当前的文件ID, !!!
  fileType: '', // 当前文件的后缀名, !!!
  file_detail_modal_visible: false, // 设置文件详情弹窗是否显示, 默认为 false 不显示
  setPreviewFileModalVisibile: function() { }, // 设置文件详情弹窗是否显示
  users: [], // 用户列表
  handleFileDetailChange: function() { }, // 外部修改内部弹窗数据的回调
  updateParentFileList: function() { }, // 内部数据修改后用来更新外部数据的回调
  handleDeleteFileCard: function() { }, // 删除某条文件
}
