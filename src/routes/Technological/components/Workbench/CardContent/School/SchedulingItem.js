import React from 'react'
import indexstyles from '../../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../../utils/util'
import Cookies from 'js-cookie'

export default class SchedulingItem extends React.Component {
  render() {
    const { itemValue = {}, itemKey } = this.props
    const { name, start_time, due_time } = itemValue
    return (
      <div className={indexstyles.meetingItem}>
        <div>
          <Icon type="calendar" style={{fontSize: 16, color: '#8c8c8c'}}/>
        </div>
        <div>{'城市规划设计-设计课'}<span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}}>@每周四 {'08:00'}~{'10:00'}</span></div>
      </div>
    )
  }
}
