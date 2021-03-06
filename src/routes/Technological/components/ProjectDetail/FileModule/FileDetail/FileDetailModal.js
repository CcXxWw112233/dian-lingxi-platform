import React from 'react'
import { Form, Input } from 'antd'
import CustormModal from '../../../../../../components/CustormModal'
import FileDetail from './index'
const FormItem = Form.Item
const TextArea = Input.TextArea

class FileDetailModal extends React.Component {
  state = {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onCancel() {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        isInOpenFile: false
      }
    })
  }

  render() {
    const { visible } = this.props

    const modalTop = 20

    return (
      <CustormModal
        visible={visible}
        width={'80%'}
        // height={600}
        zIndex={1006}
        closable={false}
        maskClosable={false}
        footer={null}
        destroyOnClose
        bodyStyle={{ top: 0 }}
        style={{ top: modalTop }}
        onCancel={this.onCancel.bind(this)}
        overInner={<FileDetail {...this.props} modalTop={modalTop} />}
      />
    )
  }
}
export default FileDetailModal
