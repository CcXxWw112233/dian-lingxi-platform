import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { Modal } from 'antd'

@connect(mapStateToProps)
export default class PathOperateContent extends Component {
    constructor(props) {
        super(props)
        this.colors = [
            '24,144,255',
            '114,46,209',
            '245,34,45',
            '250,140,22',
            '250,219,20',
            '160,217,17'
        ]
    }
    onClose = () => {
        this.props.setOperateVisible && this.props.setOperateVisible(false)
    }
    onDelete = () => {
        const { operator: { move_id, line_id } } = this.props
        const { dispatch } = this.props
        Modal.confirm({
            title: '确认删除该依赖？',
            onOk: () => {
                dispatch({
                    type: 'gantt/deleteCardRely',
                    payload: {
                        move_id,
                        line_id
                    }
                })
            }
        })
    }
    setRelyColor = (rgb) => {
        const { dispatch, operator: { move_id, line_id } } = this.props
        dispatch({
            type: 'gantt/updateCardRely',
            payload: {
                from_id: move_id,
                to_id: line_id,
                color_mark: rgb
            }
        })
    }
    render() {
        return (
            <div className={styles.operate_wrapper} data-svg_operate='yes' data-targetclassname="specific_example">
                <div className={styles.top} data-svg_operate='yes' data-targetclassname="specific_example">
                    <div className={`${globalStyles.authTheme} ${styles.close}`} onClick={this.onClose} data-svg_operate='yes' data-targetclassname="specific_example">&#xe7fe;</div>
                    <div className={`${globalStyles.authTheme} ${styles.delete}`} onClick={this.onDelete} data-svg_operate='yes' data-targetclassname="specific_example">&#xe720; </div>
                </div>
                <div className={styles.color_wrapper} data-svg_operate='yes' data-targetclassname="specific_example">
                    {
                        this.colors.map(value => {
                            return <div className={styles.color_selector} onClick={() => { this.setRelyColor(value) }} style={{ background: `rgb(${value})` }} data-svg_operate='yes' data-targetclassname="specific_example"></div>
                        })
                    }
                </div>
            </div >
        )
    }
}
function mapStateToProps({ gantt: {
    datas: {
        ceilWidth,
        gantt_board_id,
        group_view_type,
        outline_tree_round,
        gantt_view_mode,
        list_group = [],
        date_total,
        ceiHeight,
        rely_map
    } },
}) {
    return {
        ceilWidth,
        gantt_board_id,
        group_view_type,
        outline_tree_round,
        gantt_view_mode,
        list_group,
        date_total,
        ceiHeight,
        rely_map
    }
}