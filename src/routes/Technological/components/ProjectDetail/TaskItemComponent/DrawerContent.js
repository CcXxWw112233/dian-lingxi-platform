import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import {
  Icon,
  Tag,
  Input,
  Dropdown,
  Menu,
  DatePicker,
  message,
  Modal,
  Popconfirm
} from 'antd'
import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/braft.css'
import 'braft-editor/dist/index.css'
import PreviewFileModal from './PreviewFileModal'
import PreviewFileModalRichText from './PreviewFileModalRichText'

import DCAddChirdrenTask from './DCAddChirdrenTask'
import Comment from './Comment'
import Cookies from 'js-cookie'
import {
  timestampToTimeNormal,
  timeToTimestamp,
  compareTwoTimestamp,
  arrayNonRepeatfy
} from '../../../../../utils/util'
import { Button, Upload } from 'antd'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_EDIT,
  PROJECT_TEAM_CARD_DELETE,
  PROJECT_TEAM_CARD_COMPLETE,
  REQUEST_DOMAIN_FILE,
  UPLOAD_FILE_SIZE,
  REQUEST_DOMAIN_BOARD,
  TASKS,
  CONTENT_DATA_TYPE_CARD
} from '../../../../../globalset/js/constant'
import {
  checkIsHasPermissionInBoard,
  checkIsHasPermissionInVisitControl,
  checkRoleAndMemberVisitControlPermissions,
  currentNounPlanFilterName,
  getSubfixName
} from '../../../../../utils/businessFunction'
import { deleteTaskFile } from '../../../../../services/technological/task'
import globalStyle from '../../../../../globalset/css/globalClassName.less'
import TagDropDown from './components/TagDropDown'
import ExcutorList from './components/ExcutorList'
import ContentRaletion from '../../../../../components/ContentRaletion'
import {
  createMeeting,
  createShareLink,
  modifOrStopShareLink
} from './../../../../../services/technological/workbench'
import VisitControl from './../../VisitControl/index'
import InformRemind from '@/components/InformRemind'
import {
  setContentPrivilege,
  toggleContentPrivilege,
  removeContentPrivilege
} from './../../../../../services/technological/project'
import { withRouter } from 'react-router-dom'
import NameChangeInput from '../../../../../components/NameChangeInput'
import { setUploadHeaderBaseInfo } from '@/utils/businessFunction'
import { connect } from 'dva'
import MenuSearchPartner from '../../../../../components/MenuSearchMultiple/MenuSearchPartner.js'
import ShareAndInvite from './../../ShareAndInvite/index'

const SubMenu = Menu.SubMenu

