import React from 'react'
import {
  beforeStartMilestoneDays,
  DaysWidth,
  getStatus,
  MilestoneTotalHeight,
  MilestoneTypes
} from '../../constans'
// import SubMilestone from '../SubMilestone'
import styles from './index.less'
import moment from 'moment'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

/** 关键控制点的一级里程碑列表 */
export default class MilestoneTimeLine extends React.Component {
  static propTypes = {
    /** 控制节点的数据 */
    listData: PropTypes.array,
    /** 一级里程碑的数据 */
    data: PropTypes.array,
    /** 控制点数据中最小的时间 */
    minTime: PropTypes.any,
    /** 控制点数据中最大的时间 */
    maxTime: PropTypes.any,
    /** 最大时间偏移 */
    maxConstans: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      /** 在第一个里程碑时间之前的最小日期
       * @default number 10 '天'
       */
      beforeStartMilestoneDays: 10
    }
    this.getMinTimeWidth = debounce(this.getMinTimeWidth, 50)
    this.getMaxTimeWidth = debounce(this.getMaxTimeWidth, 50)
  }

  /** 计算两个里程碑之间的长度距离
   * @param {{deadline: string}} start 开始的点
   * @param {{deadline: string}} end 结束的点
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
    return this.getMaxTimeWidth()
  }

  componentDidUpdate(prev) {
    if (prev.minTime !== this.props.minTime) {
      this.getMinTimeWidth()
    }
  }

  /** 一级里程碑的结束点距离控制点的最后时间距离多少天 */
  getMaxTimeWidth = () => {
    const { maxTime, data = [] } = this.props
    if (!data.length) return 0
    /** 一级里程碑的最后一个数据，用来判断最大时间距离它的时间有多长
     * 里程碑数据的时间用 deadline
     */
    const endData = data[data.length - 1]
    /** 距离几天 */
    const timeStep = Math.abs(
      moment(endData.deadline).diff(moment(maxTime), 'day')
    )
    const span = Math.floor(timeStep * DaysWidth)
    return span || 0
  }

  /** 获取最小时间在里程碑中的宽度 */
  getMinTimeWidth = () => {
    const { minTime, data = [] } = this.props
    /** 一级里程碑的第一个数据，用来判断最小时间距离它的时间有多长
     * 里程碑数据的时间用 deadline
     */
    const firstData = data[0]
    if (!firstData) return
    /** 距离几天 */
    const timeStep = Math.abs(
      moment(firstData.deadline).diff(moment(minTime), 'day')
    )
    this.setState({
      beforeStartMilestoneDays: Math.max(timeStep, beforeStartMilestoneDays)
    })
  }

  /** 渲染一级里程碑的数据
   * @param {{data: {}, index: number}} props React组件的props
   */
  ParentMilestonRender = props => {
    const { workbenchBoxContent_height } = this.props
    /** 当前渲染的数据
     * @param {{name: string, id: string}} data 数据
     * @param {number} index 当前序号
     */
    const { data, index, prevData } = props
    /** 渲染的时间 */
    let milestone_time = ''
    if (prevData) {
      if (moment(prevData.deadline).isSame(data.deadline, 'year')) {
        milestone_time = moment(data.deadline).format('M/D')
      } else {
        milestone_time = moment(data.deadline).format('YYYY/M/D')
      }
    } else {
      milestone_time = moment(data.deadline).format('YYYY/M/D')
    }
    return (
      <div
        className={styles.parent_milestone}
        style={{ height: workbenchBoxContent_height - 100 }}
      >
        <span
          className={styles.milestone_name}
          style={{ bottom: 'calc(100vh - 195px)' }}
        >
          {data.name}
        </span>
        <span className={styles.milestone_index}>
          <b>{index}</b>
          <span className={styles.milestone_time}>{milestone_time}</span>
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
            style={{
              marginTop: MilestoneTotalHeight
              // width: currentDom.currentWidth
            }}
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
              /** 里程碑之间的宽度 */
              const W = this.computedMilestoneBettweenWidth(
                item,
                data[index + 1]
              )
              return (
                <div
                  key={item.id}
                  className={styles.milestone_steps}
                  style={{
                    width: W
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
                    prevData={data[index - 1]}
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
