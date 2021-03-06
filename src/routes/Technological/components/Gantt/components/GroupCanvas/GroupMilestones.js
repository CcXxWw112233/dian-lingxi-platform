import { connect } from 'dva'
import React, { Component } from 'react'
import {
  caldiffDays,
  caldiffHours,
  isSamDay,
  isSamHour,
  timestampToTimeNormal,
  transformTimestamp
} from '../../../../../../utils/util'
import {
  ganttIsFold,
  GANTT_IDS,
  hours_view_due_work_oclock,
  hours_view_start_work_oclock,
  milestone_base_height
} from '../../constants'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Menu, Dropdown, message, Tooltip } from 'antd'
import { setBoardIdStorage } from '../../../../../../utils/businessFunction'
import Draggable from 'react-draggable'
import {
  getPageXY,
  getXYDropPosition,
  setDateWidthPositionWeekView,
  setDateWithPositionInYearView
} from '../../ganttBusiness'
import { updateMilestone } from '../../../../../../services/technological/task'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import { debounce } from 'lodash'
import { rebackCreateNotify } from '../../../../../../components/NotificationTodos'

const MenuItem = Menu.Item
@connect(mapStateToProps)
export default class GroupMilestones extends Component {
  /** 鼠标移入的计时器 */
  mouseHoverTimer = null
  /** menu的鼠标移入移出 */
  MenuMouseHoverTimer = null

