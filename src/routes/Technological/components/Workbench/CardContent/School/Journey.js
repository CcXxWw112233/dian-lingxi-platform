import React from 'react'
import indexstyles from '../../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../../utils/util'
import Cookies from 'js-cookie'

export default class Journey extends React.Component {
  render() {
    const { itemValue = {}, itemKey } = this.props
    const { name, start_time, due_time } = itemValue
    return (
      <div className={indexstyles.meetingItem}>
        <div>
          <Icon type="calendar" style={{fontSize: 16, color: '#8c8c8c'}}/>
        </div>
        <div>{'[会议]中国城市规划学科发展论坛'}<span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}}>2018-08-08 12:00</span></div>
      </div>
    )
  }
}
