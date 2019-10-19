import React, { Component } from 'react'
import { Tooltip, Button, Dropdown } from 'antd'
// import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import globalStyles from '@/globalset/css/globalClassName.less'
import appendSubTaskStyles from './appendSubTask.less'
import AvatarList from '../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import AppendSubTaskItem from './AppendSubTaskItem'

export default class AppendSubTask extends Component {

  state = {
    is_add_sub_task: false, // 是否添加子任务, 默认为 false
    sub_executors: [], // 子任务的执行人
    saveDisabled: true, // 是否可以点击确定按钮
    inputValue: '', // 用来保存子任务的名称
  }

  // 是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  // 添加子任务
  addSubTask(e) {
    e && e.stopPropagation();
    this.setState({
      is_add_sub_task: true
    })
  }

  // 点击取消
  handleCancel(e) {
    e && e.stopPropagation();
    this.setState({
      is_add_sub_task: false
    })
  }

  // 点击确定
  handleSave(e) {
    e && e.stopPropagation();
    const { drawContent, dispatch } = this.props
    const { board_id, card_id } = drawContent
    const { inputValue } = this.state
    dispatch({
      type: 'publicTaskDetailModal/addChirldTask',
      payload: {
        card_id,
        name: inputValue,
        board_id
      }
    })
    this.setState({
      is_add_sub_task: false
    })
  }

  // 子 执行人的下拉回调
  chirldrenTaskChargeChange = (dataInfo) => {
    let sub_executors = []
    const { data } = this.props
    const { selectedKeys = [] } = dataInfo
    let new_data = [...data]
    new_data.map(item => {
      if (selectedKeys.indexOf(item.user_id) != -1) {
        sub_executors.push(item)
      }
    })
    this.setState({
      sub_executors
    })
  }

  // 子 任务的文本框失去焦点回调
  setchirldTaskNameBlur = (e) => {
  }

  //子任务名称设置
  setchirldTaskNameChange = (e) => {
    this.setState({
      inputValue: e.target.value,
      saveDisabled: e.target.value ? false : true
    })
  }


  render() {
    const { children, drawContent = {}, data, dispatch } = this.props
    const { card_id, board_id, child_data = [] } = drawContent
    const { is_add_sub_task, sub_executors = [], saveDisabled } = this.state
    let executor = [{//任务执行人信息
      user_id: '',
      full_name: '',
      avatar: '',
    }]

    return (
      <div>
        <div>
          {
            !is_add_sub_task ? (
              <span onClick={ (e) => { this.addSubTask(e) } }>
                {children}
              </span>
            ) : (
              <>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                  {/* 文本框部分 */}
                  <span style={{flex: '1', marginRight: '16px'}}>
                    <input 
                    autosize={true}
                    onBlur={this.setchirldTaskNameBlur}
                    onChange={this.setchirldTaskNameChange}
                    autoFocus={true}
                    // goldName={card_name}
                    maxLength={100}
                    nodeName={'input'}
                    style={{ width: '100%', display: 'block', fontSize: 14, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', outline: 'none', paddingLeft: '12px' }}
                    />
                  </span>
                  <Tooltip title="截止时间">
                    <span className={`${globalStyles.authTheme} ${appendSubTaskStyles.sub_icon}`}>&#xe686;</span>
                  </Tooltip>
                  {/* 执行人部分 */}
                  <span style={{position: 'relative'}}>
                    <Dropdown overlayClassName={appendSubTaskStyles.overlay_sub_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                      overlay={
                        <MenuSearchPartner
                          handleSelectedAllBtn={this.handleSelectedAllBtn}
                          isInvitation={true}
                          listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={ sub_executors.length ? sub_executors : executor} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                          board_id={board_id} />
                      }>
                      {
                        sub_executors.length ? (
                          <div>
                            <AvatarList
                              size="mini"
                              maxLength={3}
                              excessItemsStyle={{
                                color: '#f56a00',
                                backgroundColor: '#fde3cf'
                              }}
                            >
                              {sub_executors && sub_executors.map(({ name, avatar }, index) => (
                                <AvatarList.Item
                                  key={index}
                                  tips={name}
                                  src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                                />
                              ))}
                            </AvatarList>
                          </div>
                        ) : (
                          <Tooltip title="执行人">
                            <span className={`${globalStyles.authTheme} ${appendSubTaskStyles.sub_icon}`}>&#xe7b2;</span>
                          </Tooltip>
                        )
                      }
                    </Dropdown>
                  </span>
                  
                </div>
                <div style={{textAlign: 'right'}}>
                  <span onClick={ (e) => { this.handleCancel(e) } } className={appendSubTaskStyles.cancel}>取消</span>
                  <Button onClick={ (e) => { this.handleSave(e) } } disabled={saveDisabled} type="primary" style={{ marginLeft: '16px', width: '60px', height: '34px' }}>确定</Button>
                </div>
              </>
            )
          }
        </div>

        {/* 显示子任务列表 */}
        <div>
          {child_data.map((value, key) => {
            const { card_id, card_name, due_time, executors = [] } = value
            const { user_id } = executors[0] || {}
            return (
              <AppendSubTaskItem board_id={board_id} dispatch={dispatch} data={data} drawContent={drawContent} chirldTaskItemValue={value} key={`${card_id}-${card_name}-${user_id}-${due_time}`} chirldDataIndex={key} />
            )
          })}
        </div>
      </div>
    )
  }
}
