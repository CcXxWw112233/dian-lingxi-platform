import React, { Component } from 'react'
import { DatePicker } from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import moment from 'moment'
import { dateFormat, isSamDay } from '../../../../../../utils/util'
import { hours_view_total } from '../../constants'
@connect(mapStateToProps)
export default class SelectDateArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start_time: 0,
      due_time: 0
    }
  }
  componentDidMount() {
    this.setDefault(this.props)
  }
  componentWillReceiveProps(props) {
    this.setDefault(props)
  }
  setDefault = props => {
    const { start_date = {}, end_date = {} } = props
    if (start_date.timestamp && end_date.timestamp) {
      this.setState(
        {
          start_time: start_date.timestamp,
          due_time: end_date.timestamp
        },
        () => {
          this.setPoitionArea()
        }
      )
    }
  }
  disabledTime = (e, time_type) => {
    const { start_time, due_time } = this.state
    const { start_date = {}, end_date = {} } = this.props
    if (time_type == 'start_time') {
      return (
        e.valueOf() < start_date.timestamp ||
        e.valueOf() > end_date.timestamp ||
        e.valueOf() >= due_time
      )
    } else if (time_type == 'due_time') {
      return (
        e.valueOf() < start_date.timestamp ||
        e.valueOf() > end_date.timestamp ||
        e.valueOf() <= start_time
      )
    }
  }
  setTime = ({ key, value }) => {
    this.setState(
      {
        [key]: value
      },
      () => {
        this.setPoitionArea()
      }
    )
  }
  setPoitionArea = () => {
    const { setPoitionArea } = this.props
    if (typeof setPoitionArea != 'function') return
    const { start_time, due_time } = this.state
    const { gantt_view_mode, ceilWidth, date_arr_one_level = [] } = this.props
    let start_index = 0
    let due_index = 0
    let start_position = 0
    let due_position = 0
    if (['month', 'relative_time'].includes(gantt_view_mode)) {
      start_index = date_arr_one_level.findIndex(item =>
        isSamDay(item.timestamp, start_time)
      )
      due_index =
        date_arr_one_level.findIndex(item =>
          isSamDay(item.timestamp, due_time)
        ) + 1
      start_position = start_index * ceilWidth
      due_position = due_index * ceilWidth
    } else if ('year' == gantt_view_mode) {
      start_index = date_arr_one_level.findIndex(
        item => item.timestamp <= start_time && item.timestampEnd >= start_time
      )
      due_index = date_arr_one_level.findIndex(
        item => item.timestamp <= due_time && item.timestampEnd >= due_time
      )

      if (start_index == 0) {
        start_position = 0
      } else {
        start_position =
          date_arr_one_level
            .slice(0, start_index)
            .map(item => item.last_date)
            .reduce((total, num) => total + num) * ceilWidth //该月之前所有日期长度之和
      }

      due_position =
        date_arr_one_level
          .slice(0, due_index + 1)
          .map(item => item.last_date)
          .reduce((total, num) => total + num) * ceilWidth //该月之前所有日期长度之和
    } else if ('week' == gantt_view_mode) {
      start_index = date_arr_one_level.findIndex(
        item => item.timestamp <= start_time && item.timestampEnd >= start_time
      )
      due_index =
        date_arr_one_level.findIndex(
          item => item.timestamp <= due_time && item.timestampEnd >= due_time
        ) + 1
      start_position = start_index * 7 * ceilWidth
      due_position = due_index * 7 * ceilWidth
    } else if ('hours' == gantt_view_mode) {
      start_index = date_arr_one_level.findIndex(item =>
        isSamDay(item.timestamp, start_time)
      )
      due_index = date_arr_one_level.findIndex(item =>
        isSamDay(item.timestamp, due_time)
      )
      start_position = start_index * ceilWidth
      due_position = (due_index + hours_view_total) * ceilWidth
    } else {
    }

    setPoitionArea({ start_position, due_position })
  }
  render() {
    const { start_time, due_time } = this.state
    return (
      <div className={styles.selectWrapper}>
        <div className={`${styles.content} ${styles.content_1}`}>
          <div className={`${styles.content_top_dec}`}></div>
          <div className={`${styles.content_bott_dec}`}>项目周期</div>
        </div>
        <div className={`${styles.content} ${styles.content_2}`}>
          <div className={`${styles.content_top}`}>开始时间</div>
          <div className={`${styles.content_bott}`}>
            <DatePicker
              allowClear={false}
              placeholder={'请选择'}
              disabledDate={e => this.disabledTime(e, 'start_time')}
              onChange={e => {
                this.setTime({ key: 'start_time', value: e.valueOf() })
              }}
              value={
                start_time
                  ? moment(dateFormat(start_time, 'yyyy-MM-dd'), 'YYYY/MM/DD ')
                  : undefined
              }
            />
          </div>
        </div>
        <div className={`${styles.content} ${styles.content_2}`}>
          <div className={`${styles.content_top}`}>结束时间</div>
          <div className={`${styles.content_bott}`}>
            <DatePicker
              allowClear={false}
              placeholder={'请选择'}
              disabledDate={e => this.disabledTime(e, 'due_time')}
              onChange={e => {
                this.setTime({ key: 'due_time', value: e.valueOf() })
              }}
              value={
                due_time
                  ? moment(dateFormat(due_time, 'yyyy-MM-dd'), 'YYYY/MM/DD ')
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: {
      date_arr_one_level,
      start_date,
      end_date,
      gantt_view_mode,
      ceilWidth
    }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    date_arr_one_level,
    start_date,
    end_date,
    gantt_view_mode,
    ceilWidth,
    projectDetailInfoData
  }
}
