import React, { Component } from 'react'
import {
  Popover,
  Tooltip,
  Menu,
  Dropdown,
  Button,
  Modal,
  message,
  Collapse,
  Avatar
} from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import globalStyles from './../../../../globalset/css/globalClassName.less'
import AvatarList from './AvatarList/index'
import defaultUserAvatar from './../../../../assets/invite/user_default_avatar@2x.png'
import { inviteNewUserInProject } from './../../../../services/technological/index'
import classNames from 'classnames/bind'
import ShowAddMenberModal from '../Project/ShowAddMenberModal'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE
} from '@/globalset/js/constant'
import {
  checkIsHasPermissionInBoard,
  isHasOrgMemberQueryPermission
} from '../../../..//utils/businessFunction'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  organizationInviteWebJoin,
  commInviteWebJoin
} from './../../../../services/technological/index'
import { getOrgIdByBoardId } from '../../../../utils/businessFunction'
import { inviteMembersInWebJoin } from '../../../../utils/inviteMembersInWebJoin'
import ROLEAVATAR from '../../../../assets/invite/role_avatar.png'
import {
  UNLOCK,
  LISTLOCK,
  NOTLISTLOCKREAD,
  ROLETYPEID,
  MEMBERTYPEID
} from './constans'

let cx = classNames.bind(styles)
@connect(({ technological }) => ({
  currentOrgAllMembersList: technological.datas.currentOrgAllMembersList || [],
  userBoardPermissions: technological.datas.userBoardPermissions
}))
class VisitControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // addMemberModalVisible: false, // 是否显示添加成员的弹窗, 默认为 false 不显示
      comfirmRemoveModalVisible: false, // 是否显示移除职员的弹窗, 默认为 false 不显示
      visible: false, // 这是控制popover组件自身的显示状态
      selectedOtherPersonId: '', //当前选中的外部邀请人员的 id
      othersPersonList: [], //外部邀请人员的list
      transPrincipalList: [], //外部已有权限人的list
      ShowAddMenberModalVisibile: false, //是否显示添加成员的弹窗, 默认为 false 不显示
      removerOtherPersonId: '', // 当前需要删除的成员id
      /**
       * 面板的激活列表
       */
      panelActivekey: []
    }
    this.inputRef = React.createRef()
    // console.log(props)
  }

  // 小图标的点击事件或者说访问控制的点击事件
  togglePopoverVisible = e => {
    if (e) e.stopPropagation()
    this.setState(state => {
      const { visible } = state
      return {
        visible: !visible
      }
    })
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://')

  // // 获取添加成员的回调
  handleGetAddNewMember = (members, roles) => {
    const { handleAddNewMember } = this.props
    // 获取平台人员
    const filterPlatformUsersId = users =>
      users && users.filter(u => u.type == 'platform')
    // 操作不是平台中的人员==> 然后将平台和平台之外的人拼接 ['xxxid','xxxphone','1347369711855341568','18270711420] ==> 在暴露方法 handleAddNewMember
    this.handleNotPlatformMember(members)
      .then(users_arr => [...users_arr, ...filterPlatformUsersId(members)])
      .then(users_arr => handleAddNewMember(users_arr, roles))
  }
  async handleNotPlatformMember(members) {
    // 找到不是平台中的人员 过滤 得到手机号等==>['18270711420',....]
    const isNotPlatformMember = m => m.type == 'other'
    const users = members
      .filter(item => isNotPlatformMember(item))
      .reduce((acc, curr) => {
        if (!acc) return curr.user
        return `${acc},${curr.user}`
      }, '')
    if (!users) return Promise.resolve([])
    let res = await inviteNewUserInProject({ data: users })
    let users_arr = res.data
    return Promise.resolve(users_arr)
  }
  handleInviteMemberReturnResult = (selectedMember, roleMembers) => {
    this.handleGetAddNewMember(selectedMember, roleMembers)
    // 添加成员成功后关闭弹窗
    this.setState({
      // addMemberModalVisible: false,
      ShowAddMenberModalVisibile: false
    })
  }
  addMenbersInProject = (values, selectedMember, roleMembers) => {
    this.handleInviteMemberReturnResult(selectedMember, roleMembers)
    const { panelActivekey } = this.state
    /**
     * 如果没有打开指定人面板，则打开面板
     */
    if (!panelActivekey.includes('2')) {
      this.setState({
        panelActivekey: panelActivekey.concat(['2'])
      })
    }
  }

  /**
   * 访问控制的开关切换
   * @param {Boolean} checked 是否开启访问控制的状态
   */
  handleToggleVisitControl = e => {
    const { handleVisitControlChange, board_id } = this.props
    if (
      !checkIsHasPermissionInBoard(
        PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE,
        board_id
      )
    ) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      toggle_selectedKey: e.key
    })
    handleVisitControlChange(e.key == UNLOCK.key ? false : true, e.key)
  }

  // popover的关闭或者打开的控制该状态的回调，
  onPopoverVisibleChange = visible => {
    const { handleVisitControlPopoverVisible } = this.props
    const isClose = visible === false
    const {
      addMemberModalVisible,
      comfirmRemoveModalVisible,
      ShowAddMenberModalVisibile
    } = this.state
    //关闭页面中的其他 弹窗 会影响到 popover 的状态，这里以示区分。
    if (isClose && !comfirmRemoveModalVisible && !ShowAddMenberModalVisibile) {
      this.setState(
        {
          visible: false
        },
        () => {
          handleVisitControlPopoverVisible(false)
        }
      )
    }
  }

  /**
   * 获取当前操作的对象的id
   * @param {String} removerId 当前需要移除的id
   * @param {String} userId 当前用户id
   */
  handleClickedOtherPersonListItem = (removerId, userId) => {
    this.setState({
      selectedOtherPersonId: userId,
      removerOtherPersonId: removerId
    })
  }

  /**
   * 点击选中邀请进来的外部人员的下拉菜单的回调
   */
  handleSelectedOtherPersonListOperatorItem = (data, val) => {
    const { _, key } = val
    const operatorType = key
    const { handleClickedOtherPersonListOperatorItem, board_id } = this.props
    const { selectedOtherPersonId, removerOtherPersonId } = this.state
    if (
      !checkIsHasPermissionInBoard(
        PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE,
        board_id
      )
    ) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }

    if (operatorType === 'remove') {
      return this.setState({
        comfirmRemoveModalVisible: true
      })
    }
    // 暴露当前点击操作人下拉状态
    handleClickedOtherPersonListOperatorItem(
      selectedOtherPersonId,
      operatorType,
      removerOtherPersonId,
      data.type
    )
  }

  /**
   * 点击移除成员弹窗的确定回调
   * @param {Event} e 当前的事件对象
   */
  handleComfirmRemoveModalOk = e => {
    if (e) e.stopPropagation()
    const { handleClickedOtherPersonListOperatorItem } = this.props
    const { selectedOtherPersonId, removerOtherPersonId } = this.state
    this.setState(
      {
        comfirmRemoveModalVisible: false
      },
      () => {
        handleClickedOtherPersonListOperatorItem(
          selectedOtherPersonId,
          'remove',
          removerOtherPersonId
        )
      }
    )
  }

  // 关闭移除成员的弹窗回调
  handleCloseComfirmRemoveModal = e => {
    if (e) e.stopPropagation()
    this.setState({
      comfirmRemoveModalVisible: false
    })
  }

  // 关闭添加成员弹窗的回调
  // handleCloseAddMemberModal = e => {
  //   if (e) e.stopPropagation()
  //   this.setState({
  //     addMemberModalVisible: false,
  //     ShowAddMenberModalVisibile: false
  //   })
  // }

  // 点击添加成员的回调
  // handleAddNewMember = () => {
  //   // this.setState({
  //   //   addMemberModalVisible: true
  //   // })
  //   this.togglePopoverVisible
  // }

  //点击添加成员操作
  setShowAddMenberModalVisibile = () => {
    if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  // 获取负责人列表
  genPrincipalList = (principalList = []) => {
    this.setState({
      transPrincipalList: principalList
    })
  }

  // 这是分析检测其他人的权限
  parseOtherPrivileges = otherPrivilege => {
    const { currentOrgAllMembersList = [] } = this.props
    const isEachMemberInOtherPrivilegeCanFoundInCurrentOrgAllMembersList = currentOrgAllMembersList => {
      if (!(otherPrivilege instanceof Array)) {
        return
      }
      return (
        otherPrivilege &&
        otherPrivilege.every(item => {
          return currentOrgAllMembersList.find(
            each => each.id === (item.user_info || item.role_info).id
          )
        })
      )
    }
    //如果现有的组织成员列表，不包括所有的人，那么就更新组织成员列表
    let allMember = [...currentOrgAllMembersList]
    const getOthersPersonList = arr => {
      if (!(otherPrivilege instanceof Array)) {
        return
      }
      return (
        otherPrivilege &&
        otherPrivilege.reduce((acc, curr) => {
          const {
            content_privilege_code,
            user_info = {},
            id,
            role_info = {}
          } = curr
          const { name, avatar, id: uid, type } = user_info.id
            ? user_info
            : role_info
          const obj = {
            id: id,
            name: name,
            user_id: uid,
            type: user_info.id ? MEMBERTYPEID : role_info.id ? ROLETYPEID : '',
            avatar:
              !!avatar && this.isValidAvatar(avatar)
                ? avatar
                : role_info.id // 是否是角色对象
                ? ROLEAVATAR // 角色头像
                : defaultUserAvatar,
            privilege: content_privilege_code
          }
          return [...acc, obj]
        }, [])
      )
    }
    if (
      !isEachMemberInOtherPrivilegeCanFoundInCurrentOrgAllMembersList(
        currentOrgAllMembersList
      )
    ) {
      // 过滤那些不在组织中的人
      if (!(otherPrivilege instanceof Array)) {
        return
      }
      // const notFoundInOrgAllMembersListMembers = otherPrivilege.filter(
      //   item => !currentOrgAllMembersList.find(each => each.id === item.user_info.id)
      // );
      this.setState({
        othersPersonList: getOthersPersonList(allMember)
      })
    } else {
      this.setState({
        othersPersonList: getOthersPersonList(allMember)
      })
    }
  }

  // 是否有必要更新比较其他人的权限在props中
  compareOtherPrivilegeInPropsAndUpdateIfNecessary = nextProps => {
    const {
      otherPrivilege: nextOtherPrivilege,
      principalList: nextPrincipalList
    } = nextProps
    const { otherPrivilege, principalList } = this.props
    // 定义一个方法做比较
    const isTheSameOtherPrivilege = (otherPrivilege1, otherPrivilege2) => {
      // 将数组变成一个新的迭代器对象
      const objToEntries = obj => Object.entries(obj)
      // 定义一个变量来判断两个数组的长度是否相等
      const isTheSameLength = (arr1 = [], arr2 = []) =>
        arr1.length === arr2.length
      // 比较数组a中的元素是否能在b中找到
      const isEntriesSubset = (arr1 = [], arr2 = []) =>
        arr1.every(([key1, value1]) =>
          arr2.find(([key2, value2]) => key1 === key2 && value1 === value2)
        )
      const otherPrivilege1Entries = objToEntries(otherPrivilege1)
      const otherPrivilege2Entries = objToEntries(otherPrivilege2)
      if (
        isTheSameLength(otherPrivilege1Entries, otherPrivilege2Entries) &&
        isEntriesSubset(otherPrivilege1Entries, otherPrivilege2Entries)
      ) {
        return true
      }
      return false
    }
    // 如果说两次其他成员的列表不同, 那么就更新它
    if (!isTheSameOtherPrivilege(otherPrivilege, nextOtherPrivilege)) {
      this.parseOtherPrivileges(nextOtherPrivilege)
    }
    // 如果说两次的执行人列表不同, 那么就更新它
    if (!isTheSameOtherPrivilege(principalList, nextPrincipalList)) {
      this.setState({
        transPrincipalList: nextPrincipalList
      })
    }
  }

  // 开启访问控制权限回调
  handleClickedInVisitControl = e => {
    if (e) e.stopPropagation()
    const { handleVisitControlPopoverVisible } = this.props
    handleVisitControlPopoverVisible(true)
  }

  //组件挂载完成需要调用获取负责人列表以及分析其他人的权限
  componentDidMount() {
    //将[id]:privilageType 对象转化为数组
    const { otherPrivilege = [], principalList = [] } = this.props
    this.parseOtherPrivileges(otherPrivilege)
    this.genPrincipalList(principalList)
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps, 'ssssssss')
    this.compareOtherPrivilegeInPropsAndUpdateIfNecessary(nextProps)
  }

  // 渲染访问权限下拉菜单
  toggleVisitControl = () => {
    const {
      isPropVisitControl,
      isShowPropOtherPrivilege,
      isPropVisitControlKey
    } = this.props
    // let is_privilege_key = isPropVisitControlKey
    // if (isPropVisitControlKey == '2') {
    //   is_privilege_key = 'clock_edit'
    // } else if (isPropVisitControlKey == '1') {
    //   is_privilege_key = 'clock_read'
    // }
    return (
      <Menu
        getPopupContainer={triggerNode => triggerNode.parentNode}
        onClick={this.handleToggleVisitControl}
        selectedKeys={
          [isPropVisitControlKey.toString()]
          // isShowPropOtherPrivilege
          //   ? is_privilege_key
          //   : !isPropVisitControl
          //   ? UNLOCK.key
          //   : LISTLOCK.key
        }
      >
        <Menu.Item key={UNLOCK.key}>
          <div style={{ padding: '6px 0' }}>
            <span>{UNLOCK.title}</span>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>
              {UNLOCK.tips}
            </div>
          </div>
        </Menu.Item>
        {isShowPropOtherPrivilege && (
          <Menu.Item key={LISTLOCK.key}>
            <div style={{ padding: '6px 0' }}>
              <span>{LISTLOCK.title}</span>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>
                {LISTLOCK.tips}
              </div>
            </div>
          </Menu.Item>
        )}
        <Menu.Item key={NOTLISTLOCKREAD.key}>
          <div style={{ padding: '6px 0' }}>
            <span>{NOTLISTLOCKREAD.title}</span>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>
              {NOTLISTLOCKREAD.tips}
            </div>
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  // 这是popover中的内容头部标题的控制
  renderPopoverTitle = () => {
    const {
      isPropVisitControl,
      isPropVisitControlKey,
      type,
      onlyShowPopoverContent,
      isShowPropOtherPrivilege
    } = this.props
    /**
     * 未添加控制图标
     */
    const unClockIcon = (
      <i className={`${globalStyles.authTheme} ${styles.title__text_icon}`}>
        &#xe7ca;
      </i>
    )
    /**
     * 有权限控制图标
     */
    const clockIcon = (
      <i className={`${globalStyles.authTheme} ${styles.title__text_icon}`}>
        &#xe86a;
      </i>
    )

    /**
     * 控制标识和文本控制
     * 0 未授权控制
     * 2 列表可编辑
     * 1 列表外不可访问
     */
    const is_privilege_text = isShowPropOtherPrivilege
      ? isPropVisitControlKey == UNLOCK.key
        ? UNLOCK.title
        : isPropVisitControlKey == LISTLOCK.key
        ? LISTLOCK.title
        : isPropVisitControlKey == NOTLISTLOCKREAD.key
        ? NOTLISTLOCKREAD.title
        : UNLOCK.title
      : !isPropVisitControl
      ? UNLOCK.title
      : NOTLISTLOCKREAD.title

    return (
      <div
        className={styles.title__wrapper}
        style={{ width: onlyShowPopoverContent && 'auto' }}
      >
        {type && type == 'board_list' ? (
          <span className={styles.title__text_wrapper}>
            <span className={styles.title__text_content}>访问权限</span>
          </span>
        ) : (
          <>
            <span className={styles.title__text_wrapper}>
              {isPropVisitControl ? clockIcon : unClockIcon}
              <span className={styles.title__text_content}>访问权限</span>
            </span>
            <div
              className={styles.title__operator}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <Dropdown
                getPopupContainer={triggerNode => triggerNode.parentNode}
                overlay={this.toggleVisitControl()}
                trigger={['click']}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: 'rgba(0,0,0,0.45)',
                    marginRight: 0
                  }}
                >
                  <span>{is_privilege_text}</span>
                  <span className={`${globalStyles.authTheme}`}>&#xe7ee;</span>
                </span>
              </Dropdown>
            </div>
          </>
        )}
      </div>
    )
  }

  /**渲染其他人操作下拉菜单的选项*/
  renderOtherPersonOperatorMenu = (privilege, data) => {
    const { otherPersonOperatorMenuItem } = this.props
    const { Item } = Menu
    return (
      <Menu
        onClick={this.handleSelectedOtherPersonListOperatorItem.bind(
          this,
          data
        )}
      >
        {otherPersonOperatorMenuItem.map(({ key, value, style }) => {
          const itemClass = cx({
            content__othersPersonList_Item_operator_dropdown_menu_item: true,
            content__othersPersonList_Item_operator_dropdown_menu_item_disabled:
              value === privilege ? true : false
          })
          return (
            <Item key={value}>
              <div
                onClick={
                  value === privilege ? e => e.stopPropagation() : () => {}
                }
                className={itemClass}
                style={style ? style : {}}
              >
                <span>{key}</span>
              </div>
            </Item>
          )
        })}
      </Menu>
    )
  }

  /**  渲染的参与人列表组件*/
  renderPopoverContentPrincipalList() {
    const { principalInfo } = this.props
    const { transPrincipalList } = this.state
    return (
      <div
        className={styles.content__principalList_wrapper}
        style={{ height: '100%', overflow: 'auto' }}
      >
        <div className={styles.content__principalList_icon}>
          {(transPrincipalList || []).map(item => {
            return (
              <div
                key={item.id}
                className={styles.content__othersPersonList_Item_wrapper}
                style={{ marginTop: 8 }}
              >
                <span className={styles.content__othersPersonList_Item_info}>
                  <Avatar
                    size={20}
                    src={
                      this.isValidAvatar(item.avatar)
                        ? item.avatar
                        : item.type === ROLETYPEID
                        ? ROLEAVATAR
                        : defaultUserAvatar
                    }
                  ></Avatar>
                  <span
                    style={{ marginLeft: 5 }}
                    className={styles.content__othersPersonList_Item_name}
                  >
                    {item.name}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
        {/* <span className={styles.content__principalList_info}>
          {`${transPrincipalList.length}${principalInfo}`}
        </span> */}
        {/* {transPrincipalList && transPrincipalList.length != '0' && (
          <span
            className={`${styles.content__principalList_info}`}
            style={{ color: 'rgba(0,0,0,0.25)' }}
          >
            默认可访问
          </span>
        )} */}
      </div>
    )
  }

  /** 渲染popover中其他人的组件列表 */
  renderPopoverContentOthersPersonList = () => {
    const { otherPersonOperatorMenuItem, isPropVisitControlKey } = this.props
    const { othersPersonList } = this.state
    return (
      <div
        id={'content__othersPersonList_wrapper'}
        className={styles.content__othersPersonList_wrapper}
      >
        {othersPersonList &&
          othersPersonList.map(
            ({ id, user_id, name, avatar, privilege }, index) => (
              <div
                key={id}
                className={styles.content__othersPersonList_Item_wrapper}
              >
                <span className={styles.content__othersPersonList_Item_info}>
                  <img
                    width="20"
                    height="20"
                    src={avatar}
                    alt=""
                    className={styles.content__othersPersonList_Item_avatar}
                  />
                  <span className={styles.content__othersPersonList_Item_name}>
                    {name}
                  </span>
                </span>
                {isPropVisitControlKey.toString() !== LISTLOCK.key ? (
                  <Dropdown
                    autoAdjustOverflow={false}
                    // getPopupContainer={() => document.getElementById('content__othersPersonList_wrapper')}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    trigger={['click']}
                    overlay={this.renderOtherPersonOperatorMenu(
                      privilege,
                      othersPersonList[index]
                    )}
                  >
                    <span
                      onClick={() =>
                        this.handleClickedOtherPersonListItem(id, user_id)
                      }
                      className={styles.content__othersPersonList_Item_operator}
                    >
                      <span
                        className={
                          styles.content__othersPersonList_Item_operator_text
                        }
                      >
                        {
                          (
                            otherPersonOperatorMenuItem.find(
                              item => item.value === privilege
                            ) || {}
                          ).key
                        }
                      </span>
                      <span
                        className={`${globalStyles.authTheme} ${styles.content__othersPersonList_Item_operator_icon}`}
                      >
                        &#xe7ee;
                      </span>
                    </span>
                  </Dropdown>
                ) : (
                  <Tooltip title="移除">
                    <span
                      onClick={() => {
                        this.handleClickedOtherPersonListItem(id, user_id)
                        this.handleSelectedOtherPersonListOperatorItem(
                          {},
                          { key: 'remove' }
                        )
                      }}
                      className={`${globalStyles.authTheme} ${styles.removeItems}`}
                    >
                      &#xe720;
                    </span>
                  </Tooltip>
                )}
              </div>
            )
          )}
      </div>
    )
  }

  // 渲染popover组件中的底部 添加成员按钮
  renderPopoverContentAddMemberBtn = () => {
    const { isPropVisitControlKey } = this.props
    return (
      <div className={styles.content__addMemberBtn_wrapper}>
        <Button
          type="primary"
          block
          onClick={this.setShowAddMenberModalVisibile}
        >
          添加指定人
        </Button>
      </div>
    )
  }

  // 渲染没有数据的时候
  renderPopoverContentNoContent = () => {
    return (
      <div className={styles.content__noConten_wrapper}>
        <div className={styles.content__noConten_img} />
        <div className={styles.content__noConten_text}>暂无人员</div>
      </div>
    )
  }

  // 当前是否没有成员
  isCurrentHasNoMember = () => {
    const { principalList } = this.props
    const { othersPersonList } = this.state
    return (
      principalList &&
      principalList.length == 0 &&
      othersPersonList &&
      othersPersonList.length == 0
    )
  }

  /**
   * 折叠面板的开关回调
   * @param {string[]} val 折叠对象
   */
  collapseChange = val => {
    // console.log(val)
    this.setState({
      panelActivekey: val
    })
  }

  // 渲染popover组件中的内容
  renderPopoverContent = () => {
    const { notShowPrincipal, isPropVisitControlKey } = this.props
    return (
      <div className={styles.content__wrapper}>
        <div
          className={styles.content__list_wrapper}
          style={{
            margin: document.getElementById('container_publicFileDetailModal')
              ? '-12px -16px 0'
              : document.getElementById('process_file_detail_container')
              ? '-12px -5px 0'
              : '-12px -16px 0'
          }}
        >
          {this.isCurrentHasNoMember() ? (
            <>{this.renderPopoverContentNoContent()}</>
          ) : (
            <Collapse
              bordered={false}
              onChange={this.collapseChange}
              activeKey={this.state.panelActivekey}
            >
              {!notShowPrincipal && (
                <Collapse.Panel
                  header={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingRight: 15
                      }}
                    >
                      <div>参与人</div>
                      <div style={{ color: 'rgba(0,0,0,0.7)' }}>
                        {(this.state.transPrincipalList || []).length}人
                      </div>
                    </div>
                  }
                  className={styles.pannel_item}
                  style={{
                    background: '#fff',
                    borderRadius: 4,
                    marginBottom: 0,
                    border: 0,
                    overflow: 'hidden'
                  }}
                  key="1"
                >
                  {this.renderPopoverContentPrincipalList()}
                </Collapse.Panel>
              )}

              <Collapse.Panel
                key="2"
                header={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingRight: 15
                    }}
                  >
                    <div>指定人</div>
                    <div style={{ color: 'rgba(0,0,0,0.7)' }}>
                      {(this.state.othersPersonList || []).length}人
                    </div>
                  </div>
                }
                className={styles.pannel_item}
                style={{
                  background: '#fff',
                  borderRadius: 4,
                  marginBottom: 0,
                  border: 0,
                  overflow: 'hidden'
                }}
              >
                {this.renderPopoverContentOthersPersonList()}
              </Collapse.Panel>
            </Collapse>
          )}
        </div>
        {this.renderPopoverContentAddMemberBtn()}
      </div>
    )
  }

  render() {
    const {
      tooltipUnClockText,
      tooltipClockText,
      isPropVisitControl,
      removeMemberPromptText,
      popoverPlacement,
      children,
      board_id,
      onlyShowPopoverContent,
      getPopupContainer
    } = this.props

    const {
      addMemberModalVisible,
      visible,
      comfirmRemoveModalVisible
    } = this.state
    const unClockEle = (
      <Tooltip title={tooltipUnClockText}>
        <i
          className={`${globalStyles.authTheme} ${styles.trigger__icon}`}
          style={{ fontSize: '20px' }}
        >
          &#xe7ca;
        </i>
      </Tooltip>
    )
    const clockEle = (
      <Tooltip title={tooltipClockText}>
        <span className={styles.trigger__btn__wrapper}>
          <i
            className={`${globalStyles.authTheme} ${styles.trigger__btn__icon}`}
            style={{ fontSize: '16px' }}
          >
            &#xe86a;
          </i>
          <span className={styles.trigger__btn_text}>已限制访问</span>
        </span>
      </Tooltip>
    )
    return (
      <div
        style={{ position: 'relative' }}
        className={styles.wrapper}
        onClick={e => this.handleClickedInVisitControl(e)}
      >
        {/* 这里是小图标的形式点击进来的,然后显示访问控制中的内容, 但是这个children没有看懂 */}
        {!onlyShowPopoverContent && (
          <Popover
            placement={popoverPlacement}
            title={this.renderPopoverTitle()}
            content={this.renderPopoverContent()}
            trigger="click"
            visible={visible}
            onVisibleChange={this.onPopoverVisibleChange}
            getPopupContainer={
              getPopupContainer
                ? () => getPopupContainer
                : triggerNode => triggerNode.parentNode
            }
          >
            {children ? (
              <span
                style={{ position: 'relative', marginRight: 0 }}
                className={styles.trigger__wrapper}
                onClick={e => this.togglePopoverVisible(e)}
              >
                {children}
              </span>
            ) : (
              <span
                style={{ marginRight: 0 }}
                className={styles.trigger__wrapper}
                onClick={e => this.togglePopoverVisible(e)}
              >
                {isPropVisitControl ? clockEle : unClockEle}
              </span>
            )}
          </Popover>
        )}
        {/* 这里是直接显示访问控制中的内容 */}
        {onlyShowPopoverContent && (
          <div>
            <div style={{ marginTop: '-24px' }}>
              {this.renderPopoverTitle()}
            </div>
            <div>{this.renderPopoverContent()}</div>
          </div>
        )}
        {/* <Modal
          visible={addMemberModalVisible}
          destroyOnClose={true}
          footer={null}
          zIndex={1099}
          onCancel={this.handleCloseAddMemberModal}
        >
          <InviteOthers
            title="邀请他人一起参与"
            isShowTitle={true}
            submitText="确定"
            handleInviteMemberReturnResult={this.handleInviteMemberReturnResult}
            isDisableSubmitWhenNoSelectItem={true}
          />
        </Modal> */}
        <ShowAddMenberModal
          {...this.props}
          title="授权给指定人"
          submitText="确定"
          show_wechat_invite={false}
          board_id={board_id}
          // new_handleInviteMemberReturnResult={
          //   this.handleInviteMemberReturnResult
          // }
          modalVisible={this.state.ShowAddMenberModalVisibile}
          setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(
            this
          )}
          addMenbersInProject={this.addMenbersInProject}
        />
        <Modal
          visible={comfirmRemoveModalVisible}
          destroyOnClose={true}
          zIndex={1100}
          onCancel={this.handleCloseComfirmRemoveModal}
          onOk={this.handleComfirmRemoveModalOk}
          title="确定要移出此用户吗?"
        >
          <p>{removeMemberPromptText}</p>
        </Modal>
      </div>
    )
  }
}

