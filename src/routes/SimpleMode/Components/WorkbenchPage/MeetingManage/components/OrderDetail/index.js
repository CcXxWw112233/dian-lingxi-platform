import { Button, Col, Row, Table } from 'antd'
import React from 'react'
import styles from './index.less'
import Action from '../../Action'

export default class InPayment extends React.Component {
  state = {
    columns: [
      {
        title: '会议室地址',
        dataIndex: 'address'
      },
      {
        title: '会议室名称',
        dataIndex: 'name'
      },
      {
        title: '会议室设备',
        key: '1'
      },
      {
        title: '使用时段',
        key: 'time'
      },
      {
        title: '使用人',
        key: 'booker_name'
      },
      {
        title: '结算(元)',
        dataIndex: 'total_cost'
      }
    ],
    data: []
  }

  getList = () => {}

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headers}>
          <div className={styles.org_title}>
            <div>TCL多媒体科技控股有限公司</div>
            <div>所有会议室 2020/11/30 - 2020/11/31 对账单明细</div>

            <Button type="primary" className={styles.gobackBtn}>
              返回
            </Button>
          </div>
          <div className={styles.params_propertys}>
            <Row>
              <Col span={6}>名称: TCL多媒体客机控股有限公司</Col>
              <Col span={6}>查询时段: 2020/11/01 - 2020/11/31</Col>
              <Col span={6}>优惠金额: 0 元</Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                结算状态: <span>未结算</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>联系方式: 0755-88291101</Col>
              <Col span={6}>查询日期: 2020-11-31 16:23:01</Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                合计金额: ￥22950.08
              </Col>
            </Row>
          </div>
        </div>

        <div className={styles.order_table}>
          <Table
            dataSource={this.state.data}
            columns={this.state.columns}
            bordered
          />
        </div>
      </div>
    )
  }
}
