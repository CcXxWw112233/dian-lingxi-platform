import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import ConfigureProcess from './components/ConfigureProcess'
import EditProcess from './components/EditProcess'
import ProcessStartConfirm from './components/ProcessStartConfirm'
import BeginningProcess from './components/BeginningProcess'
import ConfigureGuide from './ConfigureGuide'
import { processEditDatasItemOneConstant } from './constant'
import { Tooltip, Button, message, Popover, DatePicker, Checkbox } from 'antd'
import {
  timeToTimestamp,
  timestampToTimeNormal,
  isObjectValueEqual,
  isArrayEqual
} from '../../utils/util'
import moment from 'moment'
import {
  MESSAGE_DURATION_TIME,
  FLOWS,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_FLOWS_FLOW_CREATE
} from '../../globalset/js/constant'
import {
  saveProcessTemplate,
  getTemplateInfo,
  createProcess
} from '../../services/technological/workFlow'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { currentNounPlanFilterName } from '@/utils/businessFunction'
import {
  checkIsHasPermissionInBoard,
  setBoardIdStorage,
  getGlobalData,
  isPaymentOrgUser,
  getOrgIdByBoardId
} from '../../utils/businessFunction'
import {
  cursorMoveEnd,
  whetherIsHasMembersInEveryNodes
} from './components/handleOperateModal'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import ProcessFile from './ProcessFile'
// import { lx_utils } from 'lingxi-im'
const lx_utils = undefined

@connect(mapStateToProps)
export default class MainContent extends Component {
  constructor(props) {
    super(props)
    this.initCanvas = this.initCanvas.bind(this)
    this.resizeTTY = this.resizeTTY.bind(this)
    this.state = {
      clientHeight: document.documentElement.clientHeight,
      clientWidth: document.documentElement.clientWidth,
      currentFlowInstanceName: props.currentFlowInstanceName
        ? props.currentFlowInstanceName
        : '', // ???????????????????????????
      currentFlowInstanceDescription: '', // ???????????????????????????
      isEditCurrentFlowInstanceName: true, // ???????????????????????????????????????
      isEditCurrentFlowInstanceDescription: false // ???????????????????????????????????????
    }
    this.timer = null
  }

  linkImWithFlow = data => {
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { is_simple_model } = user_set
    if (!data) {
      lx_utils && lx_utils.setCommentData(null)
      return false
    }
    lx_utils && lx_utils.setCommentData({ ...data })
    if (is_simple_model == '1') {
      this.props.dispatch({
        type: 'simplemode/updateDatas',
        payload: {
          chatImVisiable: true
        }
      })
    }
  }

  // ??????????????????
  handleDynamicComment = e => {
    e && e.stopPropagation()
    const {
      processInfo: { id, name, board_id }
    } = this.props
    this.linkImWithFlow({
      name: name,
      type: 'flow',
      board_id: board_id,
      id: id
    })
  }

  // ???????????????????????????????????????(???????????????????????????????????????) PS: ?????????????????????????????????????????????????????????
  handleAnchorPointElement = () => {
    let scrollElement = document.getElementById('container_configureProcessOut')
    let currentDoingDataCollectionItem = document.getElementById(
      'currentDataCollectionItem'
    )
    let currentDoingApproveItem = document.getElementById(
      'currentStaticApproveContainer'
    )
    let currentStaticRatingScoreItem = document.getElementById(
      'currentStaticRatingScoreContainer'
    )
    // ????????????????????????????????????
    if (currentDoingDataCollectionItem) {
      if (scrollElement.scrollTo) {
        scrollElement.scrollTo({
          top: currentDoingDataCollectionItem.offsetTop - 68,
          behavior: 'smooth'
        })
      }
    }
    // ?????????????????????????????? 500???????????????
    if (currentDoingApproveItem) {
      if (scrollElement.scrollTo) {
        scrollElement.scrollTo({
          top: currentDoingApproveItem.offsetTop - 500,
          behavior: 'smooth'
        })
      }
    }
    // ????????????????????????????????? 300???????????????
    if (currentStaticRatingScoreItem) {
      if (scrollElement.scrollTo) {
        scrollElement.scrollTo({
          top: currentStaticRatingScoreItem.offsetTop - 300,
          behavior: 'smooth'
        })
      }
    }
  }

  // ??????????????????????????????model true ??????????????????
  whetherIsUpdateDatasFromStorageToModel = props => {
    let flag = true
    const { processInfo = {} } = props
    const { status } = processInfo
    const pro_info = localStorage.getItem('userProcessWithNodesStatusStorage')
      ? JSON.parse(localStorage.getItem('userProcessWithNodesStatusStorage'))
      : {}
    if (!(pro_info && Object.keys(pro_info).length)) {
      flag = false
      return flag
    } else {
      // ???????????? ?????????|??????????????????????????????????????????????????????????????????
      let curr_need_storage_node =
        (processInfo['nodes'] &&
          processInfo['nodes'].length &&
          processInfo['nodes'].find(
            i =>
              (status == '1' || status == '2') &&
              i.status == '1' &&
              i.node_type == '1'
          )) ||
        {}
      if (curr_need_storage_node.id == pro_info['nodes'][0].id) {
        // ????????????????????????????????????????????? ??????????????????????????????????????????
        flag = true
      } else {
        flag = false
      }
      return flag
    }
    return flag
  }

