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
    this.isDragging = false
    this.isMouseDown = false
    this.SelectedRect = {x: 0, y: 0 }

    this.x2 = 0 //用于鼠标hover显示一个虚线框
    this.y2 = 0
    this.YCeil = 24
    this.XCeil = 44 // 44
  }

  isObj(obj) {
    if(!obj || typeof obj !=='object') {
      return false
    } else {
      return true
    }
  }
  stopDragging() {
    const target = this.refs.operateArea
    target.onmousemove = null;
    target.onmuseup = null;
  }
  dashedMousedown(e) {

    // 取得target上被单击的点
    const target_0 = document.getElementById('gantt_card_out')
    const target_1 = document.getElementById('gantt_card_out_middle')
    const target = this.refs.operateArea//event.target || event.srcElement;
    this.x1 = e.clientX - target_0.offsetLeft + target_1.scrollLeft - 20
    this.y1 = e.pageY - target.offsetTop - 60
    this.SelectedRect = {x: 0, y: 0 }
    this.isDragging = false
    this.isMouseDown = true
    /*定义鼠标移动事件*/
    target.onmousemove = this.dashedDragMousemove.bind(this);
    /*定义鼠标抬起事件*/
    target.onmouseup = this.dashedDragMouseup.bind(this);
  }
  dashedDragMousemove(e) {
    //mousedown 后开始拖拽时添加
    if(!this.isDragging) {
      const property = {
        x: this.x1,
        y: this.y1,
        width: this.SelectedRect.x,
        height: 20,
      }
      this.setState({
        currentRect: property,
      })

    }

    // 判断矩形是否开始拖拽
    const target_0 = document.getElementById('gantt_card_out')
    const target_1 = document.getElementById('gantt_card_out_middle')
    const target = this.refs.operateArea//event.target || event.srcElement;
    this.isDragging = true

    // 判断拖拽对象是否存在
    if (this.isObj(this.SelectedRect)) {
      // 取得鼠标位置
      const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - 20
      const y = e.pageY - target.offsetTop - 60

      //------------------------
      //设置高度
      this.SelectedRect.x= x-this.x1;
      this.SelectedRect.y= y-this.y1;


      // 更新拖拽的最新矩形
      let px = x < this.x1 ? this.x1 - Math.abs(this.SelectedRect.x) : x - Math.abs(this.SelectedRect.x)
      let py = this.y1//y < this.y1 ? this.y1 - Math.abs(this.SelectedRect.y) : y - Math.abs(this.SelectedRect.y)
      let width = Math.abs(this.SelectedRect.x)

      const property ={
        x: px,
        y: py,
        width,
        height: 20,
      }

      // console.log(property)
      this.setState({
        currentRect: property
      })
    }
  }
  dashedDragMouseup() {
    this.isMouseDown = false
    this.stopDragging()
  }
  dashedMouseOver(e) {
    console.log(111)
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
    const target = this.refs.operateArea
    this.x2 = e.clientX - target_0.offsetLeft + target_1.scrollLeft - 20
    this.y2 = e.clientY - target_0.offsetTop - 60

    // 判断拖拽对象是否存在
    if (this.isObj(this.SelectedRect)) {
      // 取得鼠标位置
      const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - 20
      const y = e.pageY - target_0.offsetTop - 60

      //------------------------
      //设置left 和 top
      this.SelectedRect.x = x - this.x2;
      this.SelectedRect.y = y - this.y2;

      // 更新拖拽的最新矩形
      let px = x < this.x2 ? this.x2 - Math.abs(this.SelectedRect.x) : x - Math.abs(this.SelectedRect.x)
      let py = y < this.y1 ? this.y1 - Math.abs(this.SelectedRect.y) : y - Math.abs(this.SelectedRect.y)

      const molX = px % this.XCeil
      const molY = py % this.YCeil
      const mulX = Math.floor(px / this.XCeil)
      const mulY = Math.floor(py / this.YCeil)
      const delX = Number((molX / this.XCeil).toFixed(1))
      const delY = Number((molY / this.YCeil).toFixed(1))

      // console.log('startHover', {
      //   px,
      //   py,
      //   molX,
      //   molY,
      //   delX,
      //   delY,
      //   mulX,
      //   mulY
      // })

      px = px - molX
      py = py - molY

      // if (delX == 0) {
      //   px = px - molX
      // } else {
      //   px = px + this.XCeil - molX
      // }
      // if (delY == 0) {
      //   py = py - molY //4为向上距离 24 - 20
      // } else {
      //   py = py + this.YCeil - molY
      // }
      //
      // console.log('endHover', {
      //   px,
      //   py,
      //   molX,
      //   molY,
      //   delX,
      //   delY,
      //   mulX,
      //   mulY
      // })
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

  }
  dashedMouseLeave(e) {
    this.setState({
      dasheRectShow: false
    })
  }

  render () {
    const { currentRect = {}, dasheRectShow } = this.state

    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model

    return (
      <div className={indexStyles.gantt_operate_top}
           // onMouseDown={this.dashedMousedown.bind(this)} //用来做拖拽虚线框
           onMouseOut={this.dashedMouseOver.bind(this)}
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
