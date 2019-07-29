import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGanttItem from './GetRowGanttItem'
import { Tooltip } from 'antd'
import { date_area_height, task_item_height, task_item_margin_top } from './constants'

const clientWidth = document.documentElement.clientWidth;//获取页面可见高度
const coperatedX = 80 //鼠标移动和拖拽的修正位置
const coperatedLeftDiv = 20 //滚动条左边还有一个div的宽度，作为修正
const dateAreaHeight = date_area_height //日期区域高度，作为修正
const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GetRowGantt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRect: { x: 0, y: 0, width: 0, height: task_item_height }, //当前操作的矩形属性
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

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  //鼠标拖拽移动
  dashedMousedown(e) {
    if(e.target.dataset.targetclassname == 'specific_example') { //不能滑动到某一个任务实例上
      return false
    }
    if(this.isDragging || this.isMouseDown) { //在拖拽中，还有防止重复点击
      return
    }
    const { currentRect = {} } = this.state
    this.x1 = currentRect.x
    this.y1 = currentRect.y
    this.setIsDragging(false)
    this.isMouseDown = true
    this.handleCreateTask({start_end: '1', top: currentRect.y})
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
    const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX
    const y = e.pageY - target.offsetTop + target_1.scrollTop - dateAreaHeight
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
      height: task_item_height,
    }

    this.setState({
      currentRect: property
    })
  }
  dashedDragMouseup(e) {
    if(e.target.dataset.targetclassname == 'specific_example') { //不能滑动到某一个任务实例上
      return false
    }
    const { currentRect = {} } = this.state
    this.stopDragging()
    this.handleCreateTask({start_end: '2', top: currentRect.y})
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
    if(e.target.dataset.targetclassname == 'specific_example') { //不能滑动到某一个任务实例上
      return false
    }
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
    let px = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX
    let py = e.pageY - target_0.offsetTop + target_1.scrollTop - dateAreaHeight

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
      height: task_item_height,
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
  handleCreateTask({start_end, top}) {
    const { dispatch } = this.props
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
    const update_name = start_end == '1'? 'create_start_time': 'create_end_time'
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        [update_name]: timestamp
      }
    })

    if(start_end == '2') { //拖拽或点击操作完成，进行生成单条任务逻辑
      this.setSpecilTaskExample({top}) //出现任务创建或查看任务
    }
  }

  //获取当前所在的分组, 根据创建或者查看任务时的高度
  getCurrentGroup({top}) {
    if(top == undefined || top == null) {
      return
    }
    const getSum = (total, num) => {
      return total + num;
    }
    const { dispatch } = this.props
    const { datas: { group_list_area = [], list_group = []} } = this.props.model
    let conter_key = 0
    for(let i = 0; i < group_list_area.length; i ++) {
      if(i == 0){
        if(top < group_list_area[0]) {
          conter_key = 0
          break
        }
      }else {
        const arr = group_list_area.slice(0, i + 1)
        const sum = arr.reduce(getSum);
        if(top < sum) {
          conter_key = i
          break
        }
      }
    }
    const current_list_group_id = list_group[conter_key]['list_id']
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        current_list_group_id
      }
    })
  }

  //遍历,做排序--交叉
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
              // console.log(k, j)
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

  //点击某个实例,或者创建任务
  setSpecilTaskExample({id, board_id, top},e) {
    if(e) {
      e.stopPropagation()
    }
    this.getCurrentGroup({top})
    const { dispatch } = this.props
    if(id) { //如果有id 则是修改任务，否则是创建任务
      this.props.setTaskDetailModalVisibile && this.props.setTaskDetailModalVisibile()
      dispatch({
        type: 'workbenchTaskDetail/getCardDetail',
        payload: {
          id,
          board_id
        }
      })
      dispatch({
        type: 'workbenchTaskDetail/getCardCommentListAll',
        payload: {
          id: id
        }
      })
      dispatch({
        type: 'workbenchPublicDatas/updateDatas',
        payload: {
          board_id
        }
      })
    } else {
      this.props.addTaskModalVisibleChange && this.props.addTaskModalVisibleChange(true)
    }
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
            margin: task_item_margin_top
          }} />
        )}
        {list_group.map((value, key) => {
          const { list_data = [] } = value
          return (
            list_data.map((value2, key) => {
              const { left, top, width, height, name, id, board_id, is_realize } = value2
              return (
                <Tooltip title={name} key={`${id}_${name}_${width}_${left}`}>
                <div className={indexStyles.specific_example} data-targetclassname="specific_example"
                     style={{
                        left: left, top: top,
                        width: (width || 6) - 6, height: (height || task_item_height),
                        marginTop: task_item_margin_top
                        // margin: '4px 0 0 2px',
                        // backgroundColor: is_realize == '0'? '#1890FF': '#9AD0FE'
                     }}
                     onClick={this.setSpecilTaskExample.bind(this,{ id, top, board_id})}
                />
                </Tooltip>
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

