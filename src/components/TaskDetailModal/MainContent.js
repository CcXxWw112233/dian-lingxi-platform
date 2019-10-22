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
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import InformRemind from '@/components/InformRemind'
import { timestampFormat, timestampToTime, compareTwoTimestamp } from '@/utils/util'
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN
} from "@/globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData'
import { updateTask, addTaskExecutor, removeTaskExecutor, deleteTask, addChirldTask, deleteChirldTask } from '../../services/technological/task'


@connect(mapStateToProps)
export default class MainContent extends Component {

  state = {
    // new_executors: []
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
      if (isApiResponseOk(res)) {
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
      }
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
    updateTask({...updateObj}).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      if (res.data && res.data.remind_code != '0') { //通知提醒专用
        message.warn(`更新成功，${res.data.error_msg}`, MESSAGE_DURATION_TIME)
      } else {
        message.success('更新成功', MESSAGE_DURATION_TIME)
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
      addTaskExecutor({card_id, executor: key}).then(res => {
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
      removeTaskExecutor({card_id, executor:key}).then(res => {
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
    removeTaskExecutor({card_id, executor:shouldDeleteItem}).then(res => {
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
    updateTask({...updateObj}).then(res => {
      if (!isApiResponseOk(res)) {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        return
      }
      if (res.data && res.data.remind_code != '0') { //通知提醒专用
        message.warn(`更新成功，${res.data.error_msg}`, MESSAGE_DURATION_TIME)
      } else {
        message.success('更新成功', MESSAGE_DURATION_TIME)
      }
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          is_edit_title: false,
          drawContent,
        }
      })
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
  
    const { dispatch,drawContent } = this.props;
    const { card_id, type, due_time } = drawContent
    const { key,type:actionType,selectedKeys,info} = data;
    const id_time_arr = key.split('__')
    const id = id_time_arr[0]
    const deadline = id_time_arr[1]
    if (!compareTwoTimestamp(deadline, due_time)) {
      message.warn('关联里程碑的截止日期不能小于任务的截止日期')
      return
    }
    console.log("里程碑",data);
    
    if(actionType ==='add'){
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
          drawContent: drawContent
        }
      })
    }
    if(actionType ==='remove'){
    
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
          drawContent: drawContent
        }
      })
    }
  

  }

  render() {
    const { drawContent = {}, is_edit_title, projectDetailInfoData = {}, dispatch, handleTaskDetailChange } = this.props
    const { new_userInfo_data = [] } = this.state
    const { data = [] } = projectDetailInfoData
    const {
      org_id,
      board_id,
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
        <div>
          {/* 标题 S */}
          <div>
            <div className={mainContentStyles.title_content}>
              {
                type == '0' ? (
                  <div style={{ cursor: 'pointer', marginTop: '10px' }} onClick={this.setIsCheck} className={is_realize == '1' ? mainContentStyles.nomalCheckBoxActive : mainContentStyles.nomalCheckBox}>
                    <Icon type="check" style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 2 }} />
                  </div>
                ) : (
                    <div style={{ width: 20, height: 20, color: '#595959', cursor: 'pointer', marginTop: '10px' }}>
                      <i style={{ fontSize: '20px' }} className={globalStyles.authTheme}>&#xe84d;</i>
                    </div>
                  )
              }
              {
                !is_edit_title ? (
                  <div onClick={this.setTitleEdit} className={`${mainContentStyles.card_name} ${mainContentStyles.pub_hover}`}>{card_name}</div>
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
                    <div className={`${mainContentStyles.field_right}`}>
                      <div className={`${mainContentStyles.pub_hover}`}>
                        <span>暂无</span>
                      </div>
                    </div>
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
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                                          <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 0', textAlign: 'center' }} key={user_id}>
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
                      <span className={`${mainContentStyles.pub_hover}`} style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                        {start_time ? timestampToTime(start_time, true) : '开始时间'}
                        <DatePicker
                          // disabledDate={this.disabledStartTime.bind(this)}
                          // onChange={this.startDatePickerChange.bind(this)}
                          // getCalendarContainer={triggerNode => triggerNode.parentNode}
                          placeholder={'开始时间'}
                          format="YYYY/MM/DD HH:mm"
                          showTime={{ format: 'HH:mm' }}
                          style={{ opacity: 0, background: '#000000', cursor: 'pointer', position: 'absolute', left: 0, zIndex: 1, width: 'auto' }} />
                      </span>
                      &nbsp;
                      <span style={{ color: '#bfbfbf' }}> ~ </span>
                      &nbsp;
                      <span className={`${mainContentStyles.pub_hover}`} style={{ position: 'relative', minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                        {due_time ? timestampToTime(due_time, true) : '截止时间'}
                        <DatePicker
                          // disabledDate={this.disabledDueTime.bind(this)}
                          // getCalendarContainer={triggerNode => triggerNode.parentNode}
                          placeholder={'截止时间'}
                          format="YYYY/MM/DD HH:mm"
                          showTime={{ format: 'HH:mm' }}
                          // onChange={this.endDatePickerChange.bind(this)}
                          style={{ opacity: 0, cursor: 'pointer', background: '#000000', position: 'absolute', left: 0, zIndex: 1, width: 'auto' }} />
                      </span>
                    </div>
                    <span style={{ position: 'relative' }}>
                      <InformRemind projectExecutors={executors} style={{ display: 'inline-block', minWidth: '72px', height: '38px', borderRadius: '4px', textAlign: 'center' }} rela_id={card_id} rela_type={type == '0' ? '1' : '2'} />
                    </span>
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
                <div className={`${mainContentStyles.pub_hover}`}>
                  {
                    card_id &&
                    <UploadAttachment projectDetailInfoData={projectDetailInfoData} org_id={org_id} board_id={board_id} card_id={card_id}
                      onFileListChange={this.onUploadFileListChange}>
                      <div className={mainContentStyles.upload_file_btn}>
                        <span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe7fa;</span> 上传附件
                    </div>
                    </UploadAttachment>
                  }
                </div>
                <div className={mainContentStyles.filelist_wrapper}>
                  {
                    drawContent.attachment_data && drawContent.attachment_data.map((fileInfo) => {
                      return (
                        <div className={`${mainContentStyles.pub_hover} ${mainContentStyles.file_item}`} key={fileInfo.id} >
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

                {/*富文本*/}
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
                <MilestoneAdd onChangeMilestone={this.onMilestoneSelectedChange} dataId={board_id}>
                  <div className={`${mainContentStyles.pub_hover}`} >
                    {milestone_data && milestone_data.id
                      ? milestone_data.name
                      :
                      '加入里程碑'
                    }
                  </div>
                </MilestoneAdd>

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
      </div>
    )
  }
}

// 只关联public弹窗内的数据
function mapStateToProps({ publicTaskDetailModal: { drawContent = {}, is_edit_title, card_id, is_selected_all }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { drawContent, is_edit_title, card_id, is_selected_all, projectDetailInfoData }
}
