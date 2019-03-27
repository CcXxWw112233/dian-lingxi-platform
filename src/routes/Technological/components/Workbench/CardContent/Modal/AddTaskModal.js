import React, { Component } from "react";
import { Modal, Input, Button, message, Upload, Cascader, Tooltip } from "antd";
import styles from "./AddTaskModal.less";
import { connect } from "dva";
import {
  REQUEST_DOMAIN_BOARD,
  UPLOAD_FILE_SIZE
} from "./../../../../../../globalset/js/constant";
import { deleteUploadFile } from "./../../../../../../services/technological/workbench";
import DropdownSelectWithSearch from "./../DropdownSelectWithSearch/index";
import DropdownMultipleSelectWithSearch from "./../DropdownMultipleSelectWithSearch/index";
import DateRangePicker from "./../DateRangePicker/index";
import Cookies from "js-cookie";
import {checkIsHasPermissionInBoard, setStorage} from "../../../../../../utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_FILES_FILE_UPLOAD, PROJECT_FLOWS_FLOW_CREATE,
  PROJECT_TEAM_CARD_CREATE
} from "../../../../../../globalset/js/constant";

const taskTypeToName = {
  RESPONSIBLE_TASK: "Tasks",
  EXAMINE_PROGRESS: "Flows",
  MEETIMG_ARRANGEMENT: "Tasks",
  MY_DOCUMENT: "Files"
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
      taskType
    } = this.props;
    const rootFileFolder =
      currentSelectedProjectFileFolderList &&
      currentSelectedProjectFileFolderList.parent_id === "0" &&
      currentSelectedProjectFileFolderList.folder_id;
    const findAndCheckCurrentSelectedProject = projectList.find(
      item =>
        item.board_id === projectTabCurrentSelectedProject &&
        item.apps &&
        item.apps.find(i => i.code === taskTypeToName[taskType])
    );
    this.state = {
      addTaskTitle: "",
      currentSelectedProject: findAndCheckCurrentSelectedProject
        ? findAndCheckCurrentSelectedProject
        : {},
      currentSelectedProjectMember: [],
      start_time: "",
      due_time: "",
      attachment_fileList: [],
      currentSelectedFileFolder: rootFileFolder ? [rootFileFolder] : [""]
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
    const { datas: { projectTabCurrentSelectedProject }} = this.props.workbench
    setStorage('board_id', projectTabCurrentSelectedProject)

    const { dispatch } = this.props;
    dispatch({
      type: "workbench/emptyCurrentSelectedProjectMembersList"
    });
    dispatch({
      type: "workbench/emptyCurrentSelectedProjectFileFolderList"
    });
    this.setState({
      addTaskTitle: "",
      currentSelectedProject: {},
      start_time: "",
      due_time: "",
      attachment_fileList: [],
      currentSelectedFileFolder: [""]
    });
    const { addTaskModalVisibleChange } = this.props;
    addTaskModalVisibleChange(false);
  };
  handleSelectedItem = item => {
    const { dispatch, taskType } = this.props;
    this.setState(
      {
        currentSelectedProject: item
      },
      () => {
        dispatch({
          type: "workbench/fetchCurrentSelectedProjectMembersList",
          payload: {
            projectId: item.board_id
          }
        });
        if (taskType === "MY_DOCUMENT") {
          Promise.resolve(
            dispatch({
              type: "workbench/fetchCurrentSelectedProjectFileFolderList",
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
      currentSelectedProjectFileFolderList.parent_id === "0" &&
      currentSelectedProjectFileFolderList.folder_id;
    if (!rootFileFolder) {
      message.error("当前项目没有根目录文件夹");
      this.setState({
        currentSelectedFileFolder: [""]
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
      due_time
    } = this.state;
    const taskObj = {
      add_type: 0,
      board_id: currentSelectedProject.board_id,
      name: addTaskTitle,
      type: 0,
      users: currentSelectedProjectMember.reduce((acc, curr) => {
        return acc ? acc + "," + curr.id : curr.id;
      }, "")
    };
    if (taskType === "MEETIMG_ARRANGEMENT") {
      return Object.assign({}, taskObj, { start_time, due_time, type: 1 });
    }
    return taskObj;
  };
  handleClickedSubmitBtn = e => {
    e.stopPropagation();
    const { taskType } = this.props
    //权限控制
    let authCode = ''
    switch (taskType) {
      case 'RESPONSIBLE_TASK':
        authCode = PROJECT_TEAM_CARD_CREATE
        break
      case 'MEETIMG_ARRANGEMENT':
        authCode = PROJECT_TEAM_CARD_CREATE
        break
      case 'MY_DOCUMENT':
        authCode = PROJECT_FILES_FILE_UPLOAD
        break
      case 'EXAMINE_PROGRESS':
        authCode = PROJECT_FLOWS_FLOW_CREATE
        break
      default:
        break
    }
    if(!checkIsHasPermissionInBoard(authCode)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }

    const paramObj = this.getNewTaskParams();
    this.addNewTask(paramObj);
    this.addNewMeeting(paramObj);
    this.uploadNewFile();
  };
  uploadNewFile = () => {
    const { taskType, dispatch } = this.props;
    if (taskType !== "MY_DOCUMENT") {
      return;
    }
    Promise.resolve(
      dispatch({
        type: "workbench/getUploadedFileList"
      })
    ).then(() => {
      this.handleAddTaskModalCancel();
    });
  };
  addNewMeeting = paramObj => {
    const { taskType, dispatch, addTaskModalVisibleChange } = this.props;
    if (taskType !== "MEETIMG_ARRANGEMENT") {
      return;
    }
    Promise.resolve(
      dispatch({
        type: "workbench/addTask",
        payload: {
          data: paramObj
        }
      })
    )
      .then(() =>
        dispatch({
          type: "workbench/getMeetingList"
        })
      )
      .then(() => {
        this.handleAddTaskModalCancel();
      });
  };
  addNewTask = paramObj => {
    const { taskType, dispatch, addTaskModalVisibleChange } = this.props;
    if (taskType !== "RESPONSIBLE_TASK") {
      return;
    }
    Promise.resolve(
      dispatch({
        type: "workbench/addTask",
        payload: {
          data: paramObj
        }
      })
    )
      .then(() => {
        dispatch({
          type: "workbench/getResponsibleTaskList"
        });
      })
      .then(() => {
        this.handleAddTaskModalCancel();
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
        projectTabCurrentSelectedProject !== "0"
      ) {
        this.setState({
          currentSelectedProject: isProjectListExistCurrentSelectedProject
        });
      }
    }
  }
  render() {
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      start_time,
      due_time,
      attachment_fileList,
      currentSelectedFileFolder
    } = this.state;
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
      taskType
    } = this.props;
    const isHasTaskTitle = () => addTaskTitle && String(addTaskTitle).trim();
    const isHasSelectedProject = () =>
      currentSelectedProject && currentSelectedProject.board_id;
    const isHasSelectedProjectMember = () =>
      currentSelectedProjectMember && currentSelectedProjectMember.length;
    let isShouldNotDisableSubmitBtn = () =>
      isHasTaskTitle() && isHasSelectedProject();
    if (taskType === "MEETIMG_ARRANGEMENT") {
      isShouldNotDisableSubmitBtn = () =>
        isHasTaskTitle() && isHasSelectedProject() && start_time && due_time;
    }

    if (taskType === "MY_DOCUMENT") {
      isShouldNotDisableSubmitBtn = () =>
        isHasSelectedProject() && currentSelectedFileFolder.length;
    }

    const board_id = currentSelectedProject.board_id;

    const folderOptions = this.formatFolderTreeData(
      currentSelectedProjectFileFolderList
    );
    const that = this;
    const uploadProps = {
      name: "file",
      fileList: attachment_fileList,
      withCredentials: true,
      action: `${REQUEST_DOMAIN_BOARD}/file/upload`,
      multiple: true,
      data: {
        board_id,
        folder_id: currentSelectedFileFolder[currentSelectedFileFolder.length - 1]
      },
      headers: {
        Authorization: Cookies.get("Authorization"),
        refreshToken: Cookies.get("refreshToken")
      },
      beforeUpload(e) {
        if (e.size == 0) {
          message.error(`不能上传空文件`);
          return false;
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`);
          return false;
        }
      },
      onChange({ file, fileList, event }) {
        if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        if (file.status === "done" && file.response.code === "0") {
        } else if (
          file.status === "error" ||
          (file.response && file.response.code !== "0")
        ) {
          for (let i = 0; i < fileList.length; i++) {
            if (file.uid == fileList[i].uid) {
              fileList.splice(i, 1);
            }
          }
        }
        that.setState(
          {
            attachment_fileList: fileList
          },
          () => {
          }
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
        const id = e.id || (e.response.data && e.response.data.id);
        if (!id) {
          return;
        }

        deleteUploadFile({ id })
          .then(res => {
            if (res.code === "0") {
              message.success("删除成功");
            } else {
              message.error("删除失败，请稍后再试");
            }
          })
          .catch(err => {
            message.error("删除失败，请稍后再试");
          });
      }
    };

    const filteredNoThatTypeProject = projectList.filter(item => {
      return (
        item.apps && item.apps.find(i => i.code === taskTypeToName[taskType])
      );
    });


    return (
      <Modal
        visible={addTaskModalVisible}
        // maskClosable={false}
        title={
          // <div style={{ textAlign: "center" }}>{"添加内容" + modalTitle}</div>
          <div style={{ textAlign: "center" }}>{"添加内容"}</div>
        }
        onOk={this.handleAddTaskModalOk}
        onCancel={this.handleAddTaskModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles.addTaskModalContent}>
          <div className={styles.addTaskModalSelectProject}>
            <DropdownSelectWithSearch
              list={filteredNoThatTypeProject}
              initSearchTitle="选择项目"
              selectedItem={currentSelectedProject}
              handleSelectedItem={this.handleSelectedItem}
            />
            {taskType === "MEETIMG_ARRANGEMENT" && (
              <DateRangePicker
                handleDateRangeChange={this.handleDateRangeChange}
              />
            )}
            {taskType === "MY_DOCUMENT" && currentSelectedProject.board_id && (
              <div className={styles.addTaskModalSelectFileFolder}>
                <Cascader
                  className={styles.addTaskModalSelectFileFolder__selectWrapper}
                  // defaultValue= {[currentSelectedFileFolder]}
                  value={currentSelectedFileFolder}
                  options={[folderOptions]}
                  onChange={this.handleSelectedFileFolderChange}
                  placeholder="选择一个文件夹"
                  changeOnSelect
                />
              </div>
            )}
          </div>
          <div className={styles.addTaskModalTaskTitle}>
            {taskType === "RESPONSIBLE_TASK" ||
            taskType === "MEETIMG_ARRANGEMENT" ? (
              <Input
                value={addTaskTitle}
                onChange={this.handleAddTaskModalTaskTitleChange}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                {!isShouldNotDisableSubmitBtn() ? (
                  <Tooltip placement="bottom" title="请选择具体项目和文件夹">
                    <Button
                      block={true}
                      disabled={!isShouldNotDisableSubmitBtn()}
                    >
                      <span style={{ width: "442px" }}>
                        点击此处/拖拽文件到对话框
                      </span>
                    </Button>
                  </Tooltip>
                ) : (
                  <Upload {...uploadProps}>
                    <Button
                      block={true}
                      disabled={!isShouldNotDisableSubmitBtn()}
                    >
                      <span style={{ width: "442px" }}>
                        点击此处/拖拽文件到对话框
                      </span>
                    </Button>
                  </Upload>
                )}
              </div>
            )}
          </div>
          {taskType === "RESPONSIBLE_TASK" ||
          taskType === "MEETIMG_ARRANGEMENT" ? (
            <div className={styles.addTaskModalFooter}>
              <div className={styles.addTaskModalOperator}>
                <DropdownMultipleSelectWithSearch
                  itemTitle={
                    taskType === "RESPONSIBLE_TASK" ? "执行人" : "参与人"
                  }
                  list={
                    currentSelectedProject.board_id
                      ? currentSelectedProjectMembersList
                      : []
                  }
                  handleSelectedItemChange={this.handleSelectedItemChange}
                  currentSelectedProjectMember={currentSelectedProjectMember}
                />
              </div>
              <div className={styles.confirmBtn}>
                <Button
                  type="primary"
                  disabled={!isShouldNotDisableSubmitBtn()}
                  onClick={this.handleClickedSubmitBtn}
                >
                  完成
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.addTaskModalFooter}>
              <div className={styles.confirmBtnRight}>
                <Button
                  type="primary"
                  disabled={!isShouldNotDisableSubmitBtn()}
                  onClick={this.handleClickedSubmitBtn}
                >
                  完成
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

export default AddTaskModal;
