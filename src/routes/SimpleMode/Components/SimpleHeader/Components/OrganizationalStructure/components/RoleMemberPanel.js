import React, { Component, lazy, Suspense } from 'react'
import styles from './rolememberpanel.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { connect } from 'dva'
import { OrgStructureModel } from '../../../../../../../models/technological/orgStructure'
import { Button, Radio } from 'antd'
import RoleMemberJurisdiction from './RoleMemberJurisdiction'
import RoleMemberTable from './RoleMemberTable'
import InviteOthers from '../../../../../../../routes/Technological/components/InviteOthers/index'
import { checkIsHasPermission } from '@/utils/businessFunction'
import {
  ORG_UPMS_ORGANIZATION_MEMBER_ADD,
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN
} from '@/globalset/js/constant'
import { message } from 'antd/lib/index'

const ShowAddMenberModal = lazy(() =>
  import(
    '@/routes/Technological/components/OrganizationMember/ShowAddMenberModal'
  )
)

/** 组织架构的右侧角色权限和成员列表
 * @description 用于展示组织架构的成员和权限列表
 */
@connect(
  ({
    organizationManager: {
      datas: { orgnization_role_data }
    },
    [OrgStructureModel.namespace]: { canHandle }
  }) => ({
    orgnization_role_data,
    canHandle
  })
)
export default class RoleMemberPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /**
       * tab数组
       */
      tabs: ['权限', '成员'],
      /**
       * 0:权限  1: 成员
       */
      currentTab: 0
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    setTimeout(() => {
      this.setState({
        modalVisible: true
      })
    }, 2000)
  }
  /**
   * 关闭组织架构左侧列表
   */
  closeRoleMemberPanel() {
    const { dispatch } = this.props
    dispatch({
      type: [
        OrgStructureModel.namespace,
        OrgStructureModel.reducers.updateDatas
      ].join('/'),
      payload: {
        openPanel: false
      }
    })
  }
  /**
   * 选择权限列表或者成员列表
   * @returns
   */
  selectTab = key => {
    this.setState({
      currentTab: key
    })
  }

  /**
   * 添加成员
   */
  addRoleMember() {
    const { canHandle } = this.props
    if (!canHandle) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return
    }
    this.setState({
      ShowAddMenberModalVisibile: true
    })
  }

  //添加组织职员操作
  setShowAddMenberModalVisibile() {
    if (!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    }
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  addMembers(data) {
    const { users } = data
    const { currentSelectOrganize = {}, dispatch, org_id, role_id } = this.props
    const { id } = currentSelectOrganize
    dispatch({
      type: [OrgStructureModel.namespace, 'orgAaccessInviteWeb'].join('/'),
      payload: {
        users: users,
        org_id: org_id,
        role_id: role_id,
        type: '11'
      }
    })
  }
  getRolePermissionsAndMenber() {
    this.props.getRolePermissionsAndMenber()
  }
  render() {
    const { tabs, currentTab, modalVisible } = this.state
    const { canHandle, title, org_id, role_id, data } = this.props

    return (
      <div className={styles.role_panel}>
        <div className={styles.role_panel_top}>
          <div className={styles.role_panel_title}>
            {title}
            <span
              className={`${styles.close} ${globalStyles.authTheme}`}
              onClick={() => this.closeRoleMemberPanel()}
            >
              &#xe7fe;
            </span>
          </div>
          <div className={`${styles.role_panel_top_tabs}`}>
            <div className={`${styles.role_panel_tabs}`}>
              {tabs.map((item, key) => {
                return (
                  <span
                    key={key}
                    className={`${styles.role_panel_tab} ${currentTab == key &&
                      styles.role_panel_current_tab}`}
                    onClick={this.selectTab.bind(this, key)}
                  >
                    {item}
                  </span>
                )
              })}
            </div>
            {currentTab == 1 && canHandle && (
              <div
                className={`${styles.addMember} ${globalStyles.authTheme}`}
                onClick={() => this.addRoleMember()}
              >
                &#xe7db;
              </div>
            )}
          </div>
          <div className={styles.role_panel_tips}>
            在此面板设置团队成员的权限
          </div>
        </div>

        {currentTab == 0 ? (
          <RoleMemberJurisdiction
            role_id={role_id}
            org_id={org_id}
            canHandle={canHandle}
          ></RoleMemberJurisdiction>
        ) : (
          <RoleMemberTable
            data={data}
            canHandle={canHandle}
            role_id={role_id}
            org_id={org_id}
            addRoleMember={() => this.addRoleMember()}
            getRolePermissionsAndMenber={() =>
              this.getRolePermissionsAndMenber()
            }
          ></RoleMemberTable>
        )}

        <ShowAddMenberModal
          invitationId={localStorage.getItem('OrganizationId')}
          invitationType="11"
          invitationOrg={localStorage.getItem('OrganizationId')}
          dispatch={this.props.dispatch}
          addMembers={this.addMembers.bind(this)}
          modalVisible={this.state.ShowAddMenberModalVisibile}
          setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(
            this
          )}
        />
      </div>
    )
  }
}
