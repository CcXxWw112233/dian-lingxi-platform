import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import FlowTabs from './FlowTabs'
import { connect } from 'dva'
import ProcessDetailModal from '../../../components/ProcessDetailModal'
import { Modal } from 'antd'
import { showDeleteTempleteConfirm } from '../../../components/ProcessDetailModal/components/handleOperateModal'

@connect(mapStateToProps)
export default class WorkFlowTemplete extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: 'publicProcessDetailModal/getProcessTemplateList',
      payload: {
        _organization_id: localStorage.getItem('OrganizationId')
      }
    })
  }

  updateParentProcessTempleteList = () => {
    this.props.dispatch({
      type: 'publicProcessDetailModal/getProcessTemplateList',
      payload: {
        _organization_id: localStorage.getItem('OrganizationId')
      }
    })
  }

  // 新建模板
  handleAddTemplete = (e) => {
    e && e.stopPropagation()
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        process_detail_modal_visible: true,
      }
    })
  }

  // 编辑模板
  handleEditTemplete = (e, item) => {
    const { id, template_no } = item
    this.props.dispatch({
      type: 'publicProcessDetailModal/getTemplateInfo',
      payload: {
        id,
        processPageFlagStep: '2',
        currentTempleteIdentifyId: template_no,
        process_detail_modal_visible: true
      }
    })
  }

    // 删除流程模板的点击事件
    handleDelteTemplete = (e,item) => {
      const { dispatch } = this.props
      const { id } = item
      const processTempleteDelete = async () => {
        await dispatch({
          type: 'publicProcessDetailModal/deleteProcessTemplete',
          payload: {
            id,
            calback: () => {
              dispatch({
                type: 'publicProcessDetailModal/getProcessTemplateList',
                payload: {
                  _organization_id: localStorage.getItem('OrganizationId')
                }
              })
            }
          }
        })
      }
      showDeleteTempleteConfirm(processTempleteDelete)
    }

  render() {
    const { process_detail_modal_visible, isEditCurrentFlowInstanceName } = this.props
    return (
      <div id={'workFlowTempleteContent'} className={`${indexStyles.workFlowTempleteContent} ${globalStyles.global_vertical_scrollbar}`}>
        <div className={indexStyles.wflow_top}>
          <div className={indexStyles.wflow_name}>工作流模板</div>
          <div className={indexStyles.wflow_add_tem} onClick={this.handleAddTemplete}>
            <span>新建模板</span>
            <span className={globalStyles.authTheme}>&#xe846;</span>
          </div>
        </div>
        <div className={indexStyles.wflow_bottom}>
          <FlowTabs handleEditTemplete={this.handleEditTemplete} handleDelteTemplete={this.handleDelteTemplete} />
        </div>
        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          {
            process_detail_modal_visible && (
              <ProcessDetailModal
                process_detail_modal_visible={process_detail_modal_visible}
                // getContainer={document.getElementById('workFlowTempleteContent')}
                // getContainer={document.querySelector('body')}
              // getContainer={document.getElementById('org_managementContainer')}
                updateParentProcessTempleteList={this.updateParentProcessTempleteList}
                getContainer={document.getElementById('organizationOut')}
              />
            )
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    process_detail_modal_visible,
    processTemplateList = []
  },
  technological: {
    datas: {
      userOrgPermissions = []
    }
  }
}) {
  return {
    process_detail_modal_visible,
    processTemplateList,
    userOrgPermissions
  }
}
