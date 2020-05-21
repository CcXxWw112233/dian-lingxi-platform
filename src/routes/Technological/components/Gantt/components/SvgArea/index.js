import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class index extends Component {
    constructor(props) {
        super(props)
    }
    getRelyMaps = () => {
        const { list_group = [] } = this.props
    }
    render() {
        const { date_total, ceilWidth } = this.props
        return (
            <>
                <svg id={'gantt_svg_area'} style={{ position: 'absolute', width: date_total * ceilWidth, height: '100%', zIndex: 0 }}>
                    {/* <path class="dependencies-fake__2JNc" d="M1404 82C1570 82,982 82,1148 82"></path> */}
                    <path stroke="#1890FF" zIndex="2" fill="none" d="M1568,103 L1564,103 L1564,119 L1640,119 L1640,131 L1636,131" stroke-width="1" class="line__2Kq9"></path>
                </svg>
            </>
        )
    }
}
function mapStateToProps({ gantt: {
    datas: {
        date_total,
        gold_date_arr = [],
        list_group = [],
        ceilWidth,
        group_rows = [],
        ceiHeight,
        group_list_area = [],
        date_arr_one_level = [],
        create_start_time,
        create_end_time,
        holiday_list = [],
        gantt_board_id,
        group_view_type,
        group_list_area_section_height,
        show_board_fold,
        outline_tree_round,
        gantt_view_mode
    } },
    technological: {
        datas: {
            userBoardPermissions
        }
    }
}) {
    return {
        date_total,
        gold_date_arr,
        list_group,
        ceilWidth,
        group_rows,
        ceiHeight,
        group_list_area,
        date_arr_one_level,
        create_start_time,
        create_end_time,
        holiday_list,
        gantt_board_id,
        group_view_type,
        group_list_area_section_height,
        show_board_fold,
        userBoardPermissions,
        outline_tree_round,
        gantt_view_mode
    }
}
