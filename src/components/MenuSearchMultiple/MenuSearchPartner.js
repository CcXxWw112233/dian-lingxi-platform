import React from 'react'
// import MenuSearchStyles from './MenuSearch.less'
import { Input, Menu, Spin, Icon, message } from 'antd'
import indexStyles from './MenuSearchPartner.less'
import ShowAddMenberModal from '../../routes/Technological/components/Project/ShowAddMenberModal'
import {
  checkIsHasPermissionInBoard,
  getOrgIdByBoardId
} from '../../utils/businessFunction'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_BOARD_MEMBER
} from '@/globalset/js/constant'
import { isApiResponseOk } from '../../utils/handleResponseData'
import {
  organizationInviteWebJoin,
  commInviteWebJoin
} from '../../services/technological/index'
import { connect } from 'dva'
import globalStyles from '@/globalset/css/globalClassName.less'
import { validateTel } from '@/utils/verify'
import { isArrayEqual } from '../../utils/util'

@connect(mapStateToProps)
export default class MenuSearchPartner extends React.Component {
  state = {
    resultArr: [],
    keyWord: '',
    selectedKeys: []
  }
  initSet = props => {
    // const { keyWord } = this.state
    // const { listData, searchName, selectedKeys = [] } = this.props
    // this.setState({
    //     resultArr: this.fuzzyQuery(listData, searchName, keyWord),
    //     selectedKeys
    // }, () => {
    //     this.setState({
    //         resultArr: this.fuzzyQuery(listData, searchName, keyWord)
    //     })
    // })
    const { keyWord } = this.state
    let selectedKeys = []
    const { listData = [], searchName, currentSelect = [] } = props
    if (!Array.isArray(currentSelect)) return false
    for (let val of currentSelect) {
      selectedKeys.push(val['user_id'])
    }
    this.setState(
      {
        selectedKeys
      },
      () => {
        this.setState({
          resultArr: this.fuzzyQuery(listData, searchName, keyWord)
        })
      }
    )
  }
  componentDidMount() {
    this.initSet(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if (
      isArrayEqual(nextProps.currentSelect, this.props.currentSelect) &&
      isArrayEqual(nextProps.listData, this.props.listData)
    )
      return
    this.initSet(nextProps)
  }
  //????????????
  handleMenuReallySelect = e => {
    this.setSelectKey(e, 'add')
  }
  handleMenuReallyDeselect(e) {
    this.setSelectKey(e, 'remove')
  }
  setSelectKey(e, type) {
    const { key, selectedKeys } = e
    if (!key) {
      return false
    }
    this.setState(
      {
        selectedKeys
      },
      () => {
        const { listData = [], searchName, single } = this.props
        const { keyWord } = this.state
        if (!single) {
          //???????????????
          this.setState({
            resultArr: this.fuzzyQuery(listData, searchName, keyWord)
          })
        }
      }
    )
    this.props.chirldrenTaskChargeChange &&
      this.props.chirldrenTaskChargeChange({ selectedKeys, key, type })
  }
  onCheck() {
    if (this.props.onCheck && typeof this.props.onCheck === 'function') {
      this.props.onCheck(this.state.selectedKeys)
    }
  }
  fuzzyQuery = (list, searchName, keyWord) => {
    // var arr = [];
    // for (var i = 0; i < list.length; i++) {
    // 	if (list[i][searchName].indexOf(keyWord) !== -1) {
    // 		arr.push(list[i]);
    // 	}
    // }
    let arr = []
    if (!!keyWord) {
      arr = list.filter(
        (item, index) => list[index][searchName].indexOf(keyWord) !== -1
      )
    } else {
      arr = list
    }
    // ????????????????????????
    const { not_allow_sort_list } = this.props
    if (!not_allow_sort_list) {
      //????????????????????????????????????
      const { selectedKeys } = this.state
      for (let i = 0; i < arr.length; i++) {
        if (selectedKeys.indexOf(arr[i]['user_id']) != -1) {
          if (i > 0 && selectedKeys.indexOf(arr[i - 1]['user_id']) == -1) {
            const deItem = arr.splice(i, 1)
            arr.unshift(...deItem)
          }
        }
      }
    }
    return arr
  }
  onChange = e => {
    const { listData = [], searchName } = this.props
    const keyWord = e.target.value
    const resultArr = this.fuzzyQuery(listData, searchName, keyWord)
    if (validateTel(keyWord)) {
      this.setState({
        showUserDefinedIconVisible: true
      })
    } else {
      this.setState({
        showUserDefinedIconVisible: false
      })
    }
    this.setState({
      keyWord,
      resultArr
    })
  }
  addMenbersInProject = data => {
    const {
      invitationType,
      invitationId,
      rela_Condition,
      dispatch,
      board_id
    } = this.props
    const temp_ids = data.users.split(',')
    const invitation_org =
      getOrgIdByBoardId(board_id) || localStorage.getItem('OrganizationId')

    organizationInviteWebJoin({
      _organization_id: invitation_org,
      type: invitationType,
      users: temp_ids
    }).then(res => {
      if (res && res.code === '0') {
        const { users, role_id } = res.data
        commInviteWebJoin({
          id: invitationId,
          role_id: role_id,
          type: invitationType,
          users: users,
          rela_condition: rela_Condition
        }).then(res => {
          if (isApiResponseOk(res)) {
            this.props.inviteOthersToBoardCalback &&
              this.props.inviteOthersToBoardCalback({ users })
            if (invitationType === '4') {
              dispatch({
                type: 'projectDetail/projectDetailInfo',
                payload: {
                  id: board_id
                }
              })
              // dispatch({
              //     type: 'projectDetailTask/getCardDetail',
              //     payload: {
              //         id: invitationId
              //     }
              // })
              dispatch({
                type: 'workbenchTaskDetail/projectDetailInfo',
                payload: {
                  id: board_id
                }
              })
              // dispatch({
              //     type: 'workbenchTaskDetail/getCardDetail',
              //     payload: {
              //         id: board_id,
              //         board_id: board_id,
              //         calback: function (data) {
              //             dispatch({
              //                 type: 'workbenchPublicDatas/getRelationsSelectionPre',
              //                 payload: {
              //                     _organization_id: invitation_org
              //                 }
              //             })
              //         }
              //     }
              // })
            } else if (invitationType === '1') {
              // ??????????????????????????????
              dispatch({
                type: 'projectDetail/projectDetailInfo',
                payload: {
                  id: board_id
                }
              })
              dispatch({
                type: 'workbenchTaskDetail/projectDetailInfo',
                payload: {
                  id: board_id
                }
              })
            } else if (invitationType === '7') {
              dispatch({
                type: 'projectDetail/projectDetailInfo',
                payload: {
                  id: invitationId
                }
              })
            } else if (invitationType === '8') {
              dispatch({
                type: 'projectDetail/projectDetailInfo',
                payload: {
                  id: board_id
                }
              })
              dispatch({
                type: 'projectDetailProcess/getProcessInfo',
                payload: {
                  id: invitationId
                }
              })
              dispatch({
                type: 'workbenchDetailProcess/getProcessInfo',
                payload: {
                  id: board_id
                }
              })
            }
          } else {
            message.warn(res.message, MESSAGE_DURATION_TIME)
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    })
  }
  setShowAddMenberModalVisibile() {
    if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  // ???????????????????????????
  handleSelectedAllBtn = () => {
    const { select_all_type } = this.props
    if (select_all_type == '0') {
      const { resultArr = [], selectedKeys } = this.state
      let arr = resultArr.map(item => item.id || item.user_id)
      // ???????????????????????????????????????????????? ???????????????????????????????????? ?????????????????? ???????????????
      let new_selectedKeys = [...selectedKeys]
      new_selectedKeys = new_selectedKeys.filter(i => i.length != '11') || []
      if (new_selectedKeys.length == resultArr.length) {
        //???????????????????????????
        arr = []
      }
      this.setState(
        {
          selectedKeys: arr
        },
        () => {
          this.props.chirldrenTaskChargeChange &&
            this.props.chirldrenTaskChargeChange({
              selectedKeys: arr,
              type:
                new_selectedKeys.length == resultArr.length ? 'remove' : 'add'
            })
        }
      )
      // debugger
      return
    } else {
      // const { is_selected_all } = this.props
      // const { selectedKeys = [] } = this.state
      // let type = !is_selected_all ? 'add' : 'remove'
      // this.props.dispatch({
      // 	type: 'publicTaskDetailModal/updateDatas',
      // 	payload: {
      // 		is_selected_all: !is_selected_all
      // 	}
      // })
      // this.props.handleSelectedAllBtn && this.props.handleSelectedAllBtn({ selectedKeys, type })
    }
  }

  // ??????????????????????????????????????????
  chgUserDefinedIcon = e => {
    e && e.stopPropagation()
    const { keyWord } = this.state
    const { listData = [], searchName } = this.props
    let new_listData = [...listData]
    const obj = {
      avatar: '',
      id: keyWord,
      mobile: keyWord,
      name: keyWord,
      user_id: keyWord,
      type: 'phone'
    }
    const gold_item = new_listData.find(item => item.mobile == obj.mobile) || {}
    this.setState({
      keyWord: '',
      showUserDefinedIconVisible: false
    })
    if (!!(gold_item && Object.keys(gold_item).length)) {
      message.warn('??????????????????', MESSAGE_DURATION_TIME)
      return false
    }

    this.props.chgUserDefinedIcon && this.props.chgUserDefinedIcon({ obj })
  }

  render() {
    const {
      keyWord,
      resultArr,
      selectedKeys = [],
      showUserDefinedIconVisible
    } = this.state
    let new_selectedKeys = [...selectedKeys]
    // ?????????????????????
    new_selectedKeys = new_selectedKeys.filter(i => i && i.length != '11') || []
    const {
      Inputlaceholder = '??????',
      isInvitation,
      searchName,
      menuSearchSingleSpinning,
      keyCode,
      invitationType,
      invitationOrg,
      invitationId,
      rela_Condition,
      is_selected_all,
      not_show_wechat_invite,
      board_id,
      user_defined_icon,
      show_select_all,
      single
    } = this.props
    // const { Inputlaceholder = '??????', searchName, menuSearchSingleSpinning, keyCode, invitationType, invitationId, rela_Condition, invitationOrg, board_id } = this.props

    return (
      <div>
        <Menu
          style={{
            padding: '8px 0px',
            boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)',
            maxWidth: 200
          }}
          selectedKeys={selectedKeys}
          onDeselect={this.handleMenuReallyDeselect.bind(this)}
          onSelect={this.handleMenuReallySelect}
          multiple={!single}
        >
          <div style={{ margin: '0 10px 10px 10px', position: 'relative' }}>
            <Input
              style={{ paddingRight: showUserDefinedIconVisible && '38px' }}
              placeholder={Inputlaceholder}
              value={keyWord}
              onClick={e => e.target?.focus()}
              onChange={this.onChange.bind(this)}
            />
            {showUserDefinedIconVisible && (
              <span
                onClick={this.chgUserDefinedIcon}
                className={`${globalStyles.authTheme} ${indexStyles.addTelIcon}`}
              >
                {user_defined_icon}
              </span>
            )}
          </div>
          <Menu
            className={globalStyles.global_vertical_scrollbar}
            style={{ maxHeight: '248px', overflowY: 'auto' }}
          >
            {!isInvitation && !this.props.HideInvitationOther && (
              <div
                style={{
                  padding: 0,
                  margin: 0,
                  height: 32,
                  lineHeight: '32px',
                  cursor: 'pointer'
                }}
                onClick={this.setShowAddMenberModalVisibile.bind(this)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 20,
                      // backgroundColor: '&#xe70b;',
                      marginRight: 4,
                      color: 'rgb(73, 155, 230)'
                    }}
                  >
                    <Icon
                      type={'plus-circle'}
                      style={{
                        fontSize: 12,
                        marginLeft: 10,
                        color: 'rgb(73, 155, 230)'
                      }}
                    />
                  </div>
                  <span style={{ color: 'rgb(73, 155, 230)' }}>
                    ??????????????????
                  </span>
                </div>
              </div>
            )}
            {show_select_all && (
              <div
                style={{
                  padding: 0,
                  margin: 0,
                  height: 40,
                  lineHeight: '40px',
                  cursor: 'pointer'
                }}
                className={indexStyles.menuItem}
                onClick={this.handleSelectedAllBtn}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'rgba(230,247,255,1)',
                        borderRadius: '50%',
                        textAlign: 'center',
                        marginRight: '8px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#1890FF',
                          lineHeight: '28px',
                          display: 'block'
                        }}
                        className={`${globalStyles.authTheme}`}
                      >
                        &#xe7af;
                      </span>
                    </div>
                    <span>
                      {new_selectedKeys.length == resultArr.length
                        ? '????????????'
                        : '??????????????????'}
                    </span>
                  </div>
                  <div
                    style={{
                      display:
                        new_selectedKeys.length == resultArr.length
                          ? 'block'
                          : 'none'
                    }}
                  >
                    <Icon type="check" />
                  </div>
                </div>
              </div>
            )}
            {/* ?????????????????? */}

            {resultArr.map((value, key) => {
              const { avatar, name, user_name, user_id } = value
              return (
                <Menu.Item
                  className={`${indexStyles.menuItem}`}
                  style={{
                    height: '40px',
                    lineHeight: '40px',
                    margin: 0,
                    padding: '0 12px'
                  }}
                  key={value[keyCode]}
                >
                  <div className={indexStyles.menuItemDiv}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                      key={user_id}
                    >
                      {avatar ? (
                        <img
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            marginRight: '8px'
                          }}
                          src={avatar}
                        />
                      ) : (
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#f5f5f5',
                            marginRight: '8px',
                            lineHeight: '28px'
                          }}
                        >
                          <Icon
                            type={'user'}
                            style={{ fontSize: 12, color: '#8c8c8c' }}
                          />
                        </div>
                      )}
                      <div
                        style={{
                          overflow: 'hidden',
                          verticalAlign: ' middle',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 90,
                          marginRight: 8
                        }}
                      >
                        {name || user_name || '??????'}
                      </div>
                    </div>
                    <div
                      style={{
                        display:
                          selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none'
                      }}
                    >
                      <Icon type="check" />
                    </div>
                  </div>
                </Menu.Item>
              )
            })}
          </Menu>
        </Menu>

