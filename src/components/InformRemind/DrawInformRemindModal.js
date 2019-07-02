import React, { Component } from 'react'
import { Modal, Form } from 'antd'

class DrawInformRemindModal extends Component {

    render() {
        const { visible, title, width, zIndex, footer, overInner, mask } = this.props;
        return(
            <Modal
                title={<div style={{textAlign:'center', fontSize: 16, fontWeight: 500, color: '#000'}}>{title}</div>} 
                visible={visible}
                width={width}
                zIndex={zIndex}
                footer={footer}
                mask={mask}
                destroyOnClose
            >
                { overInner }
            </Modal>
        )
    }
}

export default DrawInformRemindModal;
