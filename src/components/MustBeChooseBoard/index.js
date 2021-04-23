import React from 'react'
import styles from './index.less'
import ReactDOM from 'react-dom'
import { Button } from 'antd'

/** 必须选择一个项目的弹窗提示 */
export default class MustBeChooseBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeOffset: {
        offsetLeft: 0,
        offsetTop: 0,
        clientHeight: 0,
        clientWidth: 0
      }
    }
  }

  componentDidMount() {
    this.initCanvas()
  }

  /** 初始化canvas */
  initCanvas = () => {
    const canvas = document.querySelector('#_canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
    this.updatePosition(canvas, ctx)
  }
  /** 更新canvas的提示位置 */
  updatePosition = (canvas, ctx) => {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.closePath()

    this.addRect(ctx)
  }

  /** 添加一个框 */
  addRect = ctx => {
    const { element } = this.props
    const getElement = element => {
      let dom = null
      if (element instanceof HTMLElement) {
        dom = element
      } else if (typeof element === 'string') {
        dom = document.querySelector(element)
      }
      if (dom) {
        return {
          offsetTop: dom.offsetTop,
          offsetLeft: dom.offsetLeft,
          clientWidth: dom.clientWidth,
          clientHeight: dom.clientHeight
        }
      }
      return {
        offsetTop: 0,
        offsetLeft: 0,
        clientWidth: 0,
        clientHeight: 0
      }
    }

    const offset = getElement(element)
    this.setState({
      activeOffset: offset
    })
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillRect(
      offset.offsetLeft,
      offset.offsetTop,
      offset.clientWidth,
      offset.clientHeight
    )
    // ctx.clearColor(offset.offsetLeft, offset.offsetTop, offset.clientWidth, offset.clientHeight);
    // ctx.fill();
    ctx.globalCompositeOperation = 'source-over'
    ctx.closePath()

    ctx.beginPath()
    ctx.strokeStyle = '#6A9AFF'
    ctx.strokeRect(
      offset.offsetLeft - 1,
      offset.offsetTop - 1,
      offset.clientWidth + 2,
      offset.clientHeight + 2
    )
    ctx.strokeWidth = 2
    ctx.closePath()
  }

  render() {
    const { tips, onClose } = this.props
    const { activeOffset } = this.state
    return ReactDOM.createPortal(
      <div className={styles.container}>
        <canvas id="_canvas" className={styles.canvas}></canvas>
        <div
          className={styles.tipContent}
          style={{
            left: Math.floor(
              (activeOffset.offsetLeft + activeOffset.clientWidth) / 2
            ),
            top: activeOffset.offsetTop + activeOffset.clientHeight + 30
          }}
        >
          <div className={styles.trianglebottomleft}></div>
          <div className={styles.tips}>{tips}</div>
          <div className={styles.btns}>
            <Button
              type="primary"
              shape="round"
              style={{ borderRadius: 50 }}
              onClick={() => onClose && onClose()}
            >
              知道了
            </Button>
          </div>
        </div>
      </div>,
      document.body
    )
  }
}
