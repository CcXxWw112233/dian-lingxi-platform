//任务
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import {
  Icon,
  Checkbox,
  Collapse,
  Avatar,
  Button,
  Menu,
  Dropdown,
  Modal,
  message
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import Cookies from 'js-cookie'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  ORG_UPMS_ORGANIZATION_MEMBER_ADD,
  ORG_UPMS_ORGANIZATION_MEMBER_REMOVE,
  ORG_UPMS_ORGANIZATION_MEMBER_EDIT,
  MEMBERS,
  ORGANIZATION
} from '../../../../globalset/js/constant'
import {
  checkIsHasPermission,
  currentNounPlanFilterName
} from '../../../../utils/businessFunction'
import { connect } from 'dva/index'
import {
  getTransferSelectedList,
  getTransferSelectedDetailList,
  removeMemberWithSettingTransferUser,
  discontinueMember
} from '../../../../services/technological/organizationMember'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
const Panel = Collapse.Panel

@connect(mapStateToProps)
export default class ItemOne extends React.Component {
  state = {
    isShowBottDetail: false, //
    bott_id: null
  }
  componentWillMount() {
    const { itemKey, parentKey, itemValue } = this.props
    const { role_detailInfo = {} } = itemValue
    this.setState({
      bott_id: `bott_${parentKey}_${itemKey * 100 + 1}`
    })
  }
  componentDidUpdate(props) {
    //成员信息重新渲染后重新计算高度
    const { itemValue } = props
    const { role_detailInfo = {} } = itemValue
    let role_detailInfo_is_has = false
    for (let val in role_detailInfo) {
      role_detailInfo_is_has = true
    }
    if (role_detailInfo_is_has) {
      const element = document.getElementById(this.state.bott_id)
      this.funTransitionHeight(element, 500, this.state.isShowBottDetail)
    }
  }
  handleMenuClick(e) {
    const { key } = e
    const { itemValue, parentItemValue } = this.props
    const { member_id, user_id } = itemValue
    this.props.updateDatas({
      currentBeOperateMemberId: member_id
    })
    switch (key) {
      case 'discontinue': // 停用
        this.discontinueConfirm(member_id)
        break
      case 'remove': // 移出分组
        this.removeConfirm()
        break
      case 'setGroup': // 设置分组
        if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.props.updateDatas({
          TreeGroupModalVisiblie: true
        })
        break
      case 'joinORG': // 加入组织
        this.joinOrganization({ member_id })
        break
      case 'removeUser': // 移出用户
        // this.removeUserConfirm({member_id})
        this.getTransferSelectedList({ remove_id: user_id, member_id })
        // this.props.updateDatas({
        //   TreeRemoveOrgMemberModalVisible: true,
        //   removeMemberUserId: user_id
        // })
        break
      case 'removeOrgMember': // 移出组织成员
        this.getTransferSelectedList({ remove_id: user_id, member_id })
        // this.props.updateDatas({
        //   TreeRemoveOrgMemberModalVisible: true,
        //   removeMemberUserId: user_id,
        // })
        break
      default:
        //设置角色
        if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        const role_id = key.replace('role_', '')
        const group_id = parentItemValue.id
        this.props.setMemberRole({
          role_id,
          group_id,
          member_id
        })
        break
    }
  }
  //加入组织
  joinOrganization({ member_id }) {
    this.props.joinOrganization({ id: member_id })
  }

  // 获取移出成员后的交接列表
  getTransferSelectedList = ({ remove_id, member_id }) => {
    getTransferSelectedList({ user_id: remove_id }).then(res => {
      if (isApiResponseOk(res)) {
        if (res.data && res.data.length) {
          this.props.dispatch({
            type: 'organizationMember/updateDatas',
            payload: {
              transferSelectedList: res.data,
              TreeRemoveOrgMemberModalVisible: true,
              removeMemberUserId: remove_id
            }
          })
        } else {
          this.discontinueConfirm(member_id)
        }
      }
    })
  }

