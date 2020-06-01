import React, { Component } from 'react'
import { Table } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
@connect(mapStateToProps)
export default class FlowTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.initData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps)
  }

  initData = (props) => {
    const { processTemplateList = [] } = props
    const dataSource = processTemplateList.map(item => {
      return item
    })
    const columns = [
      {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 228,
        render: (text, item) => {
          return <div style={{ overflow: 'hidden' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#69C0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginRight: '8px', float: 'left' }}>
              <span style={{ fontSize: '16px', color: '#fff' }} className={globalStyles.authTheme}>&#xe68c;</span>
            </span>
            <span style={{ fontSize: '14px', fontWeight: 400, float: 'left', lineHeight: '32px' }}>{text}</span>
          </div>
        }
      },
      {
        title: '模板步骤',
        dataIndex: 'node_num',
        key: 'node_num',
        ellipsis: true,
        width: 148,
        render: (text) => {
          return <div style={{marginLeft: '8px'}}>共 <span style={{ color: '#1890FF' }}>{text}</span> 步</div>
        }
      },
      {
        title: '被引用次数',
        dataIndex: 'quote_num',
        key: 'quote_num',
        ellipsis: true,
        width: 152,
        render: (text) => {
          return <div style={{marginLeft: '8px'}}><span style={{ color: '#1890FF' }}>{text}</span> 次</div>
        }
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        ellipsis: true,
        width: 110,
        render: (item, value) => {
          return <div>
            <span style={{color: '#1890FF', marginRight: '12px', cursor: 'pointer'}}>编辑</span>
            <span style={{color: '#F5222D', cursor: 'pointer'}}>删除</span>
          </div>
        }
      },
    ];
    this.setState({
      columns,
      dataSource
    })
  }

  render() {
    const { dataSource, columns } = this.state
    return (
      <div>
        <Table
          // onRow={record => {
          //   return {
          //     // onClick: e => this.tableRowClick(record), // 点击行
          //   };
          // }}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        // scroll={{ y: scroll_height, }} 
        />
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    process_detail_modal_visible,
    processTemplateList = []
  },
  technological: {
    datas: {
      userOrgPermissions = []
    }
  }
}) {
  return {
    process_detail_modal_visible,
    processTemplateList,
    userOrgPermissions
  }
}
