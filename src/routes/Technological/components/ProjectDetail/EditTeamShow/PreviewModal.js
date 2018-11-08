import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea
export default class PreviewModal extends React.Component {
  onCancel = () => {
    this.props.updateDatas({
      editTeamShowPreview: false
    })
  }
  render() {
    const {datas: { editTeamShowPreview }} = this.props.model
    const { previewHtml } = this.props
    const step = (
       <div dangerouslySetInnerHTML={{__html: previewHtml}}></div>
    )

    return(
      <div>
        <Modal
          visible={editTeamShowPreview}
          width={'100%'}
          height = {'100%'}
          zIndex={1006}
          maskClosable={false}
          footer={null}
          destroyOnClose
          style={{textAlign:'center'}}
          onCancel={this.onCancel}
        >
          {step}
        </Modal>
      </div>
    )
  }
}
