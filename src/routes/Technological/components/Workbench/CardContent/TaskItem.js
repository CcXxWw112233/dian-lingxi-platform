import React from "react";
import indexstyles from "../index.less";
import { Icon, Tooltip} from "antd";
import Cookies from "js-cookie";
import { timestampToTimeNormal2 } from './../../../../../utils/util'
import { checkIsHasPermissionInBoard, setStorage, checkIsHasPermission } from './../../../../../utils/businessFunction'
import {message} from "antd/lib/index";
import { MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_COMPLETE, PROJECT_TEAM_CARD_INTERVIEW, ORG_TEAM_BOARD_QUERY } from "../../../../../globalset/js/constant";

export default class TaskItem extends React.Component {
  itemOneClick(e) {
    e.stopPropagation();
    const {
      datas: { responsibleTaskList = [] }
    } = this.props.model;
    const { itemValue = {}, itemKey } = this.props;
    const { is_realize, board_id, board_name, name, id } = itemValue;
    const obj = {
      card_id: id,
      is_realize: is_realize === "1" ? "0" : "1"
    };
    setStorage('board_id', board_id)
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_COMPLETE)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    responsibleTaskList[itemKey]["is_realize"] = is_realize === "1" ? "0" : "1";
    this.props.updateDatas({ responsibleTaskList });
    this.props.completeTask(obj);
  }
  gotoBoardDetail({ id, board_id }, e) {
    // Cookies.set('board_id', board_id, {expires: 30, path: ''})
    setStorage('board_id', board_id)
    if(!checkIsHasPermission(ORG_TEAM_BOARD_QUERY)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.routingJump(
      `/technological/projectDetail?board_id=${board_id}&appsSelectKey=3&card_id=${id}`
    );
  }
  itemClick(data, e) {
    const { id, board_id } = data;
    setStorage('board_id', board_id)
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.updatePublicDatas({ board_id });
    this.props.getCardDetail({ id, board_id });
    this.props.setTaskDetailModalVisibile();
    // debugger
    this.props.dispatch({
      type: 'workbenchTaskDetail/getCardCommentListAll',
      payload: {
        id: id
      }
    })
  }
  render() {
    const { itemValue = {}, isUsedInWorkbench } = this.props;
    const { is_realize, board_id, board_name, name, id } = itemValue;

    //父级任务
    let parentCards = [];
    const returnParentCard = value => {
      const { parent_card } = value;
      if (parent_card) {
        const { name, id, board_id } = parent_card;
        parentCards.push({
          board_id,
          id,
          name
        });
        returnParentCard(parent_card);
      }
    };
    returnParentCard(itemValue);

    const transItemValueTimestampToDate = timestampToTimeNormal2(itemValue.create_time)
    const DateNoTimeStr = transItemValueTimestampToDate ? transItemValueTimestampToDate.split(' ')[0] : null

    const renderInWorkbench = (
      <div className={indexstyles.taskItem__workbench_wrapper}>
        <span
          className={
            `
            ${indexstyles.taskItem__workbench_check}
            ${is_realize === "1"
            ? indexstyles.nomalCheckBoxActive
            : indexstyles.nomalCheckBox}
            `
          }
          onClick={this.itemOneClick.bind(this)}
        >
          <Icon
            type="check"
            style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "bold" }}
          />
        </span>
        <div
          className={indexstyles.taskItem__workbench_content}
        >
          <Tooltip title={name}>
          <div
            className={indexstyles.taskItem__workbench_content_title}
            style={{
              textDecoration: is_realize === "1" ? "line-through" : "none"
            }}
            onClick={this.itemClick.bind(this, { id, board_id })}
          >
            {name}
          </div>
          </Tooltip>
          <div className={indexstyles.taskItem__workbench_content_hier}>
          {parentCards.map((value, key) => {
            const { name, id, board_id } = value;
            return (
              <span
                style={{ marginLeft: 6, color: "#8c8c8c", cursor: "pointer" }}
                key={key}
                onClick={this.itemClick.bind(this, { id, board_id })}
              >{`< ${name}`}</span>
            );
          })}
          </div>
          <Tooltip title={board_name}>
          <div
          className={indexstyles.taskItem__workbench_content_projectname}
            style={{ marginLeft: 6, color: "#8c8c8c", cursor: "pointer" }}
            onClick={this.gotoBoardDetail.bind(this, { id, board_id })}
          >
            #{board_name}
          </div>
          </Tooltip>
        </div>
        <span className={indexstyles.taskItem__workbench_time}>
          {DateNoTimeStr}
        </span>
      </div>
    );
    if (isUsedInWorkbench) {
      return renderInWorkbench;
    }

    return (
      <div className={indexstyles.taskItem}>
        <div
          className={
            is_realize === "1"
              ? indexstyles.nomalCheckBoxActive
              : indexstyles.nomalCheckBox
          }
          onClick={this.itemOneClick.bind(this)}
        >
          <Icon
            type="check"
            style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "bold" }}
          />
        </div>
        <div>
          <span
            style={{
              textDecoration: is_realize === "1" ? "line-through" : "none"
            }}
            onClick={this.itemClick.bind(this, { id, board_id })}
          >
            {name}
          </span>
          {parentCards.map((value, key) => {
            const { name, id, board_id } = value;
            return (
              <span
                style={{ marginLeft: 6, color: "#8c8c8c", cursor: "pointer" }}
                key={key}
                onClick={this.itemClick.bind(this, { id, board_id })}
              >{`< ${name}`}</span>
            );
          })}
          <span
            style={{ marginLeft: 6, color: "#8c8c8c", cursor: "pointer" }}
            onClick={this.gotoBoardDetail.bind(this, { id, board_id })}
          >
            #{board_name}
          </span>
        </div>
      </div>
    );
  }
}
