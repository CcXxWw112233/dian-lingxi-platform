import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, message, Dropdown, Menu, DatePicker, Button } from 'antd'
import mainContentStyles from './MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import UploadAttachment from '@/components/UploadAttachment'
import RichTextEditor from '@/components/RichTextEditor'
import MilestoneAdd from '@/components/MilestoneAdd'
import AppendSubTask from './components/AppendSubTask'
import PreviewFileModal from '@/routes/Technological/components/ProjectDetail/TaskItemComponent/PreviewFileModal'
import PreviewFileModalRichText from '@/routes/Technological/components/ProjectDetail/TaskItemComponent/PreviewFileModalRichText'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import InformRemind from '@/components/InformRemind'
import { timestampFormat, timestampToTime, compareTwoTimestamp, timeToTimestamp, timestampToTimeNormal } from '@/utils/util'
import { getSubfixName } from "@/utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN
} from "@/globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData'
import { updateTask, addTaskExecutor, removeTaskExecutor, deleteTask, addChirldTask, deleteChirldTask } from '../../services/technological/task'


@connect(mapStateToProps)
export default class MainContent extends Component {

  state = {
    previewFileModalVisibile:false,
  }

  componentDidMount() {

    const { card_id } = this.props
    if (!card_id) return false
    this.props.dispatch({
      type: 'publicTaskDetailModal/getCardDetail',
      payload: {
        id: card_id
      }
    })
  }

