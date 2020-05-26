import React, { Component } from 'react'
import indexStyles from './index.less'
import { date_area_height } from '../../constants'
const dateAreaHeight = date_area_height //日期区域高度，作为修正
const coperatedLeftDiv = 297 //滚动条左边还有一个div的宽度，作为修正
const coperatedX = 0
class HoverEars extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,

        }
        this.rela_x = 0
        this.rela_y = 0
        this.left_circle_ref = React.createRef()
        this.right_circle_ref = React.createRef()
        this.getXY = this.getXY.bind(this)
    }

    getXY = (e) => {
        const target_0 = document.getElementById('gantt_card_out')
        const target_1 = document.getElementById('gantt_card_out_middle')
        const target = this.left_circle_ref.current
        // 取得鼠标位置
        const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX
        const y = e.pageY - target.offsetTop + target_1.scrollTop - dateAreaHeight
        return {
            x, y
        }
    }
    //鼠标拖拽移动
    onMousedown = (e) => {
        document.onmousemove = this.onMousemove.bind(this);
        document.onmouseup = this.onMouseup.bind(this);
        const { x, y } = this.getXY(e)
        this.rela_x = x
        this.rela_y = y
    }

    onMousemove = (e) => {
        const { x, y } = this.getXY(e)
        this.setState({
            x2: x - this.rela_x,
            y2: y - this.rela_y
        })
    }
    onMouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
        this.handleCreateRely()
    }

    handleCreateRely = () => {
        const { x1, x2, y1, y2, rela_x, rela_y } = this

    }

    setTriangleTreeColor = (label_data = [], index) => {      // 获取颜色
        let label_color = ''
        const length = label_data.length
        if (index == 'start') {
            label_color = label_data[0] ? `rgb(${label_data[0].label_color})` : ''
        } else if (index == 'end') {
            label_color = label_data[length - 1] ? `rgb(${label_data[length - 1].label_color})` : ''
        } else {

        }
        return label_color
    }
    eventObj = {
        onMouseDown: (e) => {
            e.stopPropagation()
            this.onMousedown(e)
        },
        onMouseMove: (e) => {
            e.stopPropagation()
        },
        onMouseUp: (e) => {
            e.stopPropagation()

        }, //查看子任务是查看父任务

        onTouchStart: (e) => {
            e.stopPropagation()

        },
        onTouchMove: (e) => {
            e.stopPropagation()

        },
        onTouchEnd: (e) => {
            e.stopPropagation()

        }, //查看子任务是查看父任务
        onMouseEnter: (e) => {
            e.stopPropagation()
        },
        onMouseLeave: (e) => {
            e.stopPropagation()
        }
    }
    render() {
        const { label_data } = this.props
        const { x1, y1, x2, y2 } = this.state
        return (
            <div className={indexStyles.ears_out}>
                <div
                    className={`${indexStyles.ears} ${indexStyles.left_ear}`}
                    style={{ backgroundColor: `${this.setTriangleTreeColor(label_data, 'start') || '#D7D7D7'}` }}>
                    <div />
                    <div />
                </div>
                <div
                    className={`${indexStyles.ears} ${indexStyles.right_ear}`}
                    style={{ backgroundColor: `${this.setTriangleTreeColor(label_data, 'start') || '#D7D7D7'}` }}>
                    <div />
                    <div />
                </div>
                <div
                    ref={this.left_circle_ref}
                    {...this.eventObj}
                    className={`${indexStyles.ears_circle} ${indexStyles.left_ear_circle}`}
                />
                <div
                    ref={this.right_circle_ref}
                    {...this.eventObj}
                    className={`${indexStyles.ears_circle} ${indexStyles.right_ear_circle}`}
                />
                <div />

                <div
                    style={{ top: y1, left: x1, height: y2 }}
                    className={indexStyles.line}>

                </div>
            </div>
        )
    }
}

export default HoverEars