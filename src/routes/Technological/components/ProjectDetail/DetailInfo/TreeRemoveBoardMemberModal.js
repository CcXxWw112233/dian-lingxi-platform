import React, { Component } from 'react'
import DrawDetailInfoStyle from './DrawDetailInfo.less'
import { Dropdown, Modal, Table, Menu, Select, Checkbox } from 'antd'
import globalClassName from '@/globalset/css/globalClassName.less'
import { getTransferSelectedDetailList } from '../../../../../services/technological/organizationMember'
import { connect } from 'dva'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'

@connect(mapStateToProps)
export default class TreeRemoveBoardMemberModal extends Component {
  state = {
    selectedRows: [],
    columns: [],
    dataSource: [],
    data: [],
    transferSelectedList: []
  }

  componentDidMount() {
    const {
      removerUserId,
      projectDetailInfoData: { board_id }
    } = this.props
    this.filterRemoveCurrentUser()
    getTransferSelectedDetailList({ user_id: removerUserId, board_id }).then(
      res => {
        console.log(res.data)
        if (isApiResponseOk(res)) {
          this.setState({
            transferSelectedList: res.data
          })
        }
      }
    )
  }

  // 获取排除移除该成员的项目成员列表
  filterRemoveCurrentUser = () => {
    const {
      removerUserId,
      projectDetailInfoData: { data = [] }
    } = this.props
    let new_data = [...data]
    new_data = new_data.filter(item => item.user_id != removerUserId)
    this.setState({
      data: new_data
    })
  }

  // 判断类型是否可选
  whetherIsSelectType = type => {
    const { transferSelectedList = [] } = this.state
    let flag = true
    let obj = transferSelectedList.find(i => i.content_type == type)
    if (obj && !!Object.keys(obj).length) {
      flag = false
    }
    return flag
  }

  // 渲染类型下拉菜单
  renderTtileTypeContent = () => {
    const { titleTypeDropDownVisible } = this.state
    return (
      <div className={DrawDetailInfoStyle.title_type_wrapper}>
        <Dropdown
          trigger={['click']}
          style={{ width: 184 }}
          overlay={this.renderOverlayTitleTypeMenu()}
          visible={titleTypeDropDownVisible}
          onVisibleChange={this.setTitleTypeDropDown}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          <div className={DrawDetailInfoStyle.title_type_select}>
            <span>类型</span>
            <span className={globalClassName.authTheme}>&#xe7ee;</span>
          </div>
        </Dropdown>
      </div>
    )
  }

  // 渲染交接人下拉菜单
  renderHandoverMenu = () => {
    const { data = [] } = this.state
    return (
      <Menu>
        <Menu.Item style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.85)' }}>
          批量移交至：
        </Menu.Item>
        <Menu.Divider />
        {data.map(item => {
          return <Menu.Item value={item.user_id}>{item.name}</Menu.Item>
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
        <Dropdown
          trigger={['click']}
          placement={'bottomRight'}
          overlay={this.renderHandoverMenu()}
        >
          <span
            style={{ fontSize: '24px' }}
            className={globalClassName.authTheme}
          >
            &#xe84b;
          </span>
        </Dropdown>
      </div>
    )
  }

  // 获取table的数据
  getTablesProps = () => {
    const { transferSelectedList = [], data = [] } = this.state
    // const dataSource = [
    //   {
    //     id: 'a',
    //     key: '3',
    //     type: '3',
    //     name: '西湖区湖底公园2号'
    //   },
    // ]
    const dataSource = transferSelectedList.map(item => {
      let new_item = { ...item }
      new_item.id = item.content_id
      new_item.key = item.content_type
      return new_item
    })

    const columns = [
      {
        title: this.renderTtileTypeContent(),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width: 84,
        render: (text, record) => {
          const { content_type } = record
          if (content_type == '1') {
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
        // width: 250,
        ellipsis: true
      },
      {
        title: this.renderHandoverContent(),
        dataIndex: 'user',
        key: 'user',
        width: 150,
        render: () => {
          return (
            <Select placeholder={'请选择'} style={{ width: '100%' }}>
              {data.map(item => {
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

  setTitleTypeDropDown = visible => {
    this.setState({
      titleTypeDropDownVisible: visible
    })
  }

  onCancel = () => {
    this.props.setTreeRemoveBoardMemberVisible &&
      this.props.setTreeRemoveBoardMemberVisible()
  }

  handleMenuReallySelect = e => {
    this.setSelectKey(e, 'add')
  }
  handleMenuReallyDeselect = e => {
    this.setSelectKey(e, 'remove')
  }
  setSelectKey = (e, type) => {
    const { key, selectedKeys } = e
    if (!key) {
      return false
    }
    this.setState({
      selectedRowKeys: selectedKeys
    })
  }

  renderOverlayTitleTypeMenu = () => {
    return (
      <Menu
        multiple={true}
        onSelect={this.handleMenuReallySelect}
        onDeselect={this.handleMenuReallyDeselect}
        selectable={true}
        style={{ width: 94 }}
      >
        <Menu.Item key="3" disabled={this.whetherIsSelectType('3')}>
          流程
        </Menu.Item>
        <Menu.Item key="2" disabled={this.whetherIsSelectType('2')}>
          任务
        </Menu.Item>
        <Menu.Item key="1" disabled={this.whetherIsSelectType('1')}>
          里程碑
        </Menu.Item>
      </Menu>
    )
  }
  // 默认table内容
  renderDefaultTableContent = () => {
    const { columns = [], dataSource = [] } = this.getTablesProps()
    const { selectedRowKeys } = this.state
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        )
      },
      selectedRowKeys
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name
      // })
    }
    return (
      <div>
        <div
          className={globalClassName.global_vertical_scrollbar}
          style={{ overflowY: 'auto', maxHeight: '390px' }}
        >
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            className={DrawDetailInfoStyle.transfer_table_content}
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
    return (
      <div>
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
          // okButtonProps={{ disabled: !disabled }}
          onOk={this.onOk}
          // getContainer={() =>
          //   document.getElementById('organizationMemberContainer') ||
          //   document.body
          // }
        >
          {this.renderContent()}
        </Modal>
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
