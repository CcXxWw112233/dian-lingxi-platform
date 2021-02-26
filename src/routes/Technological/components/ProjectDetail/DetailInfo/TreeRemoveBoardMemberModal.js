import React, { Component } from 'react'
import DrawDetailInfoStyle from './DrawDetailInfo.less'
import { Dropdown, Modal, Table, Menu, Select, Checkbox } from 'antd'
import globalClassName from '@/globalset/css/globalClassName.less'

export default class TreeRemoveBoardMemberModal extends Component {
  state = {
    selectedRows: [],
    columns: [],
    dataSource: []
  }
  componentDidMount() {}

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
    return (
      <Menu>
        <Menu.Item style={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.85)' }}>
          批量移交至：
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">粱环露</Menu.Item>
        <Menu.Item key="2">谢飞娟</Menu.Item>
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
    const dataSource = [
      {
        id: 'a',
        key: '3',
        type: '3',
        name: '西湖区湖底公园2号'
      },
      {
        id: 'b',
        key: '3',
        type: '3',
        name: '西湖区湖底公园2号'
      },
      {
        id: 'c',
        key: '2',
        type: '2',
        name: '西湖区湖底公园1号'
      },
      {
        id: 'd',
        key: '1',
        type: '1',
        name: '西湖区湖底公园3号'
      },
      {
        id: 'e',
        key: '1',
        type: '1',
        name: '西湖区湖底公园4号'
      },
      {
        id: 'f',
        key: '1',
        type: '1',
        name: '西湖区湖底公园5号'
      }
    ]

    const columns = [
      {
        title: this.renderTtileTypeContent(),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width: 84,
        render: (text, record) => {
          const { type } = record
          if (type == '1') {
            return '里程碑'
          } else if (type == '2') {
            return '任务'
          } else if (type == '3') {
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
          return <Select style={{ width: '100%' }}></Select>
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
        <Menu.Item key="3">流程</Menu.Item>
        <Menu.Item key="2">任务</Menu.Item>
        <Menu.Item key="1">里程碑</Menu.Item>
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
