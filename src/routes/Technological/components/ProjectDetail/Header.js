/*eslint-disable*/
import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'

import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  ORG_TEAM_BOARD_JOIN,
  PROJECT_FILES_FILE_INTERVIEW,
  PROJECT_TEAM_CARD_INTERVIEW,
  UPLOAD_FILE_SIZE,
  PROJECT_TEAM_BOARD_EDIT,
  PROJECT_TEAM_BOARD_ARCHIVE,
  PROJECT_TEAM_BOARD_DELETE,
  PROJECT_TEAM_BOARD_MEMBER,
  ORG_TEAM_BOARD_QUERY,
  PROJECT_FLOW_FLOW_ACCESS,
  PROJECT_FILES_FILE_UPLOAD,
  PROJECT_FILES_FILE_DOWNLOAD,
  PROJECT_FILES_FOLDER,
  ORG_UPMS_ORGANIZATION_DELETE,
  PROJECT_FILES_FILE_DELETE,
  PROJECT_FILES_FILE_EDIT
} from '../../../../globalset/js/constant'
import {
  Icon,
  Menu,
  Dropdown,
  Tooltip,
  Modal,
  Checkbox,
  Upload,
  Button,
  message,
  Input
} from 'antd'
import ShowAddMenberModal from '../Project/ShowAddMenberModal'
import { REQUEST_DOMAIN_FILE } from '../../../../globalset/js/constant'
import Cookies from 'js-cookie'
import MenuSearch from '../TecPublic/MenuSearch'
import {
  checkIsHasPermissionInBoard,
  checkIsHasPermission,
  checkIsHasPermissionInVisitControl
} from '../../../../utils/businessFunction'
import {
  ORGANIZATION,
  TASKS,
  FLOWS,
  DASHBOARD,
  PROJECTS,
  FILES,
  MEMBERS,
  CATCH_UP
} from '../../../../globalset/js/constant'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction'
import AddModalForm from './components/AddModalForm'
import DetailInfo from './DetailInfo'
import VisitControl from './../../components/VisitControl/index'
import {
  toggleContentPrivilege,
  setContentPrivilege,
  removeContentPrivilege
} from './../../../../services/technological/project'
import LcbInHeader from './components/LcbInHeader/index'
import { setUploadHeaderBaseInfo } from '@/utils/businessFunction'
import globalStyle from '@/globalset/css/globalClassName.less'
import { connect } from 'dva/index'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
import { arrayNonRepeatfy } from '../../../../utils/util'
// import { lx_utils } from 'lingxi-im'

let is_starinit = null

@connect(mapStateToProps)
export default class Header extends React.Component {
  state = {
    isInitEntry: true, // isinitEntry isCollection??????????????????
    isCollection: false,
    ShowAddMenberModalVisibile: false,
    AddModalFormVisibile: false,
    ellipsisShow: false, //????????????...??????
    dropdownVisibleChangeValue: false, //????????????...????????????????????????
    //????????????????????????state
    localBoardName: '',
    isInEditBoardName: false,
    isShouldBeDropdownVisible: false,

    projectDetailInfoVisible: false // ????????????????????????????????? ????????? false ?????????
  }
  componentWillMount() {
    //????????????????????????
    this.initSet(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.initSet(nextProps)
  }
  //???????????????props??????state
  initSet(props) {
    const { projectDetailInfoData = {} } = props
    const { board_name } = projectDetailInfoData
    this.setState({
      localBoardName: board_name
    })
  }
  //????????????----------------start
  //??????????????????---start
  setIsInEditBoardName() {
    this.setState({
      isInEditBoardName: !this.state.isInEditBoardName
    })
  }
  localBoardNameChange(e) {
    this.setState({
      localBoardName: e.target.value
    })
  }
  editBoardNameComplete(e) {
    this.setIsInEditBoardName()
    const { projectDetailInfoData = {} } = this.props
    const { board_id } = projectDetailInfoData
    const { board_name } = projectDetailInfoData
    const { localBoardName } = this.state
    if (localBoardName == board_name) {
      return false
    }
    if (!localBoardName) {
      this.setState({
        localBoardName: board_name
      })
      return false
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/updateProject',
      payload: {
        board_id: board_id,
        name: this.state.localBoardName
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        // lx_utils.editBoardName({
        //   board_id: board_id,
        //   name: this.state.localBoardName
        // })
      }
    })
  }
  //??????????????????---end

