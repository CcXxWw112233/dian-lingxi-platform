import React, { Component } from 'react'
import { Icon, Dropdown, Tooltip, Popconfirm, DatePicker, message, Menu } from 'antd'
import appendSubTaskStyles from './appendSubTask.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import AvatarList from '../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { timestampToTimeNormal3, compareTwoTimestamp, timeToTimestamp, timestampToTimeNormal, timestampToTime } from '@/utils/util'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  MESSAGE_DURATION_TIME
} from "@/globalset/js/constant";
import { connect } from 'dva'
import { arrayNonRepeatfy } from '../../../utils/util'

@connect(({ publicTaskDetailModal: { drawContent = {} } }) => ({
  drawContent
}))
export default class AppendSubTaskItem extends Component {

  state = {
    is_edit_sub_name: false, // 是否修改子任务名称, 默认为 false
  }

  componentWillMount() {
    //设置默认项目名称
    this.initSet(this.props)
  }

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

  // 是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  //初始化根据props设置state
  initSet(props) {
    const { childTaskItemValue } = props
    const { start_time, due_time, executors = [], card_name } = childTaskItemValue
    // let local_executor = [{//任务执行人信息
    //   user_id: '',
    //   user_name: '',
    //   avatar: '',
    // }]
    let local_executor
    if (executors.length) {
      local_executor = executors
    }

    this.setState({
      local_start_time: start_time,
      local_due_time: due_time,
      local_card_name: card_name,
      local_executor
    })
  }

  // 获取 currentDrawerContent 数据
  getCurrentDrawerContentPropsModelDatasExecutors = () => {
    const { drawContent: { properties = [] } } = this.props
    const pricipleInfo = properties.filter(item => item.code == 'EXECUTOR')[0]
    return pricipleInfo || {}
  }

