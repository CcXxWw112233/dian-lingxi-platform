import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGanttItem from './GetRowGanttItem'

const clientWidth = document.documentElement.clientWidth;//获取页面可见高度
const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GetRowGantt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRect: { x: 0, y: 0, width: 0, height: 20 }, //当前操作的矩形属性
      dasheRectShow: false, //虚线框是否显示
      isDasheRect: false, //生成任务后在原始虚线框位置处生成一条数据
      start_time: '',
      due_time: '',
      specific_example_arr: [], //任务实例列表
    }
    this.x1 = 0 //用于做拖拽生成一条任务
    this.y1 = 0
    this.isDragging = false //判断是否在拖拽虚线框
    this.isMouseDown = false //是否鼠标按下
    this.SelectedRect = {x: 0, y: 0 }
  }
  setIsDragging(isDragging) {
    const { dispatch } = this.props
    this.isDragging = isDragging
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        isDragging
      }
    })
  }
  //鼠标拖拽移动
  dashedMousedown(e) {
    if(this.isDragging || this.isMouseDown) { //在拖拽中，还有防止重复点击
      return
    }
    const { currentRect = {} } = this.state
    this.x1 = currentRect.x
    this.y1 = currentRect.y
    this.setIsDragging(false)
    this.isMouseDown = true
    this.handleCreateTask('1')
    const target = this.refs.operateArea//event.target || event.srcElement;
    target.onmousemove = this.dashedDragMousemove.bind(this);
    target.onmouseup = this.dashedDragMouseup.bind(this);
  }
  dashedDragMousemove(e) {
    if(e.target.dataset.targetclassname == 'specific_example') { //不能滑动到某一个任务实例上
      return false
    }
    this.setIsDragging(true)

    const { datas: { ceiHeight, ceilWidth }} = this.props.model

    const target_0 = document.getElementById('gantt_card_out')
    const target_1 = document.getElementById('gantt_card_out_middle')
    const target = this.refs.operateArea//event.target || event.srcElement;

    // 取得鼠标位置
    const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - 20
    const y = e.pageY - target.offsetTop - 60
    //设置宽度
    const offset_left = Math.abs(x - this.x1);
    // 更新拖拽的最新矩形
    let px = this.x1//x < this.x1 ? x : this.x1 //向左向右延申
    let py = this.y1
    let width = (offset_left < ceilWidth) || (x < this.x1) ? ceilWidth : offset_left //小于单位长度或者鼠标相对点击的起始点向左拖动都使用最小单位
    width = Math.ceil(width / ceilWidth) * ceilWidth - 6 //向上取整 4为微调
    const property ={
      x: px,
      y: py,
      width,
      height: 20,
    }

    this.setState({
      currentRect: property
    })
  }
  dashedDragMouseup() {
    this.stopDragging()
    this.handleCreateTask('2')
  }
  stopDragging() {
    const target = this.refs.operateArea
    target.onmousemove = null;
    target.onmuseup = null;
    const that = this
    setTimeout(function () {
      that.isMouseDown = false
      that.setIsDragging(false)
    }, 1000)
  }

  //鼠标移动
  dashedMouseMove(e) {
    const { datas: { ceiHeight, ceilWidth }} = this.props.model
    if(this.isMouseDown) { //按下的情况不处理
      return false
    }
    const { dasheRectShow } = this.state
    if(!dasheRectShow) {
      this.setState({
        dasheRectShow: true
      })
    }

    const target_0 = document.getElementById('gantt_card_out')
    const target_1 = document.getElementById('gantt_card_out_middle')
    // 取得鼠标位置
    let px = e.pageX - target_0.offsetLeft + target_1.scrollLeft - 20
    let py = e.pageY - target_0.offsetTop - 60

    const molX = px % ceilWidth
    const molY = py % ceiHeight
    const mulX = Math.floor(px / ceilWidth)
    const mulY = Math.floor(py / ceiHeight)
    const delX = Number((molX / ceilWidth).toFixed(1))
    const delY = Number((molY / ceiHeight).toFixed(1))

    px = px - molX
    py = py - molY

    const property ={
      x: px,
      y: py,
      width: 40,
      height: 20,
    }

    this.setState({
      currentRect: property
    })
  }
  dashedMouseLeave(e) {
    if(!this.isMouseDown) {
      this.setState({
        dasheRectShow: false
      })
    }
  }

  //记录起始时间，做创建任务工作
  handleCreateTask(start_end) {
    const { datas: { gold_date_arr = [], ceilWidth, date_arr_one_level = [] }} = this.props.model
    const { currentRect = {} } = this.state
    const { x, y, width, height } = currentRect
    let counter = 0
    let date = {}
    for(let val of date_arr_one_level) {
      counter += 1
      if(counter * ceilWidth > x + width ) {
        date = val
        break
      }
    }
    const { timestamp } = date
    console.log(start_end, date)
    const update_name = start_end == '1'? 'start_time': 'end_time'
    this.setState({
      [update_name]: timestamp
    })
    if(start_end == '2') { //拖拽或点击操作完成，进行生成单条任务逻辑
       //出现具体任务实例
      this.setState({

      })
    }
  }

  componentDidMount() {
  //   const that = this
  //   setTimeout(function () {
  //     that.initSet(that.props)
  //   }, 500)
  }

  componentWillReceiveProps(nextProps) {

  }

  initSet(props) {
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

  //遍历
  taskItemToTop() {
    const { dispatch } = this.props

    //根据所获得的分组数据转换所需要的数据
    const { datas: { list_group = [] } } = this.props.model

    const list_group_new = [...list_group]

    //设置分组区域高度, 并为每一个任务新增一条
    for (let i = 0; i < list_group_new.length; i ++ ) {
      const list_data = list_group_new[i]['list_data']
      const length = list_data.length
      for(let j = 0; j < list_data.length; j++) { //设置每一个实例的位置
        const item = list_data[j]
        let isoverlap = true //是否重叠，默认不重叠
        if(j > 0) {
          for(let k = 0; k < j; k ++) {
            if(list_data[j]['start_time'] < list_data[k]['end_time'] || list_data[k]['end_time'] < list_data[j]['start_time']) {

            } else {
              isoverlap = false
              item.top = list_data[k].top
              console.log(k, j)
              break
            }
          }
        }
        list_group_new[i]['list_data'][j] = item

        if(!isoverlap) {
          break
        }

      }
    }

    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        list_group: list_group_new
      }
    })
  }

  render () {
    const { currentRect = {}, dasheRectShow } = this.state

    const { datas: { gold_date_arr = [], list_group =[], ceilWidth, group_rows = [] }} = this.props.model

    return (
      <div className={indexStyles.gantt_operate_top}
           onMouseDown={this.dashedMousedown.bind(this)} //用来做拖拽虚线框
           onMouseMove={this.dashedMouseMove.bind(this)}
           onMouseLeave={this.dashedMouseLeave.bind(this)}
           ref={'operateArea'}>
        {dasheRectShow && (
          <div className={indexStyles.dasheRect} style={{
            left: currentRect.x, top: currentRect.y,
            width: currentRect.width, height: currentRect.height,
            boxSizing: 'border-box',
            margin: '4px 0 0 2px'
          }} />
        )}
        {list_group.map((value, key) => {
          const { list_data = [] } = value
          return (
            list_data.map((value2, key) => {
              const { left, top, width, height } = value2
              return (
                <div className={indexStyles.specific_example} key={key} data-targetclassname="specific_example" style={{
                  left: left, top: top,
                  width: (width || 6) - 6, height: (height || 20),
                  margin: '4px 0 0 2px'
                }} />
              )
            })
          )
        })}


        {list_group.map((value, key) => {
          const { list_name, list_id, list_data = [] } = value
          return (
            <GetRowGanttItem key={list_id} list_id={list_id} list_data={list_data} rows={group_rows[key]}/>
          )
        })}

      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}

