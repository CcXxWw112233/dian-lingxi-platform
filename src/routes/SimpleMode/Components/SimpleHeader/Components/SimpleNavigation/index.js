import React, { Component, lazy, Suspense } from 'react'
import indexStyles from './index.less'
import { Tooltip, Modal, Menu, Switch, Icon, Divider, Avatar } from 'antd'
import linxiLogo from '@/assets/library/lingxi_logo.png'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import {
  checkIsHasPermission,
  currentNounPlanFilterName,
  isPaymentOrgUser
} from '@/utils/businessFunction'
import {
  DASHBOARD,
  MEMBERS,
  ORG_UPMS_ORGANIZATION_EDIT,
  ORG_UPMS_ORGANIZATION_ROLE_CREATE,
  ORG_UPMS_ORGANIZATION_ROLE_EDIT,
  ORG_UPMS_ORGANIZATION_ROLE_DELETE,
  ORG_UPMS_ORGANIZATION_MEMBER_ADD,
  ORGANIZATION,
  PROJECTS,
  ORG_UPMS_ORGANIZATION_MEMBER_QUERY,
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN
} from '@/globalset/js/constant'
import { message } from 'antd/lib/index'
import { getUsersNoticeSettingList } from '@/services/technological/notificationSetting'
import { isApiResponseOk } from '@/utils/handleResponseData'
// import CreateOrganizationModal from '@/routes/Technological/components/HeaderNav/CreateOrganizationModal'
// import ShowAddMenberModal from '@/routes/Technological/components/OrganizationMember/ShowAddMenberModal'
// import NotificationSettingsModal from '@/routes/Technological/Sider/comonent/notificationSettings/NotificationSettingsModal'
// import AccountSet from '@/routes/Technological/components/AccountSet'
// import OrganizationMember from '@/routes/Technological/components/OrganizationMember'
// import Organization from '@/routes/organizationManager'
import queryString from 'query-string'
import {
  OrgPaymentMark,
  OrgUserType,
  PAYUPGRADEURL
} from '../../../../../../globalset/js/constant'
import moment from 'moment'
import { OrgStructureModel } from '../../../../../../models/technological/orgStructure'
// import PayUpgrade from '@/routes/Technological/components/PayUpgrade/index'

const CreateOrganizationModal = lazy(() =>
  import('@/routes/Technological/components/HeaderNav/CreateOrganizationModal')
)
const ShowAddMenberModal = lazy(() =>
  import(
    '@/routes/Technological/components/OrganizationMember/ShowAddMenberModal'
  )
)
const NotificationSettingsModal = lazy(() =>
  import(
    '@/routes/Technological/Sider/comonent/notificationSettings/NotificationSettingsModal'
  )
)
// const AccountSet = lazy(() =>
//   import('@/routes/Technological/components/AccountSet')
// )
// const OrganizationMember = lazy(() =>
//   import('@/routes/Technological/components/OrganizationMember')
// )
// const Organization = lazy(() => import('@/routes/organizationManager'))
// const PayUpgrade = lazy(() =>
//   import('@/routes/Technological/components/PayUpgrade/index')
// )
/** ???????????? */
const OrgStructure = lazy(() => import('../OrganizationalStructure'))