VisitControl.defaultProps = {
  board_id: '', // 需要一个项目ID
  onlyShowPopoverContent: false, //是否直接显示popover里的内容 ----这个是定义有些是在弹窗中的时候,那么就是小图标的形式
  popoverPlacement: 'bottomRight', //popoverplacement
  tooltipUnClockText: '访问控制', //默认的popover包裹元素的tooltip
  tooltipClockText: '关闭访问控制', //默认的popover包裹元素的tooltip
  isPropVisitControl: true, //是否开启访问控制
  handleVisitControlChange: function() {
    //访问控制 change 的回调函数
    message.error('handleVisitControlChange is required. ')
  },
  principalInfo: '位任务负责人', //已有权限人提示信息
  principalList: [
    //负责人列表
    // {
    //   name: 'Jake',
    //   avatar:
    //     'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'
    // }
  ],
  notShowPrincipal: false, //不显示权限人列表
  isShowPropOtherPrivilege: false, // 控制是否显示 "列表外人员禁止访问" 默认不显示
  isPropVisitControlKey: '0', // "0" 开放访问与操作, "1" 列表外人员禁止访问, "2" 仅列表人员可操作  表示传入的当前访问控制状态
  otherPersonOperatorMenuItem: [
    //添加人员的菜单操作映射
    {
      key: '仅查看',
      value: 'read'
    },
    {
      key: '可编辑',
      value: 'edit'
    },
    {
      key: '可评论',
      value: 'comment'
    },
    {
      key: '移出',
      value: 'remove',
      style: {
        color: '#f73b45'
      }
    }
  ],
  otherPrivilege: [], //现有的添加人员列表
  //{'id': 'read'}
  handleClickedOtherPersonListOperatorItem: function() {
    //点击选中邀请进来的外部人员的下拉菜单项目的回调函数
  },
  handleAddNewMember: function() {
    //...          //添加成员返回的 成员id 数组
  },
  removeMemberPromptText: '移出后用户将不能访问此内容',
  handleVisitControlPopoverVisible: function() {} //单击本组件，或者是本组件visible改变的时候，将popover组件的visible状态传达到父组件。
}

export default VisitControl
