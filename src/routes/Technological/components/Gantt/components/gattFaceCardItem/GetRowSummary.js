import React, { Component } from 'react'
import indexStyles from '../../index.less'
import styles from './index.less'
import { connect } from 'dva'
import CardDropDetail from './CardDropDetail.js'
import SummaryCards from './SummaryCards/index'

import { Popover, Dropdown } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  task_item_height_fold,
  task_item_height,
  ceil_height_fold
} from '../../constants'
import { selectBoardToSeeInfo } from '../../../../../../utils/businessFunction'
import {
  getDiffDate,
  isSamDay,
  removeEmptyArrayEle,
  transformTimestamp
} from '../../../../../../utils/util'

@connect(mapStateToProps)
export default class GetRowSummary extends Component {
  setBgSpecific = () => {
    let time_bg_color = ''
    let percent_class = ''
    let is_due = false
    const {
      itemValue: { lane_status, lane_overdue_count, lane_todo_count },
      list_data = []
    } = this.props
    if (lane_todo_count == 0 || !lane_todo_count) {
      //全部完成
      // time_bg_color = '#E9ECF2'
      time_bg_color = '#5A86F5'
      percent_class = styles.board_fold_complete
    } else {
      if (lane_overdue_count == 0) {
        //正在进行的项目（任务按期完成）
        // time_bg_color = '#91D5FF'
        time_bg_color = '#5A86F5'
        percent_class = styles.board_fold_ding
      } else {
        //正在进行的项目(存在逾期任务)
        // time_bg_color = '#ffccc7'
        time_bg_color = '#5A86F5'
        percent_class = styles.board_fold_due
        is_due = true
      }
    }

    return {
      time_bg_color,
      percent_class,
      is_due
    }
  }

