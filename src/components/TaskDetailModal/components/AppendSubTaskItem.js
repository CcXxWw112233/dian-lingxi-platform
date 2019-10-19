import React, { Component } from 'react'
import { Icon, Dropdown, Tooltip } from 'antd'
import appendSubTaskStyles from './appendSubTask.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import AvatarList from '../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';

export default class AppendSubTaskItem extends Component {

  componentWillMount() {
    //设置默认项目名称
    this.initSet(this.props)
  }

  // 是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  //初始化根据props设置state
  initSet(props) {
    const { chirldTaskItemValue } = props
    const { due_time, executors = [], card_name } = chirldTaskItemValue
    let local_executor = [{//任务执行人信息
      user_id: '',
      user_name: '',
      avatar: '',
    }]
    if (executors.length) {
      local_executor = executors
    }

    this.setState({
      local_due_time: due_time,
      local_card_name: card_name,
      local_executor
    })
  }

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
      local_executor: sub_executors
    })
  }

  render() {
    const { chirldTaskItemValue, chirldDataIndex, dispatch, data = {}, drawContent = {}, board_id } = this.props
    const { card_id, is_realize = '0' } = chirldTaskItemValue
    const { local_card_name, isInEditTaskName, local_executor = [], local_due_time } = this.state

    return (
      <div className={appendSubTaskStyles.subTaskItemWrapper}>
        {/*完成*/}
        <div className={is_realize === '1' ? appendSubTaskStyles.nomalCheckBoxActive : appendSubTaskStyles.nomalCheckBox} onClick={this.itemOneClick}>
          <Icon type="check" style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', position: 'absolute', top: '0', right: '0', left: '0', bottom: '0', margin: '1px auto' }} />
        </div>
        {/* 名字 */}
        <div className={appendSubTaskStyles.card_name}>
          <span>{local_card_name}</span>
        </div>
        {/* 时间 */}
        <div className={appendSubTaskStyles.due_time}>
          <span>{local_due_time || `09-19 05:30`}</span>
        </div>
        {/* 执行人 */}
        <div>
          <span style={{ position: 'relative' }}>
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
                      {local_executor && local_executor.map(({ name, avatar }, index) => (
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
      </div>
    )
  }
}
