import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'
import { connect } from 'dva'

@connect()
export default class ProcessDetailModal extends Component {

  onCancel = () => {
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        process_detail_modal_visible: false
      }
    })
  }

  render() {
    const { process_detail_modal_visible } = this.props
    return (
      <div>
        <PublicDetailModal
          modalVisible={process_detail_modal_visible}
          onCancel={this.onCancel}
          isNotShowFileDetailContentRightVisible={true}
          mainContent={<MainContent />}
          headerContent={<HeaderContent />}
          commonDrawerContentOutClick={this.commonDrawerContentOutClick}
        />
      </div>
    )
  }
}
