import React from 'react';
import FileDetailModal from './FileDetail/FileDetailModal'

import { connect } from 'dva'
@connect(mapStateToProps)
class FileListRightBarFileDetailModal extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			currentZoomPictureComponetWidth: null,
			currentZoomPictureComponetHeight: null
		}
	}

	// 初始化的时候，会拿到当前这个width，然后赋给圈图的这个width
	componentDidMount() {
		setTimeout(() => {
			const container_fileDetailOut = document.getElementById('container_fileDetailOut');
			let zommPictureComponentHeight = container_fileDetailOut ? container_fileDetailOut.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
			let zommPictureComponentWidth = container_fileDetailOut ? container_fileDetailOut.offsetWidth : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
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
				const container_fileDetailOut = document.getElementById('container_fileDetailOut');
				let zommPictureComponentHeight = container_fileDetailOut ? container_fileDetailOut.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
				let zommPictureComponentWidth = container_fileDetailOut ? container_fileDetailOut.offsetWidth  : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
				this.setState({
					currentZoomPictureComponetWidth: zommPictureComponentWidth,
					currentZoomPictureComponetHeight: zommPictureComponentHeight
				})
			}, 200)
		} else { // 这里是浏览器视图变化的时候需要重新获取宽高
			setTimeout(() => {
				const container_fileDetailOut = document.getElementById('container_fileDetailOut');
				let zommPictureComponentHeight = container_fileDetailOut ? container_fileDetailOut.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
				let zommPictureComponentWidth = container_fileDetailOut ? container_fileDetailOut.offsetWidth : 600; //60为文件内容组件评s论等区域宽带   50为容器padding
				this.setState({
					currentZoomPictureComponetWidth: zommPictureComponentWidth,
					currentZoomPictureComponetHeight: zommPictureComponentHeight
				})
			}, 200)
		}
	}

	render() {
		const { currentZoomPictureComponetWidth, currentZoomPictureComponetHeight } = this.state
		return (
			<div id="projectList_FileListRightBarFileDetailModal" style={{width: '100%', height: '100%'}}>
				<FileDetailModal
					{...this.props}
					{...this.props.fileDetailModalDatas}
					componentHeight={currentZoomPictureComponetHeight}
					componentWidth={currentZoomPictureComponetWidth}
					setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}
					updateCommunicationFolderListData={this.props.updateCommunicationFolderListData}
					modalTop={20}
				/>
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