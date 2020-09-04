import React, { Component } from 'react'
import styles from './index.less'
import { connect } from 'dva'
import Draggable from 'react-draggable';
import { gantt_panel_left_diff } from '../../constants';

@connect(mapStateToProps)
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rela_top: 0,
            dragging: false,
        }
    }
    setTriggerPosition = (e, diff = 0) => {
        if (this.state.dragging) return //拖拽中就不管了
        const { pageX, pageY } = e
        const { top } = e.currentTarget.getBoundingClientRect()
        const rela_top = pageY - top - diff
        this.setState({
            rela_top
        })

        // console.log('sssssssss_setTriggerPosition', pageX, pageY, e.currentTarget.getBoundingClientRect())
    }

    set_gantt_header_wapper_width = (pageX) => {
        const target = document.getElementById('gantt_header_wapper')
        const gantt_card_out = document.getElementById('gantt_card_out')
        const gantt_card_out_offsetLeft = gantt_card_out.offsetLeft
        const width = pageX - gantt_card_out_offsetLeft - gantt_panel_left_diff
        console.log('ssssssss_width', width)
        target.style.width = `${width}px`
    }

    handleStart = (e) => {
        this.setState({
            dragging: true
        })
        // console.log('ssssssss_handleStart', e)
    }
    handleDrag = (e) => {
        const { pageX } = e
        this.set_gantt_header_wapper_width(pageX)
        // console.log('ssssssss_handleDrag', pageX)
    }
    handleStop = (e) => {
        this.setState({
            dragging: false
        })
        // console.log('ssssssss_handleStop', e)
    }
    render() {
        const { group_list_area_section_height = [] } = this.props
        const { rela_top } = this.state
        const length = group_list_area_section_height.length
        return (
            <div className={styles.main} style={{ height: group_list_area_section_height[length - 1] }}
                onMouseMoveCapture={(e) => this.setTriggerPosition(e, 20)}
            // onMouseE={(e) => this.setTriggerPosition(e, 0)}
            >
                <div className={styles.line}></div>

                <Draggable
                    axis="x"
                    // handle=".handle"
                    // defaultPosition={{ x: 0, y: 0 }}
                    // position={null}
                    // grid={[25, 25]}
                    // scale={1}
                    onStart={this.handleStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleStop}>
                    <div className={styles.handle_shake} style={{ top: rela_top }}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </Draggable>

            </div>
        )
    }
}

function mapStateToProps(
    {
        gantt: { datas: { group_list_area_section_height } }
    }
) {
    return {
        group_list_area_section_height
    }
}