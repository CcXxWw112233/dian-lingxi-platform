import React, { useState } from 'react'
import styles from './index.less'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  ActionId,
  ActionType,
  DaysWidth,
  getStatus,
  IconMarginRight,
  IconWidth,
  MeetingId,
  MeetingType,
  MilestoneTypes,
  OverallItem,
  OverallRowHeight,
  OverallRowPaddingTB
} from '../../constans'
import DescriptionRender from '../DescriptionRender'

/** 任务类型图标 */
const cardIcon = require('../../../../../../../assets/overallControll/card.png')
/** 会议类型图标 */
const meetingIcon = require('../../../../../../../assets/overallControll/meeting.png')

/** 里程碑任务的详情列表 */
export default class MilestoneCardContainer extends React.Component {
  static propTypes = {
    /** 外部传进来的控制点数据，分组数据
     * @parent OverallControll
     */
    datas: PropTypes.array,
    /** 控制点数据的最小时间 */
    minTime: PropTypes.any,
    /** 控制点数据的最大时间 */
    maxTime: PropTypes.any
  }
  constructor(props) {
    super(props)
    this.state = {
      /** 用于渲染的数据 */
      dataForRender: []
    }
  }

  componentDidMount() {
    // this.getMatrixArray()
  }

  // componentDidUpdate(prev) {
  //   if (
  //     prev.minTime !== this.props.minTime ||
  //     prev.maxTime !== this.props.maxTime
  //   ) {

  //   }
  // }

  /** 获取marginleft的数值
   * @param {{_left: number, _end: number}} val 当前的数据
   * @param {{_left: number, _end: number}} prev 上一个数据
   * @returns {number}
   */
  getNextLeft = (val, prev) => {
    if (!val) return 0
    if (prev) {
      /** 第二个与第一个的左边距 */
      const step = Math.abs(prev._end - val._left)
      return step - 2
    }
    return val._left
  }

  /** 获取状态对象详情
   * @returns {{status: string, color: string, opacity: number}} 获取的详情
   */
  getStatusObject = val => {
    const { status } = val
    /** 获取到的状态详情 */
    const statusObject = getStatus(status)
    return statusObject
  }

  /** 获取自定义字段
   * @param {{items: {}[]}} fields 字段列表
   */
  getSubTitle = fields => {
    const { first_multiple_values = [] } = fields
    return first_multiple_values.join('')
  }

  /** 点击当个控制点的事件
   * @param {{id: string}} val 点击的内容
   */
  handleOverallControllItem = val => {
    // console.log(val)
  }

  render() {
    // console.log(this.props.datas)
    // const { dataForRender } = this.state
    const {
      datas: dataForRender,
      onMouseEnter,
      active,
      onMouseLeave,
      onMouseOut
    } = this.props
    return (
      <div
        className={`${styles.milestone_card_container} ${
          active ? styles.active : ''
        }`}
        onMouseOver={() => onMouseEnter && onMouseEnter()}
        onMouseEnter={() => onMouseEnter && onMouseEnter()}
        onMouseLeave={() => onMouseLeave && onMouseLeave()}
        onMouseOut={() => onMouseOut && onMouseOut()}
        style={{
          paddingTop: OverallRowPaddingTB,
          paddingBottom: OverallRowPaddingTB
        }}
      >
        {dataForRender.map((array, index) => {
          return (
            <div
              className={styles.overall_row}
              key={`overall_row_${index + 1}`}
              style={{
                height: OverallRowHeight
              }}
            >
              {array.map((item, i) => {
                /** 左边距 */
                const left = item._left
                /** top的值 */
                const top = Math.floor(
                  (OverallRowHeight - OverallItem.minHeight) / 2
                )
                /** 当前数据的状态详情 */
                const ItemStatus = this.getStatusObject(item)
                /** 当前数据类型 */
                const ItemType =
                  (item.fields || {}).custom_type === MeetingId
                    ? MeetingType
                    : (item.fields || {}).custom_type === ActionId
                    ? ActionType
                    : ''
                return (
                  <DescriptionRender
                    key={item.id}
                    data={item}
                    title={item.name}
                  >
                    <div
                      className={`${styles.overall_item}`}
                      style={{
                        /** 防止第一条之后的数据左边距的位置不对 */
                        position: 'absolute',
                        marginLeft: Math.floor(left * this.props.dayWidth),
                        ...OverallItem,
                        opacity: ItemStatus.opacity,
                        top
                      }}
                      onClick={() => this.handleOverallControllItem(item)}
                    >
                      <div
                        className={`${styles.left_icon} ${
                          item.status ===
                          MilestoneTypes.WarnWillIncomplete.status
                            ? styles.WarnWillIncompleteBlur
                            : ''
                        } ${
                          item.status === MilestoneTypes.IncompleteDone.status
                            ? styles.IncompleteDoneBlur
                            : ''
                        }`}
                        style={{
                          width: IconWidth,
                          marginRight: IconMarginRight,
                          backgroundColor: ItemStatus.color
                        }}
                      >
                        <img
                          src={
                            ItemType === ActionType
                              ? cardIcon
                              : ItemType === MeetingType
                              ? meetingIcon
                              : ''
                          }
                        />
                      </div>
                      <div className={styles.right_content}>
                        <span className={styles.overall_item_time}>
                          {moment(item.end_time).format('M/D')}
                        </span>
                        <div className={styles.overall_item_title}>
                          {item.name}
                        </div>
                        <div className={styles.properties}>
                          {this.getSubTitle(item.fields)}
                        </div>
                      </div>
                    </div>
                  </DescriptionRender>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
