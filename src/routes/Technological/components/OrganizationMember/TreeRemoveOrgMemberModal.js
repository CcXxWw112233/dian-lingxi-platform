import React, { Component } from 'react'
import { Modal, Icon, Table, Select } from 'antd'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalClassName from '@/globalset/css/globalClassName.less'
import { getTransferSelectedList, getTransferSelectedDetailList } from '../../../../services/technological/organizationMember'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction'
import { PROJECTS, TASKS } from '../../../../globalset/js/constant'
import { removeEmptyArrayEle, arrayNonRepeatfy } from '../../../../utils/util'

const Option = Select.Option;

@connect(mapStateToProps)
export default class TreeRemoveOrgMemberModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hand_over_visible: false, // 是否交接
      transferSelectedList: [], // 获取初始列表
      transferSelectedDetailList: [], // 获取详情交接列表
      currentBoardUsers: [], //获取详情之后对应项目的成员列表
      currentBoardName: '', // 当前选择交接的项目
    }
  }

  // 详细交接点击change事件
  handleOnSelectValue = () => {

  }

  // 如果移除的成员在成员列表中需要过滤
  filterRemoveMember = (removeId, users = []) => {
    let arr = []
    arr = [...users]
    arr = arr.filter(item => item.user_id != removeId)
    return arr
  }

  // 获取表格的参数
  getTableProps = () => {
    const { transferSelectedList = [], transferSelectedDetailList = [], hand_over_visible, currentBoardUsers = [] } = this.state
    const { groupList = [], removeMemberUserId } = this.props
    let temMemberList = arrayNonRepeatfy(this.getOrgMemberWithRemoveVisitors(groupList))
    let filterTemMemberList = this.filterRemoveMember(removeMemberUserId,temMemberList)
    let filterCurrentBoardUsers = this.filterRemoveMember(removeMemberUserId, currentBoardUsers)
    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width: 106,
        render: (text, item) => {
          const { type } = item
          const filed_name = !hand_over_visible ? type == '1' ? `${currentNounPlanFilterName(PROJECTS)}` : '模板' : type == '1' ? item.name : `${currentNounPlanFilterName(TASKS)}`
          return filed_name
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 200,
        render: (text, item) => {
          return text
        }
      },
      {
        title: '交接人',
        dataIndex: 'opetator',
        key: 'opetator',
        ellipsis: true,
        render: (text, item) => {
          const { type, users = [], id } = item
          return <div>
            <span style={{ marginRight: '28px' }}>
              <Select defaultValue={'请选择'} onChange={this.handleOnSelectValue}>
                {
                  users.map(value => {
                    return <Option key={value.user_id}>{value.name}</Option>
                  })
                }
              </Select>
            </span>
            {
              type == '1' && !hand_over_visible && (
                <span onClick={(e) => { this.handleTakeOverVisible(e, id) }} className={indexStyles.detail_tips}>详细交接 &gt;</span>
              )
            }
          </div>
        }
      }
    ]
    const data = hand_over_visible ? transferSelectedDetailList.map(item => {
      let new_item = {...item}
      new_item = {...item, users: filterCurrentBoardUsers}
      return new_item
    }) : transferSelectedList.map(item => {
      let new_item = {...item}
      new_item = {...item, key: item.id, users: item.type == '1' ? this.filterRemoveMember(removeMemberUserId, item.users) : filterTemMemberList}
      return new_item
    })
    return {
      columns,
      data
    }
  }

  // 获取模板组织成员---因项目会返回成员列表, 而模板需要自己从组织成员中获取, 去除访客
  getOrgMemberWithRemoveVisitors = (groupList = []) => {
    let curr = groupList.filter(n => n.is_default != '2')
    let temMemberList = []
    curr.map(item => {
      for (const key in item) {
        if (key == 'members' && item[key].length) {
          let new_members = [...item[key]]
          new_members = new_members.map(n => {
            let d = {}
            d = {
              avatar: n.avatar || '',
              email: n.email || '',
              full_name: n.name || '',
              id: n.user_id,
              mobile: n.mobile || '',
              name: n.name || '',
              user_id: n.user_id
            }
            return d
          })
          temMemberList.push(...new_members)
        }
      }
    })
    return temMemberList
  }

  // 获取移除成员初始列表
  getTransferSelectedList = (removeId) => {
    getTransferSelectedList({user_id: removeId}).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          transferSelectedList: res.data
        })
      }
    })
  }

  // 获取移除成员交接详情列表
  getTransferSelectedDetailList = ({boardId}) => {
    const { removeMemberUserId } = this.props
    getTransferSelectedDetailList({
      user_id: removeMemberUserId,
      board_id: boardId
    }).then(res => {
      if (isApiResponseOk(res)) {
        const { transferSelectedList = [] } = this.state
        let {users: currentBoardUsers = [], name} = transferSelectedList.find(i => i.id == boardId)
        this.setState({
          transferSelectedDetailList: res.data,
          hand_over_visible: true,
          currentBoardUsers,
          currentBoardName: name
        })
      }
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { TreeRemoveOrgMemberModalVisiblie, removeMemberUserId, groupList = [] } = nextProps
    const { TreeRemoveOrgMemberModalVisiblie: old_TreeRemoveOrgMemberModalVisiblie } = this.props
    console.log(groupList);
    if (TreeRemoveOrgMemberModalVisiblie && old_TreeRemoveOrgMemberModalVisiblie != TreeRemoveOrgMemberModalVisiblie) {
      this.getTransferSelectedList(removeMemberUserId)  
    }
  }

  onCancel = () => {
    this.props.dispatch({
      type: 'organizationMember/updateDatas',
      payload: {
        TreeRemoveOrgMemberModalVisiblie: false
      }
    })
  }

  // 是否显示详细交接
  handleTakeOverVisible = (e, id) => {
    e && e.stopPropagation()
    this.getTransferSelectedDetailList({boardId: id})
  }

  // 点击返回
  handleBack = (e) => {
    e && e.stopPropagation()
    this.setState({
      hand_over_visible: false
    })
  }

  // 默认table内容
  renderDefaultTableContent = () => {
    const { columns = [], data = [] } = this.getTableProps()
    const { hand_over_visible, currentBoardName } = this.state
    return (
      <div>
        {
          hand_over_visible && (
            <div style={{ lineHeight: '20px', marginBottom: '10px', letterSpacing: '1px' }}>
              <span onClick={this.handleBack} style={{ cursor: 'pointer', color: '#4090F7' }}>&lt; 返回 </span>
              <span style={{ color: 'rgba(0,0,0,.45)' }}> | {currentBoardName}</span>
            </div>
          )
        }
        <div className={globalClassName.global_vertical_scrollbar} style={{overflowY: 'auto', maxHeight: '390px'}}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
      </div>
    )
  }

  // 渲染内容
  renderContent = () => {
    return (
      <div className={indexStyles.removeMemberContent}>
        <div className={indexStyles.rev_top}>
          <div style={{ color: 'rgba(0,0,0,0.85)' }}>⚠️ 注意事项：</div>
          <div>
            1、成员被移除后，其在本组织所参与的项目以及项目内的事务将自动退出。
          </div>
          <div>
            2、仅被该成员所能查看的资料、该成员负责但并未完成的任务、该成员参与但并未完成的流程需手动指定交接人。
          </div>
        </div>
        <div className={indexStyles.rev_bottom}>
          {this.renderDefaultTableContent()}
        </div>
      </div>
    )
  }

  render() {
    const { TreeRemoveOrgMemberModalVisiblie } = this.props
    return (
      <div>
        <Modal
          title={`移除成员确认`}
          visible={TreeRemoveOrgMemberModalVisiblie} //moveToDirectoryVisiblie
          width={640}
          // zIndex={1020}
          destroyOnClose={true}
          maskClosable={false}
          okText="确认"
          cancelText="取消"
          onCancel={this.onCancel}
          onOk={this.onOk}
          getContainer={() => document.getElementById('organizationMemberContainer') || document.body}
        >
          {this.renderContent()}
        </Modal>
      </div>
    )
  }
}

function mapStateToProps({
  technological: {
    datas: {
      userOrgPermissions
    }
  },
  organizationMember: {
    datas: {
      TreeRemoveOrgMemberModalVisiblie,
      removeMemberUserId
    }
  }
}) {
  return {
    userOrgPermissions,
    TreeRemoveOrgMemberModalVisiblie,
    removeMemberUserId
  }
}
