import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import FlowTabs from './FlowTabs'
import { connect } from 'dva'
import ProcessDetailModal from '../../../components/ProcessDetailModal'

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

  handleAddTemplete = (e) => {
    e && e.stopPropagation()
    this.props.handleAddTemplete && this.props.handleAddTemplete()
    return
    // this.setState({
    //   visible: true
    // })
    // return
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        process_detail_modal_visible: true,
      }
    })
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
          <FlowTabs />
        </div>
        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          {
            process_detail_modal_visible && (
              <ProcessDetailModal
                process_detail_modal_visible={process_detail_modal_visible}
                // getContainer={document.getElementById('workFlowTempleteContent')}
                getContainer={document.querySelector('body')}
              // getContainer={document.getElementById('org_managementContainer')}
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
