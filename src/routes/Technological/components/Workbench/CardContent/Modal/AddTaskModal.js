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
  Dropdown
} from 'antd'
import styles from './AddTaskModal.less'
import { connect } from 'dva'
import {
  REQUEST_DOMAIN_BOARD,
  UPLOAD_FILE_SIZE,
  ORG_TEAM_BOARD_CREATE
} from './../../../../../../globalset/js/constant'
import {
  deleteUploadFile,
  getCurrentSelectedProjectMembersList
} from './../../../../../../services/technological/workbench'
import DropdownSelectWithSearch from './../DropdownSelectWithSearch/index'
import DropdownMultipleSelectWithSearch from './../DropdownMultipleSelectWithSearch/index'
import DateRangePicker from './../DateRangePicker/index'
import Cookies from 'js-cookie'
import {
  checkIsHasPermissionInBoard,
  setStorage,
  setBoardIdStorage,
  checkIsHasPermission
} from '../../../../../../utils/businessFunction'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_FILES_FILE_UPLOAD,
  PROJECT_FLOWS_FLOW_CREATE,
  PROJECT_TEAM_CARD_CREATE
} from '../../../../../../globalset/js/constant'
import globalStyles from '@/globalset/css/globalClassName.less'
import OrgSearchAndSelect from '@/components/OrgSearchAndSelect'
import { setUploadHeaderBaseInfo } from '@/utils/businessFunction'

