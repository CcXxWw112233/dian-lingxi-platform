import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Popconfirm } from 'antd'
import { ganttIsOutlineView } from '../../constants'
const rely_map = [
    {
        "id": "1265111963571195904",
        "name": "开始",
        "next": [
            {
                "id": "1265112077387829248",
                "name": "结尾1",
                "direction": "end_start"
            },
            {
                "id": "1265112137341210624",
                "name": "结尾2",
                "direction": "start_end"
            }
        ]
    },
]
const width_diff = 8 //宽度误差微调
const left_diff = 12 //位置误差微调
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
        let { rely_map = [] } = this.state
        const arr = this.getCardArr(props)
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
    getCardArr = (props) => {
        const { group_view_type } = props
        const { list_group = [], outline_tree_round = [] } = props
        let arr = []
        if (group_view_type == '4') { //大纲
            arr = outline_tree_round.filter(item => item.tree_type == '2') //大纲树中的任务
        } else {
            for (let val of list_group) {
                arr = [].concat(arr, val.list_data)
            }
        }

        return arr
    }

    // 绘制箭头规则
    calArrow = ({ arrow_direction, diff_horizontal, diff_vertical, final_point: { x, y } }) => {
        // arrow_direction箭头方向
        // "M1662,299 L1666,296 L1666,302 Z"
        //diff_horizontal向左还是向右偏移
        let x2 = '', y2 = '', x3 = '', y3 = ''
        if ('top' == arrow_direction) {
            if (diff_horizontal == 'right') {
                x2 = x + 4
                y2 = y - 6
                x3 = x + 8
                y3 = y
            } else if (diff_horizontal == 'left') {
                x2 = x - 8
                y2 = y
                x3 = x - 4
                y3 = y - 6
            } else {
                x2 = x + 4
                y2 = y + 6
                x3 = x - 4
                y3 = y + 6
            }
        } else if ('down' == arrow_direction) {
            if (diff_horizontal == 'right') {
                x2 = x + 4
                y2 = y + 6
                x3 = x + 8
                y3 = y
            } else if (diff_horizontal == 'left') {
                x2 = x - 4
                y2 = y + 6
                x3 = x - 8
                y3 = y
            } else {
                x2 = x - 4
                y2 = y - 6
                x3 = x + 4
                y3 = y - 6
            }

        } else if ('left' == arrow_direction) {
            if (diff_vertical == 'top') {
                x2 = x - 6
                y2 = y - 4
                x3 = x
                y3 = y - 8
            } else if (diff_vertical == 'down') {
                x2 = x - 6
                y2 = y + 4
                x3 = x
                y3 = y + 8
            } else {
                x2 = x + 6
                y2 = y - 4
                x3 = x + 6
                y3 = y + 4
            }
        } else if ('right' == arrow_direction) {
            if (diff_vertical == 'top') {
                x2 = x + 6
                y2 = y - 4
                x3 = x
                y3 = y - 8
            } else if (diff_vertical == 'down') {
                x2 = x + 6
                y2 = y + 4
                x3 = x
                y3 = y + 8
            } else {
                x2 = x - 6
                y2 = y + 4
                x3 = x - 6
                y3 = y - 4
            }
        } else {

        }
        return `M${x},${y} L${x2},${y2} L${x3},${y3} Z`
    }
    // 绘制依赖路线
    pathFunc = {
        'start_start': ({ move_left, move_top, line_top, line_left }) => {
            let Move_Line = ''
            let Arrow = ''
            if (move_top == line_top) {
                if (move_left < line_left) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30},
                    ` //最后一个点 L${line_left + left_diff}, ${line_top + top_diff + top_diff_20},
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_left + left_diff, y: line_top + top_diff + top_diff_30 },
                        diff_horizontal: 'left'
                    })
                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30},
                    ` //最后一个点 L${line_left + left_diff}, ${line_top + top_diff + top_diff_20},
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_left + left_diff, y: line_top + top_diff + top_diff_30 },
                        diff_horizontal: 'right'
                    })
                }
                return { Move_Line, Arrow }
            }
            if (move_left < line_left) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${move_left}, ${move_top + top_diff}
                            L${move_left}, ${line_top + top_diff},
                            L${move_left}, ${line_top + top_diff},
                            L${line_left}, ${line_top + top_diff}`
                Arrow = this.calArrow({
                    arrow_direction: 'right',
                    final_point: { x: line_left, y: line_top + top_diff },
                })
            } else if (move_left == line_left) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff_10},
                    L${line_left + left_diff}, ${line_top + top_diff_10}`
                    Arrow = this.calArrow({
                        arrow_direction: 'down',
                        diff_horizontal: 'left',
                        final_point: { x: line_left + left_diff, y: line_top + top_diff_10 },
                    })
                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30}`
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        diff_horizontal: 'left',
                        final_point: { x: line_left + left_diff, y: line_top + top_diff + top_diff_30 },
                    })
                }

            } else if (move_left > line_left) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${line_left + width_diff}, ${move_top + top_diff}
                            L${line_left + width_diff}, ${line_top + (move_top > line_top ? top_diff_60 : top_diff_20)}`
                Arrow = this.calArrow({
                    arrow_direction: move_top > line_top ? 'top' : 'down',
                    final_point: { x: line_left + width_diff, y: line_top + (move_top > line_top ? top_diff_60 : top_diff_20) },
                })
            }
            return { Move_Line, Arrow }
        },
        'start_end': ({ move_left, move_top, line_top, line_left, line_right }) => {
            let Move_Line = ''
            let Arrow = ''
            if (move_top == line_top) {
                if (move_left < line_left) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff + top_diff_30},
                    L${line_right - width_diff}, ${line_top + top_diff + top_diff_30},
                    `
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_right - width_diff, y: line_top + top_diff + top_diff_30 },
                        diff_horizontal: 'left'
                    })
                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${line_right - width_diff / 2}, ${line_top + top_diff}
                    `
                    Arrow = this.calArrow({
                        arrow_direction: 'left',
                        final_point: { x: line_right - width_diff / 2, y: line_top + top_diff },
                    })
                }
                return { Move_Line, Arrow }
            }
            if (move_left < line_right) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff_10},
                    L${line_right - left_diff}, ${line_top + top_diff_10}`
                    Arrow = this.calArrow({
                        arrow_direction: 'down',
                        final_point: { x: line_right - left_diff, y: line_top + top_diff_10 },
                        diff_horizontal: 'left'
                    })
                } else {
                    Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                    L${move_left}, ${move_top + top_diff}
                    L${move_left}, ${line_top + top_diff_60 + top_diff_10},
                    L${line_right - left_diff}, ${line_top + top_diff_60 + top_diff_10}`
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_right - left_diff, y: line_top + top_diff_60 + top_diff_10 },
                        diff_horizontal: 'left'
                    })
                }

            } else if (move_left == line_right) { //和move_left > line_right一样
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${line_right - left_diff}, ${move_top + top_diff}
                            L${line_right - left_diff}, ${line_top + (move_top > line_top ? top_diff_60 : top_diff_20)},
                           `
                Arrow = this.calArrow({
                    arrow_direction: move_top > line_top ? 'top' : 'down',
                    final_point: { x: line_right - left_diff, y: line_top + (move_top > line_top ? top_diff_60 : top_diff_20) },
                })
            } else if (move_left > line_right) {
                Move_Line = `M ${move_left + left_diff},${move_top + top_diff}
                            L${line_right - left_diff}, ${move_top + top_diff}
                            L${line_right - left_diff}, ${line_top + (move_top > line_top ? top_diff_60 : top_diff_20)},
                            `
                Arrow = this.calArrow({
                    arrow_direction: move_top > line_top ? 'top' : 'down',
                    final_point: { x: line_right - left_diff, y: line_top + (move_top > line_top ? top_diff_60 : top_diff_20) },
                })
            }
            return { Move_Line, Arrow }
        },
        'end_start': ({ move_left, move_top, line_top, line_left, line_right, move_right }) => {
            let Move_Line = ''
            let Arrow = ''
            if (move_top == line_top) {
                if (move_left < line_left) {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${line_left + width_diff / 2}, ${move_top + top_diff}`
                    Arrow = this.calArrow({
                        arrow_direction: 'right',
                        final_point: { x: line_left + width_diff / 2, y: move_top + top_diff },
                    })
                } else {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${move_right}, ${move_top + top_diff}
                    L${move_right}, ${line_top + top_diff + top_diff_30},
                    L${line_left + left_diff}, ${line_top + top_diff + top_diff_30},
                    `
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_left + left_diff, y: line_top + top_diff + top_diff_30 },
                        diff_horizontal: 'right'
                    })
                }

                return { Move_Line, Arrow }
            }
            if (move_right < line_left) {
                Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                            L${line_left + left_diff}, ${move_top + top_diff}
                            L${line_left + left_diff}, ${line_top + (move_top > line_top ? top_diff_60 : top_diff_20)},`
                Arrow = this.calArrow({
                    arrow_direction: move_top > line_top ? 'top' : 'down',
                    final_point: { x: line_left + left_diff, y: line_top + (move_top > line_top ? top_diff_60 : top_diff_20) },
                })
            } else if (move_right == line_left) {
                Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                            L${line_left + left_diff}, ${move_top + top_diff}
                            L${line_left + left_diff}, ${line_top + (move_top > line_top ? top_diff_60 : top_diff_20)},`
                Arrow = this.calArrow({
                    arrow_direction: move_top > line_top ? 'top' : 'down',
                    final_point: { x: line_left + left_diff, y: line_top + (move_top > line_top ? top_diff_60 : top_diff_20) },
                })
            } else if (move_right > line_left) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                                L${move_right}, ${move_top + top_diff}
                                L${move_right}, ${line_top + top_diff_10}
                                L${line_left + width_diff}, ${line_top + top_diff_10}
                                `
                    Arrow = this.calArrow({
                        arrow_direction: 'down',
                        final_point: { x: line_left + width_diff, y: line_top + top_diff_10 },
                        diff_horizontal: 'right'
                    })
                } else {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                                L${move_right}, ${move_top + top_diff}
                                L${move_right}, ${line_top + top_diff + top_diff_30}
                                L${line_left + width_diff}, ${line_top + top_diff + top_diff_30}`
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_left + width_diff, y: line_top + top_diff + top_diff_30 },
                        diff_horizontal: 'right'
                    })
                }
            }
            return { Move_Line, Arrow }
        },
        'end_end': ({ move_left, move_top, line_top, line_left, line_right, move_right }) => {
            let Move_Line = ''
            let Arrow = ''
            if (move_top == line_top) {
                Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${move_right}, ${move_top + top_diff}
                    L${move_right}, ${move_top + top_diff + top_diff_30},
                    L${line_right - left_diff}, ${line_top + top_diff + top_diff_30},
                    `
                Arrow = this.calArrow({
                    arrow_direction: 'top',
                    final_point: { x: line_right - left_diff, y: line_top + top_diff + top_diff_30 },
                    diff_horizontal: move_right > line_right ? 'right' : 'left'
                })
                return { Move_Line, Arrow }
            }
            if (move_right < line_right) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                                L${line_right - left_diff}, ${move_top + top_diff}
                                L${line_right - left_diff}, ${line_top + top_diff_20},`
                    Arrow = this.calArrow({
                        arrow_direction: 'down',
                        final_point: { x: line_right - left_diff, y: line_top + top_diff_20 },
                    })
                } else {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                                L${line_right - left_diff}, ${move_top + top_diff}
                                L${line_right - left_diff}, ${line_top + top_diff_60},`
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_right - left_diff, y: line_top + top_diff_60 },
                    })
                }

            } else if (move_right == line_right) {
                if (move_top < line_top) {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${line_right}, ${move_top + top_diff}
                    L${line_right}, ${line_top + top_diff_10},
                    L${line_right - left_diff}, ${line_top + top_diff_10},`
                    Arrow = this.calArrow({
                        arrow_direction: 'down',
                        final_point: { x: line_right - left_diff, y: line_top + top_diff_10 },
                        diff_horizontal: 'right'
                    })
                } else {
                    Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${line_right}, ${move_top + top_diff}
                    L${line_right}, ${line_top + top_diff + top_diff_30},
                    L${line_right - left_diff}, ${line_top + top_diff + top_diff_30},`
                    Arrow = this.calArrow({
                        arrow_direction: 'top',
                        final_point: { x: line_right - left_diff, y: line_top + top_diff + top_diff_30 },
                        diff_horizontal: 'right'
                    })
                }

            } else if (move_right > line_right) {
                Move_Line = `M ${move_right - left_diff},${move_top + top_diff}
                    L${move_right}, ${move_top + top_diff}
                    L${move_right}, ${line_top + top_diff}
                    L${line_right}, ${line_top + top_diff}`
                Arrow = this.calArrow({
                    arrow_direction: 'left',
                    final_point: { x: line_right, y: line_top + top_diff },
                })
            }
            return { Move_Line, Arrow }
        },
    }
    calPath = (data) => {
        const { move_left, move_right, move_top, line_left, line_right, line_top, direction } = data
        return this.pathFunc[direction](data)
    }

    // 
    pathClick = (e) => {
    }
    // 删除依赖
    deleteRely = ({ move_id, line_id }) => {
        const { rely_map = [] } = this.state
        let _re_rely_map = JSON.parse(JSON.stringify(rely_map))
        const move_index = rely_map.findIndex(item => item.id == move_id) //起始点索引
        const move_item = rely_map.find(item => item.id == move_id) //起始点这一项
        const move_next = move_item.next //起始点所包含的全部终点信息
        const line_index = move_next.findIndex(item => item.id == line_id)
        if (move_next.length > 1) {
            _re_rely_map[move_index].next.splice(line_index, 1)
        } else {
            _re_rely_map.splice(move_index, 1)
        }
        this.setState({
            rely_map: _re_rely_map
        })
    }
    pathMouseEvent = {
        // 拖拽
        onMouseDown: (e) => {
            e.stopPropagation()
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
    }

    setSVGHeight = () => {
        const rows = 7
        const { ceiHeight, group_view_type, outline_tree_round = [] } = this.props

        if (ganttIsOutlineView({ group_view_type })) {
            const outline_tree_round_length = outline_tree_round.length
            if (outline_tree_round_length > rows) {
                return (outline_tree_round_length + 8) * ceiHeight
            } else {
                return (rows + 5) * ceiHeight
            }
        } else {
            return '100%'
        }
    }
    renderPaths = () => {
        const { rely_map = [] } = this.state
        return (
            <>
                {
                    rely_map.map(move_item => {
                        const { left: move_left, right: move_right, top: move_top, next = [], id: move_id } = move_item
                        return (
                            next.map(line_item => {
                                const { left: line_left, right: line_right, top: line_top, direction, id: line_id } = line_item
                                const { Move_Line, Arrow } = this.calPath({
                                    move_left,
                                    move_right,
                                    move_top,
                                    line_left,
                                    line_right,
                                    line_top,
                                    direction
                                })
                                return (
                                    <g data-targetclassname="specific_example" onClick={this.pathClick}>
                                        <path name="arrow"
                                            stroke="#1890FF"
                                            stroke-width="1"
                                            data-targetclassname="specific_example"
                                            fill="#1890FF"
                                            d={Arrow}
                                            onClick={() => this.deleteRely({ move_id, line_id })}
                                            className={`${styles.path} ${styles.path_arrow}`}
                                            {...this.pathMouseEvent}
                                        />
                                        <path
                                            stroke="#1890FF"
                                            fill="none"
                                            data-targetclassname="specific_example"
                                            d={Move_Line}
                                            stroke-width='1'
                                            onClick={() => this.deleteRely({ move_id, line_id })}
                                            className={`${styles.path} ${styles.path_line}`}
                                            {...this.pathMouseEvent}
                                        />
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
        // console.log('rely_map', rely_map)
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <svg id={'gantt_svg_area'}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        width: date_total * ceilWidth,
                        height: this.setSVGHeight(),
                        zIndex: 0,
                    }}>
                    {this.renderPaths()}
                </svg>
            </div>
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
        ceiHeight
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
        ceiHeight
    }
}