  gotoBoard = e => {
    e.stopPropagation()
    const {
      list_id,
      dispatch,
      itemValue: { lane_name },
      gantt_board_id
    } = this.props
    if (gantt_board_id != '0') return
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        gantt_board_id: list_id,
        list_group: []
      }
    })
    selectBoardToSeeInfo({
      board_id: list_id,
      board_name: lane_name,
      dispatch,
      group_view_type: '1'
    })
  }

  // hanldListGroupMap = () => {
  //   const { list_data = [], ceilWidth } = this.props
  //   let left_arr = list_data.map(
  //     item => item.left + (item.time_span - 1) * ceilWidth
  //   ) //取到截止日期应该处的位置
  //   left_arr = Array.from(new Set(left_arr))
  //   const now = new Date().getTime()
  //   let left_map = left_arr.map(item => {
  //     let list = []
  //     for (let val of list_data) {
  //       if (
  //         val.left + (val.time_span - 1) * ceilWidth ==
  //         item //位置对应上
  //         // && val.is_realize != '1' //未完成
  //         // && val.end_time < now //过期
  //         // && val.is_has_end_time //存在实际的截止时间
  //       ) {
  //         list.push(val)
  //       }
  //     }
  //     return {
  //       left: item,
  //       list
  //     }
  //   })
  //   left_map = left_map.filter(item => item.list.length > 0)
  //   return left_map
  // }

  hanldListGroupMap1 = () => {
    const {
      list_data = [],
      ceilWidth,
      itemValue: {
        start_time: board_start_time,
        end_time: board_end_time,
        left: board_left,
        width
      }
    } = this.props
    const interval_timer = this.getMonthIntervalTimer()
    let left_arr = Object.keys(interval_timer || {}) || []
    let left_map = left_arr.map((item, index) => {
      let list = []
      let left
      for (let val of list_data) {
        if (new Date(val.end_time).getMonth() + 1 == item) {
          list.push(val)
        }
      }
      const { start_date, end_date } = interval_timer[item]
      // 对 头和尾 进行判断 如果是头部 那么就是从项目开始时间开始并且需要判断是否是从项目开始计算
      // 如果是尾部 那么就从截止时间放置并判断是否满月
      left = interval_timer.hasOwnProperty(item)
        ? start_date == item &&
          !isSamDay(interval_timer[item].start_time, board_start_time)
          ? board_left - 10
          : end_date == item &&
            !isSamDay(interval_timer[item].end_time, board_end_time)
          ? board_left + width - 10
          : interval_timer[item].left + 93 / 2 - 10
        : null
      return {
        date: item,
        list,
        left
      }
    })
    left_map = left_map.filter(item => item.list.length > 0)
    return left_map
  }

  // 某个点存在逾期的任务
  pointHasDueCard = ({ list = [] }) => {
    let has_due = false
    for (let val of list) {
      const new_due_time = transformTimestamp(val.due_time)
      if (
        !!new_due_time &&
        new Date().getTime() > new_due_time &&
        val.is_realize != '1'
      ) {
        //超时未完成才算逾期
        has_due = true
      }
    }
    return has_due
  }

  /**
   * 获取月视图下项目跨度时间区间
   *  {
   *    10: { start_time: '', due_time: '', left: '' }
   *  }
   *
   */
  getMonthIntervalTimer = () => {
    const {
      date_arr_one_level = [],
      itemValue: { start_time, end_time, width },
      ceilWidth
    } = this.props
    if (!start_time || !end_time) return
    // 获取两个日期之间的月份
    const month = getDiffDate(start_time, end_time)
    let time_obj = {}
    month.map(item => {
      let start_date = month[0].split('-')[1]
      let end_date = month[month.length - 1].split('-')[1]
      let Y = item.split('-')[0]
      let M = item.split('-')[1]
      const gold_item =
        date_arr_one_level.find(item => item.year == Y && item.month == M) || {}
      const gold_item_index = date_arr_one_level.findIndex(
        item => item.year == Y && item.month == M
      )
      time_obj[M] = {
        start_time: gold_item.timestamp,
        end_time: gold_item.timestampEnd
      }
      if (gold_item && !!Object.keys(gold_item).length) {
        // 该月之前所有日期的长度总和
        const date_length = !!removeEmptyArrayEle(
          date_arr_one_level
            .slice(0, gold_item_index)
            .map(item => item.last_date)
        ).length
          ? date_arr_one_level
              .slice(0, gold_item_index)
              .map(item => item.last_date)
              .reduce((total, num) => total + num)
          : 0
        // 获取是几号开始 (如果说长度在一个月之内 那么不需要计算从几号开始)
        const date_no =
          Object.keys(month).length == 1 || new Date(start_time).getDate() != 1
            ? 0
            : new Date(start_time).getDate()
        const origin_left = (date_length + date_no - 1) * ceilWidth
        time_obj[M]['left'] = origin_left
        if (Object.keys(month).length > 1) {
          // 需要添加一个开始日期和截止日期 因为对象的添加是无序排列的
          time_obj[M]['start_date'] = start_date
          time_obj[M]['end_date'] = end_date
        }
      }
    })
    return time_obj
  }

  // 处理周视图下时间间隔
  getWeekIntervalTimer = () => {
    const {
      date_arr_one_level = [],
      itemValue: { start_time, end_time, width },
      ceilWidth
    } = this.props
    if (!start_time || !end_time) return
    const month = getDiffDate(start_time, end_time)
    let arr = []
    month.map(item => {
      let Y = item.split('-')[0]
      let M = item.split('-')[1]
      date_arr_one_level.map(val => {
        const split = val.monthText
          ? val.monthText.indexOf('/') != -1
            ? val.monthText.split('/').indexOf(M) != -1
            : Number(val.monthText) == Number(M)
          : false
        if ((val.year == Y && val.month == M) || (val.year == Y && split)) {
          arr.push(val)
        }
      })
      // arr.slice()
    })
    const s_index = arr.findIndex(
      item => start_time >= item.timestamp && start_time <= item.timestampEnd
    )
    const e_index = arr.findIndex(
      item => end_time >= item.timestamp && end_time <= item.timestampEnd
    )
    const e_item =
      arr.find(
        item => end_time >= item.timestamp && end_time <= item.timestampEnd
      ) || {}
    if (s_index && e_index && s_index != -1 && e_index != -1) {
      if (s_index == e_index) {
        arr = [arr[s_index]]
      } else {
        arr = arr.slice(s_index, e_index)
        arr.push(e_item)
      }
    }

    return arr
  }

  hanldListGroupMap2 = () => {
    const {
      list_data = [],
      ceilWidth,
      itemValue: {
        start_time: board_start_time,
        end_time: board_end_time,
        left: board_left,
        width
      },
      gantt_view_mode
    } = this.props
    const left_arr = this.getWeekIntervalTimer() || []
    // 表示第一段日期长度
    let f_len = 0

    if (!(!board_start_time || !board_end_time) && !!left_arr.length) {
      f_len =
        ((left_arr[0].timestampEnd - board_start_time) * 83) /
        (left_arr[0].timestampEnd - left_arr[0].timestamp).toFixed(1)
    }

    let left_map = left_arr.map((item, index) => {
      let list = []
      let left
      for (const val of list_data) {
        if (
          val.end_time > item.timestamp &&
          val.end_time <= item.timestampEnd
        ) {
          list.push(val)
        }
      }
      // 1、头(0)：表示从项目起始点开始 - 自身的一半(10)
      // 2、尾(length-1)：表示从项目起始点开始 + 进度宽度 - 自身的一半(10)
      // 3、其他(都是满月的情况)：起始点 + 第一段的长度 + index(表示在第几个位置) * 格子宽度 - 格子一半 - 自身的一半 -----放置在中间
      left =
        index == 0 && !isSamDay(left_arr[0].timestamp, board_start_time)
          ? board_left - 10
          : index == left_arr.length - 1 &&
            !isSamDay(
              left_arr[left_arr.length - 1].timestampEnd,
              board_end_time
            )
          ? board_left + width - 10
          : board_left + f_len + index * 83 - 41.5 - 10
      return {
        left,
        list
      }
    })
    left_map = left_map.filter(item => item.list.length > 0)
    return left_map
  }

  // 渲染已过期的
  renderDueList = () => {
    const { list_data = [], ceilWidth, list_id, gantt_view_mode } = this.props
    const {
      itemValue: { top, start_time, end_time }
    } = this.props
    const left_map =
      gantt_view_mode == 'year'
        ? this.hanldListGroupMap1()
        : gantt_view_mode == 'week'
        ? this.hanldListGroupMap2()
        : []

    return left_map.map((item, key) => {
      const { list = [], left } = item
      // const realize_arr = list.filter(item => item.is_realize != '1')
      return (
        <>
          {this.pointHasDueCard({ list }) ? (
            <Popover
              getPopupContainer={triggerNode => triggerNode.parentNode}
              trigger={['click']}
              placement="bottom"
              content={
                <SummaryCards
                  list_id={list_id}
                  dispatch={this.props.dispatch}
                  list={list}
                />
              }
              key={key}
            >
              <div
                key={left}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  fontSize: '20px',
                  backgroundColor: this.pointHasDueCard({ list }) && '#FF7365',
                  // color: this.pointHasDueCard({ list }) && '#FF7875',
                  position: 'absolute',
                  cursor: 'pointer',
                  left: left + ceilWidth / 2,
                  // top: top + (ceil_height_fold - 6) / 2,
                  top: top + 2,
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{ color: '#fff' }}
                  className={globalStyles.authTheme}
                >
                  &#xe814;
                </div>
              </div>
            </Popover>
          ) : (
            <></>
          )}
        </>
      )
    })
  }

  render() {
    const { itemValue = {}, ceilWidth, is_group_folded } = this.props
    const {
      left,
      top,
      width,
      time_span,
      lane_schedule_count,
      lane_todo_count,
      lane_progress_percent
    } = itemValue
    const { percent_class, time_bg_color } = this.setBgSpecific()
    const percent = lane_progress_percent / 100
    // ||
    // Number(lane_schedule_count - lane_todo_count) /
    //   Number(lane_schedule_count)
    const percent_else = 1 - percent
    if (!lane_schedule_count) {
      return <></>
    }
    return (
      <div
        style={{ display: 'flex' }}
        data-targetclassname="specific_example"
        onMouseMove={e => e.stopPropagation()}
      >
        {/* <div
          data-targetclassname="specific_example"
          onMouseMove={e => e.stopPropagation()}
          style={{
            width: 10,
            position: 'absolute',
            zIndex: 1,
            height: 40,
            left: left - 10,
            top: top
          }}
        ></div> */}
        <div
          onMouseMove={e => e.stopPropagation()}
          // onClick={this.gotoBoard}
          className={`${indexStyles.specific_example} ${
            styles.summary_item
          } ${is_group_folded && styles.rates_ears}`}
          data-targetclassname="specific_example"
          style={{
            left: left,
            top: is_group_folded ? top - 16 : top,
            width: (width || 6) + 6,
            height: is_group_folded ? 12 : task_item_height_fold,
            backgroundColor: percent == '1' ? 'transparent' : '#86B3FF',
            overflow: is_group_folded && 'visible'
          }}
        >
          {/* 进度填充 */}
          <div
            data-targetclassname="specific_example"
            className={` ${percent_class}
            ${
              percent == 1
                ? styles.summary_item_left_full
                : styles.summary_item_left
            }`}
            style={{
              width: `${percent * 100}%`,
              height: is_group_folded ? 12 : task_item_height_fold,
              border: `1px solid ${time_bg_color}`,
              display: percent == 0 ? 'none' : 'block'
            }}
          ></div>
          {is_group_folded && (
            <>
              <div
                className={`${styles.ears_left_triangle} ${percent &&
                  percent != 0 &&
                  styles.l_triangle_percent}`}
              ></div>
              <div
                style={{
                  left: '0px',
                  backgroundColor: percent && percent != 0 && '#5A86F5'
                }}
                className={`${styles.ears_left_triangle_mask}`}
              ></div>
              <div
                className={`${styles.ears_right_triangle} ${percent == 1 &&
                  styles.r_triangle_percent}`}
              ></div>
              <div
                style={{
                  right: '0px',
                  backgroundColor: percent == 1 && '#5A86F5'
                }}
                className={`${styles.ears_right_triangle_mask}`}
              ></div>
            </>
          )}
          {/* <div
            data-targetclassname="specific_example"
            className={`${styles.summary_item_right} ${percent == 0 &&
              styles.summary_item_right_full}`}
            style={{
              width: `${percent_else * 100}%`,
              height: task_item_height_fold,
              display: percent == 1 ? 'none' : 'block'
            }}
          ></div> */}
        </div>
        {/* <div
          data-targetclassname="specific_example"
          onMouseMove={e => e.stopPropagation()}
          style={{
            width: 16,
            height: 40,
            position: 'absolute',
            zIndex: 1,
            left: left + time_span * ceilWidth - 6,
            top: top
          }}
        ></div> */}
        {!is_group_folded && this.renderDueList()}
      </div>
    )
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: {
    datas: {
      group_list_area_section_height,
      ceilWidth,
      gantt_board_id,
      date_arr_one_level = [],
      gantt_view_mode
    }
  }
}) {
  return {
    group_list_area_section_height,
    ceilWidth,
    gantt_board_id,
    date_arr_one_level,
    gantt_view_mode
  }
}