        <ShowAddMenberModal
          // title={titleText}
          board_id={board_id}
          addMenbersInProject={this.addMenbersInProject}
          show_wechat_invite={not_show_wechat_invite ? false : true}
          invitationType={invitationType}
          invitationId={invitationId}
          rela_Condition={rela_Condition}
          invitationOrg={invitationOrg}
          modalVisible={this.state.ShowAddMenberModalVisibile}
          setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(
            this
          )}
        />
      </div>
    )
  }
}

MenuSearchPartner.deafultProps = {
  invitationType: '', //
  invitationId: '',
  invitationOrg: '',
  HideInvitationOther: false, // ?????????????????????????????? ??????false
  listData: [],
  keyCode: '', //??????????????????user_id???
  searchName: '', //???????????????
  currentSelect: [], //??????????????????
  board_id: '',
  not_show_wechat_invite: false, //?????????????????????
  chirldrenTaskChargeChange: function() {},
  is_create_inivite: false, //??????????????????????????????????????????????????????????????????????????????
  inviteOthersToBoardCalback: function() {
    //???????????????????????????
  },
  show_select_all: false, //???????????????????????????
  select_all_type: '0', //0??????????????????key, 1?????????????????????????????????????????????????????????????????????????????????
  single: false, //???????????????????????????
  not_allow_sort_list: false // ??????????????? ????????????
}

function mapStateToProps({
  technological,
  technological: {
    datas: { userBoardPermissions }
  }
}) {
  return {
    technological,
    userBoardPermissions
  }
}
