import React, { Component } from 'react'
import { Tooltip, Button, Dropdown, DatePicker, message } from 'antd'
// import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import globalStyles from '@/globalset/css/globalClassName.less'
import appendSubTaskStyles from './appendSubTask.less'
import AvatarList from '../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import AppendSubTaskItem from './AppendSubTaskItem'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { timestampToTimeNormal3, compareTwoTimestamp, timeToTimestamp, timestampToTimeNormal, timestampToTime } from '@/utils/util'
import { MESSAGE_DURATION_TIME } from '@/globalset/js/constant'
import { connect } from 'dva'
import { arrayNonRepeatfy } from '@/utils/util'

@connect(({ publicTaskDetailModal: { drawContent = {} } }) => ({
  drawContent
}))
export default class AppendSubTask extends Component {

  state = {
    is_add_sub_task: false, // 是否添加子任务, 默认为 false
    sub_executors: [], // 子任务的执行人
    saveDisabled: true, // 是否可以点击确定按钮
    inputValue: '', // 用来保存子任务的名称
    due_time: '', // 截止时间选择
    start_time: '', // 开始时间选择
  }

  initState = () => {
    this.setState({
      is_add_sub_task: false, // 是否添加子任务, 默认为 false
      sub_executors: [], // 子任务的执行人
      saveDisabled: true, // 是否可以点击确定按钮
      inputValue: '', // 用来保存子任务的名称
      due_time: '', // 截止时间选择
      start_time: '', // 开始时间选择
    })
  }

