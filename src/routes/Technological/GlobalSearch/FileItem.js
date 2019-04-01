import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon, Avatar } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import {checkIsHasPermissionInBoard, setStorage} from "../../../utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_INTERVIEW, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_COMPLETE
} from "../../../globalset/js/constant";
const FormItem = Form.Item
const TextArea = Input.TextArea

const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
export default class AnotherItem extends React.Component {
  state = {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  itemClick(data, e) {
    const { id, board_id } = data;
    setStorage('board_id', board_id)
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
  }
  itemOneClick(e) {
    e.stopPropagation();
  }
  render() {
    const { itemValue = {} } = this.props
    const { is_realize, id, board_id, file_name, file_id } = itemValue

    return(
      <div>
        <div className={indexstyles.taskItem}>
          <div className={globalStyles.authTheme}>&#xe709;</div>
          <div className={indexstyles.itemName}>
            <div style={{textDecoration: is_realize === "1" ? "line-through" : "none"}} onClick={this.itemClick.bind(this, { id, board_id })}>
              {file_name}
            </div>
          </div>
          <div className={indexstyles.time}>2018/08/08</div>
          <div className={indexstyles.avatar}>
            <Avatar size={16} style={{padding: 0}}/>
          </div>
        </div>
      </div>
    )
  }
}
