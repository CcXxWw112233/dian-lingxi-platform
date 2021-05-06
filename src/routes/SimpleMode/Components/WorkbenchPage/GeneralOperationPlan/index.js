import React from 'react'
import BoardGroupTree from './components/BoardGroupTree'
import OverviewContainer from './components/OverviewContainer'
import styles from './index.less'

export default class GeneralOperationPlan extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { workbenchBoxContent_height } = this.props
    return (
      <div
        className={styles.container}
        style={{ height: workbenchBoxContent_height }}
      >
        <div className={styles.container_header}>
          运营总览
          {/* 预留过滤选项列表 */}
        </div>
        <div className={styles.container_content}>
          <div className={styles.content_board_group}>
            {/* 左侧项目和分组列表 */}
            <BoardGroupTree />
          </div>
          <div className={styles.content_overview}>
            {/* 右侧节点列表 */}
            <OverviewContainer />
          </div>
        </div>
      </div>
    )
  }
}
