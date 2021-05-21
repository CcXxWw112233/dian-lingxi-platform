import React, { Component, lazy, Suspense, useState } from 'react'
import styles from './rolemembertable.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import dva, { connect } from 'dva'
import { OrgStructureModel } from '../../../../../../../models/technological/orgStructure'
import {
  Avatar,
  Dropdown,
  Select,
  Cascader,
  message,
  Modal,
  Button
} from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import {
  discontinueMember,
  getTransferSelectedList,
  getGroupList
} from '../../../../../../../services/technological/organizationMember'
import { isApiResponseOk } from '../../../../../../../utils/handleResponseData'
import {
  checkIsHasPermission,
  currentNounPlanFilterName
} from '../../../../../../../utils/businessFunction'
import {
  MaxZIndex,
  MEMBERS,
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  ORG_UPMS_ORGANIZATION_MEMBER_REMOVE
} from '../../../../../../../globalset/js/constant'
const TreeRemoveOrgMemberModal = lazy(() =>
  import(
    '@/routes/Technological/components/OrganizationMember/TreeRemoveOrgMemberModal'
  )
)
const TreeGroupModal = lazy(() =>
  import('@/routes/Technological/components/OrganizationMember/TreeGroupModal')
)

const getEffectOrReducerByName = name => `organizationMember/${name}`

const { Option } = Select

@connect(
  ({
    [OrgStructureModel.namespace]: { orgMembersList, currentOrgTagList },
    projectDetail: {
      datas: { projectDetailInfoData = {} }
    },
    technological: {
      datas: { correspondingOrganizationMmembersList = [] }
    }
  }) => ({
    orgMembersList,
    currentOrgTagList,
    projectDetailInfoData,
    correspondingOrganizationMmembersList
  })
)
/** 组织架构的右侧成员列表
 * @description 用于展示组织架构成员列表
 */
