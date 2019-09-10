import React, { Component } from 'react'
import indexStyles from './index.less'
import AvatarList from '@/components/avatarList'
import globalStyles from '@/globalset/css/globalClassName.less'
import CheckItem from '@/components/CheckItem'
import { task_item_height, task_item_margin_top, date_area_height } from './constants'
// 参考自http://www.jq22.com/webqd1348

const dateAreaHeight = date_area_height //日期区域高度，作为修正
const coperatedLeftDiv = 20 //滚动条左边还有一个div的宽度，作为修正
const coperatedX = 0
export default class GetRowTaskItem extends Component {

    constructor(props) {
        super(props)
        this.out_ref = React.createRef()
        this.is_down = false
        this.state = {
            local_top: 0,
            local_left: 0,
        }

        this.x = 0
        this.y = 0
        this.l = 0
        this.t = 0
    }

    componentDidMount() {
        this.initSetPosition(this.props)
    }

    componentWillReceiveProps(nextProps) {

    }

    // 设置位置
    initSetPosition = (props) => {
        const { itemValue = {} } = props
        const { left, top, } = itemValue

        this.setState({
            local_top: top,
            local_left: left,
        })

    }

    setLableColor = (label_data) => {
        let bgColor = ''
        let b = ''
        if (label_data && label_data.length) {
            const color_arr = label_data.map(item => {
                return `rgb(${item.label_color})`
            })
            const color_arr_length = color_arr.length
            const color_percent_arr = color_arr.map((item, index) => {
                return (index + 1) / color_arr_length * 100
            })
            bgColor = color_arr.reduce((total, color_item, current_index) => {
                return `${total},  ${color_item} ${color_percent_arr[current_index - 1] || 0}%, ${color_item} ${color_percent_arr[current_index]}%`
            }, '')

            b = `linear-gradient(to right${bgColor})`
        } else {
            b = '#ffffff'
        }
        return b
    }

    setSpecilTaskExample = (data) => {
        const { setSpecilTaskExample } = this.props
        setSpecilTaskExample(data)
    }

    onMouseDownOut = (e) => {
        e.stopPropagation()
        const target = this.out_ref.current
        this.is_down = true;

        this.x = e.clientX;
        this.y = e.clientY
        //获取左部和顶部的偏移量
        this.l = target.offsetLeft;
        this.t = target.offsetTop;

        target.style.cursor = 'move';
        target.onmousemove = this.onMouseMoveOut.bind(this);
        target.onmouseup = this.onMouseUpOut.bind(this);
        target.onmouseleave = this.onMouseUpOut.bind(this);
    }

    onMouseMoveOut = (e) => {
        e.stopPropagation()
        if (this.is_down == false) {
            return;
        }

        const target_0 = document.getElementById('gantt_card_out')
        const target_1 = document.getElementById('gantt_card_out_middle')
        const target = this.out_ref.current//event.target || event.srcElement;
        // // 取得鼠标位置
        // const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX
        // const y = e.pageY - target.offsetTop + target_1.scrollTop - dateAreaHeight

        //获取x和y
        const nx = e.clientX;
        const ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        const nl = nx - (this.x - this.l);
        const nt = ny - (this.y - this.t);
        console.log('sssss', { l: this.l, t: this.t, x: this.x, y: this.y, nl, nt, })
        this.setState({
            local_top: nt,
            local_left: nl,
        })
    }

    onMouseUpOut = (e) => {
        e.stopPropagation()
        console.log("sssssssss", 'upl')
        this.x = 0
        this.y = 0
        this.l = 0
        this.t = 0
        this.is_down = false
        this.out_ref.current.style.cursor = 'pointer';
    }
    render() {
        const { itemValue = {} } = this.props
        const { left, top, width, height, name, id, board_id, is_realize, executors = [], label_data = [], is_has_start_time, is_has_end_time } = itemValue
        const { local_left, local_top } = this.state
        return (
            <div
                className={`${indexStyles.specific_example} ${!is_has_start_time && indexStyles.specific_example_no_start_time} ${!is_has_end_time && indexStyles.specific_example_no_due_time}`}
                data-targetclassname="specific_example"
                // draggable
                ref={this.out_ref}
                style={{
                    zIndex: this.is_down?1:0,
                    left: local_left, top: local_top,
                    width: (width || 6) - 6, height: (height || task_item_height),
                    marginTop: task_item_margin_top,
                    opacity: 0.5,
                    background: this.setLableColor(label_data), // 'linear-gradient(to right,rgba(250,84,28, 1) 25%,rgba(90,90,90, 1) 25%,rgba(160,217,17, 1) 25%,rgba(250,140,22, 1) 25%)',//'linear-gradient(to right, #f00 20%, #00f 20%, #00f 40%, #0f0 40%, #0f0 100%)',
                }}
                onMouseDown={(e) => this.onMouseDownOut(e)}
                onMouseMove={(e) => this.onMouseMoveOut(e)}
               // onClick={this.setSpecilTaskExample.bind(this, { id, top, board_id })}
            >
                <div
                    data-targetclassname="specific_example"
                    className={`${indexStyles.specific_example_content} ${!is_has_start_time && indexStyles.specific_example_no_start_time} ${!is_has_end_time && indexStyles.specific_example_no_due_time}`}
                    // onMouseDown={(e) => e.stopPropagation()} 
                    >
                    <div data-targetclassname="specific_example"
                        className={`${indexStyles.card_item_status}`}
                    //  onMouseDown={(e) => e.stopPropagation()} 
                     onMouseMove={(e) => e.stopPropagation()}
                    >
                        <CheckItem is_realize={is_realize} />
                    </div>
                    <div data-targetclassname="specific_example"
                        className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}
                    // onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    >{name}</div>
                    <div data-targetclassname="specific_example"
                    // onMouseDown={(e) => e.stopPropagation()} 
                    onMouseMove={(e) => e.stopPropagation()}
                    >
                        <AvatarList users={executors} size={'small'} />
                    </div>
                </div>
            </div>
        )
    }
}
