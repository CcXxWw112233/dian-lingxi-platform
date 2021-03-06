import React, { Component } from 'react'
import {
  PROJECT_TEAM_BOARD_MEMBER,
  PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE,
  PROJECT_TEAM_BOARD_EDIT,
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECTS,
  REQUEST_DOMAIN_BOARD,
  PROJECT_TEAM_BOARD_ARCHIVE,
  PROJECT_TEAM_BOARD_DELETE
} from '../../../../../globalset/js/constant'
import VisitControl from '../../../../Technological/components/VisitControl'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import {
  setBoardIdStorage,
  checkIsHasPermissionInBoard,
  getOrgIdByBoardId,
  selectBoardToSeeInfo,
  getOrgNameWithOrgIdFilter,
  currentNounPlanFilterName,
  setRequestHeaderBaseInfo
} from '../../../../../utils/businessFunction'
import { Dropdown, Input, Menu, message, Modal } from 'antd'
import { connect } from 'dva'
import {
  removeContentPrivilege,
  setContentPrivilege,
  addMenbersInProject,
  cancelCollection,
  collectionProject,
  archivedProject,
  deleteProject,
  quitProject
} from '../../../../../services/technological/project'
import DetailInfo from '@/routes/Technological/components/ProjectDetail/DetailInfo/index'
import ShowAddMenberModal from '@/routes/Technological/components/Project/ShowAddMenberModal'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import { arrayNonRepeatfy } from '../../../../../utils/util'
import { inviteMembersInWebJoin } from '../../../../../utils/inviteMembersInWebJoin'
import axios from 'axios'
import Cookies from 'js-cookie'
import CustormBadgeDot from '@/components/CustormBadgeDot'
import { updateProject } from '../../../../../services/technological/prjectDetail'
import { WorkbenchModel } from '../../../../../models/technological/workbench'
import ArchiveSelect from '../../../../Technological/components/Gantt/components/ArchiveSelect'

