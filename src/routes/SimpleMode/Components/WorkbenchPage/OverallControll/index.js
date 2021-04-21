import React from 'react'
import MilestoneTimeLine from './components/MilestoneTimeLine'
import styles from './index.less'
import moment from 'moment'
import BoardGroupTree from './components/BoardGroupTree'
import MilestoneCardContainer from './components/MilestoneCardContainer'

/** 关键控制点的组件 */
export default class OverallControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 关键控制点的模拟数据 */
      overall_data: [
        {
          id: 'g_1',
          name: '分组1',
          child: []
        },
        {
          id: 'g_2',
          name: '分组2',
          child: []
        }
      ],
      /** 一级里程碑的数据 */
      firstMilestoneData: [
        {
          name: '土地公告0',
          deadline: moment()
            .subtract(20, 'day')
            .valueOf(),
          id: '0'
        },
        {
          name: '土地公告',
          deadline: moment().valueOf(),
          id: '1'
        },
        {
          name: '土地公告2',
          id: '7',
          deadline: moment()
            .add(1, 'month')
            .valueOf()
        },
        {
          name: '土地公告3',
          id: '11',
          deadline: moment()
            .add(3, 'month')
            .valueOf()
        }
      ]
    }
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
            <MilestoneTimeLine data={this.state.firstMilestoneData} />
            <MilestoneCardContainer />
          </div>
        </div>
      </div>
    )
  }
}