  //移除访客用户
  removeUserConfirm({ member_id }) {
    if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_REMOVE)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const that = this
    const modal = Modal.confirm()
    // 这里的 `update` 相当于是对 Modal进行配置
    modal.update({
      title: `确认要移除这个用户吗？`,
      content: '同时在本组织中将此用户移出所有项目',
      okText: '确认',
      cancelText: '取消',
      getContainer: () =>
        document.getElementById('organizationMemberContainer'),
      zIndex: 1010,
      onOk() {
        that.removeUserVisitor({ member_id })
      },
      onCancel: () => {
        modal.destroy()
      }
    })
    // Modal.confirm({
    //   title: `确认要移除这个用户吗？`,
    //   content: '同时在本组织中将此用户移出所有项目',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     that.removeUserVisitor({member_id})
    //   }
    // });
  }
  removeUserVisitor({ member_id }) {
    this.props.removeUserVisitor({ id: member_id })
  }

  //移出分组
  removeConfirm(member_id) {
    if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const that = this
    const modal = Modal.confirm()
    // 这里的 `update` 相当于是对 Modal进行配置
    modal.update({
      title: `确认从该分组中移出该${currentNounPlanFilterName(MEMBERS)}？`,
      okText: '确认',
      cancelText: '取消',
      getContainer: () =>
        document.getElementById('organizationMemberContainer'),
      zIndex: 1010,
      onOk() {
        that.removeMember()
      },
      onCancel: () => {
        modal.destroy()
      }
    })
    // Modal.confirm({
    //   title: `确认从该分组中移出该${currentNounPlanFilterName(MEMBERS)}？`,
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     that.removeMember()
    //   }
    // });
  }
  removeMember() {
    const { itemValue, parentItemValue } = this.props
    const { member_id } = itemValue
    const group_id = parentItemValue.id
    const org_id = localStorage.getItem('OrganizationId')
    this.props.removeMembersWithGroup({ member_id, group_id, org_id })
  }
  //停用
  discontinueConfirm(member_id) {
    if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_REMOVE)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const that = this
    const modal = Modal.confirm()
    // 这里的 `update` 相当于是对 Modal进行配置
    modal.update({
      title: `确认停用该${currentNounPlanFilterName(MEMBERS)}？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.discontinueMember(member_id)
      },
      getContainer: () =>
        document.getElementById('organizationMemberContainer'),
      zIndex: 1010,
      onCancel: () => {
        modal.destroy()
      }
    })
    // Modal.confirm({
    //   title: `确认停用该${currentNounPlanFilterName(MEMBERS)}？`,
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     that.discontinueMember(member_id)
    //   }
    // });
  }
  discontinueMember(member_id) {
    this.props.discontinueMember({ member_id })
  }

  //设置转动出现详情
  setIsShowBottDetail() {
    const that = this
    const {
      itemValue: { member_id },
      itemKey,
      parentKey
    } = this.props
    const { bott_id } = this.state
    const element = document.getElementById(bott_id)
    const { groupList = [] } = this.props
    this.setState(
      {
        isShowBottDetail: !this.state.isShowBottDetail
      },
      function() {
        if (this.state.isShowBottDetail) {
          //点击打开的时候，如果职员信息未存在就请求
          const role_detailInfo =
            groupList[parentKey]['members'][itemKey]['role_detailInfo'] || {}
          let role_detailInfo_is_has = false
          for (let val in role_detailInfo) {
            role_detailInfo_is_has = true
          }
          if (!role_detailInfo_is_has) {
            this.props.getMemberInfo({ member_id, parentKey, itemKey })
          }
        }
        this.funTransitionHeight(element, 500, this.state.isShowBottDetail)
      }
    )
  }
  funTransitionHeight = (element, time, type) => {
    // time, 数值，可缺省
    if (typeof window.getComputedStyle === 'undefined') return
    const height = window.getComputedStyle(element).height
    element.style.transition = 'none' // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
    element.style.height = 'auto'
    const targetHeight = window.getComputedStyle(element).height
    element.style.height = height
    element.offsetWidth
    if (time) element.style.transition = 'height ' + time + 'ms'
    element.style.height = type ? targetHeight : 0
  }
  operateMenu = () => {
    const { itemValue, parentItemValue } = this.props
    const { is_default } = parentItemValue
    const { role_type, is_visitor } = itemValue
    const { roleList = [] } = this.props

    return (
      <Menu onClick={this.handleMenuClick.bind(this)}>
        {is_visitor !== '1' &&
        role_type !== '0' &&
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT) ? (
          <Menu.SubMenu title="设置角色" key={'role'}>
            {roleList.map((value, key) => {
              return (
                <Menu.Item
                  key={`role_${value.id}`}
                  style={{ textAlign: 'center', padding: 0, margin: 0 }}
                >
                  <div className={CreateTaskStyle.elseProjectMemu}>
                    {value.name}
                  </div>
                </Menu.Item>
              )
            })}
          </Menu.SubMenu>
        ) : (
          ''
        )}
        {is_visitor !== '1' &&
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT) ? (
          <Menu.Item
            key={'setGroup'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={CreateTaskStyle.elseProjectMemu}>设置分组</div>
          </Menu.Item>
        ) : (
          ''
        )}
        {is_default !== '1' &&
        is_visitor !== '1' &&
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT) ? (
          <Menu.Item
            key={'remove'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={CreateTaskStyle.elseProjectMemu}>移出分组</div>
          </Menu.Item>
        ) : (
          ''
        )}
        {is_visitor !== '1' &&
        role_type !== '0' &&
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_REMOVE) ? (
          <Menu.Item
            key={'removeOrgMember'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div
              className={CreateTaskStyle.elseProjectMemu}
              style={{ color: '#F5222D' }}
            >
              移出{currentNounPlanFilterName(ORGANIZATION)}
            </div>
          </Menu.Item>
        ) : (
          ''
        )}

        {is_default == '2' &&
        is_visitor == '1' &&
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD) ? (
          <Menu.Item
            key={'joinORG'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div className={CreateTaskStyle.elseProjectMemu}>
              加入{currentNounPlanFilterName(ORGANIZATION)}
            </div>
          </Menu.Item>
        ) : (
          ''
        )}
        {is_default == '2' &&
        is_visitor == '1' &&
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_REMOVE) ? (
          <Menu.Item
            key={'removeUser'}
            style={{ textAlign: 'center', padding: 0, margin: 0 }}
          >
            <div
              className={CreateTaskStyle.elseProjectMemu}
              style={{ color: '#F5222D' }}
            >
              移出用户
            </div>
          </Menu.Item>
        ) : (
          ''
        )}
        {/*<Menu.Item key={'discontinue'} style={{textAlign: 'center', padding: 0, margin: 0}}>*/}
        {/*<div className={CreateTaskStyle.elseProjectDangerMenu}>*/}
        {/*停用*/}
        {/*</div>*/}
        {/*</Menu.Item>*/}
      </Menu>
    )
  }
  batSettingSelect = e => {
    const {
      itemValue,
      batch_setting_ids = [],
      batch_setting_ids_map = [],
      batch_setting_ids_source = [],
      dispatch,
      parentItemValue: { id: group_id }
    } = this.props
    const { member_id } = itemValue
    let _new_batch_setting_ids = [...batch_setting_ids]
    let _new_batch_setting_ids_map = [...batch_setting_ids_map]
    let _new_batch_setting_ids_source = [...batch_setting_ids_source]

    const checked = e.target.checked
    if (checked) {
      _new_batch_setting_ids.push(member_id)
      _new_batch_setting_ids = Array.from(new Set(_new_batch_setting_ids))

      _new_batch_setting_ids_source.push(`${group_id}_${member_id}`)
      _new_batch_setting_ids_source = Array.from(
        new Set(_new_batch_setting_ids_source)
      )
    } else {
      _new_batch_setting_ids = _new_batch_setting_ids.filter(
        item => item != member_id
      )
      _new_batch_setting_ids_source = _new_batch_setting_ids_source.filter(
        item => item != `${group_id}_${member_id}`
      )
    }

    let index = undefined
    for (let i = 0; i < _new_batch_setting_ids_map.length; i++) {
      if (group_id == Object.keys(_new_batch_setting_ids_map[i])[0]) {
        index = i
        break
      }
    }
    if (checked) {
      if (index == undefined) {
        _new_batch_setting_ids_map.push({ [group_id]: [member_id] })
      } else {
        _new_batch_setting_ids_map[index][group_id].push(member_id)
        _new_batch_setting_ids_map[index][group_id] = Array.from(
          new Set(_new_batch_setting_ids_map[index][group_id])
        )
      }
    } else {
      _new_batch_setting_ids_map[index][group_id] = _new_batch_setting_ids_map[
        index
      ][group_id].filter(item => item != member_id)
    }
    console.log('_new_batch_setting_ids_maps', _new_batch_setting_ids_map)
    dispatch({
      type: 'organizationMember/updateDatas',
      payload: {
        batch_setting_ids: _new_batch_setting_ids,
        batch_setting_ids_map: _new_batch_setting_ids_map,
        batch_setting_ids_source: _new_batch_setting_ids_source
      }
    })
  }
  render() {
    const { isShowBottDetail, bott_id } = this.state
    const {
      itemValue,
      parentItemValue,
      batch_setting,
      batch_setting_ids,
      batch_setting_ids_map,
      batch_setting_ids_source
    } = this.props
    const { is_default, id: group_id } = parentItemValue
    const {
      member_id,
      avatar,
      name,
      role_type,
      role_name,
      role_detailInfo = {},
      is_visitor
    } = itemValue
    const {
      organization_name = '...',
      role = '...',
      email = '...',
      mobile = '...',
      wechat = '...',
      card_data = [],
      workflow_data = []
    } = role_detailInfo
    let role_detailInfo_is_has = false
    for (let val in role_detailInfo) {
      role_detailInfo_is_has = true
    }

    return (
      <div className={CreateTaskStyle.item_1}>
        <div className={CreateTaskStyle.item_1_top}>
          <div className={CreateTaskStyle.item_1_top_left}>
            <div className={CreateTaskStyle.avatar}>
              <Avatar size={40} icon="user" src={avatar} />
            </div>
            <div className={CreateTaskStyle.detail}>
              <div>{name}</div>
              <div>{role_name}</div>
            </div>
          </div>
          <div className={CreateTaskStyle.item_1_top_right}>
            {!batch_setting ? (
              <>
                <Dropdown
                  overlay={this.operateMenu()}
                  getPopupContainer={() =>
                    document.getElementById('organizationMemberContainer')
                  }
                >
                  <div>
                    <Icon type="ellipsis" theme="outlined" />
                  </div>
                </Dropdown>
                <div
                  className={
                    isShowBottDetail
                      ? CreateTaskStyle.upDown_up
                      : CreateTaskStyle.upDown_down
                  }
                >
                  <Icon
                    onClick={this.setIsShowBottDetail.bind(this)}
                    type="down"
                    theme="outlined"
                    style={{ color: '#595959' }}
                  />
                </div>
              </>
            ) : (
              <>
                <Checkbox
                  onChange={this.batSettingSelect}
                  checked={batch_setting_ids_source.includes(
                    `${group_id}_${member_id}`
                  )}
                ></Checkbox>
              </>
            )}
          </div>
        </div>
        <div
          className={CreateTaskStyle.item_1_middle}
          style={{ display: 'none' }}
        >
          {[1, 2, 3, 4, 5].map((value, key) => {
            return <div key={key}></div>
          })}
        </div>
        <div
          className={
            isShowBottDetail && role_detailInfo_is_has
              ? CreateTaskStyle.item_1_bott_show
              : CreateTaskStyle.item_1_bott_normal
          }
          id={bott_id}
          style={{
            paddingTop: isShowBottDetail ? '10px' : 0,
            paddingBottom: isShowBottDetail ? '10px' : 0
          }}
        >
          <div className={CreateTaskStyle.item_1_bott_con1}>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>职位：</div>
              <div>{role}</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>组织：</div>
              <div>{organization_name}</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>邮箱：</div>
              <div>{email}</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>手机：</div>
              <div>{mobile}</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>微信：</div>
              <div>{wechat}</div>
            </div>
          </div>
          <div className={CreateTaskStyle.item_1_bott_con2}>
            {/*<div className={CreateTaskStyle.item_1_bott_con2_taskItem} style={{textDecoration: 'line-through' }}>*/}
            {/*这是一天任务 <i>#项目A</i>*/}
            {/*</div>*/}
            {card_data.map((value, key) => {
              const { is_realize, name, board_name } = value
              return (
                <div
                  className={CreateTaskStyle.item_1_bott_con2_taskItem}
                  style={{
                    textDecoration: is_realize === '1' ? 'line-through' : 'none'
                  }}
                >
                  {name} <i>#{board_name}</i>
                </div>
              )
            })}
            {workflow_data.map((value, key) => {
              const { flow_node_name, board_name } = value
              return (
                <div className={CreateTaskStyle.item_1_bott_con2_taskItem}>
                  {flow_node_name} <i>#{board_name}</i>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  organizationMember: {
    datas: {
      batch_setting,
      member_count,
      roleList,
      groupList,
      batch_setting_ids,
      batch_setting_ids_map,
      batch_setting_ids_source
    }
  },
  technological: {
    datas: { userOrgPermissions }
  }
}) {
  return {
    userOrgPermissions,
    batch_setting,
    member_count,
    roleList,
    groupList,
    batch_setting_ids,
    batch_setting_ids_map,
    batch_setting_ids_source
  }
}
