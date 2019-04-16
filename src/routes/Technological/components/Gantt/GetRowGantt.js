import React, { Component } from 'react';
import indexStyles from './index.less'
import GetRowGanttItem from './GetRowGanttItem'

const clientWidth = document.documentElement.clientWidth;//获取页面可见高度

export default class GetRowGantt extends Component {
  getDate = () => {
    const DateArray = []
    for(let i = 1; i < 13; i++) {
      const obj = {
        dateTop: `${i}月`,
        dateInner: []
      }
      for(let j = 1; j < 32; j++) {
        const obj2 = {
          name: `${i}/${j}`,
          is_daily: j % 6 || j % 7 == 0 ? '1' : '0'
        }
        obj.dateInner.push(obj2)
      }
      DateArray.push(obj)
    }
    return DateArray
  }
  getListRow = () => {
    const arr = []
    for(let i = 0; i < 3; i ++) {
      const obj = {
        name: `任务名称_${i}`
      }
      arr.push(obj)
    }
    return arr
  }
  constructor(props) {
    super(props)
    this.state = {
      rects: [],
      punctuateArea: 48, //点击圈点的
      currentRect: { x: 0, y: 0, width: 0, height: 20 }, //当前操作的矩形属性
    }
    this.x1 = 0
    this.y1 = 0
    this.isDragging = false
    this.SelectedRect = {x: 0, y: 0 }

    this.x2 = 0
    this.y2 = 0
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

      console.log(property)
      this.setState({
        currentRect: property
      })
    }
  }
  dashedDragMouseup() {
    this.stopDragging()
  }

  dashedMouseOut(e) {
    console.log('sss')
    const target_0 = document.getElementById('gantt_card_out')
    const target_1 = document.getElementById('gantt_card_out_middle')
    const target = this.refs.operateArea//event.target || event.srcElement;
    this.x2 = e.clientX - target_0.offsetLeft + target_1.scrollLeft - 20
    this.y2 = e.pageY - target.offsetTop - 60
    this.SelectedRect = {x: 0, y: 0 }
    console.log(this.x2, this.y2)
    /*定义鼠标移动事件*/
    target.onmousemove = this.dashedMousemove.bind(this);
    /*定义鼠标抬起事件*/
    target.onmouseup = this.dashedMouseup.bind(this);
  }

  dashedMousemove(e) {
    //mousedown 后开始拖拽时添加
    const property = {
      x: this.x1,
      y: this.y1,
      width: 44,
      height: 20,
    }
    this.setState({
      currentRect: property,
    })

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
      this.SelectedRect.x= x-this.x2;
      this.SelectedRect.y= y-this.y2;


      // 更新拖拽的最新矩形
      let px = x < this.x2 ? this.x2 - Math.abs(this.SelectedRect.x) : x - Math.abs(this.SelectedRect.x)
      let py = this.y2//y < this.y1 ? this.y1 - Math.abs(this.SelectedRect.y) : y - Math.abs(this.SelectedRect.y)
      let width = Math.abs(this.SelectedRect.x)

      const property ={
        x: px,
        y: py,
        width: 40,
        height: 20,
      }

      console.log(property)
      this.setState({
        currentRect: property
      })
    }
  }
  dashedMouseup() {
    this.stopDragging()
  }

  render () {
    const { currentRect = {} } = this.state

    return (
      <div className={indexStyles.gantt_operate_top}
           onMouseDown={this.dashedMousedown.bind(this)}
           onMouseOver={this.dashedMouseOut.bind(this)}
           ref={'operateArea'}>

        <div className={indexStyles.dasheRect} style={{
          left: currentRect.x, top: currentRect.y,
          width: currentRect.width, height: currentRect.height,
        }} />

        {this.getListRow().map((value, key) => {
          return (
            <GetRowGanttItem key={key}/>
          )
        })}

      </div>
    )
  }

}
