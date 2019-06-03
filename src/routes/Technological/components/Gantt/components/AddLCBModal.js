import React, { Component } from 'react';
import {
  Modal,
  Input,
  Button,
  message,
  Upload,
  Cascader,
  Tooltip,
  notification
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
    const {
      projectList,
      workbench: {
        datas: {
          projectTabCurrentSelectedProject,
          currentSelectedProjectFileFolderList
        }
      },
      taskType,
      isUseInGantt,
      projectIdWhenUseInGantt,
      projectGroupListId,
      projectGroupLists,
      currentSelectedprojectMemberListWhenUseInGantt,
    } = this.props;
    const rootFileFolder =
      currentSelectedProjectFileFolderList &&
      currentSelectedProjectFileFolderList.parent_id === '0' &&
      currentSelectedProjectFileFolderList.folder_id;
    const findAndCheckCurrentSelectedProject = where => {
      const result = projectList.find(
        item =>
          item.board_id === where &&
          item.apps &&
          item.apps.find(i => i.code === taskTypeToName[taskType])
      );
      return result ? result : {};
    };
    const getCurrentSelectedProject = (
      isUseInGantt,
      projectIdWhenUseInGantt,
      projectTabCurrentSelectedProject
    ) => {
      if (isUseInGantt) {
        return findAndCheckCurrentSelectedProject(projectIdWhenUseInGantt);
      }
      return findAndCheckCurrentSelectedProject(
        projectTabCurrentSelectedProject
      );
    };
    const getCurrentSelectedProjectGroupListItem = (isUseInGantt, projectGroupListId, projectGroupLists, projectIdWhenUseInGantt) => {
      if (!isUseInGantt) return {}
      if (!projectGroupListId || !(projectGroupLists && projectGroupLists.length)) return {}
      let list_data = (projectGroupLists.find(i => i.board_id == projectIdWhenUseInGantt) || {}).list_data || []
      const list_data_item = list_data.find(i => i.list_id == projectGroupListId) || {}
      return list_data_item
    }

    const getCurrentSelectedProjectMember = (isUseInGantt, currentSelectedprojectMemberListWhenUseInGantt) => {
      if(isUseInGantt) {
        return currentSelectedprojectMemberListWhenUseInGantt
      }
      return []
    }
    this.state = {
      add_name: '',
      currentSelectedProject: getCurrentSelectedProject(
        isUseInGantt,
        projectIdWhenUseInGantt,
        projectTabCurrentSelectedProject
      ),
      currentSelectedProjectMember: getCurrentSelectedProjectMember(isUseInGantt, currentSelectedprojectMemberListWhenUseInGantt),
      start_time: '',
      due_time: '',
      attachment_fileList: [],
      currentSelectedFileFolder: rootFileFolder ? [rootFileFolder] : [''],
      currentSelectedProjectGroupListItem: getCurrentSelectedProjectGroupListItem(isUseInGantt, projectGroupListId, projectGroupLists, projectIdWhenUseInGantt)
    };
  }
  handleDateRangeChange = dateRange => {
    const [start_time, due_time] = dateRange;
    this.setState({
      start_time: start_time,
      due_time: due_time
    });
  };

  handleAddTaskModalOk = () => {};

  handleAddTaskModalCancel = () => {
    //取消之后回归公共tab_bar board_id到缓存
    const {
      datas: { projectTabCurrentSelectedProject }
    } = this.props.workbench;
    setStorage('board_id', projectTabCurrentSelectedProject);

    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectMembersList'
    });
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectFileFolderList'
    });
    this.setState({
      add_name: '',
      currentSelectedProject: {},
      start_time: '',
      due_time: '',
      attachment_fileList: [],
      currentSelectedFileFolder: ['']
    });
    const { addTaskModalVisibleChange } = this.props;
    addTaskModalVisibleChange(false);
  };

  handleSelectedProjectGroupItem = item => {
    this.setState({
      currentSelectedProjectGroupListItem: item
    });
  };

  handleSelectedItem = item => {
    const {
      dispatch,
      taskType,
      projectGroupLists,
      handleShouldUpdateProjectGroupList
    } = this.props;

    this.setState(
      {
        currentSelectedProject: item,
        currentSelectedProjectGroupListItem: {}
      },
      () => {
        dispatch({
          type: 'workbench/fetchCurrentSelectedProjectMembersList',
          payload: {
            projectId: item.board_id
          }
        });
        //更新任务分组信息，修复如果是直接新创建的项目，不能马上拿到分组信息的 bug
        if (
          taskType === 'RESPONSIBLE_TASK' ||
          taskType === 'MEETIMG_ARRANGEMENT'
        ) {
          handleShouldUpdateProjectGroupList();
        }
        if (taskType === 'MY_DOCUMENT') {
          Promise.resolve(
            dispatch({
              type: 'workbench/fetchCurrentSelectedProjectFileFolderList',
              payload: {
                board_id: item.board_id
              }
            })
          ).then(() => {
            this.handleDefaultSelectProjectFileFolder();
          });
        }
      }
    );
  };

  handleDefaultSelectProjectFileFolder = () => {
    const {
      workbench: {
        datas: { currentSelectedProjectFileFolderList }
      }
    } = this.props;
    const rootFileFolder =
      currentSelectedProjectFileFolderList &&
      currentSelectedProjectFileFolderList.parent_id === '0' &&
      currentSelectedProjectFileFolderList.folder_id;
    if (!rootFileFolder) {
      message.error('当前项目没有根目录文件夹');
      this.setState({
        currentSelectedFileFolder: ['']
      });
    }
    this.setState({
      currentSelectedFileFolder: [rootFileFolder]
    });
  };

  getNewTaskParams = () => {
    const { taskType } = this.props;
    const {
      add_name,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
      currentSelectedProjectGroupListItem
    } = this.state;
    const taskObj = {
      add_type: 1, //默认0， 按分组1
      board_id: currentSelectedProject.board_id,
      name: add_name,
      type: 0,
      users: currentSelectedProjectMember.reduce((acc, curr) => {
        return acc ? acc + ',' + curr.id : curr.id;
      }, ''),
      list_id: currentSelectedProjectGroupListItem.board_id
        ? currentSelectedProjectGroupListItem.board_id
        : ''
    };
    if (taskType === 'MEETIMG_ARRANGEMENT') {
      return Object.assign({}, taskObj, { start_time, due_time, type: 1 });
    }
    return taskObj;
  };

  handleClickedSubmitBtn = e => {
    e.stopPropagation();
    const { taskType, isUseInGantt } = this.props;
    //权限控制
    let authCode = '';
    switch (taskType) {
      case 'RESPONSIBLE_TASK':
        authCode = PROJECT_TEAM_CARD_CREATE;
        break;
      case 'MEETIMG_ARRANGEMENT':
        authCode = PROJECT_TEAM_CARD_CREATE;
        break;
      case 'MY_DOCUMENT':
        authCode = PROJECT_FILES_FILE_UPLOAD;
        break;
      case 'EXAMINE_PROGRESS':
        authCode = PROJECT_FLOWS_FLOW_CREATE;
        break;
      default:
        break;
    }
    if (!checkIsHasPermissionInBoard(authCode)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME);
      return false;
    }
    const paramObj = this.getNewTaskParams();

    //做提交操作

  };

  handleAddTaskModalTaskTitleChange = e => {
    this.setState({
      add_name: e.target.value
    });
  };

  handleSelectedItemChange = list => {
    this.setState({
      currentSelectedProjectMember: list
    });
  };

  componentWillReceiveProps(nextProps) {
    const { addTaskModalVisible: nextAddTaskModalVisible } = nextProps;
    const { addTaskModalVisible } = this.props;
    if (addTaskModalVisible === false && nextAddTaskModalVisible) {
      //如果是显示modal,那么就初始化当前的项目
      const {
        dispatch,
        projectList,
        projectTabCurrentSelectedProject
      } = this.props;
      //如果当前的项目选择不是 "所有参与的项目", 并且用户的项目列表，有当前选择的项目，那么就去拉取当前项目的所有用户
      const isProjectListExistCurrentSelectedProject = projectList.find(
        item => item.board_id === projectTabCurrentSelectedProject
      );
      if (
        isProjectListExistCurrentSelectedProject &&
        projectTabCurrentSelectedProject !== '0'
      ) {
        this.setState({
          currentSelectedProject: isProjectListExistCurrentSelectedProject
        });
      }
    }
  }
  render() {
    const {
      add_name,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
    } = this.state;
    const {
      projectList,
      addTaskModalVisible,
      workbench: {
        datas: {
          currentSelectedProjectMembersList,
        }
      },
      taskType,
      isUseInGantt,
      projectIdWhenUseInGantt,
      projectMemberListWhenUseInGantt,
    } = this.props;

    const isHasTaskTitle = () => add_name && String(add_name).trim();
    const isHasSelectedProject = () =>
      currentSelectedProject && currentSelectedProject.board_id;
    const isHasSelectedProjectMember = () =>
      currentSelectedProjectMember && currentSelectedProjectMember.length;
    let isShouldNotDisableSubmitBtn = () =>
      isHasTaskTitle() && isHasSelectedProject();
    if (taskType === 'MEETIMG_ARRANGEMENT') {
      isShouldNotDisableSubmitBtn = () =>
        isHasTaskTitle() && isHasSelectedProject() && start_time && due_time;
    }

    const board_id = currentSelectedProject.board_id;

    //有的项目没有开启目前的内容类型，将其过滤出去
    const filteredNoThatTypeProject = projectList.filter(item => {
      return (
        item.apps && item.apps.find(i => i.code === taskTypeToName[taskType])
      );
    });

    return (
      <Modal
        visible={addTaskModalVisible}
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
              {false ? (
                <div className={styles.groupList__wrapper}>
                  {currentSelectedProject.board_name || '项目名称'}
                </div>
              ): (
                <DropdownSelectWithSearch
                  list={filteredNoThatTypeProject}
                  initSearchTitle="选择项目"
                  selectedItem={currentSelectedProject}
                  handleSelectedItem={this.handleSelectedItem}
                  isShouldDisableDropdown={isUseInGantt && projectIdWhenUseInGantt}
                />
              )}

            </div>

            {/*时间选择*/}
            <div>
              <DateRangePicker
                handleDateRangeChange={this.handleDateRangeChange}
                isSameYearNotShowYear={true}
              />
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
                itemTitle={
                  taskType === 'RESPONSIBLE_TASK' ? '执行人' : '参与人'
                }
                list={
                  currentSelectedProject.board_id && !isUseInGantt
                    ? currentSelectedProjectMembersList : isUseInGantt && projectMemberListWhenUseInGantt ? projectMemberListWhenUseInGantt : []
                }
                handleSelectedItemChange={this.handleSelectedItemChange}
                currentSelectedProjectMember={currentSelectedProjectMember}
              />
            </div>
            <div className={styles.confirmBtn}>
              <Button
                type="primary"
                disabled={!isShouldNotDisableSubmitBtn()}
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

AddTaskModal.defaultProps = {
  isUseInGantt: false, //是否是在甘特图使用
  projectIdWhenUseInGantt: '', //如果是在甘特图中使用，那么传项目 id
  projectGroupListId: '', //项目分组id
  projectGroupLists: [], //当前选择项目任务分组列表
  handleGetNewTaskParams: function() { //返回当前新建 modal 用户提交的所有参数

  },
  projectMemberListWhenUseInGantt: [], //当在甘特图使用的时候，需要将当前选中的项目成员列表传入
  currentSelectedprojectMemberListWhenUseInGantt: [], //当在甘特图使用的时候，所有需要提前选中的人员列表
};

export default AddTaskModal;
