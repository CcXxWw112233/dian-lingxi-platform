import { message, Table, Button } from 'antd'
import React, { Fragment } from 'react'
import styles from './index.less'
import Action from '../../Action'
import OrderDetail from '../OrderDetail'
import { dateFormat } from '../../../../../../../utils/util'
import PrintPage from '../PrintPage'

export default class PaymentInOrder extends React.PureComponent {
  state = {
    query_param: {
      current_page: 1,
      page_size: 10
    },
    inDetail: false,
    detailData: {},
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
          return <a onClick={() => this.setDetailData(record)}>明细</a>
        }
      }
    ]
  }

  componentDidMount() {
    this.getList()
  }

  /**
   * 设置详情数据
   * @param {*} record
   */
  setDetailData = record => {
    this.setState({
      detailData: record,
      inDetail: true
    })
  }

  getList = pageNumber => {
    Action.getReceivable({
      org_id: this.props.org_id,
      ...this.state.query_param,
      current_page: pageNumber || this.state.query_param.current_page
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
  /**
   * 分页
   */
  setPageLoad = val => {
    let { current, pageSize } = val
    this.setState(
      {
        query_param: {
          current_page: current,
          page_size: pageSize
        }
      },
      () => {
        this.getList()
      }
    )
  }

  onBack = () => {
    this.setState({
      inDetail: false
    })
    this.getList()
  }

  render() {
    return (
      <Fragment>
        {this.state.inDetail ? (
          <OrderDetail
            onBack={this.onBack}
            hideInput={false}
            data={this.state.detailData}
          />
        ) : (
          <div className={styles.container}>
            <div className={styles.headers}>
              账单列表
              <Button
                className={styles.updateBtn}
                type="primary"
                onClick={() => this.getList()}
              >
                更新
              </Button>
            </div>
            <div className={styles.inpayment_table}>
              <Table
                onChange={this.setPageLoad}
                pagination={{
                  pageSize: this.state.query_param.page_size,
                  current: this.state.query_param.current_page,
                  total: +(this.state.data.total || 0),
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
                }}
                bordered
                dataSource={this.state.data?.list}
                columns={this.state.columns}
                rowKey="bill_id"
              />
            </div>
          </div>
        )}
      </Fragment>
    )
  }
}
