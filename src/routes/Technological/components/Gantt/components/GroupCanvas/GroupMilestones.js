import { connect } from 'dva'
import React, { Component } from 'react'
import {
  caldiffDays,
  isSamDay,
  isSamHour,
  transformTimestamp
} from '../../../../../../utils/util'
import {
  hours_view_due_work_oclock,
  hours_view_start_work_oclock
} from '../../constants'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Menu, Dropdown } from 'antd'
import { setBoardIdStorage } from '../../../../../../utils/businessFunction'
const MenuItem = Menu.Item
@connect(mapStateToProps)
export default class GroupMilestones extends Component {
  constructor(props) {
    super(props)
    this.state = {
      render_milestones_data: []
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
    this.handleMilestones(finally_milestones, props)
  }
  handleMilestones = (
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
        item => !item.parent_id || item.parent_id == '0'
      ) //一级里程碑
      const two_levels = val.milestones.filter(
        item => item.parent_id && item.parent_id != '0'
      ) //二级里程碑
      const one_levels_completed =
        one_levels.findIndex(item => item.is_all_realized == '0') == '-1' //一级里程碑是否全部完成
      const two_levels_completed =
        two_levels.findIndex(item => item.is_all_realized == '0') == '-1' //二级里程碑是否全部完成

      val.one_levels = one_levels
      val.two_levels = two_levels
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
        console.log('index_hours', left_index)
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
        console.log('index_year', left_index, day_total)
      } else if ('week' == gantt_view_mode) {
        left_index = date_arr_one_level.findIndex(
          item =>
            item.timestamp <= val.timestamp &&
            item.timestampEnd >= val.timestamp
        )
        console.log('index_week', left_index)
        if (left_index == -1) continue
        val.left =
          ceilWidth * left_index * 7 + ((val.week_day || 7) - 1) * ceilWidth //周数 + 所属周的周几。 val.week_day || 7=》周日是0，但是用7标识
      } else {
      }

      // 找到所属的分组索引
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
    console.log('finally_milestones_2', milestones)
  }
  // 渲染里程碑的名字列表
  renderMiletonesNames = (list = []) => {
    const names = list.reduce((total, item, index) => {
      const split = index < list.length - 1 ? '，' : ''
      return total + item.name + split
    }, '')
    return names
  }
  // 根据下一个里程碑日期，来获取当前里程碑日期的‘name1,name2,name3...’应该有的宽度
  setMiletonesNamesWidth = timestamp => {
    const { milestoneMap = {}, ceilWidth, gantt_board_id } = this.props
    const { list_id } = this.props //gantt_board_id为0的情况下，分组id就是各个项目的id
    let times_arr = Object.keys(milestoneMap) //[timestamp1, timestamp2,...]
    if (gantt_board_id == '0') {
      //以分组划分，过滤掉不属于该项目分组的里程碑所属于的时间
      times_arr = times_arr.filter(
        time =>
          milestoneMap[time].findIndex(item => item.board_id == list_id) != -1
      )
    }
    // console.log('ssssss', times_arr)
    times_arr = times_arr.sort((a, b) => Number(a) - Number(b))
    const index = times_arr.findIndex(item => isSamDay(item, timestamp)) //对应上当前日期所属的下标
    const next_miletones_time = times_arr[index + 1] //当前里程碑日期的对应下一个里程碑日期所在时间
    if (!next_miletones_time) {
      return 'auto'
    }
    return caldiffDays(timestamp, next_miletones_time) * ceilWidth
  }
  renderView = (value = {}) => {
    const { ceilWidth } = this.props
    const {
      left,
      top,
      one_levels,
      one_levels_completed,
      two_levels_completed,
      is_over_duetime,
      two_levels,
      timestamp
    } = value
    return (
      <>
        {!!one_levels.length && (
          <div
            data-targetclassname="specific_example_milestone"
            className={indexStyles.milestone_wrapper}
            style={{ top, left: left + ceilWidth }}
          >
            <Dropdown
              overlay={this.renderLCBList(one_levels, timestamp, {
                marginTop: -10
              })}
            >
              <div>
                {/* 旗帜 */}
                <div
                  className={`${indexStyles.board_miletiones_flag} ${globalStyles.authTheme}`}
                  data-targetclassname="specific_example_milestone"
                >
                  &#xe6a0;
                </div>
                {/* 渲染里程碑名称铺开 */}
                <div
                  className={`${indexStyles.board_miletiones_names} ${globalStyles.global_ellipsis}`}
                  data-targetclassname="specific_example_milestone"
                  style={{ maxWidth: this.setMiletonesNamesWidth(timestamp) }}
                >
                  {this.renderMiletonesNames(one_levels)}
                </div>
                {/* 旗杆 */}
                <div
                  data-targetclassname="specific_example_milestone"
                  className={`${indexStyles.board_miletiones_flagpole2}`}
                  style={{}}
                  onMouseDown={e => e.stopPropagation()}
                  onMouseOver={e => e.stopPropagation()}
                />
              </div>
            </Dropdown>
            {/* 很长的线 */}
            <div
              data-targetclassname="specific_example_milestone"
              className={`${indexStyles.board_miletiones_flagpole}`}
              style={{}}
              onMouseDown={e => e.stopPropagation()}
              onMouseOver={e => e.stopPropagation()}
            />
          </div>
        )}
        {!!two_levels.length && (
          <Dropdown overlay={this.renderLCBList(two_levels, timestamp)}>
            <div
              data-targetclassname="specific_example_milestone"
              className={indexStyles.milestone_wrapper}
              style={{ top, left: left + ceilWidth / 2 - 7 }} //移动一半的距离，并且中心位于中间
            >
              <div
                data-targetclassname="specific_example_milestone"
                className={indexStyles.board_miletiones_flag2}
              />
              <div
                className={`${indexStyles.board_miletiones_names} ${globalStyles.global_ellipsis}`}
                data-targetclassname="specific_example_milestone"
                style={{ maxWidth: this.setMiletonesNamesWidth(timestamp) }}
              >
                {this.renderMiletonesNames(two_levels)}
              </div>
            </div>
          </Dropdown>
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
            >
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }
  render() {
    const { render_milestones_data = [] } = this.state
    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 2,
          height: '100%',
          width: '100%'
        }}
      >
        {render_milestones_data.map(item => {
          return (
            <React.Fragment key={item.timestamp}>
              {this.renderView(item)}
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
      gold_date_arr = [],
      group_list_area_section_height,
      ceiHeight,
      gantt_board_id,
      about_user_boards,
      milestoneMap,
      group_view_type,
      show_board_fold,
      ceilWidth,
      date_arr_one_level,
      gantt_head_width,
      date_total,
      list_group
    }
  }
}) {
  return {
    gantt_view_mode,
    gold_date_arr,
    ceiHeight,
    gantt_board_id,
    about_user_boards,
    milestoneMap,
    group_view_type,
    show_board_fold,
    group_list_area_section_height,
    ceilWidth,
    date_arr_one_level,
    gantt_head_width,
    date_total,
    list_group
  }
}
