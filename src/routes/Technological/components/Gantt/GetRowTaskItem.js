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
            local_width: 0,
            local_top: 0,
            local_left: 0,
            drag_type: 'position', // position/left/right 拖动位置/延展左边/延展右边
        }

        this.x = 0
        this.y = 0
        this.l = 0
        this.t = 0
        this.drag_type_map = {
            position: 'pointer',
            left: 'w-resize',
            right: 'e-resize'
        }
    }

    componentDidMount() {
        this.initSetPosition(this.props)
    }

    componentWillReceiveProps(nextProps) {

    }

    // 设置位置
    initSetPosition = (props) => {
        const { itemValue = {} } = props
        const { left, top, width } = itemValue

        this.setState({
            local_top: top,
            local_left: left,
            local_width: width,
            local_width_flag: width
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

    onMouseDown = (e) => {
        e.stopPropagation()
        const target = this.out_ref.current
        this.is_down = true;
        const { drag_type } = this.state
        if ('position' == drag_type) { //在中间
            target.style.cursor = 'move';
        }
        this.x = e.clientX;
        this.y = e.clientY
        //获取左部和顶部的偏移量
        this.l = target.offsetLeft;
        this.t = target.offsetTop;

        window.onmousemove = this.onMouseMove.bind(this);
        window.onmouseup = this.onMouseUp.bind(this);
        // target.onmouseleave = this.onMouseUp.bind(this);
    }

    onMouseMove = (e) => {
        e.stopPropagation()
        this.handleMouseMove(e)
        if (this.is_down == false) {
            return;
        }
        const { drag_type } = this.state
        if ('position' == drag_type) {
            this.changePosition(e)
        } else if ('left' == drag_type) {
            this.extentionLeft(e)
        } else if ('right' == drag_type) {
            this.extentionRight(e)
        }
    }

    // 延展左边
    extentionLeft = (e) => {
        const nx = e.clientX;
        //计算移动后的左偏移量和顶部的偏移量
        const nl = nx - (this.x - this.l);
        const nw = this.x - nx //宽度
        console.log(this.x, this.l, nl, nx)
        this.setState({
            local_left: nl,
            local_width: nw < 40 ? 40 : nw
        })
        console.log('sssss', '向左延展')
    }

    // 延展右边
    extentionRight = (e) => {
        const nx = e.clientX;
        const { local_width_flag } = this.state

        //计算移动后的左偏移量和顶部的偏移量
        const nw = nx - this.x + local_width_flag //宽度
        this.setState({
            local_width: nw,
        })
    }

    // 整条拖动
    changePosition = (e) => {
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
        this.setState({
            local_top: nt,
            local_left: nl,
        })
    }

    // 针对于在某一条任务上滑动时，判别鼠标再不同位置的处理，(ui箭头, 事件处理等)
    handleMouseMove = (event) => {
        const { ganttPanelDashedDrag } = this.props
        if (this.is_down || ganttPanelDashedDrag) { //准备拖动时不再处理, 拖拽生成一条任务时也不再处理
            return
        }
        const { currentTarget, clientX, clientY } = event
        const { clientWidth } = currentTarget
        const oDiv = currentTarget
        const target_1 = document.getElementById('gantt_card_out_middle')
        const offsetLeft = this.getX(oDiv);
        const rela_left = clientX - offsetLeft - 2 + target_1.scrollLeft //鼠标在该任务内的相对位置
        if (rela_left <= 6) { //滑动到左边
            this.setTargetDragTypeCursor('left')
        } else if (clientWidth - rela_left <= 6) { //滑动到右边
            this.setTargetDragTypeCursor('right')
        } else { //中间
            this.setTargetDragTypeCursor('position')
        }
    }
    // 设置鼠标形状和拖拽类型
    setTargetDragTypeCursor = (cursorTypeKey) => {
        this.setState({
            drag_type: cursorTypeKey
        })
        const cursorType = this.drag_type_map[cursorTypeKey]
        const target = this.out_ref.current
        if (target) {
            target.style.cursor = cursorType;
        }
    }
    getX = (obj) => {
        var parObj = obj;
        var left = obj.offsetLeft;
        while (parObj = parObj.offsetParent) {
            left += parObj.offsetLeft;
        }
        return left;
    }

    getY = (obj) => {
        var parObj = obj;
        var top = obj.offsetTop;
        while (parObj = parObj.offsetParent) {
            top += parObj.offsetTop;
        }
        return top;
    }

    onMouseUp = (e) => {
        e.stopPropagation()
        // console.log("sssssssss", 'upl')
        this.x = 0
        this.y = 0
        this.l = 0
        this.t = 0
        this.is_down = false
        this.setTargetDragTypeCursor('pointer')
        this.setState({
            local_width_flag: this.state.local_width
        })
        window.onmousemove = null;
        window.onmuseup = null;
    }
    render() {
        const { itemValue = {} } = this.props
        const { left, top, width, height, name, id, board_id, is_realize, executors = [], label_data = [], is_has_start_time, is_has_end_time } = itemValue
        const { local_left, local_top, local_width } = this.state
        return (
            <div
                className={`${indexStyles.specific_example} ${!is_has_start_time && indexStyles.specific_example_no_start_time} ${!is_has_end_time && indexStyles.specific_example_no_due_time}`}
                data-targetclassname="specific_example"
                // draggable
                ref={this.out_ref}
                style={{
                    zIndex: this.is_down ? 1 : 0,
                    left: local_left, top: local_top,
                    width: (local_width || 6) - 6, height: (height || task_item_height),
                    marginTop: task_item_margin_top,
                    opacity: 0.5,
                    background: this.setLableColor(label_data), // 'linear-gradient(to right,rgba(250,84,28, 1) 25%,rgba(90,90,90, 1) 25%,rgba(160,217,17, 1) 25%,rgba(250,140,22, 1) 25%)',//'linear-gradient(to right, #f00 20%, #00f 20%, #00f 40%, #0f0 40%, #0f0 100%)',
                }}
                onMouseDown={(e) => this.onMouseDown(e)}
                onMouseMove={(e) => this.onMouseMove(e)}
            // onClick={this.setSpecilTaskExample.bind(this, { id, top, board_id })}
            >
                <div
                    data-targetclassname="specific_example"
                    className={`${indexStyles.specific_example_content} ${!is_has_start_time && indexStyles.specific_example_no_start_time} ${!is_has_end_time && indexStyles.specific_example_no_due_time}`}
                    // onMouseDown={(e) => e.stopPropagation()} 
                    onMouseMove={(e) => e.preventDefault()}

                >
                    <div data-targetclassname="specific_example"
                        className={`${indexStyles.card_item_status}`}
                        //  onMouseDown={(e) => e.stopPropagation()} 
                        onMouseMove={(e) => e.preventDefault()}
                    >
                        <CheckItem is_realize={is_realize} />
                    </div>
                    <div data-targetclassname="specific_example"
                        className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}
                        // onMouseDown={(e) => e.stopPropagation()}
                        onMouseMove={(e) => e.preventDefault()}
                    >{name}</div>
                    <div data-targetclassname="specific_example"
                        // onMouseDown={(e) => e.stopPropagation()} 
                        onMouseMove={(e) => e.preventDefault()}
                    >
                        <AvatarList users={executors} size={'small'} />
                    </div>
                </div>
            </div>
        )
    }
}