let that
@connect(mapStateToProps)
class DrawContent extends React.Component {
  state = {
    title: '',
    titleIsEdit: false,
    isInEdit: false,
    brafitEditHtml: '', //?????????????????????
    isInAddTag: false,
    tagDropdownVisible: false, //??????????????????????????????
    // ???????????????
    isSetedAlarm: false,
    alarmTime: '',
    previewFileModalVisibile: false, //??????????????????????????????
    attachment_fileList: [], //??????????????????
    isUsable: true, //???????????????????????????
    onlyReadingShareModalVisible: false, //????????????modal
    onlyReadingShareData: {},
    showUploadList: false //????????????filelist??? ??????????????????????????????????????????????????????
  }
  componentWillMount() {
    //drawContent  ??????taskGroupList???????????????????????????????????????taskGroupList??????????????????taskGroupListIndex??????????????????????????????????????????
    const { drawContent = {} } = this.props
    let { description } = drawContent
    this.setState({
      brafitEditHtml: description
    })
  }
  componentWillReceiveProps(nextProps) {
    const { drawContent = {} } = nextProps
    let { description } = drawContent
    this.setState({
      brafitEditHtml: description
    })
    this.initSetAttachmentFileList(nextProps)
  }
  initSetAttachmentFileList(props) {
    const { drawContent = {} } = props
    let { attachment_data = [] } = drawContent
    const attachment_fileList_local = this.state.attachment_fileList || []
    if (attachment_data.length == attachment_fileList_local.length) {
      return
    }

    let attachment_fileList = []
    for (let i = 0; i < attachment_data.length; i++) {
      if (attachment_data[i].status !== 'uploading') {
        //??????????????? ??????????????????????????????????????????????????????????????????
        attachment_fileList.push(attachment_data[i])
        // attachment_fileList[i]['uid'] = attachment_data[i].id || (attachment_data[i].response && attachment_data[i].response.data? attachment_data[i].response.data.attachment_id:'')
        attachment_fileList[attachment_fileList.length - 1]['uid'] =
          attachment_data[i].id ||
          (attachment_data[i].response && attachment_data[i].response.data
            ? attachment_data[i].response.data.attachment_id
            : '')
      }
    }
    this.setState({
      attachment_fileList
    })
  }
  //firstLine -------start
  //??????????????????
  projectGroupMenuClick(e) {
    const pathArr = e.keyPath
    const parentKey = Number(pathArr[1])
    const childKey = Number(pathArr[0])

    const { drawContent = {}, projectGoupList = [] } = this.props
    const { card_id } = drawContent
    const list_id = projectGoupList[parentKey].list_data[childKey].list_id
    const board_id = projectGoupList[parentKey].board_id
    const requestObj = {
      card_id,
      list_id,
      board_id
    }
    const indexObj = {
      taskGroupListIndex: childKey,
      taskGroupListIndex_index: 0
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailTask/changeTaskType',
      payload: {
        requestObj,
        indexObj
      }
    })
  }
  topRightMenuClick({ key }) {
    const { drawContent = {}, dispatch } = this.props
    const {
      card_id,
      privileges = [],
      board_id,
      is_privilege,
      executors = []
    } = drawContent
    if (key === '1') {
      // if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_DELETE)) {
      //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      //   return false
      // }
      // ????????????????????????
      if (
        !checkIsHasPermissionInVisitControl(
          'edit',
          privileges,
          is_privilege,
          executors,
          checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_DELETE, board_id)
        )
      ) {
        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
        return false
      }
      dispatch({
        type: 'projectDetailTask/archivedTask',
        payload: {
          card_id,
          is_archived: '1'
        }
      })
    } else if (key === '2') {
      // if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_DELETE)) {
      //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      //   return false
      // }
      // ????????????????????????
      if (
        !checkIsHasPermissionInVisitControl(
          'edit',
          privileges,
          is_privilege,
          executors,
          checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_DELETE, board_id)
        )
      ) {
        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
        return false
      }
      this.confirm(card_id)
    }
  }
  confirm(card_id) {
    const that = this
    const { dispatch } = that.props

    Modal.confirm({
      title: `???????????????${currentNounPlanFilterName(TASKS)}??????`,
      okText: '??????',
      cancelText: '??????',
      zIndex: 2000,
      onOk() {
        that.props.setDrawerVisibleClose()
        dispatch({
          type: 'projectDetailTask/deleteTask',
          payload: {
            id: card_id
          }
        })
      }
    })
  }
  //firstLine----------end

  //???????????????????????????????????????
  updateParentTaskList(name, value) {
    const {
      taskGroupListIndex,
      taskGroupListIndex_index,
      taskGroupList = []
    } = this.props
    taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index][
      name
    ] = value

    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        taskGroupList
      }
    })
  }
  //??????-------start
  setIsCheck() {
    // if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_COMPLETE)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    const {
      drawContent = {},
      taskGroupListIndex,
      taskGroupListIndex_index,
      taskGroupList = []
    } = this.props
    const {
      is_realize = '0',
      card_id,
      privileges = [],
      board_id,
      is_privilege,
      executors = []
    } = drawContent
    // ??????????????????????????????, ?????????????????????
    if (
      !checkRoleAndMemberVisitControlPermissions({
        board_id,
        is_privilege,
        privileges,
        board_permissions_code: PROJECT_TEAM_CARD_COMPLETE
      })
    ) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1'
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailTask/completeTask',
      payload: {
        ...obj
      }
    })
    drawContent['is_realize'] = is_realize === '1' ? '0' : '1'
    taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index][
      'is_realize'
    ] = is_realize === '1' ? '0' : '1'
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        drawContent,
        taskGroupList
      }
    })
  }
  titleTextAreaChangeBlur(e) {
    const {
      drawContent = {},
      taskGroupListIndex,
      taskGroupListIndex_index,
      taskGroupList = [],
      dispatch
    } = this.props
    const { card_id } = drawContent
    drawContent['card_name'] = e.target.value
    taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index][
      'card_name'
    ] = e.target.value
    const updateObj = {
      card_id,
      name: e.target.value,
      card_name: e.target.value
    }
    this.setState({
      titleIsEdit: false
    })
    // const newDrawContent = {...drawContent,card_name: e.target.value,}

    dispatch({
      type: 'projectDetailTask/updateTask',
      payload: {
        updateObj
      }
    })
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        drawContent,
        taskGroupList
      }
    })
  }
  setTitleIsEdit(titleIsEdit, e) {
    e.stopPropagation()
    this.setState({
      titleIsEdit: titleIsEdit
    })
  }
  //??????-------end

  //????????????????????????------------------start
  //???????????????????????????---------------start
  setList(id) {
    const { projectDetailInfoData = {}, dispatch } = this.props
    const { board_id } = projectDetailInfoData

    dispatch({
      type: 'projectDetailTask/removeProjectMenbers',
      payload: {
        board_id,
        user_id: id
      }
    })
  }
  chirldrenTaskChargeChange(data) {
    const {
      drawContent = {},
      projectDetailInfoData = {},
      dispatch
    } = this.props
    const { card_id } = drawContent

    //  ?????????????????????
    const excutorData = projectDetailInfoData['data'] //????????????
    let newExecutors = []
    const { selectedKeys = [] } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < excutorData.length; j++) {
        if (selectedKeys[i] === excutorData[j]['user_id']) {
          newExecutors.push(excutorData[j])
        }
      }
    }
    drawContent['executors'] = newExecutors
    this.updateParentTaskList('executors', newExecutors)
    //????????????????????????????????????????????????
    const that = this
    setTimeout(function() {
      const { excutorsOut_left = {} } = that.refs
      const excutorsOut_left_width = excutorsOut_left.clientWidth
      that.setState({
        excutorsOut_left_width
      })
    }, 300)

    dispatch({
      type: 'projectDetailTask/addTaskExecutor',
      payload: {
        card_id,
        users: selectedKeys.join(',')
      }
    })
  }
  setChargeManIsSelf() {
    const { drawContent = {}, dispatch } = this.props
    const { card_id, executors = [] } = drawContent
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { id, full_name, fullName, email, mobile, avatar } = userInfo
    executors[0] = {
      user_id: id,
      user_name: full_name || fullName || mobile || email,
      avatar: avatar
    }
    this.updateParentTaskList('executors', executors)

    dispatch({
      type: 'projectDetailTask/addTaskExecutor',
      payload: {
        card_id,
        users: id
      }
    })
  }
  //???????????????????????????---------------end
  //????????????
  alarmMenuClick({ key }) {
    let alarmTime
    switch (key) {
      case '1':
        alarmTime = '15?????????'
        break
      case '2':
        alarmTime = '30?????????'
        break
      case '3':
        alarmTime = '1?????????'
        break
      case '4':
        alarmTime = '1??????'
        break
      case '5':
        alarmTime = `${currentNounPlanFilterName(TASKS)}?????????`
        break
      case '6':
        alarmTime = `${currentNounPlanFilterName(TASKS)}?????????`
        break
      default:
        break
    }
    this.setState({
      isSetedAlarm: true,
      alarmTime
    })
  }
  //????????????
  startDatePickerChange(timeString) {
    const { drawContent = {}, dispatch } = this.props
    const start_timeStamp = timeToTimestamp(timeString)
    const { card_id, due_time } = drawContent
    if (!this.compareStartDueTime(start_timeStamp, due_time)) {
      message.warn('????????????????????????????????????')
      return false
    }
    drawContent['start_time'] = start_timeStamp
    const updateObj = {
      card_id,
      start_time: start_timeStamp
    }

    dispatch({
      type: 'projectDetailTask/updateTask',
      payload: {
        updateObj
      }
    })
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        drawContent
      }
    })
  }
  //????????????
  endDatePickerChange(timeString) {
    const { drawContent = {}, milestoneList = [], dispatch } = this.props
    const { card_id, start_time, milestone_data = {} } = drawContent
    const milestone_deadline = (
      milestoneList.find(item => item.id == milestone_data.id) || {}
    ).deadline //????????????????????????
    const due_timeStamp = timeToTimestamp(timeString)
    if (!this.compareStartDueTime(start_time, due_timeStamp)) {
      message.warn('????????????????????????????????????')
      return false
    }
    if (!compareTwoTimestamp(milestone_deadline, due_timeStamp)) {
      message.warn('???????????????????????????????????????????????????????????????')
      return
    }
    drawContent['due_time'] = due_timeStamp
    const updateObj = {
      card_id,
      due_time: due_timeStamp
    }

    dispatch({
      type: 'projectDetailTask/updateTask',
      payload: {
        updateObj
      }
    })
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        drawContent
      }
    })
  }
  compareStartDueTime = (start_time, due_time) => {
    if (!start_time || !due_time) {
      return true
    }
    const newStartTime =
      start_time.toString().length > 10
        ? Number(start_time) / 1000
        : Number(start_time)
    const newDueTime =
      due_time.toString().length > 10
        ? Number(due_time) / 1000
        : Number(due_time)
    if (newStartTime >= newDueTime) {
      return false
    }
    return true
  }
  disabledDueTime = due_time => {
    const { drawContent = {} } = this.props
    const { start_time } = drawContent
    if (!start_time || !due_time) {
      return false
    }
    const newStartTime =
      start_time.toString().length > 10
        ? Number(start_time).valueOf() / 1000
        : Number(start_time).valueOf()
    return Number(due_time.valueOf()) / 1000 < newStartTime
  }
  disabledStartTime = start_time => {
    const { drawContent = {} } = this.props
    const { due_time } = drawContent
    if (!start_time || !due_time) {
      return false
    }
    const newDueTime =
      due_time.toString().length > 10
        ? Number(due_time).valueOf() / 1000
        : Number(due_time).valueOf()
    return Number(start_time.valueOf()) / 1000 >= newDueTime //Number(due_time).valueOf();
  }
  //????????????????????????------------------end

  //????????????????????????---------------start
  editWrapClick(e) {
    e.stopPropagation()
  }
  goEdit(e) {
    e.stopPropagation()
    // if(e.target.nodeName.toUpperCase() === 'IMG') {
    //   const src = e.target.getAttribute('src')
    // }
    this.setState({
      isInEdit: true
    })
  }
  quitBrafitEdit(e) {
    e.stopPropagation()
    const { drawContent = {} } = this.props
    let { description } = drawContent
    this.setState({
      isInEdit: false,
      brafitEditHtml: description
    })
  }
  saveBrafitEdit(e) {
    e.stopPropagation()
    const { drawContent = {}, dispatch } = this.props
    let { card_id } = drawContent
    let { brafitEditHtml } = this.state
    if (typeof brafitEditHtml === 'object') {
      brafitEditHtml = brafitEditHtml.toHTML()
    }
    this.setState({
      isInEdit: false
    })
    const updateObj = {
      card_id,
      description: brafitEditHtml
    }

    dispatch({
      type: 'projectDetailTask/updateTask',
      payload: {
        updateObj
      }
    })
  }
  drawerContentOutClick() {
    this.setState({
      titleIsEdit: false
    })
  }
  isJSON = str => {
    if (typeof str === 'string') {
      try {
        if (str.indexOf('{') > -1) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
    return false
  }
  myUploadFn = param => {
    const serverURL = `${REQUEST_DOMAIN_FILE}/upload`
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    const successFn = () => {
      // ???????????????????????????????????????????????????
      // ?????????????????????param.success?????????????????????????????????
      if (xhr.status === 200 && this.isJSON(xhr.responseText)) {
        if (JSON.parse(xhr.responseText).code === '0') {
          param.success({
            url: JSON.parse(xhr.responseText).data
              ? JSON.parse(xhr.responseText).data.url
              : '',
            meta: {
              // id: 'xxx',
              // title: 'xxx',
              // alt: 'xxx',
              loop: false, // ?????????????????????????????????
              autoPlay: false, // ?????????????????????????????????
              controls: true // ????????????????????????????????????
              // poster: 'http://xxx/xx.png', // ??????????????????????????????
            }
          })
        } else {
          errorFn()
        }
      } else {
        errorFn()
      }
    }

    const progressFn = event => {
      // ?????????????????????????????????param.progress
      param.progress((event.loaded / event.total) * 100)
    }

    const errorFn = () => {
      // ???????????????????????????param.error
      param.error({
        msg: '??????????????????!'
      })
    }

    xhr.upload.addEventListener('progress', progressFn, false)
    xhr.addEventListener('load', successFn, false)
    xhr.addEventListener('error', errorFn, false)
    xhr.addEventListener('abort', errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('Authorization', Cookies.get('Authorization'))
    xhr.setRequestHeader('refreshToken', Cookies.get('refreshToken'))
    xhr.send(fd)
  }
  descriptionHTML(e) {
    if (e.target.nodeName.toUpperCase() === 'IMG') {
      const src = e.target.getAttribute('src')
      this.setState({
        previewFileType: 'img',
        previewFileSrc: src
      })
      this.setPreviewFileModalVisibile()
    } else if (e.target.nodeName.toUpperCase() === 'VIDEO') {
      const src = e.target.getAttribute('src')
      // console.log(src)
      this.setState({
        previewFileType: 'video',
        previewFileSrc: src
      })
      this.setPreviewFileModalVisibile()
    }
  }
  setPreviewFileModalVisibile() {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
  }
  //????????????????????????---------------end

  //??????-------------start
  randomColorArray() {
    const colorArr = [
      'magenta',
      'red',
      'volcano',
      'orange',
      'gold',
      'lime',
      'green',
      'cyan',
      'blue',
      'geekblue',
      'purple'
    ]
    const n = Math.floor(Math.random() * colorArr.length + 1) - 1
    return colorArr[n]
  }
  tagClose({ label_id, label_name, key }) {
    const {
      drawContent = {},
      taskGroupListIndex,
      taskGroupListIndex_index,
      taskGroupList = [],
      dispatch
    } = this.props
    const { card_id } = drawContent
    // drawContent['label_data'].splice(key, 1)
    const keyCode = label_id ? 'label_id' : 'label_name'

    drawContent['label_data'].splice(key, 1)
    taskGroupList[taskGroupListIndex].card_data[taskGroupListIndex_index][
      'label_data'
    ].splice(key, 1)

    dispatch({
      type: 'projectDetailTask/removeTaskTag',
      payload: {
        card_id,
        [keyCode]: label_id || label_name
      }
    })
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        taskGroupList,
        drawContent
      }
    })
  }
  addTag() {
    this.setState({
      isInAddTag: true,
      tagDropdownVisible: true
    })
  }
  quitAddTag() {
    this.setState({
      isInAddTag: false,
      tagDropdownVisible: false
    })
  }
  tagAddComplete(e) {
    this.setState({
      isInAddTag: false,
      tagDropdownVisible: false,
      tagInputValue: ''
    })
    if (!e.target.value) {
      return false
    }
    const {
      drawContent = {},
      projectDetailInfoData = {},
      dispatch
    } = this.props
    const { card_id, label_data = [] } = drawContent
    const { board_id } = projectDetailInfoData
    label_data.push({ label_name: e.target.value })

    dispatch({
      type: 'projectDetailTask/addTaskTag',
      payload: {
        card_id,
        board_id,
        name: e.target.value,
        label_name: e.target.value,
        length: label_data.length
      }
    })
    this.updateParentTaskList('label_data', label_data)
  }
  tagDropItemClick(data) {
    this.setState({
      isInAddTag: false,
      tagDropdownVisible: false,
      tagInputValue: ''
    })
    const {
      drawContent = {},
      projectDetailInfoData = {},
      dispatch
    } = this.props
    const { card_id, label_data = [] } = drawContent
    const { board_id } = projectDetailInfoData
    const { name, color } = data
    label_data.push({ label_name: name, label_color: color })

    dispatch({
      type: 'projectDetailTask/addTaskTag',
      payload: {
        card_id,
        board_id,
        name: name,
        color,
        label_name: name,
        length: label_data.length
      }
    })
    this.updateParentTaskList('label_data', label_data)
  }
  setTagInputValue(e) {
    this.setState({
      tagInputValue: e.target.value //??????????????????
    })
  }
  //??????-------------end

  alarmNoEditPermission = () => {
    message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
  }
  //?????????????????????
  setPreivewProp(data) {
    this.setState({
      ...data
    })
  }
  attachmentItemPreview(data) {
    const file_name = data.name
    const file_resource_id =
      data.file_resource_id || data.response.data.file_resource_id
    const file_id = data.file_id || data.response.data.file_id
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        seeFileInput: 'taskModule',
        isInOpenFile: true,
        filePreviewCurrentId: file_resource_id,
        filePreviewCurrentFileId: file_id,
        pdfDownLoadSrc: ''
      }
    })

    if (getSubfixName(file_name) == '.pdf') {
      dispatch({
        type: 'projectDetailFile/getFilePDFInfo',
        payload: {
          id: file_id
        }
      })
    } else {
      dispatch({
        type: 'projectDetailFile/filePreview',
        payload: {
          file_id
        }
      })
      dispatch({
        type: 'projectDetailFile/fileInfoByUrl',
        payload: {
          file_id
        }
      })
    }
  }
  attachmentItemOpera({ type, data = {}, card_id }, e) {
    e.stopPropagation()
    //debugger
    const { dispatch } = this.props
    const attachment_id =
      data.id ||
      (data.response && data.response.data && data.response.data.attachment_id)
    const file_resource_id =
      data.file_resource_id ||
      (data.response && data.response.data.file_resource_id)
    if (!attachment_id) {
      message.warn('?????????????????????...')
      return
    }
    if (type == 'remove') {
      this.deleteAttachmentFile({ attachment_id, card_id })
    } else if (type == 'download') {
      dispatch({
        type: 'projectDetailFile/fileDownload',
        payload: {
          ids: file_resource_id,
          card_id
        }
      })
    }
  }
  deleteAttachmentFile(data) {
    const { attachment_id } = data
    const that = this
    const { attachment_fileList } = this.state
    const atta_arr = [...attachment_fileList]
    const { drawContent = {}, dispatch } = this.props

    Modal.confirm({
      title: `?????????????????????????????????`,
      zIndex: 1009,
      content: (
        <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
          <span>?????????????????????</span>
        </div>
      ),
      okText: '??????',
      cancelText: '??????',
      onOk() {
        return new Promise(resolve => {
          deleteTaskFile(data)
            .then(value => {
              if (value.code !== '0') {
                message.warn('?????????????????????????????????1')
                resolve()
              } else {
                for (let i = 0; i < atta_arr.length; i++) {
                  if (
                    attachment_id == atta_arr[i]['id'] ||
                    (atta_arr[i].response &&
                      atta_arr[i].response.data &&
                      atta_arr[i].response.data.attachment_id == attachment_id)
                  ) {
                    atta_arr.splice(i, 1)
                  }
                }
                that.setState({
                  attachment_fileList: atta_arr
                })
                const drawContentNew = { ...drawContent }
                drawContentNew['attachment_data'] = atta_arr
                dispatch({
                  type: 'projectDetailTask/updateDatas',
                  payload: {
                    drawContent: drawContentNew
                  }
                })
                resolve()
              }
            })
            .catch(() => {
              message.warn('??????????????????????????????????????????')
              resolve()
            })
        })
      }
    })
  }

  //??????????????????
  meetingMenuClick(e) {
    const { key } = e
    if (key == '1') {
      window.open('https://zoom.us/start/webmeeting')
    } else if (key == '2') {
      window.open('https://zoom.us/start/videomeeting')
    } else if (key == '3') {
      window.open('https://zoom.us/start/sharemeeting')
    }
  }

  // ????????????
  setIsInEditContentRelation(bool) {
    this.setState({
      isInEditContentRelation: bool,
      contentDropVisible: bool
    })
  }
  openWinNiNewTabWithATag = url => {
    const aTag = document.createElement('a')
    aTag.href = url
    aTag.target = '_blank'
    document.querySelector('body').appendChild(aTag)
    aTag.click()
    aTag.parentNode.removeChild(aTag)
  }
  handleCreateVideoMeeting = (title, id, users = [], e) => {
    if (e) e.stopPropagation()
    const body = {
      flag: '1',
      board_id: id,
      topic: title,
      user_ids: users.reduce((acc, curr) => {
        if (!curr || !curr.user_id) return acc
        return acc ? acc + ',' + curr.user_id : curr.user_id
      }, '')
    }
    createMeeting(body).then(res => {
      if (res.code === '0') {
        const { start_url } = res.data
        message.success('??????????????????')
        this.openWinNiNewTabWithATag(start_url)
      } else if (res.code === '1') {
        message.error(res.message)
      } else {
        message.error('??????????????????')
      }
    })
  }
  handleChangeOnlyReadingShareModalVisible = () => {
    const { onlyReadingShareModalVisible } = this.state
    //?????????????????????????????????
    if (!onlyReadingShareModalVisible) {
      Promise.resolve(this.createOnlyReadingShareLink())
        .then(() => {
          this.setState({
            onlyReadingShareModalVisible: true
          })
        })
        .catch(() => message.error('????????????????????????'))
    } else {
      this.setState({
        onlyReadingShareModalVisible: false
      })
    }
  }
  getSearchFromLocation = location => {
    if (!location.search) {
      return {}
    }
    return location.search
      .substring(1)
      .split('&')
      .reduce((acc, curr) => {
        const [key, value] = curr.split('=')
        return Object.assign({}, acc, { [key]: value })
      }, {})
  }
  createOnlyReadingShareLink = () => {
    // const { location } = this.props
    //????????????
    // const { board_id = '', appsSelectKey = '', card_id = '' } = this.getSearchFromLocation(location)

    const { drawContent = {} } = this.props
    const { board_id, card_id } = drawContent

    const payload = {
      board_id,
      rela_id: card_id,
      rela_type: '1'
    }
    return createShareLink(payload).then(({ code, data }) => {
      if (code === '0') {
        this.setState(() => {
          return {
            onlyReadingShareData: data
          }
        })
      } else {
        message.error('????????????????????????')
        return new Error('can not create share link.')
      }
    })
  }
  handleOnlyReadingShareExpChangeOrStopShare = obj => {
    const isStopShare = obj && obj['status'] && obj['status'] === '0'
    return modifOrStopShareLink(obj)
      .then(res => {
        if (res && res.code === '0') {
          if (isStopShare) {
            message.success('??????????????????')
          } else {
            message.success('????????????')
            const { dispatch, drawContent = {} } = this.props
            const isShared = obj && obj['status'] && obj['status']
            if (isShared) {
              let new_drawContent = { ...drawContent, is_shared: obj['status'] }
              dispatch({
                type: 'projectDetailTask/updateDatas',
                payload: {
                  drawContent: new_drawContent
                }
              })
            }
          }
          this.setState(state => {
            const { onlyReadingShareData } = state
            return {
              onlyReadingShareData: Object.assign({}, onlyReadingShareData, obj)
            }
          })
        } else {
          message.error('????????????')
        }
      })
      .catch(() => {
        message.error('????????????')
      })
  }

  /**
   * ???????????????????????????
   * @param {Boolean} flag ????????????
   */
  handleVisitControlChange = flag => {
    const { drawContent = {} } = this.props
    const { is_privilege = '0', card_id } = drawContent
    const toBool = str => !!Number(str)
    const is_privilege_bool = toBool(is_privilege)
    if (flag === is_privilege_bool) {
      return
    }
    //toggle??????
    const data = {
      content_id: card_id,
      content_type: 'card',
      is_open: flag ? 1 : 0
    }
    toggleContentPrivilege(data).then(res => {
      if (res && res.code === '0') {
        // message.success('????????????', MESSAGE_DURATION_TIME)
        setTimeout(() => {
          message.success('????????????')
        }, 500)
        let temp_arr = res && res.data
        this.visitControlUpdateCurrentModalData(
          {
            is_privilege: flag ? '1' : '0',
            type: 'privilege',
            privileges: temp_arr
          },
          flag
        )
      } else {
        message.warning(res.message)
      }
    })
  }

  // ?????????????????????model????????????
  visitControlUpdateCurrentModalData = (obj = {}) => {
    // console.log(obj, 'sssss_obj')
    const { drawContent = {}, getTaskGroupListArrangeType } = this.props
    const { dispatch } = this.props
    const { privileges = [], board_id } = drawContent
    // ?????????????????????
    if (obj && obj.type && obj.type == 'remove') {
      let new_privileges = [...privileges]
      new_privileges.map((item, index) => {
        if (item.id == obj.removeId) {
          new_privileges.splice(index, 1)
        }
      })
      let new_drawContent = { ...drawContent, privileges: new_privileges }
      dispatch({
        type: 'projectDetailTask/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
    }
    // ???????????????????????????
    // ????????????????????????priveleges
    if (obj && obj.type && obj.type == 'add') {
      let new_privileges = []
      for (let item in obj) {
        if (item == 'privileges') {
          // eslint-disable-next-line no-loop-func
          obj[item].map(val => {
            let temp_arr = arrayNonRepeatfy([].concat(...privileges, val))
            return (new_privileges = [...temp_arr])
          })
        }
      }
      let new_drawContent = { ...drawContent, privileges: new_privileges }
      dispatch({
        type: 'projectDetailTask/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
    }

    // ????????????type??????
    if (obj && obj.type && obj.type == 'change') {
      let { id } = obj.temp_arr
      let new_privileges = [...privileges]
      new_privileges = new_privileges.map(item => {
        let new_item = item
        if (item.id == id) {
          new_item = { ...item, content_privilege_code: obj.code }
        } else {
          new_item = { ...item }
        }
        return new_item
      })
      let new_drawContent = { ...drawContent, privileges: new_privileges }
      dispatch({
        type: 'projectDetailTask/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
    }

    // ?????????????????????
    if (obj && obj.type == 'privilege') {
      let new_privileges = [...privileges]
      for (let item in obj) {
        if (item == 'privileges') {
          // eslint-disable-next-line no-loop-func
          obj[item].map(val => {
            let temp_arr = arrayNonRepeatfy([].concat(...privileges, val))
            if (temp_arr && !temp_arr.length) return false
            return (new_privileges = [...temp_arr])
          })
        }
      }
      let new_drawContent = {
        ...drawContent,
        is_privilege: obj.is_privilege,
        privileges: new_privileges
      }
      dispatch({
        type: 'projectDetailTask/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
    }

    // ??????????????????
    dispatch({
      type: 'projectDetailTask/getTaskGroupList',
      payload: {
        type: '2',
        arrange_type: getTaskGroupListArrangeType
          ? getTaskGroupListArrangeType
          : '1',
        board_id: board_id
      }
    })
    // ????????????????????????
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id
      }
    })
  }

  /**
   * ?????????????????????
   * @param {Array} users_arr ?????????????????????
   */
  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { user_id } = user_set
    const { drawContent = {} } = this.props
    const { card_id, privileges = [] } = drawContent
    const content_id = card_id
    const content_type = 'card'
    let temp_ids = [] // ???????????????????????????id
    let new_ids = [] // ?????????????????????????????????id
    let new_privileges = [...privileges]

    // ???????????????????????????id??????
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
      content_id,
      content_type,
      privilege_code: 'read',
      user_ids: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
        setTimeout(() => {
          message.success('??????????????????')
        }, 500)
        let temp_arr = []
        temp_arr.push(res.data)
        this.visitControlUpdateCurrentModalData({
          privileges: temp_arr,
          type: 'add'
        })
      } else {
        message.warn(res.message)
      }
    })
  }

  /**
   * ????????????????????????
   * @param {String} id ?????????????????????id
   */
  handleVisitControlRemoveContentPrivilege = id => {
    let temp_id = []
    temp_id.push(id)
    removeContentPrivilege({ id: id }).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        setTimeout(() => {
          message.success('??????????????????')
        }, 500)
        this.visitControlUpdateCurrentModalData({
          removeId: id,
          type: 'remove'
        })
      } else {
        message.warn(res.message)
      }
    })
  }

  /**
   * ??????????????????????????????
   * @param {String} id ?????????????????????id
   * @param {String} type ???????????????????????????
   */
  handleVisitControlChangeContentPrivilege = (id, type) => {
    const { drawContent = {} } = this.props
    const { card_id } = drawContent
    let temp_id = []
    temp_id.push(id)
    const obj = {
      content_id: card_id,
      content_type: 'card',
      privilege_code: type,
      user_ids: temp_id
    }
    setContentPrivilege(obj).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        setTimeout(() => {
          message.success('????????????')
        }, 500)
        let temp_arr = []
        temp_arr = res && res.data[0]
        this.visitControlUpdateCurrentModalData({
          temp_arr: temp_arr,
          type: 'change',
          code: type
        })
      } else {
        message.warn(res.message)
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
      this.handleVisitControlChangeContentPrivilege(id, type)
    }
  }

  //?????????
  renderMiletonesMenu = () => {
    const { milestoneList = [] } = this.props
    return (
      <Menu onClick={this.setRelaMiletones}>
        {milestoneList.map(value => {
          const { id, name, deadline } = value
          return <Menu.Item key={`${id}__${deadline}`}>{name}</Menu.Item>
        })}
      </Menu>
    )
  }
  setRelaMiletones = e => {
    const id_time_arr = e.key.split('__')
    const id = id_time_arr[0]
    const deadline = id_time_arr[1]
    const { drawContent = {} } = this.props
    const { card_id, type, due_time } = drawContent
    if (!compareTwoTimestamp(deadline, due_time)) {
      message.warn('???????????????????????????????????????????????????????????????')
      return
    }

    const params = {
      rela_id: card_id,
      id,
      origin_type: type
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailTask/taskRelaMiletones',
      payload: {
        ...params
      }
    })
  }
  cancelRelaMiletone = ({ card_id, id }) => {
    const params = {
      rela_id: card_id,
      id
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailTask/taskCancelRelaMiletones',
      payload: {
        ...params
      }
    })
  }
  addMenbersInProject = data => {
    // console.log(data, 'ssss')
  }
  render() {
    that = this
    const {
      titleIsEdit,
      isInEdit,
      isInAddTag,
      isSetedAlarm,
      alarmTime,
      brafitEditHtml,
      attachment_fileList,
      excutorsOut_left_width,
      onlyReadingShareModalVisible,
      onlyReadingShareData
    } = this.state

    //drawContent  ??????taskGroupList???????????????????????????????????????taskGroupList??????????????????taskGroupListIndex??????????????????????????????????????????
    const {
      relations_Prefix = [],
      isInOpenFile,
      drawContent = {},
      projectDetailInfoData = {},
      projectGoupList = [],
      taskGroupList = [],
      taskGroupListIndex = 0,
      boardTagList = [],
      dispatch
    } = this.props

    const { data = [], board_name, board_id } = projectDetailInfoData //?????????????????????
    const { list_name } = taskGroupList[taskGroupListIndex] || {}

    let {
      milestone_data = {},
      card_id,
      card_name,
      child_data = [],
      type = '0',
      start_time,
      due_time,
      description,
      label_data = [],
      is_realize = '0',
      executors = [],
      privileges = [],
      is_privilege = '0',
      is_shared
    } = drawContent
    if (executors.length) {
    }
    label_data = label_data || []
    // description = description //|| '<p style="font-size: 14px;color: #595959; cursor: pointer ">????????????</p>'
    const editorState = BraftEditor.createEditorState(brafitEditHtml)

    const editorProps = {
      height: 0,
      contentFormat: 'html',
      value: editorState,
      media: { uploadFn: this.myUploadFn },
      onChange: e => {
        this.setState({
          brafitEditHtml: e
        })
      },
      fontSizes: [14],
      controls: [
        'text-color',
        'bold',
        'italic',
        'underline',
        'strike-through',
        'text-align',
        'list_ul',
        'list_ol',
        'blockquote',
        'code',
        'split',
        'media'
      ]
    }
    const alarmMenu = (
      <Menu onClick={this.alarmMenuClick.bind(this)}>
        <Menu.Item key="1">15?????????</Menu.Item>
        <Menu.Item key="2">30?????????</Menu.Item>
        <Menu.Item key="3">1?????????</Menu.Item>
        <Menu.Item key="4">1??????</Menu.Item>
        <Menu.Item key="5" disabled>
          ${currentNounPlanFilterName(TASKS)}?????????
        </Menu.Item>
        <Menu.Item key="6" disabled>
          ${currentNounPlanFilterName(TASKS)}?????????
        </Menu.Item>
      </Menu>
    )

    const projectGroupMenu = (
      <Menu onClick={this.projectGroupMenuClick.bind(this)} mode="vertical">
        {projectGoupList.map((value, key) => {
          const { list_data } = value
          return (
            <SubMenu key={key} title={<span>{value.board_name}</span>}>
              {list_data.map((value2, key2) => {
                return <Menu.Item key={key2}>{value2.list_name}</Menu.Item>
              })}
            </SubMenu>
          )
        })}
      </Menu>
    )

    const topRightMenu = (
      <Menu onClick={this.topRightMenuClick.bind(this)}>
        <Menu.Item
          key={'1'}
          style={{ textAlign: 'center', padding: 0, margin: 0 }}
        >
          <div className={DrawerContentStyles.elseProjectMemu}>
            ??????{currentNounPlanFilterName(TASKS)}
          </div>
        </Menu.Item>
        {checkIsHasPermissionInVisitControl(
          'edit',
          privileges,
          is_privilege,
          executors,
          checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_DELETE, board_id)
        ) && (
          <Menu.Item
            key={'2'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={DrawerContentStyles.elseProjectDangerMenu}>
              ??????{currentNounPlanFilterName(TASKS)}
            </div>
          </Menu.Item>
        )}
      </Menu>
    )

    const uploadProps = {
      name: 'file',
      fileList: attachment_fileList,
      withCredentials: true,
      action: `${REQUEST_DOMAIN_BOARD}/card/attachment/upload`,
      multiple: true,
      data: {
        card_id
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({ contentDataType: CONTENT_DATA_TYPE_CARD })
      },
      showUploadList: true, //showUploadList,
      beforeUpload(e) {
        if (e.size == 0) {
          message.error(`?????????????????????`)
          return false
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`??????????????????????????????${UPLOAD_FILE_SIZE}MB`)
          return false
        }
        that.setState({
          showUploadList: true
        })
      },
      onChange({ file, fileList }) {
        if (file.size == 0) {
          return false
        } else if (file.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          return false
        }
        // console.log('event', file)
        if (file.status === 'done' && file.response.code === '0') {
          for (let i = 0; i < fileList.length; i++) {
            if (file.uid == fileList[i].uid) {
              fileList.splice(i, 1, { ...file, ...file.response.data })
            }
          }
        } else if (
          file.status === 'error' ||
          (file.response && file.response.code !== '0')
        ) {
          for (let i = 0; i < fileList.length; i++) {
            if (file.uid == fileList[i].uid) {
              fileList.splice(i, 1)
            }
          }
          message.error((file.response && file.response.message) || '????????????')
          // fileList.pop()
        }

        if (file.status === 'done') {
          that.setState({
            showUploadList: false
          })
        }

        that.setState({
          attachment_fileList: fileList
        })

        setTimeout(function() {
          const drawContentNew = { ...drawContent }
          drawContentNew['attachment_data'] = fileList
          // that.props.updateDatasTask({ drawContent: drawContentNew })
          dispatch({
            type: 'projectDetailTask/updateDatas',
            payload: {
              drawContent: drawContentNew
            }
          })
        }, 300)
      },
      onPreview(e) {
        const file_name = e.name
        const file_resource_id =
          e.file_resource_id || e.response.data.file_resource_id
        const file_id = e.file_id || e.response.data.file_id

        that.setState({
          previewFileType: 'attachment'
        })

        dispatch({
          type: 'projectDetailFile/updateDatas',
          payload: {
            seeFileInput: 'taskModule',
            isInOpenFile: true,
            filePreviewCurrentId: file_resource_id,
            filePreviewCurrentFileId: file_id,
            pdfDownLoadSrc: ''
          }
        })
        if (getSubfixName(file_name) == '.pdf') {
          dispatch({
            type: 'projectDetailFile/getFilePDFInfo',
            payload: {
              id: file_id
            }
          })
        } else {
          dispatch({
            type: 'projectDetailFile/filePreview',
            payload: {
              id: file_resource_id,
              file_id
            }
          })
        }
      },
      onRemove(e) {
        const attachment_id =
          e.id ||
          (e.response && e.response.data && e.response.data.attachment_id)
        if (!attachment_id) {
          return
        }
        return new Promise((resolve, reject) => {
          deleteTaskFile({ attachment_id })
            .then(value => {
              if (value.code !== '0') {
                message.warn('?????????????????????????????????')
                reject()
              } else {
                resolve()
              }
            })
            .catch(() => {
              message.warn('?????????????????????????????????')
              reject()
            })
        })
      }
    }

    //????????????????????? ?????????
    const { excutorsOut_left = {} } = this.refs
    const excutorsOut_left_width_new = excutorsOut_left.clientWidth

    return (
      //
      <div style={{ position: 'relative' }}>
        {/* <div className={globalStyle.drawContent_mask}></div> */}
        <div
          className={DrawerContentStyles.DrawerContentOut}
          onClick={this.drawerContentOutClick.bind(this)}
        >
          <div style={{ height: 'auto', width: '100%', position: 'relative' }}>
            {/*???????????????????????????*/}
            {/* {checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT) ? ('') : (
              <div style={{ height: '100%', width: '100%', position: 'absolute', zIndex: '3', left: 20, top: 20 }} onClick={this.alarmNoEditPermission.bind(this)}></div>
            )} */}
            {/* ???????????????????????????????????????????????????, ????????????code?????????edit */}
            {/* {checkIsHasPermissionInVisitControl('edit', privileges, drawContent.is_privilege, drawContent.executors, checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, board_id)) ? ('') : (
              <div style={{ height: '100%', width: '100%', position: 'absolute', zIndex: '3', left: 20, top: '20px' }} onClick={this.alarmNoEditPermission.bind(this)}></div>
            )} */}
            {/*????????????*/}
            <div
              className={DrawerContentStyles.divContent_1}
              style={{ position: 'relative' }}
            >
              {/* {checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT) ? ('') : (
                <div style={{ height: '100%', width: '70%', position: 'absolute', zIndex: '3' }} onClick={this.alarmNoEditPermission.bind(this)}></div>
              )} */}
              <div
                className={DrawerContentStyles.contain_1}
                style={{ position: 'relative' }}
              >
                {/* {checkIsHasPermissionInVisitControl('edit', privileges, drawContent.is_privilege, drawContent.executors, checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, board_id)) ? ('') : (
                  <div className={globalStyle.drawContent_mask} style={{ left: 20 }} onClick={this.alarmNoEditPermission}></div>
                )} */}
                <span style={{ position: 'relative' }}>
                  {checkIsHasPermissionInVisitControl(
                    'edit',
                    privileges,
                    drawContent.is_privilege,
                    drawContent.executors,
                    checkIsHasPermissionInBoard(
                      PROJECT_TEAM_CARD_EDIT,
                      board_id
                    )
                  ) ? (
                    ''
                  ) : (
                    <div
                      className={globalStyle.drawContent_mask}
                      onClick={this.alarmNoEditPermission}
                    ></div>
                  )}
                  <Dropdown overlay={projectGroupMenu}>
                    <div
                      className={DrawerContentStyles.left}
                      style={{ position: 'relative' }}
                    >
                      <span>{board_name} </span> <Icon type="right" />{' '}
                      <span>{list_name}</span>
                    </div>
                  </Dropdown>
                </span>

                <div className={DrawerContentStyles.right}>
                  {card_id ? (
                    <div style={{ alignItems: 'center', display: 'flex' }}>
                      <span>
                        {is_shared === '1' ? (
                          <p
                            className={
                              DrawerContentStyles.right__shareIndicator
                            }
                            onClick={
                              this.handleChangeOnlyReadingShareModalVisible
                            }
                          >
                            <span
                              className={
                                DrawerContentStyles.right__shareIndicator_icon
                              }
                            ></span>
                            <span
                              className={
                                DrawerContentStyles.right__shareIndicator_text
                              }
                            >
                              ????????????
                            </span>
                          </p>
                        ) : null}
                      </span>

                      <span
                        style={{
                          marginTop: '-5px',
                          marginRight: '10px',
                          position: 'relative',
                          width: '12px',
                          height: '12px'
                        }}
                      >
                        <ShareAndInvite
                          is_shared={is_shared}
                          onlyReadingShareModalVisible={
                            onlyReadingShareModalVisible
                          }
                          handleChangeOnlyReadingShareModalVisible={
                            this.handleChangeOnlyReadingShareModalVisible
                          }
                          data={onlyReadingShareData}
                          handleOnlyReadingShareExpChangeOrStopShare={
                            this.handleOnlyReadingShareExpChangeOrStopShare
                          }
                        />
                      </span>
                    </div>
                  ) : (
                    ''
                  )}

                  <span style={{ position: 'relative' }}>
                    {checkIsHasPermissionInVisitControl(
                      'edit',
                      privileges,
                      drawContent.is_privilege,
                      drawContent.executors,
                      checkIsHasPermissionInBoard(
                        PROJECT_TEAM_CARD_EDIT,
                        board_id
                      )
                    ) ? (
                      ''
                    ) : (
                      <div
                        className={globalStyle.drawContent_mask}
                        onClick={this.alarmNoEditPermission}
                      ></div>
                    )}
                    <InformRemind
                      projectExecutors={drawContent.executors}
                      rela_id={card_id}
                      rela_type={type == '0' ? '1' : '2'}
                      user_remind_info={data}
                    />
                  </span>

                  {/* <Dropdown overlay={topRightMenu}> */}
                  {drawContent.is_privilege && (
                    <span
                      style={{
                        marginRight:
                          drawContent.is_privilege === '1' ? '46px' : '20px'
                      }}
                    >
                      <VisitControl
                        board_id={board_id}
                        isPropVisitControl={
                          drawContent.is_privilege === '0' ? false : true
                        }
                        handleVisitControlChange={this.handleVisitControlChange}
                        principalList={drawContent.executors}
                        otherPrivilege={drawContent.privileges}
                        handleClickedOtherPersonListOperatorItem={
                          this.handleClickedOtherPersonListOperatorItem
                        }
                        id={drawContent.card_id}
                        handleAddNewMember={this.handleVisitControlAddNewMember}
                      />
                    </span>
                  )}
                  {/* </Dropdown> */}
                  <Dropdown overlay={topRightMenu}>
                    <Icon
                      type="ellipsis"
                      style={{ fontSize: 20, marginTop: 2, cursor: 'pointer' }}
                    />
                    {/*</Dropdown>*/}
                  </Dropdown>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              {checkIsHasPermissionInVisitControl(
                'edit',
                privileges,
                drawContent.is_privilege,
                drawContent.executors,
                checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, board_id)
              ) ? (
                ''
              ) : (
                <div
                  className={globalStyle.drawContent_mask}
                  onClick={this.alarmNoEditPermission}
                ></div>
              )}
              {/*??????*/}
              <div className={DrawerContentStyles.divContent_2}>
                <div className={DrawerContentStyles.contain_2}>
                  {type === '0' ? (
                    <div
                      onClick={this.setIsCheck.bind(this)}
                      className={
                        is_realize === '1'
                          ? DrawerContentStyles.nomalCheckBoxActive
                          : DrawerContentStyles.nomalCheckBox
                      }
                      style={{ width: 24, height: 24 }}
                    >
                      <Icon
                        type="check"
                        style={{
                          color: '#FFFFFF',
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 2
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: 24, height: 24, color: '#595959' }}>
                      <i className={globalStyle.authTheme}>&#xe709;</i>
                    </div>
                  )}

                  {/*<TextArea defaultValue={card_name}*/}
                  {/*autosize*/}
                  {/*onBlur={this.titleTextAreaChangeBlur.bind(this)}*/}
                  {/*onClick={this.setTitleIsEdit.bind(this, true)}*/}
                  {/*autoFocus={true}*/}
                  {/*maxLength={100}*/}
                  {/*style={{display: 'block', fontSize: 20, color: '#262626', resize: 'none', marginLeft: -4, padding: '0 4px'}}*/}
                  {/*/>*/}
                  {!titleIsEdit ? (
                    <div
                      className={DrawerContentStyles.contain_2_title}
                      onClick={this.setTitleIsEdit.bind(this, true)}
                    >
                      {card_name}
                    </div>
                  ) : (
                    <NameChangeInput
                      autosize
                      onBlur={this.titleTextAreaChangeBlur.bind(this)}
                      onClick={this.setTitleIsEdit.bind(this, true)}
                      setIsEdit={this.setTitleIsEdit.bind(this, true)}
                      autoFocus={true}
                      goldName={card_name}
                      maxLength={100}
                      nodeName={'textarea'}
                      style={{
                        display: 'block',
                        fontSize: 20,
                        color: '#262626',
                        resize: 'none',
                        marginLeft: -4,
                        padding: '0 4px'
                      }}
                    />
                  )}
                </div>
              </div>
              {/*<MeusearMutiple listData={data} keyCode={'user_id'}searchName={'name'} currentSelect = {executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>*/}
              {/*???????????????*/}
              <div className={DrawerContentStyles.divContent_1}>
                <div className={DrawerContentStyles.contain_3}>
                  <div>
                    {!executors.length ? (
                      <div>
                        <span onClick={this.setChargeManIsSelf.bind(this)}>
                          ??????
                        </span>
                        &nbsp;<span style={{ color: '#bfbfbf' }}>???</span>&nbsp;
                        <Dropdown
                          overlay={
                            <MenuSearchPartner
                              // addMenbersInProject={this.addMenbersInProject}
                              invitationType="4"
                              invitationId={card_id}
                              invitationOrg={drawContent.org_id}
                              listData={data}
                              keyCode={'user_id'}
                              searchName={'name'}
                              currentSelect={executors}
                              chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(
                                this
                              )}
                              board_id={board_id}
                            />
                          }
                        >
                          <span>???????????????</span>
                        </Dropdown>
                      </div>
                    ) : (
                      <div className={DrawerContentStyles.excutorsOut}>
                        <Dropdown
                          overlay={
                            <MenuSearchPartner
                              invitationType="4"
                              invitationId={card_id}
                              invitationOrg={drawContent.org_id}
                              listData={data}
                              keyCode={'user_id'}
                              searchName={'name'}
                              currentSelect={executors}
                              chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(
                                this
                              )}
                              board_id={board_id}
                            />
                          }
                        >
                          <div
                            className={DrawerContentStyles.excutorsOut_left}
                            ref={'excutorsOut_left'}
                          >
                            {executors.map(value => {
                              const { avatar, name, user_name, user_id } = value
                              return (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  key={user_id}
                                >
                                  {avatar ? (
                                    <img
                                      style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 20,
                                        marginRight: 4
                                      }}
                                      src={avatar}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: 20,
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 20,
                                        backgroundColor: '#f5f5f5',
                                        marginRight: 4
                                      }}
                                    >
                                      <Icon
                                        type={'user'}
                                        style={{
                                          fontSize: 12,
                                          color: '#8c8c8c'
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div
                                    style={{
                                      overflow: 'hidden',
                                      verticalAlign: ' middle',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: 80,
                                      marginRight: 8
                                    }}
                                  >
                                    {name || user_name || '??????'}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </Dropdown>

                        <Dropdown
                          overlay={<ExcutorList listData={executors} />}
                        >
                          <div
                            className={DrawerContentStyles.excutorsOut_right}
                            style={{
                              backgroundColor:
                                (typeof excutorsOut_left_width === 'number' &&
                                  excutorsOut_left_width > 340) ||
                                (typeof excutorsOut_left_width_new ===
                                  'number' &&
                                  excutorsOut_left_width_new > 340)
                                  ? '#f5f5f5'
                                  : ''
                            }}
                          >
                            <Icon
                              type="ellipsis"
                              style={{
                                marginTop: 2,
                                display:
                                  (typeof excutorsOut_left_width === 'number' &&
                                    excutorsOut_left_width > 340) ||
                                  (typeof excutorsOut_left_width_new ===
                                    'number' &&
                                    excutorsOut_left_width_new > 340)
                                    ? 'block'
                                    : 'none'
                              }}
                            />
                          </div>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/*???????????????*/}
              <div className={DrawerContentStyles.divContent_1}>
                <div className={DrawerContentStyles.contain_3}>
                  {/*?????????*/}
                  {/* <div style={{ display: 'none' }}>
                    {!executor.user_id ? (
                      <div>
                        <span onClick={this.setChargeManIsSelf.bind(this)}>??????</span>&nbsp;<span style={{ color: '#bfbfbf' }}>???</span>&nbsp;
                     <Dropdown overlay={
                          <MenuSearchPartner
                            // addMenbersInProject={this.addMenbersInProject}
                            invitationType='4'
                            invitationId={card_id}
                            listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)} />}
                        >
                          <span>???????????????</span>
                        </Dropdown>
                      </div>
                    ) : (
                        <Dropdown overlay={
                          <MenuSearchPartner
                            // addMenbersInProject={this.addMenbersInProject}
                            invitationType='4'
                            invitationId={card_id}
                            listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)} />}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {executor.avatar ? (
                              <img style={{ width: 20, height: 20, borderRadius: 20, marginRight: 8 }} src={executor.avatar} />
                            ) : (
                                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 8, }}>
                                  <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                </div>
                              )}
                            <div style={{ overflow: 'hidden', verticalAlign: ' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80 }}>{executor.user_name || '??????'}</div>
                          </div>
                        </Dropdown>
                      )}
                  </div> */}
                  {/*??????*/}
                  <div style={{ display: 'none' }}>
                    <span style={{ color: '#bfbfbf' }}>
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                  </div>
                  <div>
                    {start_time && due_time ? (
                      ''
                    ) : (
                      <span style={{ color: '#bfbfbf' }}>??????</span>
                    )}
                    <span style={{ position: 'relative', cursor: 'pointer' }}>
                      &nbsp;
                      {start_time
                        ? timestampToTimeNormal(start_time, '/', true)
                        : '??????'}
                      <DatePicker
                        disabledDate={this.disabledStartTime.bind(this)}
                        onChange={this.startDatePickerChange.bind(this)}
                        placeholder={'????????????'}
                        format="YYYY/MM/DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        style={{
                          opacity: 0,
                          width: !start_time ? 16 : 100,
                          height: 20,
                          background: '#000000',
                          cursor: 'pointer',
                          position: 'absolute',
                          right: !start_time ? 8 : 0,
                          zIndex: 1
                        }}
                      />
                    </span>
                    &nbsp;
                    {start_time && due_time ? (
                      <span style={{ color: '#bfbfbf' }}>-</span>
                    ) : (
                      <span style={{ color: '#bfbfbf' }}>???</span>
                    )}
                    &nbsp;
                    <span style={{ position: 'relative' }}>
                      {due_time
                        ? timestampToTimeNormal(due_time, '/', true)
                        : '????????????'}
                      <DatePicker
                        disabledDate={this.disabledDueTime.bind(this)}
                        placeholder={'????????????'}
                        format="YYYY/MM/DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        onChange={this.endDatePickerChange.bind(this)}
                        style={{
                          opacity: 0,
                          width: !due_time ? 50 : 100,
                          cursor: 'pointer',
                          height: 20,
                          background: '#000000',
                          position: 'absolute',
                          right: 0,
                          zIndex: 1
                        }}
                      />
                    </span>
                  </div>
                  {type === '0' ? (
                    ''
                  ) : (
                    <div>
                      <span style={{ color: '#bfbfbf' }}>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                      </span>
                    </div>
                  )}
                  {type === '0' ? (
                    ''
                  ) : (
                    <div>
                      {/* <Dropdown overlay={meetingMenu}> */}
                      <span
                        onClick={e =>
                          this.handleCreateVideoMeeting(
                            card_name,
                            card_id,
                            executors,
                            e
                          )
                        }
                      >
                        ??????????????????
                      </span>
                      {/* </Dropdown> */}
                    </div>
                  )}
                  <div style={{ display: 'none' }}>
                    {!isSetedAlarm ? (
                      <Dropdown overlay={alarmMenu}>
                        <span>????????????</span>
                      </Dropdown>
                    ) : (
                      <Dropdown overlay={alarmMenu}>
                        <span>{alarmTime}</span>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>

              {/*?????????*/}
              {!isInEdit ? (
                <div className={DrawerContentStyles.divContent_1}>
                  <div style={{ marginTop: 20 }}>
                    <Button
                      size={'small'}
                      style={{ fontSize: 12 }}
                      onClick={this.goEdit.bind(this)}
                    >
                      ????????????
                    </Button>
                  </div>
                  {/*onClick={this.goEdit.bind(this)}*/}
                  <div
                    className={DrawerContentStyles.contain_4}
                    onClick={this.descriptionHTML.bind(this)}
                  >
                    <div
                      style={{ cursor: 'pointer' }}
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof description === 'object'
                            ? description.toHTML()
                            : description
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className={DrawerContentStyles.editorWraper}
                    onClick={this.editWrapClick.bind(this)}
                  >
                    <BraftEditor {...editorProps} style={{ fontSize: 12 }} />
                  </div>
                  <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <Button
                      size={'small'}
                      style={{ fontSize: 12, marginRight: 16 }}
                      type={'primary'}
                      onClick={this.saveBrafitEdit.bind(this)}
                    >
                      ??????
                    </Button>
                    <Button
                      size={'small'}
                      style={{ fontSize: 12 }}
                      onClick={this.quitBrafitEdit.bind(this)}
                    >
                      ??????
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/*??????*/}
            <div
              className={DrawerContentStyles.divContent_1}
              style={{ position: 'relative' }}
            >
              {checkIsHasPermissionInVisitControl(
                'edit',
                privileges,
                is_privilege,
                executors,
                checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, board_id)
              ) ? (
                ''
              ) : (
                <div
                  className={globalStyle.drawContent_mask}
                  style={{ left: 20, bottom: '22px' }}
                  onClick={this.alarmNoEditPermission}
                ></div>
              )}
              <ContentRaletion
                relations_Prefix={relations_Prefix}
                board_id={board_id}
                link_id={card_id}
                link_local={'3'}
              />
            </div>
            <div style={{ position: 'relative' }}>
              {checkIsHasPermissionInVisitControl(
                'edit',
                privileges,
                is_privilege,
                executors,
                checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, board_id)
              ) ? (
                ''
              ) : (
                <div
                  className={globalStyle.drawContent_mask}
                  style={{ left: 20 }}
                  onClick={this.alarmNoEditPermission}
                ></div>
              )}
              {/*???????????????*/}
              <div className={DrawerContentStyles.divContent_1}>
                <div className={DrawerContentStyles.miletones}>
                  {milestone_data['id'] ? (
                    <div className={DrawerContentStyles.miletones_item}>
                      <div
                        className={`${globalStyle.authTheme} ${DrawerContentStyles.miletones_item_logo}`}
                      >
                        &#xe633;
                      </div>
                      <div
                        className={`${globalStyle.global_ellipsis} ${DrawerContentStyles.miletones_item_name}`}
                      >
                        {milestone_data['name']}
                      </div>
                      <Popconfirm
                        title={'?????????????????????'}
                        onConfirm={() =>
                          this.cancelRelaMiletone({
                            card_id,
                            id: milestone_data['id']
                          })
                        }
                      >
                        <div
                          className={`${globalStyle.authTheme} ${DrawerContentStyles.miletones_item_delete}`}
                        >
                          &#xe70f;
                        </div>
                      </Popconfirm>
                    </div>
                  ) : (
                    <Dropdown overlay={this.renderMiletonesMenu()}>
                      <div
                        className={DrawerContentStyles.miletones_item_add}
                        style={{ marginTop: 8, width: 100 }}
                      >
                        <Icon type="plus" style={{ marginRight: 4 }} />
                        ?????????
                      </div>
                    </Dropdown>
                  )}
                </div>
              </div>

              {/*??????*/}
              <div className={DrawerContentStyles.divContent_1}>
                <div className={DrawerContentStyles.contain_5}>
                  {label_data.map((value, key) => {
                    let flag = false //??????????????????
                    for (let i = 0; i < boardTagList.length; i++) {
                      if (value['label_id'] == boardTagList[i]['id']) {
                        flag = true
                        break
                      }
                    }
                    const { label_color = '90,90,90' } = value
                    return (
                      flag && (
                        <Tag
                          closable
                          visible={true}
                          style={{
                            marginTop: 8,
                            color: `rgba(${label_color})`,
                            backgroundColor: `rgba(${label_color},0.1)`,
                            border: `1px solid rgba(${label_color},1)`
                          }}
                          onClose={this.tagClose.bind(this, {
                            label_id: value.label_id,
                            label_name: value.label_name,
                            key
                          })}
                          key={key}
                        >
                          {value.label_name}
                        </Tag>
                      )
                    )
                  })}

                  <div>
                    {!isInAddTag ? (
                      <div
                        className={DrawerContentStyles.contain_5_add}
                        style={{ marginTop: 8, width: 100 }}
                        onClick={this.addTag.bind(this)}
                      >
                        <Icon type="plus" style={{ marginRight: 4 }} />
                        ??????
                      </div>
                    ) : (
                      <Dropdown
                        visible={this.state.tagDropdownVisible}
                        overlay={
                          <TagDropDown
                            tagDropItemClick={this.tagDropItemClick.bind(this)}
                            tagInputValue={this.state.tagInputValue}
                          />
                        }
                      >
                        <div
                          style={{
                            marginTop: 8,
                            position: 'relative',
                            width: 'auto',
                            height: 'auto'
                          }}
                        >
                          <Input
                            autoFocus={true}
                            placeholder={'??????'}
                            style={{
                              height: 24,
                              paddingRight: 20,
                              fontSize: 14,
                              color: '#8c8c8c',
                              minWidth: 62,
                              maxWidth: 100
                            }}
                            onChange={this.setTagInputValue.bind(this)}
                            // onBlur={this.tagAddComplete.bind(this)}
                            maxLength={8}
                            onPressEnter={this.tagAddComplete.bind(this)}
                          />
                          <Icon
                            type={'close'}
                            style={{
                              position: 'absolute',
                              fontSize: 14,
                              cursor: 'pointer',
                              right: 6,
                              top: 4
                            }}
                            onClick={this.quitAddTag.bind(this)}
                          ></Icon>
                        </div>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>
              {child_data.length ? (
                <div className={DrawerContentStyles.divContent_1}>
                  <div className={DrawerContentStyles.spaceLine}></div>
                </div>
              ) : (
                ''
              )}

              {/*???????????????*/}
              <DCAddChirdrenTask />

              {/*??????????????????*/}
              <div
                className={`${DrawerContentStyles.divContent_1} ${DrawerContentStyles.attach_file_list_out}`}
              >
                <Upload {...uploadProps}>
                  <Button
                    size={'small'}
                    style={{ fontSize: 12, marginTop: 16 }}
                  >
                    <Icon type="upload" />
                    ??????{currentNounPlanFilterName(TASKS)}??????
                  </Button>
                </Upload>
                <div className={DrawerContentStyles.attach_file_list}>
                  {attachment_fileList.map(value => {
                    const { name, create_time, file_id, uid } = value
                    const now_time = new Date().getTime()
                    return (
                      <div
                        key={file_id || uid}
                        className={DrawerContentStyles.attach_file_item}
                        onClick={this.attachmentItemPreview.bind(this, value)}
                      >
                        <div
                          className={`${globalStyle.authTheme} ${DrawerContentStyles.link_pre}`}
                        >
                          &#xe632;
                        </div>
                        <div
                          className={DrawerContentStyles.attach_file_item_name}
                        >
                          {name}
                        </div>
                        <div className={DrawerContentStyles.attach_file_time}>
                          {timestampToTimeNormal(
                            create_time || now_time,
                            '/',
                            true
                          )}
                        </div>
                        <div
                          className={`${globalStyle.authTheme} ${DrawerContentStyles.link_opera}`}
                          onClick={this.attachmentItemOpera.bind(this, {
                            type: 'download',
                            data: value,
                            card_id
                          })}
                        >
                          &#xe7f1;
                        </div>
                        <div
                          className={`${globalStyle.authTheme} ${DrawerContentStyles.link_opera}`}
                          onClick={this.attachmentItemOpera.bind(this, {
                            type: 'remove',
                            data: value,
                            card_id
                          })}
                        >
                          &#xe70f;
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/*??????????????????*/}
              <PreviewFileModal modalVisible={isInOpenFile} />
              {/*??????*/}
              <PreviewFileModalRichText
                isUsable={this.state.isUsable}
                setPreivewProp={this.setPreivewProp.bind(this)}
                previewFileType={this.state.previewFileType}
                previewFileSrc={this.state.previewFileSrc}
                modalVisible={this.state.previewFileModalVisibile}
                setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(
                  this
                )}
              />

              <div className={DrawerContentStyles.divContent_1}>
                <div className={DrawerContentStyles.spaceLine}></div>
              </div>
            </div>
          </div>
          {/*??????*/}
          <div
            className={DrawerContentStyles.divContent_2}
            style={{ marginTop: 20 }}
          >
            <Comment {...this.props} leftSpaceDivWH={26}></Comment>
          </div>
          <div style={{ height: 100 }}></div>
        </div>
        {/*??????*/}
        {/* <div className={DrawerContentStyles.divContent_2} style={{ marginTop: 20 }}>
          <Comment leftSpaceDivWH={26}></Comment>
        </div>
        <div style={{ height: 100 }}></div> */}
      </div>
    )
  }
}

export default withRouter(DrawContent)

function mapStateToProps({
  projectDetailTask: {
    datas: {
      drawContent = {},
      projectGoupList = [],
      taskGroupListIndex = 0,
      taskGroupListIndex_index = 0,
      taskGroupList = [],
      getTaskGroupListArrangeType,
      boardTagList = [],
      relationTaskList = []
    }
  },
  projectDetail: {
    datas: {
      projectDetailInfoData = {},
      milestoneList = [],
      relations_Prefix = []
    }
  },
  projectDetailFile: {
    datas: { isInOpenFile }
  },
  technological: {
    datas: { userBoardPermissions }
  }
}) {
  return {
    drawContent,
    projectGoupList,
    projectDetailInfoData,
    taskGroupListIndex,
    taskGroupListIndex_index,
    taskGroupList,
    milestoneList,
    getTaskGroupListArrangeType,
    isInOpenFile,
    boardTagList,
    relationTaskList,
    relations_Prefix,
    userBoardPermissions
  }
}