  // ?????????????????????????????????????????????
  setUserProcessWithNodesStorage = props => {
    const { processInfo = {} } = props
    if (!Object.keys(processInfo).length) return
    const { id: user_id } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { id, status } = processInfo
    // ???????????????????????????????????????????????????model????????????
    if (this.whetherIsUpdateDatasFromStorageToModel(props)) {
      // ????????????model????????????
      const pro_info = localStorage.getItem('userProcessWithNodesStatusStorage')
        ? JSON.parse(localStorage.getItem('userProcessWithNodesStatusStorage'))
        : {}
      const { nodes = [], user_id: USER_ID } = pro_info
      if (user_id == USER_ID) {
        // ????????????????????? ?????????
        let nodesData = [...processInfo['nodes']]
        nodesData = nodesData.map(item => {
          if (item.id == nodes[0].id) {
            let new_item = { ...item, forms: nodes[0]['forms'] }
            return new_item
          } else {
            if (item.status == '2') {
              let new_item = { ...item, is_confirm: '1' }
              return new_item
            } else {
              return item
            }
          }
        })
        this.props.dispatch({
          type: 'publicProcessDetailModal/updateDatas',
          payload: {
            processInfo: { ...processInfo, nodes: nodesData },
            processEditDatas: nodesData
          }
        })
      }
      return
    } else {
      // ????????????
      let curr_need_storage_node =
        (processInfo['nodes'] &&
          !!processInfo['nodes'].length &&
          processInfo['nodes'].find(
            i =>
              (status == '1' || status == '2') &&
              i.status == '1' &&
              i.node_type == '1'
          )) ||
        {}
      // ????????????????????????????????? ???????????????????????????????????? ?????????????????????????????????
      if (
        !(curr_need_storage_node && Object.keys(curr_need_storage_node).length)
      ) {
        let info = localStorage.getItem('userProcessWithNodesStatusStorage')
          ? JSON.parse(
              localStorage.getItem('userProcessWithNodesStatusStorage')
            )
          : {}
        if (info && Object.keys(info).length) {
          localStorage.removeItem('userProcessWithNodesStatusStorage')
        }
        return
      }
      curr_need_storage_node.his_comments
        ? delete curr_need_storage_node.his_comments
        : ''
      curr_need_storage_node.complete_time
        ? delete curr_need_storage_node.complete_time
        : ''
      let obj = {
        id,
        status,
        nodes: [curr_need_storage_node],
        user_id
      }
      localStorage.setItem(
        'userProcessWithNodesStatusStorage',
        JSON.stringify(obj)
      )
    }
  }
  // ??????????????????
  updateUserProcessWithNodesStorage = props => {
    // ??????????????????????????????????????????????????????????????????????????????
    const {
      processInfo = {},
      processInfo: { id, status }
    } = props
    const { id: user_id } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    let next_props_forms_data =
      (processInfo['nodes'] &&
        processInfo['nodes'].length &&
        processInfo['nodes'].find(
          i =>
            (status == '1' || status == '2') &&
            i.status == '1' &&
            i.node_type == '1'
        )) ||
      {}
    next_props_forms_data.his_comments
      ? delete next_props_forms_data.his_comments
      : ''
    next_props_forms_data.complete_time
      ? delete next_props_forms_data.complete_time
      : ''
    if (!this.whetherIsUpdateDatasFromStorageToModel(props)) {
      let obj = {
        id,
        status,
        nodes: [next_props_forms_data],
        user_id
      }
      localStorage.setItem(
        'userProcessWithNodesStatusStorage',
        JSON.stringify(obj)
      )
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
    window.addEventListener('scroll', this.onScroll)
    // ?????????????????????--???????????????????????????????????????
    this.handleAnchorPointElement()
    const { processPageFlagStep } = this.props
    // ???????????? ?????????????????????????????????????????? ??????????????????????????????????????????,??????????????????????????????
    if (processPageFlagStep == '1' || processPageFlagStep == '2') {
      this.props.dispatch({
        type: 'publicProcessDetailModal/configurePorcessGuide',
        payload: {
          flow_template_node: '',
          flow_template_form: ''
        }
      })
    }
    // ???????????????
    this.initCanvas(this.props)
    // ????????????????????????????????????
    this.whetherUpdateOrgnazationMemberList(this.props)
    // ??????????????????????????????
    this.setUserProcessWithNodesStorage(this.props)
    // ??????????????????
    this.getDesignatedRoles(this.props)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
    window.removeEventListener('scroll', this.onScroll)
  }
  resizeTTY = () => {
    const clientHeight = document.documentElement.clientHeight //????????????????????????
    const clientWidth = document.documentElement.clientWidth
    this.setState({
      clientHeight,
      clientWidth
    })
  }
  // ???????????????????????????????????????(???????????????????????????)
  whetherUpdateOrgnazationMemberList = props => {
    const {
      templateInfo: { org_id },
      processInfo: { status, board_id }
    } = props

    if (props.process_detail_modal_visible) {
      // localStorage.getItem('OrganizationId')
      if (props.processPageFlagStep == '3') {
        // ???????????????
        this.props.dispatch({
          type: 'publicProcessDetailModal/getCurrentOrgAllMembers',
          payload: {
            _organization_id: org_id
          }
        })
      } else {
        // ?????????????????????????????????????????????????????? (???????????????)
        if (props.processPageFlagStep == '4' && status != '0') return
        const ORG_ID = getOrgIdByBoardId(board_id)
        this.props.dispatch({
          type: 'publicProcessDetailModal/getCurrentOrgAllMembers',
          payload: {
            _organization_id: ORG_ID || localStorage.getItem('OrganizationId')
          }
        })
      }
    }
  }

  /**
   * ??????????????????
   * @param {*} props
   * ?????????????????? ???????????????????????????????????????
   */
  getDesignatedRoles = props => {
    const {
      processInfo: { board_id, status },
      templateInfo: { org_id },
      processPageFlagStep
    } = props
    // if (
    //   processPageFlagStep != '3' ||
    //   (processPageFlagStep != '4' && status != '0')
    // )
    //   return
    const ORG_ID = org_id ? org_id : getOrgIdByBoardId(board_id)
    props.dispatch({
      type: 'publicProcessDetailModal/getDesignatedRoles',
      payload: {
        _organization_id: ORG_ID
      }
    })
  }

  // ????????????canvas????????????
  componentWillReceiveProps(nextProps) {
    const {
      processInfo: { curr_node_sort },
      processPageFlagStep
    } = nextProps
    const {
      processInfo: { curr_node_sort: old_curr_node_sort },
      processPageFlagStep: old_processPageFlagStep
    } = this.props
    if (old_curr_node_sort && curr_node_sort) {
      if (curr_node_sort != old_curr_node_sort) {
        setTimeout(() => {
          this.initCanvas(nextProps)
        }, 50)
      }
    }
    // ??????????????????
    if (processPageFlagStep == '4') {
      this.updateUserProcessWithNodesStorage(nextProps)
    }
    // ??????????????????????????? ??????????????????????????????????????????
    if (old_processPageFlagStep == '4' && processPageFlagStep == '3') {
      this.whetherUpdateOrgnazationMemberList(nextProps)
      this.getDesignatedRoles(nextProps)
    }
  }

  initCanvas(props) {
    const { processInfo = {}, processEditDatas = [] } = props
    const { curr_node_sort, status: parentStatus } = processInfo
    const defaultProps = {
      canvaswidth: 140, // ????????????
      canvasheight: 140, // ????????????
      x0: 102,
      y0: 103,
      r: 69,
      lineWidth: 8,
      strokeStyle: '#ffffff',
      LinearGradientColor1: '#3EECED',
      LinearGradientColor2: '#499BE6'
    }
    const {
      x0, //????????????
      y0,
      r, // ??????
      lineWidth // ????????????
    } = defaultProps
    // let ele = document.getElementById("time_graph_canvas")
    let e = document.querySelectorAll('#time_graph_canvas')
    let ele = e[e.length - 1]
    if (!ele) return
    let circle = ele.getContext('2d')
    circle.clearRect(0, 0, 210, 210) //??????
    //??????????????????
    const length = processEditDatas.length
    // ????????????????????????????????????????????????
    if (length == '0') {
      circle.beginPath() //????????????????????????
      //????????????Canvas????????????save?????????????????????Canvas????????????????????????????????????????????????????????? restore???????????????Canvas??????????????????????????????save??????Canvas??????????????????????????????????????????
      circle.save()
      circle.lineWidth = lineWidth
      let color = 'rgba(0,0,0,0.04)'
      circle.strokeStyle = color //curr_node_sort
      circle.arc(
        x0,
        y0,
        r,
        0.6 * Math.PI,
        0.6 * Math.PI + 1.83 * Math.PI,
        false
      )
      circle.stroke() //???????????????????????????
      circle.restore()
      circle.closePath()
    } else {
      for (let i = 0; i < length; i++) {
        circle.beginPath() //????????????????????????
        circle.save()
        circle.lineWidth = lineWidth
        let color = 'rgba(0,0,0,0.04)'
        // if (Number(curr_node_sort) === Number(processEditDatas[i].sort)) {
        //   color = 'rgba(0,0,0,0.04)'
        // } else if (Number(processEditDatas[i].sort) < Number(curr_node_sort)) {
        //   color = 'rgba(24,144,255,1)' // ??????
        // } else if (Number(processEditDatas[i].sort) > Number(curr_node_sort)) {
        //   color = 'rgba(0,0,0,0.04)'
        // }
        if (parentStatus == '2') {
          // ???????????????
          if (processEditDatas[i].status == '2') {
            // ????????????
            color = 'rgba(0,0,0,0.25)'
          } else if (processEditDatas[i].status == '1') {
            // ???????????????
            color = 'rgba(0,0,0,0.04)'
          } else if (processEditDatas[i].status == '0') {
            // ???????????????
            color = 'rgba(0,0,0,0.04)'
          }
        } else if (parentStatus == '0') {
          // ???????????????
          color = 'rgba(0,0,0,0.04)'
        } else {
          if (processEditDatas[i].status == '2') {
            // ????????????
            color = 'rgba(24,144,255,1)' // ??????
          } else if (processEditDatas[i].status == '1') {
            // ???????????????
            color = 'rgba(0,0,0,0.04)'
          } else if (processEditDatas[i].status == '0') {
            // ???????????????
            color = 'rgba(0,0,0,0.04)'
          }
        }
        circle.strokeStyle = color //curr_node_sort
        circle.arc(
          x0,
          y0,
          r,
          0.6 * Math.PI + ((i * 1.83) / length) * Math.PI,
          0.6 * Math.PI +
            ((i * 1.83) / length) * Math.PI +
            (1.83 / length) * Math.PI -
            0.03 * Math.PI,
          false
        ) ///??????????????????context.arc(x?????????y?????????????????????????????????????????????????????????/?????????)
        circle.stroke() //???????????????????????????
        circle.restore()
        circle.closePath()
      }
    }
  }

  // ???????????? --- ?????????????????????????????? ???????????????
  onScroll = e => {
    let scrollTop = document.getElementById('container_configureProcessOut')
      .scrollTop
    let ele = document.getElementById('suspensionFlowInstansNav')

    const { processPageFlagStep } = this.props
    if (processPageFlagStep == '4') {
      // let dynamic_ele = document.getElementById('dynamic_comment')
      // dynamic_ele.style.bottom = 40 - scrollTop + 'px'
    }
    // -------------------- ??????????????????????????????  ----------------------------
    // ?????????????????????????????????

    // -------------------- ????????????????????????  ----------------------------
    // ????????????????????????????????????
    // let currentAbsoluteApproveElement = document.getElementById('currentAbsoluteApproveContainer')
    // // ?????????????????????????????????????????????
    // let currentStaticApproveElement = document.getElementById('currentStaticApproveContainer')

    // // ???????????????????????????
    // if (currentAbsoluteApproveElement && currentStaticApproveElement) {

    //   /**
    //    * ????????????????????????
    //    * 1.???????????????????????????????????????(currentAbsoluteApproveElement)???offsetTop
    //    * 2.??????????????????????????? scrollTop  0 ???
    //    * 3.????????????????????????????????????currentStaticApproveElement?????? offsetTop
    //    * 4.????????????????????????????????????scrollTop???+ currentAbsoluteApproveElement???top??? ???????????? currentStaticApproveElement???offsetTop???????????????????????????????????????
    //    */
    //   if (scrollTop + 478 >= currentStaticApproveElement.offsetTop) {
    //     currentAbsoluteApproveElement.style.display = 'none'
    //     currentAbsoluteApproveElement.style.top = 478 + 'px'
    //   } else {
    //     currentAbsoluteApproveElement.style.top = scrollTop + 478 + 'px'
    //     currentAbsoluteApproveElement.style.display = 'flex'
    //   }
    // }

    if (scrollTop >= 200) {
      ele.style.display = 'block'
      ele.style.position = 'absolute'
      ele.style.top = scrollTop + 'px'
      ele.style.zIndex = 5
    } else {
      ele.style.display = 'none'
    }
  }

  // ????????????
  handleBackToTop = e => {
    e && e.stopPropagation()
    this.timer = setInterval(() => {
      let speedTop = 50
      let currentTop = document.getElementById('container_configureProcessOut')
        .scrollTop
      document.getElementById('container_configureProcessOut').scrollTop =
        currentTop - speedTop
      if (currentTop == 0) {
        clearInterval(this.timer)
      }
    }, 30)
  }

  // ????????????????????????|??????
  updateFlowInstanceNameOrDescription = (data, key) => {
    const { value } = data
    const { currentSelectType } = this.state
    const {
      dispatch,
      processInfo = {},
      processDoingList = [],
      processNotBeginningList = [],
      currentFlowTabsStatus,
      currentFlowListType,
      request_flows_params = {}
    } = this.props
    if (currentSelectType == '2') {
      const {
        processInfo: { id, board_id }
      } = this.props
      let BOARD_ID =
        (request_flows_params && request_flows_params.request_board_id) ||
        board_id
      // let newProcessDoingList = [...processDoingList]
      // let newProcessNotBeginningList = [...processNotBeginningList]
      // let currentListItemPosition =
      //   currentFlowTabsStatus == '1'
      //     ? newProcessDoingList.findIndex(item => item.id == id)
      //     : currentFlowTabsStatus == '0'
      //     ? newProcessNotBeginningList.findIndex(item => item.id == id)
      //     : ''
      let obj = {
        id
      }
      obj[key] = value
      dispatch({
        type: 'publicProcessDetailModal/updateFlowInstanceNameOrDescription',
        payload: {
          ...obj
        }
      }).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success('????????????', MESSAGE_DURATION_TIME)
            this.setState({
              currentSelectType: ''
            })
          }, 200)
          processInfo[key] = value
          this.props.handleProcessDetailChange &&
            this.props.handleProcessDetailChange({
              flow_instance_id: id,
              parentStatus: true,
              name: 'name',
              value: value
            })
          dispatch({
            type: 'publicProcessDetailModal/getProcessListByType',
            payload: {
              board_id: BOARD_ID,
              // status: currentFlowTabsStatus || '1',
              type: currentFlowListType || 'process',
              _organization_id:
                request_flows_params._organization_id ||
                localStorage.getItem('OrganizationId')
            }
          })
          /**
           * ??????????????????????????????????????????????????????????????????
           * ????????????????????? ?????????|?????????...????????? ???????????????????????????
           */
          // if (
          //   currentFlowTabsStatus == '1' &&
          //   currentListItemPosition &&
          //   currentListItemPosition != -1
          // ) {
          //   newProcessDoingList[currentListItemPosition]['name'] = value
          //   dispatch({
          //     type: 'publicProcessDetailModal/updateDatas',
          //     payload: {
          //       processDoingList: newProcessDoingList
          //     }
          //   })
          // } else if (
          //   currentFlowTabsStatus == '0' &&
          //   currentListItemPosition &&
          //   currentListItemPosition != -1
          // ) {
          //   newProcessNotBeginningList[currentListItemPosition]['name'] = value
          //   dispatch({
          //     type: 'publicProcessDetailModal/updateDatas',
          //     payload: {
          //       processNotBeginningList: newProcessNotBeginningList
          //     }
          //   })
          // }
        }
      })
    }
  }

  // ??????change??????
  titleInputValueChange = e => {
    e && e.stopPropagation()
    if (e.target.value.trimLR() == '') {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          currentFlowInstanceName: ''
        }
      })
      return
    }
  }

  // ????????????????????????
  titleTextAreaChangeBlur = async e => {
    e && e.stopPropagation()
    let val = e.target.value.trimLR()
    const { processInfo = {} } = this.props
    // const { request_flows_params = {}, projectDetailInfoData: { board_id, org_id }, currentFlowTabsStatus } = this.props
    // let BOARD_ID = request_flows_params && request_flows_params.request_board_id || board_id
    if (val == '' || val == ' ' || !val) {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          currentFlowInstanceName:
            processInfo && Object.keys(processInfo).length
              ? processInfo.name
              : ''
        }
      })
      return
    }
    // console.log('?????????','sssssssssssssssssss_????????????', this.props.isEditCurrentFlowInstanceName)
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceName: false,
        currentFlowInstanceName: val
      }
    })
    if (val == this.props.processInfo.name) return
    await this.updateFlowInstanceNameOrDescription({ value: val }, 'name')
    // await this.props.dispatch({
    //   type: 'publicProcessDetailModal/getProcessListByType',
    //   payload: {
    //     status: currentFlowTabsStatus,
    //     board_id: BOARD_ID,
    //     _organization_id: request_flows_params._organization_id || org_id
    //   }
    // })
  }
  // ????????????
  handleChangeFlowInstanceName = (e, type) => {
    e && e.stopPropagation()
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceName: true
      }
    })
    // console.log('?????????','sssssssssssssssssss_????????????', this.props.isEditCurrentFlowInstanceName)
    if (type == '2') {
      this.setState({
        currentSelectType: type
      })
    }
  }

  /**
   * ??????????????????
   * @param {Object} e ????????????
   * @param {String} type ???????????? 2??????????????????????????????
   */
  handleChangeFlowInstanceDescription = (e, type) => {
    e && e.stopPropagation()
    // this.setState({
    //   isEditCurrentFlowInstanceDescription: true
    // })
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceDescription: true
      }
    })
    setTimeout(() => {
      let obj = document.getElementById('flowInstanceDescriptionTextArea') || ''
      cursorMoveEnd(obj)
    })
    if (type == '2') {
      this.setState({
        currentSelectType: type
      })
    }
  }

  descriptionTextAreaChange = e => {
    e && e.stopPropagation()
    let val = e.target.value.trimLR()
    if (val == '' || val == ' ' || !val) {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          currentFlowInstanceDescription: ''
        }
      })
      return
    }
  }

  // ????????????????????????
  descriptionTextAreaChangeBlur = e => {
    e && e.stopPropagation()
    let val = e.target.value.trimLR()
    if (val == '' || val == ' ' || !val) {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          isEditCurrentFlowInstanceDescription: false,
          currentFlowInstanceDescription: ''
        }
      })
      if (val == this.props.processInfo.description) return
      this.updateFlowInstanceNameOrDescription({ value: '' }, 'description')
      return
    } else {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          isEditCurrentFlowInstanceDescription: false,
          currentFlowInstanceDescription: val
        }
      })
      if (val == this.props.processInfo.description) return
      this.updateFlowInstanceNameOrDescription({ value: val }, 'description')
    }
  }

  // ????????????
  handleAddEditStep = e => {
    e && e.stopPropagation()
    let that = this
    const {
      processEditDatas = [],
      dispatch,
      not_show_create_node_guide
    } = this.props
    const nodeObj = JSON.parse(JSON.stringify(processEditDatasItemOneConstant))
    processEditDatas.length == '0'
      ? processEditDatas.push(nodeObj)
      : processEditDatas.push({ name: '' })
    // processEditDatas.push(nodeObj)
    new Promise(resolve => {
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          node_type: '6'
        }
      })
      resolve()
    }).then(res => {
      //????????????
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          // processEditDatasRecords,
          processEditDatas,
          processCurrentEditStep: (
            Number(processEditDatas.length) - 1
          ).toString(),
          node_type: '1'
        }
      })
      // ????????????
      if (not_show_create_node_guide != '1') {
        dispatch({
          type: 'publicProcessDetailModal/configurePorcessGuide',
          payload: {
            flow_template_node: '1'
          }
        })
      }
    })
  }
  // ???????????????????????????
  handleSaveProcessTemplate = e => {
    e && e.stopPropagation()
    const { processPageFlagStep } = this.props
    if (this.state.isSaveTempleteIng) {
      message.warn('?????????????????????...')
      return
    }
    this.setState({
      isSaveTempleteIng: true
    })
    switch (processPageFlagStep) {
      case '1': // ?????????????????????????????????????????????
        this.handleSaveConfigureProcessTemplete()
        break
      case '2': // ????????????????????????????????????
        this.handleSaveEditProcessTemplete()
        break
      default:
        break
    }
  }

  // ????????????????????????????????????
  handleSaveConfigureProcessTemplete = () => {
    // const { currentFlowInstanceName } = this.state
    const {
      dispatch,
      projectDetailInfoData: { board_id },
      currentFlowInstanceName,
      currentFlowInstanceDescription,
      processEditDatas = [],
      templateInfo: { enable_change }
    } = this.props
    Promise.resolve(
      dispatch({
        type: 'publicProcessDetailModal/saveProcessTemplate',
        payload: {
          // board_id,
          name: currentFlowInstanceName,
          description: currentFlowInstanceDescription,
          nodes: processEditDatas,
          enable_change: enable_change
        }
      })
    ).then(res => {
      if (isApiResponseOk(res)) {
        setTimeout(() => {
          message.success('??????????????????', MESSAGE_DURATION_TIME)
        }, 200)
        this.props.updateParentProcessTempleteList &&
          this.props.updateParentProcessTempleteList()
        this.setState({
          isSaveTempleteIng: false
        })
        this.props.onCancel && this.props.onCancel()
      } else {
        this.setState({
          isSaveTempleteIng: false
        })
      }
    })
  }

  // ?????????????????????????????? ==> ????????????????????????
  handleSaveEditProcessTemplete = () => {
    // const { currentFlowInstanceName } = this.state
    const {
      dispatch,
      currentTempleteIdentifyId,
      projectDetailInfoData: { board_id },
      currentFlowInstanceName,
      currentFlowInstanceDescription,
      processEditDatas = [],
      templateInfo: { id, is_covert_template, enable_change }
    } = this.props
    // is_covert_template ???????????????????????? ??????????????????
    if (is_covert_template && is_covert_template == '1') {
      this.handleSaveConfigureProcessTemplete()
    } else {
      Promise.resolve(
        dispatch({
          type: 'publicProcessDetailModal/saveEditProcessTemplete',
          payload: {
            // board_id,
            name: currentFlowInstanceName,
            description: currentFlowInstanceDescription,
            nodes: processEditDatas,
            template_no: currentTempleteIdentifyId,
            enable_change: enable_change
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success(`??????????????????`, MESSAGE_DURATION_TIME)
          }, 200)
          this.props.updateParentProcessTempleteList &&
            this.props.updateParentProcessTempleteList()
          this.setState({
            isSaveTempleteIng: false
          })
          this.props.onCancel && this.props.onCancel()
        } else {
          this.setState({
            isSaveTempleteIng: false
          })
        }
      })
    }
  }

  // ???????????????????????????
  //????????????????????????---??????????????????????????? (??????????????????)
  handleOperateConfigureConfirmCalbackProcess = async start_time => {
    this.handleOperateConfigureConfirmProcessOne(start_time)
      .then(({ id, temp_time }) =>
        this.handleOperateConfigureConfirmProcessTwo({ id, temp_time })
      )
      .then(({ payload, temp_time2 }) =>
        this.handleOperateConfigureConfirmProcessThree({ payload, temp_time2 })
      )
  }
  // ?????????: ??????????????? ==> ????????????ID
  handleOperateConfigureConfirmProcessOne = async start_time => {
    // const { currentFlowInstanceName } = this.state
    const {
      projectDetailInfoData: { board_id },
      currentFlowInstanceName,
      currentFlowInstanceDescription,
      processEditDatas = [],
      request_flows_params = {},
      templateInfo: { enable_change }
    } = this.props
    let res = await saveProcessTemplate({
      name: currentFlowInstanceName,
      description: currentFlowInstanceDescription,
      nodes: processEditDatas,
      is_retain: '0',
      enable_change: enable_change
    })
    if (!isApiResponseOk(res)) {
      setTimeout(() => {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }, 500)
      this.setState({
        isCreateProcessIng: false
      })
      return Promise.resolve([])
    }
    let id = res.data
    let temp_time = start_time
    return Promise.resolve({ id, temp_time })
  }
  // ?????????: ?????????????????? ==> ??????????????????????????????
  handleOperateConfigureConfirmProcessTwo = async ({ id, temp_time }) => {
    if (!id) return Promise.resolve([])
    let res = await getTemplateInfo({ id })
    if (!isApiResponseOk(res)) {
      setTimeout(() => {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }, 500)
      this.setState({
        isCreateProcessIng: false
      })
      return Promise.resolve([])
    }
    let payload = {
      name: res.data.name,
      description: res.data.description,
      nodes: res.data.nodes,
      start_up_type: temp_time ? '2' : '1',
      plan_start_time: temp_time ? temp_time : '',
      flow_template_id: res.data.id
    }
    let temp_time2 = temp_time
    return Promise.resolve({ payload, temp_time2 })
  }
  // ?????????: ??????????????????????????? ==> ??????
  handleOperateConfigureConfirmProcessThree = async ({
    payload,
    temp_time2
  }) => {
    if (!payload) return Promise.resolve([])
    const {
      request_flows_params = {},
      currentFlowListType,
      projectDetailInfoData: { board_id, org_id }
    } = this.props
    let BOARD_ID =
      (request_flows_params && request_flows_params.request_board_id) ||
      board_id
    let res = await createProcess(payload)
    if (!isApiResponseOk(res)) {
      setTimeout(() => {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }, 500)
      this.setState({
        isCreateProcessIng: false
      })
      return Promise.resolve([])
    }
    setTimeout(() => {
      message.success(`??????${currentNounPlanFilterName(FLOWS)}??????`)
    }, 200)
    this.setState({
      isCreateProcessIng: false
    })
    this.props.dispatch({
      type: 'publicProcessDetailModal/getProcessListByType',
      payload: {
        // status: temp_time2 ? '0' : '1',
        type: currentFlowListType,
        board_id: BOARD_ID || res.data.board_id,
        _organization_id: request_flows_params._organization_id || org_id
      }
    })
    this.props.onCancel && this.props.onCancel()
  }

  // ???????????????????????????????????????????????????
  handleOperateStartConfirmProcess = start_time => {
    let that = this
    // const { currentFlowInstanceName } = this.state
    const {
      dispatch,
      projectDetailInfoData: { board_id, org_id },
      currentFlowInstanceName,
      currentFlowInstanceDescription,
      processEditDatas = [],
      templateInfo: { id },
      request_flows_params = {},
      currentFlowListType
    } = this.props
    let BOARD_ID =
      (request_flows_params && request_flows_params.request_board_id) ||
      board_id
    let REAUEST_BOARD_ID =
      getGlobalData('storageCurrentOperateBoardId') || board_id
    Promise.resolve(
      dispatch({
        type: 'publicProcessDetailModal/createProcess',
        payload: {
          name: currentFlowInstanceName,
          description: currentFlowInstanceDescription,
          nodes: processEditDatas,
          start_up_type: start_time ? '2' : '1',
          plan_start_time: start_time ? start_time : '',
          flow_template_id: id,
          board_id:
            BOARD_ID != '0' && BOARD_ID != 'undefined'
              ? BOARD_ID
              : REAUEST_BOARD_ID
        }
      })
    ).then(res => {
      if (isApiResponseOk(res)) {
        that.setState({
          isCreateProcessIng: false
        })
        that.props.dispatch({
          type: 'publicProcessDetailModal/getProcessListByType',
          payload: {
            // status: start_time ? '0' : '1',
            type: currentFlowListType,
            board_id: BOARD_ID,
            _organization_id: request_flows_params._organization_id || org_id
          }
        })
        that.props.onCancel && that.props.onCancel()
      } else {
        that.setState({
          isCreateProcessIng: false
        })
      }
    })
  }

  // ????????????
  handleCreateProcess = (e, start_time) => {
    e && e.stopPropagation()
    const {
      projectDetailInfoData: { board_id },
      request_flows_params = {}
    } = this.props
    // setBoardIdStorage(board_id)
    let BOARD_ID = request_flows_params && request_flows_params.request_board_id
    // let REAUEST_BOARD_ID = getGlobalData('storageCurrentOperateBoardId')
    this.setState({
      isCreateProcessIng: true
    })
    if (
      !checkIsHasPermissionInBoard(
        PROJECT_FLOWS_FLOW_CREATE,
        BOARD_ID || board_id
      )
    ) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      this.setState({
        isCreateProcessIng: false
      })
      return
    }
    if (this.state.isCreateProcessIng) {
      message.warn('?????????????????????...')
      return
    }
    const { processPageFlagStep } = this.props
    switch (processPageFlagStep) {
      case '1': // ????????????????????????????????????????????? ????????????????????????--???????????????????????????????????????
        this.handleOperateConfigureConfirmCalbackProcess(start_time)
        break
      case '3': // ?????????????????????????????????????????????
        this.handleOperateStartConfirmProcess(start_time)
        break
      default:
        break
    }
  }

  // ??????????????????????????????
  handleProcessStartConfirmVisible = visible => {
    if (!visible) {
      const { startOpen } = this.state
      if (!startOpen) return
      this.setState({
        startOpen: false
      })
    }
  }

  // ??????????????????
  startDatePickerChange = timeString => {
    this.setState(
      {
        start_time: timeToTimestamp(timeString)
      },
      () => {
        this.handleStartOpenChange(false)
        this.handleCreateProcess('', timeToTimestamp(timeString))
      }
    )
  }
  // ??????????????????
  disabledStartTime = current => {
    return current && current < moment().endOf('day')
  }
  // ?????????????????????????????????????????????????????????
  handleStartOpenChange = open => {
    // this.setState({ endOpen: true });
    this.setState({
      startOpen: open
    })
  }

  handleStartDatePickerChange = timeString => {
    this.setState(
      {
        start_time: timeToTimestamp(timeString)
      },
      () => {
        this.handleStartOpenChange(true)
      }
    )
  }

  handleEnableChange = e => {
    e && e.stopPropagation()
    const { templateInfo = {} } = this.props
    let newInfo = JSON.parse(JSON.stringify(templateInfo || {}))
    newInfo['enable_change'] = newInfo['enable_change'] == '0' ? '1' : '0'
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        templateInfo: newInfo
      }
    })
  }

  // ????????????????????????
  renderAddProcessStep = () => {
    const {
      processCurrentEditStep,
      processEditDatas = [],
      not_show_create_node_guide
    } = this.props
    // let { is_edit } = processEditDatas && processEditDatas[processCurrentEditStep] || {}
    /**
     * ??????????????????????????????
     */
    let gold_item =
      (processEditDatas &&
        !!processEditDatas.length &&
        processEditDatas.find(item => item.is_edit == '0')) ||
      {}
    // ???????????????????????????????????? ???:?????? ???:?????????????????????????????? ???????????????????????? ?????????????????????????????????
    return (
      <div style={{ position: 'relative' }} id="addProcessStep">
        {processEditDatas && processEditDatas.length ? (
          gold_item && !Object.keys(gold_item).length ? (
            <div
              className={`${indexStyles.add_node}`}
              onClick={e => {
                this.handleAddEditStep(e)
              }}
            >
              <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
              {not_show_create_node_guide != '1' && <ConfigureGuide />}
            </div>
          ) : (
            <div id={'add_normal'}>
              {/* <Tooltip getPopupContainer={() => document.getElementById('add_normal')} placement="topLeft" title="??????????????????????????????"> */}
              <div
                title="??????????????????????????????"
                className={`${indexStyles.add_normal}`}
              >
                <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                {not_show_create_node_guide != '1' && <ConfigureGuide />}
              </div>
              {/* </Tooltip> */}
            </div>
          )
        ) : (
          <div
            className={`${indexStyles.add_node}`}
            onClick={e => {
              this.handleAddEditStep(e)
            }}
          >
            <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
            {not_show_create_node_guide != '1' && <ConfigureGuide />}
          </div>
        )}
      </div>
    )
  }

  // a little function to help us with reordering the result
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  onDragEnd = result => {
    const { source, destination } = result
    if (!destination) {
      return
    }
    const { processEditDatas = [] } = this.props
    let newPrcessEditDatas = [...processEditDatas]
    const property_item = newPrcessEditDatas.find(
      (item, index) => index == source.index
    )
    const target_property_item = newPrcessEditDatas.find(
      (item, index) => index == destination.index
    )
    newPrcessEditDatas = this.reorder(
      newPrcessEditDatas,
      source.index,
      destination.index
    )
    let flag = newPrcessEditDatas.find(
      (item, index) =>
        (item.node_type == '2' && index == '0') ||
        (item.node_type == '3' && index == '0')
    )
    if (flag && Object.keys(flag).length)
      return message.warn(
        '?????????????????????????????????????????????',
        MESSAGE_DURATION_TIME
      )
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: newPrcessEditDatas
      }
    })
  }

  getDragDropContext = () => {
    const { processEditDatas = [] } = this.props
    let messageValue = <div></div>
    messageValue = (
      <div>
        <DragDropContext
          getPopupContainer={triggerNode => triggerNode.parentNode}
          onDragEnd={this.onDragEnd}
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {processEditDatas.map((value, key) => {
                  return (
                    <Draggable
                      key={value.id || `${value.node_type}_${key}`}
                      index={key}
                      draggableId={value.id || `${value.node_type}_${key}`}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {this.renderDiffContentProcess(value, key)}
                        </div>
                      )}
                    </Draggable>
                  )
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
    return messageValue
  }

  // ?????????????????????????????? ????????? | ????????? | ????????? | ?????????
  renderDiffContentProcess = (value, key) => {
    const { processPageFlagStep } = this.props
    const { is_edit } = value
    let container = <div></div>
    switch (processPageFlagStep) {
      case '1': // ????????????????????????
        if (is_edit == '1') {
          container = <EditProcess itemKey={key} itemValue={value} />
        } else {
          container = <ConfigureProcess itemKey={key} itemValue={value} />
        }
        break
      case '2':
        if (is_edit == '1') {
          container = <EditProcess itemKey={key} itemValue={value} />
        } else {
          container = <ConfigureProcess itemKey={key} itemValue={value} />
        }
        break
      case '3':
        container = <ProcessStartConfirm itemKey={key} itemValue={value} />
        break
      case '4':
        container = (
          <BeginningProcess
            request_flows_params={this.props.request_flows_params}
            itemKey={key}
            itemValue={value}
            handleProcessDetailChange={this.props.handleProcessDetailChange}
          />
        )
        break
      default:
        break
    }
    return container
  }

  // ???????????????????????????????????????
  renderDiffStepStatus = () => {
    const {
      processInfo: { status }
    } = this.props
    let currentText = ''
    switch (status) {
      case '1':
        currentText = '??? ???'
        break
      case '2':
        currentText = '??? ??? ???'
        break
      case '3':
        currentText = '??? ??? ???'
        break
      case '0':
        currentText = '?????????'
        break
      default:
        break
    }
    return currentText
  }

  // ????????????????????????
  renderCurrentStepNumber = () => {
    const {
      processPageFlagStep,
      processInfo: { status, nodes = [] },
      processEditDatas = []
    } = this.props
    let gold_status = ''
    let totalStep = '' // ?????????
    let currentStep = '' // ?????????????????????
    let surplusStep = '' // ????????????
    switch (processPageFlagStep) {
      case '4': // ?????????????????????????????????
        switch (status) {
          case '1': // ???????????????;
          case '2': // ????????????
            gold_status =
              Number(nodes.findIndex(item => item.status == '1')) + 1
            currentStep = gold_status
            totalStep = nodes.length
            surplusStep =
              totalStep - Number(nodes.findIndex(item => item.status == '1'))
            break
          case '3': // ???????????????
            currentStep = nodes.length
            totalStep = nodes.length
            surplusStep = 0
            break
          case '0': // ???????????????
            gold_status =
              Number(nodes.findIndex(item => item.status == '0')) + 1
            currentStep = gold_status
            totalStep = nodes.length
            surplusStep =
              totalStep - Number(nodes.findIndex(item => item.status == '0'))
            break
          default:
            break
        }
        break
      case '1': // ?????????????????????
      case '2':
      case '3':
        currentStep =
          processEditDatas && processEditDatas.length
            ? processEditDatas.length
            : 0
        totalStep =
          processEditDatas && processEditDatas.length
            ? processEditDatas.length
            : 0
        break
      default:
        break
    }
    return { totalStep, currentStep, surplusStep }
  }

  // ??????????????????????????????
  renderProcessStartConfirm = () => {
    const {
      currentFlowInstanceName,
      processEditDatas = [],
      processPageFlagStep
    } = this.props
    // ????????????????????????????????? 1.?????????????????????????????? ==> 2. ????????????????????????????????????
    let saveTempleteDisabled = false
    let errText = ''
    if (
      currentFlowInstanceName == '' ||
      whetherIsHasMembersInEveryNodes(processEditDatas, processPageFlagStep)
    ) {
      saveTempleteDisabled = true
      errText = '?????????????????????????????????????????????????????????????????????'
    }
    return (
      <div
        style={{
          display: 'flex',
          height: '112px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Button
          style={{ marginRight: '34px', minWidth: '116px' }}
          disabled={saveTempleteDisabled}
          onClick={this.handleCreateProcess}
          type="primary"
          title={errText}
        >
          ????????????
        </Button>
        <div>
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              minWidth: '80px',
              lineHeight: '38px',
              width: '100%',
              display: 'inline-block',
              textAlign: 'center'
            }}
          >
            <Button
              disabled={saveTempleteDisabled}
              style={{ color: '#1890FF', width: '100%' }}
            >
              ??????????????????
            </Button>
            <DatePicker
              disabled={saveTempleteDisabled}
              disabledDate={this.disabledStartTime.bind(this)}
              onOk={this.startDatePickerChange.bind(this)}
              onChange={this.handleStartDatePickerChange.bind(this)}
              onOpenChange={this.handleStartOpenChange}
              open={this.state.startOpen}
              getPopupContainer={() =>
                document.getElementById('processStartConfirmContainer')
              }
              placeholder={'????????????'}
              format="YYYY/MM/DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              style={{
                opacity: 0,
                zIndex: 1,
                background: '#000000',
                position: 'absolute',
                left: 0,
                width: '100%'
              }}
            />
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { clientHeight } = this.state
    const {
      currentFlowInstanceDescription,
      currentFlowInstanceName,
      isEditCurrentFlowInstanceName,
      isEditCurrentFlowInstanceDescription,
      processEditDatas = [],
      processPageFlagStep,
      processInfo: { status, create_time, plan_start_time },
      templateInfo: { enable_change },
      is_show_board_file_area
    } = this.props
    let saveTempleteDisabled =
      currentFlowInstanceName == '' ||
      (processEditDatas &&
        processEditDatas.length &&
        processEditDatas.find(item => item.is_edit == '0')) ||
      (processEditDatas &&
        processEditDatas.length &&
        !processEditDatas[processEditDatas.length - 1].node_type) ||
      whetherIsHasMembersInEveryNodes(processEditDatas, processPageFlagStep)
        ? true
        : false
    return (
      <div
        id="container_configureProcessOut"
        className={`${indexStyles.configureProcessOut} ${globalStyles.global_vertical_scrollbar}`}
        style={{
          height: clientHeight - 100 - 54,
          overflowY: 'auto',
          position: 'relative',
          paddingBottom: is_show_board_file_area == '1' ? '272px' : '48px'
        }}
        onScroll={this.onScroll}
      >
        <div id="container_configureTop" className={indexStyles.configure_top}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <div>
              <canvas
                id="time_graph_canvas"
                width={210}
                height={210}
                style={{ float: 'left' }}
              ></canvas>
            </div>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                width: '210px',
                height: '210px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span
                className={globalStyles.authTheme}
                style={{
                  color: '#D9D9D9',
                  position: 'absolute',
                  top: 158,
                  left: 92,
                  fontSize: '14px'
                }}
              >
                &#xe605;
              </span>
              <span
                style={{
                  // position: 'absolute',
                  top: '70px',
                  left:
                    processEditDatas && processEditDatas.length > 10
                      ? '67px'
                      : '80px',
                  height: 17,
                  fontSize: 20,
                  fontFamily: 'PingFangSC-Regular',
                  fontWeight: 400,
                  color: 'rgba(140,140,140,1)',
                  lineHeight: '17px'
                }}
              >{`${this.renderCurrentStepNumber().currentStep} / ${
                this.renderCurrentStepNumber().totalStep
              }`}</span>
              <span
                style={{
                  // position: 'absolute',
                  top: '110px',
                  left:
                    processEditDatas && processEditDatas.length > 10
                      ? '67px'
                      : '76px',
                  height: 30,
                  fontSize: 14,
                  fontFamily: 'PingFangSC-Regular',
                  fontWeight: 400,
                  color: 'rgba(89,89,89,1)',
                  lineHeight: '30px',
                  marginTop: '12px'
                }}
              >
                {processPageFlagStep == '4'
                  ? this.renderDiffStepStatus()
                  : '??? ???'}{' '}
                {processPageFlagStep == '4'
                  ? status == '1'
                    ? `${this.renderCurrentStepNumber().surplusStep} ???`
                    : ''
                  : `${this.renderCurrentStepNumber().currentStep} ???`}
              </span>
            </div>
            <div
              style={{
                paddingTop: '32px',
                paddingRight: '32px',
                flex: 1,
                float: 'left',
                width: '977px',
                minHeight: '210px'
              }}
            >
              {/* ?????????????????? */}
              <div style={{ marginBottom: '12px' }}>
                {!isEditCurrentFlowInstanceName ? (
                  <div
                    onClick={
                      processPageFlagStep == '4'
                        ? ''
                        : e => {
                            this.handleChangeFlowInstanceName(e, '1')
                          }
                    }
                    className={`${
                      processPageFlagStep == '4'
                        ? indexStyles.normal_flow_name
                        : indexStyles.flow_name
                    }`}
                  >
                    <span style={{ wordBreak: 'break-all', flex: 1 }}>
                      {currentFlowInstanceName}
                      {processPageFlagStep == '4' && (
                        <span
                          onClick={
                            status == '1' || status == '0'
                              ? e => {
                                  this.handleChangeFlowInstanceName(e, '2')
                                }
                              : ''
                          }
                          style={{
                            color:
                              status == '1' || status == '0'
                                ? '#1890FF'
                                : '#D9D9D9',
                            cursor: 'pointer',
                            marginLeft: '10px'
                          }}
                          className={globalStyles.authTheme}
                        >
                          &#xe602;
                        </span>
                      )}
                    </span>
                    {processPageFlagStep == '4' && (
                      <span
                        style={{
                          flexShrink: 0,
                          color: 'rgba(0,0,0,0.45)',
                          fontSize: '14px'
                        }}
                      >
                        {status == '0'
                          ? plan_start_time
                            ? `${timestampToTimeNormal(
                                plan_start_time,
                                '/',
                                true
                              )}??????`
                            : '?????????????????????'
                          : `${timestampToTimeNormal(
                              create_time,
                              '/',
                              true
                            )}??????`}{' '}
                      </span>
                    )}
                  </div>
                ) : (
                  <NameChangeInput
                    autosize
                    onChange={this.titleInputValueChange}
                    // onBlur={this.titleTextAreaChangeBlur}
                    // onPressEnter={this.titleTextAreaChangeBlur}
                    onClick={e => e && e.stopPropagation()}
                    setIsEdit={this.titleTextAreaChangeBlur}
                    autoFocus={true}
                    goldName={currentFlowInstanceName}
                    placeholder={'????????????(??????)'}
                    maxLength={50}
                    nodeName={'input'}
                    style={{
                      display: 'block',
                      fontSize: 20,
                      color: '#262626',
                      resize: 'none',
                      minHeight: '44px',
                      background: 'rgba(255,255,255,1)',
                      boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      border: 'none'
                    }}
                  />
                )}
              </div>
              {/* ???????????? */}
              <div>
                {!isEditCurrentFlowInstanceDescription ? (
                  <div
                    className={
                      processPageFlagStep == '4'
                        ? indexStyles.normal_flow_description
                        : indexStyles.flow_description
                    }
                    onClick={
                      processPageFlagStep == '4'
                        ? ''
                        : e => {
                            this.handleChangeFlowInstanceDescription(e, '1')
                          }
                    }
                  >
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {currentFlowInstanceDescription != ''
                        ? currentFlowInstanceDescription
                        : '????????????'}
                      {processPageFlagStep == '4' && (
                        <span
                          onClick={
                            status == '1' || status == '0'
                              ? e => {
                                  this.handleChangeFlowInstanceDescription(
                                    e,
                                    '2'
                                  )
                                }
                              : ''
                          }
                          style={{
                            color:
                              status == '1' || status == '0'
                                ? '#1890FF'
                                : '#D9D9D9',
                            cursor: 'pointer',
                            marginLeft: '10px'
                          }}
                          className={globalStyles.authTheme}
                        >
                          &#xe602;
                        </span>
                      )}
                    </span>
                  </div>
                ) : (
                  <NameChangeInput
                    id={'flowInstanceDescriptionTextArea'}
                    onChange={this.descriptionTextAreaChange}
                    // onBlur={this.descriptionTextAreaChangeBlur}
                    setIsEdit={this.descriptionTextAreaChangeBlur}
                    autosize
                    autoFocus={true}
                    onFocus={this.onFocus}
                    onClick={e => e.stopPropagation()}
                    goldName={currentFlowInstanceDescription}
                    placeholder={'????????????'}
                    maxLength={500}
                    nodeName={'textarea'}
                    style={{
                      display: 'block',
                      fontSize: 14,
                      color: '#262626',
                      resize: 'none',
                      minHeight: '92px',
                      maxHeight: '92px',
                      height: '92px',
                      background: 'rgba(255,255,255,1)',
                      boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      border: 'none'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={indexStyles.configure_bottom}>
          {processPageFlagStep == '4' ||
          ((processPageFlagStep == '1' || processPageFlagStep == '2') &&
            processEditDatas &&
            processEditDatas.length &&
            processEditDatas.find(item => item.is_edit == '0')) ||
          processPageFlagStep == '3' ? (
            <>
              {processEditDatas.map((value, key) => {
                return <>{this.renderDiffContentProcess(value, key)}</>
              })}
            </>
          ) : (
            <>{this.getDragDropContext()}</>
          )}
          {/* {processEditDatas.map((value, key) => {
            return (
              <>{this.renderDiffContentProcess(value, key)}</>
            )
          })} */}
          {/* ???????????? */}
          {(processPageFlagStep == '1' || processPageFlagStep == '2') &&
            this.renderAddProcessStep()}
          {processEditDatas.length >= 2 && (
            <div
              id={'processStartConfirmContainer'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '32px',
                position: 'relative'
              }}
            >
              {processPageFlagStep == '3' && this.renderProcessStartConfirm()
              // <Popover
              //   trigger="click"
              //   title={null}
              //   onVisibleChange={this.handleProcessStartConfirmVisible}
              //   content={this.renderProcessStartConfirm()}
              //   icon={<></>}
              //   getPopupContainer={triggerNode => triggerNode.parentNode}
              // >
              //   <Button
              //     type={processPageFlagStep == '3' && 'primary'}
              //     disabled={saveTempleteDisabled}
              //     style={{
              //       marginRight: '24px',
              //       height: '40px',
              //       border: '1px solid rgba(24,144,255,1)',
              //       color: processPageFlagStep == '3' ? '#fff' : '#1890FF'
              //     }}
              //   >
              //     ??????{`${currentNounPlanFilterName(FLOWS)}`}
              //   </Button>
              // </Popover>
              }
              {(processPageFlagStep == '1' || processPageFlagStep == '2') && (
                <Button
                  onClick={this.handleSaveProcessTemplate}
                  disabled={saveTempleteDisabled}
                  type="primary"
                  style={{ height: '40px' }}
                  title={
                    saveTempleteDisabled &&
                    '?????????????????????????????????????????????????????????????????????'
                  }
                >
                  ????????????
                </Button>
              )}
            </div>
          )}
        </div>
        {(processPageFlagStep == '1' || processPageFlagStep == '2') &&
          processEditDatas.length >= 2 && (
            <div className={indexStyles.conclude_sign}>
              <Checkbox
                checked={enable_change == '0'}
                onChange={this.handleEnableChange}
              >
                ??????????????????????????????????????????????????????????????????
              </Checkbox>
            </div>
          )}
        {/* ?????? ????????????????????????*/}
        <div
          id="suspensionFlowInstansNav"
          className={`${indexStyles.suspensionFlowInstansNav}`}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginRight: '36px'
              }}
            >
              <span
                style={{
                  color: 'rgba(0,0,0,0.85)',
                  fontSize: '16px',
                  fontWeight: 500,
                  flex: 1,
                  flexShrink: 0
                }}
              >
                {currentFlowInstanceName} (
                {`${this.renderCurrentStepNumber().currentStep} / ${
                  this.renderCurrentStepNumber().totalStep
                }`}
                )
                {status == '2' && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '58px',
                      height: '28px',
                      background: '#F5F5F5',
                      marginLeft: '16px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      lineHeight: '28px',
                      fontSize: '14px',
                      color: 'rgba(0,0,0,0.25)'
                    }}
                  >
                    ?????????
                  </span>
                )}
              </span>
              {processPageFlagStep == '4' && (
                <span style={{ flexShrink: 0, color: 'rgba(0,0,0,0.45)' }}>
                  {status == '0'
                    ? plan_start_time
                      ? `${timestampToTimeNormal(
                          plan_start_time,
                          '/',
                          true
                        )}??????`
                      : '?????????????????????'
                    : `${timestampToTimeNormal(
                        create_time,
                        '/',
                        true
                      )}??????`}{' '}
                </span>
              )}
            </div>
            <div style={{ flexShrink: 0 }}>
              <span
                onClick={this.handleBackToTop}
                style={{ color: '#1890FF', cursor: 'pointer' }}
                className={globalStyles.authTheme}
              >
                &#xe63d; ????????????
              </span>
            </div>
          </div>
        </div>
        {/* {processPageFlagStep == '4' && (
          <div
            onClick={this.handleDynamicComment}
            id="dynamic_comment"
            className={indexStyles.dynamic_comment}
          >
            <Tooltip
              overlayStyle={{ minWidth: '72px' }}
              placement="top"
              title="????????????"
              getPopupContainer={() =>
                document.getElementById('dynamic_comment')
              }
            >
              <span className={globalStyles.authTheme}>&#xe8e8;</span>
            </Tooltip>
          </div>
        )} */}
        {processPageFlagStep == '4' && isPaymentOrgUser() && (
          <ProcessFile
            notburningProcessFile={this.props.notburningProcessFile}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    process_detail_modal_visible,
    currentFlowInstanceName,
    currentFlowInstanceDescription,
    currentTempleteIdentifyId,
    isEditCurrentFlowInstanceName,
    isEditCurrentFlowInstanceDescription,
    processPageFlagStep,
    processEditDatas = [],
    processInfo = {},
    processDoingList = [],
    processNotBeginningList = [],
    node_type,
    processCurrentEditStep,
    templateInfo = {},
    currentFlowTabsStatus,
    not_show_create_node_guide,
    currentFlowListType
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  technological: {
    datas: { userBoardPermissions = [] }
  },
  gantt: {
    datas: { is_show_board_file_area }
  }
}) {
  return {
    process_detail_modal_visible,
    currentFlowInstanceName,
    currentFlowInstanceDescription,
    currentTempleteIdentifyId,
    isEditCurrentFlowInstanceName,
    isEditCurrentFlowInstanceDescription,
    processPageFlagStep,
    processEditDatas,
    processInfo,
    processDoingList,
    processNotBeginningList,
    node_type,
    processCurrentEditStep,
    templateInfo,
    currentFlowTabsStatus,
    not_show_create_node_guide,
    projectDetailInfoData,
    userBoardPermissions,
    is_show_board_file_area,
    currentFlowListType
  }
}
