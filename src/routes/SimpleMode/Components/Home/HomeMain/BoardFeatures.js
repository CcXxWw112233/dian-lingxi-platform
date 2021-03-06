import React, { Component, lazy, Suspense } from 'react'
import { connect } from 'dva'
import BoardFeaturesItem from './BoardFeaturesItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './featurebox.less'
// import TaskDetailModal from '@/components/TaskDetailModal'
// import ProcessDetailModal from '@/components/ProcessDetailModal'
import BoardFeaturesProcessItem from './BoardFeaturesProcessItem'
import {
  jsonArrayCompareSort,
  transformTimestamp,
  isObjectValueEqual,
  timeSort
} from '../../../../../utils/util'
import {
  compareOppositeTimer,
  removeEmptyArrayEle
} from '../../../../../components/ProcessDetailModal/components/handleOperateModal'
import { currentNounPlanFilterName } from '../../../../../utils/businessFunction'
import { PROJECTS } from '../../../../../globalset/js/constant'
import { Dropdown, Menu } from 'antd'
import UserRemoteSelect from './UserRemoteSelect'
import { platformNouns } from '../../../../../globalset/clientCustorm'

const TaskDetailModal = lazy(() => import('@/components/TaskDetailModal'))
const ProcessDetailModal = lazy(() => import('@/components/ProcessDetailModal'))

@connect(mapStateToProps)
export default class BoardFeatures extends Component {
  constructor(props) {
    super(props)
    let new_flow_todo_list = this.updateFlowsOppositeTime(
      props.board_flow_todo_list
    )
    this.state = {
      board_todo_list: [].concat(
        ...props.board_card_todo_list,
        ...new_flow_todo_list,
        ...props.board_meeting_todo_list
      ),
      value: []
    }
  }

  updateState = ({ value }) => {
    this.setState({
      value
    })
  }

  componentWillReceiveProps(nextprops) {
    const {
      board_card_todo_list = [],
      board_flow_todo_list = [],
      board_meeting_todo_list = []
    } = this.props
    const {
      board_card_todo_list: new_board_card_todo_list = [],
      board_flow_todo_list: new_flow_todo_list = [],
      board_meeting_todo_list: new_board_meeting_todo_list = []
    } = nextprops
    if (
      isObjectValueEqual(board_card_todo_list, new_board_card_todo_list) &&
      isObjectValueEqual(board_flow_todo_list, new_flow_todo_list) &&
      isObjectValueEqual(board_meeting_todo_list, new_board_meeting_todo_list)
    )
      return
    this.handleVagueMatching(this.state.value, nextprops)
    // this.reorderBoardToDoList(nextprops)
  }

  // ???????????????????????????????????????
  whetherShowModalVisible = ({ type, visible }) => {
    if (type == 'flow') {
      this.setState({
        whetherShowProcessDetailModal: visible
      })
    }
    if (type == 'card') {
      this.setState({
        whetherShowTaskDetailModal: visible
      })
    }
  }

  // ??????????????????????????????????????????
  updateFlowsOppositeTime = arr => {
    let new_arr = [...arr]
    new_arr = new_arr.map(item => {
      if (item.rela_type == '3' && item.deadline_type == '2') {
        let new_item = { ...item }
        new_item = { ...item, last_complete_time: compareOppositeTimer(item) }
        return new_item
      } else {
        return item
      }
    })
    return new_arr
  }
  compareEvaluationTimeArray = (array = []) => {
    if (!array || !!!array.length) return []
    let newArray = JSON.parse(JSON.stringify(array || []))
    newArray = newArray.map(item => {
      if (item.rela_type == '1' || item.rela_type == 'meeting') {
        let new_item = { ...item }
        let compare_time = item.due_time
          ? item.due_time
          : item.end_time
          ? item.end_time
          : item.create_time
        new_item = { ...item, compare_time: compare_time }
        return new_item
      } else if (item.rela_type == '3') {
        let new_item = { ...item }
        let compare_time = item.last_complete_time
        new_item = { ...item, compare_time: compare_time }
        return new_item
      }
    })
    return newArray
  }

