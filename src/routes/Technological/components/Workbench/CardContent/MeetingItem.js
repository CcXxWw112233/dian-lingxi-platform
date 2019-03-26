import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'
import Cookies from 'js-cookie'
import {checkIsHasPermissionInBoard, setStorage} from "../../../../../utils/businessFunction";
import {message} from "antd/lib/index";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_INTERVIEW
} from "../../../../../globalset/js/constant";

export default class MeetingItem extends React.Component {

  itemClick(e) {
    const { itemValue = {} } = this.props
    const { id, board_id } = itemValue
    setStorage('board_id', board_id)
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.updatePublicDatas({ board_id })
    this.props.getCardDetail({id, board_id})
    this.props.setTaskDetailModalVisibile()
  }

  render() {
    const { itemValue = {}, itemKey } = this.props
    const { name, start_time, due_time } = itemValue
    return (
      <div className={indexstyles.meetingItem} onClick={this.itemClick.bind(this)} >
        <div>
          <Icon type="calendar" style={{fontSize: 16, color: '#8c8c8c'}}/>
        </div>
        <div>{name}<span style={{marginLeft: 6, color: '#8c8c8c', cursor: 'pointer'}}>{`${timestampToTimeNormal(start_time, '', true)}~${timestampToTimeNormal(due_time, '', true)}`}</span></div>
      </div>
    )
  }
}
