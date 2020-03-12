import React from 'react'
import { Modal, Button } from 'antd';
import styles from './index.less';
import outline_guide_img_url from '@/assets/gantt/outline_guide.gif'
export default function index(props) {
    return (
        <Modal
            width={694}
            title={null}
            visible={true}
            footer={null}
            centered

            // onOk={this.handleOk}
            onCancel={props.handleClose}
        >
            <div className={styles.headerTitle}>操作指引</div>
            <div className={styles.guideGifWrapper}>
                <img src={outline_guide_img_url} />
            </div>
            <div className={styles.guideButtons}>
                <Button type="primary" onClick={props.handleClose}>我知道了</Button>
            </div>

        </Modal>
    )
}
