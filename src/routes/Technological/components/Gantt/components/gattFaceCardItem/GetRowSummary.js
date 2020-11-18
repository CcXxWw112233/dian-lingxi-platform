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
import { isSamDay, transformTimestamp } from '../../../../../../utils/util'

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
      time_bg_color = '#CDD1DF'
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
    // const percent = `${((lane_schedule_count - lane_overdue_count) / lane_schedule_count) * 100}%`
    // if (lane_status == '1') { //完成
    //     time_bg_color = '#E9ECF2'
    //     percent_class = styles.board_fold_complete
    // } else if (lane_status == '2') { //正在进行的项目（任务按期完成）
    //     time_bg_color = '#91D5FF'
    //     percent_class = styles.board_fold_ding
    // } else if (lane_status == '3') { //正在进行的项目(存在逾期任务)
    //     time_bg_color = '#FFCCC7'
    //     percent_class = styles.board_fold_due
    //     is_due = true
    // } else {

    // }

    return {
      time_bg_color,
      percent_class,
      is_due
    }
  }
  // setBgSpecific = () => {
  //     let time_bg_color = ''
  //     let percent_class = ''
  //     let is_due = false
  //     const { itemValue: { end_time }, list_data = [] } = this.props
  //     const now = new Date().getTime()
  //     const total = list_data.length
  //     const realize_count = list_data.filter(item => item.is_realize == '1').length
  //     const due_not_realize_count = list_data.filter(item => item.is_realize == '0' && item.end_time < end_time).length //逾期未完成个数

  //     if (realize_count == total) { //完成
  //         time_bg_color = '#BFBFBF'
  //         percent_class = styles.board_fold_complete
  //     } else {
  //         if (due_not_realize_count > 0) { //项目汇总时间在当前之前, 逾期
  //             time_bg_color = '#FFCCC7'
  //             percent_class = styles.board_fold_due
  //             is_due = true
  //         } else {
  //             time_bg_color = '#91D5FF'
  //             percent_class = styles.board_fold_ding
  //         }
  //     }

  //     return {
  //         percent: `${(realize_count / total) * 100}%`,
  //         time_bg_color,
  //         percent_class,
  //         is_due
  //     }
  // }

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
    // dispatch({
    //     type: 'gantt/getGanttData',
    //     payload: {

    //     }
    // })
  }

  hanldListGroupMap = () => {
    const { list_data = [], ceilWidth } = this.props
    let left_arr = list_data.map(
      item => item.left + (item.time_span - 1) * ceilWidth
    ) //取到截止日期应该处的位置
    left_arr = Array.from(new Set(left_arr))
    const now = new Date().getTime()
    let left_map = left_arr.map(item => {
      let list = []
      for (let val of list_data) {
        if (
          val.left + (val.time_span - 1) * ceilWidth ==
          item //位置对应上
          // && val.is_realize != '1' //未完成
          // && val.end_time < now //过期
          // && val.is_has_end_time //存在实际的截止时间
        ) {
          list.push(val)
        }
      }
      return {
        left: item,
        list
      }
    })
    left_map = left_map.filter(item => item.list.length > 0)
    return left_map
  }

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
    const interval_timer = this.getIntervalTimer()
    let left_arr = Object.keys(interval_timer || {}) || []
    // let left_arr = list_data.map(item =>
    //   String(new Date(item.end_time).getMonth() + 1).length <= 1
    //     ? '0' + (new Date(item.end_time).getMonth() + 1)
    //     : String(new Date(item.end_time).getMonth() + 1)
    // )
    // console.log(left_arr, 'left_arr111')
    // left_arr = Array.from(new Set(left_arr))
    let left_map = left_arr.map((item, index) => {
      let list = []
      let left
      for (let val of list_data) {
        if (new Date(val.end_time).getMonth() + 1 == item) {
          list.push(val)
        }
      }
      left = interval_timer.hasOwnProperty(item)
        ? // index == 0
          //   ? board_left
          //   : index == left_arr.length - 1
          //   ? board_left + width - 10
          //   :
          interval_timer[item].left + 46.5 - 10
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
   * 获取当前项目跨度时间区间
   *  {
   *    10: { start_time: '', due_time: '', left: '' }
   *  }
   *
   */
  getIntervalTimer = () => {
    const {
      date_arr_one_level = [],
      itemValue: { start_time, end_time, width },
      ceilWidth
    } = this.props
    if (!start_time || !end_time) return
    // 获取两个日期之间的月份
    const month = this.getDiffDate(start_time, end_time)
    let time_obj = {}
    month.map(item => {
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
      if (gold_item && Object.keys(gold_item).length) {
        // 该月之前所有日期的长度总和
        const date_length = date_arr_one_level
          .slice(0, gold_item_index)
          .map(item => item.last_date)
          .reduce((total, num) => total + num)
        // 获取是几号开始 (如果说长度在一个月之内 那么不需要计算从几号开始)
        const date_no =
          Object.keys(month).length == 1 || new Date(start_time).getDate() != 1
            ? 0
            : new Date(start_time).getDate()
        const origin_left = (date_length + date_no - 1) * ceilWidth
        time_obj[M]['left'] = origin_left
      }
    })
    return time_obj
  }

  // 获取两个日期之间的月份 ["2020-10", "2020-11", "2020-12", "2021-01"]
  getDiffDate = (minDate, maxDate) => {
    let startDate = new Date(minDate)
    let endDate = new Date(maxDate)
    let months = []
    //把时间的天数都设置成当前月第一天
    startDate.setDate(1)
    endDate.setDate(1)
    // new Date(yyyy-MM-dd) 不知为何有时候小时是 08 有时候是00
    endDate.setHours(0)
    startDate.setHours(0)
    while (endDate.getTime() >= startDate.getTime()) {
      let year = startDate.getFullYear()
      let month = startDate.getMonth() + 1
      //加一个月
      startDate.setMonth(month)
      if (month.toString().length == 1) {
        month = '0' + month
      }
      months.push(year + '-' + month)
    }
    return months
  }

  // 渲染已过期的
  renderDueList = () => {
    const { list_data = [], ceilWidth, list_id } = this.props
    const {
      itemValue: { top }
    } = this.props
    const left_map = this.hanldListGroupMap1()
    // if (!this.setBgSpecific().is_due) {
    //     return <React.Fragment></React.Fragment>
    // }

    return left_map.map((item, key) => {
      const { list = [], left } = item
      // console.log(this.pointHasDueCard({ list }))
      // const realize_arr = list.filter(item => item.is_realize != '1')
      return (
        <>
          {this.pointHasDueCard({ list }) && (
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
              {/* <div
                key={left}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 6,
                  backgroundColor: this.pointHasDueCard({ list }) && '#FF7365',
                  color: '#FF7875',
                  position: 'absolute',
                  cursor: 'pointer',
                  left: left + ceilWidth / 2,
                  top: top + (ceil_height_fold - 6) / 2,
                  zIndex: 1
                }}
              ></div> */}
            </Popover>
          )}
        </>
      )
    })
  }

  render() {
    const { itemValue = {}, ceilWidth } = this.props
    const {
      left,
      top,
      width,
      time_span,
      lane_schedule_count,
      lane_todo_count
    } = itemValue
    const { percent_class, time_bg_color } = this.setBgSpecific()
    const percent =
      Number(lane_schedule_count - lane_todo_count) /
      Number(lane_schedule_count)
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
          className={`${indexStyles.specific_example} ${styles.summary_item}`}
          data-targetclassname="specific_example"
          style={{
            left: left,
            top: top,
            width: (width || 6) + 6,
            height: task_item_height_fold,
            // // background: this.setBgSpecific().time_bg_color,
            // padding: 0,
            // zIndex: 0,
            backgroundColor: '#86B3FF'
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
              height: task_item_height_fold,
              border: `1px solid ${time_bg_color}`,
              display: percent == 0 ? 'none' : 'block'
            }}
          ></div>
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
        {this.renderDueList()}
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
      date_arr_one_level = []
    }
  }
}) {
  return {
    group_list_area_section_height,
    ceilWidth,
    gantt_board_id,
    date_arr_one_level
  }
}