const taskTypeToName = {
  RESPONSIBLE_TASK: 'Tasks',
  EXAMINE_PROGRESS: 'Flows',
  MEETIMG_ARRANGEMENT: 'Tasks',
  MY_DOCUMENT: 'Files'
}
/* eslint-disable */
@connect(({ workbench,  
  technological: {
    datas: {
      userOrgPermissions,
      userBoardPermissions
    }
  }
}) => ({ workbench,userOrgPermissions,userBoardPermissions}))
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
      if (isUseInGantt) {
        return currentSelectedprojectMemberListWhenUseInGantt
      }
      return []
    }
    this.state = {
      addTaskTitle: '',
      selectedOrg: {
        org_name: '',
        org_id: '',
      }, //???????????????
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
      isInUploadFile: false,
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
  handleAddTaskModalOk = () => { };
  handleAddTaskModalCancel = () => {
    //????????????????????????tab_bar board_id?????????
    const {
      datas: { projectTabCurrentSelectedProject }
    } = this.props.workbench;
    setBoardIdStorage(projectTabCurrentSelectedProject);

    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectMembersList'
    });
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectFileFolderList'
    });
    this.setState({
      addTaskTitle: '',
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
        //?????????????????????????????????????????????????????????????????????????????????????????????????????? bug
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
      message.error('????????????????????????????????????');
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
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
      currentSelectedProjectGroupListItem
    } = this.state;
    const taskObj = {
      add_type: 1, //??????0??? ?????????1
      board_id: currentSelectedProject.board_id,
      name: addTaskTitle,
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
    const { taskType, handleGetNewTaskParams, isUseInGantt } = this.props;
    //????????????
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

    if (isUseInGantt) {
      handleGetNewTaskParams(paramObj)
    } else {
      this.addNewTask(paramObj);
      this.addNewMeeting(paramObj);
      this.uploadNewFile();
    }

  };

  getNewUploadedFileIdList = () => {
    const { attachment_fileList } = this.state;
    const { dispatch } = this.props;
    const collectFileId = (arr = []) => {
      //??????????????????????????????
      return arr
        .filter(
          file =>
            file.response && file.response.code === '0' && file.response.data.id
        )
        .map(file => file.response.data.id);
    };
    dispatch({
      type: 'workbench/updateUploadedFileNotificationIdList',
      payload: {
        idsList: collectFileId(attachment_fileList)
      }
    });
    // console.log(attachment_fileList, 'attachment_fileList')
  };

  uploadNewFile = () => {
    const { taskType, dispatch } = this.props;
    if (taskType !== 'MY_DOCUMENT') {
      return;
    }

    //??????????????????
    Promise.resolve(
      dispatch({
        type: 'workbench/getUploadedFileList'
      })
    )
      .then(() => {
        //????????????????????????????????????idList
        this.getNewUploadedFileIdList();
      })
      .then(() => {
        this.handleAddTaskModalCancel();
      });
  };
  addNewMeeting = paramObj => {
    const {
      taskType,
      dispatch,
      addTaskModalVisibleChange,
      workbench: {
        datas: { boxList }
      }
    } = this.props;
    if (taskType !== 'MEETIMG_ARRANGEMENT') {
      return;
    }
    Promise.resolve(
      dispatch({
        type: 'workbench/addTask',
        payload: {
          data: paramObj
        }
      })
    )
      .then(data => {
        if (!data) throw new Error('??????????????????');
        const { board_id, name } = paramObj;
        this.showCreateTaskSuccessNote(board_id, data.id, name);
      })
      .then(() =>
        dispatch({
          type: 'workbench/getMeetingList'
        })
      )
      .then(() => {
        this.handleAddTaskModalCancel();
      });
  };
  addNewTask = paramObj => {
    const {
      taskType,
      dispatch,
      addTaskModalVisibleChange,
      workbench: {
        datas: { boxList }
      }
    } = this.props;
    if (taskType !== 'RESPONSIBLE_TASK') {
      return;
    }
    Promise.resolve(
      dispatch({
        type: 'workbench/addTask',
        payload: {
          data: paramObj
        }
      })
    )
      .then(data => {
        if (!data) throw new Error('??????????????????');
        const { board_id, name } = paramObj;
        this.showCreateTaskSuccessNote(board_id, data.id, name);
      })
      .then(() => {
        dispatch({
          type: 'workbench/getResponsibleTaskList'
        });
      })
      .then(() => {
        this.handleAddTaskModalCancel();
      })
    // .catch(err => console.log(err));
  };
  getTaskTypeText = () => {
    const { taskType } = this.props;
    const taskTypeObj = {
      RESPONSIBLE_TASK: '??????',
      MEETIMG_ARRANGEMENT: '??????',
      MY_DOCUMENT: '??????'
    };
    return taskTypeObj[taskType];
  };
  showCreateTaskSuccessNote = (board_id, id, name) => {
    // return
    const handleJump = e => {
      if (e) e.stopPropagation();
      notification.destroy();
      this.props.updatePublicDatas({ board_id });
      this.props.dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawerVisible: true,
          card_id: id
        }
      })
      // this.props.getCardDetail({
      //   id,
      //   board_id,
      //   calback: this.props.setTaskDetailModalVisibile
      // });
      // this.props.setTaskDetailModalVisibile();
    };
    const descirptionEle = (
      <div>
        <p>
          <span>
            ??????{this.getTaskTypeText()}???
            <span style={{ color: '#1D93FF' }}>{name}</span>
            ?????????????????????????????????????????????{this.getTaskTypeText()}
          </span>
        </p>
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" size="small" onClick={e => handleJump(e)}>
            ????????????
          </Button>
        </div>
      </div>
    );
    notification.success({
      message: '????????????',
      description: descirptionEle,
      placement: 'bottomLeft'
    });
  };
  handleAddTaskModalTaskTitleChange = e => {
    this.setState({
      addTaskTitle: e.target.value
    });
  };
  handleSelectedItemChange = list => {
    this.setState({
      currentSelectedProjectMember: list
    });
  };
  handleSelectedFileFolderChange = folderIds => {
    const len = folderIds.length;
    this.setState({
      // currentSelectedFileFolder: folderIds[len - 1]
      currentSelectedFileFolder: folderIds
    });
  };
  formatFolderTreeData = (orgArr = {}) => {
    if (!orgArr.folder_name) {
      return {};
    }
    if (!orgArr.child_data.length) {
      return {
        label: orgArr.folder_name,
        value: orgArr.folder_id
        // children: []
      };
    }
    return {
      label: orgArr.folder_name,
      value: orgArr.folder_id,
      children: orgArr.child_data.map(item => this.formatFolderTreeData(item))
    };
  };
  componentWillReceiveProps(nextProps) {
    const { addTaskModalVisible: nextAddTaskModalVisible } = nextProps;
    const { addTaskModalVisible } = this.props;
    if (addTaskModalVisible === false && nextAddTaskModalVisible) {
      //???????????????modal,?????????????????????????????????
      const {
        dispatch,
        projectList,
        projectTabCurrentSelectedProject
      } = this.props;
      //????????????????????????????????? "?????????????????????", ??????????????????????????????????????????????????????????????????????????????????????????????????????
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
  // ????????????
  renderSelectOrg = () => {
    const { selectedOrg = {} } = this.state
    return (
      <Dropdown
        overlay={<OrgSearchAndSelect orgSelectedChange={this.orgSelectedChange} />}>
        <div className={styles.org_selected_out}>
          <div className={`${globalStyles.authTheme} ${styles.type_logo}`}>&#xe7c6;</div>
          <div>{selectedOrg.org_name || `????????????`}</div>
          <div className={`${globalStyles.authTheme} ${styles.down_logo}`}>&#xe7ee;</div>
        </div>
      </Dropdown>
    )
  }
  orgSelectedChange = (selectedOrg = {}) => {
    // console.log('ssss', selectedOrg)
    this.setState({
      selectedOrg,
      currentSelectedProject: {},
      currentSelectedProjectGroupListItem: {},
    })
  }
  render() {
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
      attachment_fileList,
      currentSelectedFileFolder,
      currentSelectedProjectGroupListItem,
      isInUploadFile,
      selectedOrg = {},
    } = this.state;
    // console.log('sssss',{currentSelectedProject, selectedOrg})
    const {
      projectList,
      addTaskModalVisible,
      workbench: {
        datas: {
          currentSelectedProjectMembersList,
          projectTabCurrentSelectedProject,
          currentSelectedProjectFileFolderList
        }
      },
      modalTitle,
      taskType,
      projectGroupLists,
      isUseInGantt,
      projectIdWhenUseInGantt,
      projectMemberListWhenUseInGantt,
      projectGroupListId
    } = this.props;

    const isHasTaskTitle = () => addTaskTitle && String(addTaskTitle).trim();
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

    // console.log('ssss',{isInUploadFile}, currentSelectedFileFolder)

    if (taskType === 'MY_DOCUMENT') {
      isShouldNotDisableSubmitBtn = () =>
        isHasSelectedProject() && currentSelectedFileFolder.length;
    }

    const isShouldNotDisableSubmitBtnInDucument = () => {
      if (taskType === 'MY_DOCUMENT') {
        return !isInUploadFile
      } else {
        return true
      }
    }

    // console.log('ssss11', isShouldNotDisableSubmitBtnInDucument())

    const board_id = currentSelectedProject.board_id;
    const findAndTransProjectGroupList = (projectGroupLists = [], board_id) => {
      const isFinded = projectGroupLists.find(
        item => item.board_id === board_id
      );
      if (!isFinded) return [];
      //????????????????????????????????? DropdownSelectWithSearch ??????
      return isFinded.list_data.map(item => ({
        board_id: item['list_id'],
        board_name: item['list_name']
      }));
    };
    const currentSelectedProjectGroupList = findAndTransProjectGroupList(
      projectGroupLists,
      board_id
    );
    const folderOptions = this.formatFolderTreeData(
      currentSelectedProjectFileFolderList
    );
    const that = this;
    const uploadProps = {
      name: 'file',
      fileList: attachment_fileList,
      withCredentials: true,
      action: `${REQUEST_DOMAIN_BOARD}/file/upload`,
      multiple: true,
      data: {
        board_id,
        folder_id:
          currentSelectedFileFolder[currentSelectedFileFolder.length - 1]
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({
          boardId: currentSelectedProject.board_id,
          orgId: selectedOrg.org_id
        }),
      },
      beforeUpload(e) {
        if (e.size == 0) {
          message.error(`?????????????????????`);
          return false;
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`??????????????????????????????${UPLOAD_FILE_SIZE}MB`);
          return false;
        }
      },
      onChange({ file, fileList, event }) {
        if (file.size == 0) {
          return false;
        } else if (file.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          return false;
        }
        if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME);
          return false;
        }

        // ??????filelist ????????????????????????????????????????????????,?????????isInUploadFile?????????true
        let isInUploadFileFlag = false
        for (let val of fileList) {
          if (!val['response']) {
            isInUploadFileFlag = true
          }
        }
        that.setState({
          isInUploadFile: isInUploadFileFlag
        })

        //??????filelist
        if (file.status === 'done' && file.response.code === '0') {
        } else if (
          file.status === 'error' ||
          (file.response && file.response.code !== '0')
        ) {
          for (let i = 0; i < fileList.length; i++) {
            if (file.uid == fileList[i].uid) {
              fileList.splice(i, 1);
            }
          }
          message.error(file.response && file.response.message || '????????????');
        }
        that.setState(
          {
            attachment_fileList: fileList
          },
          () => { }
        );
        // drawContent["attachment_data"] = fileList;
        // that.props.updateDatasTask({
        //   drawContent
        // });
      },
      onPreview(e, a) {
        // const file_resource_id =
        //   e.file_resource_id || e.response.data.file_resource_id;
        // const file_id = e.file_id || e.response.data.file_id;
        // that.setState({
        //   previewFileType: "attachment"
        // });
        // that.props.updateDatasFile({
        //   seeFileInput: "taskModule",
        //   isInOpenFile: true,
        //   filePreviewCurrentId: file_resource_id,
        //   filePreviewCurrentFileId: file_id
        // });
        // that.props.filePreview({ id: file_resource_id, file_id: file_id });
      },
      onRemove(e) {
        const id = e.id || (e.response && e.response.data && e.response.data.id);
        if (!id) {
          return;
        }

        deleteUploadFile({ id })
          .then(res => {
            if (res.code === '0') {
              message.success('????????????');
            } else {
              message.error('??????????????????????????????');
            }
          })
          .catch(err => {
            message.error('??????????????????????????????');
          });
      }
    };

    //???????????????????????????org_???
    //??????????????????????????????????????????????????????????????????
    const filteredNoThatTypeProject = projectList.filter(item => {
      let board_is_in_selected_org = false //???????????????????????????org_???
      // ???????????????????????????????????????????????? ???????????????????????????
      if (localStorage.getItem('OrganizationId') == '0') {
        if (item.org_id == selectedOrg.org_id) {
          board_is_in_selected_org = true
        }
      } else {
        board_is_in_selected_org = true
      }
      return (
        item.apps && item.apps.find(i => i.code === taskTypeToName[taskType]) && board_is_in_selected_org
      );
    });

    // console.log('ssssss', {projectList, filteredNoThatTypeProject})

    return (
      <Modal
        visible={true} //addTaskModalVisible
        // maskClosable={false}
        title={
          // <div style={{ textAlign: "center" }}>{"????????????" + modalTitle}</div>
          <div style={{ textAlign: 'center' }}>{'????????????'}</div>
        }
        onOk={this.handleAddTaskModalOk}
        onCancel={this.handleAddTaskModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles.addTaskModalContent}>
          <div className={styles.addTaskModalSelectProject}>
            <div className={styles.addTaskModalSelectProject_and_groupList}>
              {/* ???????????? */}
              {
                localStorage.getItem('OrganizationId') == '0' && (
                  <div>
                    {this.renderSelectOrg()}
                  </div>
                )
              }

              {/*??????????????????????????????id?????????????????????????????????????????????*/}
              {(isUseInGantt && projectMemberListWhenUseInGantt != '0') ? (
                <div className={styles.groupList__wrapper}>
                  {currentSelectedProject.board_name}
                </div>
              ) : (
                  <DropdownSelectWithSearch
                    list={filteredNoThatTypeProject}
                    _organization_id={selectedOrg.org_id}
                    initSearchTitle="????????????"
                    selectedItem={currentSelectedProject}
                    handleSelectedItem={this.handleSelectedItem}
                    isShouldDisableDropdown={isUseInGantt && projectIdWhenUseInGantt}
                  />
                )}
              {/*??????????????????????????????id???????????????id???????????????????????????????????????*/}
              {(isUseInGantt && projectMemberListWhenUseInGantt != '0' && !!projectGroupListId) ? (
                <div className={styles.groupList__wrapper}>
                  {currentSelectedProjectGroupListItem.list_name}
                </div>
              ) : (
                  <div className={styles.groupList__wrapper}>
                    {(taskType === 'RESPONSIBLE_TASK' ||
                      taskType === 'MEETIMG_ARRANGEMENT') && (
                        <DropdownSelectWithSearch
                          list={currentSelectedProjectGroupList}
                          initSearchTitle="????????????"
                          selectedItem={currentSelectedProjectGroupListItem}
                          handleSelectedItem={this.handleSelectedProjectGroupItem}
                          isShowIcon={false}
                          isSearch={false}
                          isCanCreateNew={false}
                          isProjectGroupMode={true}
                          isShouldDisableDropdown={isUseInGantt && currentSelectedProjectGroupListItem && currentSelectedProjectGroupListItem.id}
                        />
                      )}
                  </div>
                )}

            </div>
            {taskType === 'MEETIMG_ARRANGEMENT' && (
              <DateRangePicker
                handleDateRangeChange={this.handleDateRangeChange}
                isSameYearNotShowYear={true}
              />
            )}
            {taskType === 'MY_DOCUMENT' && currentSelectedProject.board_id && (
              <div className={styles.addTaskModalSelectFileFolder}>
                <Cascader
                  className={styles.addTaskModalSelectFileFolder__selectWrapper}
                  // defaultValue= {[currentSelectedFileFolder]}
                  value={currentSelectedFileFolder}
                  options={[folderOptions]}
                  onChange={this.handleSelectedFileFolderChange}
                  placeholder="?????????????????????"
                  changeOnSelect
                />
              </div>
            )}
          </div>
          <div className={styles.addTaskModalTaskTitle}>
            {taskType === 'RESPONSIBLE_TASK' ||
              taskType === 'MEETIMG_ARRANGEMENT' ? (
                <Input
                  value={addTaskTitle}
                  onChange={this.handleAddTaskModalTaskTitleChange}
                />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  {!isShouldNotDisableSubmitBtn() ? (
                    <Tooltip placement="bottom" title="?????????????????????????????????">
                      <Button
                        block={true}
                        disabled={!isShouldNotDisableSubmitBtn()}
                      >
                        <span style={{ width: '442px' }}>
                          ????????????/????????????????????????
                      </span>
                      </Button>
                    </Tooltip>
                  ) : (
                      <Upload {...uploadProps}>
                        <Button
                          block={true}
                          disabled={!isShouldNotDisableSubmitBtn()}
                        >
                          <span style={{ width: '442px' }}>
                            ????????????/????????????????????????
                      </span>
                        </Button>
                      </Upload>
                    )}
                </div>
              )}
          </div>
          {taskType === 'RESPONSIBLE_TASK' ||
            taskType === 'MEETIMG_ARRANGEMENT' ? (
              <div className={styles.addTaskModalFooter}>
                <div className={styles.addTaskModalOperator}>
                  <DropdownMultipleSelectWithSearch
                    itemTitle={
                      taskType === 'RESPONSIBLE_TASK' ? '?????????' : '?????????'
                    }
                    board_id={currentSelectedProject.board_id}
                    list={
                      currentSelectedProject.board_id && !isUseInGantt
                        ? currentSelectedProjectMembersList : isUseInGantt && projectMemberListWhenUseInGantt ? projectMemberListWhenUseInGantt : []
                    }
                    handleSelectedItemChange={this.handleSelectedItemChange}
                    currentSelectedProjectMember={currentSelectedProjectMember}
                    dispatch={this.props.dispatch}
                  />
                </div>
                <div className={styles.confirmBtn}>
                  <Button
                    type="primary"
                    disabled={!isShouldNotDisableSubmitBtn() || !isShouldNotDisableSubmitBtnInDucument()}
                    onClick={this.handleClickedSubmitBtn}
                  >
                    ??????
                </Button>
                </div>
              </div>
            ) : (
              <div className={styles.addTaskModalFooter}>
                <div className={styles.confirmBtnRight}>
                  <Button
                    type="primary"
                    disabled={!isShouldNotDisableSubmitBtn() || !isShouldNotDisableSubmitBtnInDucument()}
                    onClick={this.handleClickedSubmitBtn}
                  >
                    ??????
                </Button>
                </div>
              </div>
            )}
        </div>
      </Modal>
    );
  }
}

AddTaskModal.defaultProps = {
  isUseInGantt: false, //???????????????????????????
  projectIdWhenUseInGantt: '', //???????????????????????????????????????????????? id
  projectGroupListId: '', //????????????id
  projectGroupLists: [], //????????????????????????????????????
  handleGetNewTaskParams: function () { //?????????????????? modal ???????????????????????????

  },
  projectMemberListWhenUseInGantt: [], //?????????????????????????????????????????????????????????????????????????????????
  currentSelectedprojectMemberListWhenUseInGantt: [], //????????????????????????????????????????????????????????????????????????
};

export default AddTaskModal;
