/* eslint-disable no-lone-blocks */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'dva'
import {
  message,
  Menu,
  Dropdown,
  Modal,
  Button,
  Popover,
  Spin,
  Switch
} from 'antd'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import OutlineTree from './components/OutlineTree'
import TreeNode from './components/OutlineTree/TreeNode'
import {
  addTaskInWorkbench,
  updateTask,
  changeTaskType,
  updateMilestone,
  addMilestoneExcutos,
  removeMilestoneExcutos,
  addTaskExecutor,
  removeTaskExecutor,
  updateTaskVTwo
} from '../../../../services/technological/task'
import {
  addMenbersInProject,
  setOutlineCardNameWithBoard
} from '../../../../services/technological/project'
import {
  getBoardTemplateList,
  importBoardTemplate
} from '@/services/technological/gantt.js'
import { createMilestone } from '@/services/technological/prjectDetail.js'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  checkIsHasPermissionInBoard,
  getOrgIdByBoardId,
  getGlobalData
} from '@/utils/businessFunction'
import DetailInfo from '@/routes/Technological/components/ProjectDetail/DetailInfo/index'
import {
  PROJECT_TEAM_BOARD_MEMBER,
  NOT_HAS_PERMISION_COMFIRN,
  MESSAGE_DURATION_TIME,
  PROJECT_TEAM_CARD_CREATE,
  PROJECT_TEAM_CARD_EDIT,
  PROJECT_TEAM_BOARD_MILESTONE
} from '@/globalset/js/constant'
import ShowAddMenberModal from '../../../../routes/Technological/components/Project/ShowAddMenberModal'
import SafeConfirmModal from './components/SafeConfirmModal'
import {
  updateFlowInstanceNameOrDescription,
  workflowUpdateTime
} from '../../../../services/technological/workFlow'
import SaveBoardTemplate from './components/Modal/SaveBoardTemplate'
import { task_item_margin_top } from './constants'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction'
import {
  BOOLEAN_FALSE_CODE,
  BOOLEAN_TRUE_CODE,
  PROJECTS,
  TASKS
} from '../../../../globalset/js/constant'
import { closeFeature } from '../../../../utils/temporary'
import { onChangeCardHandleCardDetail } from './ganttBusiness'
import { rebackCreateNotify } from '../../../../components/NotificationTodos'
import DomToImage from 'dom-to-image'
import jsPDF from 'jspdf'
import { LoadingOutlined } from '@ant-design/icons'
import {
  getGanttOutlineHideTrem,
  getGanttUserCustorm,
  saveGanttOutlineNonDisplay,
  setGanttUserCustorm
} from '../../../../services/technological/gantt'
import { getTreeNodeValue } from '../../../../models/technological/workbench/gantt/gantt_utils'
import ExportExcelModal from './components/exportExcelModal'
import AddMultipleIndex from './components/OutlineTree/AddMultiple'
import AddMultiplePomp from './components/OutlineTree/AddMultiple/AddMultiplePomp'
import ExportGanttToImage from './components/ExportGanttToImage/index'
const { SubMenu } = Menu
// const { TreeNode } = OutlineTree;
const { confirm } = Modal

const IsLoading = props => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return ReactDOM.createPortal(
    <div className={styles.loadingModal}>
      <Spin size="large" tip="????????????..." />
    </div>,
    document.body
  )
}

@connect(mapStateToProps)
export default class OutLineHeadItem extends Component {
  state = {
    template_list: [],
    board_info_visible: false,
    show_add_menber_visible: false,
    safeConfirmModalVisible: false,
    selectedTpl: null,
    save_board_template_visible: false,
    visibleExportPopover: false, // ????????????????????????
    showLoading: false, // ????????????loading
    bodyPicture: null, // loading???????????????
    input_add_type: '1', //????????????????????? 1/2 =??? ?????????/??????
    add_mutiple_visible: false //???????????????????????????????????????
  }
  componentDidMount() {
    const OrganizationId = localStorage.getItem('OrganizationId')
    const aboutBoardOrganizationId = getGlobalData('aboutBoardOrganizationId')
    // ????????????????????????
    this.getOutlineHideTerm()
    // ????????????????????????
    // this.getOutlineTreeFilterType()
    if (
      !OrganizationId ||
      (OrganizationId == '0' &&
        (!aboutBoardOrganizationId || aboutBoardOrganizationId == '0'))
    ) {
      return
    }
    const _organization_id =
      OrganizationId != '0' ? OrganizationId : aboutBoardOrganizationId
    getBoardTemplateList({ _organization_id }).then(res => {
      //console.log("getBoardTemplateList", res);
      if (isApiResponseOk(res)) {
        const { data } = res
        this.setState({
          template_list: data
        })
      } else {
        message.error(res.message)
      }
    })
  }

  updateState = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  // ????????????????????????
  getOutlineHideTerm = () => {
    getGanttOutlineHideTrem({ board_id: this.props.gantt_board_id }).then(
      res => {
        if (isApiResponseOk(res)) {
          this.props.dispatch({
            type: 'gantt/updateDatas',
            payload: {
              isDisplayContentIds: res.data
            }
          })
          // this.filterAlreadyHideData(res.data)
        }
      }
    )
  }

  handleProjectMenu = ({ key }) => {
    const { dispatch, gantt_board_id } = this.props
    if (key.indexOf('importTpl') != -1) {
      let tplId = key.replace('importTpl_', '')
      const { template_list = [] } = this.state
      const selectedTpl = template_list.find(item => item.id == tplId)
      this.setState({
        safeConfirmModalVisible: true,
        selectedTpl
      })
    } else {
      if (key == 'boardInfo') {
        this.setBoardInfoVisible()
      }
    }
  }

  ganttProjectMenus = () => {
    const { gantt_board_id } = this.props
    const { template_list = [] } = this.state
    return (
      <Menu onClick={this.handleProjectMenu}>
        {/* <Menu.Item key="publishTpl" disabled>??????????????????????????????</Menu.Item>
                <Menu.Item key="saveTpl" disabled>??????????????????????????????</Menu.Item> */}
        {/* {
                    checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_CREATE, gantt_board_id) && checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MILESTONE, gantt_board_id) &&
                    <SubMenu title="??????????????????" >
                        {
                            template_list.map((item) => {
                                return (
                                    <Menu.Item key={`importTpl_${item.id}`}>{item.name}</Menu.Item>
                                );
                            })
                        }
                    </SubMenu>
                } */}

        <Menu.Item key="boardInfo">????????????</Menu.Item>
      </Menu>
    )
  }

