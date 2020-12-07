import {
  Button,
  Col,
  Input,
  message,
  Row,
  Table,
  Radio,
  Modal,
  Skeleton
} from 'antd'
import React from 'react'
import styles from './index.less'
import Action from '../../Action'
import { dateFormat } from '../../../../../../../utils/util'
import PrintPage from '../PrintPage'

export default class InPayment extends React.Component {
  state = {
    showPrint: false,
    columns: [
      {
        title: '会议室地址',
        key: 'address',
        render: record => {
          return <span>{record.meeting_room?.address}</span>
        }
      },
      {
        title: '会议室名称',
        key: 'name',
        render: record => {
          return <span>{record.meeting_room?.name}</span>
        }
      },
      {
        title: '会议室设备',
        key: 'device',
        render: record => {
          let { room_devices = [] } = record.meeting_room || {}
          return <span>{room_devices.map(item => item.name).join('/')}</span>
        }
      },
      {
        title: '使用时段',
        key: 'time',
        render: record => {
          return (
            <span>
              {dateFormat(+(record.start_time + '000'), 'yyyy-MM-dd HH:mm')}-
              {dateFormat(+(record.end_time + '000'), 'HH:mm')}
            </span>
          )
        }
      },
      {
        title: '使用人',
        dataIndex: 'booker_name'
      },
      {
        title: '费用(元)',
        dataIndex: 'total_cost'
      },
      {
        title: '优惠金额(元)',
        dataIndex: 'discount_cost'
      },
      {
        title: '结算(元)',
        dataIndex: 'payment_cost'
      }
    ],
    data: [],
    billDetail: {}, // 订单基本信息
    isUpdateDiscountCost: false,
    discount_number: 0,
    skintonLoading: true
  }

  componentDidMount() {
    this.fetchDetail()
  }

  fetchDetail = () => {
    const { data } = this.props
    Action.getOrderDetail({ id: data.bill_id }).then(res => {
      // console.log(res)
      this.setState({
        billDetail: res.data?.bill || {},
        data: res.data?.bill_details || [],
        skintonLoading: false
      })
    })
  }

  setChangeDiscount = val => {
    let { billDetail = {} } = this.state
    let value = val.target.value
    if (+billDetail.discount_cost !== +value) {
      this.setState({
        discount_number: value,
        isUpdateDiscountCost: true
      })
    } else {
      this.setState({
        isUpdateDiscountCost: false
      })
    }
  }

  // 保存优惠价格
  saveDiscount = () => {
    let { discount_number, billDetail = {} } = this.state
    if (/^\d{1,}$/.test(+discount_number)) {
      Action.setBillDiscount({
        bill_id: billDetail.bill_id,
        discount_cost: +discount_number
      })
        .then(res => {
          // console.log(res)
          this.setState({
            isUpdateDiscountCost: false
          })
          message.success('设置成功')
          this.fetchDetail()
        })
        .catch(err => {
          message.warn(err.message)
        })
    } else {
      message.warn('请输入正确的数字')
    }
  }

  transformStatus = val => {
    switch (val) {
      case '1':
        return '未结算'
      case '2':
        return '已结算'
      default:
        return '未知状态'
    }
  }

