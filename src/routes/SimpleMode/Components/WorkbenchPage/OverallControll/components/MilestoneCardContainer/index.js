import React from 'react'
import styles from './index.less'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  DaysWidth,
  getStatus,
  IconMarginRight,
  IconWidth,
  MilestoneTypes,
  OverallItem,
  OverallRowHeight
} from '../../constans'

/** 任务类型图标 */
const cardIcon = require('../../../../../../../assets/overallControll/card.png')

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
      dataForRender: [
        // [
        //   {
        //     id: '1384780487343607808',
        //     name: '任务1',
        //     status: '0',
        //     type: '2',
        //     list_names: [],
        //     end_time: moment().valueOf(),
        //     is_parent: true,
        //     fields: [],
        //     _left: 2,
        //     _end: 6
        //   },
        //   {
        //     id: '1384780487343607809',
        //     name: '任务2',
        //     status: '0',
        //     type: '2',
        //     list_names: [],
        //     end_time: moment()
        //       .subtract(26, 'day')
        //       .valueOf(),
        //     is_parent: true,
        //     fields: [],
        //     _left: 9,
        //     _end: 18
        //   }
        // ],
        // [
        //   {
        //     id: '1384780487343607810',
        //     name: '任务3',
        //     status: '0',
        //     type: '2',
        //     list_names: [],
        //     end_time: moment()
        //       .add(25, 'day')
        //       .valueOf(),
        //     is_parent: true,
        //     fields: [],
        //     _left: 15,
        //     _end: 19
        //   }
        // ],
        // [
        //   {
        //     id: '1384780487343607811',
        //     name: '任务4',
        //     status: '0',
        //     type: '2',
        //     list_names: [],
        //     end_time: moment()
        //       .add(46, 'day')
        //       .valueOf(),
        //     is_parent: true,
        //     fields: [],
        //     _left: 2,
        //     _end: 7
        //   },
        //   {
        //     id: '1384780487343607812',
        //     name: '任务5',
        //     status: '0',
        //     type: '2',
        //     list_names: [],
        //     end_time: moment()
        //       .add(50, 'day')
        //       .valueOf(),
        //     is_parent: true,
        //     fields: [],
        //     _left: 13,
        //     _end: 19
        //   },
        //   {
        //     id: '1384780487343607813',
        //     name: '任务6',
        //     status: '0',
        //     type: '2',
        //     list_names: [],
        //     end_time: moment()
        //       .add(10, 'day')
        //       .valueOf(),
        //     is_parent: true,
        //     fields: [],
        //     _left: 22,
        //     _end: 28
        //   }
        // ]
      ]
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
      return step - 1
    }
    return val._left
  }

  /** 获取状态对象详情
   * @returns {{status: string, color: string}} 获取的详情
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
    return null
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
      >
        {dataForRender.map((array, index) => {
          return (
            <div
              className={styles.overall_row}
              key={`overall_row_${index + 1}`}
              style={{ height: OverallRowHeight }}
            >
              {array.map((item, i) => {
                /** 左边距 */
                const left = this.getNextLeft(item, array[i - 1])
                return (
                  <div
                    className={`${styles.overall_item}`}
                    key={item.id}
                    style={{
                      marginLeft: left * DaysWidth,
                      ...OverallItem
                    }}
                  >
                    <div
                      className={`${styles.left_icon} ${
                        item.status === MilestoneTypes.beOverdue.status
                          ? styles.beOverdueBlur
                          : ''
                      } ${
                        item.status === MilestoneTypes.IncompleteDone.status
                          ? styles.IncompleteDoneBlur
                          : ''
                      }`}
                      style={{
                        width: IconWidth,
                        marginRight: IconMarginRight,
                        backgroundColor: this.getStatusObject(item).color
                      }}
                    >
                      <img src={cardIcon} />
                    </div>
                    <div className={styles.right_content}>
                      <span className={styles.overall_item_time}>
                        {moment(item.end_time).format('DD/MM')}
                      </span>
                      <div className={styles.overall_item_title}>
                        {item.name}
                      </div>
                      <div className={styles.properties}>
                        {this.getSubTitle(item.fields)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
