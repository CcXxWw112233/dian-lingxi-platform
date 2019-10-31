import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { Avatar, Dropdown, Menu, Input, message, Tooltip } from 'antd'
import { getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard, getOrgIdByBoardId } from '../../../../utils/businessFunction';
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '@/components/avatarList'
import CheckItem from '@/components/CheckItem'
import { updateTaskGroup, deleteTaskGroup, } from '../../../../services/technological/task';
import { updateProject, addMenbersInProject, toggleContentPrivilege, removeContentPrivilege, setContentPrivilege } from '../../../../services/technological/project';
import { isApiResponseOk } from '../../../../utils/handleResponseData';
import ShowAddMenberModal from '../../../../routes/Technological/components/Project/ShowAddMenberModal'
import { PROJECT_TEAM_BOARD_MEMBER, PROJECT_TEAM_BOARD_EDIT, PROJECT_TEAM_CARD_GROUP, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME } from '../../../../globalset/js/constant';
import VisitControl from '../VisitControl/index'
import globalStyle from '@/globalset/css/globalClassName.less'
import { ganttIsFold } from './constants';

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
        calback: function (data) {
          dispatch({
            type: 'workbenchPublicDatas/getRelationsSelectionPre',
            payload: {
              _organization_id: data.org_id
            }
          })
        }
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
                        !(is_privilege == '0') && (
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
    // console.log('sssss', {itemValue, gantt_board_id, group_view_type})

    if (group_view_type != '1' || gantt_board_id != '0') { //必须要在项目视图才能看
      return
    }
    const { list_id } = itemValue
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        gantt_board_id: list_id,
        list_group: [],
      }
    })
    // dispatch({
    //   type: 'gantt/getGttMilestoneList',
    //   payload: {

    //   }
    // })
    dispatch({
      type: 'gantt/getGanttData',
      payload: {

      }
    })
  }
  //添加项目组职员操作
  setShowAddMenberModalVisibile = () => {
    this.setState({
      show_add_menber_visible: !this.state.show_add_menber_visible
    })
  }

  addMenbersInProject = (values) => {
    const { dispatch } = this.props
    addMenbersInProject({ ...values }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('已成功添加项目职员')
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

  // 操作项点击
  handleMenuSelect = ({ key }) => {
    const { itemValue = {}, gantt_board_id } = this.props
    const { list_id } = itemValue
    const params_board_id = gantt_board_id == '0' ? list_id : gantt_board_id
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
      case 'visitorControl':
        this.set
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
    this.setState({
      edit_input_value: value
    })
  }
  inputOnPressEnter = (e) => {
    this.setShowEditInput(false)
    const { gantt_board_id, list_id } = this.props
    const { edit_input_value, local_list_name } = this.state
    if (local_list_name == edit_input_value || !!!edit_input_value) { //检测到输入变化
      return
    }
    if (gantt_board_id == '0') {
      this.requestUpdateBoard({ board_id: list_id, name: edit_input_value })
    } else {
      this.requestUpdateGroup({ id: list_id, name: edit_input_value, board_id: gantt_board_id })
    }

  }
  // 请求更新项目名称
  requestUpdateBoard = (data = {}) => {
    updateProject({ ...data }).then(res => {
      if (isApiResponseOk(res)) {
        this.setLocalListName(this.state.edit_input_value)
        message.success('已成功更新项目名称')
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
      renderVistorContorlVisible: bool
    })
  }
  // 操作项
  renderMenuOperateListName = () => {
    const { itemValue = {}, gantt_board_id } = this.props
    const { renderVistorContorlVisible } = this.state
    const { list_id } = itemValue
    const params_board_id = gantt_board_id == '0' ? list_id : gantt_board_id
    const rename_permission_code = gantt_board_id == '0' ? PROJECT_TEAM_BOARD_EDIT : PROJECT_TEAM_CARD_GROUP
    return (
      <Menu onClick={this.handleMenuSelect} onOpenChange={this.onOpenChange}>
        {
          // checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, params_board_id)
          <Menu.Item key={'invitation'}>
            邀请职员加入
          </Menu.Item>
        }
        {
          gantt_board_id != '0' && renderVistorContorlVisible && (
            <Menu.Item key={'visitorControl'}>
              {this.renderVistorContorl()}
            </Menu.Item>
          )
        }
        {
          // checkIsHasPermissionInBoard(rename_permission_code, params_board_id) &&
          <Menu.Item key={'rename'}>重命名</Menu.Item>
        }
        {
          // checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_GROUP, params_board_id) &&
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
    console.log('sssss', privileges)
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
    const { itemValue = {} } = this.props
    const { list_id, privileges, board_id } = itemValue
    const content_type = 'lists'
    const content_id = list_id
    let temp_id = []
    temp_id.push(id)
    removeContentPrivilege({
      id: id,
      board_id
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
   * 其他职员的下拉回调
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
   * 添加职员的回调
   * @param {Array} users_arr 添加职员的数组
   */
  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return

    this.handleSetContentPrivilege(users_arr, 'read')
  }

  // 访问控制添加职员
  handleSetContentPrivilege = (users_arr, type, errorText = '访问控制添加人员失败，请稍后再试', ) => {
    const { itemValue = {} } = this.props
    const { list_id, privileges, board_id } = itemValue
    const content_type = 'lists'
    const privilege_code = type
    const content_id = list_id
    let temp_ids = [] // 用来保存用户的id
    users_arr && users_arr.map(item => {
      temp_ids.push(item.id)
    })
    setContentPrivilege({
      board_id,
      content_id,
      content_type,
      privilege_code,
      user_ids: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
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
  //设置访问控制人的列表
  getProjectParticipant = () => {
    const { itemValue: { privileges_extend = [], lane_data: { card_no_times, cards } } } = this.props
    // 1. 这是将在每一个card_data中的存在的executors取出来,保存在一个数组中
    const card_data = [].concat(card_no_times, cards)
    const projectParticipant = card_data.reduce((acc, curr) =>
      // console.log(acc, '------', curr, 'sssssss')
      [...acc, ...(curr && curr.executors && curr.executors.length ? curr.executors.filter(i => !acc.find(e => e.user_id === i.user_id)) : [])], []
    )
    // 2. 如果存在extend列表中的职员也要拼接进来, 然后去重
    const extendParticipant = privileges_extend && [...privileges_extend]
    let temp_projectParticipant = [].concat(...projectParticipant, extendParticipant) // 用来保存新的负责人列表
    let new_projectParticipant = this.arrayNonRepeatfy(temp_projectParticipant)
    return new_projectParticipant
  }
  renderVistorContorl = () => {
    const { itemValue = {}, } = this.props
    const { list_id, board_id, is_privilege = '0', privileges = [], } = itemValue
    return (
      <VisitControl
        invitationType='5'
        invitationId={list_id}
        board_id={board_id}
        popoverPlacement={'rightTop'}
        isPropVisitControl={is_privilege === '0' ? false : true}
        principalList={this.getProjectParticipant()}
        principalInfo='位任务列表负责人'
        otherPrivilege={privileges}
        otherPersonOperatorMenuItem={this.visitControlOtherPersonOperatorMenuItem}
        removeMemberPromptText='移出后用户将不能访问此任务列表'
        handleVisitControlChange={this.handleVisitControlChange}
        handleClickedOtherPersonListOperatorItem={this.handleClickedOtherPersonListOperatorItem}
        handleAddNewMember={this.handleVisitControlAddNewMember}
      >
        <span>访问控制</span>
      </VisitControl>
    )
  }
  // 访问控制 ----------------end-----------------------------
  render() {

    const { currentUserOrganizes = [], gantt_board_id = [], ceiHeight, is_show_org_name, is_all_org, rows = 5, group_view_type, get_gantt_data_loading } = this.props
    const { itemValue = {}, itemKey } = this.props
    const { list_name, org_id, list_no_time_data = [], list_id, lane_icon, board_id, is_privilege = '0', privileges, create_by = {} } = itemValue
    const { isShowBottDetail, show_edit_input, local_list_name, edit_input_value, show_add_menber_visible } = this.state
    const board_create_user = create_by.name
    return (
      <div>
        <div className={indexStyles.listHeadItem} style={{ height: rows * ceiHeight }}>
          <div className={`${indexStyles.list_head_top}`}>
            <div className={`${indexStyles.list_head_top_left}`}>
              {
                group_view_type == '2' && !get_gantt_data_loading && (
                  <Avatar src={lane_icon} icon="user" style={{ marginTop: '-4px', marginRight: 8 }}></Avatar>
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
                    onBlur={this.inputOnBlur}
                  />
                ) : (
                    <div title={local_list_name} className={`${indexStyles.list_name} ${globalStyle.global_ellipsis}`} onClick={this.listNameClick}>
                      {local_list_name}
                    </div>
                  )
              }
              {
                is_privilege == '1' && (
                  <Tooltip title="已开启访问控制" placement="top">
                    <span className={globalStyle.authTheme} style={{ marginLeft: 10, fontSize: 16, color: '#8c8c8c' }}>&#xe7ca;</span>
                  </Tooltip>
                )
              }
              {/* 置顶 */}
              {
                (gantt_board_id == '0' && group_view_type == '1' && !show_edit_input) && (
                  <div className={globalStyle.authTheme} style={{ marginLeft: 10, fontSize: 16, color: '#FFA940' }}>&#xe7e3;</div>
                )
              }
            </div>
            <div className={`${indexStyles.list_head_top_right}`}>
              {
                // 只有在项目视图下，且如果在分组id == 0（未分组的情况下不能显示）
                group_view_type == '1' && list_id != '0' && (
                  <Dropdown onVisibleChange={this.dropdwonVisibleChange} overlay={group_view_type == '1' ? this.renderMenuOperateListName() : <span></span>}>
                    <span className={`${globalStyles.authTheme} ${indexStyles.operator}`}>&#xe7fd;</span>
                  </Dropdown>
                )
              }
            </div>
          </div>
          {/* 没有排期任务列表 */}
          <div className={`${indexStyles.list_head_body}`}>
            <div className={`${indexStyles.list_head_body_inner} ${isShowBottDetail == '0' && indexStyles.list_head_body_inner_init} ${isShowBottDetail == '2' && indexStyles.animate_hide} ${isShowBottDetail == '1' && indexStyles.animate_show}`} >
              {this.renderTaskItem()}
            </div>
          </div>
          {/* 底部ui，是否折叠情况 */}
          {
            ganttIsFold({ gantt_board_id, group_view_type }) ? (
              <div className={`${indexStyles.list_head_footer}`} onClick={this.setIsShowBottDetail}>
                {
                  is_show_org_name && is_all_org && group_view_type == '1' && !get_gantt_data_loading && gantt_board_id == '0' && (
                    <div className={indexStyles.list_head_footer_contain}>
                      <div className={`${indexStyles.list_head_footer_contain_lt} ${globalStyle.authTheme}`}>&#xe6da;</div>
                      <div className={`${indexStyles.list_head_footer_contain_rt} ${globalStyle.global_ellipsis}`}>{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}</div>
                    </div>
                  )
                }
                <div className={indexStyles.list_head_footer_contain}>
                  <div className={`${indexStyles.list_head_footer_contain_lt} ${globalStyle.authTheme}`}>&#xe6db;</div>
                  <div className={`${indexStyles.list_head_footer_contain_rt} ${globalStyle.global_ellipsis}`}>{board_create_user}</div>
                </div>
              </div>
            ) : (
                <div className={indexStyles.list_head_footer} onClick={this.setIsShowBottDetail}>
                  <div className={`${globalStyles.authTheme} ${indexStyles.list_head_footer_tip} ${isShowBottDetail == '2' && indexStyles.spin_hide} ${isShowBottDetail == '1' && indexStyles.spin_show}`}>&#xe61f;</div>
                  <div className={indexStyles.list_head_footer_dec}>{list_no_time_data.length}个未排期事项</div>
                </div>
              )
          }
        </div>
        {
          show_add_menber_visible && (
            <ShowAddMenberModal
              invitationType='1'
              invitationId={gantt_board_id == '0' ? list_id : gantt_board_id}
              invitationOrg={org_id || getOrgIdByBoardId(board_id)}
              show_wechat_invite={true}
              _organization_id={org_id || getOrgIdByBoardId(board_id)}
              board_id={list_id}
              addMenbersInProject={this.addMenbersInProject}
              modalVisible={show_add_menber_visible}
              setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile}
            />
          )}

      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: { datas: { group_rows = [], ceiHeight, gantt_board_id, group_view_type, get_gantt_data_loading, list_group } },
  technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, } },
}) {
  return { list_group, ceiHeight, group_rows, currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, get_gantt_data_loading }
}
