import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'

class PreviewFileModal extends React.Component {

  state = {
  }
  onCancel = () => {
    this.props.setPreviewFileModalVisibile()
  }
  render() {
    const { modalVisible, previewFileSrc, previewFileType } = this.props;
    const containner = () => {
      let contain
      switch (previewFileType) {
        case 'img':
          contain = (
            <img src={previewFileSrc} style={{width:600,height: 'auto'}}/>
          )
          break
        case 'video':
          contain = (
            <video controls src={previewFileSrc} style={{width:'auto',maxHeight: '600px'}}></video>
          )
          break
        default:
          break
      }
      return contain
    }

    return(
      <div>
        <Modal
          visible={modalVisible} //modalVisible
          width={700}
          zIndex={1006}
          footer={null}
          destroyOnClose
          maskClosable={false}
          style={{textAlign:'center',}}
          onCancel={this.onCancel}
        >
          {containner()}
        </Modal>
      </div>
    )
  }
}
export default Form.create()(PreviewFileModal)
