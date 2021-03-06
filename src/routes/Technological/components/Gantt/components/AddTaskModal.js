import React, { Component } from 'react'
import { Modal, Input, Button } from 'antd'
import styles from './../../Workbench/CardContent/Modal/AddTaskModal.less'
import { connect } from 'dva'
import { getCurrentSelectedProjectMembersList } from '@/services/technological/workbench'
import DropdownSelectWithSearch from './../../Workbench/CardContent/DropdownSelectWithSearch/index'
import DropdownMultipleSelectWithSearch from './../../Workbench/CardContent/DropdownMultipleSelectWithSearch/index'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import { getMilestoneList } from '../../../../../services/technological/prjectDetail'
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName } from '../../../../../utils/businessFunction'
import { TASKS, PROJECTS } from '../../../../../globalset/js/constant'

/* eslint-disable */
@connect(({ gantt: { datas: { list_group } } }) => ({ list_group }))
class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    const {
      about_apps_boards,
      current_operate_board_id,
      board_card_group_id,
      about_group_boards,
    } = this.props;
    const findAndCheckCurrentSelectedProject = where => {
      const result = about_apps_boards.find(
        item =>
          item.board_id === where &&
          item.apps
        //  && item.apps.find(i => i.code === 'Tasks')
      );
      return result ? result : {};
    };
    const getCurrentSelectedProject = (
      current_operate_board_id,
    ) => {
      return findAndCheckCurrentSelectedProject(current_operate_board_id);
    };
    const getCurrentSelectedProjectGroupListItem = (board_card_group_id, about_group_boards, current_operate_board_id) => {
      if (!board_card_group_id || !(about_group_boards && about_group_boards.length)) return {}
      let list_data = (about_group_boards.find(i => i.board_id == current_operate_board_id) || {}).list_data || []
      const list_data_item = list_data.find(i => i.list_id == board_card_group_id) || {}
      return list_data_item
    }


    this.state = {
      addTaskTitle: '',
      selectedOrg: {
        org_name: '',
        org_id: '',
      }, //???????????????
      currentSelectedProject: getCurrentSelectedProject(
        current_operate_board_id,
      ),
      currentSelectedProjectMembersList: [], //???????????????????????????
      currentSelectedProjectMember: [], //?????????????????????????????????
      currentSelectedProjectGroupListItem: getCurrentSelectedProjectGroupListItem(board_card_group_id, about_group_boards, current_operate_board_id),
      selected_milestone: {}, //?????????????????????
      milestones: [], //???????????????
    };
  }
  handleAddTaskModalOk = () => { };
  handleAddTaskModalCancel = () => {
    const { setAddTaskModalVisible } = this.props;
    setAddTaskModalVisible(false);
  };
  // ????????????
  handleSelectedProjectGroupItem = item => {
    this.setState({
      currentSelectedProjectGroupListItem: item
    });
  };
  // ???????????????
  handleSelectedMilestone = item => {
    this.setState({
      selected_milestone: item
    });
  };
  // ????????????
  handleSelectedItem = item => {

    this.setState(
      {
        currentSelectedProject: item,
        currentSelectedProjectGroupListItem: {},
        milestones: [],
        selected_milestone: {}
      },
      () => {
        this.getCurrentSelectedProjectMembersList({ projectId: item.board_id })
        this.getMilestoneList(item.board_id)
        //?????????????????????????????????????????????????????????????????????????????????????????????????????? bug
      }
    );
  };
  getMilestoneList = (id) => {
    getMilestoneList({ id }).then(res => {
      if (isApiResponseOk(res)) {
        const arr = res.data.map(item => {
          return {
            ...item,
            board_id: item.id,
            board_name: item.name
          }
        })
        this.setState({
          milestones: arr
        })
      }
    })
  }
  // ??????????????????
  getCurrentSelectedProjectMembersList = (data) => {
    getCurrentSelectedProjectMembersList(data).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          currentSelectedProjectMembersList: res.data
        })
      }
    })
  }
  getNewTaskParams = () => {
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      currentSelectedProjectGroupListItem,
      selected_milestone = {}
    } = this.state;
    const taskObj = {
      add_type: 1, //??????0??? ?????????1
      board_id: currentSelectedProject.board_id,
      name: addTaskTitle,
      type: 0,
      users: currentSelectedProjectMember.filter(item => item.id && item.id != '0').reduce((acc, curr) => {
        return acc ? acc + ',' + curr.id : curr.id;
      }, ''),
      list_id: currentSelectedProjectGroupListItem.board_id
        ? currentSelectedProjectGroupListItem.board_id
        : '',
      milestone_id: selected_milestone.id
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

  componentDidMount() {
    const { current_operate_board_id, group_view_type } = this.props
    if (group_view_type == '1' || group_view_type == '5') { //???????????????????????????????????????????????????????????????
      this.getCurrentSelectedProjectMembersList({ projectId: current_operate_board_id })
      this.getMilestoneList(current_operate_board_id)
      if (group_view_type == '5') {
        this.setDefaultExcuser()
      }
    } else {
      this.setDefaultExcuser()
    }
  }

  // ???????????????????????????????????????????????????,?????????????????????????????????????????????
  setDefaultExcuser = () => {
    const { list_group, group_view_type, current_list_group_id, about_apps_boards = [] } = this.props
    if (group_view_type == '2' || group_view_type == '5') {
      const group = list_group.find(item => current_list_group_id == item.lane_id)
      const user = {
        full_name: group['lane_name'],
        name: group['lane_name'],
        id: group['lane_id'],
        user_id: group['lane_id'],
        avatar: group['lane_icon']
      }
      this.handleSelectedItemChange([user])

      // ???????????????????????????????????????,???????????????????????????
      const current_user_id = (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}).id
      const default_board = about_apps_boards.find(item => item.is_my_private == '1') || {}
      if (default_board.board_id && current_list_group_id == current_user_id) {
        this.setState({
          currentSelectedProject: default_board
        }, () => {
          this.getCurrentSelectedProjectMembersList({ projectId: default_board.board_id })
        })
      }

    }
  }

  componentWillReceiveProps(nextProps) {

  }

  inviteOthersToBoardCalbackRequest = () => {
    const { dispatch, current_operate_board_id } = this.props
    dispatch({
      type: 'gantt/getAboutUsersBoards',
      payload: {

      }
    })
    // dispatch({
    //   type: 'gantt/getAboutAppsBoards',
    //   payload: {

    //   }
    // })
    // dispatch({
    //   type: 'gantt/getAboutGroupBoards',
    //   payload: {

    //   }
    // })
    this.getCurrentSelectedProjectMembersList({ projectId: current_operate_board_id })
  }

  render() {
    const {
      addTaskTitle,
      currentSelectedProject,
      currentSelectedProjectMember,
      currentSelectedProjectGroupListItem,
      selectedOrg = {},
      currentSelectedProjectMembersList,
      selected_milestone = {},
      milestones = [],
    } = this.state;
    const {
      about_apps_boards,
      about_group_boards,
      about_user_boards,
      group_view_type,
      current_operate_board_id,
      board_card_group_id,
      current_list_group_id
    } = this.props;
    const isHasTaskTitle = () => addTaskTitle && String(addTaskTitle).trim();
    const isHasSelectedProject = () =>
      currentSelectedProject && currentSelectedProject.board_id;
    const isHasSelectedProjectMember = () =>
      currentSelectedProjectMember && currentSelectedProjectMember.length;
    let isShouldNotDisableSubmitBtn = () =>
      isHasTaskTitle() && isHasSelectedProject();

    const board_id = currentSelectedProject.board_id;
    const findAndTransProjectGroupList = (about_group_boards = [], board_id) => {
      const isFinded = about_group_boards.find(
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
      about_group_boards,
      board_id
    );

    //??????????????????????????????????????????????????????????????????
    let filteredNoThatTypeProject = about_apps_boards.filter(item => {
      return (
        item.apps //&& item.apps.find(i => i.code === 'Tasks')
      );
    });
    if (group_view_type == '2' || group_view_type == '5') { //????????????????????????????????????????????????????????? ??????id?????????
      filteredNoThatTypeProject = about_user_boards.filter(item => {
        return (
          item.users && item.users.find(i => i.id == current_list_group_id)
        )
      })
    }

    // console.log('ssssasdad', { currentSelectedProjectGroupList, milestones })

    return (
      <Modal
        visible={true}
        title={
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
              {/*???????????????????????????????????????????????????*/}
              {((group_view_type == '1' || group_view_type == '5') && !!current_operate_board_id) ? (
                <div className={styles.groupList__wrapper} style={{ paddingTop: 2, marginRight: 16 }}>
                  <span className={globalStyles.authTheme} style={{ fontSize: '16px' }}>&#xe60a;</span>
                  {currentSelectedProject.board_name}
                </div>
              ) : (
                  <DropdownSelectWithSearch
                    list={filteredNoThatTypeProject}
                    _organization_id={selectedOrg.org_id}
                    initSearchTitle={`??????${currentNounPlanFilterName(PROJECTS)}`}
                    selectedItem={currentSelectedProject}
                    board_id={currentSelectedProject.board_id}
                    handleSelectedItem={this.handleSelectedItem}
                    isShouldDisableDropdown={false}
                    iconNode={<span>&#xe60a;</span>}
                  />
                )}
              {/*???????????????????????????????????????????????????,??????????????????????????????*/}
              {((group_view_type == '1' || group_view_type == '5') && !!current_operate_board_id && !!board_card_group_id) ? (
                <div className={styles.groupList__wrapper} style={{ paddingTop: 2, marginRight: 16 }}>
                  <span className={globalStyles.authTheme} style={{ fontSize: '16px' }}>&#xe604;</span>
                  {currentSelectedProjectGroupListItem.list_name}
                </div>
              ) : (
                  <div className={styles.groupList__wrapper}>
                    <DropdownSelectWithSearch
                      list={currentSelectedProjectGroupList}
                      initSearchTitle={`${currentNounPlanFilterName(TASKS)}??????`}
                      selectedItem={currentSelectedProjectGroupListItem}
                      handleSelectedItem={this.handleSelectedProjectGroupItem}
                      isShowIcon={true}
                      isSearch={false}
                      isCanCreateNew={false}
                      isProjectGroupMode={true}
                      isShouldDisableDropdown={currentSelectedProjectGroupListItem && currentSelectedProjectGroupListItem.id}
                      iconNode={<span>&#xe604;</span>}
                    />
                  </div>
                )}

              {/*???????????????*/}
              <div className={styles.groupList__wrapper}>
                <DropdownSelectWithSearch
                  list={milestones}
                  initSearchTitle="?????????"
                  selectedItem={selected_milestone}
                  handleSelectedItem={this.handleSelectedMilestone}
                  isShowIcon={true}
                  isSearch={false}
                  isCanCreateNew={false}
                  isProjectGroupMode={true}
                  isShouldDisableDropdown={currentSelectedProjectGroupListItem && currentSelectedProjectGroupListItem.id}
                  iconNode={<span>&#xe713;</span>}
                />
              </div>
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
                itemTitle={'?????????'}
                list={currentSelectedProjectMembersList}
                handleSelectedItemChange={this.handleSelectedItemChange}
                currentSelectedProjectMember={currentSelectedProjectMember}
                use_default_member={group_view_type == '2' || group_view_type == '5'}
                use_default_member_ids={[current_list_group_id]}
                dispatch={this.props.dispatch}
                board_id={currentSelectedProject.board_id}
                inviteOthersToBoardCalbackRequest={this.inviteOthersToBoardCalbackRequest}
              />
            </div>
            <div className={styles.confirmBtn}>
              <Button
                type="primary"
                disabled={
                  !isShouldNotDisableSubmitBtn()
                  // || !isHasSelectedProjectMember()
                }
                onClick={this.handleClickedSubmitBtn}
              >
                ??????
                </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

AddTaskModal.defaultProps = {
  current_operate_board_id: '', //???????????????????????????????????????????????? id
  board_card_group_id: '', //?????????????????????id
  about_group_boards: [], //????????????????????????????????????
  handleGetNewTaskParams: function () { //?????????????????? modal ???????????????????????????

  },
  projectMemberListWhenUseInGantt: [], //?????????????????????????????????????????????????????????????????????????????????
};

export default AddTaskModal;
