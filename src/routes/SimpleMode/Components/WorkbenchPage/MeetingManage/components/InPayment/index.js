import { message, Table } from 'antd'
import React from 'react'
import styles from './index.less'
import Action from '../../Action'
import { dateFormat } from '../../../../../../../utils/util'

export default class PaymentInOrder extends React.PureComponent {
  state = {
    query_param: {
      current_page: 1,
      page_size: 10
    },
    data: [],
    columns: [
      {
        title: '名称',
        width: 500,
        dataIndex: 'title',
        render: text => {
          return (
            <span
              className={styles.ellipsis}
              style={{ width: 460 }}
              title={text}
            >
              {text}
            </span>
          )
        }
      },
      {
        title: '费用(元)',
        dataIndex: 'total_cost'
      },
      {
        title: '生成时间',
        key: 'time',
        render: record => {
          let start_time = record.create_time + '000'
          return <span>{dateFormat(+start_time, 'yyyy-MM-dd HH:mm:ss')}</span>
        }
      },
      {
        title: '状态',
        dataIndex: 'bill_status',
        render: text => {
          let string =
            text === '1' ? '未结算' : text === '2' ? '已结算' : '未知状态'
          return <span>{string}</span>
        }
      },
      {
        title: '操作',
        key: 'operation',
        render: record => {
          return <a>明细</a>
        }
      }
    ]
  }

  componentDidMount() {
    this.getList()
  }

  getList = () => {
    Action.getReceivable({
      org_id: this.props.org_id,
      ...this.state.query_param
    })
      .then(res => {
        // console.log(res)
        this.setState({
          data: res.data
        })
      })
      .catch(err => {
        message.warn(err.message)
      })
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headers}>账单列表</div>
        <div className={styles.inpayment_table}>
          <Table
            bordered
            dataSource={this.state.data?.list}
            columns={this.state.columns}
            rowKey="bill_id"
          />
        </div>
      </div>
    )
  }
}
