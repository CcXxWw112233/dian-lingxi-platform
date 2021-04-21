import React from 'react'
import {
  DaysWidth,
  getStatus,
  MilestoneTotalHeight,
  MilestoneTypes
} from '../../constans'
// import SubMilestone from '../SubMilestone'
import styles from './index.less'
import moment from 'moment'

/** 关键控制点的一级里程碑列表 */
export default class MilestoneTimeLine extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 在第一个里程碑时间之前的最小日期
       * @default number 10 '天'
       */
      beforeStartMilestoneDays: 10
    }
  }

  /** 计算两个里程碑之间的长度距离
   * @param {{deadline: string}} start 开始的点
   * @param {{deadline: string}} end 结束的点
   * @param {number} index 当前的下标
   */
  computedMilestoneBettweenWidth = (start = {}, end) => {
    /** 取时间 */
    const { deadline = 0 } = start
    if (end) {
      /** end的时间 */
      const endDeadline = end.deadline
      /** 间隔时间 */
      const bettweenDays = moment(endDeadline).diff(moment(deadline), 'days')
      return Math.floor(Math.abs(bettweenDays) * DaysWidth)
    }
    return 200
  }

  /** 渲染一级里程碑的数据
   * @param {{data: {}, index: number}} props React组件的props
   */
  ParentMilestonRender = props => {
    /** 当前渲染的数据
     * @param {{name: string, id: string}} data 数据
     * @param {number} index 当前序号
     */
    const { data, index } = props
    return (
      <div className={styles.parent_milestone}>
        <span className={styles.milestone_name}>{data.name}</span>
        <span className={styles.milestone_index}>
          <b>{index}</b>
          <span className={styles.milestone_time}>
            {moment(data.deadline).format('DD/MM/YYYY')}
          </span>
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
    const { type } = props
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
    const { data = [] } = this.props
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
            {/* 如果有比第一个更前的时间 */}
            <div
              className={styles.milestone_steps}
              style={{
                width: Math.floor(
                  this.state.beforeStartMilestoneDays * DaysWidth
                )
              }}
            >
              <this.SubMilestoneRender
                type={MilestoneTypes.NormalIncomplete.status}
              />
            </div>
            {data.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={styles.milestone_steps}
                  style={{
                    width: this.computedMilestoneBettweenWidth(
                      item,
                      data[index + 1]
                    )
                  }}
                >
                  <this.SubMilestoneRender
                    data={item}
                    type={MilestoneTypes.NormalIncomplete.status}
                  />
                  <this.ParentMilestonRender
                    data={item}
                    nextData={data[index + 1] || null}
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
