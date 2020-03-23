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
        // processDoingList: [], // 进行中的流程
        // processStopedList: [], // 已中止的流程
        // processComepletedList: [], // 已完成的流程
        // processNotBeginningList: [], // 未开始的流程
        // processEditDatas: JSON.parse(JSON.stringify(processEditDatasConstant)), //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
        processEditDatas:[],
        processEditDatasRecords: [],
        // processEditDatasRecords: JSON.parse(JSON.stringify(processEditDatasRecordsConstant)), //每一步的每一个类型，记录，数组的全部数据step * type
        node_type: '1', // 当前的节点类型
        processCurrentEditStep: 0, // 当前的编辑步骤 第几步
        processCurrentCompleteStep: 0, // 当前处于的操作步骤
        templateInfo: {}, // 模板信息
        processInfo: [], // 流程实例信息
        currentProcessInstanceId: '', // 当前查看的流程实例名称
        currentTempleteInfoId: '', // 当前查看的模板ID
      }
    })
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
    const { process_detail_modal_visible } = this.props
    return (
      <div>
        <PublicDetailModal
          modalVisible={process_detail_modal_visible}
          onCancel={this.onCancel}
          isNotShowFileDetailContentRightVisible={true}
          mainContent={<MainContent onCancel={this.onCancel}/>}
          headerContent={<HeaderContent />}
          commonDrawerContentOutClick={this.commonDrawerContentOutClick}
          isNotShowFileDetailContentLeftScrollBar={true}
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
