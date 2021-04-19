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
        dataIndex: 'template_name',
        key: 'template_name'
      },
      {
        title: '项目开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
        render: text => {
          const time = text + '000'
          const flag = isNaN(+time)
          return !flag ? dateFormat(+time, 'yyyy-MM-dd HH:mm') : ''
        }
      },
      {
        title: '项目负责人',
        key: 'creator',
        render: record => {
          const { leader = [] } = record || {}
          return <span>{leader.map(item => item.name).join('、')}</span>
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
