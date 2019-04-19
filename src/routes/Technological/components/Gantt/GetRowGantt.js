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
    }
    this.x1 = 0 //用于做拖拽生成一条任务
    this.y1 = 0
    this.isDragging = false //判断是否在拖拽虚线框
    this.isMouseDown = false //是否鼠标按下
    this.SelectedRect = {x: 0, y: 0 }

  }

  stopDragging() {
    const target = this.refs.operateArea
    target.onmousemove = null;
    target.onmuseup = null;
    const that = this
    setTimeout(function () {
      that.isDragging = false
      that.isMouseDown = false
    }, 1000)
  }
  dashedMousedown(e) {
    const { currentRect = {} } = this.state
    this.x1 = currentRect.x
    this.y1 = currentRect.y
    this.isDragging = false
    this.isMouseDown = true
    const target = this.refs.operateArea//event.target || event.srcElement;
    target.onmousemove = this.dashedDragMousemove.bind(this);
    target.onmouseup = this.dashedDragMouseup.bind(this);
  }
  dashedDragMousemove(e) {
    this.isDragging = true
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
    let px = x < this.x1 ? x : this.x1 //向左向右延申
    let py = this.y1
    let width = offset_left < ceilWidth ? ceilWidth : offset_left

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
  }
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

  render () {
    const { currentRect = {}, dasheRectShow } = this.state

    const { datas: { gold_date_arr = [], list_group =[], ceilWidth }} = this.props.model

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
          }} />
        )}

        {list_group.map((value, key) => {
          return (
            <GetRowGanttItem key={key}/>
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

