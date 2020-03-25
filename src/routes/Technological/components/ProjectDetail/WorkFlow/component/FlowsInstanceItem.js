import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from '../index.less'
export default class FlowsInstanceItem extends Component {

  handleProcessInfo = (id) => {
    this.props.handleProcessInfo && this.props.handleProcessInfo(id)
  }

  render() {
    const { itemValue } = this.props
    const { id, name, total_node_num, total_node_name, completed_node_num, deadline_value } = itemValue
    return (
      <div onClick={() => { this.handleProcessInfo(id) }} className={indexStyles.flowsInstanceItemContent}>
        <div className={indexStyles.flowsInstanceItem_left}>
          <span style={{color: '#40A9FF'}} className={`${globalStyles.authTheme}`}>&#xe68c;</span>
          <span className={indexStyles.flow_instance_name}>{name}</span>
          <sapn className={indexStyles.current_step}>当前步骤({completed_node_num}/{total_node_num}) : </sapn>
          <span className={indexStyles.current_step_name}>{total_node_name}</span>
        </div>
        <div className={indexStyles.flowsInstanceItem_right}>
          <span className={indexStyles.current_step}>当前步骤完成期限 : </span>
          <span className={indexStyles.date_line}>剩余1天</span>
        </div>
      </div>
    )
  }
}
