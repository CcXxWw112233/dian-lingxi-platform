import React from 'react'
import indexstyles from '../index.less'
import { Icon, Tooltip } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { timestampToTimeNormal } from '../../../../../utils/util'
import Cookies from 'js-cookie'
import {checkIsHasPermissionInBoard, setBoardIdStorage, getOrgNameWithOrgIdFilter} from "../../../../../utils/businessFunction";
import {message} from "antd/lib/index";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_INTERVIEW
} from "../../../../../globalset/js/constant";
import { connect } from 'dva'

@connect(({technological: { datas: { currentUserOrganizes = [], is_show_org_name } }}) => ({
  currentUserOrganizes, is_show_org_name
}))
export default class MeetingItem extends React.Component {

  itemClick(e) {
    const { itemValue = {} } = this.props
    const { id, board_id } = itemValue
    setBoardIdStorage(board_id)

    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.updatePublicDatas({ board_id })
    this.props.getCardDetail({id, board_id})
    this.props.setTaskDetailModalVisibile()
    this.props.dispatch({
      type: 'workbenchTaskDetail/getCardCommentListAll',
      payload: {
        id: id
      }
    })
  }


  render() {
    const { itemValue = {}, itemKey, currentUserOrganizes = [], is_show_org_name } = this.props
    const { name, start_time, due_time, org_id } = itemValue
    // console.log(itemValue, 'sss')
    return (
      <div className={indexstyles.meetingItem} onClick={this.itemClick.bind(this)} >
        <div>
          <Icon type="calendar" style={{fontSize: 16, color: '#8c8c8c'}}/>
        </div>
        <div style={{display: 'flex'}}>
          {name}
          
          <span style={{marginLeft: 6, color: '#8c8c8c', cursor: 'pointer'}}>{`${timestampToTimeNormal(start_time, '', true)}~${timestampToTimeNormal(due_time, '', true)}`}</span></div>
      </div>
    )
  }
}
