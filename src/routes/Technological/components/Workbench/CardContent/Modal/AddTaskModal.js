import React, { Component } from "react";
import { Modal, Input, Button } from "antd";
import styles from "./AddTaskModal.less";
import { connect } from "dva";
import DropdownSelectWithSearch from "./../DropdownSelectWithSearch/index";
import DropdownMultipleSelectWithSearch from "./../DropdownMultipleSelectWithSearch/index";

@connect(({ workbench }) => ({ workbench }))
class AddTaskModal extends Component {
  state = {
    addTaskTitle: ""
  };
  handleAddTaskModalOk = () => {};
  handleAddTaskModalCancel = () => {
    const {dispatch} = this.props
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectMembersList'
    })
    const { addTaskModalVisibleChange } = this.props;
    addTaskModalVisibleChange(false);
  };
  handleSelectedItem = item => {
    const { dispatch } = this.props;
    Promise.resolve(dispatch({
      type: 'workbench/updateCurrentSelectedProjectInAddTaskModal',
      payload: {
        project: item
      }
    })).then(() => dispatch({
      type: "workbench/fetchCurrentSelectedProjectMembersList",
      payload: {
        projectId: item.board_id
      }
    }))
  };
  handleAddTaskModalTaskTitleChange = e => {
    this.setState({
      addTaskTitle: e.target.value
    });
  };
  render() {
    const { addTaskTitle } = this.state;
    const {
      projectList,
      addTaskModalVisible,
      workbench: {
        datas: { currentSelectedProjectMembersList, currentSelectedProjectInAddTaskModal }
      }
    } = this.props;
    return (
      <Modal
        visible={addTaskModalVisible}
        title={<div style={{ textAlign: "center" }}>添加任务</div>}
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
              selectedItem={currentSelectedProjectInAddTaskModal}
              handleSelectedItem={this.handleSelectedItem}
            />
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
              />
            </div>
            <div className={styles.confirmBtn}>
              <Button type="primary" disabled>
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
