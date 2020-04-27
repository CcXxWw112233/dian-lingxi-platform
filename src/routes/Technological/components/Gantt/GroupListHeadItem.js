import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { Avatar, Dropdown, Menu, Input, message, Tooltip, Modal } from 'antd'
import { getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard, getOrgIdByBoardId, selectBoardToSeeInfo } from '../../../../utils/businessFunction';
import { archivedProject, deleteProject, quitProject } from '../../../../services/technological/project'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '@/components/avatarList'
import CheckItem from '@/components/CheckItem'
import { updateTaskGroup, deleteTaskGroup, } from '../../../../services/technological/task';
import { updateProject, addMenbersInProject, toggleContentPrivilege, removeContentPrivilege, setContentPrivilege, collectionProject, cancelCollection } from '../../../../services/technological/project';
import { isApiResponseOk } from '../../../../utils/handleResponseData';
import ShowAddMenberModal from '../../../../routes/Technological/components/Project/ShowAddMenberModal'
import { PROJECT_TEAM_BOARD_MEMBER, PROJECT_TEAM_BOARD_EDIT, PROJECT_TEAM_CARD_GROUP, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME, PROJECT_TEAM_BOARD_ARCHIVE, PROJECTS, PROJECT_TEAM_BOARD_DELETE, PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE } from '../../../../globalset/js/constant';
import VisitControl from '../VisitControl/index'
import globalStyle from '@/globalset/css/globalClassName.less'
import { ganttIsFold, ganttIsOutlineView } from './constants';
import DetailInfo from '@/routes/Technological/components/ProjectDetail/DetailInfo/index'
import { deleteBoardFollow } from './ganttBusiness';
import { currentNounPlanFilterName, setBoardIdStorage } from "@/utils/businessFunction";
import AddGroupSection from './components/AddGroupsection'
import ArchiveSelect from './components/ArchiveSelect'

