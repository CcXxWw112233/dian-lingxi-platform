import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon, Avatar } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import {checkIsHasPermission, checkIsHasPermissionInBoard, setStorage} from "../../../utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_INTERVIEW, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_COMPLETE, ORG_TEAM_BOARD_QUERY, APP_KEY
} from "../../../globalset/js/constant";
import { timestampToTimeNormal } from '../../../utils/util'
import Cookies from "js-cookie";
import {connect} from "dva/index";

const FormItem = Form.Item
const TextArea = Input.TextArea

const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
@connect(mapStateToProps)
export default class TaskItem extends React.Component {
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
    const { dispatch } = this.props
    const { model = {} } = this.props
    const projectDetailBoardId = model['board_id']
    Cookies.remove('appsSelectKeyIsAreadyClickArray', { path: '' })
    dispatch({
      type: 'globalSearch/updateDatas',
      payload: {
        globalSearchModalVisible: false
      }
    })
    dispatch({
      type: 'globalSearch/routingJump',
      payload: {
        route: `/technological/projectDetail?board_id=${board_id}&appsSelectKey=${APP_KEY.CARD}&card_id=${id}`
      }
    })

  }
  itemOneClick(e) {
    e.stopPropagation();
    // const {
    //   datas: { responsibleTaskList = [] }
    // } = this.props.model;
    // const { itemValue = {}, itemKey } = this.props;
    // const { is_realize, board_id, board_name, name, id } = itemValue;
    // const obj = {
    //   card_id: id,
    //   is_realize: is_realize === "1" ? "0" : "1"
    // };
    // setStorage('board_id', board_id)
    // if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_COMPLETE)){
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    // responsibleTaskList[itemKey]["is_realize"] = is_realize === "1" ? "0" : "1";
    // this.props.updateDatas({ responsibleTaskList });
    // this.props.completeTask(obj);
  }
  render() {
    const { itemValue = {} } = this.props
    const { is_realize, id, board_id, name, create_time } = itemValue

    return(
      <div>
        <div className={indexstyles.taskItem}>
          <div
            className={is_realize === "1" ? indexstyles.nomalCheckBoxActive : indexstyles.nomalCheckBox}
            onClick={this.itemOneClick.bind(this)}>
            <Icon type="check" style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "bold" }}/>
          </div>
          <div className={indexstyles.itemName}>
            <div style={{textDecoration: is_realize === "1" ? "line-through" : "none"}} onClick={this.itemClick.bind(this, { id, board_id })}>
              {name}
            </div>
          </div>
          <div className={indexstyles.time}>{timestampToTimeNormal(create_time)}</div>
          {/*<div className={indexstyles.avatar}>*/}
            {/*<Avatar size={16} style={{padding: 0}}/>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}
function mapStateToProps({ projectDetail: { datas: { board_id } } }) {
  return {
    model: { board_id },
  }
}
