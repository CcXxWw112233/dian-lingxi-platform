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
  Dropdown
} from 'antd';
import styles from './../../Workbench/CardContent/Modal/AddTaskModal.less';
import { connect } from 'dva';
import {
  REQUEST_DOMAIN_BOARD,
  UPLOAD_FILE_SIZE,
  ORG_TEAM_BOARD_CREATE
} from '@/globalset/js/constant';
import { deleteUploadFile, getCurrentSelectedProjectMembersList } from '@/services/technological/workbench';
import DropdownSelectWithSearch from './../../Workbench/CardContent/DropdownSelectWithSearch/index';
import DropdownMultipleSelectWithSearch from './../../Workbench/CardContent/DropdownMultipleSelectWithSearch/index';
import DateRangePicker from './../../Workbench/CardContent/DateRangePicker/index';
import Cookies from 'js-cookie';
import {
  checkIsHasPermissionInBoard,
  setStorage,
  setBoardIdStorage,
  checkIsHasPermission
} from '@/utils/businessFunction';
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_FLOWS_FLOW_CREATE,
  PROJECT_TEAM_CARD_CREATE
} from '@/globalset/js/constant';
import globalStyles from '@/globalset/css/globalClassName.less'


/* eslint-disable */
@connect(({ workbench }) => ({ workbench }))
class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    const {
      projectList,
      gantt_board_id,
      isUseInGantt,
      projectIdWhenUseInGantt,
      projectGroupListId,
      projectGroupLists,
      currentSelectedprojectMemberListWhenUseInGantt,
    } = this.props;
    const findAndCheckCurrentSelectedProject = where => {
      const result = projectList.find(
        item =>
          item.board_id === where &&
          item.apps &&
          item.apps.find(i => i.code === 'Tasks')
      );
      return result ? result : {};
    };
    const getCurrentSelectedProject = (
      isUseInGantt,
      projectIdWhenUseInGantt,
      gantt_board_id
    ) => {
      if (isUseInGantt) {
        return findAndCheckCurrentSelectedProject(projectIdWhenUseInGantt);
      }
      return findAndCheckCurrentSelectedProject(
        gantt_board_id
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
      addTaskTitle: '',
      selectedOrg: {
        org_name: '',
        org_id: '',
      }, //选择的组织
      currentSelectedProject: getCurrentSelectedProject(
        isUseInGantt,
        projectIdWhenUseInGantt,
        gantt_board_id
      ),
      currentSelectedProjectMember: getCurrentSelectedProjectMember(isUseInGantt, currentSelectedprojectMemberListWhenUseInGantt),
      currentSelectedProjectGroupListItem: getCurrentSelectedProjectGroupListItem(isUseInGantt, projectGroupListId, projectGroupLists, projectIdWhenUseInGantt)
    };
  }
  handleAddTaskModalOk = () => {};
  handleAddTaskModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectMembersList'
    });
    dispatch({
      type: 'workbench/emptyCurrentSelectedProjectFileFolderList'
    });
    const { setAddTaskModalVisible } = this.props;
    setAddTaskModalVisible(false);
  };
  handleSelectedProjectGroupItem = item => {
    this.setState({
      currentSelectedProjectGroupListItem: item
    });
  };
  handleSelectedItem = item => {
    const {
      dispatch,
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
        handleShouldUpdateProjectGroupList();
      }
    );
  };
  getNewTaskParams = () => {
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      currentSelectedProjectGroupListItem
    } = this.state;
    const taskObj = {
      add_type: 1, //默认0， 按分组1
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
    return taskObj;
  };
  handleClickedSubmitBtn = e => {
    e.stopPropagation();
    const paramObj = this.getNewTaskParams();
    const { handleGetNewTaskParams } = this.props
    handleGetNewTaskParams(paramObj)
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

 
  componentWillReceiveProps(nextProps) {
    const { addTaskModalVisible: nextAddTaskModalVisible } = nextProps;
    const { addTaskModalVisible } = this.props;
    if (addTaskModalVisible === false && nextAddTaskModalVisible) {
      //如果是显示modal,那么就初始化当前的项目
      const {
        projectList,
        gantt_board_id
      } = this.props;
      //如果当前的项目选择不是 "所有参与的项目", 并且用户的项目列表，有当前选择的项目，那么就去拉取当前项目的所有用户
      const isProjectListExistCurrentSelectedProject = projectList.find(
        item => item.board_id === gantt_board_id
      );
      if (
        isProjectListExistCurrentSelectedProject &&
        gantt_board_id !== '0'
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
      currentSelectedProjectGroupListItem,
      selectedOrg = {},
    } = this.state;
    const {
      projectList,
      workbench: {
        datas: {
          currentSelectedProjectMembersList,
        }
      },
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

    const board_id = currentSelectedProject.board_id;
    const findAndTransProjectGroupList = (projectGroupLists = [], board_id) => {
      const isFinded = projectGroupLists.find(
        item => item.board_id === board_id
      );
      if (!isFinded) return [];
      //映射数据，只是为了复用 DropdownSelectWithSearch 组件
      return isFinded.list_data.map(item => ({
        board_id: item['list_id'],
        board_name: item['list_name']
      }));
    };
    const currentSelectedProjectGroupList = findAndTransProjectGroupList(
      projectGroupLists,
      board_id
    );
   
    //有的项目没有开启目前的内容类型，将其过滤出去
    const filteredNoThatTypeProject = projectList.filter(item => {
      return (
        item.apps && item.apps.find(i => i.code === 'Tasks')
      );
    });


    return (
      <Modal
        visible={true} 
        title={
          <div style={{ textAlign: 'center' }}>{'添加内容'}</div>
        }
        onOk={this.handleAddTaskModalOk}
        onCancel={this.handleAddTaskModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className={styles.addTaskModalContent}>
          <div className={styles.addTaskModalSelectProject}>
            <div className={styles.addTaskModalSelectProject_and_groupList}>
              {/*在甘特图中传递了项目id的情况下，会固定不允许选择项目*/}
              {(isUseInGantt && projectMemberListWhenUseInGantt != '0')? (
                  <div className={styles.groupList__wrapper}>
                    {currentSelectedProject.board_name}
                  </div>
                ): (
                  <DropdownSelectWithSearch
                    list={filteredNoThatTypeProject}
                    _organization_id={selectedOrg.org_id}
                    initSearchTitle="选择项目"
                    selectedItem={currentSelectedProject}
                    handleSelectedItem={this.handleSelectedItem}
                    isShouldDisableDropdown={isUseInGantt && projectIdWhenUseInGantt}
                  />
              )}
              {/*在甘特图中传递了项目id和任务分组id的情况下，会固定不允许选择*/}
              {(isUseInGantt && projectMemberListWhenUseInGantt != '0' && !!projectGroupListId)?(
                <div className={styles.groupList__wrapper}>
                  {currentSelectedProjectGroupListItem.list_name}
                </div>
              ): (
                <div className={styles.groupList__wrapper}>
                 <DropdownSelectWithSearch
                    list={currentSelectedProjectGroupList}
                    initSearchTitle="任务分组"
                    selectedItem={currentSelectedProjectGroupListItem}
                    handleSelectedItem={this.handleSelectedProjectGroupItem}
                    isShowIcon={false}
                    isSearch={false}
                    isCanCreateNew={false}
                    isProjectGroupMode={true}
                    isShouldDisableDropdown={isUseInGantt && currentSelectedProjectGroupListItem && currentSelectedProjectGroupListItem.id}
                  />
                </div>
               )}
            </div>
           
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
                  itemTitle={'执行人' }
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
                  disabled={!isShouldNotDisableSubmitBtn() || !isHasSelectedProjectMember()}
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
