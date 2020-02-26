import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './index.less'
import { task_item_margin_top } from '../../constants';

@connect(mapStateToProps)
export default class GetRowStrip extends Component {
    renderStyles = () => {
        const { itemValue = {}, date_arr_one_level = [], ceilWidth } = this.props
        const { height, top, left } = itemValue
        return {
            height,
            top: top + task_item_margin_top,
            width: date_arr_one_level.length * ceilWidth,
        }
    }
    stripMouseOver = () => {
        const { itemValue = {}, dispatch } = this.props
        const { id } = itemValue
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_id: id
            }
        })

    }
    render() {
        const { itemValue = {}, outline_hover_id } = this.props
        const { id } = itemValue
        return (
            <div
                onMouseOver={this.stripMouseOver}
                className={`${styles.row_srip} ${outline_hover_id == id && styles.row_srip_on_hover}`}
                style={{ ...this.renderStyles() }}>
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: {
    datas: {
        date_arr_one_level = [],
        ceilWidth,
        outline_hover_id
    } },
}) {
    return {
        date_arr_one_level,
        ceilWidth,
        outline_hover_id
    }
}
