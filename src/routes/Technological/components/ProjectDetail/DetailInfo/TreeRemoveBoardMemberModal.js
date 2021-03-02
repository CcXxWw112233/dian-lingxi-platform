import React, { Component } from 'react'
import DrawDetailInfoStyle from './DrawDetailInfo.less'
import { Dropdown, Modal, Table, Menu, Select, Checkbox, Tooltip } from 'antd'
import globalClassName from '@/globalset/css/globalClassName.less'
import {
  getTransferSelectedDetailList,
  removeMemberWithSettingTransferUser
} from '../../../../../services/technological/organizationMember'
import { connect } from 'dva'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import { arrayNonRepeatfy } from '../../../../../utils/util'

@connect(mapStateToProps)
export default class TreeRemoveBoardMemberModal extends Component {
  state = {
    selectedRows: [], // 选中的当前行的数据
    selectedRowKeys: [], // 选中的当前行的ID
    columns: [],
    dataSource: [],
    dropDownUserData: [], // 下拉选择的交接用户数据
    transferSelectedList: [], // 数据列表源
    listType: [], // 表示列表中存在的type类型
    titleTypeDropDownVisible: false //设置类型下拉窗显示隐藏 默认false不显示
  }

  initState = () => {
    this.setState({
      selectedRows: [], // 选中的当前行的数据
      selectedRowKeys: [], // 选中的当前行的ID
      columns: [],
      dataSource: [],
      dropDownUserData: [], // 下拉选择的交接用户数据
      transferSelectedList: [], // 数据列表源
      listType: [], // 表示列表中存在的type类型
      titleTypeDropDownVisible: false //设置类型下拉窗显示隐藏 默认false不显示
    })
  }

  confirm(data) {
    const that = this
    Modal.confirm({
      title: '确认将他移出项目吗？',
      zIndex: 2000,
      content: (
        <div style={{ color: 'rgba(0,0,0, .8)', fontSize: 14 }}>
          <span>退出后将无法获取该项目的相关动态</span>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props
        dispatch({
          type: 'projectDetail/removeMenbers',
          payload: {
            ...data
          }
        })
      }
    })
  }

  componentDidMount() {
    const {
      removerUserId,
      projectDetailInfoData: { board_id }
    } = this.props
    let listType = []
    this.filterRemoveCurrentUser()
    getTransferSelectedDetailList({ user_id: removerUserId, board_id }).then(
      res => {
        if (isApiResponseOk(res)) {
          if (!!res.data.length) {
            res.data.map(item => {
              listType.push(item.content_type)
            })
            listType = Array.from(new Set(listType))
            this.setState({
              transferSelectedList: res.data,
              listType
            })
          } else {
            this.props.setTreeRemoveBoardMemberVisible &&
              this.props.setTreeRemoveBoardMemberVisible()
            setTimeout(() => {
              this.confirm({ board_id, user_id: removerUserId })
            }, 100)
          }
        }
      }
    )
  }

  componentWillUnmount() {
    this.initState()
  }

