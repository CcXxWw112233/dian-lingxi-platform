import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class ProcessDetailModal extends Component {

  onCancel = () => {
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        process_detail_modal_visible: false
      }
    })
  }

  commonDrawerContentOutClick = () => {
    const { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription } = this.props
    console.log(currentFlowInstanceName && currentFlowInstanceName.trim() != '', 'ssssssssssssssssssssssssss_currentFlowInstanceName')
    if (isEditCurrentFlowInstanceName) { // 如果操作的是实例名称
      if (currentFlowInstanceName.trim() != '') { // 表示输入了名称, 那么就可以隐藏输入框
        this.props.dispatch({
          type: 'publicProcessDetailModal/updateDatas',
          payload: {
            isEditCurrentFlowInstanceName: false
          }
        })
      } else {
        this.props.dispatch({
          type: 'publicProcessDetailModal/updateDatas',
          payload: {
            isEditCurrentFlowInstanceName: true
          }
        })
      }
    }  
    if (isEditCurrentFlowInstanceDescription) { // 如果操作的是编辑描述
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          isEditCurrentFlowInstanceDescription: false
        }
      })
    }
    
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

//  只关联public中弹窗内的数据
function mapStateToProps({ publicProcessDetailModal: { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription } 
  
} ) {
 return { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription}
}
