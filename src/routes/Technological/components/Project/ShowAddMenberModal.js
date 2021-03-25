import React from 'react'
import { Button, Form, Input } from 'antd'
import { PROJECTS } from '../../../../globalset/js/constant'
import {
  currentNounPlanFilterName,
  getGlobalData,
  getOrgIdByBoardId
} from '../../../../utils/businessFunction'
import CustormModal from '../../../../components/CustormModal'
import InviteOthers from './../InviteOthers/index'
import globalStyles from '@/globalset/css/globalClassName.less'
import WechatInviteToboard from './components/WechatInviteToboard'
import { getProjectRoles } from '../../../../services/technological/prjectDetail'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
class ShowAddMenberModal extends React.Component {
  state = {
    users: '',
    wechat_invite_visible: false
  }

  usersChange(e) {
    this.setState({
      users: e.target.value
    })
  }
  onCancel = () => {
    this.props.setShowAddMenberModalVisibile()
  }
  // 提交表单
  handleSubmit = ({ userStr, selectedMember, roleMembers }) => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values['board_id'] = this.props.board_id
        values['users'] = userStr
        this.props.setShowAddMenberModalVisibile()
        this.props.addMenbersInProject
          ? this.props.addMenbersInProject(values, selectedMember, roleMembers)
          : false
      }
    })
  }
  handleUsersToUsersStr = (users = []) => {
    return users.reduce((acc, curr) => {
      const isCurrentUserFromPlatform = () =>
        curr.type === 'platform' && curr.id
      // if (acc) {
      //   return acc + ',' + curr.id
      // }
      // return curr.id
      if (isCurrentUserFromPlatform()) {
        if (acc) {
          return acc + ',' + curr.id
        }
        return curr.id
      } else {
        if (acc) {
          return acc + ',' + curr.user
        }
        return curr.user
      }
    }, '')
  }
  /**
   * 选择了成员列表
   * @param {any[]} selectedMember 人员选择列表
   * @param {any[]} roleSelected 角色选择列表
   */
  handleInviteMemberReturnResult = (selectedMember = [], roleSelected = []) => {
    // console.log(roleSelected)
    this.props.new_handleInviteMemberReturnResult &&
      this.props.new_handleInviteMemberReturnResult(selectedMember)
    this.handleSubmit({
      userStr: this.handleUsersToUsersStr(selectedMember),
      selectedMember,
      roleMembers: roleSelected
    })
  }

  setWechatInviteVisible = () => {
    const { wechat_invite_visible } = this.state
    this.setState({
      wechat_invite_visible: !wechat_invite_visible
    })
  }

  /**
   * 获取角色信息列表
   * @returns {Promise<object[]>}
   */
  getRoleData = () => {
    return getProjectRoles({ type: '2' })
      .then(res => {
        if (isApiResponseOk(res)) {
          return res.data
        }
        return []
      })
      .catch(err => false)
  }

  renderUsersList = () => {
    const {
      _organization_id,
      show_wechat_invite,
      title,
      submitText,
      board_id,
      // 是否加载角色数据
      loadRoleData,
      // 是否隐藏从项目或分组选折人员
      hideSelectFromGroupOrBoard = false
    } = this.props
    const container = (
      <Form style={{ margin: '0 auto', width: '100%' }}>
        {/* <div style={{ fontSize: 20, color: '#595959', marginTop: 28, marginBottom: 28 }}> {title ? title : `邀请他人一起参加${currentNounPlanFilterName(PROJECTS)}`} </div> */}
        <div
          style={{
            fontSize: 20,
            color: '#595959',
            marginTop: '-10px'
            // marginBottom: 28
          }}
        >
          {' '}
          {title ? title : `邀请参与人`}{' '}
        </div>
        <div style={{ margin: '0px -24px' }}>
          <InviteOthers
            // 提交按钮的文字
            submitText={submitText ? submitText : '确定'}
            // 是否显示title
            isShowTitle={false}
            // 是否显示从分组或者从项目选择
            hideSelectFromGroupOrBoard={hideSelectFromGroupOrBoard}
            // 是否加载角色数据列表
            loadRoleData={loadRoleData}
            // 组织id
            _organization_id={
              _organization_id ||
              getOrgIdByBoardId(board_id) ||
              getGlobalData('aboutBoardOrganizationId')
            }
            handleInviteMemberReturnResult={this.handleInviteMemberReturnResult}
            isDisableSubmitWhenNoSelectItem={true}
            show_wechat_invite={show_wechat_invite}
            setWechatInviteVisible={this.setWechatInviteVisible}
          ></InviteOthers>
        </div>
        {
          // show_wechat_invite && (
          //   <Button>
          //     <i
          //       className={globalStyles.authTheme}
          //       style={{ color: '#46A318', marginRight: 4 }}
          //     >
          //       &#xe634;
          //     </i>
          //     扫码邀请
          //   </Button>
          // <div
          //   style={{
          //     marginTop: -18,
          //     marginBottom: 16,
          //     color: '#1890FF',
          //     cursor: 'pointer'
          //   }}
          //   onClick={this.setWechatInviteVisible}
          // >
          //   <i
          //     className={globalStyles.authTheme}
          //     style={{ color: '#46A318', marginRight: 4 }}
          //   >
          //     &#xe634;
          //   </i>
          //   微信扫码邀请参与人
          // </div>
          // )
        }
      </Form>
    )
    return container
  }

  render() {
    const {
      modalVisible,
      show_wechat_invite,
      board_id,
      invitationType,
      invitationId,
      rela_Condition,
      invitationOrg
    } = this.props
    const { wechat_invite_visible } = this.state

    return (
      <div>
        <CustormModal
          visible={modalVisible}
          width={400}
          zIndex={1100}
          maskClosable={false}
          footer={null}
          destroyOnClose
          style={{ textAlign: 'center' }}
          onCancel={this.onCancel}
          overInner={this.renderUsersList()}
          bodyStyle={{ paddingTop: '24px', paddingBottom: '1px' }}
        ></CustormModal>
        {show_wechat_invite && (
          <WechatInviteToboard
            board_id={board_id}
            modalVisible={wechat_invite_visible}
            setModalVisibile={this.setWechatInviteVisible}
            invitationId={invitationId}
            invitationOrg={invitationOrg}
            invitationType={invitationType}
            rela_Condition={rela_Condition}
          />
        )}
      </div>
    )
  }
}
export default Form.create()(ShowAddMenberModal)

ShowAddMenberModal.defaultProps = {
  _organization_id: undefined, //传递进来的组织id
  board_id: '', //传递进来的项目id
  show_wechat_invite: false, //显示微信邀请
  addMenbersInProject: function() {
    //提交回调
  },
  setShowAddMenberModalVisibile: function() {} //设置显示隐藏
}
