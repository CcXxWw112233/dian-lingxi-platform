import React from 'react'
import styles from './orgstructurecanvas.less'
import Konva from 'konva'
import {
  addRectText,
  addSubLineForS2E,
  bezierSize,
  LineHeight,
  siblingBetweenSize
} from '../utils'
import {
  ClickRectColor,
  FirstRectColor,
  HoverRectColor,
  OtherRectColor
} from '../constans'
import { MaxZIndex } from '../../../../../../../globalset/js/constant'

/** 组织架构的组织架构图
 * @description 用于展示组织架构图
 */
export default class OrgStructureCanvas extends React.Component {
  /** 整体画布 */
  Stage = null
  /** 展示画布 */
  Layer = null
  /** 画布中心 */
  Center = {
    /** X中心 */
    x: 0,
    /** Y中心 */
    y: 0
  }

  /** 所有元素的总高度 */
  totalHeight = 0

  /** 上一个选中的框 */
  prevAvtiveRect = null

  /** 更新缩小范围 */
  scale = 1

  /** 是否在编辑 */
  isEdit = false

  /** 动画 */
  tween = null

  /** 放大约数 */
  scaleBy = 1.05

  /** 最大放大比例 */
  maxZoom = 4

  /** 最小缩小比例 */
  minZoom = 0.2

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.initCanvas()
  }
  componentWillUnmount() {
    this.Stage = null
    this.Layer = null
  }
  /** 构建整个canvas和架构图 */
  initCanvas = () => {
    const { onChange, onZoom } = this.props
    const maxZoom = this.props.maxZoom || this.maxZoom
    const minZoom = this.props.minZoom || this.minZoom
    /** 视图宽度 */
    const width = window.innerWidth
    /** 视图高度 */
    const height = window.innerHeight
    /** 构建框架 */
    this.Stage = new Konva.Stage({
      container: 'canvas_container',
      width,
      height,
      draggable: true
    })
    /** 构建画布 */
    this.Layer = new Konva.Layer()
    this.Center.x = this.Stage.width() / 2
    this.Center.y = this.Stage.height() / 2
    this.Stage.add(this.Layer)
    /** 此方法用于获取到数据之后渲染 */
    this.MainGroupRender()
    var scaleBy = this.scaleBy
    this.Stage.on('wheel', e => {
      e.evt.preventDefault()
      if (this.isEdit) return
      var oldScale = this.Layer.scaleX()

      var mousePointTo = {
        x:
          this.Stage.getPointerPosition().x / oldScale -
          this.Stage.x() / oldScale,
        y:
          this.Stage.getPointerPosition().y / oldScale -
          this.Stage.y() / oldScale
      }

      var newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
      if (newScale <= minZoom) {
        newScale = minZoom
      }
      if (newScale >= maxZoom) {
        newScale = maxZoom
      }
      this.Layer.scale({ x: newScale, y: newScale })

      var newPos = {
        x:
          -(mousePointTo.x - this.Stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - this.Stage.getPointerPosition().y / newScale) *
          newScale
      }
      this.Stage.position(newPos)
      this.Stage.batchDraw()
      this.scale = newScale
      onZoom && onZoom(this.scale)
    })
    /** 清空选中的元素 */
    this.Stage.on('click', e => {
      e.evt.preventDefault()
      if (e.target === this.Stage) {
        if (this.prevAvtiveRect) {
          this.prevAvtiveRect.clearCache()
          this.prevAvtiveRect.stroke('transparent')
          this.prevAvtiveRect.strokeWidth(0)
          this.Layer.draw()
          this.prevAvtiveRect = null
          onChange && onChange(null)
        }
      }
    })
  }

  /** 清除选中 */
  clearSelect = () => {
    if (this.prevAvtiveRect) {
      this.prevAvtiveRect.clearCache()
      this.prevAvtiveRect.stroke('transparent')
      this.prevAvtiveRect.strokeWidth(0)
      this.Layer.draw()
      this.prevAvtiveRect = null
    }
  }

  /** 格式化roles列表 */
  forMathChild = (roles = []) => {
    const arr = roles.map(item => {
      const obj = { ...item }
      if (obj.roles && obj.roles.length) {
        obj.roles = this.forMathChild(obj.roles)
      }
      /** 创建一个节点属性 */
      const nodes = addRectText({ text: item.role_group_name })
      obj._width = nodes.rect.width()
      /** 用来获取属性的，用完需要销毁，防止内存泄漏 */
      for (let key in nodes) {
        nodes[key].destroy && nodes[key].destroy()
      }
      return obj
    })
    return arr
  }

  /** 获取当前数据的所有子集宽度 */
  getChildWidthTotal = (childroles = [], width = 0) => {
    /** 总宽度 */
    let child_width = width
    childroles.forEach((item, i) => {
      child_width += item._width
      if (item.roles && item.roles.length) {
        let child = this.getChildWidthTotal(item.roles)
        /** 如果子集的宽度不大于父级的宽度，则不累加,否则累加子集超出的部分 */
        child_width +=
          child > item._width + siblingBetweenSize
            ? child - item._width + siblingBetweenSize * (item.roles.length + 1)
            : 0
      }
      child_width += siblingBetweenSize
    })
    return child_width
  }

  getChildWidthNotSplit = (childroles = []) => {
    /** 总宽度 */
    let child_width = 0
    childroles.forEach((item, i) => {
      child_width += item._width
      if (item.roles && item.roles.length) {
        let child = this.getChildWidthNotSplit(item.roles)
        /** 如果子集的宽度不大于父级的宽度，则不累加,否则累加子集超出的部分 */
        child_width += child > item._width + siblingBetweenSize ? child : 0
      }
      child_width += siblingBetweenSize
    })
    return child_width
  }

  /** 子集渲染
   * @param {{}[]} roles 分组的子集列表
   * @param {boolean} nextData 是否有下一个分组数据，用来分隔子集的位置
   * @param {number} x 初始位置的X
   * @param {number} y 初始Y
   */
  rolesChildRender = (roles = [], nextData, x, y) => {
    const { activeItem } = this.props
    /** 子集列表 */
    const arr = roles
    /** 上一个渲染的元素宽度 */
    // let prevWidth = 0
    /** 左侧X的数组 */
    let leftXArr = []
    /** 右侧X的数组 */
    let rightXArr = []
    /** 上一个渲染元素的X坐标 */
    // let prevX = 0
    /** 渲染的上一个数据的结尾x */
    let prevTotalX = 0
    let prevRect = null
    let totalH = 0
    let childH = 0
    let heightArr = []
    /** 从中间分隔 */
    // const splitCenter = Math.floor(roles.length / 2)
    // if (!nextData) {
    /** 起始点 */
    let start = null
    /** 结束点 */
    let end = null
    arr.forEach((item, index) => {
      /** 单个元素的总宽度，包含了子集，子子集，递归获取 */
      let itemWidth = item._width + siblingBetweenSize
      let childTotalWidth = this.getChildWidthTotal(item.roles)
      if (item.roles && item.roles.length) {
        itemWidth = Math.max(item._width + siblingBetweenSize, childTotalWidth)
      }
      let yH = 0
      /** 子集的x坐标 */
      let itemX = x

      /** todo 后面需改进 */
      if (itemWidth > item._width + siblingBetweenSize) {
        /** 子集全部的中心点 */
        const childCenter = childTotalWidth / 2
        /** 往左偏移的位置 */
        itemX = itemX + (childCenter - siblingBetweenSize * 3)
      }
      /** 上一个数据的最后的X轴位置 */
      // const prevEndX =
      //   (prevRect?.x() || 0) + (prevRect?.width() || 0) + siblingBetweenSize
      /** 释放上一个保存的 */
      if (prevRect && prevRect.destroy) {
        prevRect.destroy()
      }
      /** 当前数据X轴的位置
       * 当前x轴的点 - 框的居中偏移量得出下一个数据的起始点
       */
      // const startX = itemX + prevTotalX - item._width / 2
      // if (prevEndX >= startX && prevTotalX) {
      //   /** 如果后面的数据有重叠，就位移重叠的距离 */
      //   itemX = itemX + (prevEndX - startX)
      // }
      const { rect, topLine, line, text, nodeHeight } = addRectText({
        text: item.role_group_name,
        x: itemX + prevTotalX,
        y,
        rectStyle: { fill: '#fff' }
      })

      yH = nodeHeight
      /** 这里不需要用到line，销毁 */
      if (line.destroy && !item.roles?.length) {
        line.destroy()
      } else if (item.roles?.length && item.roles.length > 1) {
        /** 如果有子集，就添加下面的线条 */
        this.Layer.add(line)
        yH = nodeHeight + LineHeight
      }
      if (index === 0 && arr.length > 1) {
        start = rect
        topLine.clearCache()
        topLine.points([0, rect.y(), 0, rect.y() - LineHeight + bezierSize])
        topLine.cache()
      }
      if (index === arr.length - 1 && arr.length > 1) {
        end = rect
        topLine.clearCache()
        topLine.points([0, rect.y(), 0, rect.y() - LineHeight + bezierSize])
        topLine.cache()
      }
      this.Layer.add(rect)
      this.Layer.add(text)
      this.Layer.add(topLine)
      this.Layer.draw()

      if (activeItem && activeItem.id === item.id) {
        this.setRectActive(rect, item)
      }

      this.AddTextEvent(text, rect, item)
      /** 保存上一个宽度 */
      // prevWidth = itemWidth
      /** 保存上一个x的坐标 */
      // prevX = itemX

      /** 保存总共渲染的位置 */
      // prevTotalX += prevWidth + siblingBetweenSize
      prevTotalX +=
        itemWidth + siblingBetweenSize * ((item.roles?.length || 0) + 1)
      prevRect = rect.clone()

      if (item.roles && item.roles.length) {
        /**
         * 子集往左偏移的计算
         * @description
         */
        const childObj = this.rolesChildRender(
          item.roles,
          false,
          /** 后面需改进 */
          topLine.x() -
            (topLine.x() - (topLine.x() - childTotalWidth / 2)) +
            siblingBetweenSize / 2,
          y + yH,
          rect
        )
        childH = childObj.height
        leftXArr = leftXArr.concat(childObj.leftX)
        rightXArr = rightXArr.concat(childObj.rightX)
      }
      totalH = yH + childH
      heightArr.push(totalH)

      leftXArr.push(rect.x())
      rightXArr.push(rect.x() + rect.width())
    })

    const maxHeight = Math.max.apply(this, [...heightArr, 1])
    if (start && end) {
      /** 连接的线 */
      const totalLine = addSubLineForS2E(
        this.Layer,
        start.x() + start.width() / 2 - 1,
        start.y() - LineHeight,
        end.x() + end.width() / 2 + 1,
        end.y() - LineHeight
      )
      totalLine.cache()
      this.Layer.add(totalLine)
      this.Layer.draw()
    }
    // }
    return { height: maxHeight, leftX: leftXArr, rightX: rightXArr }
  }

  reset = () => {}

  /** 放大
   * @param {number} val 放大数值
   */
  zoomIn = val => {
    const oldScale = this.Layer.scaleX()
    this.scale = val || oldScale * this.scaleBy
    this.zoom()
    return this.scale
  }
  /** 缩小
   * @param {number} val 缩小数值
   */
  zoomOut = val => {
    const oldScale = this.Layer.scaleX()
    this.scale = val || oldScale / this.scaleBy
    this.zoom()
    return this.scale
  }
  /** 缩放操作 */
  zoom = () => {
    const { onZoom } = this.props
    const oldScale = this.Layer.scaleX()
    this.Layer.scale({ x: this.scale, y: this.scale })
    this.stageMoveCenter(oldScale)
    onZoom && onZoom(this.scale)
  }

  stageMoveCenter = oldScale => {
    var mousePointTo = {
      x: this.Stage.width() / 2 / oldScale - this.Stage.x() / oldScale,
      y: this.Stage.height() / 2 / oldScale - this.Stage.y() / oldScale
    }

    var newPos = {
      x: -(mousePointTo.x - this.Stage.width() / 2 / this.scale) * this.scale,
      y: -(mousePointTo.y - this.Stage.height() / 2 / this.scale) * this.scale
    }
    this.Stage.position(newPos)
    this.Stage.batchDraw()
  }

  /** 添加编辑框 */
  addTextEditBox = (text, textNode, node, data) => {
    const { onUpdateText } = this.props
    var textPosition = textNode.getAbsolutePosition()

    // then lets find position of stage container on the page:
    var stageBox = this.Stage.container().getBoundingClientRect()

    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y
    }

    // create textarea and style it
    var textarea = document.createElement('input')
    document.body.appendChild(textarea)

    textarea.className = styles.rectInputEdit
    textarea.value = text
    textarea.style.position = 'absolute'
    textarea.style.height = textNode.height() * this.scale + 'px'
    textarea.style.top = areaPosition.y + 'px'
    textarea.style.left = areaPosition.x + 'px'
    textarea.style.width = textNode.width() * this.scale + 'px'
    textarea.style.zIndex = MaxZIndex
    textarea.maxLength = 18

    textarea.focus()
    this.isEdit = true
    textarea.onblur = () => {
      this.isEdit = false
      this.Layer.draw()
      document.body.removeChild(textarea)
      if (textarea.value !== data.role_group_name)
        onUpdateText &&
          onUpdateText({
            ...data,
            role_group_name: textarea.value || data.role_group_name
          })
    }

    textarea.addEventListener('keydown', function(e) {
      // hide on enter
      if (e.keyCode === 13) {
        textarea.blur()
      }
    })
  }

  /** 设置active样式 */
  setRectActive = (rect, data) => {
    const { onChange } = this.props
    if (this.prevAvtiveRect) {
      this.prevAvtiveRect.clearCache()
      this.prevAvtiveRect.stroke('transparent')
      this.prevAvtiveRect.strokeWidth(0)
    }
    rect.clearCache()
    rect.stroke(ClickRectColor)
    rect.strokeWidth(2)
    rect.cache()
    this.prevAvtiveRect = rect
    onChange && onChange(data)
  }

  /** 对页面的元素添加事件 */
  AddTextEvent = (text, rect, data) => {
    const _this = this
    text.on('mouseover', function() {
      document.body.style.cursor = 'pointer'
      if (_this.prevAvtiveRect && _this.prevAvtiveRect === rect) return
      rect.clearCache()
      rect.strokeWidth(1)
      rect.stroke(HoverRectColor)
      rect.cache()
      _this.Layer.draw()
    })
    text.on('mouseout', function() {
      document.body.style.cursor = 'default'
      if (_this.prevAvtiveRect && _this.prevAvtiveRect === rect) return
      rect.clearCache()
      rect.stroke('transparent')
      rect.strokeWidth(0)
      rect.cache()
      _this.Layer.draw()
    })
    /** 点击选中事件 */
    text.on('click', () => {
      this.setRectActive(rect, data)
    })
    text.on('dblclick', () => {
      this.addTextEditBox(text.text(), rect, text, data)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.StructureData !== this.props.StructureData) {
      this.MainGroupRender()
    }
  }

  /** 更新画布缓存 */
  clearLayer = () => {
    this.Layer.clearCache()
    this.Layer.removeChildren()
    this.Layer.clear()
  }

  /** 组织架构列表渲染 */
  MainGroupRender = () => {
    this.clearLayer()
    const { StructureData = [], activeItem } = this.props
    /** 格式化一遍，获取每个数据的长度 */
    const data = this.forMathChild(StructureData)
    /** 当前节点高度 */
    let height = 0
    /** 当前节点子集高度 */
    let childH = 0
    /** 子节点的y轴 */
    let yH = 0
    data.forEach((item, index) => {
      /** 是否拥有下一个数据 */
      const hasNextData = !!data[index + 1]
      const roles = item.roles || []
      const { role_group_name, id } = item
      const { text, rect, line, topLine, nodeHeight } = addRectText({
        text: role_group_name,
        x: this.Center.x - item._width / 2,
        y: height + 20,
        textStyle: {
          fill: '#ffffff'
        },
        rectStyle: {
          fill: index === 0 ? FirstRectColor : OtherRectColor
        }
      })
      rect.setAttr('id', id)
      this.Layer.add(rect)
      this.Layer.add(text)
      yH = nodeHeight
      if (roles.length > 1) {
        this.Layer.add(line)
      } else {
        yH = yH - LineHeight
      }

      /** 防止数据刷新之后，无法显示选中状态 */
      if (activeItem && activeItem.id === item.id) {
        this.setRectActive(rect, item)
      }
      this.Layer.draw()
      this.AddTextEvent(text, rect, item)
      /** 不需要topline, 销毁掉，防止内存泄漏 */
      if (topLine.destroy) {
        topLine.destroy()
      }
      if (roles.length) {
        const CWidth = this.getChildWidthTotal(roles)
        const childObj = this.rolesChildRender(
          this.forMathChild(roles),
          !!StructureData[index + 1],
          /** 用rect的x，减去需要偏移的x，减去一个间隙，再减去线条宽度 */
          line.x() -
            (line.x() - (line.x() - CWidth / 2)) +
            siblingBetweenSize / 2,
          rect.y() + yH + line.height() / 2 + 2
        )
        childH = childObj.height
        // console.log(childObj)
        const minX = Math.min.apply(this, childObj.leftX)
        const maxX = Math.max.apply(this, childObj.rightX)
        const w = maxX - minX
        if (hasNextData && roles.length > 1) {
          /** 外围虚线框 */
          const totalRect = new Konva.Rect({
            x: minX - 20,
            y: rect.y() + yH - 20,
            width: w + 20 * 2,
            height: childH + 20 * 2,
            stroke: 'rgba(255, 0, 0, 0.3)',
            strokeWidth: 1,
            dash: [10, 1, 0, 2],
            cornerRadius: 10,
            levels: 0,
            listening: false
          })
          /** 虚线框连接到下一个同级 */
          const lineBottom = new Konva.Line({
            x: line.x(),
            points: [
              0,
              totalRect.y() + totalRect.height(),
              0,
              totalRect.y() + totalRect.height() + yH - 10
            ],
            stroke: 'rgba(255, 0, 0, 0.3)',
            dash: [10, 1, 0, 2],
            strokeWidth: 1
          })
          /** 虚线下的三角 */
          const triangle = new Konva.RegularPolygon({
            x: line.x(),
            y: totalRect.y() + totalRect.height() + yH - 6,
            sides: 3,
            radius: 6,
            fill: 'rgba(255, 0, 0, 0.3)',
            name: 'triangle',
            rotation: 180
          })
          triangle.cache()
          lineBottom.cache()
          totalRect.cache()
          this.Layer.add(lineBottom)
          this.Layer.add(totalRect)
          this.Layer.add(triangle)
          this.Layer.draw()
        }
      }
      height += yH + childH + 100
    })
  }

  render() {
    return (
      <div className={styles.canvas_container}>
        <div id="canvas_container"></div>
      </div>
    )
  }
}
