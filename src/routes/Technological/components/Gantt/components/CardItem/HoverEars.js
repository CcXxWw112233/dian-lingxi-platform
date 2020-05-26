import React, { Component } from 'react'
import indexStyles from './index.less'

function HoverEars(props) {
    const { label_data } = props
    // 获取大纲视图父任务的截止和开始位置的三角形边框颜色
    const setTriangleTreeColor = (label_data = [], index) => {
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
    return (
        <div className={indexStyles.ears_out}>
            <div
                className={`${indexStyles.ears} ${indexStyles.left_ear}`}
                style={{ backgroundColor: `${setTriangleTreeColor(label_data, 'start') || '#D7D7D7'}` }}>
                <div />
                <div />
            </div>
            <div
                className={`${indexStyles.ears} ${indexStyles.right_ear}`}
                style={{ backgroundColor: `${setTriangleTreeColor(label_data, 'start') || '#D7D7D7'}` }}>
                <div />
                <div />
            </div>
            <div
                className={`${indexStyles.ears_circle} ${indexStyles.left_ear_circle}`}
            />
            <div
                className={`${indexStyles.ears_circle} ${indexStyles.right_ear_circle}`}
            />
            <div />
        </div>
    )
}

export default HoverEars