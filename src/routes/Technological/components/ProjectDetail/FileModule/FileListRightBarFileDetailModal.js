import React from 'react'
// import FileDetailModal from './FileDetail/FileDetailModal'
import FileDetailModal from '@/components/FileDetailModal'

import { connect } from 'dva'

@connect(mapStateToProps)
class FileListRightBarFileDetailModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // currentZoomPictureComponetWidth: null,
      // currentZoomPictureComponetHeight: null,
      filePreviewCurrentFileId: props.filePreviewCurrentFileId,
      fileType: props.fileType
    }
  }

  setFull = flag => {
    this.setState({
      full: flag
    })
  }

  render() {
    const {
      currentZoomPictureComponetWidth,
      currentZoomPictureComponetHeight,
      filePreviewCurrentFileId,
      fileType
    } = this.state
    const {
      projectDetailInfoData: { board_id }
    } = this.props
    const { full } = this.state
    const fullStyle = full
      ? {
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          background: '#fff',
          left: 0,
          top: 0,
          zIndex: 1009
        }
      : {}
    return (
      <div
        id="projectList_FileListRightBarFileDetailModal"
        style={{ width: '100%', height: '100%' }}
      >
        <FileDetailModal
          onFullScreen={this.setFull}
          fileType={fileType}
          board_id={board_id}
          fileFullStyle={fullStyle}
          filePreviewCurrentName={this.props.filePreviewCurrentName}
          file_detail_modal_visible={this.props.file_detail_modal_visible}
          setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
          whetherUpdateFolderListData={this.props.whetherUpdateFolderListData}
          shouldUpdateAllFolderListData={
            this.props.shouldUpdateAllFolderListData
          } // 这是用来区分项目详情中的详情列表更新状态
        />
      </div>
    )
  }
}
function mapStateToProps({
  simplemode: { chatImVisiable = false },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    chatImVisiable,
    projectDetailInfoData
  }
}
export default FileListRightBarFileDetailModal