  // 确定回调
  onOk = () => {
    const { transferSelectedList = [] } = this.state
    const {
      removerUserId,
      projectDetailInfoData: { board_id }
    } = this.props
    // 后端需要的数据结构
    let transfer = {
      content_id: board_id,
      content_type: '1', //表示项目
      content_transfer: transferSelectedList
    }
    removeMemberWithSettingTransferUser({
      handover_user_id: removerUserId,
      transfer: transfer
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.props.dispatch({
          type: 'projectDetail/projectDetailInfo',
          payload: {
            id: board_id
          }
        })
        this.props.setTreeRemoveBoardMemberVisible &&
          this.props.setTreeRemoveBoardMemberVisible()
      }
    })
  }

  // 点击取消
  onCancel = () => {
    this.initState()
    this.props.setTreeRemoveBoardMemberVisible &&
      this.props.setTreeRemoveBoardMemberVisible()
  }

  // 获取排除移除该成员后的项目成员列表
  filterRemoveCurrentUser = () => {
    const {
      removerUserId,
      projectDetailInfoData: { data = [] }
    } = this.props
    let new_data = [...data]
    new_data = new_data.filter(item => item.user_id != removerUserId)
    this.setState({
      dropDownUserData: new_data
    })
  }

  /**
   * 更新树状结构 设置交接人
   * @param {String} target_id 将交接人设置在哪一个目标下
   * @param {String} transfer_id 设置的交接人
   * @param {Array} data 需要操作的数据源
   */
  updateTreeSelectedTransferUser = (target_id, transfer_id, data) => {
    let arr = []
    arr = data.map(item => {
      if (item.content_id == target_id) {
        let new_item = { ...item }
        new_item = { ...item, transfer_user_id: transfer_id }
        return new_item
      } else {
        return item
      }
    })
    return arr
  }

  // 渲染表头类型内容
  renderTitleTypeContent = () => {
    const { titleTypeDropDownVisible, transferSelectedList = [] } = this.state
    return (
      <div className={DrawDetailInfoStyle.title_type_wrapper}>
        <Dropdown
          trigger={['click']}
          style={{ width: 184 }}
          overlay={this.renderOverlayTitleTypeMenu()}
          visible={titleTypeDropDownVisible}
          onVisibleChange={this.setTitleTypeDropDown}
          getPopupContainer={
            transferSelectedList.length > 1
              ? triggerNode => triggerNode.parentNode
              : null
          }
        >
          <div className={DrawDetailInfoStyle.title_type_select}>
            <span>类型</span>
            <span className={globalClassName.authTheme}>&#xe7ee;</span>
          </div>
        </Dropdown>
      </div>
    )
  }

  // 是否可以批量选择
  whetherIsBatchChoice = () => {
    const { selectedRowKeys = [] } = this.state
    if (!!selectedRowKeys.length) return true
    return false
  }

  // 判断所有列表中每一个选项都选择了交接人 true表示可以点击确定
  whetherIsSelectConfirm = () => {
    const { transferSelectedList = [] } = this.state
    return transferSelectedList.every(n => {
      if (n.transfer_user_id) {
        return true
      } else {
        return false
      }
    })
  }

  // 批量选择的事件
  handleHandoverSelect = e => {
    const { domEvent, selectedKeys = [] } = e
    domEvent && domEvent.stopPropagation()
    const { transferSelectedList = [], selectedRowKeys = [] } = this.state
    let arr = transferSelectedList.map(item => {
      if (selectedRowKeys.indexOf(item.content_id) != -1) {
        if (item.transfer_user_id) {
          // 如果存在交接人则按已选择的来 不进行覆盖
          return item
        } else {
          // 表示只对选择的数据做处理
          let new_item = { ...item }
          new_item.transfer_user_id = selectedKeys.join(',')
          return new_item
        }
      } else {
        return item
      }
    })
    // 批量选择后需要清空选择项
    this.setState({
      transferSelectedList: arr,
      selectedRowKeys: [],
      selectedRows: [],
      selectedKeys: []
    })
  }

  // 渲染交接人下拉菜单
  renderHandoverMenu = () => {
    const { dropDownUserData = [] } = this.state
    return (
      <Menu
        // multiple={true}
        selectable={true}
        onSelect={this.handleHandoverSelect}
      >
        <Menu.Item
          disabled={true}
          style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.85)' }}
        >
          批量移交至：
        </Menu.Item>
        <Menu.Divider />
        {dropDownUserData.map(item => {
          return <Menu.Item key={item.user_id}>{item.name}</Menu.Item>
        })}
      </Menu>
    )
  }

  // 渲染交接人
  renderHandoverContent = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
          alignItems: 'center'
        }}
      >
        <span>交接人</span>
        {this.whetherIsBatchChoice() ? (
          <Dropdown
            trigger={['click']}
            placement={'bottomRight'}
            overlay={this.renderHandoverMenu()}
          >
            <span
              style={{ fontSize: '24px' }}
              className={`${globalClassName.authTheme} ${DrawDetailInfoStyle.batch_spot}`}
            >
              &#xe84b;
            </span>
          </Dropdown>
        ) : (
          <Tooltip title={'至少选择一个进行批量交接'} placement="top">
            <span
              style={{ fontSize: '24px' }}
              className={`${globalClassName.authTheme} ${DrawDetailInfoStyle.batch_spot_notallow}`}
            >
              &#xe84b;
            </span>
          </Tooltip>
        )}
      </div>
    )
  }

  // 单独行 交接人选择事件
  handleOnSelectValue = (value, item) => {
    const { content_id } = item
    const { transferSelectedList = [] } = this.state
    let arr = this.updateTreeSelectedTransferUser(
      content_id,
      value,
      transferSelectedList
    )
    this.setState({
      transferSelectedList: arr
    })
  }

  // 获取table的数据
  getTablesProps = () => {
    const { transferSelectedList = [], dropDownUserData = [] } = this.state
    const dataSource = transferSelectedList.map(item => {
      let new_item = { ...item }
      new_item.id = item.content_id
      new_item.key = item.content_type
      return new_item
    })
    const columns = [
      {
        title: this.renderTitleTypeContent(),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width: 84,
        render: (text, record) => {
          const { content_type } = record
          if (content_type == '4') {
            return '里程碑'
          } else if (content_type == '2') {
            return '任务'
          } else if (content_type == '3') {
            return '流程'
          }
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true
      },
      {
        title: this.renderHandoverContent(),
        dataIndex: 'user',
        key: 'user',
        width: 150,
        render: (text, record) => {
          const { transfer_user_id = '' } = record
          let value_ = !!transfer_user_id
            ? transfer_user_id.indexOf(',') != -1
              ? '多人交接'
              : transfer_user_id
            : undefined
          return (
            <Select
              onChange={e => {
                this.handleOnSelectValue(e, record)
              }}
              placeholder={'请选择'}
              style={{ width: '100%', maxWidth: '150px' }}
              value={value_}
            >
              {dropDownUserData.map(item => {
                return (
                  <Select.Option value={item.user_id}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
          )
        }
      }
    ]
    return { dataSource, columns }
  }

  // 设置类型下拉窗显示隐藏
  setTitleTypeDropDown = visible => {
    this.setState({
      titleTypeDropDownVisible: visible
    })
  }

  handleMenuReallySelect = e => {
    this.setSelectKey(e, 'add')
  }
  handleMenuReallyDeselect = e => {
    this.setSelectKey(e, 'remove')
  }
  // 这里的操作是根据选择的类型勾选对应的数据
  setSelectKey = (e, type) => {
    let { key, selectedKeys } = e
    let {
      transferSelectedList = [],
      selectedRowKeys = [],
      selectedRows = [],
      listType = [],
      selectedKeys: state_selectedKeys
    } = this.state
    if (key == '0') {
      //表示取消
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
        selectedKeys: []
      })
      return
      // return false
    }
    if (key == -1) {
      // 表示全部
      if (type == 'add') {
        let selectedRowKeys_ = []
        let selectedRows_ = []
        transferSelectedList.map(item => {
          selectedRowKeys_.push(item.content_id)
          selectedRows_.push(item)
        })
        let typeArr = [].concat(...listType, ...['-1'])
        this.setState({
          selectedKeys: typeArr,
          selectedRowKeys: Array.from(new Set(selectedRowKeys_)),
          selectedRows: arrayNonRepeatfy(selectedRows_, 'content_id')
        })
      } else {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
          selectedKeys: []
        })
      }
      return
    }
    let selectedRowKeys_ = []
    let selectedRows_ = []
    if (type == 'add') {
      transferSelectedList.map(item => {
        if (selectedKeys.indexOf(item.content_type) != -1) {
          selectedRowKeys_.push(item.content_id)
          selectedRows_.push(item)
        }
      })
      selectedRowKeys_ = [].concat(...selectedRowKeys_, ...selectedRowKeys)
      selectedRows_ = [].concat(...selectedRows_, ...selectedRows)
      if (selectedKeys.length == listType.length) {
        selectedKeys.push('-1')
      }
    } else if (type == 'remove') {
      selectedRows_ = selectedRows.filter(i => i.content_type != key)
      selectedRows_.map(i => {
        selectedRowKeys_.push(i.content_id)
      })
      selectedRowKeys_ = Array.from(new Set(selectedRowKeys_))
      selectedKeys = selectedKeys.filter(i => i != '-1')
    }
    this.setState({
      selectedKeys,
      selectedRowKeys: selectedRowKeys_,
      selectedRows: arrayNonRepeatfy(selectedRows_, 'content_id')
    })
  }

  renderOverlayTitleTypeMenu = () => {
    const { selectedKeys = [], listType = [] } = this.state
    return (
      <Menu
        multiple={true}
        selectedKeys={selectedKeys}
        onSelect={this.handleMenuReallySelect}
        onDeselect={this.handleMenuReallyDeselect}
        selectable={true}
        style={{ width: 94 }}
        getPopupContainer={triggerNode => triggerNode.parentNode}
      >
        <Menu.Item key="-1">全部</Menu.Item>
        <Menu.Item key="0">无</Menu.Item>
        <Menu.Item key="3" disabled={listType.indexOf('3') == -1}>
          流程
        </Menu.Item>
        <Menu.Item key="2" disabled={listType.indexOf('2') == -1}>
          任务
        </Menu.Item>
        <Menu.Item key="4" disabled={listType.indexOf('1') == -1}>
          里程碑
        </Menu.Item>
      </Menu>
    )
  }
  rowSelection = () => {
    const {
      selectedRowKeys = [],
      selectedRows = [],
      transferSelectedList = [],
      listType = []
    } = this.state
    let card_len_2 = transferSelectedList.filter(i => i.content_type == '2')
      .length
    let flow_len_2 = transferSelectedList.filter(i => i.content_type == '3')
      .length
    let lcb_len_2 = transferSelectedList.filter(i => i.content_type == '4')
      .length
    return {
      onChange: (selectedRowKeys, selectedRows) => {
        let selectedKeys = []
        if (selectedRowKeys.length == transferSelectedList.length) {
          selectedKeys = [].concat(...listType, ...['-1'])
        }
        // 选择流程的长度
        let flow_len_1 = selectedRows.filter(i => i.content_type == '3').length
        if (flow_len_1 == flow_len_2) {
          selectedKeys.push('3')
        }
        //选择任务的长度
        let card_len_1 = selectedRows.filter(i => i.content_type == '2').length
        if (card_len_1 == card_len_2) {
          selectedKeys.push('2')
        }
        // 选择里程碑长度
        let lcb_len_1 = selectedRows.filter(i => i.content_type == '4').length
        if (lcb_len_1 == lcb_len_2 && lcb_len_2 != 0) {
          selectedKeys.push('4')
        }
        selectedKeys = Array.from(new Set(selectedKeys))
        this.setState({
          selectedRowKeys,
          selectedRows,
          selectedKeys
        })
      },
      selectedRowKeys
    }
  }
  // 默认table内容
  renderDefaultTableContent = () => {
    const { columns = [], dataSource = [] } = this.getTablesProps()
    return (
      <div>
        <div
          className={globalClassName.global_vertical_scrollbar}
          style={{ overflowY: 'auto', maxHeight: '390px', minHeight: '200px' }}
        >
          <Table
            rowSelection={this.rowSelection()}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            className={DrawDetailInfoStyle.transfer_table_content}
            rowKey={record => record.id}
          />
        </div>
      </div>
    )
  }
  // 渲染内容
  renderContent = () => {
    return (
      <div className={DrawDetailInfoStyle.removeMemberContent}>
        <div className={DrawDetailInfoStyle.rev_top}>
          <div style={{ color: 'rgba(0,0,0,0.85)' }}>⚠️ 注意事项：</div>
          <div>1、成员被移除后，其在本项目所参与的所有事务将自动退出。</div>
          <div>
            2、仅被该成员所能查看的资料、该成员负责但并未完成的任务、该成员参与但并未完成的流程需手动指定交接人。
          </div>
        </div>
        <div className={DrawDetailInfoStyle.rev_bottom}>
          {this.renderDefaultTableContent()}
        </div>
      </div>
    )
  }
  render() {
    const { visible } = this.props
    const { transferSelectedList = [] } = this.state
    return (
      <div>
        {transferSelectedList && !!transferSelectedList.length && (
          <Modal
            title={`移除成员确认`}
            visible={visible} //moveToDirectoryVisiblie
            width={630}
            zIndex={1009}
            destroyOnClose={true}
            maskClosable={false}
            okText="确认"
            cancelText="取消"
            onCancel={this.onCancel}
            okButtonProps={{ disabled: !this.whetherIsSelectConfirm() }}
            onOk={this.onOk}
          >
            {this.renderContent()}
          </Modal>
        )}
      </div>
    )
  }
}

TreeRemoveBoardMemberModal.defaultProps = {
  visible: false, // 控制弹窗显示隐藏
  setTreeRemoveBoardMemberVisible: function() {}, // 设置弹窗显示隐藏回调
  removerUserId: '' // 当前移除的成员ID
}

function mapStateToProps({
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    projectDetailInfoData
  }
}
