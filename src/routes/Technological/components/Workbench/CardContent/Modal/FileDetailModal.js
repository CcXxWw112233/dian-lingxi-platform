import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import { min_page_width } from "../../../../../../globalset/js/styles";
import CustormModal from '../../../../../../components/CustormModal'
import FileDetail from './FileDetail/index'
const FormItem = Form.Item
const TextArea = Input.TextArea


class FileDetailModal extends React.Component {
	state = {}

	componentDidMount() { }

	componentWillReceiveProps(nextProps) { }

	onCancel() {
		this.props.updateDatas({
			isInOpenFile: false
		})
	}

	render() {
		const { modalVisible } = this.props;

		const modalTop = 20
		const boardsFileDetail_CustormModal = document.getElementById('boardsFileDetail_CustormModal');
		const zommPictureComponentHeight = boardsFileDetail_CustormModal ? boardsFileDetail_CustormModal.offsetHeight - 60 - 10 : 600; //60为文件内容组件头部高度 50为容器padding  
		const zommPictureComponentWidth = boardsFileDetail_CustormModal ? boardsFileDetail_CustormModal.offsetWidth - 50 - 5 : 600; //60为文件内容组件评s论等区域宽带   50为容器padding

		return (
			<CustormModal
				visible={modalVisible}
				width={'80%'}
				// height={600}
				zIndex={1006}
				closable={false}
				maskClosable={false}
				footer={null}
				destroyOnClose
				bodyStyle={{ top: 0 }}
				style={{ top: modalTop }}
				onCancel={this.onCancel.bind(this)}
				overInner={
					<div id="boardsFileDetail_CustormModal">
						<FileDetail
							{...this.props}
							{...this.props.fileDetailModalDatas}
							componentHeight={zommPictureComponentHeight}
							componentWidth={zommPictureComponentWidth}
							modalTop={modalTop}
						/>
					</div>
				}
			/>
		)
	}
}
export default Form.create()(FileDetailModal)
