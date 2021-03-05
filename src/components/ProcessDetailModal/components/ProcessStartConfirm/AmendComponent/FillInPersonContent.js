import React, { Component } from 'react'
import { Radio, Button, Dropdown, Tooltip, Icon } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { isArrayEqual } from '../../../../../utils/util'
import { currentNounPlanFilterName } from '../../../../../utils/businessFunction'
import { FLOWS } from '../../../../../globalset/js/constant'
import {
  accordingToSortMembersList,
  getCurrentDesignatedRolesMembers,
  getRolesName
} from '../../handleOperateModal'

export default class FillInPersonContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      designatedPersonnelList: props.itemValue.assignees
        ? props.itemValue.assignees.split(',')
        : [], // 表示当前的执行人
      assignee_type: props.itemValue.assignee_type
        ? props.itemValue.assignee_type
        : ''
    }
  }

  updateState = () => {
    this.setState({
      is_click_confirm_btn: false
    })
  }

  componentWillReceiveProps(nextProps) {
    const { popoverVisible, itemValue } = nextProps
    const { is_click_confirm_btn } = this.state
    if (this.props.popoverVisible != popoverVisible && !is_click_confirm_btn) {
      this.setState({
        designatedPersonnelList: itemValue.assignees
          ? itemValue.assignees.split(',')
          : [],
        assignee_type: itemValue.assignee_type ? itemValue.assignee_type : ''
      })
    }
  }

  // 任何人 | 指定人
  assigneeTypeChange = e => {
    this.setState({
      assignee_type: e.target.value,
      designatedPersonnelList: []
    })
  }

  // 把assignees中的执行人,在项目中的所有成员过滤出来
  filterAssignees = () => {
    const {
      data = [],
      itemValue: { role_users = [] },
      currentOrgAllMembers = []
    } = this.props
    const { assignee_type } = this.state
    let roles_data = getCurrentDesignatedRolesMembers(
      currentOrgAllMembers,
      role_users
    )
    const { designatedPersonnelList = [] } = this.state
    let new_data = [...data]
    let newDesignatedPersonnelList =
      designatedPersonnelList &&
      designatedPersonnelList.map(item => {
        return new_data.find(item2 => item2.user_id == item) || {}
      })
    newDesignatedPersonnelList = newDesignatedPersonnelList.filter(
      item => item.user_id
    )
    // let arr = []
    // newDesignatedPersonnelList = newData.filter((item,index) => {
    //   if (approvalsList.indexOf(item.user_id) != -1) {
    //     arr.push(item)
    //     return item
    //   }
    // })

    return newDesignatedPersonnelList
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = data => {
    const { data: membersData } = this.props
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
      })
      // this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('assignees', assignee_value.join(','))
    }

    if (type == 'remove') {
      const { itemValue } = this.props
      const { assignees } = itemValue
      const { designatedPersonnelList = [] } = this.state
      let newDesignatedPersonnelList = [...designatedPersonnelList]
      // let newAssigneesArray = assignees && assignees.length ? assignees.split(',') : []
      if (selectedKeys.length == '0') {
        newDesignatedPersonnelList = []
      } else {
        newDesignatedPersonnelList.map((item, index) => {
          if (item == key) {
            newDesignatedPersonnelList.splice(index, 1)
            // newAssigneesArray.splice(index, 1)
          }
        })
      }
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

  /**
   * 确定点击事件
   */
  handleConfirmChangeAssignees = () => {
    this.setState({
      is_click_confirm_btn: true
    })
    const { designatedPersonnelList = [], assignee_type } = this.state
    this.props.updateCorrespondingPrcodessStepWithNodeContent &&
      this.props.updateCorrespondingPrcodessStepWithNodeContent(
        'assignee_type',
        assignee_type
      )
    if (assignee_type == '2' || assignee_type == '3') {
      let newDesignatedPersonnelList = [...designatedPersonnelList]
      this.props.updateCorrespondingPrcodessStepWithNodeContent &&
        this.props.updateCorrespondingPrcodessStepWithNodeContent(
          'assignees',
          newDesignatedPersonnelList.join(',')
        )
      this.props.updateParentsAssigneesOrCopyPersonnel &&
        this.props.updateParentsAssigneesOrCopyPersonnel(
          { value: newDesignatedPersonnelList },
          'transPrincipalList'
        )
      this.props.onVisibleChange &&
        this.props.onVisibleChange(false, this.updateState)
    } else if (assignee_type == '1') {
      this.props.updateCorrespondingPrcodessStepWithNodeContent &&
        this.props.updateCorrespondingPrcodessStepWithNodeContent(
          'assignees',
          ''
        )
      this.setState({
        designatedPersonnelList: []
      })
      this.props.onVisibleChange &&
        this.props.onVisibleChange(false, this.updateState)
    }
    if (assignee_type != '3') {
      this.props.updateCorrespondingPrcodessStepWithNodeContent &&
        this.props.updateCorrespondingPrcodessStepWithNodeContent(
          'assignee_roles',
          ''
        )
    }
  }

  // 渲染指定人员
  renderDesignatedPersonnel = () => {
    const {
      data = [],
      itemKey,
      itemValue: { role_users = [], approve_type },
      currentOrgAllMembers = []
    } = this.props
    const { assignee_type } = this.state
    let designatedPersonnelList = this.filterAssignees()
    let new_data = accordingToSortMembersList(data, designatedPersonnelList)
    let roles_data = getCurrentDesignatedRolesMembers(
      currentOrgAllMembers,
      role_users
    )
    return (
      <div style={{ flex: 1, padding: '8px 0' }}>
        {!designatedPersonnelList.length ? (
          <div style={{ position: 'relative' }}>
            <Dropdown
              autoAdjustOverflow={false}
              trigger={['click']}
              overlayClassName={indexStyles.overlay_pricipal}
              getPopupContainer={() =>
                document.getElementById(
                  `fillInPersonMiniTopContainer_${itemKey}`
                )
              }
              overlayStyle={{ maxWidth: '200px' }}
              overlay={
                <MenuSearchPartner
                  isInvitation={true}
                  listData={assignee_type == '3' ? roles_data : new_data}
                  keyCode={'user_id'}
                  searchName={'name'}
                  currentSelect={designatedPersonnelList}
                  chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                  not_allow_sort_list={true}
                />
              }
            >
              {/* 添加通知人按钮 */}

              <div className={indexStyles.addNoticePerson}>
                <span
                  className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}
                >
                  &#xe8fe;
                </span>
              </div>
            </Dropdown>
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              lineHeight: '22px'
            }}
          >
            {designatedPersonnelList.map((value, index) => {
              const { avatar, name, user_name, user_id } = value
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  key={user_id}
                >
                  <div
                    className={`${indexStyles.user_item}`}
                    style={{
                      position: 'relative',
                      textAlign: 'center',
                      marginBottom: '8px'
                    }}
                    key={user_id}
                  >
                    {avatar ? (
                      <Tooltip
                        overlayStyle={{ minWidth: '62px' }}
                        getPopupContainer={() =>
                          document.getElementById(
                            `fillInPersonMiniTopContainer_${itemKey}`
                          )
                        }
                        placement="top"
                        title={name || user_name || '佚名'}
                      >
                        <img
                          className={indexStyles.img_hover}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 20,
                            margin: '0 2px'
                          }}
                          src={avatar}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        overlayStyle={{ minWidth: '62px' }}
                        getPopupContainer={() =>
                          document.getElementById(
                            `fillInPersonMiniTopContainer_${itemKey}`
                          )
                        }
                        placement="top"
                        title={name || user_name || '佚名'}
                      >
                        <div
                          className={indexStyles.default_user_hover}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20,
                            backgroundColor: '#f5f5f5',
                            margin: '0 2px'
                          }}
                        >
                          <Icon
                            type={'user'}
                            style={{ fontSize: 14, color: '#8c8c8c' }}
                          />
                        </div>
                      </Tooltip>
                    )}
                    {/* <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div> */}
                    <span
                      onClick={e => {
                        this.handleRemoveExecutors(e, user_id)
                      }}
                      className={`${indexStyles.userItemDeleBtn}`}
                    ></span>
                  </div>
                  {approve_type == '1' && (
                    <span
                      style={{ color: 'rgba(0,0,0,0.25)' }}
                      className={globalStyles.authTheme}
                    >
                      &#xe61f;
                    </span>
                  )}
                </div>
              )
            })}
            <Dropdown
              autoAdjustOverflow={false}
              trigger={['click']}
              overlayClassName={indexStyles.overlay_pricipal}
              getPopupContainer={() =>
                document.getElementById(
                  `fillInPersonMiniTopContainer_${itemKey}`
                )
              }
              overlayStyle={{ maxWidth: '200px' }}
              overlay={
                <MenuSearchPartner
                  isInvitation={true}
                  listData={assignee_type == '3' ? roles_data : new_data}
                  keyCode={'user_id'}
                  searchName={'name'}
                  currentSelect={designatedPersonnelList}
                  chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                  not_allow_sort_list={true}
                />
              }
            >
              {/* 添加通知人按钮 */}

              <div
                className={indexStyles.addNoticePerson}
                style={{ marginTop: '-6px' }}
              >
                <span
                  className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}
                >
                  &#xe8fe;
                </span>
              </div>
            </Dropdown>
          </div>
        )}
      </div>
    )
  }

  // 渲染资料收集的内容
  renderDataCollection = () => {
    const {
      itemValue,
      NotModifiedInitiator,
      itemKey,
      currentDesignatedRolesData = []
    } = this.props
    const { assignee_type, assignees, assignee_roles, node_type } = itemValue
    const { designatedPersonnelList } = this.state

    /**
     * 判断人员
     * 如果是类型2|3|情况下
     * 如果存在人员 那么比较model和当前选择的人员是否一致 否那么不禁用 否则置灰
     */
    let disabledAssignees = true
    // this.state.assignee_type == '2' ||
    // this.state.assignee_type == '3' ||
    // NotModifiedInitiator
    //   ? designatedPersonnelList && !!designatedPersonnelList.length
    //     ? assignees
    //       ? isArrayEqual(assignees.split(','), designatedPersonnelList)
    //       : false
    //     : true
    //   : true
    if (this.state.assignee_type == '2' || this.state.assignee_type == '3') {
      if (designatedPersonnelList && !!designatedPersonnelList.length) {
        if (assignees) {
          disabledAssignees = isArrayEqual(
            assignees.split(','),
            designatedPersonnelList
          )
        } else {
          disabledAssignees = false
        }
      }
    }
    /**
     * 判断类型
     * 1.如果state中的类型和model中的类型不一致
     * A：如果是assignee_type==1表示是发起人 那么直接return false 表示不禁用
     * B：如果是assignee_type==2|3表示是指定人员或者指定角色 那么需要判断designatedPersonnelList的长度是否存在人员，无则禁用，否则不禁用（false）
     * 2.如果state中的类型和model中的类型一致 那么禁用（这里表示和之前状态一样 所以置灰无需修改状态）
     */
    let disabledAssigneeType = true
    if (assignee_type != this.state.assignee_type) {
      if (this.state.assignee_type == '1') {
        disabledAssigneeType = false
      }
      // else if (designatedPersonnelList && !designatedPersonnelList.length) {
      //   disabledAssigneeType = true
      // }
    }
    return (
      <div className={indexStyles.mini_content}>
        <div
          id={`fillInPersonMiniTopContainer_${itemKey}`}
          className={`${indexStyles.mini_top} ${globalStyles.global_vertical_scrollbar}`}
        >
          {!NotModifiedInitiator && (
            <Radio.Group
              style={{ display: 'flex', flexDirection: 'column' }}
              value={this.state.assignee_type}
              onChange={this.assigneeTypeChange}
            >
              {node_type == '1' && (
                <Radio
                  style={{ marginBottom: '12px' }}
                  value="1"
                >{`${currentNounPlanFilterName(FLOWS)}发起人`}</Radio>
              )}
              <Radio style={{ marginBottom: '12px' }} value="2">
                指定人员
              </Radio>
              <Radio style={{ marginBottom: '12px' }} value="3">
                指定角色 -{' '}
                {getRolesName(currentDesignatedRolesData, assignee_roles)}
              </Radio>
            </Radio.Group>
          )}
          {(this.state.assignee_type == '2' ||
            NotModifiedInitiator ||
            this.state.assignee_type == '3') && (
            <div>{this.renderDesignatedPersonnel()}</div>
          )}
        </div>
        <div className={indexStyles.mini_bottom}>
          <Button
            disabled={disabledAssigneeType && disabledAssignees ? true : false}
            onClick={this.handleConfirmChangeAssignees}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    )
  }

  render() {
    return <span>{this.renderDataCollection()}</span>
  }
}
