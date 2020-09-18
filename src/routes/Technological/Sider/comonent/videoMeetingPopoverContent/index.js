import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  Popover,
  Select,
  Input,
  Mention,
  Button,
  message,
  DatePicker,
  Dropdown,
  Menu,
  Icon,
  Tooltip,
  Radio
} from 'antd'
import { connect } from 'dva'
import { validateTel } from '@/utils/verify'
import { getCurrentSelectedProjectMembersList } from '@/services/technological/workbench'
import {
  timestampToTime,
  compareTwoTimestamp,
  timeToTimestamp,
  timestampToTimeNormal,
  isSamDay
} from '@/utils/util'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
// import zoom_logo from '@/assets/sider_right/zoom_logo.png'
// import xiaoyuyilian_logo from '@/assets/sider_right/xiaoyuyilian_logo.png'
import kty from '@/assets/sider_right/kty.png'
import zoom from '@/assets/sider_right/zoom.png'
import zhumu from '@/assets/sider_right/zhumu.png'
import zyy from '@/assets/sider_right/zyy.png'
import tx from '@/assets/sider_right/tx.png'
import { currentNounPlanFilterName } from '@/utils/businessFunction'
import { PROJECTS } from '@/globalset/js/constant'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  organizationInviteWebJoin,
  commInviteWebJoin
} from '@/services/technological'
import { MESSAGE_DURATION_TIME } from '../../../../../globalset/js/constant'
import moment from 'moment'
import { checkIsHasPermissionInBoard } from '../../../../../utils/businessFunction'
import { arrayNonRepeatfy, isObjectValueEqual } from '../../../../../utils/util'
const Option = Select.Option
const { TextArea } = Input
const { getMentions, toString, toContentState } = Mention
const Nav = Mention.Nav

// 定义组件中需要的默认状态值
let nowDate = new Date()
let defaultSaveToProject // 默认的保存项目名称
let defaultSaveProjectName // 默认的项目名称
let defaultMeetingTitle // 默认的会议名称
let defaultAppointStartTime // 默认的开始时间
let defaultDelayDueTime // 默认的结束时间
let currentDelayStartTime // 具有年月日的开始时间
let currentDelayDueTime // 默认的持续时间
let remind_time_value = '5' // 设置的提醒时间

let stepIndex = 0

