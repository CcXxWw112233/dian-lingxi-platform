import React, { Component } from 'react'
import { Modal, TreeSelect, Icon, Dropdown, message } from 'antd'
import headerStyles from '../HeaderContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { getSubfixName } from '@/utils/businessFunction.js'
const { TreeNode } = TreeSelect;

export default class SaveAsNewVersionFile extends Component {

	state = {
		fileSavePath: null,
		uploading: null
	}

	// 关闭弹框
	hideModal = () => {
		// if (this.state.uploading) {
		// 	return message.error('另存为中：暂不能操作');
		// }
		this.props.setSaveAsNewVersionVisible && this.props.setSaveAsNewVersionVisible()
	}

	// 截取文件名称点缀
	getEllipsisFileName = (name) => {
		let str = name
		if (!name) return
		let arr = str.split('.')
		arr.splice(-1, 1)
		arr.join('.')
		return arr
	}

	onChangeFileSavePath = (value) => {
		// if (this.state.uploading) {
		// 	message.warn('正在另存为中...请勿操作')
		// 	return false
		// }
		if (value == '0' || value == '') {
			message.warn('请选择一个文件目录', MESSAGE_DURATION_TIME)
			return false
		} else {
			this.setState({
				fileSavePath: value
			});
		}
	}

	// 保存为新版本
	renderKeepNewVersion = () => {
		const { projectMemberData = [], toNoticeList = [] } = this.props
		return (
			<div>
				{/* 通知内容 */}
				<div style={{ width: '100%', height: '40px', background: 'rgba(245,245,245,1)', borderRadius: '4px', boxSizing: 'border-box', padding: '10px 0 10px 10px', marginBottom: '10px' }}>
					通知内容: <sapn>严世威 在 西塘项目  中更新了  2019-01-14.pdf</sapn>
				</div>
				{/* 通知的人员 */}
				<div>
					<span className={globalStyles.authTheme}>&#xe6e3;</span> 提醒谁查看：
				   <div className={headerStyles.noticeUsersWrapper} style={{ marginTop: '6px' }}>
						<div style={{ position: 'relative' }}>
							<Dropdown trigger={['click']} overlayClassName={headerStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
								overlayStyle={{ maxWidth: '200px' }}
								overlay={
									<MenuSearchPartner
										listData={projectMemberData} keyCode={'user_id'} searchName={'name'} currentSelect={toNoticeList}
										// board_id={board_id}
										invitationType='1'
										// invitationId={board_id}
										// invitationOrg={org_id}
										chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
								}
							>
								{/* 添加通知人按钮 */}

								<div className={headerStyles.addNoticePerson}>
									<Icon type="plus-circle" style={{ fontSize: '40px', color: '#40A9FF' }} />
								</div>
							</Dropdown>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderFolderTreeNodes = data => {
		return data.map(item => {
			if (item.child_data && item.child_data.length > 0) {
				return (
					<TreeNode title={item.folder_name} key={item.folder_id} value={item.folder_id} dataRef={item} >
						{this.renderFolderTreeNodes(item.child_data)}
					</TreeNode>
				);
			} else {
				return <TreeNode disabled={item.disabled && item.disabled} title={item.folder_name} key={item.folder_id} value={item.folder_id} dataRef={item} />;
			}

		});

	}


	renderSelectBoardFileTreeList = () => {
		const { is_file_tree_loading, boardFolderTreeData = [] } = this.props;
		// const { boardFolderTreeData } = this.state;
		if (is_file_tree_loading) {
			return (
				<div style={{ backgroundColor: '#FFFFFF', textAlign: 'center', height: '50px', lineHeight: '48px', overflow: 'hidden', color: 'rgba(0, 0, 0, 0.25)' }} className={`${styles.page_card_Normal} ${styles.directoryTreeWapper}`}>
					数据加载中
			</div>
			)
		}

		return this.renderFolderTreeNodes([boardFolderTreeData]);
	}

	// 另存文件为新版本
	renderSaveNewVersion = () => {
		const { currentPreviewFileData: { file_name }, boardFolderTreeData = [] } = this.props
		const { fileSavePath } = this.state
		const FILENAME = this.getEllipsisFileName(file_name)
		return (
			<div>
				<div style={{ marginBottom: '16px' }}>
					<div>文件名：</div>
					<div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,1)', borderRadius: '4px', boxSizing: 'border-box', padding: '10px 0 10px 10px', marginTop: '8px', marginBottom: '10px', border: '1px solid rgba(0,0,0,0.15)' }}>
						<sapn style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'noWrap', display: 'inline-block', verticalAlign: 'middle' }}>{FILENAME}</sapn><span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{getSubfixName(file_name)}</span>
					</div>
				</div>
				<div>
					<div>存放位置：</div>
					<div style={{ marginTop: '8px' }}>
						<TreeSelect
							defaultValue={fileSavePath}
							disabled={boardFolderTreeData && boardFolderTreeData.length == '0'}
							value={fileSavePath}
							className={headerStyles.treenode_wrapper}
							showSearch={false}
							style={{ width: '100%', height: '40px' }}
							dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
							placeholder="请选择"
							allowClear={true}
							treeDefaultExpandAll={true}
							onChange={this.onChangeFileSavePath}
						>
							{this.renderSelectBoardFileTreeList()}
						</TreeSelect>
					</div>
					{
						boardFolderTreeData && boardFolderTreeData.length == '0' && (
							<span style={{ display: 'block', marginTop: '15px', marginLeft: '4px', color: '#FAAD14' }}>暂无访问文件权限</span>
						)
					}
				</div>
			</div>
		)
	}

	render() {
		const { visible, title, titleKey, boardFolderTreeData = [] } = this.props
		const { uploading, fileSavePath } = this.state
		// 另存为的确认按钮是佛禁用条件
		const okButtonPropsFromSaveOthersFile = boardFolderTreeData && boardFolderTreeData.length == '0' || !fileSavePath
		return (
			<div>
				<Modal
					zIndex={1007}
					visible={visible}
					title={<div style={{ textAlign: 'center' }}>{title}</div>}
					// onOk={this.hideModal}
					onCancel={this.hideModal}
					okText="确认"
					cancelText="取消"
					destroyOnClose={true}
					maskClosable={false}
					style={{ width: '520px' }}
					okButtonProps={{ loading: uploading, disabled: okButtonPropsFromSaveOthersFile }}
					cancelButtonProps={uploading ? { disabled: true } : {}}
					okText={uploading ? '另存为中……' : '确定'}
				>
					{titleKey == '2' ? this.renderKeepNewVersion() : (titleKey == '3' ? this.renderSaveNewVersion() : <div></div>)}
				</Modal>
			</div>
		)
	}
}
