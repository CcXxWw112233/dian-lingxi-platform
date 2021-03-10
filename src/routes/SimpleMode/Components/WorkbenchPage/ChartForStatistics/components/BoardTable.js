import { Table } from 'antd'
import React from 'react'
import { dateFormat } from '../../../../../../utils/util'
import styles from '../index.less'

export default class BoardTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '所使用的模板',
        dataIndex: 'templateName',
        key: 'templateName'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: text => {
          const time = text + '000'
          const flag = isNaN(+time)
          return !flag ? dateFormat(+time, 'yyyy-MM-dd HH:mm') : ''
        }
      },
      {
        title: '创建人',
        key: 'creator',
        render: record => {
          const { create_by } = record || {}
          return <span>{create_by.name}</span>
        }
      }
    ]
  }

  render() {
    const { data } = this.props
    return (
      <div className={styles.table_container}>
        <Table bordered dataSource={data} rowKey="id" columns={this.columns} />
      </div>
    )
  }
}