@connect(mapStateToProps)
export default class GroupListHeadItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowBottDetail: '0', //0 初始化(关闭) 1展开 2 关闭
      show_edit_input: false,
      edit_input_value: '',
      local_list_name: '',
      show_add_menber_visible: false,
      board_info_visible: false,
      menu_oprate_visible: false, //菜单项显示状态（仅作标记）
      arhcived_modal_visible: false, //归档树弹窗是否可见
    }
    this.visitControlOtherPersonOperatorMenuItem = [
      {
        key: '可访问',
        value: 'read'
      },
      {
        key: '移出',
        value: 'remove',
        style: {
          color: '#f73b45'
        }
      }
    ]
  }
  noTimeAreaScroll(e) {
    e.stopPropagation()
  }
  componentDidMount() {
    const { itemValue = {} } = this.props
    const { list_name } = itemValue
    this.setState({
      edit_input_value: list_name,
      local_list_name: list_name
    })
  }
  setIsShowBottDetail = () => {
    const { isShowBottDetail } = this.state
    let new_isShowBottDetail = '1'
    if (isShowBottDetail == '0') {
      new_isShowBottDetail = '1'
    } else if (isShowBottDetail == '1') {
      new_isShowBottDetail = '2'
    } else if (isShowBottDetail == '2') {
      new_isShowBottDetail = '1'
    } else {

    }
    this.setState({
      isShowBottDetail: new_isShowBottDetail
    })
  }
  setLableColor = (label_data) => {
    let bgColor = ''
    let b = ''
    if (label_data && label_data.length) {
      const color_arr = label_data.map(item => {
        return `rgb(${item.label_color})`
      })
      const color_arr_length = color_arr.length
      const color_percent_arr = color_arr.map((item, index) => {
        return (index + 1) / color_arr_length * 100
      })
      bgColor = color_arr.reduce((total, color_item, current_index) => {
        return `${total},  ${color_item} ${color_percent_arr[current_index - 1] || 0}%, ${color_item} ${color_percent_arr[current_index]}%`
      }, '')

      b = `linear-gradient(to right${bgColor})`
    } else {
      b = '#ffffff'
    }
    return b
  }

  // 未分组任务点击事件
  noTimeCardClick = ({ id, board_id }) => {
    const { dispatch, setTaskDetailModalVisibile, list_id } = this.props
    setTaskDetailModalVisibile && setTaskDetailModalVisibile('no_schedule')
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        current_list_group_id: list_id
      }
    })
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawerVisible: true,
        card_id: id,
      }
    })
    // dispatch({
    //   type: 'workbenchTaskDetail/getCardDetail',
    //   payload: {
    //     id,
    //     board_id,
    //     calback: function (data) {
    //       dispatch({
    //         type: 'workbenchPublicDatas/getRelationsSelectionPre',
    //         payload: {
    //           _organization_id: data.org_id
    //         }
    //       })
    //     }
    //   }
    // })
    // dispatch({
    //   type: 'workbenchTaskDetail/getCardCommentListAll',
    //   payload: {
    //     id: id
    //   }
    // })
    dispatch({
      type: 'workbenchPublicDatas/updateDatas',
      payload: {
        board_id
      }
    })
  }

  renderTaskItem = () => {
    const { itemValue = {} } = this.props
    const { list_no_time_data = [] } = itemValue
    return (
      <div
        className={indexStyles.no_time_card_area_out}
        // style={{ height: (group_rows[itemKey] || 2) * ceiHeight - 50 }}
        onScroll={this.noTimeAreaScroll.bind(this)}>
        <div className={indexStyles.no_time_card_area}>
          {
            list_no_time_data.map((value, key) => {
              const { name, id, is_realize, executors = [], label_data = [], board_id, is_privilege } = value || {}
              return (
                <div
                  onClick={() => this.noTimeCardClick({ id, board_id })}
                  style={{ background: this.setLableColor(label_data) }}
                  className={indexStyles.no_time_card_area_card_item}
                  key={`${id}-${is_privilege}`}>
                  <div className={indexStyles.no_time_card_area_card_item_inner}>
                    <div className={`${indexStyles.card_item_status}`}>
                      <CheckItem is_realize={is_realize} />
                    </div>
                    <div className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}>
                      {name}
                      {
                        is_privilege == '1' && (
                          <Tooltip title="已开启访问控制" placement="top">
                            <span style={{ color: 'rgba(0,0,0,0.50)', marginRight: '5px', marginLeft: '5px' }}>
                              <span className={`${globalStyles.authTheme}`}>&#xe7ca;</span>
                            </span>
                          </Tooltip>
                        )
                      }
                    </div>
                    <div>
                      <AvatarList users={executors} size={'small'} />
                    </div>
                  </div>

                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
  //分组名点击
  listNameClick = () => {
    const { itemValue, gantt_board_id, dispatch, group_view_type } = this.props
    const { local_list_name } = this.state
    if (group_view_type != '1') { //必须要在项目视图 或项目分组才能看
      return
    }
    const { list_id } = itemValue
    if (gantt_board_id == '0') {
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          gantt_board_id: list_id,
          list_group: [],
        }
      })
      selectBoardToSeeInfo({ board_id: list_id, board_name: local_list_name, dispatch })
    } else {
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          group_view_type: '5',
          gantt_board_list_id: list_id,
          list_group: [],
        }
      })
      dispatch({
        type: 'gantt/getGanttData',
        payload: {

        }
      })
    }

    // dispatch({
    //   type: 'gantt/getGanttData',
    //   payload: {

    //   }
    // })
  }
  //添加项目组成员操作
  setShowAddMenberModalVisibile = () => {
    this.setState({
      show_add_menber_visible: !this.state.show_add_menber_visible
    })
  }

  addMenbersInProject = (values) => {
    const { dispatch } = this.props
    addMenbersInProject({ ...values }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('已成功添加项目成员')
        setTimeout(() => {
          dispatch({
            type: 'gantt/getAboutUsersBoards',
            payload: {

            }
          })
        }, 1000)

      } else {
        message.error(res.message)
      }
    })
  }

  // 包裹访问控制的div点击事件
  handleVisitorWrapper = (e) => {
    e && e.stopPropagation()
  }

  // 包裹访问控制的div鼠标mosedown事件
  handleVisitorControlMouseDown = (board_id) => {
    this.setState({
      VisitControlPopoverVisible: true
    })
    const { VisitControlPopoverVisible } = this.state
    if (VisitControlPopoverVisible) return false
    this.props.dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id
      }
    })
  }

  // 操作项点击
  handleMenuSelect = ({ key }) => {
    const { itemValue = {}, gantt_board_id, dispatch } = this.props
    const { list_id, org_id } = itemValue
    const params_board_id = gantt_board_id == '0' ? list_id : gantt_board_id
    // 点击的时候需要更新baseInfo
    setBoardIdStorage(params_board_id, org_id)
    switch (key) {
      case 'invitation':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, params_board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.setShowAddMenberModalVisibile()
        break
      case 'rename':
        const rename_permission_code = gantt_board_id == '0' ? PROJECT_TEAM_BOARD_EDIT : PROJECT_TEAM_CARD_GROUP
        if (!checkIsHasPermissionInBoard(rename_permission_code, params_board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.setState({
          show_edit_input: true
        })
        break
      case 'delete_group':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_GROUP, params_board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.requestDeleteGroup()
        break
      case 'archived':
        // this.archivedProjectCalback({ board_id: params_board_id })
        this.set_arhcived_modal_visible()
        // this.archivedProject({ board_id: params_board_id })
        break
      case 'visitorControl':
        // this.set
        break
      case 'board_info':
        this.setBoardInfoVisible()
        break
      case 'deleteBoard': // 删除项目
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_DELETE, params_board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.deleteProject({ board_id: params_board_id })
        break
      case 'quitBoard': // 退出项目
        this.quitProject({ board_id: params_board_id })
        break
      default:
        break
    }
  }
  setShowEditInput = (bool) => {
    this.setState({
      show_edit_input: bool,
    })
  }
  setLocalListName = (value) => {
    if (value) {
      this.setState({
        local_list_name: value
      })
    }
  }
  // 更改名称
  inputOnBlur = (e) => {
    this.setShowEditInput(false)
  }
  inputOnchange = (e) => {
    const { value } = e.target
    if (value.trimLR() == '') {
      message.warn('项目名称不能为空')
      this.setState({
        edit_input_value: ''
      })
      return false
    }
    this.setState({
      edit_input_value: value
    })
  }
  inputOnPressEnter = (e) => {
    this.setShowEditInput(false)
    const { gantt_board_id, list_id } = this.props
    const { edit_input_value, local_list_name } = this.state
    const edit_input_value_trim = edit_input_value.trim()
    if (local_list_name == edit_input_value || !!!edit_input_value || !!!edit_input_value_trim) { //检测到输入变化
      this.setState({
        edit_input_value: local_list_name
      })
      return
    }
    this.setState({
      edit_input_value: edit_input_value_trim
    })
    if (gantt_board_id == '0') {
      this.requestUpdateBoard({ board_id: list_id, name: edit_input_value_trim })
    } else {
      this.requestUpdateGroup({ id: list_id, name: edit_input_value_trim, board_id: gantt_board_id })
    }

  }
  // 更新文件区域项目名称
  updateBoardFiles = ({ board_id, name }) => {
    const { dispatch, boards_flies } = this.props
    let new_boards_flies = boards_flies.map(item => {
      let new_item = { ...item }
      if (board_id == item.id) {
        new_item.board_name = name
      }
      return new_item
    })
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        boards_flies: new_boards_flies
      }
    })
  }
  updateBoardsName = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutAppsBoards',
      payload: {

      }
    })
    dispatch({
      type: 'gantt/getAboutGroupBoards',
      payload: {

      }
    })
    dispatch({
      type: 'gantt/getAboutUsersBoards',
      payload: {

      }
    })
  }
  updateProjectList = ({ board_id, name }) => {
    const { projectList = [], dispatch } = this.props
    const new_arr = [...projectList]
    const index = new_arr.findIndex(item => item.board_id == board_id)
    new_arr[index].board_name = name
    // debugger
    dispatch({
      type: 'workbench/updateDatas',
      payload: {
        projectList: new_arr
      }
    })
  }
  // 请求更新项目名称
  requestUpdateBoard = (data = {}) => {
    updateProject({ ...data }).then(res => {
      if (isApiResponseOk(res)) {
        this.setLocalListName(this.state.edit_input_value)
        // debugger
        message.success('已成功更新项目名称')
        global.constants.lx_utils.editBoardName({ board_id: data.board_id, name: data.name }) //更新圈子
        this.updateBoardFiles(data)
        this.updateBoardsName()
        this.updateProjectList(data)
      } else {
        message.error(res.message)
      }
    })
  }
  // 请求更新分组名称
  requestUpdateGroup = (data = {}) => {
    const { dispatch } = this.props
    updateTaskGroup({
      ...data,
    }).then(res => {
      if (isApiResponseOk(res)) {
        dispatch({
          type: 'gantt/getAboutGroupBoards',
          payload: {}
        })
        this.setLocalListName(this.state.edit_input_value)
        message.success('已成功更新分组名称')
      } else {
        message.error(res.message)
      }
    })
  }
  // 请求删除分组名称
  requestDeleteGroup = () => {
    const { gantt_board_id, list_id, list_group = [], dispatch } = this.props

    deleteTaskGroup({ board_id: gantt_board_id, id: list_id }).then(res => {
      if (isApiResponseOk(res)) {
        // 过滤掉该项
        let new_list_group = list_group.filter(item => item.list_id != list_id)
        dispatch({
          type: 'gantt/getAboutGroupBoards',
          payload: {}
        })
        dispatch({
          type: 'gantt/handleListGroup',
          payload: {
            data: new_list_group
          }
        })
        message.success('删除分组成功')
      } else {
        message.error(res.message)
      }
    })
  }
  dropdwonVisibleChange = (bool) => {
    this.setState({
      renderVistorContorlVisible: bool,
      menu_oprate_visible: bool
    })
  }
  // 项目归档---
  handleArchivedBoard = () => {
    const { dispatch } = this.props
    const { list_group = [], list_id } = this.props
    let list_group_new = [...list_group].filter(item => item.lane_id != list_id)
    dispatch({
      type: 'gantt/handleListGroup',
      payload: {
        data: list_group_new
      }
    })
    dispatch({
      type: 'gantt/getGttMilestoneList',
      payload: {
      }
    })
  }
  set_arhcived_modal_visible = () => {
    const { arhcived_modal_visible } = this.state
    this.setState({
      arhcived_modal_visible: !arhcived_modal_visible
    })
  }
  // 选择归档后的回调
  archivedProjectCalback = (data) => {
    const { board_id } = data
    this.set_arhcived_modal_visible()
    const that = this
    archivedProject({ is_archived: '1', board_id }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('已成功归档该项目')
        that.handleArchivedBoard()
        deleteBoardFollow()
      } else {
        message.error(res.message)
      }
    })
  }
  archivedProject = ({ board_id }) => {
    if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_ARCHIVE, board_id)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const that = this
    Modal.confirm({
      title: `归档该项目？`,
      zIndex: 1007,
      // content: <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
      //   <span >删除后不可恢复</span>
      // </div>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        archivedProject({ is_archived: '1', board_id }).then(res => {
          if (isApiResponseOk(res)) {
            message.success('已成功归档该项目')
            that.handleArchivedBoard()
            deleteBoardFollow()
          } else {
            message.error(res.message)
          }
        })
      }
    })
  }

  // 项目删除 --- S
  deleteProject = ({ board_id }) => {
    const that = this
    // const modal = Modal.confirm();
    Modal.confirm({
      title: `确认要删除该${currentNounPlanFilterName(PROJECTS)}吗？`,
      content: <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
        <span >删除后将无法获取该{currentNounPlanFilterName(PROJECTS)}的相关动态</span>
      </div>,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteProject(board_id).then(res => {
          if (isApiResponseOk(res)) {
            setTimeout(() => message.success(`已成功删除该${currentNounPlanFilterName(PROJECTS)}`), 200)
            that.handleArchivedBoard()
            deleteBoardFollow()
            that.props.dispatch({
              type: 'workbench/getProjectList',
              payload: {}
            });
            // modal.destroy();
          } else {
            message.warn(res.message)
          }
        })
      },
      onCancel: () => {
        // modal.destroy();
      }
    });
  }
  // 项目删除 --- E

  // 退出项目 --- S
  quitProject = ({ board_id }) => {
    const that = this
    const modal = Modal.confirm();
    modal.update({
      title: `确认要退出该${currentNounPlanFilterName(PROJECTS)}吗？`,
      content: <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
        <span >退出后将无法获取该{currentNounPlanFilterName(PROJECTS)}的相关动态</span>
      </div>,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        quitProject({ board_id }).then(res => {
          if (isApiResponseOk(res)) {
            setTimeout(() => message.success(`已成功退出该${currentNounPlanFilterName(PROJECTS)}`), 200)
            that.handleArchivedBoard()
            deleteBoardFollow()
            that.props.dispatch({
              type: 'workbench/getProjectList',
              payload: {}
            });
            modal.destroy();
          } else {
            message.warn(res.message)
          }
        })
      },
      onCancel: () => {
        modal.destroy();
      }
    });
  }
  // 退出项目 --- E

  // 查看项目信息
  setBoardInfoVisible = () => {
    const { board_info_visible } = this.state
    const { dispatch, list_id, itemValue: { org_id } } = this.props
    if (!board_info_visible) {
      dispatch({
        type: 'projectDetail/projectDetailInfo',
        payload: {
          id: list_id
        }
      })
      dispatch({
        type: 'projectDetail/getProjectRoles',
        payload: {
          type: '2',
          _organization_id: org_id
        }
      })
    }
    this.setState({
      board_info_visible: !board_info_visible
    })
  }

  // 操作项
  renderMenuOperateListName = () => {
    const { itemValue = {}, gantt_board_id } = this.props
    const { renderVistorContorlVisible } = this.state
    const { list_id, is_create } = itemValue
    const params_board_id = gantt_board_id == '0' ? list_id : gantt_board_id
    const rename_permission_code = gantt_board_id == '0' ? PROJECT_TEAM_BOARD_EDIT : PROJECT_TEAM_CARD_GROUP;
    // console.log("", checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, params_board_id));

    return (
      <Menu onClick={this.handleMenuSelect} onOpenChange={this.onOpenChange}>
        {/* {
          checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, params_board_id) &&
          <Menu.Item key={'invitation'}>
            邀请成员加入
          </Menu.Item>
        } */}
        {/* 渲染分组|项目对应的访问控制 */}
        {
          checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE, params_board_id) && renderVistorContorlVisible && (
            <Menu.Item key={'visitorControl'}>
              <div
                // style={{ height: 60, width: 100, backgroundColor: 'red' }}
                onClick={this.handleVisitorWrapper}
                onMouseDown={() => { gantt_board_id == '0' && this.handleVisitorControlMouseDown(params_board_id) }}>
                {this.renderVistorContorl()}
              </div>
            </Menu.Item>
          )
        }
        {
          checkIsHasPermissionInBoard(rename_permission_code, params_board_id) &&
          <Menu.Item key={'rename'}>重命名</Menu.Item>
        }
        {/* {
          gantt_board_id == '0' && (
            <Menu.Item key={'board_info'}>项目信息</Menu.Item>
          )
        } */}
        {
          gantt_board_id == '0' && checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_ARCHIVE, params_board_id) && (
            <Menu.Item key={'archived'}>归档</Menu.Item>
          )
        }
        {
          gantt_board_id == '0' && checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_DELETE, params_board_id) && (
            <Menu.Item key={'deleteBoard'}>删除{currentNounPlanFilterName(PROJECTS)}</Menu.Item>
          )
        }
        {
          gantt_board_id == '0' && is_create == '0' && (
            <Menu.Item key={'quitBoard'}>退出{currentNounPlanFilterName(PROJECTS)}</Menu.Item>
          )
        }
        {
          checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_GROUP, params_board_id) &&
          gantt_board_id != '0' &&
          <Menu.Item key={'delete_group'}>删除分组</Menu.Item>
        }
      </Menu>
    )
  }

  // 访问控制-----------start----------------------------------------

  // 这是设置访问控制之后需要更新的数据
  visitControlUpdateInGanttData = (obj = {}) => {
    const { type, is_privilege, privileges = [], removeId } = obj
    const { dispatch, itemValue: { list_id } } = this.props
    const { list_group = [], gantt_board_id, board_id, group_view_type } = this.props
    // console.log('sssss', privileges)
    const list_group_new = [...list_group]
    const group_index = list_group_new.findIndex(item => item.lane_id == list_id)

    if (type == 'privilege') {
      list_group_new[group_index].is_privilege = is_privilege
    } else if (type == 'add') {
      list_group_new[group_index].privileges = [].concat(list_group_new[group_index].privileges, privileges[0])
    } else if (type == 'remove') {
      list_group_new[group_index].privileges = list_group_new[group_index].privileges.filter((item) => item.id != removeId)
    } else {

    }
    dispatch({
      type: 'gantt/handleListGroup',
      payload: {
        data: list_group_new
      }
    })
  }

  // 访问控制的开关切换
  handleVisitControlChange = flag => {
    const { itemValue = {} } = this.props
    const { list_id, is_privilege, board_id } = itemValue
    const toBool = str => !!Number(str)
    const is_privilege_bool = toBool(is_privilege)
    if (flag === is_privilege_bool) {
      return
    }
    //toggole 权限
    const data = {
      content_id: list_id,
      content_type: 'lists',
      is_open: flag ? 1 : 0,
      board_id
    }
    toggleContentPrivilege(data).then(res => {
      if (res && res.code === '0') {
        //更新数据
        let temp_arr = res && res.data
        this.visitControlUpdateInGanttData({ is_privilege: flag ? '1' : '0', type: 'privilege', privileges: temp_arr })
      } else {
        message.warning(res.message)
      }
    })
  }

  // 移除访问控制列表
  handleVisitControlRemoveContentPrivilege = id => {
    const { itemValue = {}, gantt_board_id } = this.props
    const { list_id, privileges, board_id } = itemValue
    const content_type = 'lists'
    const content_id = list_id
    let temp_id = []
    temp_id.push(id)
    removeContentPrivilege({
      id: id,
      board_id: gantt_board_id == '0' ? list_id : board_id
    }).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        message.success('移出用户成功')
        this.visitControlUpdateInGanttData({ removeId: id, type: 'remove' })
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
   * 其他成员的下拉回调
   * @param {String} id 这是用户的user_id
   * @param {String} type 这是对应的用户字段
   * @param {String} removeId 这是对应移除用户的id
   */
  handleClickedOtherPersonListOperatorItem = (id, type, removeId) => {
    if (type === 'remove') {
      this.handleVisitControlRemoveContentPrivilege(removeId)
    } else {
      // this.handleSetContentPrivilege(id, type, '更新用户控制类型失败')
    }
  }
  /**
   * 添加成员的回调
   * @param {Array} users_arr 添加成员的数组
   */
  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return

    this.handleSetContentPrivilege(users_arr, 'read')
  }

  // 访问控制添加成员
  handleSetContentPrivilege = (users_arr, type, errorText = '访问控制添加人员失败，请稍后再试', ) => {
    const { itemValue = {}, gantt_board_id } = this.props
    const { list_id, privileges, board_id } = itemValue
    const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    const { user_id } = user_set
    const content_type = gantt_board_id == '0' ? 'board' : 'lists'
    const privilege_code = type
    const content_id = list_id
    let temp_ids = [] // 用来保存用户的id

    let new_ids = [] // 用来保存权限列表中用户id
    let new_privileges = [...privileges]
    users_arr && users_arr.map(item => {
      temp_ids.push(item.id)
    })

    let flag
    // 权限列表中的id
    new_privileges = new_privileges && new_privileges.map(item => {
      let { id } = (item && item.user_info) && item.user_info
      if (user_id == id) { // 从权限列表中找到自己
        if (temp_ids.indexOf(id) != -1) { // 判断自己是否在添加的列表中
          flag = true
        }
      }
      new_ids.push(id)
    })

    // 这里是需要做一个只添加了自己的一条提示
    if (flag && temp_ids.length == '1') { // 表示只选择了自己, 而不是全选
      message.warn('该职员已存在, 请不要重复添加', MESSAGE_DURATION_TIME)
      return false
    } else { // 否则表示进行了全选, 那么就过滤
      temp_ids = temp_ids && temp_ids.filter(item => {
        if (new_ids.indexOf(item) == -1) {
          return item
        }
      })
    }

    setContentPrivilege({
      board_id: gantt_board_id == '0' ? list_id : board_id,
      content_id,
      content_type,
      privilege_code,
      user_ids: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
        setTimeout(() => {
          message.success('添加用户成功')
        }, 500)
        let temp_arr = []
        temp_arr.push(res.data)
        this.visitControlUpdateInGanttData({ privileges: temp_arr, type: 'add' })
      } else {
        message.error(errorText)
      }
    })
  }

  // 执行人列表去重
  arrayNonRepeatfy = arr => {
    let temp_arr = []
    let temp_id = []
    for (let i = 0; i < arr.length; i++) {
      if (!temp_id.includes(arr[i]['id'])) {//includes 检测数组是否有某个值
        temp_arr.push(arr[i]);
        temp_id.push(arr[i]['id'])
      }
    }
    return temp_arr
  }
  //设置获取分组中访问控制人的列表
  getProjectParticipant = () => {
    const { itemValue: { privileges_extend = [], lane_data: { card_no_times, cards } } } = this.props
    // 1. 这是将在每一个card_data中的存在的executors取出来,保存在一个数组中
    const card_data = [].concat(card_no_times, cards)
    const projectParticipant = card_data.reduce((acc, curr) =>
      // console.log(acc, '------', curr, 'sssssss')
      [...acc, ...(curr && curr.executors && curr.executors.length ? curr.executors.filter(i => !acc.find(e => e.user_id === i.user_id)) : [])], []
    )
    // 2. 如果存在extend列表中的成员也要拼接进来, 然后去重
    const extendParticipant = privileges_extend && [...privileges_extend]
    let temp_projectParticipant = [].concat(...projectParticipant, extendParticipant) // 用来保存新的负责人列表
    let new_projectParticipant = this.arrayNonRepeatfy(temp_projectParticipant)
    return new_projectParticipant
  }

  // 获取项目详情中的成员列表
  getProjectDetailInfoData = () => {
    const { projectDetailInfoData = {}, itemValue } = this.props
    const { data: projectParticipant = [] } = projectDetailInfoData
    const { privileges_extend = [] } = itemValue
    let temp_projectParticipant = [].concat(projectParticipant && [...projectParticipant], privileges_extend && [...privileges_extend])
    const removeEmptyArrayEle = (arr) => {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == undefined) {
          arr.splice(i, 1);
          i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
          // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
        }
      }
      return arr;
    };
    let new_projectParticipant = this.arrayNonRepeatfy(removeEmptyArrayEle(temp_projectParticipant))
    return new_projectParticipant
  }

  renderVistorContorl = () => {
    const { itemValue = {}, gantt_board_id } = this.props
    const { list_id, board_id, is_privilege = '0', privileges = [], org_id } = itemValue
    return (
      <VisitControl
        invitationType={gantt_board_id == '0' ? '2' : '5'}
        invitationId={list_id}
        board_id={gantt_board_id == '0' ? list_id : board_id}
        popoverPlacement={'rightTop'}
        type={gantt_board_id == '0' && 'board_list'}
        isPropVisitControl={is_privilege === '0' ? false : true}
        principalList={gantt_board_id == '0' ? this.getProjectDetailInfoData() : this.getProjectParticipant()}
        // principalInfo='位任务列表负责人'
        otherPrivilege={privileges}
        otherPersonOperatorMenuItem={this.visitControlOtherPersonOperatorMenuItem}
        removeMemberPromptText='移出后用户将不能访问此任务列表'
        handleVisitControlChange={this.handleVisitControlChange}
        handleClickedOtherPersonListOperatorItem={this.handleClickedOtherPersonListOperatorItem}
        handleAddNewMember={this.handleVisitControlAddNewMember}
        handleVisitControlPopoverVisible={this.handleVisitControlPopoverVisible}
      >
        <span>访问控制</span>
      </VisitControl>
    )
  }

  // 访问控制 ----------------end-----------------------------

  // 置顶
  roofTop = (type) => {
    const { dispatch, itemValue: { list_id, org_id } } = this.props
    const { list_group = [] } = this.props
    const list_group_new = [...list_group]
    const group_index = list_group_new.findIndex(item => item.lane_id == list_id)
    //排序项目列表
    const { projectList = [] } = this.props
    const _arr_new = JSON.parse(JSON.stringify(projectList))
    const _index = _arr_new.findIndex(item => item.board_id == list_id)

    if (type == '0') { //取消置顶
      cancelCollection({ org_id, board_id: list_id }).then(res => {
        if (isApiResponseOk(res)) {
          // 排序甘特图分组
          list_group_new[group_index].is_star = '0'
          _arr_new[_index].is_star = '0'
          list_group_new.push(list_group_new[group_index]) //将该项往最后插入
          list_group_new.splice(group_index, 1) //删除掉该项
          dispatch({
            type: 'gantt/handleListGroup',
            payload: {
              data: list_group_new
            }
          })
          // 排序项目列表
          dispatch({
            type: 'workbench/sortProjectList',
            payload: {
              data: _arr_new
            }
          })
        } else {
          message.error(res.message)
        }
      })
    } else {
      collectionProject({ org_id, board_id: list_id }).then(res => {
        if (isApiResponseOk(res)) {
          // 排序甘特图分组
          list_group_new[group_index].is_star = '1'
          list_group_new.unshift(list_group_new[group_index]) //将该项往第一插入
          list_group_new.splice(group_index + 1, 1) //删除掉该项
          dispatch({
            type: 'gantt/handleListGroup',
            payload: {
              data: list_group_new
            }
          })
          // 排序项目列表
          _arr_new[_index].is_star = '1'
          _arr_new.unshift(_arr_new[_index]) //将该项往第一插入
          _arr_new.splice(_index + 1, 1) //删除掉该项
          dispatch({
            type: 'workbench/updateDatas',
            payload: {
              projectList: _arr_new
            }
          })
        } else {
          message.error(res.message)
        }
      })
    }
  }
  render() {

    const { currentUserOrganizes = [], gantt_board_id = [], ceiHeight, is_show_org_name, is_all_org, rows = 5, show_board_fold, group_view_type, get_gantt_data_loading } = this.props
    const { itemValue = {}, itemKey } = this.props
    const { is_star, list_name, org_id, list_no_time_data = [], list_id, lane_icon, board_id, is_privilege = '0', privileges, create_by = {}, lane_overdue_count } = itemValue
    const { isShowBottDetail, show_edit_input, local_list_name, edit_input_value, show_add_menber_visible, board_info_visible, menu_oprate_visible, arhcived_modal_visible } = this.state
    const board_create_user = create_by.name
    const { list_data } = itemValue
    return (
      <div>
        <div className={indexStyles.listHeadItem}
          style={{
            height: rows * ceiHeight,
            display: ganttIsOutlineView({ group_view_type }) ? 'none' : 'flex'
          }}>
          <div className={`${indexStyles.list_head_top}`}>
            <div className={`${indexStyles.list_head_top_left}`}>
              {
                (group_view_type == '2' || (group_view_type == '5' && list_id != '0')) && !get_gantt_data_loading && (
                  <Avatar src={lane_icon} icon="user" style={{ marginTop: '-4px', marginRight: 8 }}></Avatar>
                )
              }
              {
                group_view_type == '5' && list_id == '0' && (
                  <div>
                    未分配的任务
                  </div>
                )
              }
              {
                group_view_type == '1' && (
                  gantt_board_id == '0' ? (
                    <div className={`${globalStyles.authTheme}`} style={{ fontSize: 15, color: '#1890FF', lineHeight: '24px', marginRight: 4 }}>&#xe67d;</div>
                  ) : (
                      list_id != '0' &&
                      <div className={`${globalStyles.authTheme}`} style={{ fontSize: 15, color: '#1890FF', lineHeight: '24px', marginRight: 4 }}>&#xe899;</div>
                    )
                )
              }
              {
                show_edit_input ? (
                  <Input
                    style={{ marginBottom: 6 }}
                    autoFocus
                    value={edit_input_value}
                    onChange={this.inputOnchange}
                    onPressEnter={this.inputOnPressEnter}
                    onBlur={this.inputOnPressEnter}
                  />
                ) : (
                    list_id == '0' ? (
                      <AddGroupSection></AddGroupSection>
                    ) : (
                        <div title={local_list_name} className={`${indexStyles.list_name} ${globalStyle.global_ellipsis}`} onClick={this.listNameClick}>
                          {local_list_name}
                        </div>
                      )
                  )
              }
              {
                is_privilege == '1' && (
                  <Tooltip title="已开启访问控制" placement="top">
                    <span className={globalStyle.authTheme} style={{ marginLeft: 10, fontSize: 16, color: '#8c8c8c' }}>&#xe7ca;</span>
                  </Tooltip>
                )
              }
              {/* 逾期任务 */}
              {
                ganttIsFold({ gantt_board_id, group_view_type, show_board_fold }) && Number(lane_overdue_count) > 0 && (
                  <div className={indexStyles.due_time_card_total} title={`存在${lane_overdue_count}条逾期任务`} >{lane_overdue_count}</div>
                )
              }
              {/* 置顶 */}
              {
                (gantt_board_id == '0' && group_view_type == '1' && !show_edit_input) && (
                  is_star == '0' ? (
                    <div className={globalStyle.authTheme} title={'置顶该项目'} onClick={() => this.roofTop('1')} style={{ marginLeft: 10, fontSize: 16, color: '#FFA940' }}>&#xe7e3;</div>
                  ) : (
                      <div className={globalStyle.authTheme} title={'取消置顶'} onClick={() => this.roofTop('0')} style={{ marginLeft: 10, fontSize: 16, color: '#FFA940' }}>&#xe86e;</div>
                    )
                )
              }
            </div>
            <div className={`${indexStyles.list_head_top_right}`}>
              {
                // 只有在项目视图下，且如果在分组id == 0（未分组的情况下不能显示）
                group_view_type == '1' && list_id != '0' && (
                  <Dropdown onVisibleChange={this.dropdwonVisibleChange} overlay={(group_view_type == '1' && menu_oprate_visible) ? this.renderMenuOperateListName() : <span></span>}>
                    <span className={`${globalStyles.authTheme} ${indexStyles.operator}`}>&#xe7fd;</span>
                  </Dropdown>
                )
              }
            </div>
          </div>
          {/* 没有排期任务列表 */}
          <div className={`${indexStyles.list_head_body}`} onWheel={(e) => e.stopPropagation()}>
            <div className={`${indexStyles.list_head_body_inner} ${isShowBottDetail == '0' && indexStyles.list_head_body_inner_init} ${isShowBottDetail == '2' && indexStyles.animate_hide} ${isShowBottDetail == '1' && indexStyles.animate_show}`} >
              {this.renderTaskItem()}
            </div>
          </div>
          {/* 底部ui，是否折叠情况 */}
          {
            // ganttIsFold({ gantt_board_id, group_view_type, show_board_fold }) 
            gantt_board_id == '0' && group_view_type == '1' ? (
              <div className={`${indexStyles.list_head_footer}`} onClick={this.setIsShowBottDetail}>
                {
                  is_show_org_name && is_all_org && group_view_type == '1' && !get_gantt_data_loading && gantt_board_id == '0' && (
                    <div className={indexStyles.list_head_footer_contain}>
                      <div className={`${indexStyles.list_head_footer_contain_lt} ${globalStyle.authTheme}`}>&#xe6da;</div>
                      <Tooltip placement="top" title={getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}><div className={`${indexStyles.list_head_footer_contain_rt} ${globalStyle.global_ellipsis}`}>{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}</div></Tooltip>
                    </div>
                  )
                }
                <div className={indexStyles.list_head_footer_contain}>
                  <div className={`${indexStyles.list_head_footer_contain_lt} ${globalStyle.authTheme}`}>&#xe6db;</div>
                  <div className={`${indexStyles.list_head_footer_contain_rt} ${globalStyle.global_ellipsis}`}>{board_create_user}</div>
                </div>
              </div>
            ) : (
                <div className={indexStyles.list_head_footer} onClick={this.setIsShowBottDetail} style={{ display: list_no_time_data.length ? 'flex' : 'none' }}>
                  <div className={`${globalStyles.authTheme} ${indexStyles.list_head_footer_tip} ${isShowBottDetail == '2' && indexStyles.spin_hide} ${isShowBottDetail == '1' && indexStyles.spin_show}`}>&#xe61f;</div>
                  <div className={indexStyles.list_head_footer_dec}>{list_no_time_data.length}个未排期事项</div>
                </div>
              )
          }
        </div>
        <div onWheel={e => e.stopPropagation()}>
          {
            show_add_menber_visible && (
              <ShowAddMenberModal
                invitationType='1'
                invitationId={gantt_board_id == '0' ? list_id : gantt_board_id}
                invitationOrg={org_id || getOrgIdByBoardId(board_id)}
                show_wechat_invite={true}
                _organization_id={org_id || getOrgIdByBoardId(board_id)}
                board_id={gantt_board_id == '0' ? list_id : gantt_board_id}
                addMenbersInProject={this.addMenbersInProject}
                modalVisible={show_add_menber_visible}
                setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile}
              />
            )
          }
        </div>
        <div onWheel={e => e.stopPropagation()}>
          <DetailInfo setProjectDetailInfoModalVisible={this.setBoardInfoVisible} modalVisible={board_info_visible} invitationType='1' invitationId={gantt_board_id == '0' ? list_id : gantt_board_id} />
        </div>
        <div onWheel={e => e.stopPropagation()}>
          <ArchiveSelect board_id={list_id} board_name={list_name} visble={arhcived_modal_visible} setVisible={this.set_arhcived_modal_visible} onOk={this.archivedProjectCalback} />
        </div>
      </div >
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: { datas: { boards_flies, group_rows = [], ceiHeight, gantt_board_id, group_view_type, get_gantt_data_loading, list_group, show_board_fold } },
  technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, userBoardPermissions } },
  projectDetail: { datas: { projectDetailInfoData = {} } },
  workbench: {
    datas: {
      projectList,
    } },
}) {
  return { projectList, boards_flies, list_group, ceiHeight, group_rows, currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, get_gantt_data_loading, show_board_fold, projectDetailInfoData, userBoardPermissions }
}
