import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon, message } from 'antd'
import { FLOWS, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME, PROJECT_FLOW_FLOW_ACCESS } from '@/globalset/js/constant'
import { connect } from 'dva'
import indexStyles from './index.less'
import ConfigureProcess from './components/ConfigureProcess'
import EditProcess from './components/EditProcess'
import ProcessStartConfirm from './components/ProcessStartConfirm'

@connect(mapStateToProps)
export default class MainContent extends Component {

  renderProcessPageFlagStep = () => {
    const { processPageFlagStep } = this.props
    let container = <div></div>
    switch (processPageFlagStep) {
      case '1': // 新建模板
        container = <ConfigureProcess />
        break;
      case '2': // 编辑模板
        container = <EditProcess />
        break;
      case '3': // 启动流程
        container = <ProcessStartConfirm />
        break;
      default:
        container = <div></div>
        break;
    }
    return container
  }

  render() {
    const { } = this.props
    return (
      <div className={indexStyles.main_wrapper}>
        {this.renderProcessPageFlagStep()}
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processPageFlagStep } }) {
  return { processPageFlagStep }
}
