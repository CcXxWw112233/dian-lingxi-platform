import React, { Component } from 'react'
import ProjectTempleteSchemeModal from './ProjectTempleteSchemeModal'
import { Modal } from 'antd'
import CustormModal from '@/components/CustormModal'

export default class index extends Component {

  onCancel = () => {
    this.props.setProjectTempleteSchemeModal && this.props.setProjectTempleteSchemeModal()
  }

  render() {
    const { project_templete_scheme_visible = true } = this.props
    return (
      <div>
        <Modal
          visible={project_templete_scheme_visible} //modalVisible
          width={'714px'}
          zIndex={1006}
          footer={null}
          destroyOnClose
          style={{width: '714px', height: '860px', overflowY: 'auto'}}
          maskClosable={false}
          onCancel={this.onCancel}
        >
          <ProjectTempleteSchemeModal />
        </Modal>
      </div>
    )
  }
}