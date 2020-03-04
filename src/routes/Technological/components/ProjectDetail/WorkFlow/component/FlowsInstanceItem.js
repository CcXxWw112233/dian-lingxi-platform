import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from '../index.less'

export default class FlowsInstanceItem extends Component {
  render() {
    return (
      <div className={indexStyles.flowsInstanceItemContent}>
        <div className={indexStyles.flowsInstanceItem_left}>
          <span style={{color: '#40A9FF'}} className={`${globalStyles.authTheme}`}>&#xe68c;</span>
          <span className={indexStyles.flow_instance_name}>流程实例名称</span>
          <sapn className={indexStyles.current_step}>当前步骤 (2/5) : </sapn>
          <span className={indexStyles.current_step_name}>当前步骤名称</span>
        </div>
        <div className={indexStyles.flowsInstanceItem_right}>
          <span className={indexStyles.current_step}>当前步骤完成期限 : </span>
          <span className={indexStyles.date_line}>剩余1天</span>
        </div>
      </div>
    )
  }
}