  // ????????????
  reorderBoardToDoList = (props, data) => {
    const {
      board_card_todo_list = [],
      board_flow_todo_list = [],
      board_meeting_todo_list = []
    } = props
    let new_flow_todo_list = this.updateFlowsOppositeTime(board_flow_todo_list)
    let new_board_todo_list = data
      ? data
      : [].concat(
          ...board_card_todo_list,
          ...new_flow_todo_list,
          ...board_meeting_todo_list
        )
    // 1. ??????????????? ????????????????????????
    let temp_overrule_arr = new_board_todo_list.filter(
      item => item.runtime_type == '1'
    ) // ????????????????????????????????????????????????

    let overrule_arr = timeSort(
      this.compareEvaluationTimeArray(temp_overrule_arr),
      'compare_time'
    )
    // 2. ??????????????????????????????????????????????????????????????????????????? ??????????????????
    let temp_overrule_time_arr = new_board_todo_list.filter(
      item =>
        item.runtime_type != '1' &&
        (((item.rela_type == '1' || item.rela_type == '2') && item.due_time) ||
          (item.rela_type == '3' && item.deadline_type == '2') ||
          (item.rela_type == 'meeting' && item.end_time))
    )
    let non_overrule_time_arr = timeSort(
      this.compareEvaluationTimeArray(temp_overrule_time_arr),
      'compare_time'
    )
    // 3.?????????????????????????????????????????? ??????????????????
    let temp_overrule_non_time_arr = new_board_todo_list.filter(
      item =>
        item.runtime_type != '1' &&
        (((item.rela_type == '1' || item.rela_type == '2') && !item.due_time) ||
          (item.rela_type == '3' && item.deadline_type == '1'))
    )
    let non_overrule_non_time_arr = timeSort(
      this.compareEvaluationTimeArray(temp_overrule_non_time_arr),
      'compare_time'
    )
    // ?????????????????????????????????????????? ?????? ?????? ????????? due_time ????????? start_time, ?????????????????????create_time, ???????????? last_complete_time
    this.setState({
      board_todo_list: removeEmptyArrayEle(
        [].concat(
          ...overrule_arr,
          ...non_overrule_time_arr,
          ...non_overrule_non_time_arr
        )
      )
    })
  }

