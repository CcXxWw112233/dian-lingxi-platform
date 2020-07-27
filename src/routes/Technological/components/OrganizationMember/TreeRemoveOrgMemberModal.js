import React, { Component } from 'react'
import { Modal, Icon, Table, Select } from 'antd'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalClassName from '@/globalset/css/globalClassName.less'

const Option = Select.Option;

@connect(mapStateToProps)
export default class TreeRemoveOrgMemberModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hand_over_visible: false, // 是否交接
    }
  }

  getTableProps = () => {
    const { hand_over_visible } = this.state
    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width: 106,
        render: (text, item) => {
          return text
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
          return <div>
            <span style={{ marginRight: '28px' }}>
              <Select defaultValue={'请选择'}>
                <Option key={'1'}>加菲猫</Option>
              </Select>
            </span>
            {
              !hand_over_visible && (
                <span onClick={this.handleTakeOverVisible} className={indexStyles.detail_tips}>详细交接 &gt;</span>
              )
            }
          </div>
        }
      }
    ]
    const data = [
      {
        key: '1',
        type: '项目',
        name: '沙田项目',
      },
      {
        key: '2',
        type: '项目',
        name: '沙田项目',
      },
      {
        key: '3',
        type: '项目',
        name: '沙田项目',
      },
      {
        key: '4',
        type: '项目',
        name: '沙田项目',
      },
      {
        key: '5',
        type: '项目',
        name: '沙田项目',
      },
      {
        key: '6',
        type: '模板',
        name: '经费申请',
      },
      {
        key: '7',
        type: '模板',
        name: '经费申请',
      },
      {
        key: '8',
        type: '模板',
        name: '经费申请',
      },
      {
        key: '9',
        type: '模板',
        name: '经费申请',
      },
      {
        key: '10',
        type: '模板',
        name: '经费申请',
      },
    ]
    return {
      columns,
      data
    }
  }

  componentDidMount() {
    // this.updateStateDatas()
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
  handleTakeOverVisible = (e) => {
    e && e.stopPropagation()
    this.setState({
      hand_over_visible: true
    })
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
    const { hand_over_visible } = this.state
    return (
      <div>
        {
          hand_over_visible && (
            <div style={{ lineHeight: '20px', marginBottom: '10px', letterSpacing: '1px' }}>
              <span onClick={this.handleBack} style={{ cursor: 'pointer', color: '#4090F7' }}>&lt; 返回 </span>
              <span style={{ color: 'rgba(0,0,0,.45)' }}> | 沙田项目</span>
            </div>
          )
        }
        <div className={globalClassName.global_vertical_scrollbar} style={{overflowY: 'auto', height: '390px'}}>
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
      TreeRemoveOrgMemberModalVisiblie
    }
  }
}) {
  return {
    userOrgPermissions,
    TreeRemoveOrgMemberModalVisiblie
  }
}