  // 设置卡片是否完成 S
  setIsCheck = () => {
    const { drawContent = {}, } = this.props
    const { is_realize = '0', card_id, privileges = [], board_id, is_privilege, executors = [] } = drawContent
    // 这是加上访问控制权限, 判断是否可完成
    // if (!checkIsHasPermissionInVisitControl('edit', privileges, is_privilege, executors, checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_COMPLETE, board_id))) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    if ((this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit()) {
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
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    })
  }
  // 设置卡片是否完成 E

  // 设置标题textarea区域修改 S
  setTitleEdit = (e) => {
    e && e.stopPropagation();
    if ((this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit()) {
      return false
    }
    this.props.dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        is_edit_title: true
      }
    })
  }
  // 设置标题文本内容修改 E

  // 设置标题文本失去焦点回调 S
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value
    const { dispatch, drawContent = {} } = this.props
    const { card_id } = drawContent
    drawContent['card_name'] = val
    const updateObj = {
      card_id,
      card_name: val,
      name: val
    }
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTask',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          is_edit_title: false,
          drawContent,
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id })
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
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    })


  }
  // 设置是否完成状态的下拉回调 E

  // 设置添加属性的下拉回调 S
  handleIsAddAtribute = (e) => {

  }
  // 设置添加属性的下拉回调 E

  // 添加执行人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { drawContent = {}, projectDetailInfoData = {}, dispatch, is_selected_all } = this.props
    const { card_id } = drawContent

    // 多个任务执行人
    const excutorData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newExecutors = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < excutorData.length; j++) {
        if (selectedKeys[i] === excutorData[j]['user_id']) {
          newExecutors.push(excutorData[j])
        }
      }
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['executors'] = newExecutors

    if (type == 'add') {
      if (selectedKeys.length == excutorData.length) { // 表示所有的成员选上了
        dispatch({
          type: 'publicTaskDetailModal/updateDatas',
          payload: {
            is_selected_all: true
          }
        })
      }
      addTaskExecutor({ card_id, executor: key }).then(res => {
        if (isApiResponseOk(res)) {
          message.success(`已成功设置执行人`, MESSAGE_DURATION_TIME)
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawContent: new_drawContent
            }
          })
          this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
        } else {
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      })
    } else if (type == 'remove') {
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          is_selected_all: false
        }
      })
      removeTaskExecutor({ card_id, executor: key }).then(res => {
        if (isApiResponseOk(res)) {
          message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
          dispatch({
            type: 'publicTaskDetailModal/updateDatas',
            payload: {
              drawContent: new_drawContent
            }
          })
          this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
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
    const { card_id, executors = [] } = drawContent
    let new_executors = [...executors]
    let new_drawContent = { ...drawContent }
    new_executors.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        new_executors.splice(index, 1)
      }
    })
    new_drawContent['executors'] = new_executors
    removeTaskExecutor({ card_id, executor: shouldDeleteItem }).then(res => {
      if (isApiResponseOk(res)) {
        message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
        dispatch({
          type: 'publicTaskDetailModal/updateDatas',
          payload: {
            drawContent: new_drawContent
          }
        })
        this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    })
  }
  // 移除执行人的回调 E

  // 选择全体成员的回调
  // handleSelectedAllBtn = (data) => {
  //   const { drawContent = {}, projectDetailInfoData = {}, dispatch } = this.props
  //   const { card_id } = drawContent
  //   const excutorData = projectDetailInfoData['data'] //所有的人
  //   let newExecutors = []
  //   const { selectedKeys = [], type, key } = data
  //   if (type == 'add') {
  //     newExecutors.push(...excutorData)
  //   }
  //   drawContent['executors'] = newExecutors
  //   dispatch({
  //     type: 'publicTaskDetailModal/updateDatas',
  //     payload: {
  //       drawContent,
  //     }
  //   })
  //   this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id })
  //   if (type == 'add') {
  //     dispatch({
  //       type: 'publicTaskDetailModal/addTaskExecutor',
  //       payload: {
  //         card_id,
  //         executor: key
  //       }
  //     })
  //   } else if (type == 'remove') {
  //     // dispatch({
  //     //   type: 'publicTaskDetailModal/removeTaskExecutor',
  //     //   payload: {
  //     //     card_id,
  //     //     user_id:''
  //     //   }
  //     // })
  //   }
  // }

  saveBrafitEdit = (brafitEditHtml) => {
    console.log("brafitEditHtml", brafitEditHtml);
    const { drawContent = {}, dispatch } = this.props;

    let { card_id } = drawContent
    this.setState({
      isInEdit: false,
    })
    const updateObj = {
      card_id,
      description: brafitEditHtml,
    }

    drawContent['description'] = brafitEditHtml;
    // dispatch({
    //   type: 'publicTaskDetailModal/updateDatas',
    //   payload: {
    //     drawContent
    //   }
    // })
    // dispatch({
    //   type: 'publicTaskDetailModal/updateTask',
    //   payload: {
    //     updateObj
    //   }
    // })
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTask',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent,
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id })
    })
  }

  showMemberName = (userId) => {
    const { projectDetailInfoData = {} } = this.props
    const { data = [] } = projectDetailInfoData;
    const users = data.filter((item) => item.id === userId);
    if (users.length > 0) {
      return <span>{users[0].name}</span>
    }
    return;
  }

  onUploadFileListChange = (data) => {
    let { drawContent = {}, dispatch } = this.props;
    if (data && data.length > 0) {
      drawContent['attachment_data'] = [...this.props.drawContent.attachment_data, ...data];
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: { ...drawContent }
        }
      })
    }
  }
  onMilestoneSelectedChange = (data) => {

    const { dispatch, drawContent } = this.props;
    const { card_id, type, due_time } = drawContent
    const { key, type: actionType, info } = data;
    const id_time_arr = key.split('__')
    const id = id_time_arr[0]
    const deadline = id_time_arr[1]
    if (!compareTwoTimestamp(deadline, due_time)) {
      message.warn('关联里程碑的截止日期不能小于任务的截止日期')
      return
    }
    console.log("里程碑", data);

    if (actionType === 'add') {
      const params = {
        rela_id: card_id,
        id,
        origin_type: type
      };
      dispatch({
        type: 'publicTaskDetailModal/joinMilestone',
        payload: {
          ...params
        }
      });

      drawContent['milestone_data'] = info;
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: { ...drawContent }
        }
      })
    }
    if (actionType === 'remove') {
      const params = {
        rela_id: card_id,
        id,
      }
      dispatch({
        type: 'publicTaskDetailModal/shiftOutMilestone',
        payload: {
          ...params
        }
      });
      drawContent['milestone_data'] = [];
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: { ...drawContent }
        }
      })
    }

    if (actionType === 'update') {
      const removeParams = {
        rela_id: card_id,
        id: drawContent['milestone_data'].id,
      }

      const addParams = {
        rela_id: card_id,
        id,
        origin_type: type
      }

      dispatch({
        type: 'publicTaskDetailModal/updateMilestone',
        payload: {
          addParams,
          removeParams
        }
      });
      drawContent['milestone_data'] = info;
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: { ...drawContent }
        }
      })
    }
  }

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

  // 开始时间
  startDatePickerChange(timeString) {
    const { drawContent = {}, dispatch } = this.props
    const start_timeStamp = timeToTimestamp(timeString)
    const { card_id, due_time } = drawContent
    const updateObj = {
      card_id, start_time: start_timeStamp
    }
    if (!this.compareStartDueTime(start_timeStamp, due_time)) {
      message.warn('开始时间不能大于结束时间')
      return false
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['start_time'] = start_timeStamp
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTask',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id })
    })
  }

  //截止时间
  endDatePickerChange(timeString) {
    const { drawContent = {}, milestoneList = [], dispatch } = this.props
    const { card_id, start_time, milestone_data = {} } = drawContent
    const { milestone_deadline } = milestone_data
    // const milestone_deadline = (milestoneList.find((item => item.id == milestone_data.id)) || {}).deadline//关联里程碑的时间
    const due_timeStamp = timeToTimestamp(timeString)
    const updateObj = {
      card_id, due_time: due_timeStamp
    }
    if (!this.compareStartDueTime(start_time, due_timeStamp)) {
      message.warn('开始时间不能大于结束时间')
      return false
    }
    if (!compareTwoTimestamp(milestone_deadline, due_timeStamp)) {
      message.warn('任务的截止日期不能大于关联里程碑的截止日期')
      return
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['due_time'] = due_timeStamp
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTask',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent, card_id })
    })
  }

  // 删除开始时间
  handleDelStartTime = (e) => {
    e && e.stopPropagation()
    const { dispatch, drawContent = {} } = this.props
    const { card_id, start_time } = drawContent
    const updateObj = {
      card_id, start_time: '0'
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['start_time'] = null
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTask',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    })

  }

  // 删除结束时间
  handleDelDueTime = (e) => {
    e && e.stopPropagation()
    const { dispatch, drawContent = {} } = this.props
    const { card_id, due_time } = drawContent
    const updateObj = {
      card_id, due_time: '0'
    }
    let new_drawContent = { ...drawContent }
    new_drawContent['due_time'] = null
    if (!card_id) return false
    Promise.resolve(
      dispatch({
        type: 'publicTaskDetailModal/updateTask',
        payload: {
          updateObj
        }
      })
    ).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: new_drawContent
        }
      })
      // 需要调用父级的列表
      this.props.handleTaskDetailChange && this.props.handleTaskDetailChange({ drawContent: new_drawContent, card_id })
    })

  }

  // 会议的状态值, 比较当前时间和开始时间结束时间的对比
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

  /**附件预览 */
  openFileDetailModal = (fileInfo) => {
    console.log("文件详情", fileInfo);

    const file_name = fileInfo.name
    const file_resource_id = fileInfo.file_resource_id
    const file_id = fileInfo.file_id;
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailFile/updateDatas',
      payload: {
        isInOpenFile:true,
        seeFileInput: 'taskModule',
        filePreviewCurrentId: file_resource_id,
        filePreviewCurrentFileId: file_id,
        pdfDownLoadSrc: '',
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

  setPreviewFileModalVisibile() {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
  }

  render() {
    const { drawContent = {}, is_edit_title, projectDetailInfoData = {}, dispatch, handleTaskDetailChange,isInOpenFile} = this.props
    const { new_userInfo_data = [] } = this.state
    const { data = [] } = projectDetailInfoData
    const {
      org_id,
      board_id,
      board_name,
      card_id,
      card_name,
      type = '0',
      is_realize = '0',
      start_time,
      due_time,
      executors = [],
      description,
      milestone_data
    } = drawContent

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

    // 添加属性
    const addAttribute = (
      <Menu onClick={this.handleIsAddAtribute} getPopupContainer={triggerNode => triggerNode.parentNode}>
        <Menu.Item key="principal">
          <span className={`${globalStyles.authTheme}`}>&#xe7b2;</span>
          <span>负责人</span>
        </Menu.Item>
        <Menu.Item key="milestone">
          <span className={`${globalStyles.authTheme}`}>&#xe6b7;</span>
          <span>里程碑</span>
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
                  <div onClick={this.setTitleEdit} className={`${mainContentStyles.card_name} ${mainContentStyles.pub_hover}`}>
                    <span style={{ wordBreak: 'break-all' }}>{card_name}</span>
                  </div>
                ) : (
                    <NameChangeInput
                      autosize
                      onBlur={this.titleTextAreaChangeBlur}
                      onClick={this.setTitleEdit}
                      setIsEdit={this.setTitleEdit}
                      autoFocus={true}
                      goldName={card_name}
                      maxLength={100}
                      nodeName={'textarea'}
                      style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                    />
                  )
              }
            </div>
          </div>
          {/* 标题 E */}

          {/* 各种字段的不同状态 S */}
          <div>
            {/* 状态区域 */}
            <div>
              <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
                <div className={mainContentStyles.field_left}>
                  <span className={`${globalStyles.authTheme}`}>&#xe6b6;</span>
                  <span>状态</span>
                </div>
                {
                  type == '0' ? (
                    <>
                      {
                        (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
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
            {/* 这个中间放置负责人, 如果存在, 则在两者之间 */}
            <div>
              <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
                <div className={mainContentStyles.field_left}>
                  <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} className={globalStyles.authTheme}>&#xe7b2;</span>
                  <span className={mainContentStyles.user_executor}>负责人</span>
                </div>
                {
                  (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                    (
                      !executors.length ? (
                        <div className={`${mainContentStyles.field_right}`}>
                          <div className={`${mainContentStyles.pub_hover}`}>
                            <span>暂无</span>
                          </div>
                        </div>
                      ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap' }} className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                            {executors.map((value) => {
                              const { avatar, name, user_name, user_id } = value
                              return (
                                <div className={`${mainContentStyles.first_pric}`} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                                  <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 10px', textAlign: 'center' }} key={user_id}>
                                    {avatar ? (
                                      <img style={{ width: '24px', height: '24px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                    ) : (
                                        <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                          <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                        </div>
                                      )}
                                    <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div>
                                    {/* <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${mainContentStyles.userItemDeleBtn}`}></span> */}
                                  </div>

                                </div>
                              )
                            })}
                          </div>
                        )
                    )
                  ) : (
                      <span style={{ flex: '1' }}>
                        {
                          !executors.length ? (
                            <div style={{ flex: '1', position: 'relative' }}>
                              <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                                overlay={
                                  <MenuSearchPartner
                                    // handleSelectedAllBtn={this.handleSelectedAllBtn}
                                    invitationType='4'
                                    invitationId={card_id}
                                    listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
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
                                      // handleSelectedAllBtn={this.handleSelectedAllBtn}
                                      invitationType='4'
                                      invitationId={card_id}
                                      listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={executors} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                                      board_id={board_id} />
                                  }
                                >
                                  <div style={{ display: 'flex', flexWrap: 'wrap' }} className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                                    {executors.map((value) => {
                                      const { avatar, name, user_name, user_id } = value
                                      return (
                                        <div className={`${mainContentStyles.first_pric}`} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                                          <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 10px', textAlign: 'center' }} key={user_id}>
                                            {avatar ? (
                                              <img style={{ width: '24px', height: '24px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                            ) : (
                                                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                                  <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                                </div>
                                              )}
                                            <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div>
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
            {/* 时间区域 */}
            <div>
              <div className={mainContentStyles.field_content}>
                <div className={mainContentStyles.field_left}>
                  <span className={globalStyles.authTheme}>&#xe686;</span>
                  <span>时间</span>
                </div>
                <div className={`${mainContentStyles.field_right}`}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ position: 'relative' }}>
                      {/* {start_time && due_time ? ('') : (<span style={{ color: '#bfbfbf' }}>设置</span>)} */}
                      <div className={`${mainContentStyles.start_time}`}>
                        <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                          {start_time ? timestampToTime(start_time, true) : '开始时间'}
                          <DatePicker
                            disabledDate={this.disabledStartTime.bind(this)}
                            // onOk={this.startDatePickerChange.bind(this)}
                            onChange={this.startDatePickerChange.bind(this)}
                            // getCalendarContainer={triggerNode => triggerNode.parentNode}
                            placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                            format="YYYY/MM/DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                            style={{ opacity: 0, background: '#000000', position: 'absolute', left: 0, width: 'auto' }} />
                        </span>
                        <span onClick={this.handleDelStartTime} className={`${mainContentStyles.userItemDeleBtn} ${start_time && mainContentStyles.timeDeleBtn}`}></span>
                      </div>
                      {/* 开始时间 */}
                      {
                        (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                          (
                            <div className={`${mainContentStyles.start_time}`}>
                              <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                {start_time ? timestampToTime(start_time, true) : '暂无'}
                              </span>
                            </div>
                          )
                        ) : (
                            <div className={`${mainContentStyles.start_time}`}>
                              <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                {start_time ? timestampToTime(start_time, true) : '开始时间'}
                                <DatePicker
                                  disabledDate={this.disabledStartTime.bind(this)}
                                  // onOk={this.startDatePickerChange.bind(this)}
                                  onChange={this.startDatePickerChange.bind(this)}
                                  // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                  placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                                  format="YYYY/MM/DD HH:mm"
                                  showTime={{ format: 'HH:mm' }}
                                  style={{ opacity: 0, background: '#000000', position: 'absolute', left: 0, width: 'auto' }} />
                              </span>
                              <span onClick={this.handleDelStartTime} className={`${mainContentStyles.userItemDeleBtn} ${start_time && mainContentStyles.timeDeleBtn}`}></span>
                            </div>
                          )
                      }
                      &nbsp;
                      <span style={{ color: '#bfbfbf' }}> ~ </span>
                      &nbsp;
                      <div className={`${mainContentStyles.due_time}`}>
                        <span style={{ position: 'relative', minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                          {due_time ? timestampToTime(due_time, true) : '截止时间'}
                          <DatePicker
                            disabledDate={this.disabledDueTime.bind(this)}
                            // getCalendarContainer={triggerNode => triggerNode.parentNode}
                            placeholder={due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                            format="YYYY/MM/DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                            // onOk={this.endDatePickerChange.bind(this)}
                            onChange={this.endDatePickerChange.bind(this)}
                            style={{ opacity: 0, background: '#000000', position: 'absolute', left: 0, width: 'auto' }} />
                        </span>
                        <span onClick={this.handleDelDueTime} className={`${mainContentStyles.userItemDeleBtn} ${due_time && mainContentStyles.timeDeleBtn}`}></span>
                      </div>
                      {/* 截止时间 */}
                      {
                        (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                          (
                            <div className={`${mainContentStyles.due_time}`}>
                              <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                {due_time ? timestampToTime(due_time, true) : '暂无'}
                              </span>
                            </div>
                          )
                        ) : (
                            <div className={`${mainContentStyles.due_time}`}>
                              <span style={{ position: 'relative', minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                {due_time ? timestampToTime(due_time, true) : '截止时间'}
                                <DatePicker
                                  disabledDate={this.disabledDueTime.bind(this)}
                                  // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                  placeholder={due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                                  format="YYYY/MM/DD HH:mm"
                                  showTime={{ format: 'HH:mm' }}
                                  // onOk={this.endDatePickerChange.bind(this)}
                                  onChange={this.endDatePickerChange.bind(this)}
                                  style={{ opacity: 0, background: '#000000', position: 'absolute', left: 0, width: 'auto' }} />
                              </span>
                              <span onClick={this.handleDelDueTime} className={`${mainContentStyles.userItemDeleBtn} ${due_time && mainContentStyles.timeDeleBtn}`}></span>
                            </div>
                          )
                      }
                    </div>
                    {/* 通知提醒 */}
                    {
                      (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                        ''
                      ) : (
                          <span style={{ position: 'relative' }}>
                            <InformRemind projectExecutors={executors} style={{ display: 'inline-block', minWidth: '72px', height: '38px', borderRadius: '4px', textAlign: 'center' }} rela_id={card_id} rela_type={type == '0' ? '1' : '2'} />
                          </span>
                        )
                    }

                  </div>
                </div>
              </div>
            </div>
            {/* 添加属性区域 */}
            {/* <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                <span>添加属性</span>
              </div>
              <Dropdown overlayClassName={mainContentStyles.overlay_attribute} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={addAttribute}>
                <div className={`${mainContentStyles.field_right}`}>
                  <div className={`${mainContentStyles.pub_hover}`}>
                    <span>选择属性</span>
                  </div>
                </div>
              </Dropdown>
            </div> */}
          </div>
          {/* 各种字段的不同状态 E */}

          {/* 上传附件字段 S*/}
          <div>
            <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span className={`${globalStyles.authTheme}`}>&#xe6b9;</span>
                <span>附件</span>
              </div>
              <div className={`${mainContentStyles.field_right}`}>
                {/* 上传附件组件 */}
                {
                  (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                    <div className={`${mainContentStyles.pub_hover}`}>
                      <span>暂无</span>
                    </div>
                  ) : (
                      <div className={`${mainContentStyles.pub_hover}`}>
                        {
                          card_id && (
                            <UploadAttachment projectDetailInfoData={projectDetailInfoData} org_id={org_id} board_id={board_id} card_id={card_id}
                              onFileListChange={this.onUploadFileListChange}>
                              <div className={mainContentStyles.upload_file_btn}>
                                <span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe7fa;</span> 上传附件
                        </div>
                            </UploadAttachment>
                          )}
                      </div>
                    )
                }
                <div className={mainContentStyles.filelist_wrapper}>
                  {
                    drawContent.attachment_data && drawContent.attachment_data.map((fileInfo) => {
                      return (
                        <div className={`${mainContentStyles.pub_hover} ${mainContentStyles.file_item}`} key={fileInfo.id} onClick={() => this.openFileDetailModal(fileInfo)} >
                          <div className={mainContentStyles.file_title}><span className={`${globalStyles.authTheme}`} style={{ fontSize: '24px', color: '#40A9FF' }}>&#xe659;</span><span>{fileInfo.name}</span></div>
                          <div className={mainContentStyles.file_info}>{this.showMemberName(fileInfo.create_by)} 上传于 {fileInfo.create_time && timestampFormat(fileInfo.create_time, "MM-dd hh:mm")}</div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          {/* 上传附件字段 E*/}

          {/* 备注字段 S*/}
          <div>
            <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span className={`${globalStyles.authTheme}`}>&#xe7f6;</span>
                <span>备注</span>
              </div>
              <div className={`${mainContentStyles.field_right}`}>
                {
                  (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                    (
                      !description ? (
                        <div className={`${mainContentStyles.pub_hover}`}>
                          <span>暂无</span>
                        </div>
                      ) : (
                          <div className={`${mainContentStyles.pub_hover}`} >
                            <div className={mainContentStyles.descriptionContent} dangerouslySetInnerHTML={{ __html: description }}></div>
                          </div>
                        )
                    )
                  ) : (
                      // 富文本组件
                      <>
                        <RichTextEditor saveBrafitEdit={this.saveBrafitEdit} value={description}>
                          <div className={`${mainContentStyles.pub_hover}`} >
                            {
                              description ?
                                <div className={mainContentStyles.descriptionContent} dangerouslySetInnerHTML={{ __html: description }}></div>
                                :
                                '添加备注'
                            }
                          </div>
                        </RichTextEditor>
                      </>
                    )
                }
              </div>
            </div>
          </div>
          {/* 备注字段 E*/}

          {/* 备注字段 S*/}
          <div>
            <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span className={`${globalStyles.authTheme}`}>&#xe6b7;</span>
                <span>里程碑</span>
              </div>
              <div className={`${mainContentStyles.field_right}`}>

                {/*加入里程碑组件*/}
                {/* <MilestoneAdd onChangeMilestone={this.onMilestoneSelectedChange} dataInfo={{ board_id, board_name, due_time, org_id, data }} selectedValue={milestone_data && milestone_data.id}>
                  <div className={`${mainContentStyles.pub_hover}`} >
                    {milestone_data && milestone_data.id
                      ? milestone_data.name
                      :
                      '加入里程碑'
                    }
                  </div>
                </MilestoneAdd> */}
                {
                  (this.props.checkDiffCategoriesAuthoritiesIsVisible && this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.props.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit() ? (
                    (
                      !milestone_data && !(milestone_data && milestone_data.id) ? (
                        <div className={`${mainContentStyles.pub_hover}`}>
                          <span>暂无</span>
                        </div>
                      ) : (
                          <div className={`${mainContentStyles.pub_hover}`} >
                            {milestone_data.name}
                          </div>
                        )
                    )
                  ) : (
                      // 加入里程碑组件
                      <MilestoneAdd onChangeMilestone={this.onMilestoneSelectedChange} dataInfo={{ board_id, board_name, due_time, org_id, data }} selectedValue={milestone_data && milestone_data.id}>
                        <div className={`${mainContentStyles.pub_hover}`} >
                          {milestone_data && milestone_data.id
                            ? milestone_data.name
                            :
                            '加入里程碑'
                          }
                        </div>
                      </MilestoneAdd>
                    )
                }
                {/*加入里程碑组件*/}


              </div>
            </div>
          </div>
          {/* 备注字段 E*/}

          {/* 子任务字段 S */}
          <div>
            <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span className={`${globalStyles.authTheme}`}>&#xe7f5;</span>
                <span>子任务</span>
              </div>
              <div className={`${mainContentStyles.field_right}`}>
                {/* 添加子任务组件 */}
                <AppendSubTask drawContent={drawContent} dispatch={dispatch} data={data} handleTaskDetailChange={handleTaskDetailChange}>
                  <div className={`${mainContentStyles.pub_hover}`}>
                    <span className={mainContentStyles.add_sub_btn}>
                      <span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe8fe;</span> 新建子任务
                    </span>
                  </div>
                </ AppendSubTask>
              </div>
            </div>
          </div>
          {/* 子任务字段 E */}

        </div>
        
       {/*外部附件引入开始 */}
        {/*查看任务附件*/}
        <PreviewFileModal modalVisible={isInOpenFile} />
        {/*外部附件引入结束 */}
      </div>
    )
  }
}

// 只关联public弹窗内的数据
function mapStateToProps({ 
  publicTaskDetailModal: { drawContent = {},is_edit_title,card_id,is_selected_all },
  projectDetail: { datas: { projectDetailInfoData = {} } },
  projectDetailFile: {
    datas: {
      isInOpenFile
    }
  }
     }) {
  return { drawContent, is_edit_title, card_id, is_selected_all, projectDetailInfoData,isInOpenFile}
}
