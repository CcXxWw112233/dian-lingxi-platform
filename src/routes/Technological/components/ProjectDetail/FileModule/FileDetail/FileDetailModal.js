import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import {min_page_width} from "../../../../../../globalset/js/styles";
import CustormModal from '../../../../../../components/CustormModal'
import FileDetail from './index'
const FormItem = Form.Item
const TextArea = Input.TextArea


class FileDetailModal extends React.Component {
  state = {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onCancel(){
    this.props.updateDatas({
      isInOpenFile: false
    })
  }

  render() {
    const { visible  } = this.props;

    return(
      <CustormModal
        visible={visible}
        width={600}
        zIndex={1006}
        maskClosable={false}
        footer={null}
        destroyOnClose
        onCancel={this.onCancel.bind(this)}
        overInner={<FileDetail {...this.props} />}
      />
    )
  }
}
export default Form.create()(FileDetailModal)
