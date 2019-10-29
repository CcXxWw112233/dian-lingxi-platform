import React, { Component } from 'react'
import indexStyles from '../../index.less'
import styles from './index.less'

export default class GetRowSummary extends Component {

    setBgSpecific = () => {
        let time_bg_color = ''
        let percent_class = ''
        const { itemValue: { end_time }, list_data = [] } = this.props
        const now = new Date().getTime()
        const total = list_data.length
        const realize_count = list_data.filter(item => item.is_realize == '1').length

        if (realize_count == total) { //完成
            time_bg_color = '#BFBFBF'
            percent_class = styles.board_fold_complete
        } else {
            if (end_time <= now) { //项目汇总时间在当前之前
                time_bg_color = '#91D5FF'
                percent_class = styles.board_fold_ding
            } else {
                time_bg_color = '#FFCCC7'
                percent_class = styles.board_fold_due
            }
        }

        return {
            percent: `${(realize_count / total) * 100}%`,
            time_bg_color,
            percent_class,
        }
    }

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
                className={`${indexStyles.specific_example}`}
                style={{
                    left: left, top: top,
                    width: (width || 6) - 6, height: 40,
                    background: this.setBgSpecific().time_bg_color,
                    padding: 0,
                }}>
                <div
                    className={this.setBgSpecific().percent_class}
                    style={{ width: this.setBgSpecific().percent, height: 40, borderRadius: 4 }} >
                    {/* {this.setBgSpecific().percent} */}
                </div>
            </div>
        )
    }
}
