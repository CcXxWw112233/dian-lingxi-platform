import React from 'react'
import BoardCommuicationFileDetailContainer from './component/BoardCommuicationFileDetailContainer'
import styles from './FileListRightBarFileDetailModal.less'
import { connect } from 'dva'
@connect(mapStateToProps)
class FileListRightBarFileDetailModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // currentZoomPictureComponetWidth: null,
      // currentZoomPictureComponetHeight: null,
      filePreviewCurrentFileId: props.filePreviewCurrentFileId,
      fileType: props.fileType,
      full: false
    }
  }

  setFull = flag => {
    this.setState({
      full: flag
    })
  }

  render() {
    // const { currentZoomPictureComponetWidth, currentZoomPictureComponetHeight } = this.state
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
        id="container_FileListRightBarFileDetailModal"
        className={styles.fileListRightBarFileDetailModal}
        style={fullStyle}
      >
        <BoardCommuicationFileDetailContainer
          onFull={this.setFull}
          filePreviewCurrentFileId={this.props.filePreviewCurrentFileId}
          file_detail_modal_visible={this.props.file_detail_modal_visible}
          fileType={this.props.fileType}
          filePreviewCurrentName={this.props.filePreviewCurrentName}
          board_id={board_id}
          // componentHeight={currentZoomPictureComponetHeight}
          // componentWidth={currentZoomPictureComponetWidth}
          whetherUpdateFolderListData={this.props.whetherUpdateFolderListData}
          setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
          hideUpdatedFileDetail={this.props.hideUpdatedFileDetail} //取消关闭弹窗的回调,项目交流中的特殊处理
        />
        {/* <FileDetail
					{...this.props}
					{...this.props.fileDetailModalDatas}
					componentHeight={currentZoomPictureComponetHeight}
					componentWidth={currentZoomPictureComponetWidth}
					setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
					updateCommunicationFolderListData={this.props.updateCommunicationFolderListData}
					modalTop={20}
				/> */}
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
