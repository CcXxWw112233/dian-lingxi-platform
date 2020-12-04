import { Col, Row } from 'antd'
import React from 'react'
import styles from './index.less'
import { dateFormat } from '../../../../../../../utils/util'

export default class PrintPage extends React.PureComponent {
  state = {}
  componentDidMount() {
    // console.log(this.props)
    this.print()
  }

  print = () => {
    const { onPrintEnd } = this.props
    window.print()
    setTimeout(() => {
      onPrintEnd && onPrintEnd()
    }, 10)
  }

  // 渲染head
  renderThead = () => {
    const { tableColumns } = this.props
    return (tableColumns || []).map(item => {
      return <th key={item.key || item.dataIndex}>{item.title}</th>
    })
  }

  renderTbody = () => {
    const { tableData, tableColumns } = this.props
    const arr = (tableData || []).map(item => {
      return (
        <tr key={item.id}>
          {tableColumns.map(col => {
            return (
              <td key={col.key || col.dataIndex}>
                {col.key ? col.render(item) : item[col.dataIndex]}
              </td>
            )
          })}
        </tr>
      )
    })
    return arr
  }

  render() {
    const { printData = {} } = this.props
    const { lessee_org = {} } = printData
    return (
      <div className={styles.container}>
        <div className={styles.prnt_body}>
          <div className={styles.print_title}>
            <div>{lessee_org.name}</div>
            <div>{(printData.title || '').replace(lessee_org.name, '')}</div>
          </div>
          <div className={styles.order_propertys}>
            <Row type="flex">
              <Col xs={6}>名称: {lessee_org.name}</Col>
              <Col xs={10}>
                查询时段:{' '}
                {dateFormat(+(printData.bill_start_time + '000'), 'yyyy/MM/dd')}{' '}
                - {dateFormat(+(printData.bill_end_time + '000'), 'yyyy/MM/dd')}
              </Col>
              <Col xs={4}>
                优惠金额:{' '}
                <span style={{ margin: '0 10px' }}>
                  {printData.discount_cost}
                </span>{' '}
                元
              </Col>
              <Col xs={4} style={{ textAlign: 'right' }}>
                结算状态:{' '}
                <span
                  className={
                    printData.bill_status === '1'
                      ? styles.notsettlement
                      : styles.settlement
                  }
                >
                  {printData.bill_status === '1'
                    ? '未结算'
                    : printData.bill_status === '2'
                    ? '已结算'
                    : '未知状态'}
                </span>
              </Col>
            </Row>
            <Row type="flex">
              <Col xs={6}>
                联系方式: {printData.contact_number || '暂无联系方式'}
              </Col>
              <Col xs={10}>
                查询日期:{' '}
                {dateFormat(
                  +(printData.create_time + '000'),
                  'yyyy-MM-dd HH:mm:ss'
                )}
              </Col>
              <Col xs={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                合计金额: ￥({printData.total_cost} -{' '}
                {printData.discount_cost || 0}) = {printData.payment_cost}
              </Col>
            </Row>
          </div>
          <div className={styles.order_table}>
            <table>
              <thead>
                <tr>{this.renderThead()}</tr>
              </thead>
              <tbody>{this.renderTbody()}</tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
