import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'
import Cookies from 'js-cookie'

export default class MeetingItem extends React.Component {
  render() {
    const { itemValue = {} } = this.props
    const { board_id, board_name, file_name,create_time } = itemValue

    return (
      <div className={indexstyles.meetingItem}>
        <div>
          <Icon type="calendar" style={{fontSize: 16, color: '#8c8c8c'}}/>
        </div>
        <div>开会咯<span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}}>2018-88</span></div>
      </div>
    )
  }
}
