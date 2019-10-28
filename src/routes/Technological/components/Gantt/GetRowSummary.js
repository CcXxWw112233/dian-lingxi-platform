import React, { Component } from 'react'
import indexStyles from './index.less'

export default class GetRowSummary extends Component {
    render() {
        const { itemValue = {} } = this.props
        const {
            left,
            top, width,
            height,
            name, id,
            board_id, is_realize,
            executors = [], label_data = [],
            is_has_start_time, is_has_end_time,
            start_time, due_time, is_privilege
        } = itemValue

        return (
            <div
                className={`${indexStyles.specific_example} ${!is_has_start_time && indexStyles.specific_example_no_start_time} ${!is_has_end_time && indexStyles.specific_example_no_due_time}`}
                style={{
                    left: left, top: top,
                    width: (width || 6) - 6, height: 40,
                    background: 'red'
                }}

            >

            </div>
        )
    }
}
