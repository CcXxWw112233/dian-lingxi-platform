import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, message, Dropdown, Menu, DatePicker, Modal, Tooltip, Button } from 'antd'
import mainContentStyles from './MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import InformRemind from '@/components/InformRemind'
import { timestampToTime, compareTwoTimestamp, timeToTimestamp, timestampToTimeNormal, isSamDay, timestampToTimeNormal3, timestampToTimeNormal4 } from '@/utils/util'
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_COMPLETE, PROJECT_TEAM_CARD_EDIT, PROJECT_FILES_FILE_INTERVIEW
} from "@/globalset/js/constant";
import { isApiResponseOk } from '@/utils/handleResponseData'
import { addTaskExecutor, removeTaskExecutor, deleteTaskFile, getBoardTagList } from '@/services/technological/task'
import {
  checkIsHasPermissionInBoard, checkIsHasPermissionInVisitControl, isPaymentOrgUser
} from "@/utils/businessFunction";
import { getFolderList } from '@/services/technological/file'
import { getMilestoneList } from '@/services/technological/prjectDetail'
import DragDropContentComponent from './DragDropContentComponent'
import FileListRightBarFileDetailModal from '@/routes/Technological/components/ProjectDetail/FileModule/FileListRightBarFileDetailModal';
import { arrayNonRepeatfy } from '@/utils/util'
const { LingxiIm, Im } = global.constants

