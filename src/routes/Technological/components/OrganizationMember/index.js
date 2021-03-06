import React, { Component } from 'react'
import { connect } from 'dva/index'
import indexStyles from './index.less'
import Header from './Header'
import CreateGroup from './CreateGroup'
import { checkIsHasPermission } from '../../../../utils/businessFunction'
import { ORG_UPMS_ORGANIZATION_MEMBER_QUERY } from '../../../../globalset/js/constant'

const getEffectOrReducerByName = name => `organizationMember/${name}`

class OrganizationMember extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    if (
      checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_QUERY) &&
      localStorage.getItem('OrganizationId') != '0'
    ) {
      //获取分组列表
      dispatch({
        type: 'organizationMember/getGroupList',
        payload: {}
      })
      // 获取分组树状列表
      dispatch({
        type: 'organizationMember/getGroupTreeList',
        payload: {}
      })
      //查询当前角色
      dispatch({
        type: 'organizationMember/getCurrentOrgRole',
        payload: {
          type: '1'
        }
      })
    } else {
      dispatch({
        type: 'noLookPermissionsHandle'
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'organizationMember/updateDatas',
      payload: {
        batch_setting: false, //进入批量设置
        batch_setting_ids: [], //批量设置所选id
        batch_setting_ids_map: [],
        batch_setting_ids_source: []
      }
    })
  }
  render() {
    const { modal, model, dispatch } = this.props
    const CreateGroupProps = {
      modal,
      model,
      CreateGroup(data) {
        dispatch({
          type: getEffectOrReducerByName('CreateGroup'),
          payload: data
        })
      },
      joinOrganization(data) {
        dispatch({
          type: getEffectOrReducerByName('joinOrganization'),
          payload: data
        })
      },
      removeUserVisitor(data) {
        dispatch({
          type: getEffectOrReducerByName('removeUserVisitor'),
          payload: data
        })
      },
      removeMembersWithGroup(data) {
        dispatch({
          type: getEffectOrReducerByName('removeMembersWithGroup'),
          payload: data
        })
      },
      setMemberWitchGroup(data) {
        dispatch({
          type: getEffectOrReducerByName('setMemberWitchGroup'),
          payload: data
        })
      },
      getGroupList(data) {
        dispatch({
          type: getEffectOrReducerByName('getGroupList'),
          payload: data
        })
      },
      updateGroup(data) {
        dispatch({
          type: getEffectOrReducerByName('updateGroup'),
          payload: data
        })
      },
      deleteGroup(data) {
        dispatch({
          type: getEffectOrReducerByName('deleteGroup'),
          payload: data
        })
      },
      getGroupPartialInfo(data) {
        dispatch({
          type: getEffectOrReducerByName('getGroupPartialInfo'),
          payload: data
        })
      },
      approvalMember(data) {
        dispatch({
          type: getEffectOrReducerByName('approvalMember'),
          payload: data
        })
      },
      discontinueMember(data) {
        dispatch({
          type: getEffectOrReducerByName('discontinueMember'),
          payload: data
        })
      },
      inviteMemberToGroup(data) {
        dispatch({
          type: getEffectOrReducerByName('inviteMemberToGroup'),
          payload: data
        })
      },
      getCurrentOrgRole(data) {
        dispatch({
          type: getEffectOrReducerByName('getCurrentOrgRole'),
          payload: data
        })
      },
      setMemberRole(data) {
        dispatch({
          type: getEffectOrReducerByName('setMemberRole'),
          payload: data
        })
      },
      getMemberInfo(params) {
        dispatch({
          type: getEffectOrReducerByName('getMemberInfo'),
          payload: params
        })
      },
      getMembersInOneGroup(params) {
        //
        dispatch({
          type: getEffectOrReducerByName('getMembersInOneGroup'),
          payload: params
        })
      },
      setGroupLeader(data) {
        //setGroupLeader
        dispatch({
          type: getEffectOrReducerByName('setGroupLeader'),
          payload: data
        })
      },
      inviteJoinOrganization(data) {
        dispatch({
          type: getEffectOrReducerByName('inviteJoinOrganization'),
          payload: data
        })
      }
    }

    const routingJump = path => {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route: path
        }
      })
    }
    const updateDatas = payload => {
      dispatch({
        type: getEffectOrReducerByName('updateDatas'),
        payload: payload
      })
    }
    return (
      <div
        id={'organizationMemberContainer'}
        className={indexStyles.OMout}
        style={{
          minHeight: '100%',
          height: 'auto',
          position: 'relative',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_QUERY) && (
          <Header {...CreateGroupProps} model={model} />
        )}
        {checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_QUERY) && (
          <CreateGroup {...CreateGroupProps} updateDatas={updateDatas} />
        )}
      </div>
    )
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  modal,
  organizationMember,
  loading,
  technological: {
    datas: { userOrgPermissions }
  }
}) {
  return { modal, model: organizationMember, loading, userOrgPermissions }
}
export default connect(mapStateToProps)(OrganizationMember)
