import React from 'react';
import FileDetail from './FileDetail/index';
import BoardCommuicationFileDetailContainer from './component/BoardCommuicationFileDetailContainer'
import HeaderContent from '@/components/FileDetailModal/HeaderContent.js'
import MainContent from '@/components/FileDetailModal/MainContent.js'
import styles from './FileListRightBarFileDetailModal.less';
import { connect } from 'dva'
let timer
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

	render() {
		// const { currentZoomPictureComponetWidth, currentZoomPictureComponetHeight } = this.state

		return (
			<div id="container_FileListRightBarFileDetailModal" className={styles.fileListRightBarFileDetailModal}>
				<BoardCommuicationFileDetailContainer
					filePreviewCurrentFileId={this.props.filePreviewCurrentFileId}
					file_detail_modal_visible={this.props.file_detail_modal_visible}
					fileType={this.props.fileType}
					// componentHeight={currentZoomPictureComponetHeight} 
					// componentWidth={currentZoomPictureComponetWidth}
					whetherUpdateFolderListData={this.props.whetherUpdateFolderListData}
					setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
					hideUpdatedFileDetail={this.props.hideUpdatedFileDetail}//取消关闭弹窗的回调,项目交流中的特殊处理
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
		);
	}
}
function mapStateToProps({
	simplemode: {
		chatImVisiable = false
	}
}) {
	return {
		chatImVisiable
	}
}
export default FileListRightBarFileDetailModal;