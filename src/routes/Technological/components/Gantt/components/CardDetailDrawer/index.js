import React, { Component } from 'react'
import { Drawer } from 'antd';
import { connect } from 'dva';
import MainContent from './TaskDetailModal/MainContent'
import HeaderContent from './TaskDetailModal/HeaderContent'
import styles from './index.less'
@connect(mapStateToProps)
export default class Index extends Component {
    onClose = () => {

    }
    render() {
        const { selected_card: { visible } } = this.props
        return (
            <div className={styles.draw_detail}>
                <Drawer
                    placement="right"
                    title={<HeaderContent />}
                    closable={false}
                    onClose={this.onClose}
                    mask={false}
                    destroyOnClose
                    visible={visible}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    width={400}
                >
                    <MainContent />
                </Drawer>
            </div>
        )
    }
}
function mapStateToProps({
    gantt: {
        datas: {
            gantt_board_id,
            selected_card = {}
        }
    },
}) {
    return {
        gantt_board_id,
        selected_card,
    }
}