  /**
   * 更改结算状态
   * @param {*} val
   */
  setActiveStatus = val => {
    let { billDetail = {} } = this.state
    let value = val.target.value
    Modal.confirm({
      title: '确定更改结算状态吗？',
      content: (
        <span>
          确定将状态更改为 <a>{this.transformStatus(value)}</a>
        </span>
      ),
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        Action.setStatusBill({
          bill_id: billDetail.bill_id,
          bill_status: value
        })
          .then(res => {
            this.setState({
              billDetail: { ...this.state.billDetail, bill_status: value }
            })
            message.success('已更新')
          })
          .catch(err => {
            console.log(err)
            message.warn(err.message)
          })
      }
    })
  }

  toPrint = () => {
    this.setState({
      showPrint: true
    })
  }

  render() {
    const { hideInput, onBack } = this.props
    let { billDetail = {}, isUpdateDiscountCost } = this.state
    const { lessee_org = {} } = billDetail
    return (
      <div className={styles.container}>
        <div className={styles.headers}>
          <div className={styles.org_title}>
            <div>{lessee_org.name}</div>
            <div>{(billDetail.title || '').replace(lessee_org.name, '')}</div>

            <Button
              type="primary"
              className={styles.gobackBtn}
              onClick={() => onBack && onBack()}
            >
              返回
            </Button>
          </div>
          <Skeleton loading={this.state.skintonLoading} active>
            <div className={styles.params_propertys}>
              <Row>
                <Col span={6}>名称: {billDetail.contact_name}</Col>
                <Col span={6}>
                  查询时段:{' '}
                  {dateFormat(
                    +(billDetail.bill_start_time + '000'),
                    'yyyy/MM/dd'
                  )}{' '}
                  -{' '}
                  {dateFormat(
                    +(billDetail.bill_end_time + '000'),
                    'yyyy/MM/dd'
                  )}
                </Col>
                <Col span={6}>
                  优惠金额:{' '}
                  {hideInput ? (
                    <span style={{ margin: '0 10px' }}>
                      {billDetail.discount_cost}
                    </span>
                  ) : (
                    <Input
                      style={{ width: 60 }}
                      defaultValue={billDetail.discount_cost}
                      size="small"
                      onChange={this.setChangeDiscount}
                    />
                  )}{' '}
                  元
                  {isUpdateDiscountCost && !hideInput && (
                    <Button
                      size="small"
                      type="primary"
                      style={{ marginLeft: 10 }}
                      onClick={this.saveDiscount}
                    >
                      确定
                    </Button>
                  )}
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  结算状态:{' '}
                  <span
                    className={
                      billDetail.bill_status === '1'
                        ? styles.notsettlement
                        : styles.settlement
                    }
                  >
                    {billDetail.bill_status === '1'
                      ? '未结算'
                      : billDetail.bill_status === '2'
                      ? '已结算'
                      : '未知状态'}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  联系方式: {billDetail.contact_number || '暂无联系方式'}
                </Col>
                <Col span={6}>
                  查询日期:{' '}
                  {dateFormat(
                    +(billDetail.create_time + '000'),
                    'yyyy-MM-dd HH:mm:ss'
                  )}
                </Col>
                <Col
                  span={12}
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                >
                  合计金额: ￥({billDetail.total_cost} -{' '}
                  {billDetail.discount_cost || 0}) = {billDetail.payment_cost}
                </Col>
              </Row>
            </div>
          </Skeleton>
        </div>

        <div className={styles.order_table}>
          <Table
            dataSource={this.state.data}
            columns={this.state.columns}
            bordered
            rowKey="booking_id"
          />
        </div>
        <div className={styles.footerContent}>
          <Button type="primary" onClick={this.toPrint}>
            打印账单
          </Button>
          {billDetail.bill_status && (
            <div className={styles.toggleStatus}>
              标记为：
              <Radio.Group
                value={billDetail.bill_status}
                buttonStyle="solid"
                onChange={this.setActiveStatus}
              >
                <Radio.Button
                  value="1"
                  className={
                    billDetail.bill_status === '1' ? styles.notBill : ''
                  }
                >
                  未结算
                </Radio.Button>
                <Radio.Button
                  value="2"
                  className={
                    billDetail.bill_status === '2' ? styles.hasBill : ''
                  }
                >
                  已结算
                </Radio.Button>
              </Radio.Group>
            </div>
          )}
        </div>
        {this.state.showPrint ? (
          <PrintPage
            onPrintEnd={() => this.setState({ showPrint: false })}
            printData={this.state.billDetail}
            tableData={this.state.data}
            tableColumns={this.state.columns}
          />
        ) : null}
      </div>
    )
  }
}