  /** 是否已经进入了鼠标移入事件 */
  mousein = false
  constructor(props) {
    super(props)
    this.state = {
      render_milestones_data: [],
      dragg_milestone_err: false //拖拽里程碑是否报错
    }
  }
  componentDidMount() {
    this.setMilestones(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.setMilestones(nextProps)
  }
  setMilestones = props => {
    const {
      milestoneMap = {},
      gantt_board_id,
      group_view_type,
      list_group = []
    } = props
    this.setSummaryMilestonesData(props)
    if (group_view_type != '1') {
      return
    }
    if (group_view_type != '1') return
    let finally_milestones = [] //最终要获取的里程碑
    if (gantt_board_id == '0') {
      //项目视图
      for (let key in milestoneMap) {
        const sameday_milestones = milestoneMap[key] //得到同一天的里程碑
        let sameday_board_ids = sameday_milestones.map(item => item.board_id) //同一天具备里程碑的所有项目
        sameday_board_ids = Array.from(new Set(sameday_board_ids))
        for (let val of sameday_board_ids) {
          const sameday_sameboard_milestones = sameday_milestones.filter(
            item => item.board_id == val
          ) //得到同一天同项目的里程碑列表
          finally_milestones.push({
            timestamp: transformTimestamp(key),
            milestones: sameday_sameboard_milestones,
            belong_group_id: val,
            week_day: new Date(transformTimestamp(key)).getDay(),
            date: new Date(transformTimestamp(key)).getDate()
          })
        }
      }
    } else {
      const first_group_id = (list_group[0] || {}).list_id
      //项目内分组视图
      for (let key in milestoneMap) {
        const sameday_milestones = milestoneMap[key] //得到同一天的里程碑
        let sameday_group_ids = sameday_milestones.map(item => item.list_id) //同一天具备里程碑的所有项目
        // console.log('finally_milestones_1_0', sameday_group_ids)

        sameday_group_ids = Array.from(new Set(sameday_group_ids))
        // console.log('finally_milestones_1_1', sameday_group_ids)

        const has_first_group =
          sameday_group_ids.findIndex(item => item == first_group_id) != -1 //是否存在属于第一个分组
        const has_none_group =
          sameday_group_ids.findIndex(item => item == undefined) != -1 //是否存在没有分组，
        // 第一个分组和没有分组归在一类,将未分组去除，然后将未分组的里程碑并到第一个分组
        if (has_first_group && has_none_group) {
          sameday_group_ids = sameday_group_ids.filter(item => item)
        }
        for (let val of sameday_group_ids) {
          const sameday_samegroup_milestones = sameday_milestones.filter(
            item => {
              // 遍历到第一个分组时，将未分组任务归并
              if (val == first_group_id && !item.list_id) {
                return item
              } else {
                return item.list_id == val
              }
            }
          ) //得到同一天同项目的里程碑列表
          finally_milestones.push({
            timestamp: transformTimestamp(key),
            week_day: new Date(transformTimestamp(key)).getDay(),
            date: new Date(transformTimestamp(key)).getDate(),
            milestones: sameday_samegroup_milestones,
            belong_group_id: val || first_group_id //没有分组的挂到分组1里面
          })
        }
      }
    }
    // console.log('sssasdasd', finally_milestones)
    this.handleGroupMilestones(finally_milestones, props)
  }
  // 设置头部汇总
  setSummaryMilestonesData = props => {
    const { milestoneMap = {} } = props
    let finally_milestones = [] //最终要获取的里程碑

    for (let key in milestoneMap) {
      const sameday_milestones_no_group = milestoneMap[key].filter(
        item => !item.parent_id || item.parent_id == '0'
      ) //得到同一天的没有归属分组的一级里程碑

      finally_milestones.push({
        timestamp: transformTimestamp(key),
        week_day: new Date(transformTimestamp(key)).getDay(),
        date: new Date(transformTimestamp(key)).getDate(),
        milestones: sameday_milestones_no_group,
        belong_group_id: '0' //没有分组的挂到分组1里面
      })
    }
    finally_milestones = finally_milestones.filter(
      item => item.milestones?.length
    )
    // console.log('sssasdasd_0', finally_milestones)
    this.handleSummaryMilestonesData(finally_milestones, props)
  }
  // 处理分组的里程碑
  handleGroupMilestones = (
    milestones,
    {
      ceilWidth,
      date_arr_one_level = [],
      gantt_board_id,
      list_group = [],
      group_list_area_section_height = [],
      gantt_view_mode
    }
  ) => {
    for (let val of milestones) {
      const is_over_duetime =
        transformTimestamp(val.timestamp) < new Date().getTime() //超过时间
      const one_levels = val.milestones.filter(
        item =>
          (!item.parent_id || item.parent_id == '0') &&
          (gantt_board_id != '0' ? !!item.list_id : true) //全项目视图下都可以，单项目视图下要挂分组
      ) //一级里程碑(具有分组)
      const two_levels = val.milestones.filter(
        item => item.parent_id && item.parent_id != '0'
      ) //二级里程碑
      const one_levels_completed =
        one_levels.findIndex(item => item.is_finished == '0') == '-1' //一级里程碑是否全部完成
      const two_levels_completed =
        two_levels.findIndex(item => item.is_finished == '0') == '-1' //二级里程碑是否全部完成

      const one_levels_no_group = val.milestones.filter(
        item =>
          (!item.parent_id || item.parent_id == '0') &&
          (!item.list_id || item.list_id == '0')
      ) //一级里程碑(没有分组归属)
      // 全部一级里程碑
      const one_levels_all = val.milestones.filter(
        item => !item.parent_id || item.parent_id == '0'
      ) //一级里程碑(具有分组)
      const one_levels_no_group_completed =
        one_levels_no_group.findIndex(item => item.is_finished == '0') == '-1' //一级里程碑是否全部完成
      const one_levels_all_completed =
        one_levels_all.findIndex(item => item.is_finished == '0') == -1 //全部一级里程碑是否全部完成
      val.one_levels_all = one_levels_all
      val.one_levels_all_completed = one_levels_all_completed
      val.one_levels = one_levels
      val.two_levels = two_levels
      val.one_levels_no_group = one_levels_no_group
      val.one_levels_no_group_completed = one_levels_no_group_completed
      val.one_levels_completed = one_levels_completed
      val.two_levels_completed = two_levels_completed
      val.is_over_duetime = is_over_duetime
      let left_index
      // 各个视图做位置的索引
      if (['month', 'relative_time'].includes(gantt_view_mode)) {
        left_index = date_arr_one_level.findIndex(item =>
          isSamDay(val.timestamp, item.timestamp)
        )
        if (left_index == -1) continue
        val.left = ceilWidth * left_index
      } else if ('hours' == gantt_view_mode) {
        // eslint-disable-next-line no-loop-func
        left_index = date_arr_one_level.findIndex(item => {
          if (isSamHour(Number(val.timestamp), Number(item.timestamp))) {
            return true
          } else {
            if (isSamDay(Number(val.timestamp), Number(item.timestamp))) {
              //如果是同一天并且时间在工作区间外，将所有放在最后一个小时
              // return true
              if (
                new Date(item.timestamp).getHours() ==
                  hours_view_due_work_oclock - 1 &&
                (new Date(Number(val.timestamp)).getHours() >=
                  hours_view_due_work_oclock ||
                  new Date(Number(val.timestamp)).getHours() <
                    hours_view_start_work_oclock)
              ) {
                return true
              }
            }
          }
          return false
        })
        // console.log('index_hours', left_index)
        if (left_index == -1) continue
        val.left = ceilWidth * left_index
      } else if ('year' == gantt_view_mode) {
        left_index = date_arr_one_level.findIndex(
          item =>
            item.timestamp <= val.timestamp &&
            item.timestampEnd >= val.timestamp
        )
        if (left_index == -1) continue
        // 将各个月份叠加
        const before_arr = date_arr_one_level.slice(0, left_index)
        const day_total = before_arr.reduce(
          (total, item) => total + item.last_date,
          0
        )
        val.left = ceilWidth * day_total + val.date * ceilWidth
        // console.log('index_year', left_index, day_total)
      } else if ('week' == gantt_view_mode) {
        left_index = date_arr_one_level.findIndex(
          item =>
            item.timestamp <= val.timestamp &&
            item.timestampEnd >= val.timestamp
        )
        // console.log('index_week', left_index)
        if (left_index == -1) continue
        val.left =
          ceilWidth * left_index * 7 + ((val.week_day || 7) - 1) * ceilWidth //周数 + 所属周的周几。 val.week_day || 7=》周日是0，但是用7标识
      } else {
      }

      // 找到所属的分组索引, 没有分组的暂时归属到第一个分组
      const top_index = list_group.findIndex(item => {
        if (val.belong_group_id == undefined) {
          return item.list_id == '0'
        } else {
          return item.list_id == val.belong_group_id
        }
      })
      val.top = group_list_area_section_height[top_index - 1] || 0 //在所属分组的顶层
    }
    this.setState({
      render_milestones_data: milestones
    })
    // console.log('finally_milestones_2', milestones)
  }
  // 设置头部汇总
  handleSummaryMilestonesData = (
    milestones,
    {
      ceilWidth,
      date_arr_one_level = [],
      gantt_board_id,
      list_group = [],
      group_list_area_section_height = [],
      gantt_view_mode
    }
  ) => {
    // return
    for (let val of milestones) {
      const is_over_duetime =
        transformTimestamp(val.timestamp) < new Date().getTime() //超过时间
      const one_levels_no_group = val.milestones.filter(
        item =>
          (!item.parent_id || item.parent_id == '0') &&
          (!item.list_id || item.list_id == '0')
      ) //一级里程碑(没有分组归属)

      const one_levels_no_group_completed =
        one_levels_no_group.findIndex(item => item.is_finished == '0') == '-1' //一级里程碑是否全部完成

      // 全部一级里程碑
      const one_levels_all = val.milestones.filter(
        item => !item.parent_id || item.parent_id == '0'
      ) //一级里程碑(具有分组)
      const one_levels_all_completed =
        one_levels_all.findIndex(item => item.is_finished == '0') == -1 //全部一级里程碑是否全部完成
      val.one_levels_all = one_levels_all
      val.one_levels_all_completed = one_levels_all_completed
      val.one_levels_no_group = one_levels_no_group
      val.one_levels_no_group_completed = one_levels_no_group_completed
      // val.is_over_duetime = is_over_duetime
      let left_index
      // 各个视图做位置的索引
      if (['month', 'relative_time'].includes(gantt_view_mode)) {
        left_index = date_arr_one_level.findIndex(item =>
          isSamDay(val.timestamp, item.timestamp)
        )
        if (left_index == -1) continue
        val.left = ceilWidth * left_index
      } else if ('hours' == gantt_view_mode) {
        // eslint-disable-next-line no-loop-func
        left_index = date_arr_one_level.findIndex(item => {
          if (isSamHour(Number(val.timestamp), Number(item.timestamp))) {
            return true
          } else {
            if (isSamDay(Number(val.timestamp), Number(item.timestamp))) {
              //如果是同一天并且时间在工作区间外，将所有放在最后一个小时
              // return true
              if (
                new Date(item.timestamp).getHours() ==
                  hours_view_due_work_oclock - 1 &&
                (new Date(Number(val.timestamp)).getHours() >=
                  hours_view_due_work_oclock ||
                  new Date(Number(val.timestamp)).getHours() <
                    hours_view_start_work_oclock)
              ) {
                return true
              }
            }
          }
          return false
        })
        // console.log('index_hours', left_index)
        if (left_index == -1) continue
        val.left = ceilWidth * left_index
      } else if ('year' == gantt_view_mode) {
        left_index = date_arr_one_level.findIndex(
          item =>
            item.timestamp <= val.timestamp &&
            item.timestampEnd >= val.timestamp
        )
        if (left_index == -1) continue
        // 将各个月份叠加
        const before_arr = date_arr_one_level.slice(0, left_index)
        const day_total = before_arr.reduce(
          (total, item) => total + item.last_date,
          0
        )
        val.left = ceilWidth * day_total + val.date * ceilWidth
        // console.log('index_year', left_index, day_total)
      } else if ('week' == gantt_view_mode) {
        left_index = date_arr_one_level.findIndex(
          item =>
            item.timestamp <= val.timestamp &&
            item.timestampEnd >= val.timestamp
        )
        // console.log('index_week', left_index)
        if (left_index == -1) continue
        val.left =
          ceilWidth * left_index * 7 + ((val.week_day || 7) - 1) * ceilWidth //周数 + 所属周的周几。 val.week_day || 7=》周日是0，但是用7标识
      } else {
      }

      // 找到所属的分组索引, 没有分组的暂时归属到第一个分组
      const top_index = list_group.findIndex(item => {
        if (val.belong_group_id == undefined) {
          return item.list_id == '0'
        } else {
          return item.list_id == val.belong_group_id
        }
      })
      val.top = group_list_area_section_height[top_index - 1] || 0 //在所属分组的顶层
    }
    // console.log('ssssssssss_milestones', milestones)
    this.setState({
      summary_milestones_data: milestones
    })
  }
  // 渲染里程碑的名字列表
  renderMiletonesNames = (list = []) => {
    const names = list.reduce((total, item, index) => {
      const split = index < list.length - 1 ? '，' : ''
      return total + item.name + split
    }, '')
    return names
  }
  // 获取以top为分组的结构
  getMiletonesWithTopStructure = top => {
    const { render_milestones_data = [] } = this.state
    let list = []
    render_milestones_data.map(item => {
      if (item.top == top) {
        list.push(item)
      }
    })
    return {
      top,
      list
    }
  }

  // 根据下一个里程碑日期，来获取当前里程碑日期的‘name1,name2,name3...’应该有的宽度
  setMiletonesNamesWidth = ({ timestamp, top, belong_group_id }, no_group) => {
    const {
      milestoneMap = {},
      ceilWidth,
      gantt_board_id,
      gantt_view_mode,
      list_group = []
    } = this.props
    let top_arr = this.getMiletonesWithTopStructure(top)
    const miletones_position = top_arr.list.findIndex(
      t => t.timestamp == timestamp
    )
    let times_arr = Object.keys(milestoneMap) //[timestamp1, timestamp2,...]
    if (gantt_board_id == '0') {
      //以分组划分，过滤掉不属于该项目分组的里程碑所属于的时间,和过滤掉
      times_arr = times_arr.filter(
        time =>
          milestoneMap[time].findIndex(
            item =>
              item.board_id == belong_group_id &&
              (!item.parent_id || item.parent_id == '0') //多项目下只考虑一级里程碑
          ) != -1
      )
    } else {
      // 非顶部汇总区域
      if (!no_group) {
        times_arr = times_arr.filter(time => {
          return (
            milestoneMap[time].findIndex(
              item =>
                (item.list_id || list_group[0].lane_id) ==
                (!!belong_group_id && belong_group_id != '0'
                  ? belong_group_id //所属分组等于传递进来的分组id
                  : '0')
            ) != -1
          )
        })
      } else {
        // 顶部汇总区域
        times_arr = times_arr.filter(time => {
          return (
            milestoneMap[time].findIndex(
              item => !item.parent_id || item.parent_id == '0' //只考虑一级里程碑
            ) != -1
          )
        })
      }
    }
    times_arr = times_arr.sort((a, b) => Number(a) - Number(b))
    const index = times_arr.findIndex(item => isSamDay(item, timestamp)) //对应上当前日期所属的下标
    const next_miletones_time = times_arr[index + 1] //当前里程碑日期的对应下一个里程碑日期所在时间
    // 除了最后一个里程碑宽度为auto 还有就是不在同一个分组或者项目的里程碑 最后一个为auto
    // 18 是里程碑旗子宽度
    if (!next_miletones_time) {
      return 200
    }
    if (!no_group) {
      if (top == top_arr.top && miletones_position == top_arr.list.length - 1) {
        return 'none'
      }
    }
    if (gantt_view_mode == 'month') {
      if (caldiffDays(timestamp, next_miletones_time) <= 1) {
        return caldiffDays(timestamp, next_miletones_time) * (ceilWidth / 2)
      } else {
        return caldiffDays(timestamp, next_miletones_time) * ceilWidth - 18
      }
    } else if (gantt_view_mode == 'hours') {
      // 如果是同一天的 就判断小时
      let next_miletones_time_ =
        String(next_miletones_time).length === 10
          ? next_miletones_time * 1000
          : next_miletones_time
      let c_hours =
        new Date(timestamp).getHours() >= 17 ||
        new Date(timestamp).getHours() < 9
          ? 17
          : new Date(timestamp).getHours()
      let n_hours =
        new Date(Number(next_miletones_time_)).getHours() >= 17 ||
        new Date(Number(next_miletones_time_)).getHours() < 9
          ? 17
          : new Date(Number(next_miletones_time_)).getHours()
      if (isSamDay(timestamp, next_miletones_time)) {
        if (n_hours - c_hours <= 1) {
          return 0
        } else {
          return Math.abs(n_hours - c_hours) * ceilWidth - 18
        }
      } else {
        if (n_hours < c_hours) {
          if (caldiffDays(timestamp, next_miletones_time) <= 1) {
            if (n_hours - (c_hours - 9) <= 1) return 0
            return (n_hours - (c_hours - 9)) * ceilWidth - 18
          } else {
            return (
              (n_hours - (c_hours - 9)) * ceilWidth +
              9 *
                ceilWidth *
                (caldiffDays(timestamp, next_miletones_time) - 1) -
              18
            )
          }
        } else if (n_hours >= c_hours) {
          return (
            9 * ceilWidth * caldiffDays(timestamp, next_miletones_time) -
            18 +
            (n_hours - c_hours) * ceilWidth
          )
        }
      }
    } else if (gantt_view_mode == 'week') {
      if (caldiffDays(timestamp, next_miletones_time) <= 2) {
        return 0
      } else {
        if (caldiffDays(timestamp, next_miletones_time) * ceilWidth - 18 <= 0) {
          return 0
        }
        return caldiffDays(timestamp, next_miletones_time) * ceilWidth - 18
      }
    } else if (gantt_view_mode == 'year') {
      if (caldiffDays(timestamp, next_miletones_time) <= 11) {
        return 0
      } else {
        return caldiffDays(timestamp, next_miletones_time) * ceilWidth - 18
      }
    }
    // return caldiffDays(timestamp, next_miletones_time) * ceilWidth
  }
  // 里程碑是否过期的颜色设置
  setMiletonesColor = ({ is_over_duetime, has_lcb, is_finished }) => {
    if (is_finished) {
      return '#9EA6C2'
    } else {
      return ''
    }
    if (is_over_duetime) {
      if (!is_finished == '0') {
        //存在未完成任务
        return ''
        // return '#FFA39E'
      } else {
        //全部任务已完成
        return '#9EA6C2'
      }
    }
    // if (is_finished == '0') { //存在未完成任务
    //   if (is_over_duetime) {
    //     return '#FFA39E'
    //   }
    // } else { //全部任务已完成
    //   return 'rgba(0,0,0,0.15)'
    // }

    return ''
  }
  // 很长一条线的高度
  setThroughLineHeight = ({ belong_group_id, one_levels = [] }) => {
    const {
      list_group = [],
      gantt_board_id,
      show_board_fold,
      gantt_view_mode,
      group_view_type,
      group_list_area,
      group_list_area_section_height
    } = this.props
    let height = 0
    const first_group_id = (list_group[0] || {}).list_id
    if (
      ganttIsFold(
        gantt_board_id,
        group_view_type,
        show_board_fold,
        gantt_view_mode
      )
    ) {
      return 0
    }
    const index = list_group.findIndex(item => item.list_id == belong_group_id) //所属分组索引
    //如果是归到分组1，（分组和未分组的都归到分组1）
    // console.log('one_levels', one_levels)
    if (first_group_id == belong_group_id) {
      if (
        one_levels.findIndex(item => ['0', undefined].includes(item.list_id)) !=
        -1 // 如果分组1中存在未分组的
      ) {
        height =
          group_list_area_section_height[
            group_list_area_section_height.length - 1
          ] - 30
        // console.log('one_levels_1', index, height, group_list_area)
      } else {
        height = group_list_area[index] - 11
        // console.log('one_levels_2', index, height, group_list_area)
      }
    } else {
      height = group_list_area[index] - 12
      // console.log('one_levels_3', index, height, group_list_area)
    }
    // console.log('one_levels_4', first_group_id, belong_group_id)
    return height
  }

  // 渲染一级里程碑
  renderNoGroupOneLevelMilestone = value => {
    const { group_view_type } = this.props
    const {
      left,
      one_levels_all_completed,
      is_over_duetime,
      timestamp,
      belong_group_id,
      one_levels_all
    } = value
    const {
      ceilWidth,
      gantt_board_id,
      group_list_area_section_height
    } = this.props
    return (
      <div
        data-targetclassname="specific_example_milestone"
        className={indexStyles.milestone_wrapper}
        style={{
          top: -milestone_base_height,
          left: left + ceilWidth,
          height: 20,
          opacity: this.setMilestoneFlagShow(one_levels_all) ? '1' : '0.2'
        }}
      >
        <div style={{ width: 0 }}>
          {this.renderDropDown(
            timestamp,
            one_levels_all,
            this.renderLCBList(one_levels_all, timestamp, {
              marginTop: -10
            }),
            <div
              onMouseEnter={() =>
                this.singleMilestoneMouseEnter(one_levels_all)
              }
              onMouseLeave={() =>
                this.singleMilestoneMouseLeave(one_levels_all)
              }
            >
              {/* 旗帜 */}
              <div
                className={`${indexStyles.board_miletiones_flag} ${globalStyles.authTheme}`}
                data-targetclassname="specific_example_milestone"
                style={{
                  backgroundColor: '#f5f7fb',
                  color: this.setMiletonesColor({
                    is_over_duetime,
                    is_finished: one_levels_all_completed
                  })
                }}
              >
                &#xe6a0;
              </div>
              {/* 渲染里程碑名称铺开 */}
              <div
                className={`${indexStyles.board_miletiones_names} ${globalStyles.global_ellipsis}`}
                data-targetclassname="specific_example_milestone"
                style={{
                  maxWidth: this.setMiletonesNamesWidth(
                    {
                      timestamp,
                      top: -milestone_base_height,
                      belong_group_id
                    },
                    true
                  ),
                  // backgroundColor: '#f5f7fb',
                  color: this.setMiletonesColor({
                    is_over_duetime,
                    is_finished: one_levels_all_completed
                  })
                }}
              >
                {this.renderMiletonesNames(one_levels_all)}
              </div>
              {/* 旗杆 */}
              <div
                data-targetclassname="specific_example_milestone"
                className={`${indexStyles.board_miletiones_flagpole2}`}
                style={{
                  background: this.setMiletonesColor({
                    is_over_duetime,
                    is_finished: one_levels_all_completed
                  })
                }}
                onMouseDown={e => e.stopPropagation()}
                onMouseOver={e => e.stopPropagation()}
              />
            </div>
          )}

          {/* 很长的线 */}
          {group_view_type != '4' && (
            <div
              data-targetclassname="specific_example_milestone"
              className={`${indexStyles.board_miletiones_flagpole}`}
              style={{
                // height: this.setThroughLineHeight({
                //   belong_group_id,
                //   one_levels: one_levels_all
                // }),
                height:
                  group_list_area_section_height[
                    group_list_area_section_height.length - 1
                  ],
                width: 1,
                display: gantt_board_id == '0' ? 'none' : 'block',
                background: this.setMiletonesColor({
                  is_over_duetime,
                  is_finished: one_levels_all_completed
                })
              }}
              onMouseDown={e => e.stopPropagation()}
              onMouseOver={e => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    )
  }

  // 是否要渲染下拉列表,长度大于1则下拉，否则不下拉
  renderDropDown = (timestamp, arr, overlay, InnerNode) => {
    if (arr.length > 1) {
      return (
        <Tooltip title={timestampToTimeNormal(timestamp, '/', false, true)}>
          <Dropdown overlay={overlay}>{InnerNode}</Dropdown>{' '}
        </Tooltip>
      )
    }

    const value = arr[0]
    const { board_id, id } = value
    return (
      <Tooltip title={timestampToTimeNormal(timestamp, '/', false, true)}>
        <div
          onClick={() => {
            if (this.milestone_dragging == true) return
            this.seeMilestoneInfo({ board_id, id })
          }}
        >
          {InnerNode}
        </div>
      </Tooltip>
    )
  }

  renderView = (value = {}) => {
    const {
      ceilWidth,
      gantt_board_id,
      group_view_type,
      show_board_fold,
      gantt_view_mode
    } = this.props
    const {
      left,
      top,
      one_levels,
      one_levels_completed,
      two_levels_completed,
      is_over_duetime,
      two_levels,
      timestamp,
      belong_group_id,
      one_levels_all
    } = value
    return (
      <>
        {!!two_levels.length &&
          gantt_board_id != '0' &&
          this.renderDragWrapper(
            two_levels,
            <div
              data-targetclassname="specific_example_milestone"
              className={indexStyles.milestone_wrapper}
              style={{
                top,
                left: left + ceilWidth / 2 - 7,
                opacity: this.setMilestoneFlagShow(two_levels) ? '1' : '0.2'
                // marginTop: 4
              }} //移动一半的距离，并且中心位于中间
            >
              {this.renderDropDown(
                timestamp,
                two_levels,
                this.renderLCBList(two_levels, timestamp, {
                  marginTop: -10
                }),
                // <Dropdown overlay={this.renderLCBList(two_levels, timestamp)}>
                <div
                  onMouseEnter={() =>
                    this.singleMilestoneMouseEnter(two_levels)
                  }
                  onMouseLeave={() =>
                    this.singleMilestoneMouseLeave(two_levels)
                  }
                >
                  <div
                    data-targetclassname="specific_example_milestone"
                    className={indexStyles.board_miletiones_flag2}
                    style={{
                      background: this.setMiletonesColor({
                        is_over_duetime,
                        is_finished: two_levels_completed
                      })
                    }}
                  />
                  <div
                    className={`${indexStyles.board_miletiones_names} ${globalStyles.global_ellipsis}`}
                    data-targetclassname="specific_example_milestone"
                    style={{
                      maxWidth: this.setMiletonesNamesWidth({
                        timestamp,
                        top,
                        belong_group_id
                      }),
                      // backgroundColor: '#ffffff',
                      color: this.setMiletonesColor({
                        is_over_duetime,
                        is_finished: two_levels_completed
                      })
                    }}
                    // onMouseEnter={() =>
                    //   this.singleMilestoneMouseEnter(two_levels)
                    // }
                    // onMouseLeave={() =>
                    //   this.singleMilestoneMouseLeave(two_levels)
                    // }
                  >
                    {this.renderMiletonesNames(two_levels)}
                  </div>
                </div>
                // </Dropdown>
              )}
            </div>
          )}
        {!!one_levels.length &&
          this.renderDragWrapper(
            one_levels,
            <div
              data-targetclassname="specific_example_milestone"
              className={indexStyles.milestone_wrapper}
              style={{
                top: !ganttIsFold({
                  gantt_board_id,
                  group_view_type,
                  show_board_fold,
                  gantt_view_mode
                })
                  ? top
                  : top + 16,
                left: left + ceilWidth,
                height: 20,
                opacity: this.setMilestoneFlagShow(one_levels) ? '1' : '0.2'
                // marginTop: 4
              }}
            >
              {this.renderDropDown(
                timestamp,
                one_levels,
                this.renderLCBList(one_levels, timestamp, {
                  marginTop: -10
                }),
                <div
                  onMouseEnter={() =>
                    this.singleMilestoneMouseEnter(one_levels)
                  }
                  onMouseLeave={() =>
                    this.singleMilestoneMouseLeave(one_levels)
                  }
                >
                  {/* 旗帜 */}
                  <div
                    className={`${indexStyles.board_miletiones_flag} ${globalStyles.authTheme}`}
                    data-targetclassname="specific_example_milestone"
                    style={{
                      color: this.setMiletonesColor({
                        is_over_duetime,
                        is_finished: one_levels_completed
                      })
                    }}
                  >
                    &#xe6a0;
                  </div>
                  {/* 渲染里程碑名称铺开 */}
                  <div
                    className={`${indexStyles.board_miletiones_names} ${globalStyles.global_ellipsis}`}
                    data-targetclassname="specific_example_milestone"
                    style={{
                      maxWidth: this.setMiletonesNamesWidth({
                        timestamp,
                        top,
                        belong_group_id
                      }),
                      // backgroundColor: '#ffffff',
                      color: this.setMiletonesColor({
                        is_over_duetime,
                        is_finished: one_levels_completed
                      })
                    }}
                  >
                    {/* {timestamp} */}
                    {this.renderMiletonesNames(one_levels)}
                  </div>
                  {/* 旗杆 */}
                  <div
                    data-targetclassname="specific_example_milestone"
                    className={`${indexStyles.board_miletiones_flagpole2}`}
                    style={{
                      background: this.setMiletonesColor({
                        is_over_duetime,
                        is_finished: one_levels_completed
                      })
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onMouseOver={e => e.stopPropagation()}
                  />
                </div>
              )}
              {/* 很长的线 */}
              <div
                data-targetclassname="specific_example_milestone"
                className={`${indexStyles.board_miletiones_flagpole}`}
                style={{
                  height: this.setThroughLineHeight({
                    belong_group_id,
                    one_levels
                  }),
                  display: gantt_board_id == '0' ? 'none' : 'block',
                  background: this.setMiletonesColor({
                    is_over_duetime,
                    is_finished: one_levels_completed
                  })
                }}
                onMouseDown={e => e.stopPropagation()}
                onMouseOver={e => e.stopPropagation()}
              />
            </div>
          )}
      </>
    )
  }
  // 选择里程碑
  selectLCB = (e, timestamp) => {
    e.domEvent.stopPropagation()
    const idarr = e.key.split('__')
    const id = idarr[1]
    const board_id = idarr[0]

    //更新里程碑id,在里程碑的生命周期会监听到id改变，发生请求
    this.seeMilestoneInfo({ board_id, id })
  }

  // 查看里程碑
  seeMilestoneInfo = ({ board_id, id }) => {
    const { dispatch } = this.props
    setBoardIdStorage(board_id)
    dispatch({
      type: 'milestoneDetail/updateDatas',
      payload: {
        milestone_id: id
      }
    })
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        miletone_detail_modal_visible: true
      }
    })
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id
      }
    })
  }

