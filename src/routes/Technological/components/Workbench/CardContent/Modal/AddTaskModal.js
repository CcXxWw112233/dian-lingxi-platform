import React, { Component } from "react";
import { Modal, Input, Button, message } from "antd";
import styles from "./AddTaskModal.less";
import { connect } from "dva";
import DropdownSelectWithSearch from "./../DropdownSelectWithSearch/index";
import DropdownMultipleSelectWithSearch from "./../DropdownMultipleSelectWithSearch/index";
import DateRangePicker from "./../DateRangePicker/index";

@connect(({ workbench }) => ({ workbench }))
class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    const {
      projectList,
      workbench: {
        datas: { projectTabCurrentSelectedProject }
      }
    } = this.props;
    this.state = {
      addTaskTitle: "",
      currentSelectedProject: projectList.find(
        item => item.board_id === projectTabCurrentSelectedProject
      )
        ? projectList.find(
            item => item.board_id === projectTabCurrentSelectedProject
          )
        : {},
      currentSelectedProjectMember: [],
      start_time: "",
      due_time: ""
    };
  }
  handleDateRangeChange = dateRange => {
    const [start_time, due_time] = dateRange;
    this.setState({
      start_time: start_time,
      due_time: due_time
    });
    console.log(dateRange, "get date range from data range picker.");
  };
  handleAddTaskModalOk = () => {};
  handleAddTaskModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "workbench/emptyCurrentSelectedProjectMembersList"
    });
    this.setState({
      addTaskTitle: "",
      currentSelectedProject: {},
      start_time: "",
      due_time: ""
    });
    const { addTaskModalVisibleChange } = this.props;
    addTaskModalVisibleChange(false);
  };
  handleSelectedItem = item => {
    const { dispatch } = this.props;
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
      }
    );
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
    const paramObj = this.getNewTaskParams();
    this.addNewTask(paramObj);
    this.addNewMeeting(paramObj);
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
    console.log(list, "get project member list.");
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
      due_time
    } = this.state;
    const {
      projectList,
      addTaskModalVisible,
      workbench: {
        datas: {
          currentSelectedProjectMembersList,
          projectTabCurrentSelectedProject
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
      isHasTaskTitle() &&
      isHasSelectedProject() &&
      isHasSelectedProjectMember();
    if (taskType === "MEETIMG_ARRANGEMENT") {
      (isShouldNotDisableSubmitBtn = () =>
        isHasTaskTitle() &&
        isHasSelectedProject() &&
        isHasSelectedProjectMember() &&
        start_time),
        due_time;
    }
    return (
      <Modal
        visible={addTaskModalVisible}
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
              list={projectList}
              initSearchTitle="选择项目"
              selectedItem={currentSelectedProject}
              handleSelectedItem={this.handleSelectedItem}
            />
            {taskType === "MEETIMG_ARRANGEMENT" && (
              <DateRangePicker
                handleDateRangeChange={this.handleDateRangeChange}
              />
            )}
          </div>
          <div className={styles.addTaskModalTaskTitle}>
            <Input
              value={addTaskTitle}
              onChange={this.handleAddTaskModalTaskTitleChange}
            />
          </div>
          <div className={styles.addTaskModalFooter}>
            <div className={styles.addTaskModalOperator}>
              <DropdownMultipleSelectWithSearch
                list={currentSelectedProjectMembersList}
                handleSelectedItemChange={this.handleSelectedItemChange}
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
        </div>
      </Modal>
    );
  }
}

export default AddTaskModal;