  // ???????????????????????????
  setProcessDetailModalVisibile = data => {
    const { dispatch, simplemodeCurrentProject = {} } = this.props
    const { board_id } = simplemodeCurrentProject
    let params = {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
    if (board_id && board_id != '0') {
      params.board_id = board_id
    }
    dispatch({
      type: 'simplemode/getBoardsProcessTodoList',
      payload: params
    })
    this.setState({
      whetherShowProcessDetailModal: false
    })
  }

  // ????????????
  whetherUpdateWorkbenchPorcessListData = type => {
    if (type) {
      const { board_todo_list = [] } = this.state
      const {
        processInfo: { id: flow_instance_id }
      } = this.props
      let new_board_todo_list = [...board_todo_list]
      new_board_todo_list = new_board_todo_list.filter(
        item => item.id != flow_instance_id
      )
      this.setState({
        board_todo_list: new_board_todo_list
      })
    }
  }

  // ????????????
  handleCard = ({ card_id, drawContent = {}, operate_properties_code }) => {
    const { is_realize } = drawContent
    // ???????????????
    if (is_realize == '1') {
      this.handleDeleteCard({ card_id })
      return
    }
    // ????????????
    if ('EXECUTOR' == operate_properties_code) {
      const { properties } = drawContent
      const user_id = (localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : {}
      ).id
      const excutors =
        (properties.find(item => item.code == 'EXECUTOR') || {}).data || []
      if (excutors.findIndex(item => item.user_id == user_id) == -1) {
        this.handleDeleteCard({ card_id })
        return
      }
    }
    const { dispatch, board_card_todo_list = [] } = this.props
    const new_board_card_todo_list = [...board_card_todo_list]
    const index = new_board_card_todo_list.findIndex(item => item.id == card_id)
    if (index == -1) {
      return
    }
    new_board_card_todo_list[index] = {
      ...new_board_card_todo_list[index],
      ...drawContent,
      name: drawContent.card_name
    }
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        board_card_todo_list: new_board_card_todo_list
      }
    })
  }
  handleDeleteCard = ({ card_id }) => {
    const { board_card_todo_list = [], dispatch } = this.props
    const new_board_card_todo_list = [...board_card_todo_list]
    const index = new_board_card_todo_list.findIndex(item => item.id == card_id)

    new_board_card_todo_list.splice(index, 1)
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        board_card_todo_list: new_board_card_todo_list
      }
    })
  }

  // ?????????????????????
  handleMenuReallySelect = e => {
    const { domEvent, key } = e
    domEvent && domEvent.stopPropagation()
    const { simplemodeCurrentProject } = this.props
    this.props.dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        simplemodeCurrentProject: {
          ...simplemodeCurrentProject,
          selected_todo_list_time: key
        }
      }
    })
    switch (key) {
      case 'all_time': // ????????????
        this.setTaskDetailModalVisible()
        this.setProcessDetailModalVisibile()
        this.setQueryMeetingList()
        break
      case 'recently_week': // ????????????
        this.setTaskDetailModalVisible({ limit_time: 7 })
        this.setProcessDetailModalVisibile({ limit_time: 7 })
        this.setQueryMeetingList({ limit_time: 7 })
        break
      case 'recently_month': // ????????????
        this.setTaskDetailModalVisible({ limit_time: 31 })
        this.setProcessDetailModalVisibile({ limit_time: 31 })
        this.setQueryMeetingList({ limit_time: 31 })
        break
      default:
        break
    }
  }

  // ????????????????????????
  timeQuantum = () => {
    const {
      simplemodeCurrentProject: { selected_todo_list_time }
    } = this.props
    return (
      <Menu
        onClick={this.handleMenuReallySelect}
        selectedKeys={[selected_todo_list_time]}
      >
        <Menu.Item key={'all_time'}>????????????</Menu.Item>
        <Menu.Item key={'recently_week'}>????????????</Menu.Item>
        <Menu.Item key={'recently_month'}>????????????</Menu.Item>
      </Menu>
    )
  }

  // ?????????????????????????????????
  renderDiffRelaTypeFeaturesItem = value => {
    const { id, rela_type } = value
    switch (rela_type) {
      case '1': // ????????????
        return (
          <BoardFeaturesItem
            whetherShowModalVisible={this.whetherShowModalVisible}
            key={id}
            itemValue={value}
          />
        )
      case '2': // ????????????
        // return <BoardFeaturesItem key={id} itemValue={value} />
        break
      case '3': // ????????????
        return (
          <BoardFeaturesProcessItem
            whetherShowModalVisible={this.whetherShowModalVisible}
            key={id}
            itemValue={value}
          />
        )
        break
      default:
        return <BoardFeaturesItem key={id} itemValue={value} />
        break
    }
  }
  renderTodoList = () => {
    const {
      board_card_todo_list = [],
      simplemodeCurrentProject: { selected_board_term },
      projectList = []
    } = this.props
    const { board_todo_list = [] } = this.state
    let tempBoardToDoList = [...board_todo_list]
    let tempProjectList = [...projectList]
    if (selected_board_term == '1') {
      // ??????????????????
      const { id } = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : {}
      let temp = tempProjectList.filter(item => item.user_id == id)
      tempBoardToDoList =
        tempBoardToDoList.filter(item =>
          temp.find(i => i.board_id == item.board_id)
        ) || []
    } else if (selected_board_term == '2') {
      // ????????????????????????
      let temp = tempProjectList.filter(item => item.is_principal == '1')
      tempBoardToDoList =
        tempBoardToDoList.filter(item =>
          temp.find(i => i.board_id == item.board_id)
        ) || []
    } else {
      tempBoardToDoList = [...board_todo_list]
    }
    return tempBoardToDoList.length ? (
      tempBoardToDoList
        .sort((a, b) => {
          return +(b.is_urge || 0) - +(a.is_urge || 0)
        })
        .map(value => {
          const { id } = value
          // return <BoardFeaturesProcessItem key={id} itemValue={value} />
          return <>{this.renderDiffRelaTypeFeaturesItem(value)}</>
        })
    ) : (
      <div className={`${globalStyles.authTheme} ${styles.nodataArea}`}>
        <div className={`${globalStyles.authTheme} ${styles.alarm}`}>
          &#xe6fb;
        </div>
        <div className={`${styles.title}`}>??????????????????</div>
      </div>
    )
  }

  // ?????????????????????????????????????????????????????????????????????????????????????????????
  setTaskDetailModalVisible = data => {
    const { dispatch, simplemodeCurrentProject = {} } = this.props
    const { board_id } = simplemodeCurrentProject
    let params = {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
    if (board_id && board_id != '0') {
      params.board_ids = board_id
    }
    dispatch({
      type: 'simplemode/getBoardsTaskTodoList',
      payload: params
    })
    this.setState({
      whetherShowTaskDetailModal: false
    })
  }

  // ????????????????????????
  setQueryMeetingList = data => {
    const { dispatch, simplemodeCurrentProject = {} } = this.props
    const { board_id } = simplemodeCurrentProject
    let params = {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
    if (board_id && board_id != '0') {
      params.board_id = board_id
    }
    dispatch({
      type: 'simplemode/getMeetingTodoList',
      payload: params
    })
  }

  // ??????????????????
  handleVagueMatching = (value, props) => {
    const {
      board_card_todo_list = [],
      board_flow_todo_list = [],
      board_meeting_todo_list = []
    } = props ? props : this.props
    let new_board_todo_list = removeEmptyArrayEle(
      [].concat(
        ...board_card_todo_list,
        ...board_flow_todo_list,
        ...board_meeting_todo_list
      )
    )
    let temp_board_todo_list = removeEmptyArrayEle(
      [].concat(
        ...board_card_todo_list,
        ...board_flow_todo_list,
        ...board_meeting_todo_list
      )
    )
    if (!(value && value.length)) {
      this.reorderBoardToDoList(props ? props : this.props)
      return
    }
    let str = value.join(',')
    let parentIds = []
    // ?????????????????????????????????
    new_board_todo_list =
      new_board_todo_list.filter(
        item =>
          item.related_milestone &&
          Object.keys(item.related_milestone).length &&
          str.indexOf(item.related_milestone.name) != -1
      ) || []
    !!(new_board_todo_list && new_board_todo_list.length) &&
      new_board_todo_list.map(item => {
        parentIds.push(item.id)
      })
    temp_board_todo_list = temp_board_todo_list.filter(
      item =>
        parentIds.indexOf(item.id) != -1 ||
        (item.parent_id && parentIds.indexOf(item.parent_id) != -1)
    )
    this.reorderBoardToDoList(props ? props : this.props, temp_board_todo_list)
  }

  renderWelcome = () => {
    return (
      <div className={`${globalStyles.authTheme} ${styles.nodataArea2}`}>
        <div className={`${globalStyles.authTheme} ${styles.alarm}`}>
          &#xe704;
        </div>
        <div className={`${styles.title}`}>
          ????????????{platformNouns}??????????????????
          {`${currentNounPlanFilterName(PROJECTS, this.props.currentNounPlan)}`}
          ???????????????????????????
          {`${currentNounPlanFilterName(PROJECTS, this.props.currentNounPlan)}`}
          ????????????
        </div>
      </div>
    )
  }

  render() {
    const {
      drawerVisible,
      projectList = [],
      projectInitLoaded,
      board_card_todo_list = [],
      process_detail_modal_visible
    } = this.props
    const {
      simplemodeCurrentProject: { selected_todo_list_time }
    } = this.props
    const {
      whetherShowProcessDetailModal,
      whetherShowTaskDetailModal
    } = this.state
    const selected_filed_time =
      !selected_todo_list_time || selected_todo_list_time == 'all_time'
        ? '????????????'
        : selected_todo_list_time == 'recently_week'
        ? '????????????'
        : selected_todo_list_time == 'recently_month'
        ? '????????????'
        : '????????????'
    return (
      <div id={'featurebox_featuresContent'}>
        {projectInitLoaded ? (
          projectList.length ? (
            <>
              <div style={{ display: 'flex', position: 'relative' }}>
                <Dropdown
                  overlayClassName={styles.overlay_featurebox_dropdown}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlay={this.timeQuantum()}
                  trigger={['click']}
                >
                  <div
                    style={{
                      color: '#FFF',
                      flexShrink: 0,
                      lineHeight: '20px',
                      marginLeft: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    {selected_filed_time}&nbsp;&nbsp;
                    <span className={globalStyles.authTheme}>&#xe687;</span>
                  </div>
                </Dropdown>
                <div className={styles.debounce_select_wrapper}>
                  <span className={globalStyles.authTheme}>&#xe603;</span>
                  <UserRemoteSelect
                    value={this.state.value}
                    updateState={this.updateState}
                    handleVagueMatching={this.handleVagueMatching}
                  />
                </div>
              </div>
              {this.renderTodoList()}
            </>
          ) : (
            this.renderWelcome()
          )
        ) : (
          ''
        )}
        <div
          className={styles.feature_item}
          style={{ display: board_card_todo_list.length ? 'block' : 'none' }}
        ></div>
        <Suspense fallback={''}>
          {drawerVisible && whetherShowTaskDetailModal && (
            <TaskDetailModal
              task_detail_modal_visible={
                drawerVisible && whetherShowTaskDetailModal
              }
              setTaskDetailModalVisible={this.setTaskDetailModalVisible} //????????????????????????
              handleTaskDetailChange={this.handleCard}
              handleDeleteCard={this.handleDeleteCard}
            />
          )}
          {process_detail_modal_visible && whetherShowProcessDetailModal && (
            <ProcessDetailModal
              process_detail_modal_visible={process_detail_modal_visible}
              setProcessDetailModalVisibile={this.setProcessDetailModalVisibile}
              whetherUpdateWorkbenchPorcessListData={
                this.whetherUpdateWorkbenchPorcessListData
              }
            />
          )}
        </Suspense>
      </div>
    )
  }
}

//  ??????????????????????????????state????????????UI ????????????props?????????????????????
function mapStateToProps({
  simplemode: {
    simplemodeCurrentProject,
    board_card_todo_list = [],
    board_flow_todo_list = [],
    board_meeting_todo_list = []
  },
  workbench: {
    datas: { projectList, projectInitLoaded }
  },
  technological: {
    datas: { currentUserOrganizes, currentSelectOrganize = {} }
  },
  publicTaskDetailModal: { drawerVisible },
  publicProcessDetailModal: { process_detail_modal_visible, processInfo = {} },
  organizationManager: {
    datas: { currentNounPlan }
  }
}) {
  return {
    simplemodeCurrentProject,
    currentUserOrganizes,
    currentSelectOrganize,
    board_card_todo_list,
    board_flow_todo_list,
    board_meeting_todo_list,
    drawerVisible,
    projectList,
    projectInitLoaded,
    process_detail_modal_visible,
    processInfo,
    currentNounPlan
  }
}
