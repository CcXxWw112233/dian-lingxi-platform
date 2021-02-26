import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Button, Modal } from 'antd'
import ShowAddMenberModal from './ShowAddMenberModal'
import globalStyles from 'src/globalset/css/globalClassName.less'

import Cookies from 'js-cookie'
import {
  ORGANIZATION,
  TASKS,
  FLOWS,
  DASHBOARD,
  PROJECTS,
  NOT_HAS_PERMISION_COMFIRN,
  MEMBERS,
  CATCH_UP,
  ORG_UPMS_ORGANIZATION_MEMBER_ADD,
  ORG_TEAM_BOARD_QUERY,
  MESSAGE_DURATION_TIME,
  ORG_UPMS_ORGANIZATION_MEMBER_EDIT
} from '../../../../globalset/js/constant'
import {
  checkIsHasPermission,
  currentNounPlanFilterName
} from '../../../../utils/businessFunction'
import { message } from 'antd/lib/index'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  organizationInviteWebJoin,
  commInviteWebJoin
} from '@/services/technological/index'
import { connect } from 'dva/index'

@connect(mapStateToProps)
export default class Header extends React.Component {
  state = {
    ShowAddMenberModalVisibile: false
  }
  addMembers(data) {
    const {
      invitationType,
      invitationId,
      rela_Condition,
      model: {
        datas: { groupList = [] }
      }
    } = this.props
    let new_groupList = [...groupList]
    let group_id = (new_groupList.find(item => item.is_default == '1') || {}).id
    // 因为分组ID是必传的, 所以没有的话需要return
    if (!group_id) return
    const temp_ids = data.users.split(',')
    const invitation_org = localStorage.getItem('OrganizationId')
    this.props.inviteMemberToGroup({
      members: temp_ids.join(','),
      group_id: group_id
    })
    return
    organizationInviteWebJoin({
      _organization_id: invitation_org,
      type: '11',
      users: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
        commInviteWebJoin({
          id: invitation_org,
          role_id: res.data.role_id,
          type: '11',
          users: res.data.users,
          rela_condition: rela_Condition
        }).then(res => {})
      }
    })

    // const { users } = data
    // this.props.inviteJoinOrganization({
    //   members: users,
    //   // org_id: Cookies.get('org_id')
    // })
  }
  setShowAddMenberModalVisibile() {
    if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }
  batchSetting = bool => {
    const { dispatch } = this.props
    dispatch({
      type: 'organizationMember/updateDatas',
      payload: {
        batch_setting: bool,
        batch_setting_ids: []
      }
    })
  }
  renderMemberFilterMenu = () => {
    return (
      <Menu>
        <Menu.Item key={'1'}>
          全部{currentNounPlanFilterName(MEMBERS)}
        </Menu.Item>
        <Menu.Item key={'2'} disabled>
          {/*<Tooltip placement="top" title={'即将上线'}>*/}
          管理层
          {/*</Tooltip>*/}
        </Menu.Item>
        <Menu.Item key={'3'} disabled>
          {/*<Tooltip placement="top" title={'即将上线'}>*/}
          停用的{currentNounPlanFilterName(MEMBERS)}
          {/*</Tooltip>*/}
        </Menu.Item>
      </Menu>
    )
  }
  renderSetRoleMenu = () => {
    const { roleList = [] } = this.props
    return (
      <Menu onClick={this.setMembersRole}>
        {roleList.map((value, key) => {
          return (
            <Menu.Item
              key={`${value.id}`}
              style={{ textAlign: 'center', padding: 0, margin: 0 }}
            >
              <div>{value.name}</div>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
  setMembersRole = ({ key }) => {
    const { batch_setting_ids, dispatch } = this.props
    if (!batch_setting_ids.length) {
      message.warn('未选择人员')
      return
    }
    dispatch({
      type: 'organizationMember/setMemberRole',
      payload: {
        member_ids: batch_setting_ids,
        role_id: key
      }
    })
  }
  settingMembersGroup = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'organizationMember/updateDatas',
      payload: {
        TreeGroupModalVisiblie: true
      }
    })
  }
  //移出分组
  removeMemberFromGroup = member_id => {
    if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_EDIT)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const modal = Modal.confirm()
    // 这里的 `update` 相当于是对 Modal进行配置
    const { dispatch, batch_setting_ids_map } = this.props

    modal.update({
      title: `确认移出？`,
      okText: '确认',
      cancelText: '取消',
      getContainer: () =>
        document.getElementById('organizationMemberContainer'),
      zIndex: 1010,
      onOk() {
        const org_id = localStorage.getItem('OrganizationId')
        dispatch({
          type: 'organizationMember/removeMembersWithGroup',
          payload: {
            org_id,
            multiple: batch_setting_ids_map
          }
        })
        // this.props.removeMembersWithGroup({ member_id, group_id, org_id })
      },
      onCancel: () => {
        modal.destroy()
      }
    })
  }
  removeMember() {}
  render() {
    const { member_count, batch_setting } = this.props
    return (
      <div>
        <div className={indexStyle.headerOut}>
          <div className={indexStyle.left}>
            <div>
              全部{currentNounPlanFilterName(MEMBERS)} · {member_count}
            </div>
            <Dropdown overlay={this.renderMemberFilterMenu()}>
              <div>
                <Icon type="down" style={{ fontSize: 14, color: '#595959' }} />
              </div>
            </Dropdown>
          </div>

          <div className={indexStyle.right}>
            {checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD) &&
              !batch_setting && (
                <div
                  style={{ marginRight: 12 }}
                  onClick={this.setShowAddMenberModalVisibile.bind(this)}
                >
                  添加{currentNounPlanFilterName(MEMBERS)}
                </div>
              )}
            {/*<Tooltip title={'该功能尚未上线，敬请期待！'}>*/}
            {/*<div>批量导入{currentNounPlanFilterName(MEMBERS)}</div>*/}
            {/*</Tooltip>*/}
            {!batch_setting ? (
              <div
                style={{ marginLeft: 24 }}
                onClick={() => this.batchSetting(true)}
              >
                批量设置
              </div>
            ) : (
              <>
                <Dropdown overlay={this.renderSetRoleMenu()}>
                  <div style={{ marginLeft: 24 }}>
                    设置角色 <i className={globalStyles.authTheme}>&#xe7ee;</i>
                  </div>
                </Dropdown>
                <div
                  style={{ marginLeft: 24 }}
                  onClick={this.settingMembersGroup}
                >
                  设置分组
                </div>
                <div
                  style={{ marginLeft: 24 }}
                  onClick={this.removeMemberFromGroup}
                >
                  移出分组
                </div>
                <Button
                  style={{ marginLeft: 24 }}
                  type={'primary'}
                  size={'small'}
                  onClick={() => this.batchSetting(false)}
                >
                  返回
                </Button>
              </>
            )}
          </div>
        </div>
        <ShowAddMenberModal
          {...this.props}
          addMembers={this.addMembers.bind(this)}
          modalVisible={this.state.ShowAddMenberModalVisibile}
          setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(
            this
          )}
          invitationId={localStorage.getItem('OrganizationId')}
          invitationType="11"
          invitationOrg={localStorage.getItem('OrganizationId')}
        />
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
      batch_setting_ids,
      batch_setting_ids_map
    }
  },
  technological: {
    datas: { userOrgPermissions }
  }
}) {
  return {
    userOrgPermissions,
    batch_setting,
    roleList,
    member_count,
    batch_setting_ids,
    batch_setting_ids_map
  }
}
