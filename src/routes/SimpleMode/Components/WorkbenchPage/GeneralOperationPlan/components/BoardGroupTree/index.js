import React from 'react'
import styles from './index.less'

/** 运营总图的左侧项目和分组树形列表 */
export default class BoardGroupTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={styles.board_group_container}>
        <div className={styles.container_title_top}>{/* 预留的title */}</div>
        <div className={styles.container_content}></div>
      </div>
    )
  }
}
