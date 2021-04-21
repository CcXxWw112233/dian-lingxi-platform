import React from 'react'
import {
  getStatus,
  MilestoneTotalHeight,
  MilestoneTypes,
  MilestoneWidth
} from '../../constans'
// import SubMilestone from '../SubMilestone'
import styles from './index.less'
import moment from 'moment'

/** 运营总图的运营图 */
export default class OverviewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 运营总图的数据 */
      overview_data: [
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

  /** 计算两个里程碑之间的长度距离 */
  computedMilestoneBettweenWidth = () => {

  }

  /** 渲染一级里程碑的数据
   * @param {{data: {}, index: number, nextData: ?{}}} props React组件的props
   */
  ParentMilestonRender = props => {
    /** 当前渲染的数据
     * @param {{name: string, id: string}} data 数据
     * @param {number} index 当前序号
     */
    const { data, index, nextData } = props
    return (
      <div className={styles.parent_milestone}>
        <span className={styles.milestone_name}>{data.name}</span>
        <span className={styles.milestone_index}>
          <b>{index}</b>
        </span>
      </div>
    )
  }

  /**
   * 渲染二级节点的线段 (业务变动，暂时废弃)
   * @param {{data: {}}} props 当前组件的ReactProps
   * @returns {React.ReactNode}
   */
  SubMilestoneRender = props => {
    /**  */
    const { data, type } = props
    /** 状态中的颜色 */
    const color = getStatus(type).color
    return (
      <div
        className={styles.milestone_step_item}
        style={{ backgroundColor: color }}
      ></div>
    )
  }

  render() {
    const { overview_data = [] } = this.state
    return (
      <div className={styles.overview_container}>
        <div className={styles.header_top}>
          {/** 占位元素，和左侧等高,也用于显示一级里程碑 */}
        </div>
        <div className={styles.overview_content}>
          <div
            className={styles.milestone_total}
            style={{ marginBottom: MilestoneTotalHeight }}
          >
            {overview_data.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={styles.milestone_steps}
                  style={{ width: MilestoneWidth }}
                >
                  <this.ParentMilestonRender
                    data={item}
                    nextData={overview_data[index + 1] || null}
                    index={index + 1}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