  componentWillReceiveProps(nextProps) {
    const { drawContent: { card_id } } = nextProps
    const { drawContent: { card_id: old_card_id } } = this.props
    if ((card_id != old_card_id) && (card_id && old_card_id)) {
      this.initState()
    }
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

  // 添加子任务
  addSubTask(e) {
    e && e.stopPropagation();
    const { drawContent: { deliverables = [] } } = this.props
    if (deliverables && deliverables.length) return
    this.setState({
      is_add_sub_task: true
    })
  }

  // 点击取消
  handleCancel(e) {
    e && e.stopPropagation();
    this.initState()
  }

  // 点击确定
  handleSave(e) {
    e && e.stopPropagation();
    const { drawContent, dispatch } = this.props
    const { board_id, card_id, list_id } = drawContent
    const { data: executors = [] } = this.getCurrentDrawerContentPropsModelDatasExecutors()
    const { inputValue, sub_executors, due_time, start_time } = this.state
    const { data = [] } = drawContent['properties'].filter(item => item.code == 'SUBTASK')[0]
    let temp_subExecutors = [...sub_executors]
    let user_ids = []
    let tempData = [...data]
    temp_subExecutors.map(item => {
      user_ids.push(item.user_id)
    })
    const obj = {
      parent_id: card_id,
      // card_id,
      board_id,
      list_id,
      name: inputValue,
      executors: sub_executors,
      users: sub_executors.length ? user_ids.join(',') : '',
      start_time: start_time,
      due_time: due_time,
      card_name: inputValue,
    }
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/addChirldTaskVTwo',
        payload: {
          ...obj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      let { card_info = {}, dependencys = [] } = res.data
      let new_data = [...dependencys]
      new_data = new_data.filter(item => item.id == card_id) || []
      // drawContent['child_data'] && drawContent['child_data'].unshift({...obj, card_id: res.data.card_id})
      tempData.unshift({ ...obj, card_id: card_info.card_id })
      if (sub_executors && sub_executors.length) {
        executors.push(...sub_executors)
        drawContent['properties'] = this.filterCurrentUpdateDatasField('EXECUTOR', arrayNonRepeatfy(executors,'user_id'))
        this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id, operate_properties_code: 'EXECUTOR' })
      }
      drawContent['properties'] = this.filterCurrentUpdateDatasField('SUBTASK', tempData)
      this.props.handleChildTaskChange && this.props.handleChildTaskChange({ parent_card_id: card_id, data: card_info, action: 'add', rely_card_datas: dependencys })
      this.props.whetherUpdateParentTaskTime && this.props.whetherUpdateParentTaskTime(new_data)
      this.initState()
    })
  }

  // 获取 currentDrawerContent 数据
  getCurrentDrawerContentPropsModelDatasExecutors = () => {
    const { drawContent: { properties = [] } } = this.props
    const pricipleInfo = properties.filter(item => item.code == 'EXECUTOR')[0]
    return pricipleInfo || {}
  }

  // 子 执行人的下拉回调
  chirldrenTaskChargeChange = (dataInfo) => {
    let sub_executors = []
    const { data = [], drawContent = {}, dispatch } = this.props
    // const { card_id } = drawContent
    // const { data: executors = [] } = this.getCurrentDrawerContentPropsModelDatasExecutors()
    const { selectedKeys = [] } = dataInfo
    let new_data = [...data]
    // let new_executors = [...executors]
    new_data.map(item => {
      if (selectedKeys.indexOf(item.user_id) != -1) {
        sub_executors.push(item)
        // new_executors.push(item)
      }
    })
    // let new_drawContent = { ...drawContent }
    // new_drawContent['executors'] = this.arrayNonRepeatfy(new_executors)
    // new_drawContent['properties'] = this.filterCurrentUpdateDatasField('EXECUTOR', arrayNonRepeatfy(new_executors, 'user_id'))
    // dispatch({
    //   type: 'publicTaskDetailModal/updateDatas',
    //   payload: {
    //     drawContent: new_drawContent
    //   }
    // })
    // this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: drawContent, card_id, name: 'executors', value: new_executors, overlay_sub_pricipal: 'EXECUTOR' })
    this.setState({
      sub_executors: arrayNonRepeatfy(sub_executors, 'user_id')
    })
  }

  // 禁用截止时间
  disabledDueTime = (due_time) => {
    const { start_time } = this.state
    if (!start_time || !due_time) {
      return false;
    }
    const newStartTime = start_time.toString().length > 10 ? Number(start_time).valueOf() / 1000 : Number(start_time).valueOf()
    return Number(due_time.valueOf()) / 1000 < newStartTime;
  }

  // 禁用开始时间
  disabledStartTime = (start_time) => {
    const { due_time } = this.state
    if (!start_time || !due_time) {
      return false;
    }
    const newDueTime = due_time.toString().length > 10 ? Number(due_time).valueOf() / 1000 : Number(due_time).valueOf()
    return Number(start_time.valueOf()) / 1000 >= newDueTime//Number(due_time).valueOf();
  }

  //子任务名称设置
  setchildTaskNameChange = (e) => {
    if (e.target.value.trimLR() == '') {
      // message.warn('名称不能为空哦~', MESSAGE_DURATION_TIME)
      this.setState({
        inputValue: '',
        saveDisabled: true
      })
      return false
    }
    this.setState({
      inputValue: e.target.value,
      saveDisabled: e.target.value ? false : true
    })
  }

  //开始时间
  startDatePickerChange(timeString) {
    const { drawContent = {}, } = this.props
    const { data = [] } = drawContent['properties'] && drawContent['properties'].filter(item => item.code == 'MILESTONE').length && drawContent['properties'].filter(item => item.code == 'MILESTONE')[0]
    const nowTime = timeToTimestamp(new Date())
    const start_timeStamp = timeToTimestamp(timeString)
    if (!compareTwoTimestamp(data.deadline, start_timeStamp)) {
      message.warn('任务的截止日期不能大于关联里程碑的截止日期')
      return false
    }
    if (!compareTwoTimestamp(start_timeStamp, nowTime)) {
      setTimeout(() => {
        message.warn(`您设置了一个今天之前的日期: ${timestampToTime(timeString, true)}`)
      }, 500)
    }
    setTimeout(() => {
      this.setState({
        start_time: start_timeStamp
      })
    }, 500)
  }

  // 删除开始时间
  handleDelStartTime = (e) => {
    e && e.stopPropagation()
    setTimeout(() => {
      this.setState({
        start_time: null
      })
    }, 500)
  }

  //截止时间
  endDatePickerChange(timeString) {
    const { drawContent = {}, } = this.props
    const { data = [] } = drawContent['properties'] && drawContent['properties'].filter(item => item.code == 'MILESTONE').length && drawContent['properties'].filter(item => item.code == 'MILESTONE')[0]
    const nowTime = timeToTimestamp(new Date())
    const due_timeStamp = timeToTimestamp(timeString)
    if (!compareTwoTimestamp(data.deadline, due_timeStamp)) {
      message.warn('任务的截止日期不能大于关联里程碑的截止日期')
      return false
    }
    if (!compareTwoTimestamp(due_timeStamp, nowTime)) {
      setTimeout(() => {
        message.warn(`您设置了一个今天之前的日期: ${timestampToTime(timeString, true)}`)
      }, 500)
    }
    setTimeout(() => {
      this.setState({
        due_time: due_timeStamp
      })
    }, 500)
  }

  // 删除结束时间
  handleDelDueTime = (e) => {
    e && e.stopPropagation()
    setTimeout(() => {
      this.setState({
        due_time: null
      })
    }, 500)
  }


  render() {
    const { children, drawContent = {}, data: dataInfo, dispatch, handleTaskDetailChange, handleChildTaskChange, whetherUpdateParentTaskTime, updateRelyOnRationList, boardFolderTreeData, projectDetailInfoData, handleRelyUploading } = this.props
    const { card_id, board_id } = drawContent
    const { data: child_data = [] } = drawContent['properties'].filter(item => item.code == 'SUBTASK')[0]
    const { is_add_sub_task, sub_executors = [], saveDisabled, due_time, start_time } = this.state
    let executor = [{//任务执行人信息
      user_id: '',
      full_name: '',
      avatar: '',
    }]

    return (
      <div>
        <div style={{ marginBottom: '12px' }}>
          {
            !is_add_sub_task ? (
              <span onClick={(e) => { this.addSubTask(e) }}>
                {children}
              </span>
            ) : (
                <>
                  <div style={{padding: '9px 12px', borderRadius: '4px', marginLeft: '10px', marginBottom: '4px'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      {/* 文本框部分 */}
                      <span style={{ flex: '1', marginRight: '16px' }}>
                        <input
                          autosize={true}
                          onBlur={this.setchildTaskNameBlur}
                          onChange={this.setchildTaskNameChange}
                          autoFocus={true}
                          // goldName={card_name}
                          maxLength={100}
                          nodeName={'input'}
                          style={{ width: '100%', display: 'block', fontSize: 14, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', outline: 'none', paddingLeft: '12px' }}
                        />
                      </span>
                      {/* 执行人部分 */}
                      <span style={{ position: 'relative' }} className={appendSubTaskStyles.user_pr}>
                        <Dropdown overlayClassName={appendSubTaskStyles.overlay_sub_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                          overlay={
                            <MenuSearchPartner
                              handleSelectedAllBtn={this.handleSelectedAllBtn}
                              isInvitation={true}
                              listData={dataInfo} keyCode={'user_id'} searchName={'name'} currentSelect={sub_executors.length ? sub_executors : executor} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                              board_id={board_id} />
                          }>
                          {
                            sub_executors && sub_executors.length ? (
                              <div>
                                <AvatarList
                                  size="mini"
                                  maxLength={3}
                                  excessItemsStyle={{
                                    color: '#f56a00',
                                    backgroundColor: '#fde3cf'
                                  }}
                                >
                                  {sub_executors && sub_executors.length ? sub_executors.map(({ name, avatar }, index) => (
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flex: 1 }}>
                        {/* 开始时间 */}
                        <span>
                          {
                            start_time ? (
                              <div className={appendSubTaskStyles.due_time}>
                                <div>
                                  <span>{timestampToTimeNormal3(start_time, true)}</span>
                                  <span onClick={this.handleDelStartTime} className={`${start_time && appendSubTaskStyles.timeDeleBtn}`}></span>
                                </div>
                                <DatePicker
                                  disabledDate={this.disabledStartTime.bind(this)}
                                  onChange={this.startDatePickerChange.bind(this)}
                                  placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                                  format="YYYY/MM/DD HH:mm"
                                  showTime={{ format: 'HH:mm' }}
                                  style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '12px', zIndex: 2 }} />
                              </div>
                            ) : (
                                <div className={`${appendSubTaskStyles.add_due_time}`}>
                                  <div>
                                    <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                      开始时间</span>
                                  </div>
                                  <DatePicker
                                    disabledDate={this.disabledStartTime.bind(this)}
                                    onChange={this.startDatePickerChange.bind(this)}
                                    placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                                    format="YYYY/MM/DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '12px', zIndex: 2 }} />
                                </div>
                              )
                          }
                        </span>
                        &nbsp;
                        <span style={{ color: '#bfbfbf' }}> ~ </span>
                        &nbsp;
                        {/* 截止时间 */}
                        <span>
                          {
                            due_time ? (
                              <div className={appendSubTaskStyles.due_time}>
                                <div>
                                  <span>{timestampToTimeNormal3(due_time, true)}</span>
                                  <span onClick={this.handleDelDueTime} className={`${due_time && appendSubTaskStyles.timeDeleBtn}`}></span>
                                </div>
                                <DatePicker
                                  disabledDate={this.disabledDueTime.bind(this)}
                                  onChange={this.endDatePickerChange.bind(this)}
                                  placeholder={due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                                  format="YYYY/MM/DD HH:mm"
                                  showTime={{ format: 'HH:mm' }}
                                  style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '12px', zIndex: 2 }} />
                              </div>
                            ) : (
                                <div className={`${appendSubTaskStyles.add_due_time}`}>
                                  <div>
                                    <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                      截止时间</span>
                                  </div>
                                  <DatePicker
                                    disabledDate={this.disabledDueTime.bind(this)}
                                    onChange={this.endDatePickerChange.bind(this)}
                                    placeholder={due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                                    format="YYYY/MM/DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '12px', zIndex: 2 }} />
                                </div>
                              )
                          }
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span onClick={(e) => { this.handleCancel(e) }} className={appendSubTaskStyles.cancel}>取消</span>
                        <Button onClick={(e) => { this.handleSave(e) }} disabled={saveDisabled} type="primary" style={{ marginLeft: '16px', width: '60px', height: '34px' }}>确定</Button>
                      </div>
                    </div>
                  </div>
                </>
              )
          }
        </div>

        {/* 显示子任务列表 */}
        <div>
          {child_data.map((value, key) => {
            const { card_id, card_name, start_time, due_time, executors = [], deliverables  = [] } = value
            const { user_id } = executors[0] || {}
            return (
              <AppendSubTaskItem
                boardFolderTreeData={boardFolderTreeData} projectDetailInfoData={projectDetailInfoData} 
                whetherUpdateParentTaskTime={whetherUpdateParentTaskTime} 
                handleChildTaskChange={handleChildTaskChange} 
                handleTaskDetailChange={handleTaskDetailChange} 
                data={dataInfo} 
                childTaskItemValue={value} 
                key={`${card_id}-${card_name}-${user_id}-${due_time}-${start_time}-${deliverables}`} 
                childDataIndex={key} 
                updateRelyOnRationList={updateRelyOnRationList}
                handleRelyUploading={handleRelyUploading}
                updatePrivateVariablesWithOpenFile={this.props.updatePrivateVariablesWithOpenFile}
              />
            )
          })}
        </div>
      </div>
    )
  }
}