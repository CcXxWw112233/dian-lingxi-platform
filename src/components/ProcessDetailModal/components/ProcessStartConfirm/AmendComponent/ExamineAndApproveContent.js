import React, { Component } from 'react'
import { Button, Dropdown, Tooltip, Icon } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { compareACoupleOfObjects, isArrayEqual } from '../../../../../utils/util'
import { getOrgIdByBoardId } from '../../../../../utils/businessFunction'

export default class ExamineAndApproveContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      designatedPersonnelList: props.itemValue.assignees ? props.itemValue.assignees.split(',') : [], // 表示当前的执行人
    }
  }

  // 把assignees中的执行人,在项目中的所有成员过滤出来
  filterAssignees = () => {
    const { data = [] } = this.props
    const { designatedPersonnelList = [] } = this.state
    let newData = [...data]
    newData = newData.filter(item => {
      if (designatedPersonnelList.indexOf(item.user_id) != -1) {
        return item
      }
    })
    return newData
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { data: membersData } = this.props;
    // 多个任务执行人
    // const membersData = [...data] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    const { selectedKeys = [], type, key } = data
    if (type == 'add') {
      let assignee_value = []
      for (let i = 0; i < selectedKeys.length; i++) {
        for (let j = 0; j < membersData.length; j++) {
          if (selectedKeys[i] === membersData[j]['user_id']) {
            assignee_value.push(membersData[j].user_id)
          }
        }
      }
      this.setState({
        designatedPersonnelList: assignee_value
      });
      // this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', assignee_value.join(','))
    }

    if (type == 'remove') {
      const { itemValue } = this.props
      const { assignees } = itemValue
      const { designatedPersonnelList = [] } = this.state
      let newDesignatedPersonnelList = [...designatedPersonnelList]
      // let newAssigneesArray = assignees && assignees.length ? assignees.split(',') : []
      newDesignatedPersonnelList.map((item, index) => {
        if (item == key) {
          newDesignatedPersonnelList.splice(index, 1)
          // newAssigneesArray.splice(index, 1)
        }
      })
      // let newAssigneesStr = newAssigneesArray.join(',')
      this.setState({
        designatedPersonnelList: newDesignatedPersonnelList
      })
      // this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', newAssigneesStr)
    }
  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { itemValue } = this.props
    // const { assignees } = itemValue
    const { designatedPersonnelList = [] } = this.state
    let newDesignatedPersonnelList = [...designatedPersonnelList]
    // let newAssigneesArray = assignees && assignees.length ? assignees.split(',') : []
    newDesignatedPersonnelList.map((item, index) => {
      if (item == shouldDeleteItem) {
        newDesignatedPersonnelList.splice(index, 1)
        // newAssigneesArray.splice(index, 1)
      }
    })
    // let newAssigneesStr = newAssigneesArray.join(',')
    this.setState({
      designatedPersonnelList: newDesignatedPersonnelList
    })
    // this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', newAssigneesStr)
  }

  // 确定的点击事件
  handleConfirmChangeAssignees = async () => {
    const { designatedPersonnelList = [], assignee_type } = this.state
    let newDesignatedPersonnelList = [...designatedPersonnelList]
    await this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', newDesignatedPersonnelList.join(','))
    await this.props.updateParentsAssigneesOrCopyPersonnel && this.props.updateParentsAssigneesOrCopyPersonnel({ value: newDesignatedPersonnelList.join(',') }, 'transPrincipalList')
    await this.props.onVisibleChange && this.props.onVisibleChange(false)

  }

  // 渲染指定人员
  renderDesignatedPersonnel = () => {
    const { data = [], board_id } = this.props
    // const { designatedPersonnelList = [] } = this.state
    let designatedPersonnelList = this.filterAssignees()
    let org_id = getOrgIdByBoardId(board_id) || '0'
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
                    board_id={board_id}
                    invitationType='1'
                    invitationId={board_id}
                    invitationOrg={org_id}
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
                          <Tooltip getPopupContainer={() => document.getElementById('approveMiniTopContainer')} overlayStyle={{ minWidth: '62px', zIndex: 1 }} placement="top" title={name || user_name || '佚名'}>
                            <img className={indexStyles.img_hover} style={{ width: '32px', height: '32px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                          </Tooltip>
                        ) : (
                            <Tooltip getPopupContainer={() => document.getElementById('approveMiniTopContainer')} overlayStyle={{ minWidth: '62px', zIndex: 1 }} placement="top" title={name || user_name || '佚名'}>
                              <div className={indexStyles.default_user_hover} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                <Icon type={'user'} style={{ fontSize: 14, color: '#8c8c8c' }} />
                              </div>
                            </Tooltip>
                          )}
                        {/* <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div> */}
                        <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${indexStyles.userItemDeleBtn}`}></span>
                      </div>
                      {
                        <span style={{ color: 'rgba(0,0,0,0.25)' }} className={globalStyles.authTheme}>&#xe61f;</span>
                      }
                    </div>
                  )
                })}
                <Dropdown autoAdjustOverflow={false} trigger={['click']} overlayClassName={indexStyles.overlay_pricipal}
                  // getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlayStyle={{ maxWidth: '200px' }}
                  overlay={
                    <MenuSearchPartner
                      listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={designatedPersonnelList}
                      board_id={board_id}
                      invitationType='1'
                      invitationId={board_id}
                      invitationOrg={org_id}
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

  render() {
    const { itemValue } = this.props
    const { assignees } = itemValue
    const { designatedPersonnelList } = this.state
    let disabledAssignees = (designatedPersonnelList && designatedPersonnelList.length) ? isArrayEqual(assignees.split(','), designatedPersonnelList) : true
    return (
      <div className={indexStyles.mini_content}>
        <div id="approveMiniTopContainer" className={`${indexStyles.mini_top} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            {this.renderDesignatedPersonnel()}
          </div>
        </div>
        <div className={indexStyles.mini_bottom}>
          <Button disabled={disabledAssignees ? true : false} onClick={this.handleConfirmChangeAssignees} type="primary">确定</Button>
        </div>
      </div>
    )
  }
}
