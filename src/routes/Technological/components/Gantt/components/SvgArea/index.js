import React, { Component } from 'react'
import { connect } from 'dva'

const rely_map = [
    {
        "id": "1263055661797871616",
        "name": "了解土地控规条件",
        "next": [
            {
                "id": "1263801172725207040",
                "name": "土地现状图",
                "direction": "end_start"
            },
            // {
            //     "id": "1263349271890104320",
            //     "name": "城市规划图",
            //     "direction": "start_end"
            // }
        ]
    },
]
const width_diff = 8 //宽度误差微调
const left_diff = 8 //位置误差微调
const top_diff = 40 //位置误差微调
const top_diff_60 = 60 //位置误差微调
const top_diff_30 = 30 //位置误差微调
const top_diff_20 = 20 //位置误差微调
const top_diff_10 = 10 //位置误差微调

@connect(mapStateToProps)
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rely_map,
            cards_one_level: [], //所有任务平铺成一维数组
        }
    }

    componentDidMount() {
        // this.getRelyMaps(this.props)
    }
    componentWillReceiveProps(nextProps) {
        this.setRelyMaps(nextProps)
    }

    // 递归设置点的的位置
    recusionSetMap = (data = [], cards_one_level) => {
        if (!data.length || !cards_one_level.length) return
        for (let val of data) {
            const { id, next = [] } = val
            const card_detail = cards_one_level.find(item => item.id == id) || {}
            const { left, width, top } = card_detail
            val.left = left
            val.top = top
            val.right = left + width
            if (next.length) {
                this.recusionSetMap(next, cards_one_level)
            }
        }
    }
    // 设置最终依赖关系地图
    setRelyMaps = (props) => {
        const { list_group = [] } = props
        let { rely_map = [] } = this.state
        const arr = this.getCardArr(list_group)
        this.setState({
            cards_one_level: arr
        }, () => {
            this.recusionSetMap(rely_map, arr)
            this.setState({
                rely_map
            })
        })
    }
    // 将所有任务铺开成一维数组
    getCardArr = (list_group) => {
        let arr = []
        for (let val of list_group) {
            arr = [].concat(arr, val.list_data)
        }
        return arr
    }

    pathFunc = {
        'start_start': ({ move_left, move_top, line_top, line_left }) => {
            let Move_Line = ''
            if (move_top == line_top) {
                if (move_left < line_left) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_20},
                    `
                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_20},
                    `
                }
                return Move_Line
            }
            if (move_left < line_left) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${move_left}, ${move_top + top_diff}
                            L${move_left}, ${line_top + top_diff},
                            L${move_left}, ${line_top + top_diff},
                            L${line_left}, ${line_top + top_diff}`
            } else if (move_left == line_left) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${move_left - left_diff}, ${move_top + top_diff}
                            L${move_left - left_diff}, ${line_top + top_diff},
                            L${line_left + left_diff}, ${line_top + top_diff}`
            } else if (move_left > line_left) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${line_left + width_diff}, ${move_top + top_diff}
                            L${line_left + width_diff}, ${line_top + top_diff}`
            }
            return Move_Line
        },
        'start_end': ({ move_left, move_top, line_top, line_left, line_right }) => {
            let Move_Line = ''
            if (move_top == line_top) {
                if (move_left < line_left) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_right - width_diff}, ${line_top + top_diff + top_diff_30},
                    `
                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${line_right - width_diff}, ${line_top + top_diff}
                    `
                }
                return Move_Line
            }
            if (move_left < line_right) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff_10},
                    L${line_right - left_diff}, ${line_top + top_diff_10}`

                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff_60 + top_diff_10},
                    L${line_right - left_diff}, ${line_top + top_diff_60 + top_diff_10}`
                }

            } else if (move_left == line_right) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${line_right - left_diff}, ${move_top + top_diff}
                            L${line_right - left_diff}, ${line_top + top_diff},
                           `
            } else if (move_left > line_right) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${line_right - left_diff}, ${move_top + top_diff}
                            L${line_right - left_diff}, ${line_top + top_diff},
                            `
            }
            return Move_Line
        },
        'end_start': ({ move_left, move_top, line_top, line_left, line_right, move_right }) => {
            let Move_Line = ''
            if (move_top == line_top) {
                if (move_left < line_left) {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${line_left}, ${move_top + top_diff}`
                } else {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${move_right + left_diff}, ${move_top + top_diff}
                    L${move_right + left_diff}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30},
                    `
                }
                return Move_Line
            }
            if (move_right < line_left) {
                Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                            L${line_left + left_diff}, ${move_top + top_diff}
                            L${line_left + left_diff}, ${line_top + top_diff_20},`
            } else if (move_right == line_left) {
                Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                            L${line_left + left_diff}, ${move_top + top_diff}
                            L${line_left + left_diff}, ${line_top + top_diff_20},`
            } else if (move_right > line_left) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                                L${move_right + left_diff}, ${move_top + top_diff}
                                L${move_right + width_diff}, ${line_top + top_diff_10}
                                L${line_left + width_diff}, ${line_top + top_diff_10}
                                `
                } else {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                                L${move_right + left_diff}, ${move_top + top_diff}
                                L${move_right + width_diff}, ${line_top + top_diff + top_diff_30}
                                L${line_left + width_diff}, ${line_top + top_diff + top_diff_30}`
                }
            }
            return Move_Line
        },
        'end_end': () => {

        },
    }
    calPath = (data) => {
        const { move_left, move_right, move_top, line_left, line_right, line_top, direction } = data
        return this.pathFunc[direction](data)
    }
    renderPaths = () => {
        const { rely_map = [] } = this.state
        return (
            <>
                {
                    rely_map.map(move_item => {
                        const { left: move_left, right: move_right, top: move_top, next = [] } = move_item
                        return (
                            next.map(line_item => {
                                const { left: line_left, right: line_right, top: line_top, direction } = line_item
                                return (
                                    <g>
                                        <path stroke="#1890FF" zIndex="2" fill="none"
                                            d={this.calPath({
                                                move_left,
                                                move_right,
                                                move_top,
                                                line_left,
                                                line_right,
                                                line_top,
                                                direction
                                            })}
                                            //  d="M1568,103 L1564,103 L1564,119 L1640,119 L1640,131 L1636,131"
                                            stroke-width="1" class="line__2Kq9"></path>
                                        <path name="arrow" stroke="#1890FF" stroke-width="1" d="M1662,299 L1666,296 L1666,302 Z" class="arrow__1xeL"></path>
                                    </g>
                                )
                            })

                        )
                    })
                }
            </>
        )
    }
    render() {
        const { date_total, ceilWidth } = this.props
        const { rely_map = [] } = this.state
        console.log('rely_map', rely_map)
        return (
            <>
                <svg id={'gantt_svg_area'} style={{
                    position: 'absolute', width: date_total * ceilWidth, height: '100%', zIndex: 0,
                    // backgroundColor: 'yellow'
                }}>
                    {/* <path class="dependencies-fake__2JNc" d="M1404 82C1570 82,982 82,1148 82"></path> */}
                    {this.renderPaths()}
                </svg>
            </>
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
        date_total
    } },
}) {
    return {
        ceilWidth,
        gantt_board_id,
        group_view_type,
        outline_tree_round,
        gantt_view_mode,
        list_group,
        date_total
    }
}
