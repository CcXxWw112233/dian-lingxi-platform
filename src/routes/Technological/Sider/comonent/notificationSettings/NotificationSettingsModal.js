import React, { Component } from 'react'
import { Radio } from 'antd'
import CustormModal from '@/components/CustormModal'
import styles from './NotificationSettingsModal.less'

export default class NotificationSettingsModal extends Component {

    onCancel = () => {
        this.props.setNotificationSettingsModalVisible()
    }

    render() {

        const { notificationSettingsModalVisible } = this.props
        // console.log(this.props, 'ssss')

        return (
            <div>
                <CustormModal
                    title={<div style={{textAlign:'center', fontSize: 16, fontWeight: 500, color: '#000'}}>通知设置</div>}
                    visible={notificationSettingsModalVisible}
                    width={472}
                    zIndex={1006}
                    maskClosable={false}
                    destroyOnClose={true}
                    style={{textAlign: 'center'}}
                    onCancel={this.onCancel}
                    // overInner={formContain}
                    >
                </CustormModal>
            </div>
        )
    }
}
