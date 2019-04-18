import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'
import DateList from './DateList'
import GroupListHead from './GroupListHead'
import { getMonthDate } from './getDate'
import {INPUT_CHANGE_SEARCH_TIME} from "../../../../globalset/js/constant";

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class Gantt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      viewModal: '2', //视图模式1周，2月，3年
      target_scrollLeft: 0, //滚动条位置，用来判断向左还是向右
    }
    this.ganttScroll = this.ganttScroll.bind(this)
  }

  componentDidMount() {
    this.setGoldDateArr()
    this.setListRowGroup()
    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model
    this.setScrollPosition({delay: 300})

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
  setGoldDateArr(timestamp) {
    const { dispatch } = this.props
    const { datas: { gold_date_arr = [] }} = this.props.model
    const date_arr = getMonthDate(timestamp)
    let date_total = 0
    for(let val of date_arr) {
      const { date_inner = [] } = val
      for(let val2 of date_inner) {
        date_total += 1
      }
    }
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        gold_date_arr: date_arr,
        date_total
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

  }
  //获取分组，赋值
  setListRowGroup = () => {
    const { dispatch } = this.props
    const arr = []
    for(let i = 0; i < 3; i ++) {
      const obj = {
        name: `任务名称_${i}`
      }
      arr.push(obj)
    }
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        list_group: arr,
      }
    })
  }
  //左右拖动,日期会更新
  ganttScroll = (e) => {
    const that = this
    const { searchTimer } = this.state
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    const { target_scrollLeft } = this.state
    const scrollLeft = e.target.scrollLeft
    const scrollWidth = e.target.scrollWidth
    const clientWidth = e.target.clientWidth
    const { datas: { ceilWidth, gold_date_arr = [] } } = this.props.model
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
          that.setGoldDateArr(timestamp) //取有边界日期来做更新日期的基准
          that.setScrollPosition({delay: 300, position: 30 * ceilWidth}) //大概移动两个月的位置
        }, INPUT_CHANGE_SEARCH_TIME)
      })

    }

    this.setState({
      target_scrollLeft: scrollLeft
    })

  }
  render () {
    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model
    return (
      <div className={indexStyles.cardDetail} id={'gantt_card_out'}>
        <div className={indexStyles.cardDetail_left}></div>
        <div className={indexStyles.cardDetail_middle}
             id={'gantt_card_out_middle'}
             ref={'gantt_card_out_middle'}
             onScroll={this.ganttScroll}>
          <DateList />
          <div className={indexStyles.panel}>
            <GroupListHead />
            <GetRowGantt />
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
