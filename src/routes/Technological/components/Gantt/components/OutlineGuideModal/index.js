import React from 'react'
import { Modal, Button } from 'antd';
import styles from './index.less';
import outline_guide_img_url from '@/assets/gantt/outline_guide.gif'
import { connect } from 'dva'

function Index(props) {
    const { userGuide = {}, dispatch } = props
    const { board_gantt_outline } = userGuide
    const checkQuit = () => {
        dispatch({
            type: 'technological/setUserGuide',
            payload: {
                board_gantt_outline: '1'
            }
        })
        props.handleClose && props.handleClose()
    }
    return (
        <Modal
            width={694}
            title={null}
            visible={board_gantt_outline == '0'}
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
                <Button type="primary" onClick={checkQuit}>我知道了</Button>
            </div>

        </Modal>
    )
}
export default connect(({ technological: { datas: {
    userGuide = {}
} } }) => ({ userGuide }))(Index)