  // 执行人下拉回调
  chirldrenTaskChargeChange = (dataInfo) => {
    // let sub_executors = []
    const { data = [], drawContent = {}, dispatch, childTaskItemValue } = this.props
    // const { executors = [] } = drawContent
    const { data: executors = [] } = this.getCurrentDrawerContentPropsModelDatasExecutors()
    const { card_id, executors: sub_executors = [] } = childTaskItemValue
    const { selectedKeys = [], type, key } = dataInfo
    let new_data = [...data]
    let new_executors = [...executors]
    let new_drawContent = { ...drawContent }
    let new_sub_executors = [...sub_executors]
    if (type == 'add') {
      // 这里是将选中的人添加进子任务执行人以及更新父级任务执行人
      new_data.map(item => {
        if (selectedKeys.indexOf(item.user_id) != -1) {
          new_sub_executors.push(item)
          new_executors.push(item)
        }
      })
      Promise.resolve(
        dispatch({
          type: 'publicTaskDetailModal/addTaskExecutor',
          payload: {
            card_id,
            executor: key
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          new_drawContent['properties'] = this.filterCurrentUpdateDatasField('EXECUTOR', arrayNonRepeatfy(new_executors, 'user_id'))
          console.log(arrayNonRepeatfy(new_sub_executors, 'user_id'), 'sssssssssssss_我的天')
          this.setChildTaskIndrawContent({ name: 'executors', value: arrayNonRepeatfy(new_sub_executors, 'user_id') }, card_id)// 先弹窗中子任务执行人中的数据
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawContent: new_drawContent
            }
          })
          this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: drawContent, card_id, name: 'executors', value: arrayNonRepeatfy(new_executors, 'user_id'), overlay_sub_pricipal: 'EXECUTOR' })
        }
      })
    } else if (type == 'remove') {
      new_sub_executors = new_sub_executors.filter(i => i.user_id != key) || []
      dispatch({
        type: 'publicTaskDetailModal/removeTaskExecutor',
        payload: {
          card_id,
          executor: key
        }
      })
      this.setChildTaskIndrawContent({ name: 'executors', value: arrayNonRepeatfy(new_sub_executors, 'user_id') }, card_id)
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: drawContent, card_id, name: 'executors', value: new_executors, overlay_sub_pricipal: 'EXECUTOR' })
      // this.props.handleChildTaskChange && this.props.handleChildTaskChange({ parent_card_id: drawContent.card_id, data: { ...childTaskItemValue, executors: new_sub_executors }, card_id, action: 'update' })

    }
    this.setState({
      local_executor: arrayNonRepeatfy(new_sub_executors, 'user_id')
    })
  }

  // 子任务点击完成回调
  itemOneClick = () => {
    const { childTaskItemValue, dispatch, board_id } = this.props
    const { card_id, is_realize = '0' } = childTaskItemValue
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1',
      board_id
    }

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
      this.setChildTaskIndrawContent({ name: 'is_realize', value: is_realize === '1' ? '0' : '1' }, card_id)
    })

  }

  // 修改子任务名称
  handleSubTaskName = () => {
    this.setState({
      is_edit_sub_name: true
    })
  }

  // 失去焦点事件
  setchildTaskNameBlur = () => {
    const { dispatch, childTaskItemValue, board_id } = this.props
    const { card_id } = childTaskItemValue
    const { local_card_name } = this.state
    if (childTaskItemValue['card_name'] == local_card_name) { // 表示名称没有变化
      this.setState({
        is_edit_sub_name: false
      })
      return false
    }
    // if (!local_card_name) {
    //   this.setState({
    //     local_card_name: childTaskItemValue['card_name']
    //   })
    //   return false
    // }
    if (local_card_name && local_card_name != '') {
      childTaskItemValue['card_name'] = local_card_name
      const updateObj = {
        card_id,
        name: local_card_name,
        board_id
      }
      dispatch({
        type: 'publicTaskDetailModal/updateTaskVTwo',
        payload: {
          updateObj
        }
      })
      this.setChildTaskIndrawContent({ name: 'card_name', value: local_card_name }, card_id)
    } else {
      this.setState({
        local_card_name: childTaskItemValue['card_name']
      })
    }
    this.setState({
      is_edit_sub_name: false
    })
  }

  // 文本框onChange事件
  setchildTaskNameChange = (e) => {
    if (e.target.value.trimLR() == '') {
      // message.warn('名称不能为空哦~', MESSAGE_DURATION_TIME)
      this.setState({
        local_card_name: ''
      })
      return false
    }
    this.setState({
      local_card_name: e.target.value
    })
  }

  // 子任务更新弹窗数据 rely_card_datas,更新后返回的相关依赖的更新任务列表
  setChildTaskIndrawContent = ({ name, value }, card_id, rely_card_datas) => {
    const { childDataIndex } = this.props
    const { drawContent = {}, dispatch, childTaskItemValue } = this.props
    let new_drawContent = { ...drawContent }
    const { data = [] } = drawContent['properties'].filter(item => item.code == 'SUBTASK')[0]
    let new_data = [...data]
    // new_drawContent['child_data'][childDataIndex][name] = value
    new_data[childDataIndex][name] = value
    new_drawContent['properties'] = this.filterCurrentUpdateDatasField('SUBTASK', new_data)
    dispatch({
      type: 'projectDetailTask/updateDatas',
      payload: {
        drawContent: new_drawContent
      }
    })
    if ((name && value) || (name && value == null)) {
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id: drawContent.card_id, name: 'card_data', value: new_data })
      this.props.handleChildTaskChange && this.props.handleChildTaskChange({ parent_card_id: drawContent.card_id, data: { ...childTaskItemValue, [name]: value }, card_id, action: 'update', rely_card_datas })
    }
  }

  // 按下回车事件
  handlePressEnter = (e) => {
    if (e.keyCode == 13) {
      this.setchildTaskNameBlur()
    }
  }

  // 删除子任务回调
  deleteConfirm({ card_id, childDataIndex }) {
    const { drawContent = {}, dispatch } = this.props
    // const { child_data = [] } = drawContent
    const { data: child_data = [] } = drawContent['properties'].filter(item => item.code == 'SUBTASK')[0]
    let newChildData = [...child_data]
    let new_drawContent = { ...drawContent }
    newChildData.map((item, index) => {
      if (item.card_id == card_id) {
        newChildData.splice(index, 1)
      }
    })
    // new_drawContent['child_data'] = newChildData
    new_drawContent['properties'] = this.filterCurrentUpdateDatasField('SUBTASK', newChildData)
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/deleteTaskVTwo',
        payload: {
          id: card_id
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      let new_data = []
      if (!(res.data instanceof Array)) {
        new_data = []
      } else {
        new_data = [...res.data]
      }
      this.props.handleChildTaskChange && this.props.handleChildTaskChange({ parent_card_id: drawContent.card_id, card_id, action: 'delete', rely_card_datas: res.data })
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      this.props.whetherUpdateParentTaskTime && this.props.whetherUpdateParentTaskTime(new_data)
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id: drawContent.card_id, name: 'card_data', value: newChildData })
    })
  }

  // 禁用截止时间
  disabledDueTime = (due_time) => {
    const { childTaskItemValue: { start_time } } = this.props
    if (!start_time || !due_time) {
      return false;
    }
    const newStartTime = start_time.toString().length > 10 ? Number(start_time).valueOf() / 1000 : Number(start_time).valueOf()
    return Number(due_time.valueOf()) / 1000 < newStartTime;
  }

  // 禁用开始时间
  disabledStartTime = (start_time) => {
    const { childTaskItemValue: { due_time } } = this.props
    if (!start_time || !due_time) {
      return false;
    }
    const newDueTime = due_time.toString().length > 10 ? Number(due_time).valueOf() / 1000 : Number(due_time).valueOf()
    return Number(start_time.valueOf()) / 1000 >= newDueTime//Number(due_time).valueOf();
  }

  startDatePickerChange(timeString) {
    const { drawContent = {}, childTaskItemValue, dispatch, board_id } = this.props
    const { milestone_data = {}, card_id: parent_card_id } = drawContent
    const { data = [] } = drawContent['properties'] && drawContent['properties'].filter(item => item.code == 'MILESTONE').length && drawContent['properties'].filter(item => item.code == 'MILESTONE')[0]
    const { card_id } = childTaskItemValue
    const nowTime = timeToTimestamp(new Date())
    const start_timeStamp = timeToTimestamp(timeString)
    const updateObj = {
      card_id, start_time: start_timeStamp, board_id
    }
    if (!compareTwoTimestamp(data.deadline, start_timeStamp)) {
      message.warn('任务的开始日期不能大于关联里程碑的截止日期')
      return false
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
      if (!compareTwoTimestamp(start_timeStamp, nowTime)) {
        setTimeout(() => {
          message.warn(`您设置了一个今天之前的日期: ${timestampToTime(timeString, true)}`)
        }, 500)
      }
      this.setState({
        local_start_time: start_timeStamp
      })
      let new_data = []
      if (!(res.data instanceof Array)) {
        new_data = []
      } else {
        new_data = [...res.data]
      }
      new_data = new_data.filter(item => item.id == parent_card_id) || []
      this.setChildTaskIndrawContent({ name: 'start_time', value: start_timeStamp }, card_id, res.data)
      this.props.whetherUpdateParentTaskTime && this.props.whetherUpdateParentTaskTime(new_data)
      this.props.updateRelyOnRationList && this.props.updateRelyOnRationList(res.data)
    })
  }

  // 删除开始时间
  handleDelStartTime = (e) => {
    e && e.stopPropagation()
    const { dispatch, childTaskItemValue, board_id, drawContent: { card_id: parent_card_id } } = this.props
    const { card_id, due_time } = childTaskItemValue
    let update_child_item = {
      id: card_id,
      start_time: '',
      due_time: due_time
    }
    const updateObj = {
      card_id, start_time: '0', board_id
    }
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
      this.setState({
        local_start_time: null
      })
      let new_data = []
      let update_data = []
      if (!(res.data instanceof Array)) {
        new_data = []
        update_data = [].concat(update_child_item)
      } else {
        new_data = [...res.data]
        update_data = [].concat(update_child_item, ...res.data)
      }
      new_data = new_data.filter(item => item.id == parent_card_id) || []
      this.setChildTaskIndrawContent({ name: 'start_time', value: null }, card_id, update_data)
      this.props.whetherUpdateParentTaskTime && this.props.whetherUpdateParentTaskTime(new_data)
      this.props.updateRelyOnRationList && this.props.updateRelyOnRationList(res.data)
    })

  }

  //截止时间
  endDatePickerChange(timeString) {
    const { drawContent = {}, childTaskItemValue, dispatch, board_id } = this.props
    const { milestone_data = {}, card_id: parent_card_id } = drawContent
    const { data = [] } = drawContent['properties'] && drawContent['properties'].filter(item => item.code == 'MILESTONE').length && drawContent['properties'].filter(item => item.code == 'MILESTONE')[0]
    const { card_id } = childTaskItemValue
    const nowTime = timeToTimestamp(new Date())
    const due_timeStamp = timeToTimestamp(timeString)
    const updateObj = {
      card_id, due_time: due_timeStamp, board_id
    }
    if (!compareTwoTimestamp(data.deadline, due_timeStamp)) {
      message.warn('任务的截止日期不能大于关联里程碑的截止日期')
      return false
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
      if (!compareTwoTimestamp(due_timeStamp, nowTime)) {
        setTimeout(() => {
          message.warn(`您设置了一个今天之前的日期: ${timestampToTime(timeString, true)}`)
        }, 500)
      }
      this.setState({
        local_due_time: due_timeStamp
      })
      let new_data = []
      if (!(res.data instanceof Array)) {
        new_data = []
      } else {
        new_data = [...res.data]
      }
      new_data = new_data.filter(item => item.id == parent_card_id) || []
      this.setChildTaskIndrawContent({ name: 'due_time', value: due_timeStamp }, card_id, res.data)
      this.props.whetherUpdateParentTaskTime && this.props.whetherUpdateParentTaskTime(new_data)
      this.props.updateRelyOnRationList && this.props.updateRelyOnRationList(res.data)
    })
  }

  // 删除结束时间
  handleDelDueTime = (e) => {
    e && e.stopPropagation()
    const { dispatch, childTaskItemValue, board_id, drawContent: { card_id: parent_card_id } } = this.props
    const { card_id, start_time } = childTaskItemValue
    let update_child_item = {
      id: card_id,
      start_time: start_time,
      due_time: ''
    }
    const updateObj = {
      card_id, due_time: '0', board_id
    }
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
      this.setState({
        local_due_time: null
      })
      let new_data = []
      let update_data = []
      if (!(res.data instanceof Array)) {
        new_data = []
        update_data = [].concat(update_child_item)
      } else {
        new_data = [...res.data]
        update_data = [].concat(update_child_item, ...res.data)
      }
      new_data = new_data.filter(item => item.id == parent_card_id) || []
      this.setChildTaskIndrawContent({ name: 'due_time', value: null }, card_id, update_data)
      this.props.whetherUpdateParentTaskTime && this.props.whetherUpdateParentTaskTime(new_data)
      this.props.updateRelyOnRationList && this.props.updateRelyOnRationList(res.data)
    })
  }

  // 渲染子任务交付物点点点内容
  subFileOperater = () => {
    return (
      <Menu>
        <Menu.Item key="download">下载到本地</Menu.Item>
        <Menu.Item key="delete">删除交付物</Menu.Item>
      </Menu>
    )
  }

  render() {
    const { childTaskItemValue, childDataIndex, dispatch, data = {}, drawContent = {}, board_id } = this.props
    const { card_id, is_realize = '0' } = childTaskItemValue
    const { local_card_name, local_executor = [], local_start_time, local_due_time, is_edit_sub_name } = this.state


    return (
      <div style={{ display: 'flex', position: 'relative' }} className={appendSubTaskStyles.active_icon}>
        {/* <Popconfirm getPopupContainer={triggerNode => triggerNode.parentNode} onConfirm={() => { this.deleteConfirm({ card_id, childDataIndex }) }} title={'删除该子任务？'}>
          <div className={`${appendSubTaskStyles.del_icon}`}>
            <span className={`${globalStyles.authTheme}`}>&#xe7c3;</span>
          </div>
        </Popconfirm> */}
        <div className={`${appendSubTaskStyles.subTaskItemWrapper} ${appendSubTaskStyles.subTaskItemWrapper_active}`} key={childDataIndex}>
          <div style={{ display: 'flex' }}>
            {/*完成*/}
            <div style={{ flexShrink: 0 }} className={is_realize === '1' ? appendSubTaskStyles.nomalCheckBoxActive : appendSubTaskStyles.nomalCheckBox} onClick={this.itemOneClick}>
              <Icon type="check" style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', position: 'absolute', top: '0', right: '0', left: '0', bottom: '0', margin: '1px auto' }} />
            </div>
            {/* 名字 */}
            <div style={{ flex: '1', cursor: 'pointer', borderBottom: '1px solid #C1C4CB', marginLeft: '10px', display: 'flex', justifyContent: 'space-between' }}>
              {
                !is_edit_sub_name ? (
                  <>
                    <div onClick={this.handleSubTaskName} className={appendSubTaskStyles.card_name}>
                      <span title={local_card_name} style={{ wordBreak: 'break-all' }}>{local_card_name}</span>
                    </div>
                    <div style={{ display: 'flex', width: '48px', justifyContent: 'space-between' }}>
                      {/* <Tooltip style={{minWidth: '88px'}} getPopupContainer={triggerNode => triggerNode.parentNode} title={'上传交付物'} placement="top"> */}
                      <div title={'上传交付物'} className={`${appendSubTaskStyles.sub_upload} ${globalStyles.authTheme}`}>&#xe606;</div>
                      {/* </Tooltip> */}
                      <Popconfirm getPopupContainer={triggerNode => triggerNode.parentNode} onConfirm={() => { this.deleteConfirm({ card_id, childDataIndex }) }} title={'删除该子任务？'} placement={'topRight'}>
                        <div title={'删除子任务'} className={`${appendSubTaskStyles.del_icon}`}>
                          <span className={`${globalStyles.authTheme}`}>&#xe7c3;</span>
                        </div>
                      </Popconfirm>
                    </div>
                  </>
                ) : (
                    <div style={{ width: 'calc(100% - 8px)' }}>
                      <input
                        autosize={true}
                        value={local_card_name}
                        onBlur={this.setchildTaskNameBlur}
                        onChange={this.setchildTaskNameChange}
                        onKeyDown={this.handlePressEnter}
                        autoFocus={true}
                        // goldName={card_name}
                        maxLength={100}
                        nodeName={'input'}
                        style={{ width: '100%', display: 'block', fontSize: 14, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', outline: 'none', paddingLeft: '12px' }}
                      />
                    </div>
                  )
              }
            </div>
          </div>
          <div style={{ display: 'flex', paddingLeft: '16px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              {/* 开始时间 */}
              <div>
                {
                  local_start_time ? (
                    <div className={appendSubTaskStyles.due_time}>
                      <div>
                        <span>{timestampToTimeNormal3(local_start_time, true)}</span>
                        <span onClick={this.handleDelStartTime} className={`${local_start_time && appendSubTaskStyles.timeDeleBtn}`}></span>
                      </div>
                      <DatePicker
                        disabledDate={this.disabledStartTime.bind(this)}
                        // onOk={this.startDatePickerChange.bind(this)}
                        onChange={this.startDatePickerChange.bind(this)}
                        // getCalendarContainer={triggerNode => triggerNode.parentNode}
                        placeholder={local_start_time ? timestampToTimeNormal(local_start_time, '/', true) : '开始时间'}
                        format="YYYY/MM/DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                    </div>
                  ) : (
                      <div className={`${appendSubTaskStyles.start_time}`}>
                        <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                          开始时间
                      <DatePicker
                            disabledDate={this.disabledStartTime.bind(this)}
                            // onOk={this.startDatePickerChange.bind(this)}
                            onChange={this.startDatePickerChange.bind(this)}
                            // getCalendarContainer={triggerNode => triggerNode.parentNode}
                            placeholder={local_start_time ? timestampToTimeNormal(local_start_time, '/', true) : '开始时间'}
                            format="YYYY/MM/DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                            style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                        </span>
                      </div>
                    )
                }
              </div>
              &nbsp;
              <span style={{ color: '#bfbfbf' }}> ~ </span>
              &nbsp;
              {/* 截止时间 */}
              <div>
                {
                  local_due_time ? (
                    <div className={appendSubTaskStyles.due_time}>
                      <div>
                        <span>{timestampToTimeNormal3(local_due_time, true)}</span>
                        <span onClick={this.handleDelDueTime} className={`${local_due_time && appendSubTaskStyles.timeDeleBtn}`}></span>
                      </div>
                      <DatePicker
                        disabledDate={this.disabledDueTime.bind(this)}
                        onChange={this.endDatePickerChange.bind(this)}
                        placeholder={local_due_time ? timestampToTimeNormal(local_due_time, '/', true) : '截止时间'}
                        format="YYYY/MM/DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '2px', zIndex: 2 }} />
                    </div>
                  ) : (
                      <div className={`${appendSubTaskStyles.add_due_time}`}>
                        <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>截止时间</span>
                        <DatePicker
                          onChange={this.endDatePickerChange.bind(this)}
                          placeholder={local_due_time ? timestampToTimeNormal(local_due_time, '/', true) : '截止时间'}
                          format="YYYY/MM/DD HH:mm"
                          showTime={{ format: 'HH:mm' }}
                          style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '2px', zIndex: 2 }} />
                      </div>
                    )
                }
              </div>
            </div>

            {/* 执行人 */}
            <div style={{ flexShrink: 0 }}>
              <span style={{ position: 'relative', cursor: 'pointer' }} className={appendSubTaskStyles.user_pr}>
                <Dropdown overlayClassName={appendSubTaskStyles.overlay_sub_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlay={
                    <MenuSearchPartner
                      handleSelectedAllBtn={this.handleSelectedAllBtn}
                      isInvitation={true}
                      listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={local_executor} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                      board_id={board_id} />
                  }>
                  {
                    local_executor.length ? (
                      <div>
                        <AvatarList
                          size="mini"
                          maxLength={3}
                          excessItemsStyle={{
                            color: '#f56a00',
                            backgroundColor: '#fde3cf'
                          }}
                        >
                          {local_executor && local_executor.length ? local_executor.map(({ name, avatar }, index) => (
                            <AvatarList.Item
                              key={index}
                              tips={name}
                              src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                            />
                          )) : (
                              <Tooltip title="执行人">
                                <span className={`${globalStyles.authTheme} ${appendSubTaskStyles.sub_executor}`}>&#xe7b2;</span>
                              </Tooltip>
                            )}
                        </AvatarList>
                      </div>
                    ) : (
                        <Tooltip title="执行人">
                          <span className={`${globalStyles.authTheme} ${appendSubTaskStyles.sub_executor}`}>&#xe7b2;</span>
                        </Tooltip>
                      )
                  }
                </Dropdown>
              </span>
            </div>
          </div>
          {/* 交付物 */}
          <div className={appendSubTaskStyles.sub_filelist_wrapper}>
            <div className={appendSubTaskStyles.sub_filelist_item}>
              <span style={{ display: 'inline-block' }}>
                <span className={`${appendSubTaskStyles.sub_file_icon} ${globalStyles.authTheme}`}>&#xe651;</span>
                <span className={appendSubTaskStyles.sub_file_name}>勘测任务书编制样本.doc</span>
              </span>
              <Dropdown trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={this.subFileOperater()}>
                <span className={`${appendSubTaskStyles.sub_more_icon} ${globalStyles.authTheme}`}>&#xe66f;</span>
              </Dropdown>
            </div>
            <div className={appendSubTaskStyles.sub_filelist_item}>
              <span style={{ display: 'inline-block' }}>
                <span className={`${appendSubTaskStyles.sub_file_icon} ${globalStyles.authTheme}`}>&#xe651;</span>
                <span className={appendSubTaskStyles.sub_file_name}>勘测任务书编制样本.doc</span>
              </span>
              <Dropdown trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={this.subFileOperater()}>
                <span className={`${appendSubTaskStyles.sub_more_icon} ${globalStyles.authTheme}`}>&#xe66f;</span>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
