import React, { Component } from 'react'
import indexStyles from '../../index.less'
import styles from './index.less'
import { connect } from 'dva'
@connect(mapStateToProps)
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

    gotoBoard = (e) => {
        e.stopPropagation()
        const { list_id, dispatch } = this.props
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                gantt_board_id: list_id,
                list_group: []
            }
        })
        dispatch({
            type: 'gantt/getGanttData',
            payload: {

            }
        })
    }

    hanldListGroupMap = () => {
        const { list_data = [], ceilWidth } = this.props
        let left_arr = list_data.map(item => item.left)
        left_arr = Array.from(new Set(left_arr))
        const left_map = left_arr.map(item => {
            let list = []
            for (let val of list_data) {
                if (val.left == item) {
                    list.push(val)
                }
            }
            return {
                left: item,
                list
            }
        })
        return left_map
    }

    // 渲染已过期的
    renderDueList = () => {
        const { list_data = [], ceilWidth } = this.props
        const { itemValue: { top } } = this.props

        const left_map = this.hanldListGroupMap()
        console.log('sssss', left_map)

        return (
            left_map.map(item => {
                const { list = [], left } = item
                return (
                    <div
                        key={left}
                        style={{
                            width: 14,
                            height: 14,
                            borderRadius: 14,
                            background: '#FF7875',
                            position: 'absolute',
                            cursor: 'pointer',
                            left: left + (ceilWidth - 14) / 2,
                            top: top - 18,
                            zIndex: 2
                        }}>{list.length}</div>
                )
            })
        )
    }

    render() {
        const { itemValue = {} } = this.props
        const { left, top, width, } = itemValue

        return (
            <div>
                <div
                    onClick={this.gotoBoard}
                    className={`${indexStyles.specific_example}`}
                    data-targetclassname="specific_example"
                    style={{
                        left: left, top: top,
                        width: (width || 6) - 6, height: 40,
                        background: this.setBgSpecific().time_bg_color,
                        padding: 0,
                    }}>
                    <div
                        data-targetclassname="specific_example"
                        className={this.setBgSpecific().percent_class}
                        style={{ width: this.setBgSpecific().percent, height: 40, borderRadius: 4 }} >
                        {/* {this.setBgSpecific().percent} */}
                    </div>
                </div>
                {
                    this.renderDueList()
                }
            </div>

        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: {
    datas: {
        group_list_area_section_height,
        ceilWidth,
    }
} }) {
    return {
        group_list_area_section_height,
        ceilWidth,
    }
}