  updateOutLineTreeData = outline_tree => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/handleOutLineTreeData',
      payload: {
        data: outline_tree
      }
    })
  }
  onSelect = (selectedKeys, info) => {
    //console.log('selected', selectedKeys, info);
  }

  onHover = (id, hover, parentId, is_add_node) => {
    //console.log("??????:onHover", id, hover);
    const { dispatch, outline_tree } = this.props
    let nodeValue = {}
    // ??????hover??????
    let outline_hover_obj = {}
    if (is_add_node) {
      outline_hover_obj.add_id = id
    } else {
      outline_hover_obj.id = id
    }
    if (hover) {
      if (is_add_node) {
        nodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, id) || {}
      } else {
        nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id) || {}
      }
    } else {
      if (is_add_node) {
        let placeholderNodeValue =
          OutlineTree.getTreeAddNodeValue(outline_tree, id) || {}
        placeholderNodeValue.is_focus = false
      }
      outline_hover_obj = {}
    }

    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_hover_obj: outline_hover_obj //nodeValue
      }
    })
    // this.updateOutLineTreeData(outline_tree);
  }

  onExpand = (id, is_expand) => {
    //console.log("??????:onExpand", id, is_expand);
    const { dispatch, outline_tree } = this.props
    let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id)
    if (nodeValue) {
      nodeValue.is_expand = is_expand
      this.updateOutLineTreeData(outline_tree)
    } else {
      console.error('OutlineTree.getTreeNodeValue:??????????????????')
    }
  }

  onChangeCardHandleCardDetail = nodeValue => {
    const {
      card_detail_id,
      selected_card_visible,
      itemValue = {},
      dispatch
    } = this.props
    const { id, parent_card_id } = nodeValue
    onChangeCardHandleCardDetail({
      card_detail_id, //?????????????????????id
      selected_card_visible, //??????????????????????????????
      dispatch,
      operate_id: id, //???????????????id
      operate_parent_card_id: parent_card_id //?????????????????????????????????id
    })
  }

  onDataProcess = ({ action, param, calback, errCalback }) => {
    // console.log('??????:onDataProcess', action, param)
    const { dispatch, gantt_board_id, group_view_type } = this.props
    let { outline_tree = [] } = this.props
    switch (action) {
      case 'add_milestone':
        {
          let updateParams = {}
          updateParams.name = param.name
          updateParams.board_id = gantt_board_id
          if (param.parent_id) {
            updateParams.parent_id = param.parent_id
          }

          createMilestone({ ...updateParams }, { isNotLoading: false })
            .then(res => {
              if (isApiResponseOk(res)) {
                let addNodeValue = {
                  id: res.data,
                  tree_type: '1',
                  name: param.name,
                  is_expand: true,
                  children: [],
                  executors: []
                }
                if (param.parent_id) {
                  // ??????????????????
                  let nodeValue = OutlineTree.getTreeNodeValue(
                    outline_tree,
                    param.parent_id
                  )
                  let children = []
                  if (nodeValue) {
                    children = nodeValue.children
                  }

                  if (children.length > 0) {
                    const index = children.findIndex(
                      item => item.tree_type == '0'
                    )
                    children.splice(index, 0, addNodeValue)
                  } else {
                    children.push(addNodeValue)
                  }
                  nodeValue.children = children

                  this.setCreateAfterInputFous(nodeValue, outline_tree)
                } else {
                  const index = outline_tree.findIndex(
                    item => item.add_id == 'add_milestone'
                  )
                  if (index != -1) {
                    outline_tree.splice(index, 0, addNodeValue)
                  } else {
                    outline_tree.push(addNodeValue)
                  }
                }
                outline_tree = outline_tree.filter(
                  item => item.add_id != 'add_milestone'
                )
                //this.setCreateAfterInputFous(null,outline_tree);
                this.updateOutLineTreeData(outline_tree)
                // ????????????
                dispatch({
                  type: 'gantt/saveGanttOutlineSort',
                  payload: {
                    outline_tree
                  }
                })
                // ???????????????????????????????????? ?????????????????? ?????????????????????????????????????????? (??????????????????)
                if (this.props.selected_card_visible) {
                  dispatch({
                    type: 'publicTaskDetailModal/getMilestoneList',
                    payload: {
                      id: gantt_board_id
                    }
                  })
                }
              } else {
                message.error(res.message)
              }
            })
            .catch(err => {
              message.error('????????????')
            })
        }
        break
      case 'edit_milestone':
        {
          let updateParams = { ...param }
          updateParams.id = param.id
          updateParams.name = param.name
          delete updateParams.parentId
          // debugger
          updateMilestone({ ...updateParams }, { isNotLoading: false })
            .then(res => {
              if (isApiResponseOk(res)) {
                let nodeValue = OutlineTree.getTreeNodeValue(
                  outline_tree,
                  param.id
                )
                if (typeof calback == 'function') {
                  calback()
                }
                if (nodeValue) {
                  if (!!param.name) {
                    nodeValue.name = param.name
                  }
                  this.updateOutLineTreeData(outline_tree)
                } else {
                  console.error('OutlineTree.getTreeNodeValue:??????????????????')
                }
                dispatch({
                  type: 'gantt/getGttMilestoneList',
                  payload: {}
                })
              } else {
                if (typeof errCalback == 'function') {
                  errCalback()
                }
                message.error(res.message)
              }
            })
            .catch(err => {
              if (typeof errCalback == 'function') {
                errCalback()
              }
              message.error('????????????')
            })
        }
        break
      case 'add_task':
        {
          if (
            !checkIsHasPermissionInBoard(
              PROJECT_TEAM_CARD_CREATE,
              gantt_board_id
            )
          ) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            return
          }
          let updateParams = {}
          updateParams.add_type = 0

          updateParams.name = param.name
          updateParams.board_id = gantt_board_id
          updateParams.start_time = param.start_time
          updateParams.due_time = param.due_time

          let paraseNodeValue = OutlineTree.getTreeNodeValue(
            outline_tree,
            param.parentId
          )
          if (paraseNodeValue && paraseNodeValue.tree_type == '1') {
            updateParams.milestone_id = paraseNodeValue.id
          } else {
            updateParams.parent_id = param.parentId
          }

          addTaskInWorkbench({ ...updateParams }, { isNotLoading: false })
            .then(res => {
              if (isApiResponseOk(res)) {
                let nodeValue = OutlineTree.getTreeNodeValue(
                  outline_tree,
                  param.parentId
                )
                let addNodeValue = {
                  id: res.id,
                  tree_type: '2',
                  name: param.name,
                  is_expand: true,
                  children: [],
                  time_span: 0,
                  ...res.data
                }

                let children = []
                if (nodeValue) {
                  children = nodeValue.children
                } else {
                  children = outline_tree
                }
                //?????????????????????
                let addInputNodeValue = OutlineTree.getTreeNodeValueByName(
                  outline_tree,
                  'add_id',
                  param.add_id
                )
                if (children.length > 0) {
                  const index = children.findIndex(
                    item => item.tree_type == '0'
                  )
                  if (addInputNodeValue) {
                    children.splice(index, 0, addNodeValue)
                  }
                } else {
                  // children.push(addNodeValue)
                }
                if (nodeValue) {
                  nodeValue.children = children
                } else {
                  outline_tree = children
                }
                if (nodeValue) {
                  this.setCreateAfterInputFous(paraseNodeValue, outline_tree)
                  // ????????????????????????????????????????????????
                  this.onChangeCardHandleCardDetail(nodeValue)
                }
                if (addInputNodeValue) {
                  addInputNodeValue.start_time = null
                  addInputNodeValue.due_time = null
                  addInputNodeValue.time_span = 1
                  addInputNodeValue.name = ''
                  addInputNodeValue.editing = true
                } else {
                  outline_tree.push(addNodeValue)
                }

                this.updateOutLineTreeData(outline_tree)
                // ????????????
                dispatch({
                  type: 'gantt/saveGanttOutlineSort',
                  payload: {
                    outline_tree
                  }
                })
                if (typeof calback == 'function') {
                  calback()
                }
              } else {
                message.error(res.message)
              }
            })
            .catch(err => {
              console.error('sssasd', err)

              message.error('????????????')
            })
        }
        break
      case 'edit_task':
        {
          if (
            !checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)
          ) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            if (typeof errCalback == 'function') {
              errCalback()
            }
            return
          }
          let updateParams = { ...param }
          updateParams.card_id = param.id
          updateParams.board_id = gantt_board_id
          updateTaskVTwo({ ...updateParams }, { isNotLoading: false })
            .then(res => {
              if (isApiResponseOk(res)) {
                if (typeof calback == 'function') {
                  calback()
                }
                const { card_detail_id, selected_card_visible } = this.props
                let nodeValue = OutlineTree.getTreeNodeValue(
                  outline_tree,
                  param.id
                )
                if (nodeValue) {
                  this.onChangeCardHandleCardDetail(nodeValue)
                  if (!!param.name) {
                    nodeValue.name = param.name
                  }
                  if (param.time_span !== undefined) {
                    nodeValue.start_time = param.start_time
                    nodeValue.due_time = param.due_time
                  }
                  this.updateOutLineTreeData(outline_tree)
                } else {
                  console.error('OutlineTree.getTreeNodeValue:??????????????????')
                }
                rebackCreateNotify.call(this, {
                  res,
                  id: param.id,
                  board_id: gantt_board_id,
                  group_view_type,
                  dispatch,
                  parent_card_id: nodeValue.parent_card_id,
                  card_detail_id,
                  selected_card_visible
                })
                dispatch({
                  type: `gantt/updateOutLineTree`,
                  payload: {
                    datas: [
                      ...res.data.scope_content.filter(
                        item => item.id != param.id
                      )
                    ]
                  }
                })
              } else {
                if (typeof errCalback == 'function') {
                  errCalback()
                }
                message.error(res.message)
              }
            })
            .catch(err => {
              if (typeof errCalback == 'function') {
                errCalback()
              }
              console.log('err', err)
              message.error('????????????')
            })
        }
        break
      case 'add_executor':
        {
          const { projectDetailInfoData } = this.props
          if (
            param.tree_type != '1' &&
            !checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)
          ) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            return
          }
          let updateParams = {}
          //?????????
          if (param.tree_type == '1') {
            updateParams.id = param.id
            updateParams.user_id = param.user_id
            addMilestoneExcutos({ ...updateParams }, { isNotLoading: false })
              .then(res => {
                if (isApiResponseOk(res)) {
                  let nodeValue = OutlineTree.getTreeNodeValue(
                    outline_tree,
                    param.id
                  )
                  if (nodeValue) {
                    if (!nodeValue.executors) {
                      nodeValue.executors = []
                    }
                    if (projectDetailInfoData.data) {
                      nodeValue.executors.push({
                        ...projectDetailInfoData.data.find(
                          item => item.user_id == param.user_id
                        ),
                        id: param.user_id
                      })
                    }

                    this.updateOutLineTreeData(outline_tree)
                  } else {
                    console.error('OutlineTree.getTreeNodeValue:??????????????????')
                  }
                } else {
                  message.error(res.message)
                }
              })
              .catch(err => {
                message.error('??????????????????????????????')
              })
          }
          if (param.tree_type == '2') {
            updateParams.card_id = param.id
            updateParams.executor = param.user_id
            addTaskExecutor({ ...updateParams }, { isNotLoading: false })
              .then(res => {
                if (isApiResponseOk(res)) {
                  let nodeValue = OutlineTree.getTreeNodeValue(
                    outline_tree,
                    param.id
                  )
                  if (nodeValue) {
                    if (!nodeValue.executors) {
                      nodeValue.executors = []
                    }
                    nodeValue.executors.push({
                      ...projectDetailInfoData.data.find(
                        item => item.user_id == param.user_id
                      ),
                      id: param.user_id
                    })
                    this.updateOutLineTreeData(outline_tree)
                  } else {
                    console.error('OutlineTree.getTreeNodeValue:??????????????????')
                  }
                } else {
                  message.error(res.message)
                }
              })
              .catch(err => {
                message.error('??????????????????????????????')
              })
          }
        }
        break
      case 'remove_executor':
        {
          if (
            param.tree_type != '1' &&
            !checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)
          ) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            return
          }
          const { outline_tree } = this.props
          let updateParams = {}
          //?????????
          if (param.tree_type == '1') {
            updateParams.id = param.id
            updateParams.user_id = param.user_id
            removeMilestoneExcutos({ ...updateParams }, { isNotLoading: false })
              .then(res => {
                if (isApiResponseOk(res)) {
                  let nodeValue = OutlineTree.getTreeNodeValue(
                    outline_tree,
                    param.id
                  )
                  if (nodeValue && nodeValue.executors) {
                    nodeValue.executors = nodeValue.executors.filter(
                      item => (item.id || item.user_id) != param.user_id
                    )
                    // nodeValue.executors.splice(nodeValue.executors.findIndex((item) => item.id == param.id));
                    this.updateOutLineTreeData(outline_tree)
                  } else {
                    console.error('OutlineTree.getTreeNodeValue:??????????????????')
                  }
                } else {
                  message.error(res.message)
                }
              })
              .catch(err => {
                message.error('????????????')
              })
          }

          //??????
          if (param.tree_type == '2') {
            updateParams.card_id = param.id
            updateParams.executor = param.user_id
            removeTaskExecutor({ ...updateParams }, { isNotLoading: false })
              .then(res => {
                if (isApiResponseOk(res)) {
                  let nodeValue = OutlineTree.getTreeNodeValue(
                    outline_tree,
                    param.id
                  )
                  if (nodeValue && nodeValue.executors) {
                    nodeValue.executors = nodeValue.executors.filter(
                      item => (item.id || item.user_id) != param.user_id
                    )
                    // nodeValue.executors.splice(nodeValue.executors.findIndex((item) => item.id == param.id));
                    this.updateOutLineTreeData(outline_tree)
                  } else {
                    console.error('OutlineTree.getTreeNodeValue:??????????????????')
                  }
                } else {
                  message.error(res.message)
                }
              })
              .catch(err => {
                message.error('????????????')
              })
          }
        }
        break
      case 'reloadProjectDetailInfo':
        {
          dispatch({
            type: 'gantt/getAboutUsersBoards',
            payload: {}
          })
          dispatch({
            type: 'projectDetail/projectDetailInfo',
            payload: {
              id: gantt_board_id
            }
          }).then(res => {
            if (isApiResponseOk(res)) {
              if (calback) {
                calback({ user_data: res.data.data })
              }
            }
          })
        }
        break
      case 'onBlur':
        {
          // let nodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, param.add_id);
          let nodeValue = OutlineTree.getTreeNodeValueByName(
            outline_tree,
            'add_id',
            param.add_id
          )
          if (nodeValue) {
            // nodeValue.name = param.name;
            if (nodeValue.parent_id) {
              nodeValue.editing = false
              nodeValue.time_span = 0
              nodeValue.start_time = null
              nodeValue.due_time = null
              this.updateOutLineTreeData(outline_tree)
            } else {
              //????????????????????????????????????????????????????????????,?????????????????????????????????item
              const new_outline_tree = JSON.parse(
                JSON.stringify(outline_tree)
              ).filter(item => !item.add_id)
              this.updateOutLineTreeData(new_outline_tree)
            }
            if (typeof calback == 'function') {
              calback()
            }
          } else {
            console.error('OutlineTree.getTreeNodeValue:??????????????????')
          }
        }
        break
      case 'edit_flow':
        let updateParams = {}
        updateParams.id = param.id
        updateParams.name = param.name

        updateFlowInstanceNameOrDescription(
          { ...updateParams },
          { isNotLoading: false }
        )
          .then(res => {
            if (isApiResponseOk(res)) {
              let nodeValue = OutlineTree.getTreeNodeValue(
                outline_tree,
                param.id
              )

              if (nodeValue) {
                nodeValue.name = param.name
                this.updateOutLineTreeData(outline_tree)
              } else {
                console.error('OutlineTree.getTreeNodeValue:??????????????????')
              }
            } else {
              message.error(res.message)
            }
          })
          .catch(err => {
            message.error('????????????')
          })
        break
      case 'edit_work_flow':
        {
          let updateParams = { ...param }
          updateParams.id = param.id
          // debugger
          workflowUpdateTime({ ...updateParams }, { isNotLoading: false })
            .then(res => {
              if (isApiResponseOk(res)) {
                let nodeValue = OutlineTree.getTreeNodeValue(
                  outline_tree,
                  param.id
                )
                if (typeof calback == 'function') {
                  calback()
                }
                if (nodeValue) {
                  this.updateOutLineTreeData(outline_tree)
                } else {
                  console.error('OutlineTree.getTreeNodeValue:??????????????????')
                }
              } else {
                if (typeof errCalback == 'function') {
                  errCalback()
                }
                message.error(res.message)
              }
            })
            .catch(err => {
              if (typeof errCalback == 'function') {
                errCalback()
              }
              message.error('????????????')
            })
        }
        break
      default:
        break
    }
  }

  setCreateAfterInputFous = (paraseNodeValue, outline_tree = []) => {
    let placeholder = null
    if (paraseNodeValue) {
      placeholder = paraseNodeValue.children.find(item => item.tree_type == '0')
    } else {
      placeholder = outline_tree.find(item => item.tree_type == '0')
    }
    if (placeholder) {
      placeholder.is_focus = true
    }
  }
  renderGanttOutLineTree = (outline_tree, level, parentNode) => {
    if (!outline_tree) {
      return null
    }
    //console.log("outline_tree", outline_tree);
    return outline_tree.map((item, index) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            {...this.props}
            key={index}
            nodeValue={item}
            level={level}
            onHover={this.onHover}
            setScrollPosition={this.props.setScrollPosition}
            setGoldDateArr={this.props.setGoldDateArr}
          >
            {this.renderGanttOutLineTree(item.children, level + 1, item)}
          </TreeNode>
        )
      } else {
        // ??????????????????????????????????????????????????????item
        if (item.tree_type == 0) {
          if (item.add_id.indexOf('add_milestone') != -1) {
            // return this.renderAddMilestone(item)
            return (
              <TreeNode
                setScrollPosition={this.props.setScrollPosition}
                setGoldDateArr={this.props.setGoldDateArr}
                level={level}
                nodeValue={item}
                type={'1'}
                onHover={this.onHover}
                placeholder={
                  parentNode && parentNode.tree_type == '1'
                    ? `??????????????????`
                    : `???????????????`
                }
                icon={
                  <span
                    className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}
                  >
                    &#xe8fe;
                  </span>
                }
                label={
                  <span className={styles.addTask}>
                    {parentNode && parentNode.tree_type == '1'
                      ? `??????????????????`
                      : `???????????????`}
                  </span>
                }
                key={`addMilestone_${item.index}`}
              ></TreeNode>
            )
          } else {
            return (
              <TreeNode
                setScrollPosition={this.props.setScrollPosition}
                setGoldDateArr={this.props.setGoldDateArr}
                level={level}
                nodeValue={item}
                type={'2'}
                onHover={this.onHover}
                placeholder={
                  parentNode && parentNode.tree_type == '2'
                    ? `?????????${currentNounPlanFilterName(TASKS)}`
                    : `??????${currentNounPlanFilterName(TASKS)}`
                }
                icon={
                  <span
                    className={`${styles.addTaskNode} ${globalStyles.authTheme}`}
                  >
                    &#xe8fe;
                  </span>
                }
                label={
                  <span className={styles.addTask}>
                    {parentNode && parentNode.tree_type == '2'
                      ? `?????????${currentNounPlanFilterName(TASKS)}`
                      : `??????${currentNounPlanFilterName(TASKS)}`}
                  </span>
                }
                key={`addTask_${item.index}`}
              ></TreeNode>
            )
          }
        } else {
          return (
            <TreeNode
              {...this.props}
              setScrollPosition={this.props.setScrollPosition}
              setGoldDateArr={this.props.setGoldDateArr}
              key={index}
              nodeValue={item}
              level={level}
              onHover={this.onHover}
            ></TreeNode>
          )
        }
      }
    })
  }
  setBoardInfoVisible = () => {
    const { board_info_visible } = this.state
    const { dispatch, gantt_board_id, projectDetailInfoData } = this.props
    //console.log("projectDetailInfoData",projectDetailInfoData);
    if (!board_info_visible) {
      dispatch({
        type: 'projectDetail/projectDetailInfo',
        payload: {
          id: gantt_board_id
        }
      })
      let _organization_id = localStorage.getItem('OrganizationId')
      dispatch({
        type: 'projectDetail/getProjectRoles',
        payload: {
          type: '2',
          _organization_id:
            (!_organization_id || _organization_id) == '0'
              ? getGlobalData('aboutBoardOrganizationId')
              : _organization_id
        }
      })
    }
    this.setState({
      board_info_visible: !board_info_visible
    })
  }

  //???????????????????????????
  setShowAddMenberModalVisibile = () => {
    this.setState({
      show_add_menber_visible: !this.state.show_add_menber_visible
    })
  }

  addMenbersInProject = values => {
    const { gantt_board_id } = this.props
    const { dispatch } = this.props
    addMenbersInProject({ ...values }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('???????????????????????????')
        setTimeout(() => {
          dispatch({
            type: 'gantt/getAboutUsersBoards',
            payload: {}
          })
        }, 1000)
        setTimeout(() => {
          dispatch({
            type: 'projectDetail/projectDetailInfo',
            payload: {
              id: gantt_board_id
            }
          })
        }, 1000)
      } else {
        message.error(res.message)
      }
    })
  }
  invitationJoin = () => {
    const { gantt_board_id } = this.props
    if (
      !checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, gantt_board_id)
    ) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setShowAddMenberModalVisibile()
  }

  changeSafeConfirmModalVisible = () => {
    this.setState({
      safeConfirmModalVisible: !this.state.safeConfirmModalVisible
    })
  }

  onImportBoardTemplate = () => {
    const { dispatch, gantt_board_id } = this.props
    const { selectedTpl = {} } = this.state
    importBoardTemplate({
      board_id: gantt_board_id,
      template_id: selectedTpl.id
    })
      .then(res => {
        if (isApiResponseOk(res)) {
          //console.log("importBoardTemplate", res);
          dispatch({
            type: 'gantt/getGanttData',
            payload: {}
          })
        } else {
          message.error(res.message)
        }
      })
      .catch(err => {
        message.error('??????????????????')
      })
  }

  // ???????????????????????????
  recusionSetFold = (data, fold_state) => {
    if (data) {
      data = data.map(item => {
        item.parent_expand = fold_state
        item.is_expand = fold_state
        let { children } = item
        if (children && children.length) {
          this.recusionSetFold(children, fold_state)
        }
        return item
      })
    }
  }
  outlineTreeFold = action => {
    const { outline_tree, dispatch } = this.props
    let new_outline_tree = JSON.parse(JSON.stringify(outline_tree))
    const fold_state = action == 'fold' ? false : true
    this.recusionSetFold(new_outline_tree, fold_state)
    dispatch({
      type: 'gantt/handleOutLineTreeData',
      payload: {
        data: new_outline_tree
      }
    })
  }
  isExistExpand = () => {
    //??????????????????????????????
    const { outline_tree } = this.props
    let flag = false
    const recusionCheck = data => {
      for (let val of data) {
        if (val['is_expand']) {
          //???????????????
          flag = true
          break
        } else {
          const { children = [] } = val
          if (children.length) {
            recusionCheck(children)
          }
        }
      }
    }
    const levelone_tree = outline_tree.filter(item => item.is_expand)
    if (!levelone_tree.length) {
      //???????????????????????????????????????
      return false
    }
    recusionCheck(outline_tree)
    return flag
  }

  // ????????????????????????------start
  saveBoardTemplateVisible = bool => {
    this.setState({
      save_board_template_visible: bool
    })
  }

  // ?????????????????????????????????
  setInputAddType = type => {
    this.setState({
      input_add_type: type
    })
  }
  setAddMultipleVisible = bool => {
    this.setState({
      add_mutiple_visible: bool
    })
  }
  // ????????????????????????------end
  renderAddMilestone = (item, normal) => {
    const { input_add_type, add_mutiple_visible } = this.state
    return (
      <TreeNode
        setScrollPosition={this.props.setScrollPosition}
        setGoldDateArr={this.props.setGoldDateArr}
        type={input_add_type}
        placeholder={input_add_type == '1' ? '???????????????' : '????????????'}
        onHover={this.onHover}
        nodeValue={
          normal
            ? {
                add_id:
                  input_add_type == '1' ? 'add_milestone_out' : 'add_card_out',
                tree_type: '0'
              }
            : item
        } // add_id: 'add_milestone'
        icon={
          <Dropdown
            trigger={['click']}
            overlay={
              <AddMultipleIndex
                setInputAddType={this.setInputAddType}
                setAddMultipleVisible={this.setAddMultipleVisible}
                input_add_type={input_add_type}
              />
            }
          >
            <span
              className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}
              style={{ color: 'rgba(0,0,0,0.45)' }}
            >
              &#xe8fe;
            </span>
          </Dropdown>
        }
        label={
          <Dropdown
            visible={add_mutiple_visible}
            overlay={
              <AddMultiplePomp
                input_add_type={input_add_type}
                setAddMultipleVisible={this.setAddMultipleVisible}
              />
            }
          >
            <span className={styles.addMilestone}>
              {input_add_type == '1' ? '???????????????' : '????????????'}
            </span>
          </Dropdown>
        }
        key="addMilestone"
      ></TreeNode>
    )
  }
  //????????????????????????
  domToImageOperateType = {
    png: 'toPng',
    jpeg: 'toJpeg'
  }
  // ???canvas????????????????????? =??? ??????????????????????????????????????????dom?????????????????????????????????????????????????????????????????????
  // ??????????????????body??????
  // ????????????body
  interceptCanvas = async ({
    head_element,
    body_element,
    canvas_body_start = 0,
    canvas_body_end = 4760,
    operate_action = 'jpeg'
  }) => {
    const operate_event = this.domToImageOperateType[operate_action]
    const filter = () => true
    const head_url = await DomToImage[operate_event](head_element, {
      filter
    }).catch(err => console.log('export_err', err))
    const bordy_url = await DomToImage[operate_event](body_element, {
      filter
    }).catch(err => console.log('export_err', err))
    // ??????????????????????????????????????????????????????
    const style_data = await Promise.all([
      this.loadImg(head_url),
      this.loadImg(bordy_url)
    ])
    //????????????????????????????????????
    if (style_data.findIndex(item => !item.img_height) == -1) {
      // ????????????????????????
      const cuted_head_url_data = this.cutBodyCanvas({
        width: style_data[0].img_width,
        height: style_data[0].img_height,
        img: style_data[0].img,
        sx: 0, //????????????
        sy: 0,
        swidth: style_data[0].img_width, //???????????????????????????????????????
        sheight: style_data[0].img_height - 60 //??????60?????????????????????
      })
      //????????????????????????????????????
      const {
        img: head_img,
        img_height: head_img_height,
        img_width: head_img_width
      } = await this.loadImg(cuted_head_url_data)

      // ??????????????????body??????(????????????)???base64
      const cuted_body_url_data = this.cutBodyCanvas({
        width: canvas_body_end - canvas_body_start,
        height: style_data[1].img_height,
        img: style_data[1].img,
        sx: canvas_body_start, //????????????
        sy: 0,
        swidth: canvas_body_end - canvas_body_start, //???????????????????????????????????????
        sheight: style_data[1].img_height - 60
      })
      // ????????????body????????????
      const {
        img: final_body_img,
        img_height: final_body_img_height,
        img_width: final_body_img_width
      } = await this.loadImg(cuted_body_url_data)
      //???????????????????????????body??????
      const final_data_url = await this.joinImage({
        head_img,
        head_img_height,
        head_img_width,
        final_body_img,
        height: final_body_img_height,
        final_body_img_height,
        final_body_img_width,
        operate_event
      })
      return Promise.resolve(final_data_url)
    }
    return Promise.resolve('')
  }
  // ?????????????????????????????????????????????
  cutBodyCanvas = ({ width, height, img, sx, sy, swidth, sheight }) => {
    const canvas = document.createElement('canvas')
    canvas.height = height
    canvas.width = width
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, width, height)
    const base64_data = canvas.toDataURL()
    return base64_data
  }
  loadImg = dataUrl => {
    const img = new Image()
    img.src = dataUrl
    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve({ img_height: img.height, img_width: img.width, img })
      }
      img.onerror = () => {
        resolve({ img_height: undefined, img_width: undefined, img })
      }
    })
  }
  // ?????????????????????dom?????????????????????????????????domtoImg
  joinImage = async ({
    head_img,
    head_img_height,
    head_img_width,
    final_body_img,
    height,
    final_body_img_height,
    final_body_img_width,
    operate_event
  }) => {
    const ele = document.createElement('div')
    const id_name = 'gantt_dom_to_img_warpper'
    const dom2_margin_left = -16
    final_body_img.style['margin-left'] = `${dom2_margin_left}px`

    ele.id = id_name
    ele.style.height = `${height}px`
    ele.style.width = `${head_img_width +
      final_body_img_width +
      dom2_margin_left}px`
    ele.style.backgroundColor = '#fff'
    ele.appendChild(head_img)
    ele.appendChild(final_body_img)
    document.querySelector('body').appendChild(ele)
    const final_data_url = await DomToImage[operate_event](
      document.getElementById(id_name),
      {
        filter: () => true
      }
    ).catch(err => console.log('export_err', err))
    document.getElementById(id_name).remove()
    return Promise.resolve(final_data_url)
  }
  // ???????????????????????????
  toExport = (type = 'svg', pix = 2) => {
    return new Promise((resolve, reject) => {
      // let header = document.querySelector('#gantt_date_area')
      let parent = document.querySelector('.' + styles.cardDetail_middle)
      let wapper = parent.querySelector('#gantt_group_head')
      let listHead = parent.querySelector('#gantt_header_wapper')
      let list = parent.querySelectorAll('.treeItems_i')
      let panl = document.querySelector('#gantt_operate_area_panel')
      const gantt_body = parent.querySelector('#gantt_body_wapper')
      list.forEach(item => {
        item.style.height = '38px'
        item.style.marginBottom = '0px'
      })
      let h = listHead.style.height
      if (listHead) {
        listHead.style.height = 'auto'
      }
      wapper.style.overflowY = 'inherit'
      parent.style.overflowY = 'inherit'
      // let left = header.style.left
      // header.style.left = 0
      let dom = parent.querySelector('#gantt_card_out_middle')
      dom.style.overflow = 'inherit'
      dom.parentNode.style.overflow = 'inherit'
      panl.nextElementSibling.style.display = 'none'
      // ???????????????????????????
      function filter(node) {
        return true
        // return (node.tagName?.toUpperCase() !== 'IMG');
      }
      // message.success('???????????????...');
      setTimeout(async () => {
        // let dataUrl
        // if (type === 'svg') {
        //   dataUrl = await DomToImage.toSvg(parent, { filter }).catch(err => err)
        // }
        // if (type === 'png') {
        //   dataUrl = await DomToImage.toPng(parent, { filter }).catch(err => err)
        // }
        // if (type === 'jpeg') {
        //   dataUrl = await DomToImage.toJpeg(parent, { filter }).catch(
        //     err => err
        //   )
        // }
        // if (!dataUrl) reject()
        // let canvas = document.createElement('canvas')
        // let img = new Image()
        // img.src = dataUrl
        // img.onload = () => {
        //   let numbers = 0 // ????????????
        //   canvas.height = img.height * pix
        //   canvas.width = img.width * pix
        //   let ctx = canvas.getContext('2d')
        //   ctx.drawImage(img, 0, 0, img.width * pix, img.height * pix + 80)
        //   ctx.scale(img.width / canvas.width, img.height / canvas.height)
        //   const toBlob = () => {
        //     canvas.toBlob(async blob => {
        //       // ???????????????????????? ????????????5????????????
        //       if (!blob && numbers <= 2) {
        //         numbers++
        //         return toBlob()
        //       } else if (!blob) {
        //         // ????????????5???????????????????????????
        //         if (type === 'svg') {
        //           // ?????????svg?????????????????????????????????????????????jpeg
        //           dataUrl = await this.toExport('jpeg')
        //         }
        //         return resolve(dataUrl)
        //       }
        //       let url = window.URL.createObjectURL(blob)
        //       resolve(url)
        //     })
        //   }
        //   toBlob()
        // }

        //???????????????????????????base64
        const final_data_url = await this.interceptCanvas({
          head_element: listHead,
          body_element: gantt_body,
          operate_action: type
        })
        dom.style.overflow = 'scroll'
        // header.style.left = left
        dom.parentNode.style.overflow = 'hidden'
        parent.style.overflowY = 'auto'
        wapper.style.overflowY = 'auto'
        if (listHead) {
          listHead.style.height = h
        }
        list.forEach(item => {
          item.style.height = '26px'
          item.style.marginBottom = '12px'
        })
        panl.nextElementSibling.style.display = 'block'
        resolve(final_data_url)
      }, 500)
    })
  }
  // ???????????????????????????
  getExportFileName = () => {
    const { start_date, end_date } = this.props
    let flag = start_date.year === end_date.year
    if (flag)
      return (
        start_date.date_top +
        start_date.date_no +
        '??? ??? ' +
        end_date.date_top +
        end_date.date_no +
        '???'
      )
    else
      return (
        start_date.year.toString().substr(-2) +
        '???' +
        start_date.month +
        '???' +
        start_date.date_no +
        '??? ??? ' +
        end_date.year.toString().substr(-2) +
        '???' +
        end_date.month +
        '???' +
        end_date.date_no +
        '???'
      )
  }

  // ?????????????????????
  exportToFile = async type => {
    const { projectDetailInfoData = {} } = this.props
    this.setState({
      visibleExportPopover: false
    })
    switch (type) {
      case 'pdf':
        this.setState({
          // bodyPicture: await createModel(),
          showLoading: true
        })
        // this.createLoadingDiv();
        let urlData = await this.toExport('png', 0.8)
        let pic = new Image()
        pic.src = urlData
        pic.onload = async () => {
          let pdf = new jsPDF({
            orientation: 'l',
            unit: 'px',
            format: [pic.width, pic.height]
          })
          pdf.addImage(pic, 'JPEG', 0, 0, pic.width, pic.height, '', 'SLOW')
          await pdf.save(
            projectDetailInfoData.board_name +
              '_' +
              this.getExportFileName() +
              '.pdf'
          )
          this.setState({
            showLoading: false,
            bodyPicture: null
          })
        }
        break
      case 'image':
        this.setState({
          showLoading: true
        })
        // svg???????????????png???jpeg?????????????????????
        let url = await this.toExport('jpeg', 1)
        let a = document.createElement('a')
        a.href = url
        a.download =
          projectDetailInfoData.board_name +
          '_' +
          this.getExportFileName() +
          '.png'
        a.click()
        // ????????????
        a = null
        this.setState({
          showLoading: false
        })
        break
      case 'svg':
        let dom = document.body
        let p = new jsPDF()
        p.html(dom, {
          callback: function(doc) {
            doc.save('test.pdf')
          }
        })
        break
      case 'excel':
        this.setExportExcelModalVisible(true)
        break
      default:
        message.warn('?????????????????????')
    }
  }

  // ??????????????????????????????
  setExportImgModalVisible = visible => {
    this.setState({
      exoprt_img_visible: visible
    })
  }
  // ??????????????????
  setExportImgOperateAction = action_type => {
    this.setState({
      export_img_action_type: action_type
    })
  }

  // ??????????????????
  handleShowHideTerm = async () => {
    const { gantt_board_id, dispatch } = this.props
    const [res1, res2] = await Promise.all([
      saveGanttOutlineNonDisplay({
        board_id: gantt_board_id,
        content_ids: []
      }),
      setGanttUserCustorm({
        board_id: gantt_board_id,
        is_show_due: BOOLEAN_TRUE_CODE,
        is_show_warning: BOOLEAN_TRUE_CODE,
        is_show_doing: BOOLEAN_TRUE_CODE,
        is_show_realize: BOOLEAN_TRUE_CODE,
        is_show_not_start: BOOLEAN_TRUE_CODE
      })
    ])
    if (isApiResponseOk(res1) && isApiResponseOk(res2)) {
      message.success('????????????')
      dispatch({
        type: 'gantt/getGanttData',
        payload: {}
      })
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          isDisplayContentIds: [],
          outline_tree_filter_type: {
            //????????????????????????
            is_show_due: BOOLEAN_TRUE_CODE,
            is_show_warning: BOOLEAN_TRUE_CODE,
            is_show_doing: BOOLEAN_TRUE_CODE,
            is_show_realize: BOOLEAN_TRUE_CODE,
            is_show_not_start: BOOLEAN_TRUE_CODE
          }
        }
      })
    } else {
      message.error('????????????')
    }
    return
    saveGanttOutlineNonDisplay({
      board_id: gantt_board_id,
      content_ids: []
    }).then(res => {
      if (isApiResponseOk(res)) {
        // this.getOutlineHideTerm()
        // message.success('????????????')
        this.props.dispatch({
          type: 'gantt/getGanttData',
          payload: {}
        })
        this.props.dispatch({
          type: 'gantt/updateDatas',
          payload: {
            isDisplayContentIds: [],
            outline_tree_filter_type: {
              //????????????????????????
              is_show_due: BOOLEAN_TRUE_CODE,
              is_show_warning: BOOLEAN_TRUE_CODE,
              is_show_doing: BOOLEAN_TRUE_CODE,
              is_show_realize: BOOLEAN_TRUE_CODE
            }
          }
        })
      }
    })
  }

  // ????????????
  handleSaveHideTerm = () => {
    const {
      outline_tree = [],
      gantt_board_id,
      isDisplayContentIds = []
    } = this.props
    let content_ids = []
    const mapGetContentId = arr => {
      for (let val of arr) {
        const { children = [], id, is_display } = val
        if (is_display == false) {
          content_ids.push(id)
        }
        if (children.length) {
          mapGetContentId(children)
        }
      }
    }
    content_ids.push(...isDisplayContentIds)
    mapGetContentId(outline_tree)
    // return
    saveGanttOutlineNonDisplay({ board_id: gantt_board_id, content_ids }).then(
      res => {
        if (isApiResponseOk(res)) {
          message.success('????????????')
          this.props.dispatch({
            type: 'gantt/handleOutLineTreeData',
            payload: {
              data: outline_tree,
              filter_display: true
            }
          })
          this.getOutlineHideTerm()
          this.props.dispatch({
            type: 'gantt/updateDatas',
            payload: {
              selected_hide_term: false
            }
          })
          // this.getOutlineHideTerm()
        }
      }
    )
  }

  // ??????
  handleCancelHideTerm = () => {
    const { outline_tree_original = [] } = this.props
    this.props.dispatch({
      type: 'gantt/handleOutLineTreeData',
      payload: {
        data: outline_tree_original
      }
    })
    this.props.dispatch({
      type: 'gantt/updateDatas',
      payload: {
        selected_hide_term: false,
        outline_tree_original: []
      }
    })
  }

  // ????????????
  handleOnSelect = e => {
    const { key } = e
    switch (key) {
      case 'boardInfo':
        this.setBoardInfoVisible()
        break
      case 'select_hide_term': // ???????????????
        const { outline_tree = [] } = this.props
        const outline_tree_ = JSON.parse(JSON.stringify(outline_tree))
        this.props.dispatch({
          type: 'gantt/updateDatas',
          payload: {
            selected_hide_term: true,
            // ????????????
            outline_tree_original: outline_tree_
          }
        })
        break
      case 'export_pdf': // ??????pdf
        // this.exportToFile('pdf')
        this.setExportImgModalVisible(true)
        this.setExportImgOperateAction('pdf')
        break
      case 'export_img': // ????????????
        // this.exportToFile('image')
        this.setExportImgModalVisible(true)
        this.setExportImgOperateAction('image')
        break
      case 'export_excel': // ????????????
        // this.exportToFile('excel')
        this.setExportExcelModalVisible(true)
        break
      case 'save_templete': // ???????????????
        this.saveBoardTemplateVisible(true)
        break
      default:
        break
    }
  }
  setCardNameOutside = checked => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        card_name_outside: checked
      }
    })
  }
  setCardNameOutsideBuddle = e => {
    e.stopPropagation()
  }
  // -----------?????????start
  // ????????????
  setOutlineTreeFilterType = async (code, e) => {
    e.stopPropagation()
    const {
      outline_tree_filter_type = {},
      dispatch,
      outline_tree,
      gantt_board_id
    } = this.props
    if (outline_tree_filter_type[code] == BOOLEAN_FALSE_CODE) return
    const res = await setGanttUserCustorm({
      board_id: gantt_board_id,
      [code]: BOOLEAN_FALSE_CODE
    })
    if (isApiResponseOk(res) || true) {
      message.success('????????????')
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          outline_tree_filter_type: {
            ...outline_tree_filter_type,
            [code]: BOOLEAN_FALSE_CODE
          }
        }
      })
      setTimeout(() => {
        dispatch({
          type: 'gantt/handleOutLineTreeData',
          payload: {
            data: outline_tree
          }
        })
      }, 100)
    }
  }
  getOutlineTreeFilterType = async () => {
    const { gantt_board_id } = this.props
    const res = await getGanttUserCustorm({ board_id: gantt_board_id })
    const { dispatch } = this.props
    if (isApiResponseOk(res)) {
      const {
        data: {
          is_show_doing,
          is_show_due,
          is_show_realize,
          is_show_warning,
          is_show_not_start
        }
      } = res
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          outline_tree_filter_type: {
            is_show_due: is_show_due || BOOLEAN_TRUE_CODE,
            is_show_warning: is_show_warning || BOOLEAN_TRUE_CODE,
            is_show_doing: is_show_doing || BOOLEAN_TRUE_CODE,
            is_show_realize: is_show_realize || BOOLEAN_TRUE_CODE,
            is_show_not_start: is_show_not_start || BOOLEAN_TRUE_CODE
          }
        }
      })
    }
  }
  // ???????????????????????????
  isHasFilterHide = () => {
    const { outline_tree_filter_type = {} } = this.props
    let flag = false
    for (let key in outline_tree_filter_type) {
      if (outline_tree_filter_type[key] == BOOLEAN_FALSE_CODE) {
        flag = true
        break
      }
    }
    return flag
  }
  setFilterTypeStyle = code => {
    const { outline_tree_filter_type } = this.props
    if (outline_tree_filter_type[code] == BOOLEAN_FALSE_CODE)
      return 'rgba(0,0,0,0.35)'
    return '#75A4FF'
  }
  // -----------?????????end

  // ??????????????????
  renderOutlineFooter = () => {
    const { card_name_outside } = this.props
    return (
      <Menu onClick={this.handleOnSelect}>
        <Menu.Item key="boardInfo">
          {`${currentNounPlanFilterName(PROJECTS)}`}??????
        </Menu.Item>
        {/* <Menu.Item key="set_name_outside">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 14 }}>????????????</div>
            <div onClick={e => this.setCardNameOutsideBuddle(e)}>
              <Switch
                checked={card_name_outside}
                onChange={this.setCardNameOutside}
              />
            </div>
          </div>
        </Menu.Item>
        <SubMenu title={'???????????????'}>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>???????????????</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_due') }}
                onClick={e => this.setOutlineTreeFilterType('is_show_due', e)}
              >
                ??????
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>???????????????</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_warning') }}
                onClick={e =>
                  this.setOutlineTreeFilterType('is_show_warning', e)
                }
              >
                ??????
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>?????????????????????</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_doing') }}
                onClick={e => this.setOutlineTreeFilterType('is_show_doing', e)}
              >
                ??????
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>??????????????????</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_not_start') }}
                onClick={e =>
                  this.setOutlineTreeFilterType('is_show_not_start', e)
                }
              >
                ??????
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>??????????????????</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_realize') }}
                onClick={e =>
                  this.setOutlineTreeFilterType('is_show_realize', e)
                }
              >
                ??????
              </div>
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="select_hide_term">?????????</Menu.Item>
        </SubMenu> */}
        <SubMenu title="??????">
          <Menu.Item key="export_pdf">??????PDF</Menu.Item>
          <Menu.Item key="export_img">????????????</Menu.Item>
          <Menu.Item key="export_excel">????????????</Menu.Item>
        </SubMenu>
        <Menu.Item key="save_templete">
          ?????????{currentNounPlanFilterName(PROJECTS)}??????
        </Menu.Item>
      </Menu>
    )
  }

  setExportExcelModalVisible = bool => {
    this.setState({
      export_excel_modal_visible: bool
    })
  }

  render() {
    const {
      board_info_visible,
      show_add_menber_visible,
      safeConfirmModalVisible
    } = this.state
    const {
      outline_tree,
      outline_hover_obj,
      gantt_board_id,
      projectDetailInfoData,
      outline_tree_round,
      changeOutLineTreeNodeProto,
      deleteOutLineTreeNode,
      currentUserOrganizes = [],
      start_date,
      end_date,
      selected_hide_term,
      isDisplayContentIds = []
    } = this.props
    // console.log("???????????????", outline_tree);
    return (
      <div
        className={styles.outline_wrapper}
        // style={{ marginTop: task_item_margin_top }}
      >
        <OutlineTree
          // defaultExpandedKeys={['0-0-0']}
          gantt_board_id={gantt_board_id}
          onSelect={this.onSelect}
          onDataProcess={this.onDataProcess}
          onExpand={this.onExpand}
          onHover={this.onHover}
          hoverItem={outline_hover_obj}
          outline_tree_round={outline_tree_round}
          projectDetailInfoData={projectDetailInfoData}
          changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
          deleteOutLineTreeNode={deleteOutLineTreeNode}
        >
          {this.renderGanttOutLineTree(outline_tree, 0)}
          {this.renderAddMilestone({}, true)}
        </OutlineTree>

        <div
          className={styles.outlineFooter}
          style={{
            justifyContent:
              selected_hide_term ||
              !!(isDisplayContentIds && isDisplayContentIds.length) ||
              this.isHasFilterHide()
                ? 'space-between'
                : 'flex-end'
          }}
        >
          {(!!(
            isDisplayContentIds &&
            isDisplayContentIds.length &&
            !selected_hide_term
          ) ||
            this.isHasFilterHide()) && (
            <div
              onClick={this.handleShowHideTerm}
              style={{ color: '#6294FF', marginLeft: 20 }}
            >
              ????????????
            </div>
          )}
          {selected_hide_term && (
            <div>
              <Button
                style={{ marginRight: '5px' }}
                type="primary"
                onClick={this.handleSaveHideTerm}
              >
                ??????
              </Button>
              <Button onClick={this.handleCancelHideTerm}>??????</Button>
            </div>
          )}
          <div style={{ display: 'flex' }}>
            {!this.isExistExpand() ? (
              <div
                title="????????????"
                className={styles.outline_footer_icon}
                onClick={() => this.outlineTreeFold('expand')}
                // style={{ color: '#1890FF' }}
              >
                <span className={`${globalStyles.authTheme}`}>&#xe7bb;</span>
                {/* <span
                className={`${globalStyles.authTheme}`}
                style={{ fontSize: 16, marginRight: 2 }}
              >
                &#xe712;
              </span>
              <span>????????????</span> */}
              </div>
            ) : (
              <div
                title="????????????"
                className={styles.outline_footer_icon}
                onClick={() => this.outlineTreeFold('fold')}
                // style={{ color: '#1890FF' }}
              >
                <span className={`${globalStyles.authTheme}`}>&#xe7ba;</span>
                {/* <span
                className={`${globalStyles.authTheme}`}
                style={{ fontSize: 16, marginRight: 4 }}
              >
                &#xe712;
              </span>
              <span>????????????</span> */}
              </div>
            )}
            {!selected_hide_term && (
              <Dropdown
                trigger={['click']}
                placement="topLeft"
                overlay={this.renderOutlineFooter()}
              >
                <div
                  className={`${styles.outline_footer_icon} ${styles.outline_more_spot}`}
                >
                  <span className={globalStyles.authTheme}>&#xe66f;</span>
                </div>
              </Dropdown>
            )}
          </div>

          {/* <Popover
            trigger="click"
            title={this.getExportFileName()}
            visible={this.state.visibleExportPopover}
            onVisibleChange={val =>
              this.setState({ visibleExportPopover: val })
            }
            content={
              <div className={styles.exportList}>
                <div onClick={this.exportToFile.bind(this, 'pdf')}>??????PDF</div>
                <div onClick={this.exportToFile.bind(this, 'image')}>
                  ????????????
                </div>
                <div onClick={this.exportToFile.bind(this, 'excel')}>
                  ????????????
                </div>
              </div>
            }
          >
            <a>??????</a>
          </Popover> */}
          {/* <div>
            {!closeFeature({
              board_id: gantt_board_id,
              currentUserOrganizes
            }) && (
              <div
                style={{ color: '#1890FF' }}
                onClick={() => this.saveBoardTemplateVisible(true)}
              >
                <span
                  className={`${globalStyles.authTheme}`}
                  style={{ fontSize: 16, marginRight: 4 }}
                >
                  &#xe6b5;
                </span>
                <span style={{ marginRight: 16 }}>
                  ?????????{`${currentNounPlanFilterName(PROJECTS)}`}??????
                </span>
              </div>
            )}
          </div> */}
        </div>
        <div onWheel={e => e.stopPropagation()}>
          {show_add_menber_visible && (
            <ShowAddMenberModal
              invitationType="1"
              invitationId={gantt_board_id}
              invitationOrg={getOrgIdByBoardId(gantt_board_id)}
              show_wechat_invite={true}
              _organization_id={getOrgIdByBoardId(gantt_board_id)}
              board_id={gantt_board_id}
              addMenbersInProject={this.addMenbersInProject}
              modalVisible={show_add_menber_visible}
              setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile}
            />
          )}
        </div>
        <div onWheel={e => e.stopPropagation()}>
          <DetailInfo
            setProjectDetailInfoModalVisible={this.setBoardInfoVisible}
            modalVisible={board_info_visible}
            invitationType="1"
            invitationId={gantt_board_id}
          />
          {safeConfirmModalVisible && (
            <SafeConfirmModal
              selectedTpl={this.state.selectedTpl}
              visible={safeConfirmModalVisible}
              onChangeVisible={this.changeSafeConfirmModalVisible}
              onOk={this.onImportBoardTemplate}
            />
          )}
        </div>
        <>
          <SaveBoardTemplate
            setVisible={this.saveBoardTemplateVisible}
            visible={this.state.save_board_template_visible}
          />
        </>
        <>
          {this.state.export_excel_modal_visible && (
            <ExportExcelModal
              board_id={gantt_board_id}
              updateState={this.updateState}
              setVisible={this.setExportExcelModalVisible}
              visible={this.state.export_excel_modal_visible}
            />
          )}
        </>
        {this.state.showLoading && (
          <IsLoading>{/* {this.state.bodyPicture} */}</IsLoading>
        )}
        <ExportGanttToImage
          setExportImgModalVisible={this.setExportImgModalVisible}
          setShowLoading={bool => {
            this.setState({ showLoading: bool })
          }}
          visible={this.state.exoprt_img_visible}
          action_type={this.state.export_img_action_type}
        />
      </div>
    )
  }
}