@connect(mapStateToProps)
export default class MainContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      is_change_parent_time: false,
      is_edit_title: false, // 是否修改名称
      inputValue: ''
    }
  }

  linkImWithCard = (data) => {
    const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    const { is_simple_model } = user_set;
    if (!data) {
      global.constants.lx_utils && global.constants.lx_utils.setCommentData(null)
      return false
    }
    global.constants.lx_utils && global.constants.lx_utils.setCommentData({ ...data })
    if (is_simple_model == '1') {
      const width = document.body.scrollWidth;
      let workbenchBoxContentWapperModalStyle = { width: (width - 400) + 'px' }
      this.props.dispatch({
        type: 'simplemode/updateDatas',
        payload: {
          chatImVisiable: true,
          workbenchBoxContentWapperModalStyle
        }
      })
    }
  }

  handleDynamicComment = (e) => {
    e && e.stopPropagation()
    const { drawContent: { card_name, board_id, card_id } } = this.props
    this.linkImWithCard({ name: card_name, type: 'card', board_id: board_id, id: card_id })
  }

  //获取项目里文件夹列表
  getProjectFolderList = (board_id) => {
    getFolderList({ board_id }).then((res) => {
      if (isApiResponseOk(res)) {
        this.setState({
          boardFolderTreeData: res.data
        });
      } else {
        message.error(res.message)
      }
    })
  }

  //获取项目里程碑列表
  getMilestone = (id, callBackObject, milestoneId) => {
    getMilestoneList({ id }).then((res) => {
      if (isApiResponseOk(res)) {
        this.setState({
          milestoneList: res.data
        }, () => {
          callBackObject && callBackObject.callBackFun(res.data, callBackObject.param);
        });
      } else {
        message.error(res.message)
      }
    })
  }

  componentWillMount() {
    Promise.resolve(
      this.props.dispatch({
        type: 'publicTaskDetailModal/getCardAttributesList',
        payload: {
        }
      })
    ).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          propertiesList: res.data
        })
      }
    })
  }

  // 初始化过滤当前已经存在的字段
  filterCurrentExistenceField = (currentData) => {
    const { propertiesList = [] } = this.state
    let newCurrentData = { ...currentData }
    let newPropertiesList = [...propertiesList]
    newPropertiesList = newPropertiesList.filter((value, index) => {
      const gold_code = (newCurrentData['properties'].find(item => item.code === value.code) || {}).code
      if (value.code != gold_code) {
        return value
      }
    })
    this.setState({
      propertiesList: newPropertiesList
    })
  }

  getInitCardDetailDatas = (props) => {
    const { card_id, dispatch } = props
    if (!card_id) return false
    const that = this
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/getCardWithAttributesDetail',
        payload: {
          id: card_id
        }
      })
    ).then(res => {
      if (isApiResponseOk(res)) {
        if (checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW, res.data.board_id)) {
          this.getProjectFolderList(res.data.board_id)
        }
        this.getMilestone(res.data.board_id)
        this.filterCurrentExistenceField(res.data)// 初始化获取字段信息
        this.whetherUpdateParentTaskTime()
        // this.linkImWithCard({ name: res.data.card_name, type: 'card', board_id: res.data.board_id, id: res.data.card_id })
      } else {
        setTimeout(() => {
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawerVisible: false
            }
          })
          this.linkImWithCard(null)
        }, 500)
      }
    })
  }

  componentDidMount() {
    this.getInitCardDetailDatas(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { drawerVisible, card_id } = nextProps
    const { drawerVisible: oldDrawerVisible, card_id: old_card_id } = this.props
    if (card_id != old_card_id) {
      Promise.resolve(
        this.props.dispatch({
          type: 'publicTaskDetailModal/getCardAttributesList',
          payload: {
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          this.setState({
            propertiesList: res.data
          })
        }
      })
      setTimeout(() => {
        this.getInitCardDetailDatas(nextProps)
      }, 200)
    }
  }

  // 获取 currentDrawerContent 数据
  getCurrentDrawerContentPropsModelDatasExecutors = () => {
    const { drawContent: { properties = [] } } = this.props
    const pricipleInfo = properties.filter(item => item.code == 'EXECUTOR')[0]
    return pricipleInfo || {}
  }

  // 检测不同类型的权限控制类型的是否显示
  checkDiffCategoriesAuthoritiesIsVisible = (code) => {
    const { drawContent = {} } = this.props
    const { data } = this.getCurrentDrawerContentPropsModelDatasExecutors()

    const { privileges = [], board_id, is_privilege } = drawContent
    return {
      'visit_control_edit': function () {// 是否是有编辑权限
        return checkIsHasPermissionInVisitControl('edit', privileges, is_privilege, data ? data : [], checkIsHasPermissionInBoard(code, board_id))
      },
      'visit_control_comment': function () {
        return checkIsHasPermissionInVisitControl('comment', privileges, is_privilege, data ? data : [], checkIsHasPermissionInBoard(code, board_id))
      },
    }
  }

  // 更新一个私有变量开启文件弹窗
  updatePrivateVariablesWithOpenFile = () => {
    this.setState({
      whetherIsOpenFileVisible: !this.state.whetherIsOpenFileVisible
    })
  }

  // 更新drawContent中的数据以及调用父级列表更新数据
  updateDrawContentWithUpdateParentListDatas = ({ drawContent, card_id, name, value, operate_properties_code, rely_card_datas }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawContent
      }
    })
    if (name && value) {
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id, name, value, operate_properties_code, rely_card_datas })
    }
  }

  // 设置卡片是否完成 S
  setIsCheck = () => {
    const { drawContent = {}, } = this.props
    const { is_realize = '0', card_id, board_id } = drawContent
    if ((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_COMPLETE).visit_control_edit()) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1',
      board_id
    }
    const { dispatch } = this.props
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/completeTask',
        payload: {
          ...obj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      let new_drawContent = { ...drawContent }
      new_drawContent['is_realize'] = is_realize === '1' ? '0' : '1'
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'is_realize', value: is_realize === '1' ? '0' : '1' })
    })
  }
  // 设置卡片是否完成 E

  // 设置标题textarea区域修改 S
  setTitleEdit = (e, card_name) => {
    e && e.stopPropagation();
    if ((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit()) {
      return false
    }
    this.setState({
      is_edit_title: true,
      local_title_value: card_name,
      inputValue: card_name
    })
  }
  // 设置标题文本内容修改 E

  titleTextAreaChange = (e) => {
    let val = e.target.value
    let reStr = val.trim()
    this.setState({
      inputValue: reStr
    })
  }

  // 设置标题文本失去焦点回调 S
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value
    const { local_title_value } = this.state
    const { dispatch, drawContent = {} } = this.props
    const { card_id, board_id, card_name } = drawContent
    let reStr = val.trim()
    if (reStr == "" || reStr == " " || !reStr || val == local_title_value) {
      this.setState({
        is_edit_title: false
      })
      return
    }
    drawContent['card_name'] = reStr
    const updateObj = {
      card_id,
      card_name: val,
      name: val,
      board_id
    }

    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTaskVTwo',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      this.setState({
        is_edit_title: false
      })
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent,
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id, name: 'card_name', value: val })
    })
  }
  // 设置标题文本失去焦点回调 E

  // 设置是否完成状态的下拉回调 S
  handleFiledIsComplete = (e) => {
    const { dispatch, drawContent = {} } = this.props
    const { board_id, card_id, is_realize } = drawContent
    let temp_realize
    let new_drawContent = { ...drawContent }
    if (e.key == 'incomplete') { // 表示未完成
      temp_realize = '0'
      new_drawContent['is_realize'] = temp_realize
    } else if (e.key == 'complete' && is_realize != '1') { // 表示已完成
      temp_realize = '1'
      new_drawContent['is_realize'] = temp_realize
    }

    // 阻止重复点击
    if (!temp_realize) return false
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/completeTask',
        payload: {
          is_realize: temp_realize, card_id, board_id
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'is_realize', value: temp_realize })
    })
  }
  // 设置是否完成状态的下拉回调 E

  // 过滤那些需要更新的字段
  filterCurrentUpdateDatasField = (code, value) => {
    const { drawContent: { properties = [] } } = this.props
    let new_properties = [...properties]
    new_properties = new_properties.map(item => {
      if (item.code == code) {
        let new_item = item
        new_item = { ...item, data: value }
        return new_item
      } else {
        let new_item = item
        return new_item
      }
    })
    return new_properties
  }

  // 邀请他人参与回调 并设置为执行人
  inviteOthersToBoardCalback = ({ users }) => {
    const { dispatch, projectDetailInfoData = {}, drawContent = {} } = this.props
    const { board_id, data = [] } = projectDetailInfoData
    const { card_id } = drawContent
    const gold_data = (drawContent['properties'].find(item => item.code == 'EXECUTOR') || {}).data
    const calback = (res) => {
      const new_users = res.data
      const arr = new_users.filter(item => users.indexOf(item.user_id) != -1)
      const newExecutors = arrayNonRepeatfy([].concat(gold_data, arr), 'user_id')
      let new_drawContent = { ...drawContent }
      // new_drawContent['executors'] = newExecutors
      new_drawContent['properties'] = this.filterCurrentUpdateDatasField('EXECUTOR', newExecutors)
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'executors', value: newExecutors, operate_properties_code: 'EXECUTOR' })
    }
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id,
        calback
      }
    })
  }

  // 添加执行人的回调 S
  chirldrenTaskChargeChange = (dataInfo) => {
    const { drawContent = {}, projectDetailInfoData = {}, dispatch } = this.props
    const { card_id } = drawContent

    // 多个任务执行人
    const excutorData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newExecutors = []
    const { selectedKeys = [], type, key } = dataInfo
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < excutorData.length; j++) {
        if (selectedKeys[i] === excutorData[j]['user_id']) {
          newExecutors.push(excutorData[j])
        }
      }
    }
    let new_drawContent = { ...drawContent }
    // new_drawContent['executors'] = newExecutors
    new_drawContent['properties'] = this.filterCurrentUpdateDatasField('EXECUTOR', newExecutors)
    if (type == 'add') {
      addTaskExecutor({ card_id, executor: key }).then(res => {
        if (isApiResponseOk(res)) {
          message.success(`已成功设置执行人`, MESSAGE_DURATION_TIME)
          this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'executors', value: newExecutors, operate_properties_code: 'EXECUTOR' })
        } else {
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      })
    } else if (type == 'remove') {
      removeTaskExecutor({ card_id, executor: key }).then(res => {
        if (isApiResponseOk(res)) {
          message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
          this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'executors', value: newExecutors, operate_properties_code: 'EXECUTOR' })
        } else {
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      })
    }
  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { drawContent = {}, dispatch } = this.props
    const { card_id } = drawContent
    const { data } = this.getCurrentDrawerContentPropsModelDatasExecutors()
    let new_executors = [...data]
    let new_drawContent = { ...drawContent }
    new_executors.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        new_executors.splice(index, 1)
      }
    })
    new_drawContent['properties'] = this.filterCurrentUpdateDatasField('EXECUTOR', new_executors)
    removeTaskExecutor({ card_id, executor: shouldDeleteItem }).then(res => {
      if (isApiResponseOk(res)) {
        message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
        this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'executors', value: new_executors, operate_properties_code: 'EXECUTOR' })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    })
  }
  // 移除执行人的回调 E

  // 比较开始和结束时间
  compareStartDueTime = (start_time, due_time) => {
    if (!start_time || !due_time) {
      return true
    }
    const newStartTime = start_time.toString().length > 10 ? Number(start_time) / 1000 : Number(start_time)
    const newDueTime = due_time.toString().length > 10 ? Number(due_time) / 1000 : Number(due_time)
    if (newStartTime >= newDueTime) {
      return false
    }
    return true
  }

  // 禁用截止时间
  disabledDueTime = (due_time) => {
    const { drawContent = {} } = this.props
    const { start_time } = drawContent
    if (!start_time || !due_time) {
      return false;
    }
    const newStartTime = start_time.toString().length > 10 ? Number(start_time).valueOf() / 1000 : Number(start_time).valueOf()
    return Number(due_time.valueOf()) / 1000 < newStartTime;
  }

  // 禁用开始时间
  disabledStartTime = (start_time) => {
    const { drawContent = {} } = this.props
    const { due_time } = drawContent
    if (!start_time || !due_time) {
      return false;
    }
    const newDueTime = due_time.toString().length > 10 ? Number(due_time).valueOf() / 1000 : Number(due_time).valueOf()
    return Number(start_time.valueOf()) / 1000 >= newDueTime//Number(due_time).valueOf();
  }

  // 开始时间 chg事件 S
  startDatePickerChange(timeString) {
    const { drawContent = {}, dispatch } = this.props
    const nowTime = timeToTimestamp(new Date())
    const start_timeStamp = timeToTimestamp(timeString)
    const { card_id, due_time, board_id } = drawContent
    const { data = [] } = drawContent['properties'] && drawContent['properties'].filter(item => item.code == 'MILESTONE').length && drawContent['properties'].filter(item => item.code == 'MILESTONE')[0]
    const updateObj = {
      card_id, start_time: start_timeStamp,
      board_id
    }
    if (!this.compareStartDueTime(start_timeStamp, due_time)) {
      message.warn('开始时间不能大于结束时间')
      return false
    }
    if (!compareTwoTimestamp(data.deadline, start_timeStamp)) {
      message.warn('任务的开始时间不能大于关联里程碑的截止日期')
      return false
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['start_time'] = start_timeStamp
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTaskVTwo',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      if (!compareTwoTimestamp(start_timeStamp, nowTime)) {
        setTimeout(() => {
          message.warn(`您设置了一个今天之前的日期: ${timestampToTime(timeString, true)}`)
        }, 500)
      }
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'start_time', value: start_timeStamp, rely_card_datas: res.data })
    })
  }
  // 开始时间 chg事件 E

  // 截止时间 chg事件 S
  endDatePickerChange(timeString) {
    const { drawContent = {}, dispatch } = this.props
    const { card_id, start_time, milestone_data = {}, board_id } = drawContent
    const { data = [] } = drawContent['properties'] && drawContent['properties'].filter(item => item.code == 'MILESTONE').length && drawContent['properties'].filter(item => item.code == 'MILESTONE')[0]
    const nowTime = timeToTimestamp(new Date())
    const due_timeStamp = timeToTimestamp(timeString)
    const updateObj = {
      card_id, due_time: due_timeStamp, board_id
    }

    if (!this.compareStartDueTime(start_time, due_timeStamp)) {
      message.warn('开始时间不能大于结束时间')
      return false
    }

    if (!compareTwoTimestamp(data.deadline, due_timeStamp)) {
      message.warn('任务的截止日期不能大于关联里程碑的截止日期')
      return false
    }

    let new_drawContent = { ...drawContent }
    new_drawContent['due_time'] = due_timeStamp
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTaskVTwo',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      if (!compareTwoTimestamp(due_timeStamp, nowTime)) {
        setTimeout(() => {
          message.warn(`您设置了一个今天之前的日期: ${timestampToTime(timeString, true)}`, MESSAGE_DURATION_TIME)
        }, 500)
      }
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'due_time', value: due_timeStamp, rely_card_datas: res.data })
    })
  }
  // 截止时间 chg事件 E

  // 删除开始时间 S
  handleDelStartTime = (e) => {
    e && e.stopPropagation()
    const { dispatch, drawContent = {} } = this.props
    const { card_id, start_time, board_id } = drawContent
    const updateObj = {
      card_id, start_time: '0', board_id
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['start_time'] = null
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTaskVTwo',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'start_time', value: '0', rely_card_datas: res.data })
    })

  }
  // 删除开始时间 E

  // 删除结束时间 S
  handleDelDueTime = (e) => {
    e && e.stopPropagation()
    const { dispatch, drawContent = {} } = this.props
    const { card_id, due_time, board_id } = drawContent
    const updateObj = {
      card_id, due_time: '0', board_id
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['due_time'] = null
    if (!card_id) return false
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTaskVTwo',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'due_time', value: '0', rely_card_datas: res.data })
    })

  }
  // 删除结束时间 E

  updateParentPropertiesList = ({ shouldDeleteId, new_selectedKeys = [] }) => {
    const { attributesList = [] } = this.props
    const { propertiesList = [] } = this.state
    let new_attributesList = [...attributesList]
    let new_propertiesList = [...propertiesList]
    const currentDataItem = new_attributesList.filter(item => item.id == shouldDeleteId)[0]
    new_propertiesList.push(currentDataItem)
    this.setState({
      propertiesList: new_propertiesList,
      selectedKeys: new_selectedKeys
    })

  }

  // 对应字段的删除 S
  handleDelCurrentField = (shouldDeleteId) => {
    if ((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit()) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const that = this
    this.setState({
      showDelColor: true,
      currentDelId: shouldDeleteId
    })
    let flag = false // 判断删除的时候当前是否有数据, 默认为false 表示没有数据直接删除
    const { dispatch, drawContent = {}, drawContent: { card_id } } = that.props
    const { selectedKeys = [] } = that.state
    let new_drawContent = { ...drawContent }
    let filter_drawContent = { ...drawContent }
    let new_selectedKeys = [...selectedKeys]
    // 删除的时候判断data类型以及是否有数据
    filter_drawContent['properties'].find(item => {
      if (item.id == shouldDeleteId) { // 表示找到当前item
        if (Array.isArray(item.data)) {
          flag = item.data.length
        } else if (item.data instanceof Object) {
          let arr = Object.keys(item.data);
          flag = !(arr.length == '0')
        } else if (item.data) {
          flag = true
        }
      }
    })
    new_selectedKeys = new_selectedKeys.filter(item => item != shouldDeleteId)
    new_drawContent['properties'] = new_drawContent['properties'].filter(item => item.id != shouldDeleteId)
    let gold_executor = (new_drawContent['properties'].find(item => item.code == 'EXECUTOR') || {}).data
    if (flag) {
      Modal.confirm({
        title: `确认要删除这条字段吗？`,
        zIndex: 1007,
        content: <div style={{ color: 'rgba(0,0,0, .65)', fontSize: 14 }}>
          <span >删除包括删除这条字段已填写的内容。</span>
        </div>,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          Promise.resolve(
            dispatch({
              type: 'publicTaskDetailModal/removeCardAttributes',
              payload: {
                card_id, property_id: shouldDeleteId
              }
            })
          ).then(res => {
            if (isApiResponseOk(res)) {
              that.setState({
                // selectedKeys: new_selectedKeys,
                shouldDeleteId: '',
                showDelColor: ''
              })
              that.updateParentPropertiesList({ shouldDeleteId, new_selectedKeys })
              dispatch({
                type: 'publicTaskDetailModal/updateDatas',
                payload: {
                  drawContent: new_drawContent
                }
              })
              if (!(gold_executor && gold_executor.length)) {
                that.props.handleTaskDetailChange && that.props.handleTaskDetailChange({ card_id, drawContent: new_drawContent, operate_properties_code: 'EXECUTOR' })
              }
            }
          })
        },
        onCancel() {
          that.setState({
            shouldDeleteId: '',
            showDelColor: ''
          })
        }
      })
    } else {
      Promise.resolve(
        dispatch({
          type: 'publicTaskDetailModal/removeCardAttributes',
          payload: {
            card_id, property_id: shouldDeleteId
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          that.setState({
            // selectedKeys: new_selectedKeys,
            shouldDeleteId: '',
            showDelColor: ''
          })
          that.updateParentPropertiesList({ shouldDeleteId, new_selectedKeys })
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawContent: new_drawContent
            }
          })
          if (!(gold_executor && gold_executor.length)) {
            that.props.handleTaskDetailChange && that.props.handleTaskDetailChange({ card_id, drawContent: new_drawContent, operate_properties_code: 'EXECUTOR' })
          }
        }
      })
    }
  }
  // 对应字段的删除 E


  // 会议的状态值, 比较当前时间和开始时间结束时间的对比 S
  getMeetingStatus = () => {
    let meetingField
    meetingField = (<span></span>)
    const { drawContent = {} } = this.props
    const { start_time, due_time, type } = drawContent
    if (type == '0' || !start_time || !due_time) return
    let timeString
    timeString = new Date().getTime().toString()
    if (timeString.length == 13) { // 表示是13位的时间戳
      timeString = parseInt(timeString / 1000)
    }
    if (compareTwoTimestamp(timeString, start_time)) { // 如果说当前时间大于开始时间表示进行中
      meetingField = (
        <span style={{ display: 'inline-block', width: '58px', height: '26px', background: '#FFE7BA', borderRadius: '4px', lineHeight: '26px', textAlign: 'center', color: '#FA8C16' }}>{'进行中'}</span>
      )
      if (compareTwoTimestamp(timeString, due_time)) { // 如果说当前时间大于截止时间表示已完成
        meetingField = (
          <span style={{ display: 'inline-block', width: '58px', height: '26px', background: '#D0EFB4', borderRadius: '4px', lineHeight: '26px', textAlign: 'center', color: '#389E0D' }}>{'已完成'}</span>
        )
      }
    } else { // 表示未开始
      meetingField = (
        <span style={{ display: 'inline-block', width: '58px', height: '26px', background: '#D4F1FF', borderRadius: '4px', lineHeight: '26px', textAlign: 'center', color: '#1890FF' }}>{'未开始'}</span>
      )
    }
    return meetingField
  }
  // 会议的状态值, 比较当前时间和开始时间结束时间的对比 E

  // 属性选择的下拉回调 S
  handleMenuReallySelect = (e, value) => {
    e && e.stopPropagation()
    const { dispatch, card_id } = this.props
    const { propertiesList = [] } = this.state
    // const { key, selectedKeys = [] } = e
    const that = this
    let new_propertiesList = [...propertiesList]
    new_propertiesList = new_propertiesList.filter(item => {
      if (item.id != value.id) {
        return item
      }
    })
    // selectedKeys.push(key)
    dispatch({
      type: 'publicTaskDetailModal/setCardAttributes',
      payload: {
        card_id, property_id: value.id,
        calback: () => {
          that.setState({
            // selectedKeys: selectedKeys,
            propertiesList: new_propertiesList
          })
        }
      }
    })
  }
  // 属性选择的下拉回调 E


  // 获取对应字段的Icon
  getCurrentFieldIcon = (value) => {
    const { code } = value
    let messageValue = (<span></span>)
    switch (code) {
      case 'EXECUTOR':// 表示是负责人
        messageValue = (
          <span>&#xe7b2;</span>
        )
        break;
      case 'MILESTONE':// 表示是里程碑
        messageValue = (
          <span>&#xe6b7;</span>
        )
        break;
      case 'REMARK':// 表示是备注
        messageValue = (
          <span>&#xe7f6;</span>
        )
        break;
      case 'LABEL':// 标签
        messageValue = (
          <span>&#xe6b8;</span>
        )
        break;
      case 'ATTACHMENT':// 表示是上传附件
        messageValue = (
          <span>&#xe6b9;</span>
        )
        break;
      case 'SUBTASK':// 表示是子任务
        messageValue = (
          <span>&#xe7f5;</span>
        )
        break;
      // case 'CONTENTLINK':// 表示是关联内容
      //   messageValue = (
      //     <span>&#xe6ba;</span>
      //   )
      //   break;
      default:
        break;
    }
    return messageValue
  }

  // 获取添加属性中的不同字段
  getDiffAttributies = () => {
    const { propertiesList = [], selectedKeys = [] } = this.state
    const { drawContent = {}, projectDetailInfoData } = this.props
    const { org_id } = drawContent
    if (!(propertiesList && propertiesList.length)) {
      return (<></>)
    }
    let new_propertiesList = [...propertiesList]
    new_propertiesList = new_propertiesList.filter(item => item.code != 'CONTENTLINK')
    if (!isPaymentOrgUser(org_id)) {
      new_propertiesList = new_propertiesList.filter(item => item.code != 'ATTACHMENT')
    }
    return (
      <div>
        <div className={mainContentStyles.attrWrapper}>
          {
            new_propertiesList && new_propertiesList.map((item, index) => (
              <Button onClick={(e) => { this.handleMenuReallySelect(e, item) }} className={mainContentStyles.attr_btn} key={`${item.id}`}>
                <span className={`${globalStyles.authTheme} ${mainContentStyles.attr_icon}`}>{this.getCurrentFieldIcon(item)}</span>
                <span className={mainContentStyles.attr_name}>{item.name}</span>
              </Button>
            ))
          }
          {/* <Menu style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', maxWidth: '248px' }}
            // onDeselect={this.handleMenuReallyDeselect.bind(this)}
            selectedKeys={selectedKeys}
            onSelect={this.handleMenuReallySelect.bind(this)}
          >
            {
              new_propertiesList && new_propertiesList.map((item, index) => (
                <Menu.Item key={`${item.id}`}>
                  <span className={`${globalStyles.authTheme} ${mainContentStyles.attr_icon}`}>{this.getCurrentFieldIcon(item)}</span>
                  <span className={mainContentStyles.attr_name}>{item.name}</span>
                </Menu.Item>
              ))
            }
          </Menu> */}
        </div>
      </div>
    )
  }

  // 执行人渲染需要特殊处理
  renderPriciple = () => {
    const { drawContent = {}, projectDetailInfoData } = this.props
    const { showDelColor, currentDelId } = this.state
    const { card_id, board_id, org_id } = drawContent
    const { data = [], id } = this.getCurrentDrawerContentPropsModelDatasExecutors()
    const flag = (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit()
    return (
      <div>
        <div style={{ cursor: 'pointer' }} className={`${mainContentStyles.field_content} ${showDelColor && id == currentDelId && mainContentStyles.showDelColor}`}>
          <div className={mainContentStyles.field_left}>
            <div className={mainContentStyles.field_hover}>
              {/* <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.65)' }} className={globalStyles.authTheme}>&#xe7b2;</span> */}
              <span className={mainContentStyles.user_executor}>负责人</span>
            </div>
            {
              !flag && (
                <span onClick={() => { this.handleDelCurrentField(id) }} className={`${globalStyles.authTheme} ${mainContentStyles.field_delIcon}`}>&#xe7fe;</span>
              )
            }
          </div>
          {
            (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
              (
                !data.length ? (
                  <div className={`${mainContentStyles.field_right}`}>
                    <div className={`${mainContentStyles.pub_hover}`}>
                      <span>暂无</span>
                    </div>
                  </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }} className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                      {data.map((value) => {
                        const { avatar, name, user_name, user_id } = value
                        return (
                          <div key={user_id} className={`${mainContentStyles.first_pric}`} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                            <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 10px', textAlign: 'center' }} key={user_id}>
                              {avatar ? (
                                <img style={{ width: '24px', height: '24px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                              ) : (
                                  <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                    <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                  </div>
                                )}
                              <div style={{ marginRight: 8, fontSize: '14px' }} className={mainContentStyles.value_text}>{name || user_name || '佚名'}</div>
                              {/* <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${mainContentStyles.userItemDeleBtn}`}></span> */}
                            </div>

                          </div>
                        )
                      })}
                    </div>
                  )
              )
            ) : (
                <span style={{ flex: '1', display: 'block' }}>
                  {
                    !data.length ? (
                      <div style={{ flex: '1', position: 'relative' }}>
                        <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                          overlay={
                            <MenuSearchPartner
                              // isInvitation={true}
                              inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}
                              invitationType='4'
                              invitationId={card_id}
                              invitationOrg={org_id}
                              listData={projectDetailInfoData.data} keyCode={'user_id'} searchName={'name'} currentSelect={data} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                              board_id={board_id} />
                          }
                        >
                          <div className={`${mainContentStyles.field_right}`}>
                            <div className={`${mainContentStyles.pub_hover}`}>
                              <span>指派负责人</span>
                            </div>
                          </div>
                        </Dropdown>
                      </div>
                    ) : (
                        <div style={{ flex: '1', position: 'relative' }}>
                          <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                            overlay={
                              <MenuSearchPartner
                                // isInvitation={true}
                                inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}
                                invitationType='4'
                                invitationId={card_id}
                                invitationOrg={org_id}
                                listData={projectDetailInfoData.data} keyCode={'user_id'} searchName={'name'} currentSelect={data} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                                board_id={board_id} />
                            }
                          >
                            <div style={{ display: 'flex', flexWrap: 'wrap' }} className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                              {data.map((value) => {
                                const { avatar, name, user_name, user_id } = value
                                return (
                                  <div key={user_id} className={`${mainContentStyles.first_pric}`} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                                    <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 10px', textAlign: 'center' }} key={user_id}>
                                      {avatar ? (
                                        <img style={{ width: '24px', height: '24px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                      ) : (
                                          <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                            <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                          </div>
                                        )}
                                      <div style={{ marginRight: 8, fontSize: '14px' }} className={mainContentStyles.value_text}>{name || user_name || '佚名'}</div>
                                      <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${mainContentStyles.userItemDeleBtn}`}></span>
                                    </div>

                                  </div>
                                )
                              })}
                            </div>
                          </Dropdown>
                        </div>
                      )
                  }
                </span>
              )
          }
        </div>
      </div>
    )
  }

  // 判断是否存在执行人
  whetherExistencePriciple = () => {
    const { drawContent: { properties = [] } } = this.props
    let flag
    if (!properties.length) return false
    flag = properties.filter(item => item.code == 'EXECUTOR')
    if (flag.length == '0') return flag = false
    return flag
  }

  // 附件关闭回调
  setPreviewFileModalVisibile = () => {
    // this.setState({
    //   previewFileModalVisibile: !this.state.previewFileModalVisibile
    // })
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        filePreviewCurrentFileId: '',
        fileType: '',
        isInOpenFile: false,
        filePreviewCurrentName: ''
      }
    })
    this.updatePrivateVariablesWithOpenFile && this.updatePrivateVariablesWithOpenFile()
  }

  /* 附件版本更新数据  */
  whetherUpdateFolderListData = ({ folder_id, file_id, file_name, create_time }) => {
    if (file_name) {
      const { drawContent = {}, dispatch } = this.props
      const { deliverables = [] } = drawContent
      const gold_data = (drawContent['properties'].find(item => item.code == 'SUBTASK') || {}).data
      if (gold_data && gold_data.length) { // 表示子任务存在
        let newData = [...gold_data]
        newData = newData.map(item => {
          let new_item = {...item}
          if (item.deliverables && item.deliverables.length) {
            let temp_arr = [...item.deliverables]
            temp_arr = temp_arr.map(val => {
              if (val.file_id == this.props.filePreviewCurrentFileId) {
                let new_val = {...val}
                new_val = { ...val, file_id: file_id, name: file_name, create_time: create_time}
                return new_val
              } else {
                return val
              }
            })
            new_item = {...item, deliverables: temp_arr}
            return new_item
          } else {
            return item
          }
        })
        drawContent['properties'] = this.filterCurrentUpdateDatasField('SUBTASK', newData)
        dispatch({
          type: 'publicTaskDetailModal/updateDatas',
          payload: {
            drawContent
          }
        })
        if (typeof this.props.handleRelyUploading == 'function' && folder_id) this.props.handleRelyUploading({ folder_id })
      } else if (deliverables && deliverables.length) { // 表示是父任务的文件列表中存在
        let new_deliverables = [...deliverables]
        new_deliverables = new_deliverables && new_deliverables.map(item => {
          if (item.file_id == this.props.filePreviewCurrentFileId) {
            let new_item = item
            new_item = { ...item, file_id: file_id, name: file_name, create_time: create_time }
            return new_item
          } else {
            let new_item = item
            return new_item
          }
        })
        drawContent['deliverables'] = new_deliverables
        dispatch({
          type: 'publicTaskDetailModal/updateDatas',
          payload: {
            drawContent
          }
        })
        if (typeof this.props.handleRelyUploading == 'function' && folder_id) this.props.handleRelyUploading({ folder_id })
      }

    }

  }

  // 是否可以修改父任务中的时间
  whetherUpdateParentTaskTime = (data) => {
    const { drawContent = {}, dispatch } = this.props
    const gold_data = (drawContent['properties'] && drawContent['properties'].find(item => item.code == 'SUBTASK') || {}).data
    if (!gold_data) return false;

    let newData = [...gold_data]
    newData = newData.find(item => item.due_time || item.start_time)
    if (newData && Object.keys(newData).length) {
      this.setState({
        is_change_parent_time: true
      })
    } else {
      this.setState({
        is_change_parent_time: false
      })
    }
    if (data) {
      if (!(data && data.length)) return
      const { start_time, id: card_id, due_time } = data[0]
      let new_drawContent = { ...drawContent }
      new_drawContent['start_time'] = start_time
      new_drawContent['due_time'] = due_time
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'start_time', value: start_time })
      this.updateDrawContentWithUpdateParentListDatas({ drawContent: new_drawContent, card_id, name: 'due_time', value: due_time })
    }
  }

  // 更新对应的依赖项
  updateRelyOnRationList = (change_data) => {
    const { drawContent = {}, drawContent: { dependencies = {} }, dispatch } = this.props
    if (!dependencies) return
    if (!(dependencies['last'] && dependencies['last'].length) && !(dependencies['next'] && dependencies['next'].length)) return
    let obj = {}
    let new_drawContent = { ...drawContent }
    let preposeList = dependencies['last'] // 前置
    let postpositionList = dependencies['next'] // 后置

    preposeList = preposeList.map(item => {
      let new_item = {}
      const node = change_data.find(n => n.id == item.id) || {}
      new_item = { ...item, ...node }
      return new_item
    })
    postpositionList = postpositionList.map(item => {
      let new_item = {}
      const node = change_data.find(n => n.id == item.id) || {}
      new_item = { ...item, ...node }
      return new_item
    })
    obj = {
      ...dependencies,
      last: preposeList,
      next: postpositionList
    }
    new_drawContent['dependencies'] = obj
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawContent: new_drawContent
      }
    })
  }

  render() {
    const { drawContent = {}, isInOpenFile, handleTaskDetailChange, handleChildTaskChange } = this.props
    const {
      card_id,
      card_name,
      type = '0',
      is_realize = '0',
      start_time,
      due_time,
      dependencies = []
    } = drawContent
    const { properties = [] } = drawContent
    const executors = this.getCurrentDrawerContentPropsModelDatasExecutors()
    const { boardFolderTreeData = [], milestoneList = [], selectedKeys = [], inputValue, is_edit_title } = this.state
    // 状态
    const filedEdit = (
      <Menu onClick={this.handleFiledIsComplete} getPopupContainer={triggerNode => triggerNode.parentNode} selectedKeys={is_realize == '0' ? ['incomplete'] : ['complete']}>
        <Menu.Item key="incomplete">
          <span>未完成</span>
          <div style={{ display: is_realize == '0' ? 'block' : 'none' }}>
            <Icon type="check" />
          </div>
        </Menu.Item>
        <Menu.Item key="complete">
          <span>已完成</span>
          {/* display: selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none' */}
          <div style={{ display: is_realize == '0' ? 'none' : 'block' }}>
            <Icon type="check" />
          </div>
        </Menu.Item>

      </Menu>
    )

    return (
      <div className={mainContentStyles.main_wrap}>
        <div className={mainContentStyles.main_content}>
          {/* 标题 S */}
          <div>
            <div className={mainContentStyles.title_content}>
              <div className={mainContentStyles.title_icon}>
                {
                  type == '0' ? (
                    <div style={{ cursor: 'pointer', }} onClick={this.setIsCheck} className={is_realize == '1' ? mainContentStyles.nomalCheckBoxActive : mainContentStyles.nomalCheckBox}>
                      <Icon type="check" style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }} />
                    </div>
                  ) : (
                      <div style={{ width: 20, height: 20, color: '#595959', cursor: 'pointer' }}>
                        <i style={{ fontSize: '20px' }} className={globalStyles.authTheme}>&#xe84d;</i>
                      </div>
                    )
                }
              </div>
              {
                !is_edit_title ? (
                  <div onClick={(e) => { this.setTitleEdit(e, card_name) }} className={`${mainContentStyles.card_name} ${mainContentStyles.pub_hover}`}>
                    <span style={{ wordBreak: 'break-all' }}>{card_name}</span>
                  </div>
                ) : (
                    <NameChangeInput
                      autosize
                      onChange={this.titleTextAreaChange}
                      onBlur={this.titleTextAreaChangeBlur}
                      // onClick={this.setTitleEdit}
                      onPressEnter={this.titleTextAreaChangeBlur}
                      setIsEdit={this.titleTextAreaChangeBlur}
                      autoFocus={true}
                      goldName={inputValue}
                      maxLength={101}
                      nodeName={'input'}
                      style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                    />
                  )
              }
            </div>
          </div>
          {/* 标题 E */}

          {/* 各种字段的不同状态 S */}
          <div>
            {/* 负责人区域 S */}
            {this.whetherExistencePriciple() && this.renderPriciple()}
            {/* 负责人区域 E */}
            {/* 状态区域 */}
            <div>
              <div style={{ position: 'relative' }} className={mainContentStyles.field_content} style={{ cursor: 'pointer' }}>
                <div className={mainContentStyles.field_left}>
                  <div className={mainContentStyles.field_hover}>
                    {/* <span className={`${globalStyles.authTheme}`}>&#xe6b6;</span> */}
                    <span>完成状态</span>
                  </div>
                </div>
                {
                  type == '0' ? (
                    <>
                      {
                        (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                          <div className={`${mainContentStyles.field_right}`}>
                            <div className={`${mainContentStyles.pub_hover}`}>
                              <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '未完成' : '已完成'}</span>
                            </div>
                          </div>
                        ) : (
                            <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_item} overlay={filedEdit} getPopupContainer={triggerNode => triggerNode.parentNode}>
                              <div className={`${mainContentStyles.field_right}`}>
                                <div className={`${mainContentStyles.pub_hover}`}>
                                  <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '未完成' : '已完成'}</span>
                                </div>
                              </div>
                            </Dropdown>
                          )
                      }
                    </>
                  ) : (
                      <div className={`${mainContentStyles.field_right}`}>
                        <div className={`${mainContentStyles.pub_hover}`}>
                          {
                            this.getMeetingStatus && this.getMeetingStatus()
                          }
                          {/* <span className={mainContentStyles.incomplete}>{'未完成'}</span> */}
                        </div>
                      </div>
                    )
                }

              </div>
            </div>
            {/* 时间区域 */}
            <div>
              <div className={mainContentStyles.field_content} style={{ cursor: 'pointer' }}>
                <div className={mainContentStyles.field_left}>
                  <div className={mainContentStyles.field_hover}>
                    {/* <span className={globalStyles.authTheme}>&#xe686;</span> */}
                    <span>期限</span>
                  </div>
                </div>
                <div className={`${mainContentStyles.field_right}`}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ position: 'relative' }}>
                      {/* 开始时间 */}
                      {
                        (((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit())
                          || this.state.is_change_parent_time
                        ) ? (
                            (
                              <div className={`${mainContentStyles.start_time}`}>
                                <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                  {start_time ? <span className={mainContentStyles.value_text}>{timestampToTime(start_time, true)}</span> : '暂无'}
                                </span>
                              </div>
                            )
                          ) : (
                            <div className={`${mainContentStyles.start_time}`}>
                              <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                {start_time ? <span className={mainContentStyles.value_text}>{timestampToTime(start_time, true)}</span> : '开始时间'}
                                <DatePicker
                                  disabledDate={this.disabledStartTime.bind(this)}
                                  // onOk={this.startDatePickerChange.bind(this)}
                                  onChange={this.startDatePickerChange.bind(this)}
                                  // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                  placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                                  format="YYYY/MM/DD HH:mm"
                                  showTime={{ format: 'HH:mm' }}
                                  style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                              </span>
                              <span onClick={this.handleDelStartTime} className={`${mainContentStyles.userItemDeleBtn} ${start_time && mainContentStyles.timeDeleBtn}`}></span>
                            </div>
                          )
                      }
                      &nbsp;
                      <span style={{ color: '#bfbfbf' }}> ~ </span>
                      &nbsp;
                      {/* 截止时间 */}
                      {
                        (((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit())
                          || this.state.is_change_parent_time
                        ) ? (
                            (
                              <div className={`${mainContentStyles.due_time}`}>
                                <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                  {due_time ? <span className={mainContentStyles.value_text}>{timestampToTime(due_time, true)}</span> : '暂无'}
                                </span>
                              </div>
                            )
                          ) : (
                            <div className={`${mainContentStyles.due_time}`}>
                              <span style={{ position: 'relative', minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                {due_time ? <span className={mainContentStyles.value_text}>{timestampToTime(due_time, true)}</span> : '截止时间'}
                                <DatePicker
                                  disabledDate={this.disabledDueTime.bind(this)}
                                  // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                  placeholder={due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                                  format="YYYY/MM/DD HH:mm"
                                  showTime={{ format: 'HH:mm' }}
                                  // onOk={this.endDatePickerChange.bind(this)}
                                  onChange={this.endDatePickerChange.bind(this)}
                                  style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                              </span>
                              <span onClick={this.handleDelDueTime} className={`${mainContentStyles.userItemDeleBtn} ${due_time && mainContentStyles.timeDeleBtn}`}></span>
                            </div>
                          )
                      }
                    </div>
                    {/* 通知提醒 */}
                    {
                      (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                        ''
                      ) : (
                          <span style={{ position: 'relative', marginLeft: '74px' }}>
                            <InformRemind commonExecutors={executors.data} style={{ display: 'inline-block', minWidth: '72px', height: '38px', borderRadius: '4px', textAlign: 'center' }} rela_id={card_id} rela_type={type == '0' ? '1' : '2'} />
                          </span>
                        )
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 各种字段的不同状态 E */}
          {/* 不同字段的渲染 S */}
          <div style={{ position: 'relative' }}>
            <DragDropContentComponent updatePrivateVariablesWithOpenFile={this.updatePrivateVariablesWithOpenFile} handleRelyUploading={this.props.handleRelyUploading} getMilestone={this.getMilestone} selectedKeys={selectedKeys} updateParentPropertiesList={this.updateParentPropertiesList} handleTaskDetailChange={handleTaskDetailChange} handleChildTaskChange={handleChildTaskChange} boardFolderTreeData={boardFolderTreeData} milestoneList={milestoneList} whetherUpdateParentTaskTime={this.whetherUpdateParentTaskTime} updateRelyOnRationList={this.updateRelyOnRationList} />
          </div>
          {/* 不同字段的渲染 E */}

          {/* 添加字段 S */}
          <div>
            {
              (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                ''
              ) : (
                  <>
                    {
                      !(properties && properties.length == 6) && (
                        <>
                          {this.getDiffAttributies()}
                        </>
                        // <div className={mainContentStyles.field_content}>
                        //   <div className={mainContentStyles.field_left}>
                        //     <div className={mainContentStyles.field_hover}>
                        //       <span className={globalStyles.authTheme}>&#xe8fe;</span>
                        //       <span>添加属性</span>
                        //     </div>
                        //   </div>
                        //   <div className={mainContentStyles.field_right}>
                        //     <div style={{ position: 'relative' }} className={mainContentStyles.pub_hover}>
                        //       <Dropdown overlayClassName={mainContentStyles.overlay_attribute} trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode}
                        //         overlay={this.getDiffAttributies()}
                        //       >
                        //         <div><span>选择属性</span></div>
                        //       </Dropdown>
                        //     </div>
                        //   </div>
                        // </div>
                      )
                    }
                  </>
                )
            }

          </div>
          {/* 添加字段 E */}
        </div>
        <div onClick={this.handleDynamicComment} id="dynamic_comment" className={mainContentStyles.dynamic_comment}>
          <Tooltip overlayStyle={{ minWidth: '72px' }} placement="top" title="动态消息" getPopupContainer={() => document.getElementById('dynamic_comment')}>
            <span className={globalStyles.authTheme}>&#xe8e8;</span>
          </Tooltip>
        </div>
        {/*查看任务附件*/}
        <div>
          {
            this.props.isInOpenFile && this.state.whetherIsOpenFileVisible && (
              <FileListRightBarFileDetailModal
                filePreviewCurrentFileId={this.props.filePreviewCurrentFileId}
                fileType={this.props.fileType}
                file_detail_modal_visible={this.props.isInOpenFile}
                filePreviewCurrentName={this.props.filePreviewCurrentName}
                setPreviewFileModalVisibile={this.setPreviewFileModalVisibile}
                whetherUpdateFolderListData={this.whetherUpdateFolderListData}
              />
            )
          }
        </div>
      </div>
    )
  }
}

// 只关联public弹窗内的数据
function mapStateToProps({
  publicTaskDetailModal: { drawerVisible, drawContent = {}, card_id, boardTagList = [], attributesList = [] },
  projectDetail: { datas: { projectDetailInfoData = {} } },
  publicFileDetailModal: {
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType,
    filePreviewCurrentName
  },
  technological: {
    datas: {
      userBoardPermissions
    }
  }
}) {
  return { drawerVisible, drawContent, card_id, boardTagList, attributesList, projectDetailInfoData, isInOpenFile, filePreviewCurrentFileId, fileType, filePreviewCurrentName, userBoardPermissions }
}