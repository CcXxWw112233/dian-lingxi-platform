import React, { Component } from 'react'
import { Drawer } from 'antd';
import { connect } from 'dva';
import MainContent from './TaskDetailModal/MainContent'
import HeaderContent from './TaskDetailModal/HeaderContent'
import styles from './index.less'
@connect(mapStateToProps)
export default class Index extends Component {
    onClose = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                selected_card_visible: false,
            }
        })
    }
    render() {
        const { selected_card_visible } = this.props
        return (
            <div className={styles.draw_detail}>
                <Drawer
                    placement="right"
                    title={<HeaderContent onClose={this.onClose} />}
                    closable={false}
                    onClose={this.onClose}
                    mask={false}
                    destroyOnClose
                    visible={selected_card_visible}
                    getContainer={() => document.getElementById('gantt_card_out_middle')}
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
            selected_card_visible
        }
    },
}) {
    return {
        gantt_board_id,
        selected_card_visible,
    }
}