//  ??????????????????????????????state????????????UI ????????????props?????????????????????
function mapStateToProps({
  gantt: {
    datas: {
      gantt_board_id,
      group_view_type,
      outline_tree,
      outline_hover_obj,
      outline_tree_round,
      date_arr_one_level = [],
      ceilWidth,
      gantt_view_mode,
      selected_card_visible,
      start_date,
      end_date,
      selected_hide_term,
      isDisplayContentIds = [],
      outline_tree_original = [],
      card_name_outside,
      outline_tree_filter_type
    }
  },
  technological: {
    datas: {
      currentUserOrganizes = [],
      is_show_org_name,
      is_all_org,
      userBoardPermissions = []
    }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  publicTaskDetailModal: { card_id: card_detail_id }
}) {
  return {
    card_detail_id,
    selected_card_visible,
    date_arr_one_level,
    gantt_view_mode,
    ceilWidth,
    currentUserOrganizes,
    is_show_org_name,
    is_all_org,
    gantt_board_id,
    group_view_type,
    projectDetailInfoData,
    userBoardPermissions,
    outline_tree,
    outline_hover_obj,
    outline_tree_round,
    start_date,
    end_date,
    selected_hide_term,
    isDisplayContentIds,
    outline_tree_original,
    card_name_outside,
    outline_tree_filter_type
  }
}
