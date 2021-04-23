import React from 'react'

/** 头部的职能和里程碑图片 */
export default class CanvasTitle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.canvasRef = React.createRef()
    this.canvas = null
    this.ctx = null
  }

  componentDidMount() {
    // this.drawCanvas()
    this.initCanvas()
  }
  componentDidUpdate() {
    // this.drawCanvas()
  }

  /** 构建canvas */
  initCanvas = () => {
    const { current } = this.canvasRef
    if (current) {
      const { clientWidth, clientHeight } = current
      this.canvas = document.querySelector('#canvas_title')
      this.canvas.width = clientWidth
      this.canvas.height = clientHeight
      this.ctx = this.canvas.getContext('2d')
      setTimeout(() => {
        this.drawCanvas()
      }, 10)
    }
  }
  /** 绘制图片 */
  drawCanvas = () => {
    const { textArray = ['职能', '里程碑'] } = this.props
    if (!this.ctx) return
    const { clientWidth, clientHeight } = this.ctx.canvas
    this.ctx.clearRect(0, 0, clientHeight, clientHeight)
    /** 绘制线 */
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'rgb(237,238,244)'
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(clientWidth, clientHeight)
    this.ctx.stroke()
    this.ctx.closePath()

    /** 绘制里程碑文字和背景 */
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.fillStyle = 'rgba(148, 148, 148, 0.06)'
    this.ctx.lineTo(clientWidth, 0)
    this.ctx.lineTo(clientWidth, clientHeight)
    this.ctx.lineTo(0, 0)
    this.ctx.fill()
    this.ctx.closePath()

    /** 里程碑文字 */
    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)'
    this.ctx.font = '14px serif'
    this.ctx.fillText(textArray[1], clientWidth - 65, 0 + 28)
    this.ctx.closePath()

    /** 职能 */
    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)'
    this.ctx.font = '14px serif'
    this.ctx.fillText(textArray[0], 0 + 25, clientHeight - 20)
    this.ctx.closePath()
  }

  render() {
    return (
      <div {...this.props} ref={this.canvasRef}>
        <canvas id="canvas_title"></canvas>
      </div>
    )
  }
}
