import React, { Component } from 'react'
import { connect } from 'dva'
import { unstable_batchedUpdates } from 'react-dom'
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'
import DateList from './DateList'
import GroupListHead from './GroupListHead'
import {
  getMonthDate,
  getNextMonthDatePush,
  getGoldDateData,
  getLastMonthDateShift,
  getNextYearDate,
  getLastYearDate,
  getNextWeeksDate,
  getLastWeeksDate,
  getNextHourDate,
  getLastHourDate,
  getHourDate,
  getNextRelativeTime
} from './getDate'
import {
  ceil_width,
  ceil_width_week,
  date_area_height,
  ganttIsOutlineView,
  hours_view_total
} from './constants'
import GroupListHeadSet from './GroupListHeadSet.js'
import GroupListHeadSetBottom from './GroupListHeadSetBottom'

import ShowFileSlider from './components/boardFile/ShowFileSlider'
import BoardsFilesArea from './components/boardFile/BoardsFilesArea'
import FaceRightButton from './components/gattFaceCardItem/FaceRightButton'
import { Spin } from 'antd'
import MiletoneGuide from './components/MiletonesGuide/index'
import { isPaymentOrgUser } from '../../../../utils/businessFunction'
import BoardTemplate from './components/boardTemplate'
import GroupListHeadElse from './GroupListHeadElse'
import GetRowGanttItemElse from './GetRowGanttItemElse'
import { weekDataArray } from './calDate'
import { closeFeature } from '../../../../utils/temporary'
import CardDetailDrawer from './components/CardDetailDrawer'
import CustomFieldDetailDrawer from './components/CardDetailDrawer/CustomFieldDetailDrawer'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
import { throttle } from 'lodash'
import HeaderWidthTriggle from './components/HeaderWidthTriggle'
import GanttMilestonePublicInput from './components/milestoneDetail/GanttMilestonePublicInput'
import {
  diffClientDefaultCeilWidth,
  diffClientDefaultViewMode
} from './ganttBusiness'
import { ENV_ANDROID_APP } from '../../../../globalset/clientCustorm'
import { dateFormat, isSamDay } from '../../../../utils/util'
import {
  GanttViewDateWidth,
  GanttViewMode
} from '../../../../globalset/js/constant'

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GanttFace extends Component {
  set_scroll_top_timer = null
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      viewModal: '2', //????????????1??????2??????3???
      gantt_card_out_middle_max_height: 600,
      init_get_outline_tree: false, //????????????????????????????????????????????????
      scroll_area: 'gantt_body', // gantt_head/gantt_body ??????????????? ???????????????????????????
      set_scroll_top_timer: null,
      /** ??????????????????????????????????????? */
      ganttSelectedBarLeft: 0
    }
    this.setGanTTCardHeight = this.setGanTTCardHeight.bind(this)
    this.target_scrollLeft = 0
  }

  componentDidMount() {
    const { gantt_board_id, projectDetailInfoData = {} } = this.props
    const { board_set = {} } = projectDetailInfoData
    const { date_mode, relative_time } = board_set
    //????????????????????????????????????
    if (date_mode == '1' && gantt_board_id && gantt_board_id != '0') {
      this.props.dispatch({
        type: 'gantt/updateDatas',
        payload: {
          gantt_view_mode: diffClientDefaultViewMode('relative_time'),
          base_relative_time: relative_time
        }
      })
      setTimeout(() => {
        this.setGoldDateArr({
          init: true,
          timestamp: ENV_ANDROID_APP ? undefined : relative_time
        })
        this.initSetScrollPosition()
      }, 100)
    } else {
      this.setGoldDateArr({ init: true })
      setTimeout(() => {
        this.initSetScrollPosition()
      }, 0)
      // this.initSetScrollPosition()
    }
    this.setGanTTCardHeight()
    this.getBoardListFeature()
    this.getProcessTemplateList()
    window.addEventListener('resize', this.setGanTTCardHeight, false)
  }

  componentWillReceiveProps(nextProps) {
    // ???????????????????????????????????????????????????
    this.handleRelatimeLineWithBoardChange(nextProps)
  }

  // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  handleRelatimeLineWithBoardChange = nextProps => {
    const {
      projectDetailInfoData = {},
      gantt_board_id,
      ceilWidth,
      gantt_view_mode
    } = this.props
    this.handleChangeBoardAll(nextProps.gantt_board_id)
    if (gantt_board_id == '0') return
    const { board_set = {} } = projectDetailInfoData
    const { date_mode, relative_time } = board_set
    const {
      gantt_board_id: gantt_board_id_next,
      projectDetailInfoData: projectDetailInfoData_next = {}
    } = nextProps
    const { board_set: board_set_next = {} } = projectDetailInfoData_next
    const {
      date_mode: date_mode_next,
      relative_time: relative_time_next
    } = board_set_next
    // ?????????????????????
    if (date_mode_next && date_mode_next != date_mode) {
      // ???????????????????????????????????????????????????
      if (date_mode_next == '1') {
        this.props.dispatch({
          type: 'gantt/updateDatas',
          payload: {
            gantt_view_mode: diffClientDefaultViewMode('relative_time'),
            base_relative_time: relative_time_next,
            ceilWidth: diffClientDefaultCeilWidth(ceil_width),
            get_gantt_data_loading_other: true
          }
        })
        setTimeout(() => {
          this.props.dispatch({
            type: 'gantt/updateDatas',
            payload: {
              get_gantt_data_loading_other: false
            }
          })
        }, 1000)
        setTimeout(() => {
          this.setGoldDateArr({
            init: true,
            timestamp: ENV_ANDROID_APP ? undefined : relative_time
          })
          this.initSetScrollPosition()
        }, 100)
        // const gantt_date_area = document.getElementById('gantt_date_area')
        // if (gantt_date_area) {
        //   gantt_date_area.style.left = `0px`
        // }
      } else {
        if (gantt_view_mode != 'relative_time') return //???????????????????????????????????????
        this.props.dispatch({
          type: 'gantt/updateDatas',
          payload: {
            gantt_view_mode: diffClientDefaultViewMode('month'),
            ceilWidth: diffClientDefaultCeilWidth(ceil_width)
          }
        })
        setTimeout(() => {
          this.setGoldDateArr({ init: true })
          this.initSetScrollPosition()
        }, 100)
        // const gantt_date_area = document.getElementById('gantt_date_area')
        // if (gantt_date_area) {
        //   // gantt_date_area.style.left = `-${ceilWidth *
        //   //   (60 - 4 - 4 + new Date().getDate() - 1) -
        //   //   16}px`
        //   setTimeout(() => {
        //     gantt_date_area.style.left = `${-this.setInitScrollLeft()}px`
        //   }, 300)
        // }
      }
    }
  }

  // ????????????id?????????????????????
  handleChangeBoardAll = next_gantt_board_id => {
    const { gantt_board_id, dispatch } = this.props
    if (gantt_board_id != next_gantt_board_id && next_gantt_board_id == '0') {
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          gantt_view_mode: 'week',
          ceilWidth: ceil_width_week
        }
      })

      setTimeout(() => {
        this.setGoldDateArr({ init: true })
        setTimeout(() => {
          this.initSetScrollPosition()
          // const wapper_width = document.getElementById('gantt_body_wapper')
          //   .clientWidth
          // const current_index = 49
          // const gantt_date_area = document.getElementById('gantt_date_area')
          // const set_left =
          //   current_index * 7 * ceil_width_week -
          //   wapper_width / 2 +
          //   (7 / 2) * ceil_width_week
          // if (gantt_date_area) {
          //   gantt_date_area.style.left = `${-set_left}px`
          // }
        }, 100)
      })
    }
  }

  // ????????????????????????
  getProcessTemplateList() {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getProcessTemplateList',
      payload: {}
    })
  }
  // ?????????????????????users apps groups
  getBoardListFeature = () => {
    unstable_batchedUpdates(() => {
      setTimeout(() => {
        this.getProjectGoupLists()
        this.getProjectAppsLists()
        this.getAboutUsersBoards()
      }, 300)
    })
  }

  // ?????????app???????????????
  getProjectAppsLists = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutAppsBoards',
      payload: {}
    })
  }
  // ??????????????????????????????
  getProjectGoupLists = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutGroupBoards',
      payload: {}
    })
  }
  // ??????????????????????????????
  getAboutUsersBoards = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getAboutUsersBoards',
      payload: {}
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setGanTTCardHeight, false)
  }
  //??????????????????
  setGanTTCardHeight() {
    const documentHeight = document.documentElement.clientHeight //????????????????????????
    const gantt_card_out = document.getElementById('gantt_card_out')
    let offsetTop = 0
    if (gantt_card_out) {
      offsetTop = gantt_card_out.offsetTop
      this.setState({
        gantt_card_out_middle_max_height: documentHeight - offsetTop - 20
      })
    }
  }

  // ????????????????????????????????????
  setInitScrollLeft = () => {
    const { date_arr_one_level = [], ceilWidth, gantt_view_mode } = this.props
    let current_index
    const wapper_width = document.getElementById('gantt_body_wapper')
      .clientWidth
    const now = new Date().getTime()
    if (gantt_view_mode == 'month') {
      current_index = date_arr_one_level.findIndex(item =>
        isSamDay(item.timestamp, now)
      )
      return current_index * ceilWidth - wapper_width / 2 + ceil_width / 2
    } else if (gantt_view_mode == 'week') {
      current_index = date_arr_one_level.findIndex(
        item => now > item.timestamp && now < item.timestampEnd
      )
      return (
        current_index * 7 * ceilWidth - wapper_width / 2 + (7 / 2) * ceilWidth
      )
    }

    // ??????
  }

  //  ??????????????????????????????????????????
  initSetScrollPosition = () => {
    const { ceilWidth, gantt_view_mode } = this.props
    const date = new Date().getDate()
    // ??????????????????????????????
    let position = this.setInitScrollLeft()
    if (gantt_view_mode == 'relative_time') {
      position = 0
    } else if (gantt_view_mode == 'hours') {
      position = 17 * 7 * ceilWidth //???????????????????????????
    }

    // const position =
    //   gantt_view_mode == 'relative_time'
    //     ? 0
    //     : ceilWidth * (60 - 4 - 4 + date - 1) - 16
    this.setScrollPosition({
      delay: 300,
      position
    }) //???????????????????????????????????????4?????????????????????
  }
  //?????????????????????
  setScrollPosition = ({ delay = 300, position = 200 }) => {
    const that = this
    const target = this.refs.gantt_card_out_middle
    setTimeout(function() {
      // if (target.scrollTo) {
      //   target.scrollTo(position, 0)
      // } else {
      //   target.scrollLeft = position
      // }

      target.scrollLeft = position
    }, delay)
  }

  // ?????????????????????
  setScrollArea = area_type => {
    this.setState({
      scroll_area: area_type
    })
  }
  //????????????,???????????????
  ganttScroll = e => {
    // e.stopPropagation()
    if (this.state.scroll_area == 'gantt_head') {
      return
    }
    if ('gantt_card_out_middle' != e.target.getAttribute('id')) return
    const that = this

    const { scrollTop, scrollLeft, scrollWidth, clientWidth } = e.target
    const gantt_group_head = document.getElementById('gantt_group_head')
    if (gantt_group_head) {
      gantt_group_head.scrollTop = scrollTop
    }
    this.handleScrollVertical({ scrollTop })
    // const gantt_date_area = document.getElementById('gantt_date_area')
    // if (gantt_date_area) {
    //   gantt_date_area.style.left = `-${scrollLeft}px`
    // }
    // const gantt_date_buoy = document.getElementById('gantt_date_buoy')
    // if (gantt_date_area) {
    //   gantt_date_buoy.style.left = `${scrollLeft}px`
    // }
    this.handelScrollHorizontal({ scrollLeft, scrollWidth, clientWidth })
  }
  // ??????????????????
  handleScrollVertical = ({ scrollTop }) => {
    const {
      group_view_type,
      gantt_board_id,
      // target_scrollTop,
      dispatch
    } = this.props
    if (this.target_scrollTop == scrollTop) return
    if (group_view_type == '1' && gantt_board_id == '0') {
      clearTimeout(this.set_scroll_top_timer)
      this.set_scroll_top_timer = setTimeout(() => {
        // dispatch({
        //   type: getEffectOrReducerByName('updateDatas'),
        //   payload: {
        //     // target_scrollTop_board_storage: scrollTop,
        //     // target_scrollTop: scrollTop
        //   }
        // })
        this.target_scrollTop = scrollTop
      }, 500)
    }
  }

  // ??????????????????
  handelScrollHorizontal = ({ scrollLeft, scrollWidth, clientWidth }) => {
    const { target_scrollLeft } = this
    if (target_scrollLeft == scrollLeft) {
      return
    }
    const { gold_date_arr, dispatch, ceilWidth, gantt_view_mode } = this.props
    const delX = target_scrollLeft - scrollLeft //????????????????????????
    const scroll_bound_leng = gantt_view_mode == 'month' ? 2 : 16 //???????????????????????????
    const rescroll_leng_to_left_wrapper = {
      month: 30,
      week: 343, //????????????49???
      year: 365, //??????????????????
      hours: 15 * hours_view_total
    }
    const rescroll_leng_to_left = gantt_view_mode == 'month' ? 30 : 60 //?????????????????????
    const rescroll_leng_to_right = gantt_view_mode == 'month' ? 60 : 90 //?????????????????????
    // if (this.searchTimer) {
    clearTimeout(this.searchTimer)
    //   this.searchTimer = null
    // }
    // ?????????????????????
    if (scrollLeft < scroll_bound_leng * ceilWidth && delX > 0) {
      //3?????????????????????????????????????????????
      const { timestamp } = gold_date_arr[0]['date_inner'][0] //????????????
      // const loadedCb = () => {
      //   this.setScrollPosition({ position: rescroll_leng_to_left_wrapper[gantt_view_mode] * ceilWidth })
      // }
      if (gantt_view_mode == 'relative_time') return //??????????????????????????????
      this.searchTimer = setTimeout(() => {
        this.setScrollPosition({
          position: rescroll_leng_to_left_wrapper[gantt_view_mode] * ceilWidth,
          delay: 1
        })
        // this.setLoading(true)
        // setTimeout(() => {
        // this.smonthScrollEle(
        //   rescroll_leng_to_left_wrapper[gantt_view_mode] * ceilWidth
        // )
        this.setGoldDateArr({
          timestamp,
          active_trigger: 'to_left',
          not_set_loading: false,
          loadedCb: () => this.replySvgPosition()
        }) //?????????????????????????????????????????????
        // })
      }, 100)
    } else if (
      scrollWidth - scrollLeft - clientWidth < scroll_bound_leng * ceilWidth &&
      delX < 0
    ) {
      // ?????????????????????
      const gold_date_arr_length = gold_date_arr.length
      const date_inner = gold_date_arr[gold_date_arr_length - 1]['date_inner']
      const date_inner_length = date_inner.length
      const { timestamp } = date_inner[date_inner_length - 1] // ???????????????
      this.searchTimer = setTimeout(() => {
        // this.setLoading(true)
        // this.setScrollPosition({ delay: 1, position: scrollWidth - clientWidth - rescroll_leng_to_right * ceilWidth })
        // setTimeout(() => {
        this.setGoldDateArr({
          timestamp,
          active_trigger: 'to_right',
          not_set_loading: false
        }) //?????????????????????????????????????????????
        // })
      }, 100)
    }
    this.target_scrollLeft = scrollLeft
    // this.setScrollLeft(scrollLeft)
  }
  setScrollLeft = throttle(function(scrollLeft) {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        target_scrollLeft: scrollLeft
      }
    })
  }, 0)
  // ??????loading
  setLoading = bool => {
    const { dispatch, get_gantt_data_loading } = this.props
    console.log('ssssssss', get_gantt_data_loading)
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        get_gantt_data_loading: bool
      }
    })
  }
  // svg????????????????????????
  replySvgPosition = () => {
    document.getElementById('gantt_svg_area').style.left = '0px'
  }
  // ???????????????????????????????????????
  smonthScrollEle = minus_left => {
    const nodes_ = document.getElementsByClassName('gantt_card_flag_special')
    const nodes = [...nodes_]
    nodes.forEach(element => {
      const left = element.style.left
      element.style.left = `${Number(left.replace('px', '')) + minus_left}px`
    })
  }

  //????????????,???????????????????????????????????????
  setGoldDateArr = ({
    timestamp,
    active_trigger,
    init,
    not_set_loading,
    loadedCb
  }) => {
    const { dispatch } = this.props
    const {
      gold_date_arr = [],
      isDragging,
      gantt_view_mode,
      ceilWidth
    } = this.props
    let date_arr = []
    if (active_trigger == 'to_right') {
      if (gantt_view_mode == GanttViewMode.Day) {
        date_arr = [].concat(gold_date_arr, getNextMonthDatePush(timestamp))
      } else if (gantt_view_mode == GanttViewMode.Week) {
        date_arr = [].concat(gold_date_arr, getNextWeeksDate(timestamp))
      } else if (gantt_view_mode == GanttViewMode.Month) {
        date_arr = [].concat(gold_date_arr, getNextYearDate(timestamp))
      } else if (gantt_view_mode == GanttViewMode.Hours) {
        date_arr = [].concat(gold_date_arr, getNextHourDate(timestamp))
      } else if (gantt_view_mode == GanttViewMode.Relative) {
        gold_date_arr[0]['date_inner'] = [].concat(
          gold_date_arr[0]['date_inner'],
          getNextRelativeTime(
            gold_date_arr[0]['date_inner'][0]['timestamp'],
            gold_date_arr[0]['date_inner'].length - 1
          )
        )
        // console.log(
        //   'sssssssssss111',
        //   gold_date_arr,
        //   gold_date_arr[0]['date_inner']
        // )
        date_arr = gold_date_arr
      } else {
        // date_arr = getGoldDateData({ gantt_view_mode, timestamp })
      }
    } else if (active_trigger == 'to_left') {
      if (gantt_view_mode == 'month') {
        date_arr = [].concat(getLastMonthDateShift(timestamp), gold_date_arr)
      } else if (gantt_view_mode == 'week') {
        date_arr = [].concat(getLastWeeksDate(timestamp), gold_date_arr)
      } else if (gantt_view_mode == 'year') {
        date_arr = [].concat(getLastYearDate(timestamp), gold_date_arr)
      } else if (gantt_view_mode == 'hours') {
        date_arr = [].concat(getLastHourDate(timestamp), gold_date_arr)
      } else if (gantt_view_mode == 'relative_time') {
        return
      } else {
        // date_arr = getGoldDateData({ gantt_view_mode, timestamp })
      }
    } else {
      date_arr = getGoldDateData({ gantt_view_mode, timestamp })
    }
    //????????????????????????
    // this.beforeHandListGroup()
    const that = this
    const { group_view_type, outline_tree, active_baseline } = this.props
    // ??????????????????
    const date_arr_length = date_arr.length
    const date_arr_last_date_inner_length =
      date_arr[date_arr_length - 1].date_inner.length
    const _end_date =
      date_arr[date_arr_length - 1].date_inner[
        date_arr_last_date_inner_length - 1
      ]
    const _start_date = date_arr[0].date_inner[0]

    //???????????????
    if (!ganttIsOutlineView({ group_view_type })) {
      if (['to_right', 'to_left'].includes(active_trigger)) {
        //??????????????????????????????
        let scroll_params = {}
        if (active_trigger == 'to_right') {
          //?????????????????????????????????????????????????????????????????????????????????????????????????????????
          scroll_params = {
            start_time: timestamp,
            end_time: _end_date.timestamp
            // end_time:date_arr_one_level[date_arr_one_level.length - 1].timestamp
          }
        } else {
          //????????????????????????????????????????????????????????????????????????????????????????????????????????????
          scroll_params = {
            // start_time: date_arr_one_level[0].timestamp,
            start_time: _start_date.timestamp,
            end_time: timestamp
          }
        }
        setTimeout(function() {
          dispatch({
            type: getEffectOrReducerByName('getGroupScrollAdditionalData'),
            payload: { ...scroll_params }
          }).then(res => {
            if (isApiResponseOk(res) && typeof loadedCb === 'function') {
              loadedCb()
            }
          })
        }, 0)
      } else {
        //???????????????????????????
        setTimeout(function() {
          dispatch({
            type: getEffectOrReducerByName('getGanttData'),
            payload: {
              start_date: _start_date,
              end_date: _end_date,
              not_set_loading
            }
          }).then(res => {
            if (isApiResponseOk(res) && typeof loadedCb === 'function') {
              loadedCb()
            }
          })
        }, 0)
      }
    } else {
      if (typeof loadedCb === 'function') {
        loadedCb()
      }
      const { init_get_outline_tree } = this.state
      if (!outline_tree.length && !init_get_outline_tree) {
        setTimeout(function() {
          dispatch({
            type: getEffectOrReducerByName('getGanttData'),
            payload: {
              start_date: _start_date,
              end_date: _end_date,
              not_set_loading
            }
          })
          that.setState({
            init_get_outline_tree: true
          })
        }, 0)
      } else {
        this.setLoading(false)
        unstable_batchedUpdates(() => {
          dispatch({
            type: 'gantt/getBaseLineInfo',
            payload: active_baseline
          })
          dispatch({
            type: 'gantt/handleOutLineTreeData',
            payload: {
              data: outline_tree
            }
          })
        })
      }
    }

    let date_arr_one_level = []
    let date_total = 0
    if (['year', 'month', 'hours', 'relative_time'].includes(gantt_view_mode)) {
      for (let val of date_arr) {
        const { date_inner = [] } = val
        for (let val2 of date_inner) {
          date_total +=
            gantt_view_mode == GanttViewMode.Month ? val2.last_date : 1
          date_arr_one_level.push(val2)
        }
      }
    } else {
      date_arr_one_level = weekDataArray(date_arr)
      date_total = date_arr_one_level.length * 7 //?????????????????????
    }

    function updateDateArr() {
      dispatch({
        type: getEffectOrReducerByName('updateDatas'),
        payload: {
          gold_date_arr: date_arr,
          date_total,
          date_arr_one_level,
          start_date: _start_date,
          end_date: _end_date
        }
      })
    }
    updateDateArr()

    this.getHoliday()
    this.setWidthArea({ date_arr })
    // window.requestAnimationFrame(updateDateArr)
  }
  //??????????????????????????????
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
  //??????????????????????????? ??????????????????
  beforeHandListGroup = () => {
    const { dispatch, list_group } = this.props
    dispatch({
      type: 'gantt/handleListGroup',
      payload: {
        data: list_group
      }
    })
  }

  // ???????????????????????????????????????????????????????????????????????????
  getDataAreaRealHeight = () => {
    const { list_group = [], group_rows = [], ceiHeight } = this.props
    const item_height_arr = list_group.map((item, key) => {
      return group_rows[key] * ceiHeight
    })
    // console.log('sssssss_1', { list_group, group_rows, ceiHeight})
    if (!item_height_arr.length) return 0

    // console.log('sssssss_2', {height})
    const height = item_height_arr.reduce((total, num) => total + num)
    return height
  }

  // ???????????????
  getHoliday = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getHoliday',
      payload: {}
    })
  }

  // ??????????????????
  exitBaseLine = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/exitBaseLineInfoView'
    })
  }
  // ??????????????????????????????
  onMouseOverCapture = () => {
    const { scroll_area } = this.state
    if (scroll_area == 'gantt_body') return
    this.setScrollArea('gantt_body')
  }

  /** ?????????????????? */
  getDateWidth = () => {
    const { gantt_view_mode } = this.props
    switch (gantt_view_mode) {
      case GanttViewMode.Day:
        return GanttViewDateWidth.Day
      case GanttViewMode.Hours:
        return GanttViewDateWidth.Hours
      case GanttViewMode.Month:
        return GanttViewDateWidth.Month
      case GanttViewMode.Week:
        return GanttViewDateWidth.Week
      default:
        return 0
    }
  }
  /** ??????div????????? */
  updateLongDivWidth = () => {
    const { gold_date_arr = [] } = this.props
    let dates = []
    gold_date_arr.forEach(item => {
      dates = dates.concat(item.date_inner)
    })

    const width = this.getDateWidth()
    return dates.length * width
  }

  // ???????????????????????????????????????
  renderDateNoContent = (s_time, e_time) => {
    const { gantt_view_mode } = this.props
    // ????????????
    const is_year =
      new Date(s_time).getFullYear() == new Date(e_time).getFullYear()
    // ????????????
    const is_month =
      new Date(s_time).getMonth() + 1 == new Date(e_time).getMonth() + 1
    let date_dec = ''
    let s_format = '' // ??????????????????
    let e_format = '' // ??????????????????
    s_format =
      new Date(s_time).getFullYear() == new Date().getFullYear()
        ? 'MM???dd???'
        : 'yyyy.MM.dd'
    e_format =
      new Date(e_time).getFullYear() == new Date().getFullYear()
        ? 'MM???dd???'
        : 'yyyy.MM.dd'
    switch (gantt_view_mode) {
      case 'month':
        // ?????????????????? ?????????????????????
        if (is_year && is_month) {
          if (isSamDay(s_time, e_time)) {
            // ????????????
            date_dec = `${dateFormat(e_time, 'dd')}`
          } else {
            date_dec = `${dateFormat(s_time, e_format)} - ${dateFormat(
              e_time,
              e_format
            )}`
          }
        } else {
          date_dec = `${dateFormat(s_time, s_format)} - ${dateFormat(
            e_time,
            e_format
          )}`
        }
        break
      case 'hours':
        if (is_year && is_month && isSamDay(s_time, e_time)) {
          date_dec = `${dateFormat(s_time, 'HH:mm')} - ${dateFormat(
            e_time,
            'HH:mm'
          )}`
        } else {
          s_format =
            new Date(s_time).getFullYear() == new Date().getFullYear()
              ? 'MM.dd HH:mm'
              : 'yyyy.MM.dd HH:mm'
          e_format =
            new Date(e_time).getFullYear() == new Date().getFullYear()
              ? 'MM.dd HH:mm'
              : 'yyyy.MM.dd HH:mm'
          date_dec = `${dateFormat(s_time, s_format)} - ${dateFormat(
            e_time,
            e_format
          )}`
        }
        break
      case 'week':
        // ??????
        if (is_year) {
          // ??????
          if (is_month) {
            date_dec = `${dateFormat(s_time, 'dd')} - ${dateFormat(
              e_time,
              'dd'
            )}`
          } else {
            date_dec = `${dateFormat(s_time, 'MM.dd')} - ${dateFormat(
              e_time,
              'MM???dd???'
            )}`
          }
        } else {
          date_dec = `${dateFormat(s_time, s_format)} - ${dateFormat(
            e_time,
            e_format
          )}`
        }

        break
      case 'year':
        if (is_year) {
          if (is_month) {
            date_dec = `${dateFormat(s_time, 'dd')} - ${dateFormat(
              e_time,
              'dd'
            )}`
          } else {
            date_dec = `${dateFormat(s_time, 'MM???dd???')} - ${dateFormat(
              e_time,
              'MM???dd???'
            )}`
          }
        } else {
          date_dec = `${dateFormat(s_time, s_format)} - ${dateFormat(
            e_time,
            e_format
          )}`
        }

        break

      default:
        break
    }
    return date_dec
  }
  // ?????????????????????????????????
  renderGanttCardDateNoSection = () => {
    const { gantt_card_date_no_section = {} } = this.props
    const {
      width,
      start_time,
      end_time,
      id,
      parent_card_id,
      left
    } = gantt_card_date_no_section
    return (
      <div
        key={parent_card_id || id}
        className={indexStyles.gantt_card_date_no_section}
        style={{ left: left, width: width }}
        title={this.renderDateNoContent(start_time, end_time)}
      >
        <div className={indexStyles.gantt_card_date_no_section_left}></div>
        <div className={indexStyles.gantt_card_date_no_section_right}></div>
        <div style={{ color: '#113696' }}>
          {this.renderDateNoContent(start_time, end_time)}
        </div>
      </div>
    )
  }

  /** ??????????????????????????? */
  updateDivScrollLeft = scrollLeft => {
    this.setState({
      ganttSelectedBarLeft: scrollLeft
    })
  }

  render() {
    const { gantt_card_out_middle_max_height } = this.state
    const {
      gantt_card_height,
      get_gantt_data_loading,
      is_need_calculate_left_dx,
      gantt_board_id,
      is_show_board_file_area,
      group_view_type,
      get_gantt_data_loading_other,
      currentUserOrganizes = [],
      show_base_line_mode,
      active_baseline,
      gantt_card_date_no_section
    } = this.props
    const dataAreaRealHeight = this.getDataAreaRealHeight()

    return (
      <div
        className={`${indexStyles.cardDetail} ${indexStyles.treeNodeUnselectable}`}
        id={'gantt_card_out'}
        style={{ height: gantt_card_height, width: '100%' }}
      >
        {/* loading???????????? */}
        {(get_gantt_data_loading || get_gantt_data_loading_other) && (
          <div
            className={indexStyles.cardDetailMask}
            style={{
              height: gantt_card_height,
              backgroundColor: get_gantt_data_loading_other
                ? 'rgba(255,255,255,.7)'
                : ''
            }}
          >
            <Spin
              spinning={get_gantt_data_loading || get_gantt_data_loading_other}
              tip={''}
            ></Spin>
          </div>
        )}
        {group_view_type == '1' && <MiletoneGuide />}

        {/* <div className={indexStyles.cardDetail_left}></div> */}
        {/* ?????????????????? */}
        <div
          className={indexStyles.cardDetail_middle}
          id={'gantt_card_out_middle_wrapper'}
          // ref={'gantt_card_out_middle'}
          // onScroll={this.ganttScroll}
          style={{ maxHeight: gantt_card_out_middle_max_height }}
        >
          {/* <GroupListHeadSet />
          <div
            style={{ height: date_area_height }} //??????DateList?????????????????????
          /> */}
          {/* ??????????????? */}
          <div className={indexStyles.board}>
            <div
              className={indexStyles.board_head}
              id={'gantt_header_wapper'}
              style={{ height: gantt_card_height - 20 }}
            >
              <GroupListHeadSet
                setGoldDateArr={this.setGoldDateArr}
                setScrollPosition={this.setScrollPosition}
              />
              {/*  //??????DateList????????????????????? */}
              <GroupListHead
                setScrollArea={this.setScrollArea}
                setScrollPosition={this.setScrollPosition}
                setGoldDateArr={this.setGoldDateArr}
                scroll_area={this.state.scroll_area}
                changeOutLineTreeNodeProto={
                  this.props.changeOutLineTreeNodeProto
                }
                deleteOutLineTreeNode={this.props.deleteOutLineTreeNode}
                setTaskDetailModalVisibile={
                  this.props.setTaskDetailModalVisibile
                }
                gantt_card_height={gantt_card_height}
                dataAreaRealHeight={dataAreaRealHeight}
              />
              {/* ?????????????????????????????? */}
              <HeaderWidthTriggle gantt_card_height={gantt_card_height} />

              {/* <GroupListHeadElse gantt_card_height={gantt_card_height} dataAreaRealHeight={dataAreaRealHeight} /> */}
              {/* <GroupListHeadSetBottom /> */}
            </div>
            <div
              id={'gantt_body_wapper'}
              className={indexStyles.board_body}
              style={{ height: gantt_card_height - 20 }}
            >
              {/* ????????? */}
              <DateList onScroll={this.updateDivScrollLeft} />
              <div
                style={{
                  width: this.updateLongDivWidth(),
                  position: 'absolute',
                  top: 28,
                  zIndex: 10,
                  left: this.state.ganttSelectedBarLeft * -1
                }}
              >
                {gantt_card_date_no_section &&
                  !!Object.keys(gantt_card_date_no_section).length &&
                  this.renderGanttCardDateNoSection()}
              </div>
              <div
                style={{ height: date_area_height }} //??????DateList?????????????????????
              />
              <div
                style={{
                  height: gantt_card_height - 20 - date_area_height
                }}
                className={indexStyles.panel_out}
                id={'gantt_card_out_middle'}
                ref={'gantt_card_out_middle'}
                onMouseEnter={() => this.setScrollArea('gantt_body')}
                onTouchStart={() => this.setScrollArea('gantt_body')}
                onMouseOverCapture={this.onMouseOverCapture}
                onScroll={this.ganttScroll}
              >
                {/* ???????????? */}
                {show_base_line_mode && (
                  <div className={indexStyles.toExitBaseLine} id="exitbaseline">
                    <span>????????????{active_baseline.name}</span>
                    <span
                      className={indexStyles.exit}
                      onClick={this.exitBaseLine}
                    >
                      ??????
                    </span>
                  </div>
                )}
                <div className={indexStyles.panel}>
                  {/* ??????????????? */}
                  <GetRowGantt
                    changeOutLineTreeNodeProto={
                      this.props.changeOutLineTreeNodeProto
                    }
                    deleteOutLineTreeNode={this.props.deleteOutLineTreeNode}
                    is_need_calculate_left_dx={is_need_calculate_left_dx}
                    gantt_card_height={gantt_card_height}
                    dataAreaRealHeight={dataAreaRealHeight}
                    setTaskDetailModalVisibile={
                      this.props.setTaskDetailModalVisibile
                    }
                    addTaskModalVisibleChange={
                      this.props.addTaskModalVisibleChange
                    }
                    setGoldDateArr={this.setGoldDateArr}
                    setScrollPosition={this.setScrollPosition}
                    setProcessDetailModalVisible={
                      this.props.setProcessDetailModalVisible
                    }
                    handleGetNewTaskParams={this.props.handleGetNewTaskParams}
                  />
                  <div
                    style={{
                      display: !closeFeature({
                        board_id: gantt_board_id,
                        currentUserOrganizes
                      })
                        ? 'block'
                        : 'none'
                    }}
                  >
                    {/* ???????????? */}
                    {gantt_board_id && gantt_board_id != '0' && (
                      <BoardTemplate
                        insertTaskToListGroup={this.props.insertTaskToListGroup}
                        gantt_card_height={gantt_card_height}
                      />
                    )}
                  </div>
                  {/* ?????????????????? */}
                  <CardDetailDrawer {...this.props.task_detail_props} />
                  {/* ?????????????????? */}
                  <CustomFieldDetailDrawer />
                </div>
                {/* <GetRowGanttItemElse
                  gantt_card_height={gantt_card_height}
                  dataAreaRealHeight={dataAreaRealHeight}
                /> */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className={indexStyles.cardDetail_right}></div> */}
        {/* ?????????????????? ???/???/???/??? */}
        <FaceRightButton
          setGoldDateArr={this.setGoldDateArr}
          setScrollPosition={this.setScrollPosition}
        />
        {isPaymentOrgUser() && is_show_board_file_area != '1' && (
          <ShowFileSlider />
        )}
        {/* ???????????? */}
        <BoardsFilesArea />
        {/* ??????????????? */}
        <GanttMilestonePublicInput />
      </div>
    )
  }
}
//  ??????????????????????????????state????????????UI ????????????props?????????????????????
function mapStateToProps({
  gantt: {
    datas: {
      ceilWidth,
      // target_scrollTop,
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
      get_gantt_data_loading_other,
      show_base_line_mode,
      active_baseline,
      date_arr_one_level = [],
      gantt_card_date_no_section = {}
    }
  },
  technological: {
    datas: { currentUserOrganizes = [] }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    ceilWidth,
    // target_scrollTop,
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
    get_gantt_data_loading_other,
    currentUserOrganizes,
    show_base_line_mode,
    active_baseline,
    projectDetailInfoData,
    date_arr_one_level,
    gantt_card_date_no_section
  }
}
GanttFace.defaultProps = {
  gantt_card_height: 600 //????????????????????????
}
