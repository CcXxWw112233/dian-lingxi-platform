import React from 'react'
import { Icon, Modal, message } from 'antd'
import Settings from '../../components/headerOperate'
import {
  showConfirm,
  showDeleteConfirm
} from '../../components/headerOperateModal'
import { PROJECT_FLOWS_FLOW_ABORT } from '../../globalset/js/constant'
import { checkIsHasPermissionInBoard } from '../../utils/businessFunction'

export default class Header extends React.Component {
  state = {
  }

  cancleModal = () => {
    this.props.onCancel && this.props.onCancel()
  }

  render() {

    return (
      <div style = {{
        height: '40px',
        lineHeight: '40px',
        background: 'rgba(255,255,255,1)',
        borderBottom: '1px solid rgba(0,0,0,.04)',
        // borderBottom: '1px solid #E8E8E8',
        borderRadius: '4px 4px 0px 0px'}}>
        <div style={{
          width: '237px',
          height: '24px',
          background: 'rgba(245,245,245,1)',
          borderRadius: '4px',
          textAlign: 'center',
          lineHeight: '24px',
          float: 'left'
        }}>
          <span style={{cursor: 'pointer', color: '##8C8C8C', fontSize: '14px'}}>示例项目</span>
          <span style={{color: '##8C8C8C', fontSize: '14px'}}> > </span>
          <span style={{cursor: 'pointer', color: '##8C8C8C', fontSize: '14px'}}>任务看板分组名称</span>
        </div>

        <div style={{}}>
          <Icon type="close" style={{float: 'right', marginRight: '20px', fontSize: '16px', cursor: 'pointer'}} onClick={this.cancleModal} />
          <span
            style={{
              float: 'right',
              marginTop: '-5px',
              // marginLeft: this.isVisitControlOpen() ? '0px' : '10px',
              // marginRight: this.isVisitControlOpen() ? '45px' : '20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            </span>
          <Icon type="download" onClick = {() => {console.log(1)}} style={{float: 'right', marginRight: '20px', fontSize: '16px', cursor: 'pointer'}}/>
        </div>
      </div>
    )
  }
}
