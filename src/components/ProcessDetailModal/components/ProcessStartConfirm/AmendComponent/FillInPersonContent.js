import React, { Component } from 'react'
import { Radio, Button, Dropdown, Tooltip, Icon } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'

export default class FillInPersonContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      designatedPersonnelList: [], // 指定人员的列表
    }
  }

  // 任何人 | 指定人
  assigneeTypeChange = (e) => {
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignee_type', e.target.value)
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { data: membersData } = this.props;
    // 多个任务执行人
    // const membersData = [...data] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newDesignatedPersonnelList = []
    let assignee_value = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newDesignatedPersonnelList.push(membersData[j])
          assignee_value.push(membersData[j].user_id)
        }
      }
    }
    this.setState({
      designatedPersonnelList: newDesignatedPersonnelList
    });
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', assignee_value.join(','))
  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { itemValue } = this.props
    const { assignees } = itemValue
    const { designatedPersonnelList = [] } = this.state
    let newDesignatedPersonnelList = [...designatedPersonnelList]
    let newAssigneesArray = assignees && assignees.length ? assignees.split(',') : []
    newDesignatedPersonnelList.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        newDesignatedPersonnelList.splice(index, 1)
        newAssigneesArray.splice(index, 1)
      }
    })
    let newAssigneesStr = newAssigneesArray.join(',')
    this.setState({
      designatedPersonnelList: newDesignatedPersonnelList
    })
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', newAssigneesStr)
  }

  // 渲染指定人员
  renderDesignatedPersonnel = () => {
    const { data = [] } = this.props
    const { designatedPersonnelList = [] } = this.state
    return (
      <div style={{ flex: 1, padding: '8px 0' }}>
        {
          !designatedPersonnelList.length ? (
            <div style={{ position: 'relative' }}>
              <Dropdown autoAdjustOverflow={false} trigger={['click']} overlayClassName={indexStyles.overlay_pricipal}
                // getPopupContainer={triggerNode => triggerNode.parentNode}
                overlayStyle={{ maxWidth: '200px' }}
                overlay={
                  <MenuSearchPartner
                    listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={designatedPersonnelList}
                    // board_id={board_id}
                    // invitationType='1'
                    // invitationId={board_id}
                    // invitationOrg={org_id}
                    chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                }
              >
                {/* 添加通知人按钮 */}

                <div className={indexStyles.addNoticePerson}>
                  <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                </div>
              </Dropdown>
            </div>
          ) : (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', lineHeight: '22px' }}>
                {designatedPersonnelList.map((value, index) => {
                  const { avatar, name, user_name, user_id } = value
                  return (
                    <div style={{ display: 'flex', alignItems: 'center' }} key={user_id}>
                      <div className={`${indexStyles.user_item}`} style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }} key={user_id}>
                        {avatar ? (
                          <Tooltip overlayStyle={{ minWidth: '62px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                            <img className={indexStyles.img_hover} style={{ width: '32px', height: '32px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                          </Tooltip>
                        ) : (
                            <Tooltip overlayStyle={{ minWidth: '62px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                              <div className={indexStyles.default_user_hover} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                <Icon type={'user'} style={{ fontSize: 14, color: '#8c8c8c' }} />
                              </div>
                            </Tooltip>
                          )}
                        {/* <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div> */}
                        <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${indexStyles.userItemDeleBtn}`}></span>
                      </div>
                    </div>
                  )
                })}
                <Dropdown autoAdjustOverflow={false} trigger={['click']} overlayClassName={indexStyles.overlay_pricipal}
                  // getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlayStyle={{ maxWidth: '200px' }}
                  overlay={
                    <MenuSearchPartner
                      listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={designatedPersonnelList}
                      // board_id={board_id}
                      // invitationType='1'
                      // invitationId={board_id}
                      // invitationOrg={org_id}
                      chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                  }
                >
                  {/* 添加通知人按钮 */}

                  <div className={indexStyles.addNoticePerson} style={{ marginTop: '-6px' }}>
                    <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                  </div>
                </Dropdown>
              </div>
            )
        }

      </div>
    )
  }

  // 渲染资料收集的内容
  renderDataCollection = () => {
    const { itemValue } = this.props
    const { assignee_type } = itemValue
    return (
      <div className={indexStyles.mini_content}>
        <div className={`${indexStyles.mini_top} ${globalStyles.global_vertical_scrollbar}`}>
          <Radio.Group style={{ display: 'flex', flexDirection: 'column' }} value={assignee_type} onChange={this.assigneeTypeChange}>
            <Radio style={{ marginBottom: '12px' }} value="1">任何人</Radio>
            <Radio style={{ marginBottom: '12px' }} value="2">指定人员</Radio>
          </Radio.Group>
          {
            assignee_type == '2' && (
              <div>
                {this.renderDesignatedPersonnel()}
              </div>
            )
          }
        </div>
        <div className={indexStyles.mini_bottom}>
          <Button type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    const { placementTitle, itemValue } = this.props
    const { node_type } = itemValue
    return (
      <span>
       {this.renderDataCollection()}
      </span>
    )
  }
}
