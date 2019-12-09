import React from 'react';
import FileDetail from './FileDetail/index';
import BoardCommuicationFileDetailContainer from './component/BoardCommuicationFileDetailContainer'
import HeaderContent from '@/components/FileDetailModal/HeaderContent.js'
import MainContent from '@/components/FileDetailModal/MainContent.js'
import styles from './FileListRightBarFileDetailModal.less';
import { connect } from 'dva'
@connect(mapStateToProps)
class FileListRightBarFileDetailModal extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			currentZoomPictureComponetWidth: null,
			currentZoomPictureComponetHeight: null,
			filePreviewCurrentFileId: props.filePreviewCurrentFileId,
			fileType: props.fileType
		}
	}

	// 初始化的时候，会拿到当前这个width，然后赋给圈图的这个width
	componentDidMount() {
		setTimeout(() => {
			const container_FileListRightBarFileDetailModal = document.getElementById('container_FileListRightBarFileDetailModal');
			let zommPictureComponentHeight = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
			let zommPictureComponentWidth = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetWidth - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
			this.setState({
				currentZoomPictureComponetWidth: zommPictureComponentWidth,
				currentZoomPictureComponetHeight: zommPictureComponentHeight
			})
		}, 200)
	}

	// 当圈子展开关闭的时候以及浏览器视图变化时, 实时获取当前的width
	componentWillReceiveProps(nextProps) {
		const { chatImVisiable: newChatImVisiable } = nextProps
		const { chatImVisiable } = this.props
		if (newChatImVisiable != chatImVisiable) { // 是展开和关闭需要重新获取宽高
			setTimeout(() => {
				const container_FileListRightBarFileDetailModal = document.getElementById('container_FileListRightBarFileDetailModal');
				let zommPictureComponentHeight = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
				let zommPictureComponentWidth = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetWidth - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
				this.setState({
					currentZoomPictureComponetWidth: zommPictureComponentWidth,
					currentZoomPictureComponetHeight: zommPictureComponentHeight
				})
			}, 200)
		} else { // 这里是浏览器视图变化的时候需要重新获取宽高
			setTimeout(() => {
				const container_FileListRightBarFileDetailModal = document.getElementById('container_FileListRightBarFileDetailModal');
				let zommPictureComponentHeight = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
				let zommPictureComponentWidth = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetWidth - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
				this.setState({
					currentZoomPictureComponetWidth: zommPictureComponentWidth,
					currentZoomPictureComponetHeight: zommPictureComponentHeight
				})
			}, 200)
		}
	}

	render() {
		const { currentZoomPictureComponetWidth, currentZoomPictureComponetHeight } = this.state
		// const container_FileListRightBarFileDetailModal = document.getElementById('container_FileListRightBarFileDetailModal');
		// let zommPictureComponentHeight = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
		// let zommPictureComponentWidth = container_FileListRightBarFileDetailModal ? container_FileListRightBarFileDetailModal.offsetWidth - 50 - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
		// console.log(currentZoomPictureComponetWidth, 'sssssssssss')

		return (
			<div id="container_FileListRightBarFileDetailModal" className={styles.fileListRightBarFileDetailModal}>
				<BoardCommuicationFileDetailContainer
					filePreviewCurrentFileId={this.state.filePreviewCurrentFileId}
					fileType={this.state.fileType}
					componentHeight={currentZoomPictureComponetHeight} 
					componentWidth={currentZoomPictureComponetWidth}
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