import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'
import DateList from './DateList'
import GroupListHead from './GroupListHead'
import { getMonthDate, getNextMonthDatePush } from './getDate'
import {INPUT_CHANGE_SEARCH_TIME} from "../../../../globalset/js/constant";

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
    }
    this.ganttScroll = this.ganttScroll.bind(this)
    this.setGanTTCardHeight = this.setGanTTCardHeight.bind(this)
  }

  componentDidMount() {
    this.setGoldDateArr()
    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model
    this.setScrollPosition({delay: 300})
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

  componentWillReceiveProps (nextProps) {
    const { datas: { gold_date_arr = [], list_group =[] }} = nextProps.model
  }

  //设置滚动条位置
  setScrollPosition({delay = 300, position = 200}) {
    const that = this
    const target = this.refs.gantt_card_out_middle
    setTimeout(function () {
      target.scrollTo(position, 0)
    }, delay)
  }

  //更新日期
  setGoldDateArr(timestamp, to_right) {
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
      that.setListGroup(that.props)
    }, 500)
  }

  //左右拖动,日期会更新
  ganttScroll = (e) => {
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
          that.setGoldDateArr(timestamp) //取左边界日期来做日期更新的基准
          that.setScrollPosition({delay: 300, position: 30 * ceilWidth}) //大概移动四天的位置
        }, INPUT_CHANGE_SEARCH_TIME)
      })

    }else if ((scrollWidth - scrollLeft - clientWidth < ceilWidth) && delX < 0 ){
      const { timestamp } = gold_date_arr[gold_date_arr.length - 1]['date_inner'][gold_date_arr[gold_date_arr.length - 1]['date_inner'].length - 1]
      this.setState({
        searchTimer: setTimeout(function () {
          that.setGoldDateArr(timestamp, 'to_right') //取有边界日期来做更新日期的基准
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

  //设置分组数据
  setListGroup(props) {
    const { dispatch } = props

    const target_0 = document.getElementById('gantt_card_out')
    const target_1 = document.getElementById('gantt_card_out_middle')

    //根据所获得的分组数据转换所需要的数据
    const { datas: { list_group = [], group_rows = [], ceiHeight, ceilWidth, date_arr_one_level = [] } } = this.props.model
    const specific_example_arr = []
    const group_list_area = [] //分组高度区域

    //设置分组区域高度, 并为每一个任务新增一条
    for (let i = 0; i < list_group.length; i ++ ) {
      const list_data = list_group[i]['list_data']
      const length = (list_data.length || 1) + 1
      const group_height = length * ceiHeight
      group_list_area[i] = group_height
      group_rows[i] = length
      for(let j = 0; j < list_data.length; j++) { //设置每一个实例的位置
        const item = list_data[j]
        item.width = item.time_span * ceilWidth
        item.height = 20
        //设置横坐标
        for(let k = 0; k < date_arr_one_level.length; k ++) {
          if(item['start_time'] == date_arr_one_level[k]['timestamp']) { //是同一天
            item.left = k * ceilWidth
            break
          }
        }

        //设置纵坐标
        //根据历史分组统计纵坐标累加
        let after_group_height = 0
        for(let k = 0; k < i; k ++ ) {
          after_group_height += group_list_area[k]
        }
        item.top = after_group_height + j * ceiHeight

        list_group[i]['list_data'][j] = item
      }
    }

    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        group_list_area,
        group_rows,
        list_group
      }
    })
    // this.taskItemToTop()
  }

  render () {
    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model
    const { gantt_card_out_middle_max_height } = this.state

    return (
      <div className={indexStyles.cardDetail} id={'gantt_card_out'}>
        <div className={indexStyles.cardDetail_left}></div>
        <div className={indexStyles.cardDetail_middle}
             id={'gantt_card_out_middle'}
             ref={'gantt_card_out_middle'}
             onScroll={this.ganttScroll}
             style={{maxHeight: gantt_card_out_middle_max_height}}
        >
          <div
            style={{height: 60}} //撑住DateList相同高度的底部
          />
          <DateList />
          <div className={indexStyles.panel}>
            <GroupListHead />
            <GetRowGantt
              setTaskDetailModalVisibile={this.props.setTaskDetailModalVisibile}
              addTaskModalVisibleChange={this.props.addTaskModalVisibleChange}
            />
          </div>
        </div>
        <div className={indexStyles.cardDetail_right}></div>
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