export default class RoleMemberTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchList: [],
      /**
       * 是否展示检索匹配标签列表
       */
      isShowSearch: false,
      currentTag: '',
      inputValue: '',
      isconfirmCurrentTag: false
    }
  }
  componentDidMount() {
    this.getMemberTagList()
  }
  /**
   * 添加成员
   * @returns
   */
  addRoleMenber() {
    console.log('添加成员')
    this.props.addRoleMember()
  }

  /**
   * 获取输入框的内容 根据输入的内容检索列表
   * @param {*} e
   */
  getPrintTagKey = e => {
    var { currentOrgTagList } = this.props
    var searchList =
      currentOrgTagList &&
      currentOrgTagList.filter(item => {
        return item.name.search(e.target.value) != -1
      })

    this.setState({
      searchList: searchList,
      isShowSearch: true,
      isconfirmCurrentTag: false,
      currentTag: e.target.value
    })
  }
  /**
   * 获取组织标签列表
   * @param {*} e
   */
  getMemberTagList() {
    const { dispatch, org_id } = this.props
    dispatch({
      type: [OrgStructureModel.namespace, 'getMemberTagList'].join('/'),
      payload: {
        org_id: org_id
      }
    })
  }
  /**
   * 为成员打标签
   * @param {*} e
   */
  addRoleMenberTag(item) {
    const { dispatch } = this.props
    const { currentMemberId, currentLableID } = this.state
    if (currentLableID == item.id) {
      this.deleteRelaMemberTag()
    } else {
      dispatch({
        type: [OrgStructureModel.namespace, 'addRoleMenberTag'].join('/'),
        payload: {
          label_id: item.id,
          member_id: currentMemberId
        }
      }).then(res => {
        this.props.getRolePermissionsAndMenber()
        this.setState({
          isconfirmCurrentTag: true,
          // moreVisible:false,
          currentLableID: item.id,
          currentTag: item.name,
          
          isShowSearch: false
        })
      })
    }
  }
  /**
   * 移除成员标签
   */
  deleteRelaMemberTag() {
    const { dispatch } = this.props
    const { currentMemberId, currentLableID } = this.state
    dispatch({
      type: [OrgStructureModel.namespace, 'deleteRelaMemberTag'].join('/'),
      payload: {
        label_id: currentLableID,
        member_id: currentMemberId
      }
    }).then(() => {
      this.props.getRolePermissionsAndMenber()
      this.setState({
        isconfirmCurrentTag: true,
        currentLableID: '',
        currentTag: '',
        isShowSearch: false
      })
    })
  }

  /**
   * 获取输入框的内容 回车键
   * @param {*} e
   */
  enterPrintTagKey = e => {
    this.addMenberTag()
  }
  /**
   * 添加标签
   */
  addMenberTag() {
    const { currentSelectValue } = this.state

    const { dispatch, role_id, org_id } = this.props
    if (currentSelectValue) {
      dispatch({
        type: [OrgStructureModel.namespace, 'addNewMemberTag'].join('/'),
        payload: {
          org_id: org_id,
          name: currentSelectValue,
          color: ''
        }
      }).then(res => {
        this.addRoleMenberTag(res)
      })
    }
    this.setState({
      isconfirmCurrentTag: true,
      isShowSearch: false
      // currentTag: '',
    })
  }
  /**
   * 组件卸载
   */
  componentWillUnmount() {
    this.setState({
      searchList: [],
      isShowSearch: false
    })
  }
  /**删除标签 */
  deleteTag = (e, item) => {
    e.stopPropagation()
    const { dispatch } = this.props
    dispatch({
      type: [OrgStructureModel.namespace, 'deleteMemberTag'].join('/'),
      payload: {
        id: item.id
      }
    })
  }

  onSearch(value) {
    if(value && value.length > 0) {
      var { currentOrgTagList } = this.props
      var searchList =
        currentOrgTagList &&
        currentOrgTagList.filter(item => {
          return item.name.search(value) != -1
        })
      this.setState({
        searchList: searchList,
        isShowSearch: true,
        currentSelectValue: value
      })
    } else {
      this.setState({
        searchList: [],
        isShowSearch: false,
        currentSelectValue: value
      })
    }
   
  }
  onBlur(value) {
    console.log(`selected onBlur${value}`)
    if (value == '' || !value) {
      this.deleteRelaMemberTag()
    }
  }
  /**
   * 渲染添加标签弹窗
   */
  overlayAddMember(currentOrgTagList) {
    const {
      list,
      searchList,
      isShowSearch,
      currentTag,
      currentSelectValue,
      currentName
    } = this.state
    console.log(currentOrgTagList)
    return (
      <div className={styles.add_member_tag}>
        <span className={styles.add_member_title}>
          给“{currentName}”添加标签
        </span>
        <Select
          placeholder="输入创建新标签"
          showSearch
          allowClear
          style={{ color: '#212434', width: '100%' }}
          open={true}
          onBlur={this.onBlur.bind(this)}
          onSearch={this.onSearch.bind(this)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          dropdownStyle={{ border: 'none' }}
          dropdownRender={menu => {
            return (
              <div
                className={styles.add_member_tagList}
                style={{
                  overflowY: 'auto',
                  position: 'relative'
                }}
              >
                {currentOrgTagList &&
                  currentOrgTagList.map((item, key) => {
                    return (
                      <>
                        <div
                          className={`${styles.add_member_tag_item} ${
                            item.name == currentTag
                              ? styles.role_member_currentTag
                              : ''
                          }`}
                          onClick={this.addRoleMenberTag.bind(this, item)}
                        >
                          {item.name}
                          <div
                            className={`${styles.role_member_tag_delete_icon}`}
                            onClick={e => this.deleteTag(e, item)}
                          >
                            <div
                              className={`${styles.role_member_delete_icon} ${globalStyles.authTheme}`}
                            >
                              &#xe816;
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })}
                {isShowSearch && this.overlaySearchTag(searchList)}
              </div>
            )
          }}
        ></Select>
      </div>
    )
  }
  /**
   * 输入关键字检索出来的标签列表
   * @param {*} searchList  检索出来的标签数组
   * @returns
   */
  overlaySearchTag(searchList) {
    const { currentSelectValue } = this.state
    return (
      <div className={styles.add_member_tag_search}>
        {searchList && searchList.length > 0 ? (
          <div
            className={styles.add_member_tagList}
            style={{
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            {searchList.map((item, key) => {
              return (
                <div
                  className={styles.add_member_tag_item}
                  onClick={this.addRoleMenberTag.bind(this, item)}
                >
                  {item.name}
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className={styles.add_member_tag_creat}
            onClick={this.addMenberTag()}
          >
            {'创建新标签“' + currentSelectValue + '”'}
          </div>
        )}
      </div>
    )
  }

  /**
   * 是否展示标签下拉弹窗
   * @param {*} visible
   */
  handleVisibleChange = (visible, user_id) => {
    this.setState({
      moreVisible: visible
    })
  }
  /**
   * 点击标签 确认选择哪一条数据
   * @param {*} item
   */
  selectMember = item => {
    console.log(item)
    const { currentOrgTagList } = this.props
    var item_Tag = []
    if (item.label_id) {
      item_Tag = currentOrgTagList.filter(value => {
        return value.id == item.label_id[0]
      })
    }

    this.setState({
      currentTag: item_Tag.length > 0 ? item_Tag[0].name : '',
      currentName: item.name,
      currentUserId: item.user_id,
      currentMemberId: item.member_id,
      currentOrgID: item.org_id,
      currentLableID: item.label_id ? item.label_id[0] : ''
    })
  }
  /**
   * 移除成员
   */
  moveUserOut() {
    const { org_id } = this.props
    const { currentUserId, currentOrgID } = this.state
    this.getGroupList(org_id)
    this.getTransferSelectedList(currentUserId, org_id)
  }

  onCascaderChange = value => {
    const { dispatch } = this.props
    const { currentMemberId } = this.state
    if (value.length > 1) {
      dispatch({
        type: 'organizationMember/setMemberRole',
        payload: {
          group_id: value[0],
          member_id: currentMemberId,
          role_id: value[value.length - 1]
        }
      }).then(() => {
        this.props.getRolePermissionsAndMenber()
      })
    }
  }
  cancelCascaderChange = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'organizationMember/updateDatas',
      payload: {
        TreeGroupModalVisiblie: value.TreeGroupModalVisiblie
      }
    })
    this.props.getRolePermissionsAndMenber()
  }
  /**
   * 移动至 下拉框
   * @returns
   */
  overlayRoleMenberMore() {
    const { orglist } = this.state
    const { data } = this.props
    const [visible, setCascaderVisible] = useState(false)
    return (
      <div className={styles.roleMenberMore} id="roleMenberMore">
        <div
          className={`${styles.roleMenberMore_item} ${styles.roleMenber_moveOut}`}
          onClick={this.moveUserOut.bind(this)}
        >
          移出组织
        </div>
        <div>
          <Cascader
            options={data}
            className={styles.roleMenberMore_item_cascader}
            popupClassName={styles.roleMenberMore_item_popupClassName}
            expandTrigger="click"
            onChange={this.onCascaderChange}
            // getPopupContainer={triggerNode =>
            //   document.getElementById('roleMenberMore')
            // }
            fieldNames={{
              children: 'roles',
              label: 'role_group_name',
              value: 'id'
            }}
          >
            <div
              className={`${styles.roleMenberMore_item} ${styles.roleMenber_moveTo}`}
            >
              移动至
              <span
                className={`${styles.role_member_detail_icon} ${globalStyles.authTheme}`}
              >
                &#xe7d6;
              </span>
            </div>
          </Cascader>
        </div>
      </div>
    )
  }

  overlayMoveOrg(orglist) {
    return (
      <div className={styles.roleMenberMove}>
        {orglist.map(item => {
          const list = item['list'] || []
          return (
            <div>
              {item['title'] && (
                <div className={styles.roleMenberMove_title}>
                  {item['title']}
                </div>
              )}

              {list.map(value => {
                const data = value['list'] || []
                const title =
                  typeof value == 'string' && value.constructor == String
                    ? value
                    : value['title']
                return (
                  <div>
                    {data && data.length > 0 ? (
                      <Dropdown
                        trigger={['hover']}
                        getPopupContainer={triggerNode =>
                          triggerNode.parentNode
                        }
                        overlay={this.overlayMoveOrg(data)}
                      >
                        <div className={styles.roleMenberMove_detail}>
                          <div className={styles.roleMenberMove_detail_left}>
                            <span
                              className={`${styles.role_member_current_icon} ${globalStyles.authTheme}`}
                            >
                              &#xe7fc;
                            </span>
                            <div className={styles.roleMenberMove_name}>
                              {title}
                            </div>
                          </div>
                          <span
                            className={`${styles.role_member_detail_icon} ${globalStyles.authTheme}`}
                          >
                            &#xe7d6;
                          </span>
                        </div>
                      </Dropdown>
                    ) : (
                      <div className={styles.roleMenberMove_detail}>
                        <div className={styles.roleMenberMove_detail_left}>
                          <span
                            className={`${styles.role_member_detail_icon} ${globalStyles.authTheme}`}
                          >
                            &#xe7fc;
                          </span>
                          <div className={styles.roleMenberMove_name}>
                            {title}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  /**移除成员 */
  setTreeRemoveBoardMemberVisible = () => {
    this.setState({
      TreeRemoveBoardMemberModalVisible: !this.state
        .TreeRemoveBoardMemberModalVisible
    })
  }
  // 获取组织成员列表
  getGroupList = currentOrgID => {
    getGroupList({ _organization_id: currentOrgID }).then(res => {
      if (isApiResponseOk(res)) {
        let data = []
        res.data.data.forEach(item => {
          if (item.members && item.members.length) {
            data.push(...item.members)
          }
        })

        this.setState({
          orgMembersData: data
        })
      }
    })
  }
  // 根据不同的类型获取不同的成员列表
  getMembersList = (props, orgData = []) => {
    const {
      projectDetailInfoData: { board_id, org_id, data: boardData },
      correspondingOrganizationMmembersList = []
    } = this.props
    const {
      itemValue: {
        field_content: {
          field_set: { member_selected_range }
        }
      }
    } = this.state
    switch (member_selected_range) {
      case '1': // 表示当前组织
        // membersData = [...orgData]
        this.setState({
          orgMembersData: correspondingOrganizationMmembersList.map(item => {
            let new_item = { ...item }
            new_item = {
              ...item,
              user_id: item.id
            }
            return new_item
          })
        })
        break
      case '2': // 表示项目
        // membersData = [...boardData]
        this.setState({
          boardMembersData: boardData
        })
        break
      default:
        break
    }
  }

  // 获取移出成员后的交接列表
  getTransferSelectedList = (remove_id, member_id) => {
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
  discontinueMember = member_id => {
    var that = this
    discontinueMember({ member_id }).then(res => {
      that.props.getRolePermissionsAndMenber()
    })
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
  handleMoreVisibleChange = value => {
    this.setState({
      handleMoreVisible: value
    })
  }

  renderMoreHandle = ({ member, tags, canHandle }) => {
    const [visible, setVisible] = useState(false)
    const [tagsVisible, setTagsVisible] = useState(false)
    const { currentOrgTagList = [] } = this.props
    return (
      <div
        className={styles.role_member_item}
        onClick={this.selectMember.bind(this, member)}
      >
        <div className={styles.role_member_contant}>
          <Dropdown
            trigger={['click']}
            disabled={!canHandle}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onVisibleChange={visible => {
              setVisible(visible)
              setTagsVisible(false)
            }}
            visible={visible}
            overlay={this.overlayRoleMenberMore()}
          >
            <div className={`${styles.role_member_icon}`}>
              <span
                className={`${styles.role_member_delete_icon} ${globalStyles.authTheme}`}
              >
                &#xe855;
              </span>
            </div>
          </Dropdown>
          {member.avatar ? (
            <Avatar
              className={`${styles.role_member_avatar}`}
              src={member.avatar}
              size={25}
            />
          ) : (
            <Avatar
              className={`${styles.role_member_avatar}`}
              size={25}
              icon="user"
            />
          )}
          <span className={`${styles.role_member_title}`}>{member.name}</span>
        </div>
        <Dropdown
          trigger={['click']}
          disabled={!canHandle}
          getPopupContainer={triggerNode =>
            document.getElementById('RoleMemberTable_wrapper')
          }
          onVisibleChange={visible => {
            setTagsVisible(visible)
          }}
          visible={tagsVisible}
          // overlayClassName={styles.add_member_tag}
          overlay={this.overlayAddMember(currentOrgTagList)}
        >
          <div className={styles.role_member_tag}>
            {tags.length > 0 ? tags[0].name : '标签'}
          </div>
        </Dropdown>
      </div>
    )
  }

  render() {
    const {
      orgMembersList = [],
      currentOrgTagList = [],
      canHandle
    } = this.props
    const { currentUserId, orgMembersData } = this.state
    console.log('sssssssssssss', orgMembersData)
    return (
      <div
        className={`${styles.role_member}`}
        style={{
          overflowY: 'auto',
          position: 'relative'
        }}
        id={'RoleMemberTable_wrapper'}
      >
        {orgMembersList.map((item, key) => {
          const { label_id = [] } = item
          const item_Tag = currentOrgTagList.filter(value => {
            return value.id == label_id[0]
          })
          return (
            <this.renderMoreHandle
              key={item.user_id}
              member={item}
              tags={item_Tag}
              canHandle={canHandle}
            />
          )
        })}
        <TreeRemoveOrgMemberModal />
        {/* <TreeGroupModal
          updateDatas={value => this.cancelCascaderChange(value)}
        ></TreeGroupModal> */}

        {(!orgMembersList || orgMembersList.length == 0) && canHandle && (
          <Button
            className={styles.add_role_member}
            type="primary"
            onClick={() => this.addRoleMenber()}
          >
            添加成员
          </Button>
        )}
      </div>
    )
  }
}
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