  setProjectInfoDisplay() {
    const { projectInfoDisplay } = this.props
    const { dispatch } = this.props
    this.setProjectDetailInfoModalVisible()

    dispatch({
      type: 'projectDetail/updateDatas',
      payload: {
        projectInfoDisplay: !projectInfoDisplay,
        isInitEntry: true
      }
    })
  }
  gobackToProject() {
    // window.history.go(-1)
    const defferBoardDetailRoute = localStorage.getItem(
      'defferBoardDetailRoute'
    )
    const { dispatch } = this.props
    if (defferBoardDetailRoute) {
      dispatch({
        type: 'projectDetail/routingJump',
        payload: {
          route: defferBoardDetailRoute
        }
      })
    } else {
      dispatch({
        type: 'projectDetail/routingJump',
        payload: {
          route: '/technological/project'
        }
      })
    }
  }
  //??????confirm-------------start
  setIsSoundsEvrybody(e) {
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm(board_id) {
    const that = this
    const { projectDetailInfoData = {} } = this.props
    const { org_id } = projectDetailInfoData
    // if (!checkIsHasPermission(ORG_TEAM_BOARD_JOIN, org_id)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    Modal.confirm({
      title: `??????????????????${currentNounPlanFilterName(PROJECTS)}??????`,
      content: (
        <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
          <span>
            ???????????????????????????{currentNounPlanFilterName(PROJECTS)}???????????????
          </span>
          {/*<div style={{marginTop:20,}}>*/}
          {/*<Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>???????????????????????????</Checkbox>*/}
          {/*</div>*/}
        </div>
      ),
      zIndex: 2000,
      okText: '??????',
      cancelText: '??????',
      onOk() {
        const { dispatch } = that.props
        dispatch({
          type: 'projectDetail/quitProject',
          payload: {
            board_id,
            isJump: true
          }
        })
      }
    })
  }
  confirm_2(board_id, type) {
    const that = this
    const { dispatch } = this.props

    let defineNoun = '??????'
    switch (type) {
      case '0':
        defineNoun = '??????'
        break
      case '1':
        defineNoun = '??????'
        break
      default:
        break
    }
    Modal.confirm({
      title: `?????????${defineNoun}???${currentNounPlanFilterName(PROJECTS)}??????`,
      zIndex: 2000,
      okText: '??????',
      cancelText: '??????',
      onOk() {
        if (type === '1') {
          dispatch({
            type: 'projectDetail/archivedProject',
            payload: {
              board_id,
              is_archived: '1'
            }
          })
        } else if (type === '0') {
          dispatch({
            type: 'projectDetail/deleteProject',
            payload: {
              id: board_id,
              isJump: true
            }
          })
        }
      }
    })
  }

  //??????confirm-------------end
  //???????????????????????????
  setShowAddMenberModalVisibile() {
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }
  setAddModalFormVisibile() {
    this.setState({
      AddModalFormVisibile: !this.state.AddModalFormVisibile
    })
  }
  //??????????????????
  handleMenuClick(board_id, e) {
    e.domEvent.stopPropagation()
    this.setState({
      ellipsisShow: false,
      dropdownVisibleChangeValue: false
    })
    const { key } = e
    switch (key) {
      case '1':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.setShowAddMenberModalVisibile()
        break
      case '2':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_ARCHIVE)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.confirm_2(board_id, '1')
        break
      case '3':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_DELETE)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.confirm_2(board_id, '0')
        break
      case '4':
        this.confirm(board_id)
        break
      case '5':
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_EDIT)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.setAddModalFormVisibile()
        break
      default:
        return
    }
  }
  //??????
  starClick({ board_id }, e) {
    const { projectDetailInfoData = {} } = this.props
    const { org_id } = projectDetailInfoData
    const { dispatch } = this.props
    // if(!checkIsHasPermission(ORG_TEAM_BOARD_QUERY, org_id)){
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    e.stopPropagation()
    this.setState(
      {
        isInitEntry: false
      },
      function() {
        this.setState(
          {
            isCollection:
              is_starinit === '1'
                ? false
                : this.state.isInitEntry
                ? false
                : !this.state.isCollection,
            starOpacity: 1
          },
          function() {
            if (this.state.isCollection) {
              dispatch({
                type: 'projectDetail/collectionProject',
                payload: {
                  org_id,
                  board_id
                }
              })
            } else {
              dispatch({
                type: 'projectDetail/cancelCollection',
                payload: {
                  org_id,
                  board_id
                }
              })
            }
          }
        )
      }
    )
  }
  //...??????????????????
  ellipsisClick(e) {
    e.stopPropagation()
  }
  setEllipsisShow() {
    this.setState({
      ellipsisShow: true
    })
  }
  setEllipsisHide() {
    this.setState({
      ellipsisShow: false
    })
  }
  toggleDropdownVisible = () => {
    const { dropdownVisibleChangeValue } = this.state
    this.setState({
      dropdownVisibleChangeValue: !dropdownVisibleChangeValue
    })
  }
  onDropdownVisibleChange(visible) {
    const { isShouldBeDropdownVisible } = this.state
    if (isShouldBeDropdownVisible) return
    this.setState({
      dropdownVisibleChangeValue: visible
    })
  }
  //????????????---------------end

  //??????????????????-----------------start
  //??????app????????????
  appClick(key) {
    if (key === '2') {
      //??????
      // if (!checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS)) {
      //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      //   return false
      // }
    } else if (key === '3') {
      // ??????
      // if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW)) {
      //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      //   return false
      // }
    } else if (key === '4') {
      //??????
      // if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW)) {
      //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      //   return false
      // }
    } else {
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/updateDatas',
      payload: {
        appsSelectKey: key
      }
    })
    dispatch({
      type: 'projectDetail/appsSelect',
      payload: {
        appsSelectKey: key
      }
    })
  }
  //????????????----start
  quitOperateFile() {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        selectedRowKeys: [],
        selectedRows: []
      }
    })
  }
  reverseSelection() {
    const {
      selectedRowKeys = [],
      selectedRows = [],
      fileList = []
    } = this.props
    const { dispatch } = this.props
    const newSelectedRowKeys = []
    for (let i = 0; i < fileList.length; i++) {
      for (let val of selectedRowKeys) {
        if (val !== i) {
          // console.log(i)
          newSelectedRowKeys.push(i)
        }
      }
    }
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        selectedRowKeys: newSelectedRowKeys
      }
    })
  }
  createDirectory() {
    if (!checkIsHasPermissionInBoard(PROJECT_FILES_FOLDER)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const {
      fileList = [],
      filedata_1 = [],
      isInAddDirectory = false
    } = this.props
    if (isInAddDirectory) {
      //??????????????????????????????????????????
      return false
    }
    const new_fileList_ = [...fileList]
    const new_filedata_1_ = [...filedata_1]

    const obj = {
      file_id: '',
      file_name: '',
      file_size: '-',
      update_time: '-',
      creator: `-`,
      type: '1',
      isInAdd: true
    }
    new_fileList_.unshift(obj)
    new_filedata_1_.unshift(obj)
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        fileList: new_fileList_,
        filedata_1: new_filedata_1_,
        isInAddDirectory: true
      }
    })
  }
  collectionFile() {}

  /**
   * ?????????????????????????????????????????????????????????????????????, ???????????????boolean????????????
   * @returns {Boolean} true????????????????????? false??????????????????
   */
  getSelectedRows = () => {
    const { selectedRows = [] } = this.props
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { user_id } = user_set
    let newSelectedRows = [...selectedRows]
    let flag
    let temp_arr = []
    let temp_code = []
    // ??????????????????????????????????????????
    newSelectedRows = newSelectedRows.filter(item => {
      if (item.privileges && item.privileges.length) {
        temp_arr.push(...item.privileges)
      }
      return temp_arr
    })
    // ??????????????????????????????????????????
    if (!(temp_arr && temp_arr.length)) return (flag = false)
    let new_arr = []
    // ????????????????????????????????????
    temp_arr &&
      temp_arr.map(item => {
        let { id } = item && item.user_info
        if (id == user_id) {
          new_arr.push(item)
        }
        return new_arr
      })
    // ???????????????,????????????read,????????????????????????
    new_arr &&
      new_arr.map(item => {
        temp_code.push(item.content_privilege_code)
        return temp_code
      })
    if (temp_code.indexOf('read') != -1 || temp_code.indexOf('comment') != -1) {
      flag = false
    } else {
      flag = true
    }

    return flag
  }

  downLoadFile() {
    // if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_DOWNLOAD)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    if (this.getSelectedRows()) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    } else if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_DOWNLOAD)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const {
      fileList,
      selectedRowKeys,
      selectedRows,
      projectDetailInfoData = {}
    } = this.props
    const { board_id, is_privilege, privileges = [] } = projectDetailInfoData
    const { dispatch } = this.props
    let chooseArray = []
    // for (let i = 0; i < selectedRows.length; i++) {
    //   // chooseArray.push(fileList[selectedRows[i]].file_resource_id)

    // }
    selectedRows.map((item, i) => {
      chooseArray.push(item.file_resource_id)
      return chooseArray
    })
    const ids = chooseArray.join(',')
    if (!(ids && ids.length)) return
    dispatch({
      type: 'projectDetailFile/fileDownload',
      payload: {
        ids
      }
    })
    //??????????????????????????????mp3????????????????????????????????????????????????????????????3????????????
    // let mp3arr = ["http://pe96wftsc.bkt.clouddn.com/ea416183ad91220856c8ff792e5132e1.zip?e=1536660365&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:XK9eRCWcG8yDztiL7zct2jrpIvc=","http://pe96wftsc.bkt.clouddn.com/2fc83d8439ab0d4507dc7154f3d50d3.pdf?e=1536659325&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:DGertCGKCr3Y407F6fY9ZGgkP4M=", "http://pe96wftsc.bkt.clouddn.com/ec611c887680f9264bb5db8e4cb33141.docx?e=1536659379&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:9IkALD1DjOBvQtv3uAvtzk5y694=",];

    // const download = (name, href) => {
    //   var a = document.createElement("a"), //??????a??????
    //     e = document.createEvent("MouseEvents"); //????????????????????????
    //   e.initEvent("click", false, false); //?????????????????????
    //   a.href = href; //??????????????????
    //   a.download = name; //?????????????????????
    //   a.dispatchEvent(e); //?????????????????????????????????click??????
    // }
    // let iframes = ''
    // for (let index = 0; index < mp3arr.length; index++) {
    // const iframe = '<iframe style="display: none;" class="multi-download"  src="'+mp3arr[index]+'"></iframe>'
    // iframes += iframe
    // window.open(mp3arr[index])
    // download('???'+ index +'?????????', mp3arr[index]);
    // }
    // this.setState({
    //   iframes
    // })
  }
  moveFile() {
    if (!this.getSelectedRows()) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    } else if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        copyOrMove: '0', //copy???1
        openMoveDirectoryType: '1',
        moveToDirectoryVisiblie: true
      }
    })
  }
  copyFile() {
    if (!this.getSelectedRows()) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    } else if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        copyOrMove: '1', //copy???1
        openMoveDirectoryType: '1',
        moveToDirectoryVisiblie: true
      }
    })
  }
  deleteFile() {
    if (!this.getSelectedRows()) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    } else if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_DELETE)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { fileList, selectedRowKeys, projectDetailInfoData = {} } = this.props
    const { board_id } = projectDetailInfoData
    let chooseArray = []
    for (let i = 0; i < selectedRowKeys.length; i++) {
      // chooseArray.push({ type: fileList[selectedRowKeys[i]].type, id: fileList[selectedRowKeys[i]].file_id }) //???????????????key
      const item = fileList.find(item => item.id == selectedRowKeys[i]) || {}
      chooseArray.push({ type: item.type, id: item.file_id }) //?????????id
    }
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/fileRemove',
      payload: {
        board_id,
        arrays: JSON.stringify(chooseArray)
      }
    })
  }
  //???????????? ---end

  //????????????---start
  //???????????????????????????
  handleaskAppMenuClick(board_id, e) {
    e.domEvent.stopPropagation()
    const { dispatch } = this.props
    const { key } = e
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        getTaskGroupListArrangeType: key
      }
    })
    dispatch({
      type: 'projectDetailTask/getTaskGroupList',
      payload: {
        type: '2',
        board_id: board_id,
        arrange_type: key,
        operateType: '1'
      }
    })
  }
  //????????????---end

  //????????????????????????
  editTeamShowPreview() {
    const that = this
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/updateDatas',
      payload: {
        editTeamShowPreview: true
      }
    })
    setTimeout(function() {
      //????????????
      const html = document.getElementById('editTeamShow').innerHTML
      // console.log(html)
    }, 200)
  }
  editTeamShowSave() {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/updateDatas',
      payload: {
        editTeamShowSave: true
      }
    })

    setTimeout(function() {
      //????????????
      const html = document.getElementById('editTeamShow').innerHTML
      // console.log(html)
    }, 200)
  }
  //??????????????????-----------------end
  getFieldFromProjectDetailInfoData = (...fields) => {
    // debugger
    const { projectDetailInfoData = {} } = this.props
    if (!fields.length) return {}
    return fields.reduce((acc, curr) => {
      // debugger
      let fieldObj = {}
      curr in projectDetailInfoData
        ? (fieldObj[curr] = projectDetailInfoData[curr])
        : null
      return Object.assign({}, acc, fieldObj)
    }, {})
  }
  handleVisitControlPopoverVisible = flag => {
    if (!flag) {
      this.setState({
        dropdownVisibleChangeValue: false
      })
    }
    this.setState({
      isShouldBeDropdownVisible: flag
    })
  }
  handleVisitControlChange = flag => {
    const { is_privilege, board_id } = this.getFieldFromProjectDetailInfoData(
      'is_privilege',
      'board_id'
    )
    const toBool = str => !!Number(str)
    const is_privilege_bool = toBool(is_privilege)
    if (flag === is_privilege_bool) {
      return
    }
    //toggle??????
    const data = {
      content_id: board_id,
      content_type: 'board',
      is_open: flag ? 1 : 0
    }
    toggleContentPrivilege(data).then(res => {
      if (res && res.code === '0') {
        this.visitControlUpdateCurrentProjectData(board_id)
      } else {
        message.error('??????????????????????????????????????????')
      }
    })
  }

  /**
   * ????????????????????????
   * @param {String} id ?????????????????????id
   */
  handleVisitControlRemoveContentPrivilege = id => {
    const {
      board_id,
      board_id: content_id
    } = this.getFieldFromProjectDetailInfoData('board_id')
    removeContentPrivilege({
      id: id
    }).then(res => {
      const isResOk = res => res && res.code === '0'
      if (isResOk(res)) {
        message.success('??????????????????')
        this.visitControlUpdateCurrentProjectData({
          removeId: id,
          type: 'remove',
          board_id
        })
      } else {
        message.error('??????????????????')
      }
    })
  }

  /**
   * ??????????????????????????????
   * @param {String} id ?????????????????????id
   * @param {String} type ???????????????????????????
   */
  // handleVisitControlChangeContentPrivilege = (id, type) => {
  //   this.handleSetContentPrivilege(id, type)
  // }

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
      this.handleSetContentPrivilege(id, type, '??????????????????????????????')
    }
  }

  /**
   * ?????????????????????
   * @param {Array} users_arr ?????????????????????
   */
  handleSetContentPrivilege = (
    users_arr,
    type,
    errorText = '????????????????????????????????????????????????'
  ) => {
    const {
      board_id,
      board_id: content_id
    } = this.getFieldFromProjectDetailInfoData('board_id')
    const {
      projectDetailInfoData: { privileges = [], is_privilege }
    } = this.props
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { user_id } = user_set
    const content_type = 'board'
    const privilege_code = type
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
        this.visitControlUpdateCurrentProjectData({
          privileges: [...temp_arr],
          type: 'add',
          board_id
        })
      } else {
        message.error(errorText)
      }
    })
  }
  handleVisitControlAddNewMember = (users_arr = []) => {
    if (!users_arr.length) return
    // const user_ids = ids.reduce((acc, curr) => {
    //   if (!acc) return curr
    //   return `${acc},${curr}`
    // }, '')
    this.handleSetContentPrivilege(users_arr, 'read')
  }

  visitControlUpdateCurrentProjectData(obj = {}) {
    const {
      dispatch,
      projectDetailInfoData = {},
      projectDetailInfoData: { privileges = [], is_privilege }
    } = this.props
    const { board_id } = obj
    // ????????????????????????priveleges
    if (obj && obj.type && obj.type == 'add') {
      let new_privileges = []
      for (let item in obj) {
        if (item == 'privileges') {
          obj[item].map(val => {
            let temp_arr = arrayNonRepeatfy([].concat(...privileges, val))
            return (new_privileges = [...temp_arr])
          })
        }
      }
      let new_projectDetailInfoData = {
        ...projectDetailInfoData,
        privileges: new_privileges
      }
      dispatch({
        type: 'projectDetail/updateDatas',
        payload: {
          projectDetailInfoData: new_projectDetailInfoData
        }
      })
    }

    // ?????????????????????
    if (obj && obj.type && obj.type == 'remove') {
      let new_privileges = [...privileges]
      new_privileges.map((item, index) => {
        if (item.id == obj.removeId) {
          new_privileges.splice(index, 1)
        }
      })
      let new_projectDetailInfoData = {
        ...projectDetailInfoData,
        privileges: new_privileges
      }
      dispatch({
        type: 'projectDetail/updateDatas',
        payload: {
          projectDetailInfoData: new_projectDetailInfoData
        }
      })
    }

    dispatch({
      type: 'projectDetail/updateDatas',
      payload: {
        board_id
      }
    })
  }

  // ??????????????????
  addMenbersInProject = data => {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/addMenbersInProject',
      payload: {
        ...data
      }
    })
  }

  // ????????????????????????????????????
  setProjectDetailInfoModalVisible = () => {
    const { projectDetailInfoVisible } = this.state
    this.setState({
      projectDetailInfoVisible: !projectDetailInfoVisible
    })
  }

  render() {
    const that = this
    const {
      projectInfoDisplay,
      projectDetailInfoData = {},
      appsSelectKey,
      selectedRowKeys = [],
      currentParrentDirectoryId,
      processInfo = {},
      getTaskGroupListArrangeType = '1',
      dispatch
    } = this.props
    const {
      ellipsisShow,
      dropdownVisibleChangeValue,
      isInitEntry,
      isCollection,
      localBoardName,
      isInEditBoardName,
      projectDetailInfoVisible
    } = this.state
    const {
      board_name,
      board_id,
      org_id,
      is_star,
      is_create,
      app_data = [],
      folder_id,
      is_privilege,
      data: projectParticipant,
      privileges,
      privileges_extend
    } = projectDetailInfoData
    let temp_projectParticipant = [].concat(
      projectParticipant && [...projectParticipant],
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
      removeEmptyArrayEle(temp_projectParticipant)
    )
    const processName = processInfo.name
    is_starinit = is_star

    const visitControlOtherPersonOperatorMenuItem = [
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
    //??????????????????
    const menu = (
      <Menu onClick={this.handleMenuClick.bind(this, board_id)}>
        {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_EDIT) && (
          <Menu.Item
            key={'5'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={indexStyle.elseProjectMemu}>????????????</div>
          </Menu.Item>
        )}
        {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER) && (
          <Menu.Item
            key={'1'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={indexStyle.elseProjectMemu}>??????????????????</div>
          </Menu.Item>
        )}
        {
          <Menu.Item
            key={'99'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div
              className={indexStyle.elseProjectMemu}
              // style={{marginLeft: '-35px'}}
            >
              <VisitControl
                invitationType="2"
                invitationId={board_id}
                board_id={board_id}
                type="board_list"
                invitationOrg={org_id}
                popoverPlacement={'leftTop'}
                isPropVisitControl={is_privilege == '0' ? false : true}
                principalList={new_projectParticipant}
                principalInfo="??????????????????"
                otherPrivilege={privileges}
                otherPersonOperatorMenuItem={
                  visitControlOtherPersonOperatorMenuItem
                }
                removeMemberPromptText="???????????????????????????????????????"
                handleVisitControlChange={this.handleVisitControlChange}
                handleVisitControlPopoverVisible={
                  this.handleVisitControlPopoverVisible
                }
                handleClickedOtherPersonListOperatorItem={
                  this.handleClickedOtherPersonListOperatorItem
                }
                handleAddNewMember={this.handleVisitControlAddNewMember}
              >
                <span>
                  ????????????&nbsp;&nbsp;
                  <span className={globalStyles.authTheme}>&#xe7eb;</span>
                </span>
              </VisitControl>
            </div>
          </Menu.Item>
        }
        {/*<Menu.Item key={'2'} style={{textAlign: 'center',padding:0,margin: 0}}>*/}
        {/*<div className={indexStyle.elseProjectMemu}>*/}
        {/*{currentNounPlanFilterName(PROJECTS)}??????*/}
        {/*</div>*/}
        {/*</Menu.Item>*/}
        <Menu.Item
          key={'3'}
          style={{ textAlign: 'center', padding: 0, margin: 0 }}
        >
          <div className={indexStyle.elseProjectMemu}>
            ??????{currentNounPlanFilterName(PROJECTS)}
          </div>
        </Menu.Item>
        {is_create !== '1' ? (
          <Menu.Item
            key={'4'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={indexStyle.elseProjectDangerMenu}>
              ??????{currentNounPlanFilterName(PROJECTS)}
            </div>
          </Menu.Item>
        ) : (
          ''
        )}
      </Menu>
    )
    //????????????
    const uploadProps = {
      name: 'file',
      withCredentials: true,
      multiple: true,
      action: `${REQUEST_DOMAIN_FILE}/file/upload`,
      data: {
        board_id,
        folder_id: currentParrentDirectoryId,
        type: '1',
        upload_type: '1'
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({})
      },
      beforeUpload(e) {
        if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        if (e.size == 0) {
          message.error(`?????????????????????`)
          return false
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`??????????????????????????????${UPLOAD_FILE_SIZE}MB`)
          return false
        }
        let loading = message.loading('????????????...', 0)
      },
      onChange({ file, fileList, event }) {
        if (file.status === 'uploading') {
        } else {
          // message.destroy()
        }
        if (file.status === 'done') {
          if (file.response && file.response.code == '0') {
            message.success(`???????????????`)
            dispatch({
              type: 'projectDetailFile/getFileList',
              payload: {
                folder_id: currentParrentDirectoryId
              }
            })
          } else {
            message.error(
              (file.response && file.response.message) || '????????????'
            )
          }
        } else if (file.status === 'error') {
          message.error(`???????????????`)
          setTimeout(function() {
            message.destroy()
          }, 2000)
        }
      }
    }

    //????????????????????????
    const taskAppMenu = (
      <Menu onClick={this.handleaskAppMenuClick.bind(this, board_id)}>
        <Menu.Item
          key={'1'}
          style={{ textAlign: 'center', padding: 0, margin: 0 }}
        >
          <div className={indexStyle.elseProjectMemu}>?????????????????????</div>
        </Menu.Item>
        <Menu.Item
          key={'2'}
          style={{ textAlign: 'center', padding: 0, margin: 0 }}
        >
          <div className={indexStyle.elseProjectMemu}>??????????????????</div>
        </Menu.Item>
        <Menu.Item
          key={'3'}
          style={{ textAlign: 'center', padding: 0, margin: 0 }}
        >
          <div className={indexStyle.elseProjectMemu}>???????????????</div>
        </Menu.Item>
      </Menu>
    )
    const filterGetTaskGroupListType = getTaskGroupListArrangeType => {
      let name = ''
      switch (getTaskGroupListArrangeType) {
        case '1':
          name = '?????????????????????'
          break
        case '2':
          name = '??????????????????'
          break
        case '3':
          name = '???????????????'
          break
        default:
          name = '?????????????????????'
          break
      }
      return name
    }

    const appsOperator = appsSelectKey => {
      //??????????????????
      let operatorConent = <div style={{ color: '#ffffff' }}>s</div>
      switch (appsSelectKey) {
        case '2':
          operatorConent = checkIsHasPermissionInBoard(
            PROJECT_FLOW_FLOW_ACCESS
          ) && (
            <div style={{ color: '#595959' }}>
              {/*<Dropdown overlay={<MenuSearch {...this.props}/>}>*/}
              {/*<span>{processName || `?????????${currentNounPlanFilterName(FLOWS)}`}<Icon type="down" style={{fontSize: 14, color: '#595959'}}/></span>*/}
              {/*</Dropdown>*/}
              <Icon
                type="appstore-o"
                style={{
                  fontSize: 14,
                  marginTop: 18,
                  marginLeft: 16,
                  color: '#ffffff'
                }}
              />
              {/*<Icon type="appstore-o" style={{fontSize: 14, marginTop: 18, marginLeft: 16}}/>*/}
            </div>
          )
          break
        case '3':
          operatorConent = checkIsHasPermissionInBoard(
            PROJECT_TEAM_CARD_INTERVIEW
          ) && (
            <div>
              <Dropdown overlay={taskAppMenu}>
                <span style={{ fontSize: 14, color: '#595959' }}>
                  {filterGetTaskGroupListType(getTaskGroupListArrangeType)}{' '}
                  <Icon type="down" />
                </span>
              </Dropdown>
              <Icon
                type="appstore-o"
                style={{ fontSize: 14, marginTop: 18, marginLeft: 14 }}
              />
              {/*<Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>*/}
              {/*<Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>*/}
            </div>
          )
          break
        case '4':
          if (selectedRowKeys.length) {
            //?????????????????????
            // operatorConent = checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW) &&
            operatorConent = (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#595959'
                }}
                className={indexStyle.fileOperator}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: this.state.iframes }}
                ></div>
                <div style={{ marginTop: 18 }}>
                  <span style={{ color: '#8c8c8c' }}>
                    ?????????{selectedRowKeys.length}???
                  </span>
                  <span
                    style={{ marginLeft: 14 }}
                    onClick={this.quitOperateFile.bind(this)}
                  >
                    ??????
                  </span>
                  {/*<span style={{marginLeft:14}} onClick={this.reverseSelection.bind(this)}>*/}
                  {/*??????*/}
                  {/*</span>*/}
                </div>
                {/*<Button style={{height: 24, marginTop:16,marginLeft:14}} >*/}
                {/*<Icon type="star" />??????*/}
                {/*</Button>*/}
                <Button
                  style={{ height: 24, marginTop: 16, marginLeft: 14 }}
                  onClick={this.downLoadFile.bind(this)}
                >
                  <Icon type="download" />
                  ??????
                </Button>
                <Button
                  style={{ height: 24, marginTop: 16, marginLeft: 14 }}
                  onClick={this.moveFile.bind(this)}
                >
                  <Icon type="export" />
                  ??????
                </Button>
                <Button
                  style={{ height: 24, marginTop: 16, marginLeft: 14 }}
                  onClick={this.copyFile.bind(this)}
                >
                  <Icon type="copy" />
                  ??????
                </Button>
                <Button
                  style={{
                    height: 24,
                    marginTop: 16,
                    marginLeft: 14,
                    backgroundColor: '#f5f5f5',
                    color: 'red'
                  }}
                  onClick={this.deleteFile.bind(this)}
                >
                  <Icon type="delete" />
                  ??????????????????
                </Button>
                <div>
                  <Icon
                    type="appstore-o"
                    style={{ fontSize: 14, marginTop: 20, marginLeft: 14 }}
                  />
                  {/*<Icon type="appstore-o" style={{fontSize:14,marginTop:20,marginLeft:16}}/>*/}
                </div>
              </div>
            )
          } else {
            // operatorConent = checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW) &&
            operatorConent = (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {checkIsHasPermissionInBoard(
                  PROJECT_FILES_FILE_UPLOAD,
                  board_id
                ) && (
                  <Upload {...uploadProps} showUploadList={false}>
                    <Button
                      style={{ height: 24, marginTop: 16 }}
                      type={'primary'}
                    >
                      <Icon type="upload" />
                      ??????
                    </Button>
                  </Upload>
                )}

                {checkIsHasPermissionInBoard(
                  PROJECT_FILES_FOLDER,
                  board_id
                ) && (
                  <Button
                    style={{ height: 24, marginTop: 16, marginLeft: 14 }}
                    onClick={this.createDirectory.bind(this)}
                  >
                    <Icon type="plus" />
                    ???????????????
                  </Button>
                )}

                <div>
                  <Icon
                    type="appstore-o"
                    style={{ fontSize: 14, marginTop: 20, marginLeft: 14 }}
                  />
                  {/*<Icon type="appstore-o" style={{fontSize:14,marginTop:20,marginLeft:16}}/>*/}
                </div>
              </div>
            )
          }
          break
        default:
          // operatorConent = (
          //   <div style={{display: 'flex',alignItems: 'center', }}>
          //     <Button  style={{height: 24, marginTop:16,}} onClick={this.editTeamShowPreview.bind(this)}>??????</Button>
          //     <Button type={'primary'}  style={{height: 24, marginTop:16,marginLeft:14}} onClick={this.editTeamShowSave.bind(this)}>??????</Button>
          //   </div>
          // )
          break
      }
      return operatorConent
    }

    const cancelStarProjet = (
      <i
        className={globalStyles.authTheme}
        onClick={this.starClick.bind(this, { board_id })}
        style={{ margin: '0 0 0 8px', color: '#FAAD14 ', fontSize: 20 }}
      >
        &#xe70e;
      </i>
    )
    const starProject = (
      <i
        className={globalStyles.authTheme}
        onClick={this.starClick.bind(this, { board_id })}
        style={{ margin: '0 0 0 8px', color: '#FAAD14 ', fontSize: 20 }}
      >
        &#xe6f8;
      </i>
    )

    return (
      // style={{position:'fixed',width: '100%', zIndex: 1, backgroundColor: '#ffffff'}}
      <div
        className={`${globalStyles.page_min_width} ${indexStyle.headoutMaskDown}`}
      >
        <div className={indexStyle.headout}>
          <div className={indexStyle.left}>
            <div
              className={indexStyle.left_top}
              onMouseLeave={this.setEllipsisHide.bind(this)}
              onMouseOver={this.setEllipsisShow.bind(this)}
            >
              <Icon
                type="left-square-o"
                className={indexStyle.projectNameIcon}
                onClick={this.gobackToProject.bind(this)}
              />
              {/*<span className={indexStyle.projectName}>{board_name}</span> ??????????????????*/}
              {!isInEditBoardName ? (
                <span
                  className={`${indexStyle.projectName} ${is_privilege == '1' &&
                    indexStyle.tempLeft}`}
                  onClick={this.setIsInEditBoardName.bind(this)}
                >
                  {localBoardName}
                </span>
              ) : (
                <Input
                  value={localBoardName}
                  className={`${indexStyle.projectName} ${is_privilege == '1' &&
                    indexStyle.tempLeft}`}
                  autoFocus
                  onChange={this.localBoardNameChange.bind(this)}
                  onPressEnter={this.editBoardNameComplete.bind(this)}
                  onBlur={this.editBoardNameComplete.bind(this)}
                />
              )}
              {isInitEntry
                ? is_star === '1'
                  ? starProject
                  : cancelStarProjet
                : isCollection
                ? starProject
                : cancelStarProjet}

              {/*<Icon className={indexStyle.star}*/}
              {/*onClick={this.starClick.bind(this, board_id)}*/}
              {/*type={isInitEntry ? (is_star === '1'? 'star':'star-o'):(isCollection? 'star':'star-o')}*/}
              {/*style={{margin: '6px 0 0 8px',fontSize: 20,color: '#FAAD14'}} />*/}
              <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={dropdownVisibleChangeValue}
                onVisibleChange={this.onDropdownVisibleChange.bind(this)}
              >
                <Icon
                  type="ellipsis"
                  style={{
                    fontSize: 24,
                    margin: '4px 0 0 8px',
                    display:
                      ellipsisShow || dropdownVisibleChangeValue
                        ? 'inline-block'
                        : 'inline-block'
                  }}
                  onClick={this.toggleDropdownVisible}
                />
              </Dropdown>
            </div>
            <div className={indexStyle.lcb_boardinfo_out}>
              <div
                className={indexStyle.displayProjectinfo}
                onClick={this.setProjectInfoDisplay.bind(this)}
              >
                {currentNounPlanFilterName(PROJECTS)}??????
                {/*{projectInfoDisplay ? (*/}
                {/*<span><Icon type="left" style={{marginRight: 2}}/>??????{currentNounPlanFilterName(PROJECTS)}??????</span>*/}
                {/*):(*/}
                {/*<span>??????{currentNounPlanFilterName(PROJECTS)}??????<Icon type="right" style={{marginLeft: 2}}/></span>*/}
                {/*)}*/}
              </div>
              <div className={indexStyle.spaceLine}></div>
              <div>
                <LcbInHeader />
              </div>
            </div>
          </div>
          <div className={indexStyle.right}>
            <div className={indexStyle.right_top}>
              {app_data.map((value, itemkey) => {
                const { app_name, key, app_code } = value
                let flag = true
                switch (key) {
                  case '2':
                    flag = checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS)
                    break
                  case '3':
                    flag = checkIsHasPermissionInBoard(
                      PROJECT_TEAM_CARD_INTERVIEW
                    )
                    break
                  case '4':
                    flag = checkIsHasPermissionInBoard(
                      PROJECT_FILES_FILE_INTERVIEW
                    )
                    break
                }
                // return flag &&
                return (
                  <div
                    className={
                      appsSelectKey === key
                        ? indexStyle.appsSelect
                        : indexStyle.appsNoSelect
                    }
                    key={itemkey}
                    onClick={this.appClick.bind(this, key)}
                  >
                    {app_code && currentNounPlanFilterName(app_code)
                      ? currentNounPlanFilterName(app_code)
                      : app_name}
                  </div>
                )
              })}
            </div>
            <div className={indexStyle.right_bott}>
              {appsOperator(appsSelectKey)}
            </div>
          </div>
        </div>
        <DetailInfo
          modalVisible={projectDetailInfoVisible}
          setProjectDetailInfoModalVisible={
            this.setProjectDetailInfoModalVisible
          }
          invitationType="1"
          invitationId={board_id}
        />

        <ShowAddMenberModal
          addMenbersInProject={this.addMenbersInProject}
          show_wechat_invite={true}
          board_id={board_id}
          modalVisible={this.state.ShowAddMenberModalVisibile}
          setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(
            this
          )}
          invitationId={board_id}
          invitationType="1"
          invitationOrg={org_id}
        />

        <AddModalForm
          board_id={board_id}
          modalVisible={this.state.AddModalFormVisibile}
          setAddModalFormVisibile={this.setAddModalFormVisibile.bind(this)}
        />
      </div>
    )
  }
}
//  ??????????????????????????????state????????????UI ????????????props?????????????????????
function mapStateToProps({
  projectDetail: {
    datas: { projectDetailInfoData = {}, projectInfoDisplay, appsSelectKey }
  },
  projectDetailTask: {
    datas: { getTaskGroupListArrangeType = '1' }
  },
  projectDetailFile: {
    datas: {
      selectedRowKeys = [],
      selectedRows = [],
      fileList = [],
      filedata_1 = [],
      isInAddDirectory,
      currentParrentDirectoryId
    }
  },
  projectDetailProcess: {
    datas: { processInfo = {} }
  },
  technological: {
    datas: { userOrgPermissions, userBoardPermissions }
  }
}) {
  return {
    projectDetailInfoData,
    projectInfoDisplay,
    selectedRowKeys,
    selectedRows,
    fileList,
    filedata_1,
    isInAddDirectory,
    processInfo,
    currentParrentDirectoryId,
    getTaskGroupListArrangeType,
    appsSelectKey,
    userOrgPermissions,
    userBoardPermissions
  }
}
