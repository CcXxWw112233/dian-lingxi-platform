import React, { Component } from 'react'
import { Modal, Input } from 'antd';
import { connect } from 'dva';

@connect(mapStateToProps)
export default class SelectBoardModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            disabled: true
        }
    }
    onOk = () => {
        this.closeModal()
    }
    onCancel = () => {
        this.closeModal()
    }
    closeModal = () => {
        const { setVisible } = this.props
        setVisible && setVisible(false)
        this.setState({
            name: '',
            disabled: true
        })
    }
    handleChange = (e) => {
        const value = e.target.value.trimLR()
        this.setState({
            name: value,
            disabled: !!!value
        })
    }
    render() {
        const { visible, zIndex } = this.props
        const { name, disabled } = this.state
        return (
            <div>
                <Modal
                    zIndex={zIndex}
                    destroyOnClose
                    title={<div style={{ textAlign: 'center' }}>模板名称</div>}
                    visible={visible}
                    onOk={this.onOk}
                    style={{ width: 480 }}
                    onCancel={this.onCancel}
                    okButtonProps={{
                        disabled
                    }}
                >
                    <Input
                        value={name}
                        placeholder={`请输入模板名称`}
                        onChange={this.handleChange}
                        style={{ height: 40, marginBottom: 16 }} />
                    <div style={{ height: 10 }}></div>
                </Modal>
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    gantt: {
        datas: {
            gantt_board_id = []
        }
    },
}) {
    return {
        gantt_board_id
    }
}