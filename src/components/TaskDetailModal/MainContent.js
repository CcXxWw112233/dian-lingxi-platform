import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, message } from 'antd'
import mainContentStyles from './MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
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
    isEditTitle: false, // 是否编辑标题 默认为 false 不显示
  }

  // 设置卡片是否完成 S
  setIsCheck = () => {
    const { drawContent = {}, taskGroupListIndex, taskGroupListIndex_index, taskGroupList = [] } = this.props
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
    let new_drawContent = {...drawContent}
    new_drawContent['is_realize'] = is_realize === '1' ? '0' : '1'
    // taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['is_realize'] = is_realize === '1' ? '0' : '1'
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawContent: new_drawContent
      }
    })
  }
  // 设置卡片是否完成 E

  // 设置标题textarea区域修改 S
  setTitleEdit = (e) => {
    e && e.stopPropagation();
    this.setState({
      isEditTitle: true
    })
  }
  // 设置标题文本内容修改 E

  // 设置标题文本失去焦点回调 S
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value
    this.setState({
      isEditTitle: false
    })
  }
  // 设置标题文本失去焦点回调 E

  commonDrawerContentOutClick = () => {
    this.setState({
      isEditTitle: false
    })
  }

  render() {
    const { drawContent = {} } = this.props
    const { isEditTitle } = this.state
    const { card_id, card_name, type = '0', is_realize = '0' } = drawContent

    return (
      <div className={mainContentStyles.main_wrap}>
        <div>
          {/* 标题 S */}
          <div className={mainContentStyles.title_content}>
            {
              type == '0' ? (
                <div style={{cursor: 'pointer', marginTop: '12px'}} onClick={this.setIsCheck} className={is_realize == '1' ? mainContentStyles.nomalCheckBoxActive : mainContentStyles.nomalCheckBox}>
                  <Icon type="check" style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 2 }} />
                </div>
              ) : (
                <div style={{ width: 24, height: 24, color: '#595959', cursor: 'pointer' }}>
                  <i style={{fontSize: '20px'}} className={globalStyles.authTheme}>&#xe84d;</i>
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
                  // onClick={this.setTitleIsEdit}
                  setIsEdit={this.setTitleIsEdit}
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
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicTaskDetailModal: { drawContent = {} } }) {
  return { drawContent }
}