const { SubMenu } = Menu
// let timer;
@connect(mapStateToProps)
export default class SimpleNavigation extends Component {
  constructor(props) {
    super(props)
    const { is_simplemode = false, collapsed = true } = props
    this.state = {
      collapsed: collapsed,
      createOrganizationVisable: false,
      ShowAddMenberModalVisibile: false, // ?????????????????????????????????
      NotificationSettingsModalVisible: false, // ?????????????????????????????????, ????????? false ?????????
      is_disabled: false, // ?????????????????????, ?????????true ??????????????????
      is_simplemode: is_simplemode,
      payUpgradeModalVisible: false
    }
    this.timer = null
    /** ??????????????????????????????????????????VIP??????????????? */
    this.expireMaxTimeShow = 30
  }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/updateDatas',
      payload: {
        is_all_org: localStorage.getItem('OrganizationId') == '0'
      }
    })
    // this.getInitList()
  }

  // ???????????????????????????
  getInitList = () => {
    getUsersNoticeSettingList().then(res => {
      if (isApiResponseOk(res)) {
        // console.log(res, 'sssss')
        // console.log(res, 'ssss')
      } else {
        message.error(res.message)
      }
    })
  }

  setCollapsed(collapsed) {
    if (this.state.is_simplemode) {
      this.setState({
        collapsed: false
      })
    } else {
      this.setState({
        collapsed
      })
    }
  }
  routingJump(route) {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/routingJump',
      payload: {
        route
      }
    })
  }
  menuClick({ key, code }) {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/updateDatas',
      payload: {
        naviHeadTabIndex: code
      }
    })
    let route
    switch (code) {
      case 'Workbench':
        route = 'workbench'
        break
      case 'Projects':
        route = 'project'
        break
      // case 'Shows':
      //   route='teamShow/teamList'
      // break
      case 'Case':
        window.open('https://www.di-an.com/zhichengshe')
        return
        break
      case 'Regulations':
        route = 'xczNews'
        break
      case 'InvestmentMaps':
        route = 'InvestmentMap'
        break
      default:
        break
    }
    this.routingJump(`/technological/${route}`)
  }

  //?????????????????????
  setCreateOrgnizationOModalVisable() {
    this.setState({
      createOrganizationVisable: !this.state.createOrganizationVisable
    })
  }

  // ??????????????????
  setNotificationSettingsModalVisible() {
    const { NotificationSettingsModalVisible } = this.state
    this.setState({
      NotificationSettingsModalVisible: !NotificationSettingsModalVisible
    })
  }

  //????????????????????????
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
    const { currentSelectOrganize = {}, dispatch } = this.props
    const { id } = currentSelectOrganize
    dispatch({
      type: 'technological/inviteJoinOrganization',
      payload: {
        members: users
        // org_id: id
      }
    })
  }

  seeMapAuthority(params) {
    if (localStorage.getItem('OrganizationId') !== '0') {
      const { dispatch } = this.props
      dispatch({
        type: 'organizationManager/getFnManagementList',
        payload: {
          organization_id: params.key
        }
      })
    }
  }

  // ???????????????????????????
  handleOrgListMenuClick = e => {
    const { key } = e
    const { is_disabled } = this.state
    const { currentUserOrganizes = [] } = this.props
    const { id } = currentUserOrganizes
    const { dispatch, is_show_org_name } = this.props
    //??????????????????????????????
    const isHasMemberView = () => {
      return checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_QUERY)
    }

    //??????????????????????????????
    const isHasManagerBack = () => {
      let flag = false
      if (
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_EDIT) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_CREATE) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_EDIT) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_DELETE)
      ) {
        flag = true
      }
      return flag
    }

    switch (key) {
      case '24': // ??????????????????
        //isHasMemberView() && this.routingJump('/technological/organizationMember')
        dispatch({
          type: 'organizationMember/updateDatas',
          payload: {
            groupList: [], //????????????
            TreeGroupModalVisiblie: false, //????????????????????????
            groupTreeList: [], //??????????????????
            currentBeOperateMemberId: '', //????????????????????????id
            roleList: [], //????????????????????????
            menuSearchSingleSpinning: false //??????????????????????????????
          }
        })
        this.props.updateStates({
          simpleDrawerVisible: true,
          // simpleDrawerContent: <OrganizationMember />,
          simpleDrawerContentKey: '24',
          simpleDrawerTitle: '????????????'
        })
        this.props.dropdownHandleVisibleChange(false)
        break
      case '23': // ????????????????????????
        //isHasManagerBack() && this.routingJump(`/organizationManager?nextpath=${window.location.hash.replace('#', '')}`)
        const currentSelectOrganize = localStorage.getItem(
          'currentSelectOrganize'
        )
          ? JSON.parse(localStorage.getItem('currentSelectOrganize'))
          : {} //JSON.parse(localStorage.getItem('currentSelectOrganize'))
        const {
          name,
          member_join_model,
          member_join_content,
          logo,
          logo_id,
          id
        } = currentSelectOrganize
        dispatch({
          type: 'organizationManager/updateDatas',
          payload: {
            currentOrganizationInfo: {
              //????????????
              name,
              member_join_model,
              member_join_content,
              logo,
              logo_id,
              id,
              management_Array: [] //????????????????????????
            },
            content_tree_data: [], //???????????????
            function_tree_data: [],
            orgnization_role_data: [], //??????????????????
            project_role_data: [], //??????????????????
            tabSelectKey: '1',
            // permission_data: [], //????????????
            //????????????
            current_scheme_local: '', //??????????????????
            current_scheme: '', //??????????????????
            current_scheme_id: '',
            scheme_data: [],
            field_data: [],
            editable: '0' //???????????????????????????????????? 1??? 0 ???
          }
        })

        dispatch({
          type: 'organizationManager/getRolePermissions',
          payload: {
            type: '1'
          }
        })
        dispatch({
          type: 'organizationManager/getRolePermissions',
          payload: {
            type: '2'
          }
        })
        dispatch({
          type: 'organizationManager/getNounList',
          payload: {}
        })
        const OrganizationId = localStorage.getItem('OrganizationId')
        if (OrganizationId !== '0') {
          dispatch({
            type: 'organizationManager/getPayingStatus',
            payload: { orgId: OrganizationId }
          })
        }
        this.props.updateStates({
          simpleDrawerVisible: true,
          // simpleDrawerContent: <Organization showBackBtn={false} />,
          simpleDrawerContentKey: '23',
          simpleDrawerTitle: '????????????'
        })
        this.props.dropdownHandleVisibleChange(false)
        break
      case '22': // ????????????????????????????????????
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD) &&
          this.setShowAddMenberModalVisibile()
        break
      case '20': // ??????????????????
        //this.routingJump('/technological/accoutSet')
        dispatch({
          type: 'accountSet/getUserInfo',
          payload: {}
        })
        const SelectedKeys = queryString.parse(window.location.search)
          .selectedKeys
        dispatch({
          type: 'accountSet/updateDatas',
          payload: {
            SelectedKeys: SelectedKeys || '1' //??????????????????menu?????????1???,??????????????????????????????
          }
        })
        this.props.updateStates({
          simpleDrawerVisible: true,
          // simpleDrawerContent: <AccountSet />,
          simpleDrawerContentKey: '20',
          simpleDrawerTitle: '????????????'
        })
        this.props.dropdownHandleVisibleChange(false)
        break
      case 'subShowOrgName':
        // console.log('sss', 2222)
        this.handleShowAllOrg
        break
      case 'subInfoSet':
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.setNotificationSettingsModalVisible()
        }, 300)

        break
      case 'subShowSimple':
        this.handleMode(0)
        break
      case '10': // ????????????????????????
        this.setCreateOrgnizationOModalVisable()
        this.props.dropdownHandleVisibleChange(false)
        break
      case '0': // ??????????????????
        this.setState({
          is_disabled: false
        })
        localStorage.setItem('currentSelectOrganize', JSON.stringify({}))
        dispatch({
          type: 'technological/changeCurrentOrg',
          payload: {
            org_id: '0',
            routingJumpPath: '/technological/simplemode/home',
            isNeedRedirectHash: false
          }
        })
        // dispatch({
        //     type: 'technological/updateDatas',
        //     payload: {
        //         currentSelectOrganize: {},
        //         is_all_org: true,
        //         is_show_org_name: is_show_org_name ? true : false,
        //     }
        // })

        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: {}
          }
        })

        dispatch({
          type: 'investmentMap/getMapsQueryUser',
          payload: {}
        })

        dispatch({
          type: 'xczNews/getXczNewsQueryUser',
          payload: {}
        })
        break
      case '-1': //??????
        this.logout(e)
        this.props.dropdownHandleVisibleChange(false)
        break
      /** ?????????????????? */
      case 'orgstructure':
        dispatch({
          type: [
            OrgStructureModel.namespace,
            OrgStructureModel.reducers.updateDatas
          ].join('/'),
          payload: {
            showStructure: true
          }
        })
        break

      default:
        // ?????????????????????

        this.seeMapAuthority(e)

        this.setState({
          is_disabled: true
        })
        for (let val of currentUserOrganizes) {
          if (key === val['id']) {
            localStorage.setItem('currentSelectOrganize', JSON.stringify(val))
            // dispatch({
            //     type: 'technological/updateDatas',
            //     payload: {
            //         currentSelectOrganize: val
            //     }
            // })
            dispatch({
              type: 'technological/changeCurrentOrg',
              payload: {
                org_id: val.id,
                routingJumpPath: '/technological/simplemode/home',
                isNeedRedirectHash: false
              }
            })
            dispatch({
              type: 'simplemode/updateDatas',
              payload: {
                simplemodeCurrentProject: {}
              }
            })
            break
          }
        }
        dispatch({
          type: 'technological/updateDatas',
          payload: {
            is_all_org: false,
            is_show_org_name: is_show_org_name ? true : false
          }
        })
        break
    }
  }

  //??????????????????
  setGlobalSearchModalVisible() {
    const { dispatch } = this.props
    dispatch({
      type: 'globalSearch/updateDatas',
      payload: {
        globalSearchModalVisible: true
      }
    })
  }
  openPayUpgradeModal = e => {
    e.stopPropagation()
    window.open(PAYUPGRADEURL)
    return
    this.setState({
      payUpgradeModalVisible: true
    })
    this.props.dropdownHandleVisibleChange(false)
  }

  setPayUpgradeModalVisible = visible => {
    this.setState({
      payUpgradeModalVisible: visible
    })
  }
  // ?????????????????????
  logout(e) {
    const { dispatch } = this.props
    const modal = Modal.confirm()
    modal.update({
      title: '?????????????????????',
      okText: '??????',
      // zIndex: 2000,
      getContainer: () => document.getElementById('technologicalLayoutWrapper'),
      onOk() {
        dispatch({
          type: 'technological/logout',
          payload: {}
        })
      },
      cancelText: '??????',
      onCancel: () => {
        modal.destroy()
      }
    })
  }

  // ????????????????????????
  handleShowAllOrg(checked) {
    const { dispatch, is_show_org_name, is_all_org } = this.props
    const { is_disabled } = this.state
    dispatch({
      type: 'technological/updateDatas',
      payload: {
        is_show_org_name: !is_show_org_name
      }
    })
    dispatch({
      type: 'technological/getSetShowOrgName',
      payload: {
        preference_show_org_name: is_all_org && checked ? '1' : '0'
      }
    })
  }

  // ????????????????????????
  handleMode(model) {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/setShowSimpleModel',
      payload: {
        is_simple_model: model
      }
    })
  }

  /** ??????????????????????????????????????? */
  WillexpireRender = value => {
    const { payment_end_date, payment_is_expired, payment_mark } = value
    /** ???????????? */
    const text =
      payment_mark === OrgPaymentMark.trial
        ? '??????'
        : payment_mark === OrgPaymentMark.pay
        ? '??????'
        : ''
    /** ???????????? */
    const timeStep = Math.ceil(
      Math.abs(moment(+(payment_end_date + '000')).diff(moment(), 'days', true))
    )
    if (payment_is_expired === 'true') return <span>{text}?????????</span>
    if (timeStep > this.expireMaxTimeShow) return null
    /** ??????????????? */
    const isSameToday = moment().isSame(
      moment(+(payment_end_date + '000')),
      'day'
    )
    return (
      <span>
        ???{text}??????: {!isSameToday ? timeStep + '???' : '????????????'}
      </span>
    )
  }

  /** ??????Vip?????? */
  VipIconRender = val => {
    const { payment_is_expired, payment_mark } = val
    if (payment_is_expired === 'false' && payment_mark === OrgPaymentMark.pay) {
      return (
        <span className={indexStyles.vip} title="???????????????">
          V
        </span>
      )
    }
    return null
  }

  /** ????????????????????????????????? */
  OrgUserTypeRender = type => {
    switch (type) {
      case OrgUserType.visitor:
        return (
          <Tooltip title="??????">
            <span
              className={`${globalStyles.authTheme} ${indexStyles.user_type}`}
              onClick={e => e.stopPropagation()}
            >
              &#xe854;
            </span>
          </Tooltip>
        )
      case OrgUserType.manager:
        return (
          <Tooltip title="?????????">
            <span
              className={`${globalStyles.authTheme} ${indexStyles.user_type}`}
              onClick={e => e.stopPropagation()}
            >
              &#xe8b7;
            </span>
          </Tooltip>
        )
      default:
        return null
    }
  }

  render() {
    //currentUserOrganizes currentSelectOrganize???????????????????????????
    const {
      menuList = [],
      naviHeadTabIndex = {},
      currentUserOrganizes = [],
      currentSelectOrganize = {},
      is_show_org_name,
      is_all_org,
      is_show_simple
    } = this.props
    const { collapsed, is_disabled } = this.state
    const {
      current_org = {},
      name,
      avatar,
      user_set = {}
    } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { is_simple_model } = user_set
    const { identity_type } = current_org //???????????? 1?????? 0???
    const orgnizationName =
      currentSelectOrganize.name ||
      currentNounPlanFilterName(ORGANIZATION, this.props.currentNounPlan)
    const { logo, id } = currentSelectOrganize

    //??????????????????????????????
    const isHasMemberView = () => {
      return checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_QUERY)
    }

    //??????????????????????????????
    const isHasManagerBack = () => {
      let flag = false
      if (
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_EDIT) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_CREATE) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_EDIT) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_DELETE)
      ) {
        flag = true
      }
      return flag
    }

    return (
      <div className={`${globalStyles.global_card} ${indexStyles.menuWrapper}`}>
        <div className={indexStyles.nav_tabs}>
          {/* ???????????? */}
          {(identity_type === OrgUserType.manager ||
            identity_type === OrgUserType.normal) &&
            isHasMemberView() && (
              <div
                className={indexStyles.default_select_setting}
                onClick={this.handleOrgListMenuClick.bind(this, {
                  key: 'orgstructure'
                })}
              >
                <div className={indexStyles.team}>
                  <div
                    className={`${globalStyles.authTheme} ${indexStyles.team_icon}`}
                  >
                    <img
                      src={require('../../../../../../assets/workbench/home/icon_team.png')}
                      alt="orgstructure"
                    />
                  </div>
                  <div className={indexStyles.middle_text}>????????????</div>
                </div>
              </div>
            )}

          {/* ???????????? */}
          {(identity_type === OrgUserType.manager ||
            identity_type === OrgUserType.normal) &&
            isHasManagerBack() && (
              <div
                className={indexStyles.default_select_setting}
                onClick={this.handleOrgListMenuClick.bind(this, { key: '23' })}
              >
                <div className={indexStyles.bank}>
                  <div
                    className={`${globalStyles.authTheme} ${indexStyles.bank_icon}`}
                  >
                    <img
                      src={require('../../../../../../assets/workbench/home/icon_manage.png')}
                      alt="team"
                    />
                  </div>
                  <span className={indexStyles.middle_text}>????????????</span>
                </div>
              </div>
            )}

          {/* ???????????? */}
          {(identity_type === OrgUserType.manager ||
            identity_type === OrgUserType.normal) &&
            checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD) && (
              <div
                className={indexStyles.default_select_setting}
                onClick={this.handleOrgListMenuClick.bind(this, { key: '22' })}
              >
                <div className={indexStyles.addUsers}>
                  <div
                    className={`${globalStyles.authTheme} ${indexStyles.add_icon}`}
                  >
                    <img
                      src={require('../../../../../../assets/workbench/home/icon_addtoteam.png')}
                      alt="team"
                    />
                  </div>
                  <span className={indexStyles.middle_text}>
                    ??????
                    {currentNounPlanFilterName(
                      MEMBERS,
                      this.props.currentNounPlan
                    )}
                  </span>
                </div>
              </div>
            )}

          {/* ???????????? */}
          <div
            className={indexStyles.default_select_setting}
            onClick={this.handleOrgListMenuClick.bind(this, { key: '20' })}
          >
            <div className={indexStyles.account_setting}>
              <div className={indexStyles.left_img}>
                <Avatar src={avatar} size={40} icon="user" />
              </div>
              <div className={indexStyles.middle_text}>????????????</div>
            </div>
          </div>

          {/* ?????? */}
          <div
            id="default_select_setting"
            className={indexStyles.default_select_setting}
            onClick={this.handleOrgListMenuClick.bind(this, {
              key: 'subInfoSet'
            })}
          >
            <div className={indexStyles.hobby}>
              <div
                className={`${globalStyles.authTheme} ${indexStyles.hobby_icon}`}
              >
                <img
                  src={require('../../../../../../assets/workbench/home/icon_notification.png')}
                  alt="tz"
                />
              </div>
              <div className={indexStyles.middle_text}> ??????</div>
              {/* <span><Icon type="right" /></span> */}
            </div>
          </div>

          {/* ????????? */}
          <div className={indexStyles.default_select_setting}>
            <div
              className={indexStyles.itemDiv}
              onClick={this.handleOrgListMenuClick.bind(this, {
                key: '10'
              })}
            >
              <div>
                <img
                  src={require('../../../../../../assets/workbench/home/icon_newteam.png')}
                  alt="tz"
                />
              </div>
              <div>?????????</div>
            </div>
          </div>

          {/* ???????????? */}
          {(identity_type === OrgUserType.manager ||
            identity_type === OrgUserType.normal) &&
            isHasManagerBack() && (
              <div
                className={indexStyles.default_select_setting}
                onClick={e => {
                  this.openPayUpgradeModal(e)
                }}
              >
                <div>
                  <div>
                    <img
                      src={require('../../../../../../assets/workbench/home/icon_vip_big.png')}
                      alt="team"
                    />
                  </div>
                  <div className={indexStyles.middle_text}>????????????</div>
                </div>
              </div>
            )}

          {/* ???????????? */}
          <div
            className={indexStyles.default_select_setting}
            onClick={this.handleOrgListMenuClick.bind(this, { key: '-1' })}
          >
            <div className={indexStyles.itemDiv}>
              <div>
                <img
                  src={require('../../../../../../assets/workbench/home/icon_exit.png')}
                  alt="tz"
                />
              </div>
              <div>????????????</div>
            </div>
          </div>
        </div>

        {/* <Menu
          onClick={this.handleOrgListMenuClick.bind(this)}
          selectable={true}
          style={{ borderRadius: '8px' }}
          mode={!collapsed ? 'vertical' : 'inline'}
        >
          {identity_type == '1' && isHasMemberView() && (
            <Menu.Item key="24">
              <div className={indexStyles.default_select_setting}>
                <div className={indexStyles.team}>
                  <div
                    className={`${globalStyles.authTheme} ${indexStyles.team_icon}`}
                  >
                    &#xe7af;
                  </div>
                  <span className={indexStyles.middle_text}>
                    ??????
                    {currentNounPlanFilterName(
                      MEMBERS,
                      this.props.currentNounPlan
                    )}
                  </span>
                </div>
              </div>
            </Menu.Item>
          )}

          {identity_type == '1' && isHasManagerBack() && (
            <Menu.Item key="23">
              <div className={indexStyles.default_select_setting}>
                <div className={indexStyles.bank}>
                  <div
                    className={`${globalStyles.authTheme} ${indexStyles.bank_icon}`}
                  >
                    &#xe719;
                  </div>
                  <span className={indexStyles.middle_text}>
                    {currentNounPlanFilterName(
                      ORGANIZATION,
                      this.props.currentNounPlan
                    )}
                    ????????????
                  </span>
                  <div
                    className={indexStyles.payUpgrade}
                    onClick={e => {
                      this.openPayUpgradeModal(e)
                    }}
                  >
                    ????????????
                  </div>
                </div>
              </div>
            </Menu.Item>
          )}

          {identity_type == '1' &&
            checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD) && (
              <Menu.Item key="22">
                <div className={indexStyles.default_select_setting}>
                  <div className={indexStyles.addUsers}>
                    <div
                      className={`${globalStyles.authTheme} ${indexStyles.add_icon}`}
                    >
                      &#xe7ae;
                    </div>
                    <span className={indexStyles.middle_text}>
                      ??????
                      {currentNounPlanFilterName(
                        MEMBERS,
                        this.props.currentNounPlan
                      )}
                      ??????
                    </span>
                  </div>
                </div>
              </Menu.Item>
            )}

          {identity_type == '1' && <Menu.Divider />}

          <Menu.Item key="20">
            <div className={indexStyles.default_select_setting}>
              <div className={indexStyles.account_setting}>
                {avatar ? (
                  <span className={indexStyles.left_img}>
                    <img src={avatar} className={indexStyles.avartarImg} />
                  </span>
                ) : (
                  ''
                )}
                <span className={indexStyles.middle_text}>????????????</span>
              </div>
            </div>
          </Menu.Item>

          <SubMenu
            key="21"
            title={
              <div
                id="default_select_setting"
                className={indexStyles.default_select_setting}
              >
                <div className={indexStyles.hobby}>
                  <span
                    className={`${globalStyles.authTheme} ${indexStyles.hobby_icon}`}
                    style={{ fontSize: 20 }}
                  >
                    &#xe783;
                  </span>
                  <span className={indexStyles.middle_text}> ????????????</span>
                </div>
              </div>
            }
          >
            <Menu.Item key="subInfoSet">
              <span>????????????</span>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="10">
            <div className={indexStyles.itemDiv}>
              <Icon
                type="plus-circle"
                theme="outlined"
                style={{ margin: 0, fontSize: 16 }}
              />{' '}
              ??????????????????
              {currentNounPlanFilterName(
                ORGANIZATION,
                this.props.currentNounPlan
              )}
            </div>
          </Menu.Item>
          <Menu.Item key="-1">
            <div className={indexStyles.itemDiv}>
              <i
                className={`${globalStyles.authTheme} ${indexStyles.layout_icon}`}
                style={{ margin: 0, fontSize: 16 }}
              >
                &#xe78c;
              </i>{' '}
              ????????????
            </div>
          </Menu.Item>
          <Menu.Divider />
        </Menu> */}
        <Divider />

        <div>
          <Menu
            className={`${globalStyles.global_vertical_scrollbar}`}
            style={{ maxHeight: 350, overflowY: 'auto' }}
            selectedKeys={id ? [id] : ['0']}
            onClick={this.handleOrgListMenuClick.bind(this)}
            selectable={true}
            mode="vertical"
          >
            {currentUserOrganizes && currentUserOrganizes.length == 1 ? null : (
              <Menu.Item key="0" className={indexStyles.org_name}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={linxiLogo} className={indexStyles.org_img} />
                  <span
                    style={{
                      maxWidth: 100,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    ??????
                    {currentNounPlanFilterName(
                      ORGANIZATION,
                      this.props.currentNounPlan
                    )}
                  </span>
                </div>
              </Menu.Item>
            )}
            {currentUserOrganizes.map((value, key) => {
              /** ??????????????????????????? */
              const checked = currentSelectOrganize.id === value.id
              const { name, id, identity_type, logo } = value
              return (
                <Menu.Item key={id} className={indexStyles.org_name}>
                  {/* <Tooltip placement="top" title={name}> */}
                  <div
                    id={checked ? 'org_selected' : ''}
                    title={name}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <div className={indexStyles.org_avatar}>
                      <img
                        src={logo || linxiLogo}
                        className={indexStyles.org_img}
                      />
                      {this.VipIconRender(value)}
                    </div>
                    <div
                      style={{
                        maxWidth: '70%'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {name}
                      </div>
                      <div className={indexStyles.subTitle}>
                        {this.WillexpireRender(value)}
                      </div>
                    </div>
                  </div>
                  {/* </Tooltip> */}
                  {this.OrgUserTypeRender(value.identity_type)}
                </Menu.Item>
              )
            })}
          </Menu>
        </div>
        <Suspense fallback={''}>
          {/** ?????????????????? */}
          <CreateOrganizationModal
            dispatch={this.props.dispatch}
            createOrganizationVisable={this.state.createOrganizationVisable}
            setCreateOrgnizationOModalVisable={this.setCreateOrgnizationOModalVisable.bind(
              this
            )}
          />

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

          {this.state.NotificationSettingsModalVisible && (
            <NotificationSettingsModal
              notificationSettingsModalVisible={
                this.state.NotificationSettingsModalVisible
              }
              setNotificationSettingsModalVisible={this.setNotificationSettingsModalVisible.bind(
                this
              )}
            />
          )}
          {/* {this.state.payUpgradeModalVisible && (
            <PayUpgrade
              setPayUpgradeModalVisible={this.setPayUpgradeModalVisible}
            />
          )} */}
        </Suspense>
      </div>
    )
  }
}
function mapStateToProps({
  technological: {
    datas: {
      menuList = [],
      naviHeadTabIndex = {},
      currentUserOrganizes = [],
      currentSelectOrganize = {},
      is_show_org_name,
      is_all_org,
      is_show_simple,
      userOrgPermissions
    }
  },
  organizationManager: {
    datas: { currentNounPlan }
  },
  [OrgStructureModel.namespace]: { showStructure }
}) {
  return {
    currentNounPlan,
    menuList,
    naviHeadTabIndex,
    currentUserOrganizes,
    currentSelectOrganize,
    is_show_org_name,
    is_all_org,
    is_show_simple,
    userOrgPermissions,
    showStructure
  }
}
