import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'
import DateList from './DateList'
import GroupListHead from './GroupListHead'
import { getMonthDate, getNextMonthDatePush, isSamDay } from './getDate'
import {INPUT_CHANGE_SEARCH_TIME} from "../../../../globalset/js/constant";
import {getGanttData} from "../../../../services/technological/gantt";
import {isApiResponseOk} from "../../../../utils/handleResponseData";
import { date_area_height } from './constants'
import GroupListHeadSet from './GroupListHeadSet.js'
import ShowFileSlider from './components/boardFile/ShowFileSlider'
import BoardsFilesArea from './components/boardFile/BoardsFilesArea'

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GanttFace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      viewModal: '2', //视图模式1周，2月，3年
      target_scrollLeft: 0, //滚动条位置，用来判断向左还是向右
      gantt_card_out_middle_max_height: 600,
      local_gantt_board_id: '0', //当前项目id（项目tab栏）缓存在组件内，用于判断是否改变然后重新获取数据
    }
    this.ganttScroll = this.ganttScroll.bind(this)
    this.setGanTTCardHeight = this.setGanTTCardHeight.bind(this)
  }

  componentDidMount() {
    const { gantt_board_id } = this.props
    this.setState({
      local_gantt_board_id: gantt_board_id
    })
    this.setGoldDateArr({init: true})
    this.initSetScrollPosition()
    this.setGanTTCardHeight()
    window.addEventListener('resize', this.setGanTTCardHeight, false)
  }
 
  componentWillUnmount() {
    window.removeEventListener('resize', this.setGanTTCardHeight, false)
  }
  //设置卡片高度
  setGanTTCardHeight() {
    const documentHeight = document.documentElement.clientHeight;//获取页面可见高度
    const gantt_card_out = document.getElementById('gantt_card_out')
    let offsetTop = 0
    if(gantt_card_out) {
      offsetTop = gantt_card_out.offsetTop
      this.setState({
        gantt_card_out_middle_max_height: documentHeight - offsetTop - 20
      })
    }
    }

  //  初始化设置滚动横向滚动条位置
  initSetScrollPosition() {
    const { datas: { ceilWidth } } = this.props.model
    const date = new Date().getDate()
    //30为一个月长度，3为遮住的部分长度，date为当前月到今天为止的长度,1为偏差修复
    this.setScrollPosition({delay: 300, position: ceilWidth * (30 - 3 + date - 1)})
  }
  //设置滚动条位置
  setScrollPosition({delay = 300, position = 200}) {
    const that = this
    const target = this.refs.gantt_card_out_middle
    setTimeout(function () {
      if(target.scrollTo) {
        target.scrollTo(position, 0)
      }else {
        target.scrollLeft = position
      }
    }, delay)
  }

  //左右拖动,日期会更新
  ganttScroll = (e) => {
    e.stopPropagation();
    if('gantt_card_out_middle' != e.target.getAttribute("id")) return
    const that = this
    const { searchTimer } = this.state
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    const { target_scrollLeft } = this.state
    const scrollTop = e.target.scrollTop
    const scrollLeft = e.target.scrollLeft
    const scrollWidth = e.target.scrollWidth
    const clientWidth = e.target.clientWidth
    const { datas: { ceilWidth, gold_date_arr = [], date_total } } = this.props.model
    let delX = target_scrollLeft - scrollLeft //判断向左还是向右

    if(scrollLeft < 3 * ceilWidth && delX > 0) { //3为分组头部占用三个单元格的长度
      const { timestamp} = gold_date_arr[0]['date_inner'][0]
      this.setState({
        searchTimer: setTimeout(function () {
          that.setGoldDateArr({timestamp}) //取左边界日期来做日期更新的基准
          that.setScrollPosition({delay: 300, position: 30 * ceilWidth}) //大概移动四天的位置
        }, INPUT_CHANGE_SEARCH_TIME)
      })

    }else if ((scrollWidth - scrollLeft - clientWidth < ceilWidth) && delX < 0 ){
      const { timestamp } = gold_date_arr[gold_date_arr.length - 1]['date_inner'][gold_date_arr[gold_date_arr.length - 1]['date_inner'].length - 1]
      this.setState({
        searchTimer: setTimeout(function () {
          that.setGoldDateArr({timestamp, to_right: 'to_right'}) //取有边界日期来做更新日期的基准
          that.setScrollPosition({delay: 300, position: scrollWidth - clientWidth - 2 * ceilWidth}) //移动到最新视觉
        }, INPUT_CHANGE_SEARCH_TIME)
      })
    }

    this.setState({
      target_scrollLeft: scrollLeft
    })
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        target_scrollLeft: scrollLeft
      }
    })

    const { datas: { target_scrollTop }} = this.props.model
    if(target_scrollTop != scrollTop ) {
      dispatch({
        type: getEffectOrReducerByName('updateDatas'),
        payload: {
          target_scrollTop: scrollTop
        }
      })
    }
  }

  //更新日期,日期更新后做相应的数据请求
  setGoldDateArr({timestamp, to_right, init}) {
    const { dispatch } = this.props
    const { datas: { gold_date_arr = [], isDragging }} = this.props.model
    let date_arr = []
    if(!!to_right && isDragging ) { //如果是拖拽虚线框向右则是累加，否则是取基数前后
      date_arr = [].concat(gold_date_arr, getNextMonthDatePush(timestamp))
    } else {
      date_arr = getMonthDate(timestamp)
    }
    const date_arr_one_level = []
    let date_total = 0
    for(let val of date_arr) {
      const { date_inner = [] } = val
      for(let val2 of date_inner) {
        date_total += 1
        date_arr_one_level.push(val2)
      }
    }
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

    //  做数据请求
    if(gold_date_arr[0]) {
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
    const that = this
    setTimeout(function () {
      dispatch({
        type: getEffectOrReducerByName('getGanttData'),
        payload: {}
      })
      that.getHoliday()
    }, 300)
  }

  // 获取到实际有数据的区域总高度，为了和最后一行区分开
  getDataAreaRealHeight = () => {
    const { datas: { list_group = [], group_rows = [], ceiHeight }} = this.props.model
    const item_height_arr = list_group.map((item, key) => {
       return group_rows[key] * ceiHeight
    })
    // console.log('sssss_1', item_height_arr)
    if(!item_height_arr.length) return 0

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
  render () {
    const { gantt_card_out_middle_max_height } = this.state
    const { gantt_card_height } = this.props
    const dataAreaRealHeight = this.getDataAreaRealHeight()

    return (
      <div className={indexStyles.cardDetail} id={'gantt_card_out'} style={{height: gantt_card_height}}>
        <div className={indexStyles.cardDetail_left}></div>
        <div className={indexStyles.cardDetail_middle}
             id={'gantt_card_out_middle'}
             ref={'gantt_card_out_middle'}
             onScroll={this.ganttScroll}
             style={{maxHeight: gantt_card_out_middle_max_height}}
        >
          <GroupListHeadSet />
          <div
            style={{height: date_area_height}} //撑住DateList相同高度的底部
          />
          <DateList />
          <div className={indexStyles.panel}>
            <GroupListHead gantt_card_height={gantt_card_height} dataAreaRealHeight={dataAreaRealHeight}/>
            <GetRowGantt
              gantt_card_height={gantt_card_height}
              dataAreaRealHeight={dataAreaRealHeight}
              setTaskDetailModalVisibile={this.props.setTaskDetailModalVisibile}
              addTaskModalVisibleChange={this.props.addTaskModalVisibleChange}
            />
          </div>
        </div>
        <div className={indexStyles.cardDetail_right}></div>
        <ShowFileSlider />
        <BoardsFilesArea setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile}/>
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
GanttFace.defaultProps = {
  gantt_card_height: 600, //甘特图卡片总高度
}