@connect(({ technological, workbench }) => {
  return {
    projectList:
      workbench.datas && workbench.datas.projectList
        ? workbench.datas.projectList
        : [],
    projectTabCurrentSelectedProject:
      workbench.datas && workbench.datas.projectTabCurrentSelectedProject
        ? workbench.datas.projectTabCurrentSelectedProject
        : '0',
    videoConferenceProviderList:
      technological.datas && technological.datas.videoConferenceProviderList
        ? technological.datas.videoConferenceProviderList
        : []
  }
})
class VideoMeetingPopoverContent extends React.Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.local_timer = null
    this.videoProviderImgTimer = null
    this.state = {
      saveToProject: null, // 用来保存存入的项目
      saveProjectName: null, // 用来保存项目名称
      meetingTitle: '', // 会议名称
      videoMeetingDefaultSuggesstions: [], //mention 原始数据
      selectedSuggestions: [], //自定义的mention选择列表
      suggestionValue: toContentState(''), //mention的值
      videoMeetingPopoverVisible: false, // 视频会议的显示隐藏
      currentSelectedProjectMembersList: [], //当前选择项目的项目成员
      currentOrgAllMembers: [], //当前组织的职员
      org_id: '0',
      dueTimeList: [
        { remind_time_type: 'm', txtVal: '5' },
        { remind_time_type: 'm', txtVal: '15' },
        { remind_time_type: 'm', txtVal: '30' },
        { remind_time_type: 'm', txtVal: '45' }
        // { remind_time_type: 'm', txtVal: '30' },
        // { remind_time_type: 'h', txtVal: '1' },
        // { remind_time_type: 'm', txtVal: '90' },
        // { remind_time_type: 'h', txtVal: '2' },
        // { remind_time_type: 'h', txtVal: '3' },
        // { remind_time_type: 'h', txtVal: '4' },
        // { remind_time_type: 'h', txtVal: '5' },
        // { remind_time_type: 'h', txtVal: '6' },
      ], // 持续结束时间
      remindTimeList: [
        { remind_time_value: '5' },
        { remind_time_value: '15' },
        { remind_time_value: '30' },
        { remind_time_value: '45' }
      ], // 设置的提醒时间
      // toNoticeList: [], // 当前通知的用户
      defaultValue: '30', // 当前选择的持续时间
      providerDefault: null, // 默认选中的提供商
      remindDropdownVisible: false
    }
  }

  // 获取项目用户
  getProjectUsers = ({ projectId }) => {
    if (!projectId) return
    if (projectId == 0) return
    // this.setVideoMeetingDefaultSuggesstionsByBoardUser({ board_users: [] })
    getCurrentSelectedProjectMembersList({ projectId }).then(res => {
      if (res.code == '0') {
        const board_users = res.data
        currentDelayDueTime = null
        // defaultDelayDueTime = this.getNormalCurrentDueTime()
        this.setState({
          currentSelectedProjectMembersList: board_users, // 当前选择项目成员列表
          currentOrgAllMembers: board_users, // 当前组织所有成员?
          othersPeople: [],
          // meetingTitle: '',
          user_phone: [],
          selectedKeys: null,
          defaultValue: '30',
          isShowNowTime: true,
          changeValue: false // 保存一个正在修改文本框的状态
        })
      } else {
        // message.error(res.message)
      }
    })
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/getVideoConferenceProviderList',
      payload: {}
    })
  }

  getCurrentProject = props => {
    let { projectList = [] } = props
    const { user_set } = this.getInfoFromLocalStorage('userInfo') || {}
    if (!user_set) return
    const { current_board } = user_set
    // projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)
    let new_projectList = [...projectList]
    if (projectList && projectList.length) {
      //过滤出来当前用户有编辑权限的项目
      if (new_projectList.find(item => item.is_my_private == '1')) {
        let { board_id, org_id } =
          new_projectList.find(item => item.is_my_private == '1') || {}
        this.setState({
          org_id,
          notProjectList: false
        })
        this.getProjectUsers({ projectId: board_id })
      } else {
        let { board_id, org_id } =
          new_projectList.find((item, index) => index == '0') || {}
        this.setState({
          org_id,
          notProjectList: false
        })
        this.getProjectUsers({ projectId: board_id })
        return
      }
    } else {
      this.setState({
        notProjectList: true
      })
    }
  }

  componentDidMount() {
    this.getCurrentProject(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { projectList = [] } = this.props
    const { projectList: newProjectList = [] } = nextProps
    if (isObjectValueEqual(projectList, newProjectList)) return
    this.getCurrentProject(nextProps)
  }

  // handleAssemVideoMeetingDefaultSuggesstions = (orgList = []) => {
  // 	return orgList.reduce((acc, curr) => {
  // 		const isHasRepeatedNameItem =
  // 			orgList.filter(item => item.name === curr.name).length >= 2;
  // 		//如果列表中有重复的名称成员存在，那么附加手机号或者邮箱
  // 		//形式： name(mobile|email)
  // 		if (isHasRepeatedNameItem) {
  // 			const item = `${curr.name}(${
  // 				curr.mobile ? curr.mobile : curr.email
  // 				})`;
  // 			return [...acc, item];
  // 		}
  // 		return [...acc, curr.name];
  // 	}, []);
  // };

  // 时钟
  showTime = () => {
    if (!this.state.isShowNowTime) return
    let nowDate = timestampToTime(timeToTimestamp(new Date()))
    this.setState({
      start_time: nowDate,
      // isShowNowTime: true,
      meeting_start_time: timeToTimestamp(new Date())
    })
    this.timer = setTimeout(() => {
      this.showTime()
    }, 1000)
  }

  // 需要一个一直变化的时间来做比较
  localShowTime = () => {
    const { isNotUpdateShowTime } = this.state
    let nowDate = new Date().getTime()
    let change_time = new Date(timestampToTimeNormal(nowDate, '/', true))
    let state_time = new Date(
      timestampToTimeNormal(this.state.meeting_start_time, '/', true)
    )
    if (change_time.getDate() == state_time.getDate()) {
      // 表示还是今天
      if (
        change_time.getHours() == state_time.getHours() &&
        change_time.getMinutes() == state_time.getMinutes()
      ) {
        this.handleChangeNowTime()
      }
    }
    this.setState({
      local_date_time: nowDate // 保存了一个时间戳
    })
    this.local_timer = setTimeout(() => {
      this.localShowTime()
    }, 1000)
  }

  // 设置mention组件提及列表
  // setVideoMeetingDefaultSuggesstionsByBoardUser = ({ board_users = [] }) => {
  // 	const videoMeetingDefaultSuggesstions = this.handleAssemVideoMeetingDefaultSuggesstions(board_users);
  // 	this.setState({
  // 		selectedSuggestions: videoMeetingDefaultSuggesstions,
  // 		videoMeetingDefaultSuggesstions,
  // 		suggestionValue: toContentState(""), //mention的值
  // 	})
  // }

  // 初始化数据
  initVideoMeetingPopover = () => {
    this.setState({
      saveToProject: null,
      saveProjectName: null,
      meetingTitle: '',
      suggestionValue: toContentState(''), //mention的值
      mentionSelectedMember: [], //已经选择的 item,
      selectedMemberTextAreaValue: '',
      defaultSaveToProject: '',
      defaultMeetingTitle: '',
      defaultAppointStartTime: '',
      defaultDelayDueTime: '',
      currentDelayStartTime: '',
      currentDelayDueTime: '',
      start_time: '',
      meeting_start_time: '',
      selectedKeys: null,
      othersPeople: [],
      userIds: [],
      user_phone: [],
      isShowNowTime: true,
      isExeecedTime: false,
      defaultValue: '30', // 当前选择的持续时间
      changeValue: false,
      toNoticeList: [],
      remindDropdownVisible: false,
      providerDefault: null
    })
    remind_time_value = '5'
    defaultSaveToProject = ''
    defaultSaveProjectName = ''
    stepIndex = 0
    clearTimeout(this.timer)
    clearTimeout(this.local_timer)
  }

  // 获取项目权限
  getProjectPermission = (permissionType, board_id) => {
    return checkIsHasPermissionInBoard(permissionType, board_id)
  }
  // 查询当前用户是否有权限
  filterProjectWhichCurrentUserHasEditPermission = (projectList = []) => {
    return projectList.filter(({ board_id }) =>
      this.getProjectPermission('project:team:card:create', board_id)
    )
  }

  // 获取当前用户
  getInfoFromLocalStorage = item => {
    try {
      const userInfo = localStorage.getItem(item)
      return JSON.parse(userInfo)
    } catch (e) {
      message.error('从 Cookie 中获取用户信息失败, 当发起视频会议的时候')
    }
  }

  // 获取当前默认的项目名称
  filterCurrentDefaultSaveProjectValue = () => {
    let { projectList = [] } = this.props
    const { user_set } = this.getInfoFromLocalStorage('userInfo') || {}
    if (!user_set) return
    const { current_board } = user_set
    //过滤出来当前用户有编辑权限的项目
    // projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)
    if (projectList && projectList.length) {
      let new_projectList = [...projectList]
      if (new_projectList.find(item => item.is_my_private == '1')) {
        // let gold_id = (new_projectList.find(item => item.is_my_private == '1') || {}).board_id
        let { board_id: gold_id, board_name } =
          new_projectList.find(item => item.is_my_private == '1') || {}
        defaultSaveProjectName = board_name
        return gold_id
      } else {
        // let gold_id = (new_projectList.find((item, index) => index == '0') || {}).board_id
        let { board_id: gold_id, board_name } =
          new_projectList.find((item, index) => index == '0') || {}
        defaultSaveProjectName = board_name
        return gold_id
      }
    } else {
      let gold_id
      defaultSaveProjectName = null
      return (gold_id = '')
    }
  }

  // 获取当前用户的会议名称
  getCurrentUserNameThenSetMeetingTitle = () => {
    const currentUser = this.getInfoFromLocalStorage('userInfo')
    const { changeValue, meetingTitle } = this.state
    if (currentUser) {
      if (changeValue) {
        let temp_title = meetingTitle
        return temp_title
      }
      let temp_title = `${currentUser.name}发起的会议`
      return temp_title
    }
  }

  // 获取当前推迟时间
  getCurrentDelayStartTimestampToTime = (timestamp, flag) => {
    if (!timestamp) {
      return false
    }
    const timestampNew =
      timestamp.length === 10 ? Number(timestamp) * 1000 : Number(timestamp)
    let date = new Date(timestampNew) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const now_year = nowDate.getFullYear()
    let Y = now_year == date.getFullYear() ? '' : date.getFullYear() + '年'
    // let Y = date.getFullYear() + '年';
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '月'
    let D =
      date.getDate() < 10
        ? '0' + date.getDate() + '日 '
        : date.getDate() + '日 '
    let h =
      date.getMinutes() >= 0 && date.getMinutes() < 30
        ? date.getHours() + ':'
        : date.getHours() + 1 + ':'
    let m = date.getMinutes() >= 0 && date.getMinutes() < 30 ? '30' : '00'
    return flag ? Y + M + D + h + m : Y + M + D
  }

  // 获取具有年月日文案的开始时间
  getCurrentStartTimeStamp = () => {
    return this.getCurrentDelayStartTimestampToTime(
      timeToTimestamp(nowDate),
      true
    )
  }

  // 获取指定日期格式的时间
  getAppointDelayTimestampToTime = (timestamp, flag) => {
    if (!timestamp) {
      return false
    }
    const timestampNew =
      timestamp.length === 10 ? Number(timestamp) * 1000 : Number(timestamp)
    let date = new Date(timestampNew) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const now_year = nowDate.getFullYear()
    // let Y = now_year == date.getFullYear() ? '' : date.getFullYear() + '年';
    let Y = date.getFullYear() + '/'
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '/'
    let D =
      date.getDate() < 10 ? '0' + date.getDate() + '/ ' : date.getDate() + '/ '
    let h =
      date.getMinutes() >= 0 && date.getMinutes() < 30
        ? date.getHours() + ':'
        : date.getHours() + 1 + ':'
    let m = date.getMinutes() >= 0 && date.getMinutes() < 30 ? '30' : '00'
    return flag ? Y + M + D + h + m : Y + M + D
  }

  // 获取以 '/' 分割的日期格式的时间戳
  getAppointStartTimeStamp = () => {
    const temp_time = this.getAppointDelayTimestampToTime(
      timeToTimestamp(nowDate),
      true
    )
    const start_time = timeToTimestamp(temp_time) //  获取当前推迟的时间
    return start_time
  }

  // 获取默认的截止时间
  getNormalCurrentDueTime = () => {
    const { meeting_start_time } = this.state
    let temp_time
    let currentDelayStartTime
    let due_time
    if (meeting_start_time) {
      currentDelayStartTime = meeting_start_time //  获取当前推迟的时间
    } else {
      temp_time = this.getAppointDelayTimestampToTime(
        timeToTimestamp(nowDate),
        true
      )
      currentDelayStartTime = timeToTimestamp(temp_time) //  获取当前推迟的时间
    }

    // due_time = currentDelayStartTime + 1 * 3600000
    due_time = currentDelayStartTime + 30 * 60000 // 这是默认为30分钟的状态
    return due_time
  }

  /**
   * 获取默认状态时的数据
   * 1. 项目名称 ---- 默认为个人事务
   * 2. 预约会议的名称 默认为xxx发起的会议
   * 3. 开始时间 ---- 必须有 默认为当前时间的整点或者半点
   * 4. 结束时间 ---- 必须有 默认为当前时间后的1小时
   * 5. 提醒时间 ---- 默认物理日程开始前的5分钟
   * 6. 通知提醒人 -- 可有可无 默认为空[]
   */
  getVideoMeetingPopoverContentNoramlDatas = () => {
    defaultSaveToProject =
      this.filterCurrentDefaultSaveProjectValue() == ''
        ? '暂无可选项目'
        : this.filterCurrentDefaultSaveProjectValue()
    defaultMeetingTitle = this.getCurrentUserNameThenSetMeetingTitle()
    defaultAppointStartTime = this.getAppointStartTimeStamp()
    currentDelayStartTime = this.getCurrentStartTimeStamp()
    defaultDelayDueTime = this.getNormalCurrentDueTime()

    return {
      defaultSaveToProject,
      defaultMeetingTitle,
      defaultAppointStartTime,
      currentDelayStartTime,
      defaultDelayDueTime
    }
  }

  // 选择项目的下拉回调
  handleVideoMeetingSaveSelectChange = (value, option) => {
    const {
      props: { children }
    } = option
    const { projectList = [] } = this.props
    this.getProjectUsers({ projectId: value })
    this.setState({
      saveToProject: value,
      saveProjectName: children,
      org_id: !value
        ? '0'
        : projectList.find(item => item.board_id == value).org_id || '0'
      // isShowNowTime: false
    })
  }

  // 修改创建会话的名称回调
  handleVideoMeetingTopicChange = e => {
    if (e.target.value.trimLR() == '') {
      this.setState({
        meetingTitle: '',
        changeValue: true
      })

      return false
    }
    this.setState({
      meetingTitle: e.target.value,
      changeValue: true
    })
  }

  // 提醒时间的选择
  // handleMenuReallySelect = (e) => {
  // 	const { key, selectedKeys } = e
  // 	this.setState({
  // 		selectedKeys: selectedKeys,

  // 	})
  // 	remind_time_value = key // 设置的提醒时间
  // }

  // // 选择的时间
  // renderSelectedRemindTime = () => {
  // 	const { remindTimeList = [], selectedKeys = [] } = this.state
  // 	return (
  // 		<div>
  // 			<Menu selectedKeys={selectedKeys} onSelect={this.handleMenuReallySelect.bind(this)}>
  // 				{
  // 					remindTimeList.map(item => (
  // 						<Menu.Item key={item.remind_time_value}>{item.remind_time_value}</Menu.Item>
  // 					))
  // 				}
  // 			</Menu>
  // 		</div>
  // 	)
  // }

  // 设置会议开始时间
  startDatePickerChange = timeString => {
    const start_timeStamp = timeToTimestamp(timeString)
    const nowDate = timeToTimestamp(new Date())
    let nextOrPrevDate = new Date(
      timestampToTimeNormal(start_timeStamp)
    ).getDate()
    const { local_date_time, meeting_start_time } = this.state
    let currentDate = new Date().getDate()
    if (this.timer) {
      clearTimeout(this.timer)
    }
    // 如果是点击的今天，那么提醒什么的都要隐藏
    // 如果点击的是今天之前或者之后，那么就要显示
    if (currentDate == nextOrPrevDate) {
      // 表示如果日期相等
      // 这里还需要判断选择的时钟和分钟是否是现在
      if (
        new Date(
          timestampToTimeNormal(start_timeStamp, '/', true)
        ).getHours() == new Date(nowDate).getHours() &&
        new Date(
          timestampToTimeNormal(start_timeStamp, '/', true)
        ).getMinutes() == new Date(nowDate).getMinutes()
      ) {
        this.handleChangeNowTime()
        this.setState({
          isExeecedTime: false
        })
      } else {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.setState({
          start_time: timestampToTime(start_timeStamp),
          meeting_start_time: start_timeStamp,
          isShowNowTime: false,
          isExeecedTime: false
        })
      }
    } else if (nextOrPrevDate < currentDate) {
      // 表示是今天之前
      this.setState({
        start_time: timestampToTime(start_timeStamp),
        meeting_start_time: start_timeStamp,
        isShowNowTime: false,
        isExeecedTime: true
      })
    } else {
      // 表示大于今天
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.setState({
        start_time: timestampToTime(start_timeStamp),
        meeting_start_time: start_timeStamp,
        isShowNowTime: false,
        isExeecedTime: false
      })
    }

    this.disabledDateTime()
  }

  // 设置会议的结束时间
  endDatePickerChange = (e, type) => {
    e && e.domEvent && e.domEvent.stopPropagation()
    const { key } = e
    if (type == 'm') {
      currentDelayDueTime = key * 60000
    } else {
      currentDelayDueTime = key * 3600000
    }
    this.setState({
      defaultValue: key
    })
  }

  // 获取当前用户并且设置为第一个通知对象
  getCurrentRemindUser = () => {
    const currentUser = this.getInfoFromLocalStorage('userInfo')
    const {
      currentSelectedProjectMembersList = [],
      toNoticeList = []
    } = this.state
    let new_currentSelectedProjectMembersList = [
      ...currentSelectedProjectMembersList
    ]
    const gold_item =
      new_currentSelectedProjectMembersList.find(
        item => item.id == currentUser.id
      ) || {}
    toNoticeList.push(gold_item)
    let nonRepeatArr = arrayNonRepeatfy(toNoticeList, 'user_id')
    this.setState({
      toNoticeList: nonRepeatArr,
      userIds: [gold_item.user_id]
    })
  }

  // 通知提醒下拉选择
  chirldrenTaskChargeChange = dataInfo => {
    const { selectedKeys = [], type, key } = dataInfo
    const { currentSelectedProjectMembersList = [] } = this.state
    const membersData = currentSelectedProjectMembersList
    let newNoticeUserList = []
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newNoticeUserList.push(membersData[j])
        }
      }
    }
    this.setState({
      toNoticeList: newNoticeUserList,
      userIds: selectedKeys.filter(i => i.length != '11') || [] // 这里需要过滤掉手机号
    })
  }

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const {
      toNoticeList = [],
      othersPeople = [],
      user_phone = [],
      userIds = []
    } = this.state
    let new_toNoticeList = [...toNoticeList]
    let new_othersPeople = [...othersPeople]
    new_toNoticeList.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        new_toNoticeList.splice(index, 1)
      }
    })
    let new_userIds = userIds.filter(i => i != shouldDeleteItem) || []
    // 表示邀请手机号进来的成员 事件处理
    if (new_othersPeople && new_othersPeople.length) {
      new_othersPeople.map((item, index) => {
        if (item.user_id == shouldDeleteItem) {
          new_othersPeople.splice(index, 1)
        }
      })
      let new_user_phone = user_phone.filter(i => i != shouldDeleteItem) || []
      this.setState({
        othersPeople: new_othersPeople,
        user_phone: new_user_phone
      })
    }
    this.setState({
      toNoticeList: new_toNoticeList,
      userIds: new_userIds
    })
  }

  // 手机号
  arrayNonRepeatPhone = arr => {
    let temp_arr = []
    for (let i = 0; i < arr.length; i++) {
      if (!temp_arr.includes(arr[i])) {
        //includes 检测数组是否有某个值
        temp_arr.push(arr[i])
      }
    }
    return temp_arr
  }

  // 自定义图标的点击事件
  chgUserDefinedIcon = ({ obj }) => {
    const { othersPeople = [], user_phone = [] } = this.state
    let new_othersPeople = [...othersPeople]
    new_othersPeople.push(obj)
    user_phone.push(obj.mobile)
    this.setState({
      othersPeople: arrayNonRepeatfy(new_othersPeople, 'user_id'),
      user_phone: this.arrayNonRepeatPhone(user_phone)
    })
  }

  // 现在的点击事件
  handleChangeNowTime = () => {
    const { isShowNowTime } = this.state
    if (isShowNowTime) {
      return false
    }
    this.setState(
      {
        isShowNowTime: true // 显示当前时间
      },
      () => {
        this.showTime() // 点击现在之后开启定时器
      }
    )
  }

  // 提醒的下拉回调
  handleVisibleChange = visible => {
    this.setState({
      remindDropdownVisible: visible
    })
  }

  // 打开会议窗口链接
  openWinNiNewTabWithATag = url => {
    const aTag = document.createElement('a')
    aTag.href = url
    aTag.target = '_blank'
    document.querySelector('body').appendChild(aTag)
    aTag.click()
    aTag.parentNode.removeChild(aTag)
  }

  // 邀请人加入的回调
  inviteMemberJoin = ({
    card_id,
    userIds = [],
    user_phone = [],
    start_url
  }) => {
    const { isShowNowTime } = this.state
    if (!card_id) {
      setTimeout(() => {
        message.success(isShowNowTime ? '发起会议成功' : '预约会议成功')
      }, 500)
      this.setState(
        {
          videoMeetingPopoverVisible: false
        },
        async () => {
          await this.initVideoMeetingPopover()
          await this.getCurrentRemindUser()
        }
      )
      start_url && this.openWinNiNewTabWithATag(start_url)
      return false
    }
    const { org_id } = this.state
    let data = {
      type: '4',
      users: user_phone,
      _organization_id: org_id
    }
    this.setRemindInfo({ card_id, userIds, user_phone: [], start_url })
    return
    if (user_phone && user_phone.length) {
      organizationInviteWebJoin({ ...data }).then(res => {
        if (isApiResponseOk(res)) {
          let data = {
            id: card_id,
            role_id: res.data.role_id,
            users: res.data.users,
            type: '4'
          }
          commInviteWebJoin(data).then(res => {
            if (isApiResponseOk(res)) {
              this.setRemindInfo({
                card_id,
                userIds,
                user_phone: data.users,
                start_url
              })
            }
          })
        } else {
          message.warn(res.message)
        }
      })
    } else {
      this.setRemindInfo({ card_id, userIds, user_phone: [], start_url })
    }
  }

  // 发起会议成功之后调用通知提醒
  setRemindInfo = ({ card_id, userIds = [], user_phone = [], start_url }) => {
    const { dispatch } = this.props
    const { isShowNowTime, isExeecedTime } = this.state
    const temp_user = [].concat(userIds, user_phone)
    const data = {
      rela_id: card_id,
      remind_time_value,
      rela_type: '2',
      remind_time_type: isShowNowTime || isExeecedTime ? 'datetime' : 'm',
      remind_trigger:
        isShowNowTime || isExeecedTime
          ? 'userdefined'
          : 'schedule:start:before',
      users: temp_user
    }

    if (!(temp_user && temp_user.length)) {
      setTimeout(() => {
        message.success('发起会议成功')
      }, 500)
      this.setState(
        {
          videoMeetingPopoverVisible: false
        },
        () => {
          this.initVideoMeetingPopover()
          this.getCurrentRemindUser()
        }
      )
      this.openWinNiNewTabWithATag(start_url)
      dispatch({
        type: 'workbench/getMeetingList',
        payload: {}
      })
    } else {
      Promise.resolve(
        dispatch({
          type: 'informRemind/setRemindInformation',
          payload: {
            ...data,
            calback: () => {
              setTimeout(() => {
                message.success('发起会议成功')
              }, 500)
            }
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          this.setState(
            {
              videoMeetingPopoverVisible: false
            },
            () => {
              this.initVideoMeetingPopover()
              this.getCurrentRemindUser()
            }
          )
          this.openWinNiNewTabWithATag(start_url)
          dispatch({
            type: 'workbench/getMeetingList',
            payload: {}
          })
        }
      })
    }
  }

  // 发起会议
  handleVideoMeetingSubmit = () => {
    const { dispatch, videoConferenceProviderList = [] } = this.props
    const {
      saveToProject,
      org_id,
      meetingTitle,
      meeting_start_time,
      userIds = [],
      user_phone = [],
      isShowNowTime = true,
      isExeecedTime,
      providerDefault
    } = this.state
    const {
      defaultMeetingTitle,
      defaultSaveToProject,
      defaultAppointStartTime,
      defaultDelayDueTime
    } = this.getVideoMeetingPopoverContentNoramlDatas()
    const time2 = currentDelayDueTime
      ? meeting_start_time
        ? meeting_start_time + currentDelayDueTime
        : defaultAppointStartTime + currentDelayDueTime
      : defaultDelayDueTime
    let gold_provider_id =
      (videoConferenceProviderList &&
        (
          videoConferenceProviderList.filter(
            item => item.is_default == '1'
          )[0] || []
        ).id) ||
      ''
    const data = {
      _organization_id: org_id,
      board_id: saveToProject ? saveToProject : defaultSaveToProject,
      flag: 2,
      rela_id: saveToProject ? saveToProject : defaultSaveToProject,
      topic: meetingTitle ? meetingTitle : defaultMeetingTitle,
      start_time: meeting_start_time
        ? meeting_start_time
        : defaultAppointStartTime,
      end_time: time2,
      user_for: (user_phone && user_phone.join(',')) || '',
      user_ids: (userIds && userIds.join(',')) || '',
      provider_id: providerDefault ? providerDefault : gold_provider_id
    }

    Promise.resolve(
      dispatch({
        type: isShowNowTime
          ? 'technological/initiateVideoMeeting'
          : 'technological/appointmentVideoMeeting',
        payload: data
      })
    ).then(res => {
      if (res.code === '0') {
        clearTimeout(this.timer)
        const { start_url, card_id } = res.data
        // this.setRemindInfo({card_id, userIds, user_phone})
        if (isShowNowTime || isExeecedTime)
          remind_time_value = parseInt(meeting_start_time / 1000)
        // this.openWinNiNewTabWithATag(start_url)
        this.inviteMemberJoin({ card_id, userIds, user_phone, start_url })

        // 低频操作，获取甘特图数据
        // dispatch({
        // 	type: 'gantt/getGanttData',
        // 	payload: {}
        // })
      } else if (res.code === '1') {
        message.error(res.message)
        this.setState(
          {
            videoMeetingPopoverVisible: false
          },
          () => {
            this.initVideoMeetingPopover()
          }
        )
      } else {
        message.error(isShowNowTime ? '发起会议失败' : '预约会议失败')
        this.setState(
          {
            videoMeetingPopoverVisible: false
          },
          () => {
            this.initVideoMeetingPopover()
          }
        )
      }
    })
  }

  // popoverContent chg 事件
  handleVideoMeetingPopoverVisibleChange = flag => {
    const { dispatch } = this.props
    this.setState(
      {
        videoMeetingPopoverVisible: flag
      },
      () => {
        if (flag === false) {
          this.initVideoMeetingPopover()
          setTimeout(() => {
            this.getCurrentRemindUser()
          }, 50)
          clearTimeout(this.timer)
          clearTimeout(this.local_timer)
        } else {
          // 为true的时候调用设置当前通知对象
          this.showTime()
          this.localShowTime()
          this.getCurrentRemindUser()
          this.getCurrentProject(this.props)
          this.setState({
            isShowNowTime: true
          })
          // dispatch({
          // 	type: 'technological/getCurrentOrgProjectList',
          // 	payload: {

          // 	}
          // })
        }
      }
    )
  }

  // icon小图标的点击事件 控制popover显示隐藏
  handleToggleVideoMeetingPopover = e => {
    //需要重置项目标题
    if (e) e.stopPropagation()
    this.setState(state => {
      const { videoMeetingPopoverVisible } = state
      return {
        videoMeetingPopoverVisible: !videoMeetingPopoverVisible
      }
    })
  }

  // 禁用日期时间
  disabledDate = current => {
    return current && current < moment().add(-1, 'day')
  }

  range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  disabledDateTime = () => {
    const { meeting_start_time } = this.state
    let old_hours = new Date().getHours()
    let old_minutes = new Date().getMinutes()
    let old_date = new Date().getDate()
    let new_hours = new Date(
      timestampToTimeNormal(meeting_start_time, '/', true)
    ).getHours()
    let new_date = new Date(
      timestampToTimeNormal(meeting_start_time, '/', true)
    ).getDate()
    let flag =
      new_date == old_date
        ? new_hours > old_hours
          ? () => ''
          : () => this.range(0, old_minutes)
        : () => ''
    return {
      disabledHours:
        new_date == old_date
          ? () => this.range(0, 24).splice(0, old_hours)
          : () => '',
      disabledMinutes: flag
    }
  }

  getImgLogo = item => {
    const { id, icon, isDefault } = item
    let img = <></>
    switch (id) {
      case '1':
        img = <img src={zoom} width={61} height={14} />
        break
      case '2':
        img = <img src={kty} width={62} height={18} />
        break
      case '3':
        img = <img src={zhumu} width={59} height={25} />
        break
      case '4':
        img = <img src={zyy} width={37} height={31} />
        break
      case '5':
        img = <img src={tx} width={72} height={26} />
        break
      default:
        break
    }
    return img
  }

  onVideoProviderChange = e => {
    this.setState({
      providerDefault: e.target.value
    })
  }

  handleSelectVideoProvider = (e, id) => {
    e && e.stopPropagation()
    this.setState({
      providerDefault: id
    })
  }

  handleVideoArrow = type => {
    const { videoConferenceProviderList = [] } = this.props
    let currentElem = document.getElementById('video_provider')
    if (!currentElem) return
    // currentElem.innerHTML = currentElem.innerHTML + currentElem.innerHTML;//将轮播内容复制一份

    if (type == 'right') {
      if (stepIndex + 4 == videoConferenceProviderList.length) {
        return
      }
      stepIndex++
      currentElem.style.left = -stepIndex * 93 + 'px'
    } else if (type == 'left') {
      if (stepIndex == 0) {
        return
      }
      stepIndex--
      currentElem.style.left = stepIndex * 93 + 'px'
    }
  }

  renderVideoProviderTitle = id => {
    let title = ''
    switch (id) {
      case '1': // 表示zoom
        title = 'zoom会议'
        break
      case '2': // 表示zoom
        title = '科天云会议'
        break
      case '3': // 表示zoom
        title = '瞩目会议'
        break
      case '4': // 表示zoom
        title = '章鱼云会议'
        break
      case '5': // 表示zoom
        title = '腾讯会议'
        break
      default:
        break
    }
    return title
  }

  renderPopover = () => {
    const {
      saveToProject,
      videoMeetingPopoverVisible,
      dueTimeList = [],
      start_time,
      meeting_start_time,
      selectedKeys,
      currentSelectedProjectMembersList = [],
      toNoticeList = [],
      othersPeople = [],
      card_id,
      org_id,
      meetingTitle = '',
      showUserDefinedIconVisible,
      defaultValue,
      isShowNowTime,
      isExeecedTime,
      remindDropdownVisible
    } = this.state
    let { projectList, board_id, videoConferenceProviderList = [] } = this.props
    //过滤出来当前用户有编辑权限的项目
    // projectList = this.filterProjectWhichCurrentUserHasEditPermission(projectList)

    let newToNoticeList = [].concat(...toNoticeList, ...othersPeople)
    let {
      defaultSaveToProject,
      defaultMeetingTitle,
      currentDelayStartTime
    } = this.getVideoMeetingPopoverContentNoramlDatas()
    const videoMeetingPopoverContent_ = (
      <div>
        {videoMeetingPopoverVisible && (
          <div
            className={`${indexStyles.videoMeeting__wrapper} ${globalStyles.global_vertical_scrollbar}`}
          >
            <div className={indexStyles.videoMeeting__topic}>
              <div className={indexStyles.videoMeeting__topic_content}>
                {/* 项目选择 S */}
                <span
                  style={{ position: 'relative' }}
                  className={indexStyles.videoMeeting__topic_content_save}
                >
                  <Select
                    defaultValue={
                      saveToProject ? saveToProject : defaultSaveToProject
                    }
                    onChange={this.handleVideoMeetingSaveSelectChange}
                    style={{ width: '100%' }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {/* <Option value={null}>不存入项目</Option> */}
                    {projectList.length !== 0 &&
                      projectList.map(project => (
                        <Option value={project.board_id} key={project.board_id}>
                          {project.board_name}
                        </Option>
                      ))}
                  </Select>
                </span>
                {/* 项目选择 E */}

                {/* 会议名称 S */}
                <span className={indexStyles.videoMeeting__topic_content_title}>
                  <Input
                    value={meetingTitle ? meetingTitle : defaultMeetingTitle}
                    onChange={this.handleVideoMeetingTopicChange}
                  />
                </span>
                {/* 会议名称 E */}

                {/* 时间选择 S */}
                <span
                  id={'videoMeeting__topic_content_time'}
                  style={{ zIndex: 1 }}
                  className={indexStyles.videoMeeting__topic_content_time}
                >
                  <span
                    className={
                      indexStyles.videoMeeting__topic_content_datePicker
                    }
                    style={{
                      position: 'relative',
                      zIndex: 0,
                      minWidth: '200px',
                      lineHeight: '38px',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}
                  >
                    <span>
                      <Input
                        value={start_time ? start_time : currentDelayStartTime}
                      />
                    </span>
                    <DatePicker
                      allowClear={false}
                      onChange={this.startDatePickerChange.bind(this)}
                      getCalendarContainer={() =>
                        document.getElementById(
                          'videoMeeting__topic_content_time'
                        )
                      }
                      disabledDate={this.disabledDate}
                      disabledTime={this.disabledDateTime}
                      value={
                        start_time
                          ? moment(new Date(Number(meeting_start_time)))
                          : undefined
                      }
                      format="YYYY/MM/DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                      style={{
                        opacity: 0,
                        background: '#000000',
                        position: 'absolute',
                        left: 0,
                        width: 'auto'
                      }}
                    />
                    {/* <span disabled={isShowNowTime ? true : false} style={{ color: isShowNowTime ? 'rgba(0,0,0,0.25)' : '#1890FF' }} onClick={this.handleChangeNowTime} className={indexStyles.videoMeeting__topic_content_rightnow}>现在</span> */}
                  </span>
                  <span style={{ position: 'relative' }}>
                    <Select
                      // onChange={(e) => { this.endDatePickerChange(e) }}

                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      dropdownClassName={`${indexStyles.select_overlay} ${globalStyles.global_vertical_scrollbar}`}
                      style={{ width: '136px' }}
                      value={[defaultValue]}
                    >
                      {dueTimeList &&
                        dueTimeList.map((item, stepIndex) => (
                          <Option
                            onClick={e => {
                              this.endDatePickerChange(e, item.remind_time_type)
                            }}
                            value={item.txtVal}
                          >{`持续 ${item.txtVal} ${
                            item.remind_time_type == 'm' ? '分钟' : '小时'
                          }`}</Option>
                        ))}
                    </Select>
                  </span>
                </span>
                {/* 时间选择 E */}
              </div>
            </div>
            {/* 设置通知提醒 S */}
            <div className={indexStyles.videoMeeting__remind}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                  {isShowNowTime || isExeecedTime ? '邀请' : '提醒'}谁参与?
                </span>
                {/* {
									isShowNowTime || isExeecedTime ? ('') : (
										<span>
											<Dropdown overlay={this.renderSelectedRemindTime()}>
												<span className={`${globalStyles.authTheme}`}>开始前 {selectedKeys ? selectedKeys : '5'} 分钟提醒 &#xe7ee;</span>
											</Dropdown>
										</span>
									)
								} */}
              </div>
              <div className={indexStyles.noticeUsersWrapper}>
                {!(newToNoticeList && newToNoticeList.length) ? (
                  <div style={{ flex: '1', position: 'relative' }}>
                    <Dropdown
                      className={indexStyles.dropdownWrapper}
                      trigger={['click']}
                      visible={remindDropdownVisible}
                      onVisibleChange={this.handleVisibleChange}
                      overlayClassName={indexStyles.overlay_pricipal}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      overlayStyle={{ maxWidth: '200px' }}
                      overlay={
                        <MenuSearchPartner
                          isInvitation={true}
                          show_select_all={true}
                          select_all_type={'0'}
                          listData={currentSelectedProjectMembersList}
                          keyCode={'user_id'}
                          searchName={'name'}
                          currentSelect={newToNoticeList}
                          board_id={board_id}
                          user_defined_icon={<span>&#xe846;</span>}
                          chgUserDefinedIcon={this.chgUserDefinedIcon}
                          chirldrenTaskChargeChange={
                            this.chirldrenTaskChargeChange
                          }
                        />
                      }
                    >
                      <div className={indexStyles.addNoticePerson}>
                        <Icon
                          type="plus-circle"
                          style={{ fontSize: '40px', color: '#40A9FF' }}
                        />
                      </div>
                    </Dropdown>
                  </div>
                ) : (
                  <div style={{ flex: '1', position: 'relative' }}>
                    <Dropdown
                      className={indexStyles.dropdownWrapper}
                      trigger={['click']}
                      visible={remindDropdownVisible}
                      onVisibleChange={this.handleVisibleChange}
                      overlayClassName={indexStyles.overlay_pricipal}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      overlayStyle={{ maxWidth: '200px' }}
                      overlay={
                        <MenuSearchPartner
                          isInvitation={true}
                          Inputlaceholder="输入手机号"
                          show_select_all={true}
                          select_all_type={'0'}
                          listData={currentSelectedProjectMembersList}
                          keyCode={'user_id'}
                          searchName={'name'}
                          currentSelect={newToNoticeList}
                          board_id={board_id}
                          user_defined_icon={<span>&#xe846;</span>}
                          chgUserDefinedIcon={this.chgUserDefinedIcon}
                          chirldrenTaskChargeChange={
                            this.chirldrenTaskChargeChange
                          }
                        />
                      }
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div className={indexStyles.addNoticePerson}>
                          <Icon
                            type="plus-circle"
                            style={{
                              fontSize: '40px',
                              color: '#40A9FF',
                              margin: '0 12px 16px'
                            }}
                          />
                        </div>

                        {newToNoticeList.map(value => {
                          const { avatar, name, user_name, user_id } = value
                          let tempValue = Object.keys(value)
                          if (!tempValue) return
                          return (
                            <div
                              style={{ display: 'flex', flexWrap: 'wrap' }}
                              key={user_id}
                            >
                              <div
                                className={`${indexStyles.user_item}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  position: 'relative',
                                  marginRight: '12px',
                                  marginBottom: '16px',
                                  textAlign: 'center'
                                }}
                                key={user_id}
                              >
                                {avatar ? (
                                  <Tooltip
                                    placement="top"
                                    title={name || user_name || '佚名'}
                                  >
                                    <img
                                      className={indexStyles.img_hover}
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 20,
                                        margin: '0 2px'
                                      }}
                                      src={avatar}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip
                                    placement="top"
                                    title={name || user_name || '佚名'}
                                  >
                                    <div
                                      className={indexStyles.default_user_hover}
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 20,
                                        backgroundColor: '#f5f5f5',
                                        margin: '0 2px'
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
                                  </Tooltip>
                                )}
                                {/* <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div> */}
                                <span
                                  onClick={e => {
                                    this.handleRemoveExecutors(e, user_id)
                                  }}
                                  className={`${indexStyles.userItemDeleBtn}`}
                                ></span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Dropdown>
                  </div>
                )}
              </div>
            </div>
            {/* 设置通知提醒 E */}

            <div
              id={'videoProviderWrapper'}
              style={{
                width: '400px',
                position: 'relative',
                marginRight: '-16px',
                margin: 'auto',
                paddingLeft: '8px'
              }}
            >
              {videoConferenceProviderList &&
                videoConferenceProviderList.length > 4 &&
                stepIndex > 0 && (
                  <div
                    onClick={() => {
                      this.handleVideoArrow('left')
                    }}
                    className={`${indexStyles.video_arrow} ${indexStyles.video_arrow_left}`}
                  >
                    <span className={globalStyles.authTheme}>&#xe7ec;</span>
                  </div>
                )}
              <span>聆悉推荐使用以下方式开展远程会议: </span>
              <div
                style={{
                  position: 'relative',
                  width: '372px',
                  overflow: 'hidden'
                }}
              >
                <div
                  id={'video_provider'}
                  style={{ display: 'flex', position: 'relative' }}
                >
                  {videoConferenceProviderList &&
                    videoConferenceProviderList.map(item => {
                      return (
                        <Radio.Group
                          style={{ marginBottom: '12px' }}
                          onChange={this.onVideoProviderChange}
                          value={
                            this.state.providerDefault
                              ? this.state.providerDefault
                              : item.is_default == '1'
                              ? item.id
                              : ''
                          }
                        >
                          <div
                            key={`${item.id}-${item.icon}`}
                            style={{ textAlign: 'center', marginTop: '12px' }}
                          >
                            <Tooltip
                              overlayStyle={{ minWidth: '86px' }}
                              autoAdjustOverflow={false}
                              getPopupContainer={() =>
                                document.getElementById(`videoProviderWrapper`)
                              }
                              title={this.renderVideoProviderTitle(item.id)}
                              placement="top"
                            >
                              <div
                                onClick={e => {
                                  this.handleSelectVideoProvider(e, item.id)
                                }}
                                className={indexStyles.video_provider}
                              >
                                {this.getImgLogo(item)}
                              </div>
                            </Tooltip>
                            <div>
                              <Radio value={item.id} />
                            </div>
                          </div>
                        </Radio.Group>
                      )
                    })}
                </div>
              </div>
              {videoConferenceProviderList &&
                videoConferenceProviderList.length > 4 &&
                stepIndex + 4 < videoConferenceProviderList.length && (
                  <div
                    onClick={() => {
                      this.handleVideoArrow('right')
                    }}
                    className={`${indexStyles.video_arrow} ${indexStyles.video_arrow_right}`}
                  >
                    <span className={globalStyles.authTheme}>&#xe7eb;</span>
                  </div>
                )}
            </div>
            <div className={indexStyles.videoMeeting__submitBtn}>
              <Button
                disabled={
                  !defaultSaveToProject ||
                  this.state.notProjectList ||
                  (this.state.meetingTitle == '' && this.state.changeValue)
                }
                type="primary"
                onClick={this.handleVideoMeetingSubmit}
              >
                {isShowNowTime ? '发起会议' : '预约会议'}
              </Button>
            </div>
            {/* <div className={indexStyles.videoMeeting__remarks}>
							<span>聆悉推荐使用以下方式开展远程会议: (点击前往下载）</span>
							<span>
								<a href="https://zoom.com.cn/download" target="_blank"><img src={zoom_logo} alt="Zoom" title="Zoom视频会议" /></a>
								<a href="https://www.xylink.com/download" target="_blank"><img src={xiaoyuyilian_logo} alt="小鱼易连" title="小鱼易连视频会议" /></a>
							</span>
						</div> */}
          </div>
        )}
      </div>
    )
    return videoMeetingPopoverContent_
  }

  renderPopoverHeader = () => {
    const {
      videoMeetingPopoverVisible,
      saveProjectName,
      saveToProject
    } = this.state
    const videoMeetingPopoverContent_ = (
      <div>
        {videoMeetingPopoverVisible && (
          <div className={indexStyles.videoMeeting__header}>
            <div
              className={`${globalStyles.authTheme} ${indexStyles.videoMeeting__mark}`}
            >
              &#xe6de;
            </div>
            <div className={indexStyles.videoMeeting__title}>
              <span
                style={{
                  maxWidth: '256px',
                  marginRight: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block'
                }}
              >
                {(saveToProject && saveProjectName) ||
                  (defaultSaveProjectName &&
                    `${saveProjectName ||
                      defaultSaveProjectName}${currentNounPlanFilterName(
                      PROJECTS
                    )}`)}
              </span>
              在线会议
            </div>
          </div>
        )}
      </div>
    )
    return videoMeetingPopoverContent_
  }

  render() {
    const { videoMeetingPopoverVisible } = this.state
    return (
      <Popover
        visible={videoMeetingPopoverVisible}
        placement="leftBottom"
        title={this.renderPopoverHeader()}
        content={this.renderPopover()}
        onVisibleChange={this.handleVideoMeetingPopoverVisibleChange}
        trigger="click"
        getPopupContainer={() =>
          document.getElementById('technologicalLayoutWrapper')
        }
      >
        <div
          className={indexStyles.videoMeeting__icon}
          onMouseEnter={this.handleShowVideoMeeting}
          onClick={this.handleToggleVideoMeetingPopover}
        />
      </Popover>
    )
  }
}

export default VideoMeetingPopoverContent