  // 里程碑详情和列表
  renderLCBList = (miletones, timestamp, style = {}) => {
    return (
      <Menu
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        onClick={e => this.selectLCB(e, timestamp)}
        style={{ width: 216, ...style }}
        data-targetclassname="specific_example_milestone"
      >
        {miletones.map((value, key) => {
          const { id, name, board_id } = value
          return (
            <MenuItem
              data-targetclassname="specific_example_milestone"
              className={globalStyles.global_ellipsis}
              style={{ width: 216 }}
              key={`${board_id}__${id}`}
              onMouseEnter={() => this.milestoneMouseEnter(value)}
              onMouseLeave={() => this.milestoneMouseLeave()}
            >
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }

  // 里程碑的事件-----------start
  target_event_bubble = {
    onClick: e => e.stopPropagation(),
    onMouseMove: e => e.stopPropagation(),
    onMouseDown: e => e.stopPropagation(),
    onMouseUp: e => e.stopPropagation(),
    onMouseEnter: () => {
      //在鼠标hover到任务条上，非创建任务时，将虚线框隐藏
      const { ganttPanelDashedDrag } = this.props
      if (!ganttPanelDashedDrag) {
        this.props.setDasheRectShow && this.props.setDasheRectShow(false)
      }
    }
  }
  milestoneDragStart = e => {
    // console.log('ssssssssssaaaa_0', e.target.className)
    this.milestone_drag_ele = e //缓存拖拽的里程碑节点
    this.milestone_initial_left = e.target.style.left
    const { x } = getXYDropPosition(e, {
      gantt_head_width: this.props.gantt_head_width
    })
    this.milestone_drag_point_diff = x - this.milestone_initial_left //做初始标记，由于鼠标拖拽的位置在该元素上不同，记录元素最左边和鼠标落点的差值
    this.drag_ele = e.currentTarget

    // console.log('sssssssss_00', {
    //   x,
    //   milestone_initial_left: this.milestone_initial_left,
    //   milestone_drag_point_diff: this.milestone_drag_point_diff,
    //   target: e.target.style.left
    // })
  }
  milestoneDraging = e => {
    // console.log('ssssssssssaaaa_2', e.target.className)
    const { pageX } = getPageXY(e)
    if (!pageX) return
    this.milestone_drag_ele = e
    // this.milestone_dragging = true
    setTimeout(() => {
      this.milestone_dragging = true
    }, 100)
    this.setState({
      dragg_milestone_err: false
    })
    // console.log('sssssssss_11a', this.milestone_drag_ele)
  }
  // 甘特图信息变化后，实时触发甘特图渲染在甘特图上变化
  handleMiletonsChangeMountInGantt = datas => {
    const { dispatch, group_view_type } = this.props
    return new Promise(resolve => {
      if (group_view_type == '4') {
        dispatch({
          type: `gantt/updateOutLineTree`,
          payload: {
            datas
          }
        })
      }
      dispatch({
        type: 'gantt/getGttMilestoneList',
        payload: {}
      }).then(res => resolve())
    })
  }
  milestoneDragStop = async (e, { milestones = [] }) => {
    // console.log('ssssssssssaaaa_3', e.target.className)
    if (!milestones.length) return
    const {
      gantt_view_mode,
      date_arr_one_level,
      ceilWidth,
      gantt_head_width,
      gantt_board_id,
      group_view_type,
      dispatch
    } = this.props
    setTimeout(() => {
      this.milestone_dragging = false
    }, 300)
    if (!this.milestone_dragging) return
    let { x } =
      getXYDropPosition(this.milestone_drag_ele, {
        gantt_head_width
      }) || {}
    // console.log('sssssssssss_22_0', x, this.milestone_drag_point_diff)
    // x = x - this.milestone_drag_point_diff + ceilWidth //校准
    // const { x } = (await this.setCurrentRect(this.milestone_drag_ele)) || {}
    let date = {} //具体日期
    let counter = 0
    if (gantt_view_mode == 'month' || gantt_view_mode == 'hours') {
      for (let val of date_arr_one_level) {
        counter += 1
        if (counter * ceilWidth > x) {
          date = val
          break
        }
      }
    } else if (gantt_view_mode == 'year') {
      date = setDateWithPositionInYearView({
        _position: x + ceilWidth,
        date_arr_one_level,
        ceilWidth,
        width: ceilWidth,
        x
      })
    } else if (gantt_view_mode == 'week') {
      date = setDateWidthPositionWeekView({
        position: x,
        date_arr_one_level,
        ceilWidth
      })
    } else {
    }
    // console.log('sssssssssss_22', x, date)
    // debugger
    const { timestamp, timestampEnd } = date
    if (!timestampEnd) return
    //回退位置
    const resetNodeTransform = () => {
      const elements_ = document.getElementsByClassName(
        'react-draggable-dragged'
      )
      const elements = [...elements_]
      elements.forEach(node => {
        node.style.transform = 'translate(0px, 0px)'
      })
      this.setState({
        dragg_milestone_err: false
      })
    }
    const params = {
      id: milestones[0].id,
      deadline: timestampEnd
    }
    if (gantt_board_id == '0') {
      setBoardIdStorage(milestones[0].board_id)
    }
    if (
      (gantt_view_mode == 'hours' &&
        isSamHour(milestones[0].deadline, timestampEnd)) ||
      (gantt_view_mode != 'hours' &&
        isSamDay(milestones[0].deadline, timestampEnd))
    ) {
      this.setState(
        {
          dragg_milestone_err: true
        },
        () => {
          resetNodeTransform()
        }
      )
      return
    }
    return new Promise((resolve, reject) => {
      updateMilestone(
        {
          ...params
        },
        { isNotLoading: false }
      )
        .then(async res => {
          if (isApiResponseOk(res)) {
            await this.handleMiletonsChangeMountInGantt([
              {
                ...params,
                due_time: params.deadline
              }
            ])
            message.success('更新成功')
            rebackCreateNotify.call(this, {
              res,
              id: milestones[0].id,
              board_id: milestones[0].board_id,
              group_view_type,
              dispatch,
              targt_type: 'milestone'
            })
            resolve(res)
          } else {
            message.error(res.message)
            this.setState(
              {
                dragg_milestone_err: true
              },
              () => {
                resetNodeTransform()
              }
            )
            reject()
          }
        })
        .catch(err => {
          message.error('更新失败')
          console.log('ssssssssssaaa', err)
          this.setState(
            {
              dragg_milestone_err: true
            },
            () => {
              resetNodeTransform()
            }
          )
          reject()
        })
    })
  }
  // 里程碑的事件 -------------end

  // 拖拽里程碑包裹
  renderDragWrapper = (milestones = [], dom) => {
    return milestones.length == 1 ? (
      <Draggable
        data-targetclassname="specific_example_milestone"
        axis="x"
        {...(this.state.dragg_milestone_err
          ? { position: { x: 0, y: 0 } }
          : {})} //拖拽错误后回归原位
        {...this.target_event_bubble}
        onStart={this.milestoneDragStart}
        onDrag={this.milestoneDraging}
        onStop={e =>
          this.milestoneDragStop(e, {
            milestones
          })
        }
      >
        {dom}
      </Draggable>
    ) : (
      dom
    )
  }

  //hover的时候更新携带的关联任务id
  milestoneMouseEnter = item => {
    clearTimeout(this.MenuMouseHoverTimer)
    this.MenuMouseHoverTimer = setTimeout(() => {
      if (this.cantNotMouseEnterLeave()) return
      const { rela_ids = [], id } = item
      const { dispatch } = this.props
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          cardids_with_milestone: rela_ids,
          hover_milestone_id: id
        }
      })
    }, 300)
  }
  milestoneMouseLeave = () => {
    clearTimeout(this.MenuMouseHoverTimer)
    if (this.cantNotMouseEnterLeave()) return
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        cardids_with_milestone: [],
        hover_milestone_id: ''
      }
    })
  }
  singleMilestoneMouseEnter = arr => {
    clearTimeout(this.mouseHoverTimer)
    this.mouseHoverTimer = setTimeout(() => {
      this.mousein = true
      if (this.cantNotMouseEnterLeave()) return
      if (arr.length != 1) return
      const { rela_ids = [], id } = arr[0]
      const { dispatch } = this.props
      // console.log('ssssssssssadd_0', arr[0])
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          cardids_with_milestone: rela_ids,
          hover_milestone_id: id
        }
      })
    }, 300)
  }
  singleMilestoneMouseLeave = item => {
    clearTimeout(this.mouseHoverTimer)
    if (!this.mousein) return
    this.mousein = false
    if (this.cantNotMouseEnterLeave()) return
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        cardids_with_milestone: [],
        hover_milestone_id: ''
      }
    })
  }
  cantNotMouseEnterLeave = () => {
    const {
      gantt_board_id,
      group_view_type,
      show_board_fold,
      gantt_view_mode
    } = this.props
    if (
      this.milestone_dragging ||
      ganttIsFold({
        gantt_board_id,
        group_view_type,
        show_board_fold,
        gantt_view_mode
      })
    ) {
      return true
    }
    return false
  }

  // 设置里程碑棋子显示不显示
  setMilestoneFlagShow = arr => {
    const { hover_milestone_id } = this.props
    if (!hover_milestone_id || !arr.length) return true
    const bool = arr.findIndex(item => item.id == hover_milestone_id) != -1 //表示该列表有当前hover的里程碑
    return bool
  }
  render() {
    const {
      render_milestones_data = [],
      dragg_milestone_err,
      summary_milestones_data = []
    } = this.state
    const {
      group_view_type,
      list_group = [],
      get_milestone_loading
    } = this.props
    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 2,
          // height: '100%',
          // width: '100%',
          display: !get_milestone_loading ? 'block' : 'none'
        }}
      >
        {group_view_type == '1' &&
          !!list_group.length &&
          render_milestones_data.map((item, index) => {
            return (
              <React.Fragment
                key={`${item.timestamp}${index} ${dragg_milestone_err}`}
              >
                {this.renderView(item)}
              </React.Fragment>
            )
          })}
        {['4', '1'].includes(group_view_type) &&
          summary_milestones_data.map(item => {
            const { one_levels_all } = item
            return (
              <React.Fragment key={`${item.timestamp} ${dragg_milestone_err}`}>
                {!!one_levels_all.length &&
                  this.renderDragWrapper(
                    one_levels_all,
                    this.renderNoGroupOneLevelMilestone(item)
                  )}
              </React.Fragment>
            )
          })}
      </div>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: {
      gantt_view_mode,
      group_list_area_section_height,
      ceiHeight,
      gantt_board_id,
      milestoneMap,
      group_view_type,
      show_board_fold,
      ceilWidth,
      date_arr_one_level,
      gantt_head_width,
      list_group,
      group_list_area,
      get_milestone_loading,
      cardids_with_milestone,
      hover_milestone_id
    }
  }
}) {
  return {
    gantt_view_mode,
    ceiHeight,
    gantt_board_id,
    milestoneMap,
    group_view_type,
    show_board_fold,
    group_list_area_section_height,
    ceilWidth,
    date_arr_one_level,
    gantt_head_width,
    list_group,
    group_list_area,
    get_milestone_loading,
    cardids_with_milestone,
    hover_milestone_id
  }
}
