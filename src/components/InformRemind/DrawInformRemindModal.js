import React, { Component } from 'react'
import { Modal, Form } from 'antd'

class DrawInformRemindModal extends Component {

    render() {
        const { visible, title, width, zIndex, footer, overInner, wrapClassName } = this.props;
        return(
            <Modal
                title={title} 
                visible={visible}
                width={width}
                zIndex={zIndex}
                footer={footer}
                destroyOnClose
                wrapClassName={wrapClassName}
            >
                { overInner }
            </Modal>
        )
    }
}

export default DrawInformRemindModal;
