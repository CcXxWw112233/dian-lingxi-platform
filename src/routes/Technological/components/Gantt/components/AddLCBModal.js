import React, { Component } from 'react'
import {
  Modal,
  Input,
  Button,
  message,
  Upload,
  Cascader,
  Tooltip,
  notification,
  DatePicker
} from 'antd'
import styles from './../../../components/Workbench/CardContent/Modal/AddTaskModal.less'
import { connect } from 'dva'
import {
  REQUEST_DOMAIN_BOARD,
  UPLOAD_FILE_SIZE
} from './../../../../../globalset/js/constant'
import {
  deleteUploadFile,
  getCurrentSelectedProjectMembersList
} from './../../../../../services/technological/workbench'
import DropdownSelectWithSearch from './../../../components/Workbench/CardContent/DropdownSelectWithSearch/index'
import DropdownMultipleSelectWithSearch from './../../../components/Workbench/CardContent/DropdownMultipleSelectWithSearch/index'
import DateRangePicker from './../../../components/Workbench/CardContent/DateRangePicker/index'
import Cookies from 'js-cookie'
import moment from 'moment'

import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_FILES_FILE_UPLOAD,
  PROJECT_FLOWS_FLOW_CREATE,
  PROJECT_TEAM_CARD_CREATE,
  PROJECT_TEAM_BOARD_MILESTONE
} from '../../../../../globalset/js/constant'
import {
  caldiffDays,
  timestampToTimeNormal,
  timeToTimestamp
} from '../../../../../utils/util'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import { checkIsHasPermissionInBoard } from '@/utils/businessFunction'
const taskTypeToName = {
  RESPONSIBLE_TASK: 'Tasks',
  EXAMINE_PROGRESS: 'Flows',
  MEETIMG_ARRANGEMENT: 'Tasks',
  MY_DOCUMENT: 'Files'
}
/* eslint-disable */
@connect(mapStateToProps)
class AddTaskModal extends Component {
  constructor(props) {
    super(props)
  }
  handleAddTaskModalCancel = () => {
    this.props.setAddLCBModalVisibile && this.props.setAddLCBModalVisibile()
  }
  render() {
    const {
      add_lcb_modal_visible,

      zIndex
    } = this.props

    // console.log('sssss_0', {
    //   current_selected_board,
    //   current_selected_users
    // } )

    return (
      <Modal
        visible={add_lcb_modal_visible}
        maskClosable={false}
        title={<div style={{ textAlign: 'center' }}>{'???????????????'}</div>}
        onCancel={this.handleAddTaskModalCancel}
        footer={null}
        destroyOnClose={true}
        zIndex={zIndex || 1000}
      >
        <AddTaskContent {...this.props}></AddTaskContent>
      </Modal>
    )
  }
}

class AddTaskContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      add_name: '',
      current_selected_board: this.props.current_selected_board || {},
      current_selected_users: [],
      due_time: ''
    }
  }
  componentDidMount() {
    const {
      create_lcb_time,
      board_id,
      about_user_boards = [],
      current_selected_board
    } = this.props

    const { due_time } = this.state
    if (create_lcb_time && due_time != create_lcb_time) {
      this.setState({
        due_time: create_lcb_time
      })
    }
    // ???????????????????????????
    if (board_id && board_id != '0') {
      const init_selected_board =
        about_user_boards.find(item => item.board_id == board_id) || {}
      this.setState({
        current_selected_board: current_selected_board || init_selected_board
      })
    }
  }
  handleSelectedItemChange = (list, type) => {
    this.setState(
      {
        current_selected_users: list
      },
      () => {
        console.log('ssssss_aa', {
          list,
          type
        })
        if ('inviteOthers' == type) {
          //?????????????????????
          let { current_selected_board } = this.state
          current_selected_board.users = [
            ...current_selected_board.users,
            ...list
          ]
          // ??????
          let temp = {} //??????name????????????
          let result = [] //??????????????????
          current_selected_board.users.map(item => {
            if (!temp[item.id]) {
              result.push(item)
              temp[item.id] = true
            }
          })
          current_selected_board.users = result
          // ??????
          this.setState({
            current_selected_board
          })
        }
      }
    )
  }

  datePickerChange(date, dateString) {
    const newDateString = dateString.replace(/-/gim, '/')
    if (!dateString) {
      return false
    }
    this.setState({
      due_time: timeToTimestamp(newDateString)
    })
  }

  handleAddTaskModalCancel = () => {
    this.setState({
      current_selected_board: {},
      due_time: '',
      add_name: ''
    })

    this.props.setAddLCBModalVisibile && this.props.setAddLCBModalVisibile()
  }

  isShouldNotDisableSubmitBtn = () => {
    const { current_selected_board = {} } = this.state
    const { board_id } = current_selected_board
    // console.log('sssssssssss', {current_selected_board})
    const { add_name, due_time } = this.state
    const isHasChooseBoard = () => !!!board_id
    const isHasTaskTitle = () => !!!add_name
    const isHasDueTime = () => !!!due_time
    return isHasTaskTitle() || isHasDueTime() || isHasChooseBoard()
  }

  handleAddTaskModalTaskTitleChange = e => {
    if (e.target.value.trimLR() == '') {
      this.setState({
        add_name: ''
      })
      return false
    }
    this.setState({
      add_name: e.target.value
    })
  }

  handleClickedSubmitBtn = hasPermission => {
    if (hasPermission) {
      message.warn(NOT_HAS_PERMISION_COMFIRN)
      return
    }
    const {
      current_selected_board = {},
      add_name,
      due_time,
      current_selected_users
    } = this.state
    const { board_id } = current_selected_board
    let users = []
    for (let val of current_selected_users) {
      users.push(val['id'] || val['user_id'])
    }
    const param = {
      currentSelectedProject: board_id,
      add_name,
      due_time,
      users
    }

    this.props.submitCreatMilestone && this.props.submitCreatMilestone(param)
    this.handleAddTaskModalCancel()
  }

  // -----------------
  getBoardName = board_id => {
    const { about_user_boards = [] } = this.props
    const board_name = (
      about_user_boards.find(item => item.board_id == board_id) || {}
    ).board_name
    return board_name || '????????????'
  }
  handleSelectedBoard = item => {
    this.setCurrentSelectedBoard(item)
  }
  setCurrentSelectedBoard = data => {
    this.setState({
      current_selected_board: data
    })
  }
  // ??????????????????
  inviteOthersToBoardCalbackRequest = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutUsersBoards',
      payload: {}
    })
  }
  disabledDate = (current, a, b) => {
    //???????????????????????????
    const { availableDate } = this.props //availableDate == [start, end]
    if (Object.prototype.toString.call(availableDate) !== '[object Array]') {
      //????????????????????????????????????????????????
      return false
    }
    const current_time = new Date(current._d).getTime()
    // ??????????????????true????????????
    return (
      availableDate[1] > availableDate[0] &&
      (current_time < availableDate[0] || current_time > availableDate[1])
    )
  }
  // ???????????????????????????????????????????????????
  defaultPickerValue = (a, b, c) => {
    const { availableDate } = this.props
    if (Object.prototype.toString.call(availableDate) !== '[object Array]') {
      //????????????????????????????????????????????????
      return moment(new Date())
    }
    return moment(availableDate[0])
  }
  render() {
    const {
      add_name,
      current_selected_board = {},
      current_selected_users,
      due_time
    } = this.state
    const {
      create_lcb_time,
      board_id,
      about_user_boards,
      gantt_view_mode,
      base_relative_time
    } = this.props
    let hasPermissionFlag = 0
    if (current_selected_board && current_selected_board.board_id) {
      if (
        checkIsHasPermissionInBoard(
          PROJECT_TEAM_BOARD_MILESTONE,
          current_selected_board.board_id
        )
      ) {
        hasPermissionFlag = 2
      } else {
        hasPermissionFlag = 1
      }
    }
    const hasPermission = !(
      current_selected_board &&
      current_selected_board.board_id &&
      checkIsHasPermissionInBoard(
        PROJECT_TEAM_BOARD_MILESTONE,
        current_selected_board.board_id
      )
    )
    return (
      <div className={styles.addTaskModalContent}>
        <div className={styles.addTaskModalSelectProject}>
          <div className={styles.addTaskModalSelectProject_and_groupList}>
            {/*??????????????????????????????id?????????????????????????????????????????????*/}
            {current_selected_board.board_id && board_id != '0' ? (
              <div
                className={styles.groupList__wrapper}
                style={{ marginLeft: 0 }}
              >
                <span
                  className={globalStyles.authTheme}
                  style={{ marginRight: 2, fontSize: 18 }}
                >
                  &#xe60a;
                </span>
                {current_selected_board.board_name}
              </div>
            ) : (
              <DropdownSelectWithSearch
                list={about_user_boards}
                _organization_id={current_selected_board.org_id}
                initSearchTitle="????????????"
                selectedItem={current_selected_board}
                handleSelectedItem={this.handleSelectedBoard}
                isShouldDisableDropdown={false}
              />
            )}
          </div>

          {/*????????????*/}
          {gantt_view_mode == 'relative_time' ? (
            'T' + ' + ' + caldiffDays(base_relative_time, create_lcb_time)
          ) : (
            <div>
              {create_lcb_time ? (
                timestampToTimeNormal(create_lcb_time, '/', true)
              ) : (
                <div style={{ position: 'relative' }}>
                  {timestampToTimeNormal(due_time, '/', true) || '??????????????????'}
                  <DatePicker
                    // defaultValue={() => moment(this.props.availableDate[0])}
                    defaultPickerValue={this.defaultPickerValue()}
                    disabledDate={this.disabledDate}
                    onChange={this.datePickerChange.bind(this)}
                    placeholder={'??????????????????'}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD 23:59"
                    style={{
                      opacity: 0,
                      height: 16,
                      minWidth: 0,
                      maxWidth: '100px',
                      background: '#000000',
                      position: 'absolute',
                      right: 0,
                      zIndex: 2,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.addTaskModalTaskTitle}>
          <Input
            value={add_name}
            onChange={this.handleAddTaskModalTaskTitleChange}
          />
        </div>
        {/*?????????*/}
        <div className={styles.addTaskModalFooter}>
          <div className={styles.addTaskModalOperator}>
            <DropdownMultipleSelectWithSearch
              itemTitle={'?????????'}
              board_id={current_selected_board.board_id}
              list={current_selected_board.users || []}
              handleSelectedItemChange={this.handleSelectedItemChange}
              inviteOthersToBoardCalbackRequest={
                this.inviteOthersToBoardCalbackRequest
              }
              current_selected_users={current_selected_users}
            />
          </div>
          <div className={styles.confirmBtn}>
            <Button
              type="primary"
              disabled={this.isShouldNotDisableSubmitBtn()}
              title={hasPermissionFlag == 1 ? '???????????????????????????' : ''}
              onClick={() => this.handleClickedSubmitBtn(hasPermission)}
            >
              ??????
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default AddTaskModal

function mapStateToProps({
  gantt: {
    datas: { gantt_view_mode, base_relative_time }
  },
  technological: {
    datas: { userBoardPermissions }
  }
}) {
  return {
    gantt_view_mode,
    base_relative_time,
    userBoardPermissions
  }
}