@connect(mapStateToProps)
export default class BoardItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      renderVistorContorlVisible: false,
      board_info_visible: false,
      show_add_menber_visible: false,
      menu_oprate_visible: false,
      selectedBoardId: '',
      /** ?????????????????? */
      board_rename: '',
      /** ???????????? */
      arhcived_modal_visible: false
    }
    this.visitControlOtherPersonOperatorMenuItem = [
      {
        key: '?????????',
        value: 'read'
      },
      {
        key: '??????',
        value: 'remove',
        style: {
          color: '#f73b45'
        }
      }
    ]
  }

  onSelectBoard = (board_id, org_id, e) => {
    const {
      projectList,
      dispatch,
      simplemodeCurrentProject: { selected_board_term },
      onClick
    } = this.props
    onClick && onClick(e, this.props.itemValue)
    const selectBoard = projectList.filter(item => item.board_id === board_id)
    const selectOrgId = org_id || getOrgIdByBoardId(board_id)
    if (!selectBoard && selectBoard.length == 0) {
      message.error('?????????????????????????????????')
      return
    }
    this.props.setLocalSelectedBoard(selectBoard[0])
    //???????????????????????????
    setBoardIdStorage(board_id)
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        simplemodeCurrentProject: { ...selectBoard[0] }
      }
    })
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: selectBoard[0].board_id
      }
    })
    dispatch({
      type: 'accountSet/updateUserSet',
      payload: {
        current_board: board_id
      }
    })

    dispatch({
      type: 'technological/updateDatas',
      payload: {
        currentSelectedProjectOrgIdByBoardId: selectOrgId
      }
    })
    dispatch({
      type: 'simplemode/getBoardsTaskTodoList',
      payload: {
        _organization_id: org_id,
        board_ids: board_id
      }
    })
    dispatch({
      type: 'simplemode/getBoardsProcessTodoList',
      payload: {
        _organization_id: org_id,
        board_id: board_id
      }
    })
    dispatch({
      type: 'simplemode/getMeetingTodoList',
      payload: {
        org_id,
        board_id
      }
    })
    selectBoardToSeeInfo({
      board_id: selectBoard[0] && selectBoard[0].board_id,
      org_id,
      board_name: selectBoard[0] && selectBoard[0].board_name,
      dispatch,
      selected_board_term
    })
  }

  // ?????????
  dropdwonVisibleChange = bool => {
    this.setState({
      renderVistorContorlVisible: bool,
      menu_oprate_visible: bool
    })
  }
  // --------------????????????statrt

  // ????????????-----------start----------------------------------------

  // ???????????????????????????????????????????????????
  visitControlUpdateInGanttData = (obj = {}) => {
    const { type, is_privilege, privileges = [], removeId } = obj
    const {
      dispatch,
      itemValue: { board_id },
      projectList = []
    } = this.props
    // console.log('sssss', privileges)
    let projectList_new = [...projectList]
    const index = projectList_new.findIndex(item => item.board_id == board_id)

    if (type == 'privilege') {
      projectList_new[index].is_privilege = is_privilege
    } else if (type == 'add') {
      projectList_new[index].privileges = [].concat(
        projectList_new[index].privileges,
        privileges[0]
      )
    } else if (type == 'remove') {
      projectList_new[index].privileges = projectList_new[
        index
      ].privileges.filter(item => item.id != removeId)
    } else {
    }
    dispatch({
      type: 'workbench/updateDatas',
      payload: {
        projectList: projectList_new
      }
    })
  }

  // ???????????????????????????
  // handleVisitControlChange = flag => {
  //   const { itemValue = {} } = this.props
  //   const { is_privilege, board_id } = itemValue
  //   const toBool = str => !!Number(str)
  //   const is_privilege_bool = toBool(is_privilege)
  //   if (flag === is_privilege_bool) {
  //     return
  //   }
  //   //toggole ??????
  //   const data = {
  //     content_id: board_id,
  //     content_type: 'board',
  //     is_open: flag ? 1 : 0,
  //     board_id
  //   }
  //   toggleContentPrivilege(data).then(res => {
  //     if (res && res.code === '0') {
  //       //????????????
  //       let temp_arr = res && res.data
  //       this.visitControlUpdateInGanttData({
  //         is_privilege: flag ? '1' : '0',
  //         type: 'privilege',
  //         privileges: temp_arr
  //       })
  //     } else {
  //       message.warning(res.message)
  //     }
  //   })
  // }

  // ????????????????????????
  handleVisitControlRemoveContentPrivilege = id => {
    const { itemValue = {} } = this.props
    const { board_id } = itemValue
    let temp_id = []
    temp_id.push(id)
    removeContentPrivilege({
      id: id,
      board_id: board_id
    }).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        message.success('??????????????????')
        this.visitControlUpdateInGanttData({ removeId: id, type: 'remove' })
      } else {
        message.warning(res.message)
      }
    })
  }

  /**
   * ???????????????????????????
   * @param {String} id ???????????????user_id
   * @param {String} type ???????????????????????????
   * @param {String} removeId ???????????????????????????id
   */
  handleClickedOtherPersonListOperatorItem = (id, type, removeId) => {
    if (type === 'remove') {
      this.handleVisitControlRemoveContentPrivilege(removeId)
    } else {
      // this.handleSetContentPrivilege(id, type, '??????????????????????????????')
    }
  }
  /**
   * ?????????????????????
   * @param {Array} users_arr ?????????????????????
   */
  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return

    this.handleSetContentPrivilege(users_arr, 'read')
  }

  // ????????????????????????
  handleSetContentPrivilege = (
    users_arr,
    type,
    errorText = '????????????????????????????????????????????????'
  ) => {
    const { itemValue = {} } = this.props
    const { privileges = [], board_id } = itemValue
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { user_id } = user_set
    const content_type = 'board'
    const privilege_code = type
    const content_id = board_id
    let temp_ids = [] // ?????????????????????id

    let new_ids = [] // ?????????????????????????????????id
    let new_privileges = [...privileges]
    users_arr &&
      users_arr.map(item => {
        temp_ids.push(item.id)
      })

    let flag
    // ??????????????????id
    new_privileges =
      new_privileges &&
      new_privileges.map(item => {
        let { id } = (item && item.user_info && item.user_info) || {}
        if (user_id == id) {
          // ??????????????????????????????
          if (temp_ids.indexOf(id) != -1) {
            // ???????????????????????????????????????
            flag = true
          }
        }
        new_ids.push(id)
      })

    // ?????????????????????????????????????????????????????????
    if (flag && temp_ids.length == '1') {
      // ????????????????????????, ???????????????
      message.warn('??????????????????, ?????????????????????', MESSAGE_DURATION_TIME)
      return false
    } else {
      // ???????????????????????????, ???????????????
      temp_ids =
        temp_ids &&
        temp_ids.filter(item => {
          if (new_ids.indexOf(item) == -1) {
            return item
          }
        })
    }

    setContentPrivilege({
      board_id: board_id,
      content_id,
      content_type,
      privilege_code,
      user_ids: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
        setTimeout(() => {
          message.success('??????????????????')
        }, 500)
        let temp_arr = []
        temp_arr.push(res.data)
        this.visitControlUpdateInGanttData({
          privileges: temp_arr,
          type: 'add'
        })
      } else {
        message.error(errorText)
      }
    })
  }

  // ????????????????????????????????????
  getProjectDetailInfoData = () => {
    const { projectDetailInfoData = {}, itemValue } = this.props
    const { data: projectParticipant = [] } = projectDetailInfoData
    const { privileges_extend = [] } = itemValue
    let temp_projectParticipant = [].concat(
      // projectParticipant && [...projectParticipant],
      privileges_extend && [...privileges_extend]
    )
    const removeEmptyArrayEle = arr => {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == undefined) {
          arr.splice(i, 1)
          i = i - 1 // i - 1 ,?????????????????????????????? 2 ????????????????????????????????????????????????????????????
          // ?????????????????????????????????,????????????????????????????????????????????????????????????????????????
        }
      }
      return arr
    }
    let new_projectParticipant = arrayNonRepeatfy(
      removeEmptyArrayEle(temp_projectParticipant),
      'id'
    )
    return new_projectParticipant
  }

  renderVistorContorl = () => {
    const { itemValue = {} } = this.props
    const { board_id, is_privilege = '0', privileges = [], org_id } = itemValue
    return (
      <VisitControl
        invitationType={'2'}
        invitationId={board_id}
        board_id={board_id}
        popoverPlacement={'rightBottom'}
        type={'board_list'}
        isPropVisitControl={is_privilege === '0' ? false : true}
        principalList={this.getProjectDetailInfoData()}
        // principalInfo='????????????????????????'
        otherPrivilege={privileges}
        isPropVisitControlKey="1"
        otherPersonOperatorMenuItem={
          this.visitControlOtherPersonOperatorMenuItem
        }
        removeMemberPromptText="?????????????????????????????????????????????"
        // handleVisitControlChange={this.handleVisitControlChange}
        handleClickedOtherPersonListOperatorItem={
          this.handleClickedOtherPersonListOperatorItem
        }
        handleAddNewMember={this.handleVisitControlAddNewMember}
        handleVisitControlPopoverVisible={this.handleVisitControlPopoverVisible}
      >
        <span>????????????</span>
      </VisitControl>
    )
  }

  // ???????????? ----------------end-----------------------------
  // --------------????????????end

  // ?????????????????????div??????mosedown??????
  handleVisitorControlMouseDown = board_id => {
    const { dispatch } = this.props
    this.setState({
      VisitControlPopoverVisible: true
    })
    const { VisitControlPopoverVisible } = this.state
    if (VisitControlPopoverVisible) return false
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          VisitControlPopoverVisible: true
        })
      }
    })
  }
  // ??????????????????
  setBoardInfoVisible = () => {
    const { board_info_visible } = this.state
    const {
      dispatch,
      itemValue: { org_id, board_id }
    } = this.props
    if (!board_info_visible) {
      dispatch({
        type: 'technological/getCorrespondingOrganizationMmembers',
        payload: {
          _organization_id: org_id
        }
      })
      dispatch({
        type: 'projectDetail/projectDetailInfo',
        payload: {
          id: board_id
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
  // ????????????????????????
  setExportBoardMembersVisible = () => {
    this.setState({
      board_members_visible: !this.state.board_members_visible
    })
  }
  // ????????????????????????
  handleExportBoardMembers = itemValue => {
    const { board_id } = itemValue
    // let params = {
    //   board_id,
    //   codes: ["NAME","MOBILE","ROLE"]
    // }
    const url = '/board/members/export'
    const options = {
      url: `${REQUEST_DOMAIN_BOARD}${url}`,
      method: 'post',
      headers: {
        Authorization: Cookies.get('Authorization'),
        ...setRequestHeaderBaseInfo({
          data: { board_id },
          headers: {},
          params: {}
        })
      },
      data: {
        board_id
        // codes: checkedValue
      },
      responseType: 'blob',
      timeout: 0
    }
    axios({
      ...options
    })
      .then(resp => {
        if (resp.status < 400) {
          let respHeader = resp.headers
          let file_name = respHeader['content-disposition'] || ''
          file_name = (file_name.split('=') || [])[1] || ''
          file_name = file_name.split('.')[0]
          file_name = decodeURIComponent(escape(file_name)) + '.xlsx'
          let blob = new Blob([resp.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          let a = document.createElement('a')
          a.href = window.URL.createObjectURL(blob)
          a.download = file_name
          a.click()
          // ????????????
          window.URL.revokeObjectURL(a.href)
          a = null
        } else {
          message.warn('????????????')
        }
        this.props.updateState &&
          this.props.updateState({
            name: 'showLoading',
            value: false
          })
      })
      .catch(err => {
        message.warn('????????????')
        this.props.updateState &&
          this.props.updateState({
            name: 'showLoading',
            value: false
          })
      })
  }
  //???????????????????????????
  setShowAddMenberModalVisibile = () => {
    this.setState({
      show_add_menber_visible: !this.state.show_add_menber_visible
    })
  }
  addMenbersInProject = values => {
    const { dispatch } = this.props
    const {
      itemValue: { org_id, board_id }
    } = this.props
    inviteMembersInWebJoin({
      dispatch,
      invitationType: '1',
      board_id,
      org_id,
      values,
      calback: () => {
        setTimeout(() => {
          dispatch({
            type: 'gantt/getAboutUsersBoards',
            payload: {}
          })
        }, 1000)
      }
    })
    return
    addMenbersInProject({ ...values }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('???????????????????????????')
        setTimeout(() => {
          dispatch({
            type: 'gantt/getAboutUsersBoards',
            payload: {}
          })
        }, 1000)
      } else {
        message.error(res.message)
      }
    })
  }
  // ??????
  roofTop = e => {
    e.stopPropagation()
    const {
      dispatch,
      itemValue: { board_id, org_id, is_star }
    } = this.props
    const { projectList = [] } = this.props
    const _arr_new = JSON.parse(JSON.stringify(projectList))
    const _index = _arr_new.findIndex(item => item.board_id == board_id)
    if (is_star == '1') {
      //????????????
      cancelCollection({ org_id, board_id }).then(res => {
        if (isApiResponseOk(res)) {
          _arr_new[_index].is_star = '0'
          // dispatch({
          //     type: 'workbench/updateDatas',
          //     payload: {
          //         projectList: _arr_new
          //     }
          // })
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
      collectionProject({ org_id, board_id }).then(res => {
        if (isApiResponseOk(res)) {
          _arr_new[_index].is_star = '1'
          _arr_new.unshift(_arr_new[_index]) //????????????????????????
          _arr_new.splice(_index + 1, 1) //???????????????
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

  /** ????????????????????? */
  saveEditBoard = (board_id, data) => {
    const { dispatch, simplemodeCurrentProject } = this.props
    if (board_id) {
      updateProject({ board_id, ...data }).then(res => {
        // console.log(res)
        if (res.code === '0') {
          dispatch({
            type: [
              WorkbenchModel.namespace,
              WorkbenchModel.getProjectList
            ].join('/'),
            payload: {}
          })
          /** ?????????????????????????????? */
          if (board_id === simplemodeCurrentProject.board_id)
            dispatch({
              type: 'simplemode/updateCurrentBoard',
              payload: {
                board_id,
                data: { board_name: data.name }
              }
            })
        }
      })
    }
  }

  /** ????????????????????????
   * @param {string} board_id ????????????
   * @param {{board_id: string, name:string}} board ????????????
   */
  renameThisBoard = (board_id, board) => {
    this.setState({
      board_rename: board.board_name
    })
    /** ??????????????? */
    const Ok = () => {
      const param = {
        name: this.state.board_rename
      }
      this.saveEditBoard(board_id, param)
      this.setState({
        board_rename: ''
      })
    }
    const confirm = Modal.confirm({
      centered: true,
      title: <div className={styles.rename_title}>??????????????????</div>,
      content: (
        <div className={styles.rename_box}>
          <div className={styles.rename_tip}>????????????</div>
          <div className={styles.rename_input}>
            <Input
              placeholder="?????????????????????"
              defaultValue={board.board_name}
              onChange={e => this.setState({ board_rename: e.target.value })}
              onPressEnter={() => {
                confirm.destroy()
                Ok()
              }}
            />
          </div>
        </div>
      ),
      onOk: () => {
        Ok()
      },
      onCancel: () => {
        this.setState({
          board_rename: ''
        })
      }
    })
  }
  // ???????????????
  handleMenuSelect = e => {
    e.domEvent.stopPropagation()
    const { key } = e
    const { itemValue = {}, dispatch } = this.props
    const { board_id, org_id } = itemValue
    // ???????????????????????????baseInfo
    setBoardIdStorage(board_id, org_id)
    switch (key) {
      case 'rooftop':
        this.roofTop()
        break
      case 'invitation':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.setShowAddMenberModalVisibile()
        break

      case 'visitorControl':
        // this.set
        break
      case 'board_info':
        this.setBoardInfoVisible()
        break
      case 'export_members': // ??????????????????
        this.handleExportBoardMembers(itemValue)
        // this.setExportBoardMembersVisible()
        break
      case 'board_rename':
        this.renameThisBoard(board_id, itemValue)
        break
      case 'archived':
        this.set_arhcived_modal_visible(true)
        break
      case 'deleteBoard':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_DELETE, board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.deleteProject({ board_id: board_id })
        break
      case 'quitBoard':
        this.quitProject(board_id)
        break
      default:
        break
    }
  }

  /** ???????????????????????? */
  quitProject = id => {
    Modal.confirm({
      title: `??????????????????${currentNounPlanFilterName(PROJECTS)}??????`,
      content: (
        <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
          <span>
            ???????????????????????????{currentNounPlanFilterName(PROJECTS)}???????????????
          </span>
        </div>
      ),
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        quitProject({ board_id: id })
          .then(res => {
            if (isApiResponseOk(res)) {
              message.success('????????????')
              this.updateBoardList()
            } else message.warn(res.message)
          })
          .catch(err => {
            console.error(err)
          })
      }
    })
  }

  /** ???????????? --- S */
  deleteProject = ({ board_id }) => {
    // const modal = Modal.confirm();
    Modal.confirm({
      title: `??????????????????${currentNounPlanFilterName(PROJECTS)}??????`,
      content: (
        <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
          <span>
            ???????????????????????????{currentNounPlanFilterName(PROJECTS)}???????????????
          </span>
        </div>
      ),
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        deleteProject(board_id).then(res => {
          if (isApiResponseOk(res)) {
            setTimeout(
              () =>
                message.success(
                  `??????????????????${currentNounPlanFilterName(PROJECTS)}`
                ),
              200
            )
            this.updateBoardList()
            // modal.destroy();
          } else {
            message.warn(res.message)
          }
        })
      },
      onCancel: () => {
        // modal.destroy();
      }
    })
  }

  /** ?????????????????? */
  updateBoardList = () => {
    const { dispatch, onUpdate } = this.props
    dispatch({
      type: [WorkbenchModel.namespace, WorkbenchModel.getProjectList].join('/'),
      payload: {}
    })
    onUpdate && onUpdate()
  }

  renderMenuOperateListName = ({ board_id, is_star }) => {
    const { renderVistorContorlVisible } = this.state
    return (
      <Menu onClick={this.handleMenuSelect}>
        {/* {
                    <Menu.Item key={'rooftop'}>
                        {is_star == '1' ? '????????????' : '??????'}
                    </Menu.Item>
                } */}
        {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, board_id) && (
          <Menu.Item key={'invitation'}>??????????????????</Menu.Item>
        )}
        {/* ????????????|??????????????????????????? */}
        {checkIsHasPermissionInBoard(
          PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE,
          board_id
        ) && (
          // renderVistorContorlVisible &&
          <Menu.Item key={'visitorControl'}>
            <div
              // style={{ height: 60, width: 100, backgroundColor: 'red' }}
              onClick={this.handleVisitorWrapper}
              onMouseDown={() => {
                this.handleVisitorControlMouseDown(board_id)
              }}
            >
              {this.renderVistorContorl()}
            </div>
          </Menu.Item>
        )}

        {
          <Menu.Item key={'board_info'}>{`${currentNounPlanFilterName(
            PROJECTS,
            this.props.currentNounPlan
          )}??????`}</Menu.Item>
        }
        {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_ARCHIVE, board_id) && (
          <Menu.Item key={'archived'}>??????</Menu.Item>
        )}
        {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_EDIT, board_id) && (
          <Menu.Item key="board_rename">?????????</Menu.Item>
        )}
        {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, board_id) && (
          <Menu.Item key={'export_members'}>
            ??????{currentNounPlanFilterName(PROJECTS, board_id)}??????
          </Menu.Item>
        )}
        <Menu.Item key="quitBoard">
          <div style={{ color: 'rgba(255,0,0,1)' }}>????????????</div>
        </Menu.Item>
        <Menu.Item key={'deleteBoard'}>
          <div style={{ color: 'red' }}>
            ??????{currentNounPlanFilterName(PROJECTS, board_id)}
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  /** ???????????? */
  set_arhcived_modal_visible = val => {
    this.setState({
      arhcived_modal_visible: val
    })
  }

  /** ???????????? */
  archivedProjectCalback = data => {
    const { board_id } = data
    const { dispatch, onUpdate } = this.props
    archivedProject({ is_archived: '1', board_id }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('????????????????????????')
        dispatch({
          type: [WorkbenchModel.namespace, WorkbenchModel.getProjectList].join(
            '/'
          ),
          payload: {}
        })
        onUpdate && onUpdate()
      } else {
        message.error(res.message)
      }
    })
  }
  render() {
    const {
      itemValue: { board_id, board_name, org_id, is_star, is_new },
      simplemodeCurrentProject,
      currentUserOrganizes = [],
      currentSelectOrganize = {}
    } = this.props
    const {
      board_info_visible,
      show_add_menber_visible,
      menu_oprate_visible,
      board_members_visible
    } = this.state
    const isAllOrg =
      !currentSelectOrganize.id || currentSelectOrganize.id == '0'
    return (
      <>
        <div
          onClick={e => this.onSelectBoard(board_id, org_id, e)}
          className={`${
            !isAllOrg
              ? styles.board_area_middle_item
              : styles.board_area_middle_item2
          } ${simplemodeCurrentProject.board_id == board_id &&
            styles.board_area_middle_item_choose}`}
          key={board_id}
        >
          <div className={`${styles.board_area_middle_item_lf}`}></div>
          <div
            id={`board_area_middle_item_middle_${board_id}`}
            className={`${styles.board_area_middle_item_middle} ${globalStyles.global_ellipsis}`}
          >
            {/* <Badge dot> */}
            <div
              title={board_name}
              className={`${styles.board_area_middle_item_board_name} ${globalStyles.global_ellipsis}`}
            >
              {board_name}
              <CustormBadgeDot
                show_dot={is_new == '1'}
                top={localStorage.getItem('OrganizationId') == '0' ? 0 : 12}
              />
            </div>
            {/* </Badge> */}
            {isAllOrg && (
              <p
                title={getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
              >
                {getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
              </p>
            )}
          </div>

          <div className={`${styles.board_area_middle_item_rt}`}>
            <div
              className={`${globalStyles.authTheme} ${styles.board_area_middle_item_rt_roofTop}`}
              onClick={this.roofTop}
              title={is_star == '1' ? '????????????' : '??????'}
            >
              {is_star == '1' ? <span>&#xe86e;</span> : <span>&#xe7e3;</span>}
            </div>
            <Dropdown
              getPopupContainer={() =>
                document.getElementById(
                  `board_area_middle_item_middle_${board_id}`
                )
              }
              onVisibleChange={this.dropdwonVisibleChange}
              overlay={
                menu_oprate_visible ? (
                  this.renderMenuOperateListName({ board_id, is_star })
                ) : (
                  <span></span>
                )
              }
              trigger={['click']}
            >
              <div
                className={`${styles.board_area_middle_item_rt_operate} ${globalStyles.authTheme}`}
                onClick={e => e.stopPropagation()}
              >
                &#xe66f;
              </div>
            </Dropdown>
          </div>
        </div>
        <DetailInfo
          setProjectDetailInfoModalVisible={this.setBoardInfoVisible}
          modalVisible={board_info_visible}
          invitationType="1"
          invitationId={board_id}
        />
        {show_add_menber_visible && (
          <ShowAddMenberModal
            invitationType="1"
            invitationId={board_id}
            invitationOrg={org_id || getOrgIdByBoardId(board_id)}
            show_wechat_invite={true}
            _organization_id={org_id || getOrgIdByBoardId(board_id)}
            board_id={board_id}
            addMenbersInProject={this.addMenbersInProject}
            modalVisible={show_add_menber_visible}
            setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile}
          />
        )}
        <ArchiveSelect
          board_id={board_id}
          board_name={board_name}
          visible={this.state.arhcived_modal_visible}
          setVisible={this.set_arhcived_modal_visible}
          onOk={this.archivedProjectCalback}
        />
        {/* {board_members_visible && (
          <Modal
            title={`??????${currentNounPlanFilterName(PROJECTS, board_id)}??????`}
            visible={board_members_visible}
            width={380}
            maskClosable={false}
            onCancel={this.setExportBoardMembersVisible}
            destroyOnClose
          >
            <div>
              <div style={{ marginBottom: '12px' }}>??????????????????</div>
              <div>
                <Checkbox.Group style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <Checkbox
                    style={{
                      width: '50%',
                      marginBottom: '24px',
                      marginLeft: 0
                    }}
                    value="name"
                  >
                    ??????
                  </Checkbox>
                  <Checkbox
                    style={{
                      width: '50%',
                      marginBottom: '24px',
                      marginLeft: 0
                    }}
                    value="phone"
                  >
                    ?????????
                  </Checkbox>
                  <Checkbox
                    style={{
                      width: '50%',
                      marginBottom: '24px',
                      marginLeft: 0
                    }}
                    value="wechat"
                  >
                    ?????????
                  </Checkbox>
                  <Checkbox
                    style={{
                      width: '50%',
                      marginBottom: '24px',
                      marginLeft: 0
                    }}
                    value="role"
                  >
                    ??????
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </div>
          </Modal>
        )} */}
      </>
    )
  }
}
//  ??????????????????????????????state????????????UI ????????????props?????????????????????
function mapStateToProps({
  workbench: {
    datas: { projectList }
  },
  simplemode: { simplemodeCurrentProject },
  technological: {
    datas: { currentUserOrganizes, currentSelectOrganize = {} }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  organizationManager: {
    datas: { currentNounPlan }
  }
}) {
  return {
    projectList,
    simplemodeCurrentProject,
    projectDetailInfoData,
    currentUserOrganizes,
    currentSelectOrganize,
    currentNounPlan
  }
}
