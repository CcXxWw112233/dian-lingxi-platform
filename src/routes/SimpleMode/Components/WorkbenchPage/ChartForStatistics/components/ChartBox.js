import React from 'react'
import styles from './ChartBox.less'

/**
 * 公共的包含图表的元素
 */
export default class ChartBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { children, title } = this.props
    return (
      <div className={styles.container}>
        <div className={styles.container_title}>
          <span className={styles.title}>{title}</span>
          {/* <span className={styles.qrcode_icon}>c</span> */}
        </div>
        <div className={styles.chart_container}>{children}</div>
      </div>
    )
  }
}
