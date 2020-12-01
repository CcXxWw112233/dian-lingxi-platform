import { Button } from 'antd'
import React from 'react'
import styles from './index.less'

export default class InPayment extends React.Component {
  state = {}
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
        </div>
      </div>
    )
  }
}
