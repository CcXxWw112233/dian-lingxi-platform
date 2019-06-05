import React, { Component } from 'react';
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
} from 'antd';
import styles from './../../../components/Workbench/CardContent/Modal/AddTaskModal.less';
import { connect } from 'dva';
import {
  REQUEST_DOMAIN_BOARD,
  UPLOAD_FILE_SIZE
} from './../../../../../globalset/js/constant';
import { deleteUploadFile, getCurrentSelectedProjectMembersList } from './../../../../../services/technological/workbench';
import DropdownSelectWithSearch from './../../../components/Workbench/CardContent/DropdownSelectWithSearch/index';
import DropdownMultipleSelectWithSearch from './../../../components/Workbench/CardContent/DropdownMultipleSelectWithSearch/index';
import DateRangePicker from './../../../components/Workbench/CardContent/DateRangePicker/index';
import Cookies from 'js-cookie';
import {
  checkIsHasPermissionInBoard,
  setStorage
} from '../../../../../utils/businessFunction';
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_FILES_FILE_UPLOAD,
  PROJECT_FLOWS_FLOW_CREATE,
  PROJECT_TEAM_CARD_CREATE
} from '../../../../../globalset/js/constant';
import {timestampToTimeNormal, timeToTimestamp} from "../../../../../utils/util";
import globalStyles from '../../../../../globalset/css/globalClassName.less'

const taskTypeToName = {
  RESPONSIBLE_TASK: 'Tasks',
  EXAMINE_PROGRESS: 'Flows',
  MEETIMG_ARRANGEMENT: 'Tasks',
  MY_DOCUMENT: 'Files'
};
/* eslint-disable */
@connect(({ workbench }) => ({ workbench }))
class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add_name: '',
      currentSelectedProject: '',
      currentSelectedProjectMember: [],
      due_time: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    const { create_lcb_time, boardId } = nextProps
    const { due_time } = this.state
    if(due_time != create_lcb_time) {
      this.setState({
        due_time: create_lcb_time
      })
    }
    this.setState({
      currentSelectedProject: boardId
    })
  }
  handleSelectedItemChange = list => {
    this.setState({
      currentSelectedProjectMember: list
    });
  };

  datePickerChange(date, dateString) {
    if(!dateString) {
      return false
    }
    this.setState({
      due_time: timeToTimestamp(dateString)
    })
  }

  handleAddTaskModalCancel = () => {
    this.setState({
      currentSelectedProject: {},
      due_time: '',
      add_name: ''
    });

    this.props.setAddLCBModalVisibile && this.props.setAddLCBModalVisibile()
  };

  isShouldNotDisableSubmitBtn = () => {
    const {
      add_name,
      due_time,
    } = this.state;
    const isHasTaskTitle = () => !!!add_name
    const isHasDueTime = () => !!!due_time
    return isHasTaskTitle() || isHasDueTime()
  }

  handleAddTaskModalTaskTitleChange = e => {
    this.setState({
      add_name: e.target.value
    });
  };

  handleClickedSubmitBtn = () => {
    const { currentSelectedProject, add_name, due_time, currentSelectedProjectMember } = this.state
    let users = []
    for(let val of currentSelectedProjectMember) {
      users.push(val['id'])
    }
    const param = {
      currentSelectedProject, add_name, due_time,users
    }

    this.props.submitCreatMilestone && this.props.submitCreatMilestone(param)
    this.handleAddTaskModalCancel()
  }

  render() {
    const {
      add_name,
      currentSelectedProject,
      currentSelectedProjectMember,
      due_time,
    } = this.state;
    const {
      add_lcb_modal_visible,
      userList,
      boardId,
      boardName,
      create_lcb_time
    } = this.props;

    return (
      <Modal
        visible={add_lcb_modal_visible}
        maskClosable={false}
        title={<div style={{ textAlign: 'center' }}>{'新建里程碑'}</div>}
        onOk={this.handleAddTaskModalOk}
        onCancel={this.handleAddTaskModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles.addTaskModalContent}>
          <div className={styles.addTaskModalSelectProject}>
            <div className={styles.addTaskModalSelectProject_and_groupList}>
              {/*在甘特图中传递了项目id的情况下，会固定不允许选择项目*/}
              <div>
                <span className={globalStyles.authTheme} style={{marginRight: 4, fontSize: 16}}>&#xe60a;</span>{boardName}
              </div>
            </div>

            {/*时间选择*/}
            <div>
              {create_lcb_time?timestampToTimeNormal(create_lcb_time, '/', true): (
                <div style={{position: 'relative' }}>
                  {timestampToTimeNormal(due_time, '/', true) || '设置截止时间'}
                  <DatePicker onChange={this.datePickerChange.bind(this)}
                              placeholder={'选择截止时间'}
                              showTime
                              format="YYYY-MM-DD HH:mm"
                              style={{opacity: 0, height: 16, minWidth: 0, maxWidth: '100px', background: '#000000', position: 'absolute', right: 0, zIndex: 2, cursor: 'pointer'}} />
                </div>
              )}
            </div>

          </div>
          <div className={styles.addTaskModalTaskTitle}>
            <Input
              value={add_name}
              onChange={this.handleAddTaskModalTaskTitleChange}
            />
          </div>
          {/*参与人*/}
          <div className={styles.addTaskModalFooter}>
            <div className={styles.addTaskModalOperator}>
              <DropdownMultipleSelectWithSearch
                itemTitle={'参与人'}
                list={userList}
                handleSelectedItemChange={this.handleSelectedItemChange}
                currentSelectedProjectMember={currentSelectedProjectMember}
              />
            </div>
            <div className={styles.confirmBtn}>
              <Button
                type="primary"
                disabled={this.isShouldNotDisableSubmitBtn()}
                onClick={this.handleClickedSubmitBtn}>
                完成
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddTaskModal;
