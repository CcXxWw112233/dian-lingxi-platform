import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
@connect(mapStateToProps)
export default class UploadAttachmentModal extends Component {
    constructor(props){
        super(props);
    }
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    closeUploadAttachmentModal = () => {
        this.props.setUploadAttachmentModalVisible(false);
    };

    render() {
        return (
            <Modal
                title={<div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>上传附件设置</div>}
                visible={true}
                onOk={this.handleOk}
                onCancel={this.closeUploadAttachmentModal}
                zIndex={9999}
                width={556}
            >
                <div>
                    <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} className={`${globalStyles.authTheme}`}>&#xe6b3;</span>附件列表：
                </div>
                <div className={styles.fileListWrapper}>
                    <div className={styles.fileItem}><div className={styles.itemLeft}>结构方案.pdf</div><div className={styles.itemRight}> <Button size={'small'}>取消</Button></div></div>
                    <div className={styles.fileItem}>结构方案1.pdf</div>
                    <div className={styles.fileItem}>结构方案2.pdf</div>
                </div>
                <div style={{ marginTop: '14px' }}>
                    <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} className={`${globalStyles.authTheme}`}>&#xe7b2;</span>通知人:
                </div>
                <div>
                    <span style={{ fontSize: '40px', color: 'rgba(0,0,0,0.45)' }} className={`${globalStyles.authTheme}`}>&#xe6ca;</span>
                </div>
                <div style={{ marginTop: '14px' }}>
                    仅通知人可访问
                </div>
                <div style={{ marginTop: '14px' }}>
                    任务附件临时目录
                </div>
            </Modal>
        )
    }
}
// 只关联public弹窗内的数据
function mapStateToProps({ }) {
    return {}
}


