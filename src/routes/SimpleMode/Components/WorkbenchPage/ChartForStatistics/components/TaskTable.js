import { Table } from 'antd'
import React from 'react'
import { dateFormat, timestampToTimeNormal } from '../../../../../../utils/util'
import styles from '../index.less'

/**
 * 任务列表树形表
 */
export default class TaskTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.columns = [
      {
        title: '事件名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '项目名称',
        dataIndex: 'board_name',
        key: 'board_name'
      },
      {
        title: '分组',
        dataIndex: 'group_name',
        key: 'group_name'
      },
      {
        title: '进度/状态',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '截止日期',
        dataIndex: 'end_time',
        key: 'end_time',
        render: (text, record) => {
          const { end_time, overdue_day, warning_day } = record
          return (
            <span>
              <span style={{ marginRight: '15px' }}>
                {end_time && timestampToTimeNormal(end_time)}
              </span>
              {''}
              {overdue_day ? (
                <span
                  style={{ color: '#F5222D' }}
                >{`逾期${overdue_day}天`}</span>
              ) : warning_day ? (
                <span
                  style={{ color: '#FAAD14' }}
                >{`剩余${warning_day}天`}</span>
              ) : (
                ''
              )}
            </span>
          )
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
