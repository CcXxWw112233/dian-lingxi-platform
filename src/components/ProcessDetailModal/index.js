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
        process_detail_modal_visible: false,
        currentFlowInstanceName: '', // 当前流程实例的名称
        currentFlowInstanceDescription: '', // 当前的实例描述内容
        isEditCurrentFlowInstanceName: true, // 是否正在编辑当前实例的名称
        isEditCurrentFlowInstanceDescription: false, // 是否正在编辑当前实例的描述
        processPageFlagStep: '1', // "1", "2", "3", "4" 分别对应 新建， 编辑， 启动
        processEditDatas:[],
        node_type: '1', // 当前的节点类型
        processCurrentEditStep: 0, // 当前的编辑步骤 第几步
        processCurrentCompleteStep: 0, // 当前处于的操作步骤
        templateInfo: {}, // 模板信息
        processInfo: [], // 流程实例信息
        currentProcessInstanceId: '', // 当前查看的流程实例名称
        currentTempleteIdentifyId: '', // 当前查看的模板ID
        not_show_create_node_guide: '1',
        not_show_create_form_guide: '1',
      }
    })
     // 圈子关闭联动
     global.constants.lx_utils && global.constants.lx_utils.setCommentData(this.props.processInfo.id || null)
  }

  commonDrawerContentOutClick = () => {
    const { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription } = this.props
    if (isEditCurrentFlowInstanceName) { // 如果操作的是实例名称
      if (currentFlowInstanceName != '') { // 表示输入了名称, 那么就可以隐藏输入框
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
    const { process_detail_modal_visible, whetherUpdateWorkbenchPorcessListData } = this.props
    return (
      <div>
        <PublicDetailModal
          modalVisible={process_detail_modal_visible}
          onCancel={this.onCancel}
          isNotShowFileDetailContentRightVisible={true}
          mainContent={<MainContent onCancel={this.onCancel}/>}
          headerContent={<HeaderContent onCancel={this.onCancel} whetherUpdateWorkbenchPorcessListData={whetherUpdateWorkbenchPorcessListData}/>}
          commonDrawerContentOutClick={this.commonDrawerContentOutClick}
          isNotShowFileDetailContentLeftScrollBar={true}
        />
      </div>
    )
  }
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicProcessDetailModal: { processInfo = {}, currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription } 
  
} ) {
 return { processInfo, currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription}
}
