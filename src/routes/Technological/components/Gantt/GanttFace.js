import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'
import DateList from './DateList'
import GroupListHead from './GroupListHead'
import { getMonthDate, getNextMonthDatePush, getGoldDateData, getYearDate } from './getDate'
import { date_area_height, ganttIsOutlineView } from './constants'
import GroupListHeadSet from './GroupListHeadSet.js'
import GroupListHeadSetBottom from './GroupListHeadSetBottom'

import ShowFileSlider from './components/boardFile/ShowFileSlider'
import BoardsFilesArea from './components/boardFile/BoardsFilesArea'
import FaceRightButton from './components/gattFaceCardItem/FaceRightButton'
import { Spin } from 'antd'
import MiletoneGuide from './components/MiletonesGuide/index'
import { isPaymentOrgUser } from '../../../../utils/businessFunction';
import BoardTemplate from './components/boardTemplate'
import GroupListHeadElse from './GroupListHeadElse'
import GetRowGanttItemElse from './GetRowGanttItemElse'
import { weekDataArray } from './calDate';
import { closeFeature } from '../../../../utils/temporary';
import CardDetailDrawer from './components/CardDetailDrawer'
const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GanttFace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      viewModal: '2', //视图模式1周，2月，3年
      gantt_card_out_middle_max_height: 600,
      local_gantt_board_id: '0', //当前项目id（项目tab栏）缓存在组件内，用于判断是否改变然后重新获取数据
      init_get_outline_tree: false, //大纲视图下初始化是否获取了大纲树
      scroll_area: 'gantt_body', // gantt_head/gantt_body 头部或右边 滚动事件触发的区域
      set_scroll_top_timer: null
    }
    this.setGanTTCardHeight = this.setGanTTCardHeight.bind(this)
  }

  componentDidMount() {
    const { gantt_board_id } = this.props
    this.setState({
      local_gantt_board_id: gantt_board_id
    })
    this.setGoldDateArr({ init: true })
    this.initSetScrollPosition()
    this.setGanTTCardHeight()
    this.getBoardListFeature()
    this.getProcessTemplateList()
    window.addEventListener('resize', this.setGanTTCardHeight, false)
  }
  getProcessTemplateList() {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getProcessTemplateList',
      payload: {

      }
    })
  }
  // 获取项目列表的users apps groups
  getBoardListFeature = () => {
    setTimeout(() => {
      this.getProjectGoupLists()
      this.getProjectAppsLists()
      this.getAboutUsersBoards()
    }, 300)
  }

  // 获取带app的项目列表
  getProjectAppsLists = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutAppsBoards',
      payload: {

      }
    })
  }
  // 获取带分组的项目列表
  getProjectGoupLists = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutGroupBoards',
      payload: {

      }
    })
  }
  // 获取带用户的项目列表
  getAboutUsersBoards = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutUsersBoards',
      payload: {

      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setGanTTCardHeight, false)
  }
  //设置卡片高度
  setGanTTCardHeight() {
    const documentHeight = document.documentElement.clientHeight;//获取页面可见高度
    const gantt_card_out = document.getElementById('gantt_card_out')
    let offsetTop = 0
    if (gantt_card_out) {
      offsetTop = gantt_card_out.offsetTop
      this.setState({
        gantt_card_out_middle_max_height: documentHeight - offsetTop - 20
      })
    }
  }

  //  初始化设置滚动横向滚动条位置
  initSetScrollPosition() {
    const { ceilWidth } = this.props
    const date = new Date().getDate()
    //60为一个月长度，3为遮住的部分长度，date为当前月到今天为止的长度,1为偏差修复, 16为左边header的宽度和withCeil * n的 %值
    this.setScrollPosition({ delay: 300, position: ceilWidth * (60 - 4 - 4 + date - 1) - 16 }) //第一为左边头部宽度，第二个4为距离头部距离
  }
  //设置滚动条位置
  setScrollPosition = ({ delay = 300, position = 200 }) => {
    const that = this
    const target = this.refs.gantt_card_out_middle
    setTimeout(function () {
      // if (target.scrollTo) {
      //   target.scrollTo(position, 0)
      // } else {
      //   target.scrollLeft = position
      // }

      target.scrollLeft = position
    }, delay)
  }

  // 设置滚动的区域
  setScrollArea = (area_type) => {
    this.setState({
      scroll_area: area_type
    })
  }
  //左右拖动,日期会更新
  ganttScroll = (e) => {
    e.stopPropagation();
    if (this.state.scroll_area == 'gantt_head') {
      return
    }
    if ('gantt_card_out_middle' != e.target.getAttribute("id")) return
    const that = this

    const { scrollTop, scrollLeft, scrollWidth, clientWidth } = e.target
    const gantt_group_head = document.getElementById('gantt_group_head')
    if (gantt_group_head) {
      gantt_group_head.scrollTop = scrollTop
    }
    this.handleScrollVertical({ scrollTop })
    const gantt_date_area = document.getElementById('gantt_date_area')
    if (gantt_date_area) {
      gantt_date_area.style.left = `-${scrollLeft}px`
    }
    this.handelScrollHorizontal({ scrollLeft, scrollWidth, clientWidth, })
  }
  // 处理上下滚动
  handleScrollVertical = ({ scrollTop }) => {
    const { group_view_type, gantt_board_id, target_scrollTop, dispatch } = this.props
    if (target_scrollTop == scrollTop) return
    if (group_view_type == '1' && gantt_board_id == '0') {
      const { set_scroll_top_timer } = this.state
      if (set_scroll_top_timer) {
        clearTimeout(set_scroll_top_timer)
      }
      this.setState({
        set_scroll_top_timer: setTimeout(() => {
          dispatch({
            type: getEffectOrReducerByName('updateDatas'),
            payload: {
              target_scrollTop_board_storage: scrollTop,
              target_scrollTop: scrollTop
            }
          })
        }, 500)
      })
    }
  }
  // 处理水平滚动
  handelScrollHorizontal = ({ scrollLeft, scrollWidth, clientWidth, }) => {
    const { searchTimer } = this.state
    const { gold_date_arr, dispatch, ceilWidth, target_scrollLeft, gantt_view_mode } = this.props
    const delX = target_scrollLeft - scrollLeft //判断向左还是向右
    const scroll_bound_leng = gantt_view_mode == 'month' ? 2 : 16 //判断滚动条触底边界
    const rescroll_leng_to_left = gantt_view_mode == 'month' ? 36 : 60 //滚动条回复位置
    const rescroll_leng_to_right = gantt_view_mode == 'month' ? 60 : 90//滚动条回复位置
    if (target_scrollLeft == scrollLeft) {
      return
    }
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    if (scrollLeft < scroll_bound_leng * ceilWidth && delX > 0) { //3为分组头部占用三个单元格的长度
      const { timestamp } = gold_date_arr[0]['date_inner'][0] //取第一天
      this.setState({
        searchTimer: setTimeout(() => {
          this.setScrollPosition({ delay: 1, position: rescroll_leng_to_left * ceilWidth }) //大概移动四天的位置
          setTimeout(() => {
            this.setGoldDateArr({ timestamp, not_set_loading: true }) //取左边界日期来做日期更新的基准
          }, 200)
        }, 50)
      })

    } else if ((scrollWidth - scrollLeft - clientWidth < scroll_bound_leng * ceilWidth) && delX < 0) {
      const gold_date_arr_length = gold_date_arr.length
      const date_inner = gold_date_arr[gold_date_arr_length - 1]['date_inner']
      const date_inner_length = date_inner.length
      const { timestamp } = date_inner[date_inner_length - 1] // 取最后一天
      this.setState({
        searchTimer: setTimeout(() => {
          this.setScrollPosition({ delay: 1, position: scrollWidth - clientWidth - rescroll_leng_to_right * ceilWidth }) //移动到最新视觉
          setTimeout(() => {
            this.setGoldDateArr({ timestamp, to_right: 'to_right', not_set_loading: true }) //取有边界日期来做更新日期的基准
          }, 200)
        }, 50)
      })
    }
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        target_scrollLeft: scrollLeft
      }
    })
  }

  //更新日期,日期更新后做相应的数据请求
  setGoldDateArr = ({ timestamp, to_right, init, not_set_loading }) => {
    const { dispatch } = this.props
    const { gold_date_arr = [], isDragging, gantt_view_mode } = this.props
    let date_arr = []
    if (!!to_right && isDragging && gantt_view_mode == 'month') { //如果是拖拽虚线框向右则是累加，否则是取基数前后
      date_arr = [].concat(gold_date_arr, getNextMonthDatePush(timestamp))
    } else {
      // date_arr = getMonthDate(timestamp)
      // date_arr = getYearDate(timestamp)
      date_arr = getGoldDateData({ gantt_view_mode, timestamp })
    }
    // if (!!to_right) { //如果是拖拽虚线框向右则是累加，否则是取基数前后
    //   date_arr = [].concat(gold_date_arr, getNextMonthDatePush(timestamp))
    // } else {
    //   date_arr = [].concat(getMonthDate(timestamp), gold_date_arr)
    // }
    let date_arr_one_level = []
    let date_total = 0
    if (gantt_view_mode == 'year' || gantt_view_mode == 'month') {
      for (let val of date_arr) {
        const { date_inner = [] } = val
        for (let val2 of date_inner) {
          date_total += gantt_view_mode == 'month' ? 1 : val2.last_date
          date_arr_one_level.push(val2)
        }
      }
    } else {
      date_arr_one_level = weekDataArray(timestamp)
      date_total = date_arr_one_level.length * 7 //总共有这么多周
    }
    // if (gantt_view_mode == 'year') {
    //   date_total = date_arr_one_level.slice().map(item => item.last_date).reduce((total, num) => total + num) //该月之前所有日期长度之和
    // } else if (gantt_view_mode == 'week') {
    //   date_arr_one_level = weekDataArray(timestamp)
    //   date_total = date_arr_one_level.length * 7 //总共有这么多周
    // } else {

    // }
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        gold_date_arr: date_arr,
        date_total,
        date_arr_one_level,
        start_date: date_arr[0]['date_inner'][0],
        end_date: date_arr[date_arr.length - 1]['date_inner'][date_arr[date_arr.length - 1]['date_inner'].length - 1],
      }
    })
    this.setWidthArea({ date_arr })
    //  做数据请求
    if (gold_date_arr[0]) {
      const start_time = gold_date_arr[0]['date_inner'][0]['timestamp']
      const end_time = gold_date_arr[gold_date_arr.length - 1]['date_inner'][gold_date_arr[gold_date_arr.length - 1]['date_inner'].length - 1]['timestamp']
      dispatch({
        type: getEffectOrReducerByName('getDataByTimestamp'),
        payload: {
          start_time,
          end_time
        }
      })
    }
    //更新任务位置信息
    // this.beforeHandListGroup()
    const that = this
    const { group_view_type, outline_tree } = this.props
    if (!ganttIsOutlineView({ group_view_type })) { //非大纲视图
      setTimeout(function () {
        dispatch({
          type: getEffectOrReducerByName('getGanttData'),
          payload: {
            not_set_loading
          }
        })
        that.getHoliday()
      }, 0)
    } else {
      const { init_get_outline_tree } = this.state
      if (!outline_tree.length && !init_get_outline_tree) {
        setTimeout(function () {
          dispatch({
            type: getEffectOrReducerByName('getGanttData'),
            payload: {
              not_set_loading
            }
          })
          that.setState({
            init_get_outline_tree: true
          })
        }, 0)
      } else {
        dispatch({
          type: 'gantt/handleOutLineTreeData',
          payload: {
            data: outline_tree
          }
        })
      }
      that.getHoliday()
    }
  }
  //设置月份日期宽度区间
  setWidthArea = ({ date_arr }) => {
    const { ceilWidth, gantt_view_mode, dispatch } = this.props
    if (gantt_view_mode != 'month') return
    const width_area = date_arr.map(item => item.date_inner.length * ceilWidth)
    const width_area_section = width_area.map((item, index) => {
      const list_arr = width_area.slice(0, index + 1)
      let width = 0
      for (let val of list_arr) {
        width += val
      }
      return width
    })
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        width_area,
        width_area_section
      }
    })
  }
  //拖动日期后预先设置 处理任务排列
  beforeHandListGroup = () => {
    const { dispatch, list_group } = this.props
    dispatch({
      type: 'gantt/handleListGroup',
      payload: {
        data: list_group
      }
    })
  }


  // 获取到实际有数据的区域总高度，为了和最后一行区分开
  getDataAreaRealHeight = () => {
    const { list_group = [], group_rows = [], ceiHeight } = this.props
    const item_height_arr = list_group.map((item, key) => {
      return group_rows[key] * ceiHeight
    })
    // console.log('sssssss_1', { list_group, group_rows, ceiHeight})
    if (!item_height_arr.length) return 0

    // console.log('sssssss_2', {height})
    const height = item_height_arr.reduce((total, num) => (total + num))
    return height
  }

  // 获取节假日
  getHoliday = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getHoliday',
      payload: {}
    })
  }
  render() {
    const { gantt_card_out_middle_max_height } = this.state
    const { gantt_card_height, get_gantt_data_loading, is_need_calculate_left_dx, gantt_board_id, is_show_board_file_area, group_view_type, get_gantt_data_loading_other } = this.props
    const dataAreaRealHeight = this.getDataAreaRealHeight()

    return (
      <div className={`${indexStyles.cardDetail} ${indexStyles.treeNodeUnselectable}`} id={'gantt_card_out'} style={{ height: gantt_card_height, width: '100%' }}>
        {
          (get_gantt_data_loading || get_gantt_data_loading_other) && (
            <div className={indexStyles.cardDetailMask} style={{
              height: gantt_card_height,
              backgroundColor: get_gantt_data_loading_other ? 'rgba(255,255,255,.7)' : '',
            }}>
              <Spin spinning={get_gantt_data_loading || get_gantt_data_loading_other} tip={'甘特图数据正在加载中...'} >
              </Spin>
            </div>
          )
        }
        {
          group_view_type == '1' && <MiletoneGuide />
        }

        <div className={indexStyles.cardDetail_left}></div>
        <div className={indexStyles.cardDetail_middle}
          // id={'gantt_card_out_middle'}
          // ref={'gantt_card_out_middle'}
          // onScroll={this.ganttScroll}
          style={{ maxHeight: gantt_card_out_middle_max_height }}
        >
          {/* <GroupListHeadSet />
          <div
            style={{ height: date_area_height }} //撑住DateList相同高度的底部
          /> */}
          {/* <DateList /> */}
          <div className={indexStyles.board}>
            <div className={indexStyles.board_head} style={{ height: gantt_card_height - 20 }}>
              <GroupListHeadSet />
              {/*  //撑住DateList相同高度的底部 */}
              <GroupListHead
                setScrollArea={this.setScrollArea}
                setScrollPosition={this.setScrollPosition}
                setGoldDateArr={this.setGoldDateArr}
                scroll_area={this.state.scroll_area}
                changeOutLineTreeNodeProto={this.props.changeOutLineTreeNodeProto}
                deleteOutLineTreeNode={this.props.deleteOutLineTreeNode}
                setTaskDetailModalVisibile={this.props.setTaskDetailModalVisibile}
                gantt_card_height={gantt_card_height}
                dataAreaRealHeight={dataAreaRealHeight} />
              {/* <GroupListHeadElse gantt_card_height={gantt_card_height} dataAreaRealHeight={dataAreaRealHeight} /> */}
              {/* <GroupListHeadSetBottom /> */}
            </div>
            <div
              className={indexStyles.board_body}
              style={{ height: gantt_card_height - 20 }} >
              <DateList />
              <div
                style={{ height: date_area_height }} //撑住DateList相同高度的底部
              />
              <div
                style={{
                  height: gantt_card_height - 20 - date_area_height,
                }}
                className={indexStyles.panel_out}
                id={'gantt_card_out_middle'}
                ref={'gantt_card_out_middle'}
                onMouseEnter={() => this.setScrollArea('gantt_body')}
                onScroll={this.ganttScroll}
              >
                <div className={indexStyles.panel}>
                  <GetRowGantt
                    changeOutLineTreeNodeProto={this.props.changeOutLineTreeNodeProto}
                    deleteOutLineTreeNode={this.props.deleteOutLineTreeNode}
                    is_need_calculate_left_dx={is_need_calculate_left_dx}
                    gantt_card_height={gantt_card_height}
                    dataAreaRealHeight={dataAreaRealHeight}
                    setTaskDetailModalVisibile={this.props.setTaskDetailModalVisibile}
                    addTaskModalVisibleChange={this.props.addTaskModalVisibleChange}
                    setGoldDateArr={this.setGoldDateArr}
                    setScrollPosition={this.setScrollPosition}
                  />
                  <div style={{ display: !closeFeature({ board_id: gantt_board_id }) ? 'block' : 'none' }}>
                    {
                      gantt_board_id && gantt_board_id != '0' && (
                        <BoardTemplate insertTaskToListGroup={this.props.insertTaskToListGroup} gantt_card_height={gantt_card_height} />
                      )
                    }
                  </div>
                  <CardDetailDrawer {...this.props.task_detail_props} />
                </div>
                <GetRowGanttItemElse gantt_card_height={gantt_card_height} dataAreaRealHeight={dataAreaRealHeight} />

              </div>


            </div>
          </div>

        </div>
        {/* <div className={indexStyles.cardDetail_right}></div> */}
        <FaceRightButton setGoldDateArr={this.setGoldDateArr} setScrollPosition={this.setScrollPosition} />
        {
          isPaymentOrgUser() && is_show_board_file_area != '1' && <ShowFileSlider />
        }
        <BoardsFilesArea />
      </div >
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: { datas: {
  ceilWidth,
  date_total,
  target_scrollTop,
  gold_date_arr = [],
  isDragging,
  list_group = [],
  group_rows = [],
  get_gantt_data_loading,
  ceiHeight,
  group_view_type,
  gantt_board_id,
  is_show_board_file_area,
  outline_tree,
  gantt_view_mode,
  target_scrollLeft,
  get_gantt_data_loading_other
} } }) {
  return {
    ceilWidth,
    date_total,
    target_scrollTop,
    gold_date_arr,
    isDragging,
    list_group,
    group_rows,
    get_gantt_data_loading,
    ceiHeight,
    group_view_type,
    gantt_board_id,
    is_show_board_file_area,
    outline_tree,
    gantt_view_mode,
    target_scrollLeft,
    get_gantt_data_loading_other
  }
}
GanttFace.defaultProps = {
  gantt_card_height: 600, //甘特图卡片总高度
}