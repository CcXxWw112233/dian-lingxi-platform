import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, message, Dropdown, Menu, DatePicker } from 'antd'
import mainContentStyles from './MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import { timestampToTimeNormal, timeToTimestamp, compareTwoTimestamp } from '@/utils/util'
import {
  checkIsHasPermissionInBoard, checkIsHasPermissionInVisitControl,
} from "@/utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_CARD_COMPLETE
} from "@/globalset/js/constant";

@connect(mapStateToProps)
export default class MainContent extends Component {

  state = {
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
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1',
      board_id
    }
    const { dispatch } = this.props
    dispatch({
      type: 'publicTaskDetailModal/completeTask',
      payload: {
        ...obj
      }
    })
    let new_drawContent = { ...drawContent }
    new_drawContent['is_realize'] = is_realize === '1' ? '0' : '1'
    // taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['is_realize'] = is_realize === '1' ? '0' : '1'
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawContent: new_drawContent
      }
    })
    // 需要调用父级的列表
    this.props.updateParentTaskList && this.props.updateParentTaskList({ is_realize })
  }
  // 设置卡片是否完成 E

  // 设置标题textarea区域修改 S
  setTitleEdit = (e) => {
    e && e.stopPropagation();
    // this.setState({
    //   isEditTitle: true
    // })
    this.props.dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        isEditTitle: true
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
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        isEditTitle: false,
        drawContent,
      }
    })
    dispatch({
      type: 'publicTaskDetailModal/updateTask',
      payload: { updateObj }
    })
    // 需要调用父级的列表
    this.props.updateParentTaskList && this.props.updateParentTaskList({ card_name: val })
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
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawContent: new_drawContent
      }
    })
    // 阻止重复点击
    if (!temp_realize) return false
    dispatch({
      type: 'publicTaskDetailModal/completeTask',
      payload: {
        is_realize: temp_realize, card_id, board_id
      }
    })
    // 需要调用父级的列表
    this.props.updateParentTaskList && this.props.updateParentTaskList({ is_realize: temp_realize == '0' ? '1' : '0' })
  }
  // 设置是否完成状态的下拉回调 E

  render() {
    const { drawContent = {}, isEditTitle } = this.props
    const { card_id, card_name, type = '0', is_realize = '0', start_time, due_time } = drawContent

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
        <div>
          {/* 标题 S */}
          <div className={mainContentStyles.title_content}>
            {
              type == '0' ? (
                <div style={{ cursor: 'pointer', marginTop: '12px' }} onClick={this.setIsCheck} className={is_realize == '1' ? mainContentStyles.nomalCheckBoxActive : mainContentStyles.nomalCheckBox}>
                  <Icon type="check" style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 2 }} />
                </div>
              ) : (
                  <div style={{ width: 24, height: 24, color: '#595959', cursor: 'pointer' }}>
                    <i style={{ fontSize: '20px' }} className={globalStyles.authTheme}>&#xe84d;</i>
                  </div>
                )
            }
            {
              !isEditTitle ? (
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
          {/* 标题 E */}

          {/* 各种字段的不同状态 S */}
          <div>
            {/* 状态区域 */}
            <div style={{ position: 'relative' }} className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span className={`${globalStyles.authTheme}`}>&#xe6b6;</span>
                <span>状态</span>
              </div>
              <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_item} overlay={filedEdit} getPopupContainer={triggerNode => triggerNode.parentNode}>
                <div className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                  <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '未完成' : '已完成'}</span>
                </div>
              </Dropdown>
            </div>
            {/* 这个中间放置负责人, 如果存在, 则在两者之间 */}
            {/* 时间区域 */}
            <div className={mainContentStyles.field_content}>
              <div className={mainContentStyles.field_left}>
                <span className={globalStyles.authTheme}>&#xe686;</span>
                <span>时间</span>
              </div>
              <div className={`${mainContentStyles.field_right}`}>
                <div style={{position: 'relative'}}>
                  {/* {start_time && due_time ? ('') : (<span style={{ color: '#bfbfbf' }}>设置</span>)} */}
                  <span className={`${mainContentStyles.pub_hover}`} style={{ position: 'relative', zIndex: 0, padding: '8px 12px', display: 'inline-block',textAlign: 'center'  }}>&nbsp;{start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                    <DatePicker
                      // disabledDate={this.disabledStartTime.bind(this)}
                      // onChange={this.startDatePickerChange.bind(this)}
                      // getCalendarContainer={triggerNode => triggerNode.parentNode}
                      placeholder={'开始时间'}
                      format="YYYY/MM/DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                      style={{ opacity: 0, background: '#000000', cursor: 'pointer', position: 'absolute', left: 0, zIndex: 1, }} />
                  </span>
                    &nbsp;
                  <span style={{ color: '#bfbfbf' }}> ~ </span>
                    &nbsp;
                  <span className={`${mainContentStyles.pub_hover}`} style={{ position: 'relative', padding: '8px 12px', display: 'inline-block',textAlign: 'center' }}>{due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                    <DatePicker
                      // disabledDate={this.disabledDueTime.bind(this)}
                      // getCalendarContainer={triggerNode => triggerNode.parentNode}
                      placeholder={'截止时间'}
                      format="YYYY/MM/DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                      // onChange={this.endDatePickerChange.bind(this)}
                      style={{ opacity: 0, cursor: 'pointer', background: '#000000', position: 'absolute', left: 0, zIndex: 1, }} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 各种字段的不同状态 E */}

        </div>
      </div>
    )
  }
}

// 只关联public弹窗内的数据
function mapStateToProps({ publicTaskDetailModal: { drawContent = {}, isEditTitle, card_id } }) {
  return { drawContent, isEditTitle, card_id }
}
