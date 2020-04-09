import React, { Component } from 'react'
import { Modal, Button } from 'antd';

export default class SelectBoardModal extends Component {
    onOk = () => {
        const { modalOkCalback } = this.props
        modalOkCalback && modalOkCalback()
    }
    onCancel = () => {
        const { setBoardSelectVisible } = this.props
        setBoardSelectVisible && setBoardSelectVisible(false)
    }
    render() {
        const { visible, } = this.props
        return (
            <div>
                <Modal
                    destroyOnClose
                    title="Basic Modal"
                    visible={visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}
