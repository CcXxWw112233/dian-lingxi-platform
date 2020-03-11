import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './index.less'
import { task_item_margin_top, date_area_height, ceil_height } from '../../constants';
import globalStyles from '@/globalset/css/globalClassName.less'
import OutlineTree from '../OutlineTree';
import { updateTask, updateMilestone } from '../../../../../../services/technological/task';
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';
import { message } from 'antd';
import MilestoneDetail from '../milestoneDetail'
import { checkIsHasPermission, checkIsHasPermissionInBoard } from '../../../../../../utils/businessFunction';
import { NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_EDIT } from '../../../../../../globalset/js/constant';

const coperatedLeftDiv = 297 //滚动条左边还有一个div的宽度，作为修正
@connect(mapStateToProps)
export default class GetRowStrip extends Component {
    constructor (props) {
        super(props)
        this.state = {
            currentRect: {},  //任务位置
            is_item_has_time: false, //处于该条上的任务有没有开始或者时间
            set_miletone_detail_modal_visible: false, //里程碑是否可见
        }
        this.setIsCardHasTime()
    }
    componentDidMount() {
        this.setCurrentSelectedProjectMembersList()
    }
    componentWillReceiveProps() {
        this.setIsCardHasTime()
        this.setCurrentSelectedProjectMembersList()
    }
    // 当前滑动的这一条任务是否存在时间？存在时间代表可以在面板上创建
    setIsCardHasTime = () => {
        const { itemValue = {} } = this.props
        const { start_time, end_time, due_time } = itemValue
        this.setState({
            is_item_has_time: start_time || end_time || due_time
        })
    }

    renderStyles = () => {
        const { itemValue = {}, date_arr_one_level = [], ceilWidth } = this.props
        const { height, top, left } = itemValue
        return {
            height,
            top: top + task_item_margin_top,
            width: date_arr_one_level.length * ceilWidth,
        }
    }
    // 长条鼠标事件---start
    stripMouseOver = (e) => {
        const { itemValue = {}, dispatch } = this.props
        const { tree_type, id } = itemValue
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_obj: tree_type == '0' ? {} : { id } //创建那一栏不需要效果
            }
        })
    }
    stripMouseLeave = (e) => {
        const { dispatch } = this.props
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_obj: {}
            }
        })
    }
    stripMouseMove = (e) => {
        if (this.state.is_item_has_time) { //存在时间的任务不需要再设置时间了
            return
        }
        const { ceiHeight, ceilWidth } = this.props
        const { coperatedX = 0 } = this.props

        const target_0 = document.getElementById('gantt_card_out')
        const target_1 = document.getElementById('gantt_card_out_middle')
        // 取得鼠标位置
        let px = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX
        let py = e.pageY - target_0.offsetTop + target_1.scrollTop - date_area_height

        const molX = px % ceilWidth
        const molY = py % ceiHeight //2为折叠的总行
        px = px - molX
        py = py - molY

        const property = {
            x: px,
            y: py,
        }
        this.setState({
            currentRect: property,
        })
    }
    // 长条鼠标事件---end
    //是否当前滑动在这一条上
    onHoverState = () => {
        const { itemValue = {}, outline_hover_obj } = this.props
        const { id } = itemValue
        return outline_hover_obj.id == id
    }
    // 计算当前鼠标滑动位置的时间
    calHoverDate = () => {
        const { currentRect } = this.state
        const { x, y, width, height } = currentRect
        const { date_arr_one_level, ceilWidth } = this.props
        let counter = 0
        let date = {}
        for (let val of date_arr_one_level) {
            counter += 1
            if (counter * ceilWidth > x) {
                date = val
                break
            }
        }
        return date
    }
    // 渲染任务滑块 --start
    renderCardRect = () => {
        const { itemValue = {}, ceilWidth } = this.props
        const { id, name, time_span } = itemValue
        const { is_item_has_time, currentRect = {} } = this.state
        return (
            <div
                onClick={this.cardSetClick}
                className={styles.will_set_item}
                style={{
                    display: (!is_item_has_time && this.onHoverState()) ? 'flex' : 'none',
                    marginLeft: currentRect.x
                }}>
                <div
                    style={{ width: time_span ? time_span * ceilWidth - 6 : 40 }}
                    className={styles.card_rect}></div>
                <div className={styles.point}></div>
                <div className={styles.name}>{name}</div>
            </div>
        )
    }
    cardSetClick = () => {
        const { itemValue = {}, gantt_board_id } = this.props
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)) {
            message.warn(NOT_HAS_PERMISION_COMFIRN)
            return
        }
        const date = this.calHoverDate()
        const { timestamp } = date
        const { id, time_span = 1 } = itemValue
        const due_time = timestamp + time_span * 24 * 60 * 60 * 1000 - 1000
        updateTask({ card_id: id, due_time, start_time: timestamp, board_id: gantt_board_id }, { isNotLoading: false }).then(res => {
            if (isApiResponseOk(res)) {
                this.changeOutLineTreeNodeProto(id, { start_time: timestamp, due_time })
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            message.error('更新失败')
        })
    }
    // 渲染任务滑块 --end

    // 点击任务将该任务设置时间
    changeOutLineTreeNodeProto = (id, data = {}, type) => {
        if ('milestone' == type) {
            data.executors = data.principals || []
        }
        let { dispatch, outline_tree } = this.props;
        let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id);
        const mapSetProto = (data) => {
            Object.keys(data).map(item => {
                nodeValue[item] = data[item]
            })
        }
        if (nodeValue) {
            mapSetProto(data)

            dispatch({
                type: 'gantt/handleOutLineTreeData',
                payload: {
                    data: outline_tree
                }
            });
        } else {
            console.error("OutlineTree.getTreeNodeValue:未查询到节点");
        }
    }

    //渲染里程碑设置---start
    renderMilestoneSet = () => {
        const { itemValue = {}, group_list_area, list_group_key, ceilWidth } = this.props
        const { id, name, due_time, left, expand_length } = itemValue
        const { is_item_has_time, currentRect = {} } = this.state
        let display = 'none'
        let marginLeft = currentRect.x
        let paddingLeft = 0
        if (due_time) {
            display = 'flex'
            marginLeft = left
            paddingLeft = ceilWidth - 2
        } else {
            if (this.onHoverState()) {
                display = 'flex'
                marginLeft = currentRect.x
                paddingLeft = ceilWidth / 2 - 2
            }
        }

        return (
            <div
                onClick={() => this.miletonesClick(due_time)}
                className={styles.will_set_item_milestone}
                style={{
                    display,
                    marginLeft,
                    paddingLeft
                }}>
                <div
                    style={{
                        height: (expand_length - 0.5) * ceil_height
                    }}
                    className={styles.board_miletiones_flagpole}>
                </div>
                <div className={`${styles.board_miletiones_flag} ${globalStyles.authTheme}`}>&#xe6a0;</div>
                <div className={styles.board_miletiones_names}>{name}</div>
            </div>
        )
    }
    miletonesClick = (due_time) => {
        if (due_time) {
            this.milestoneDetail()
        } else {
            this.milestoneSetClick()
        }
    }
    milestoneSetClick = () => {
        const date = this.calHoverDate()
        const { timestamp } = date
        const { itemValue = {}, gantt_board_id } = this.props
        const { id, time_span = 1 } = itemValue

        const due_time = timestamp + time_span * 24 * 60 * 60 * 1000 - 1000
        updateMilestone({ id, deadline: due_time }, { isNotLoading: false }).then(res => {
            if (isApiResponseOk(res)) {
                this.changeOutLineTreeNodeProto(id, { start_time: timestamp, due_time })
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            message.error('更新失败')
        })
    }
    milestoneDetail = () => {
        this.set_miletone_detail_modal_visible()
        const { itemValue = {} } = this.props
        const { id } = itemValue
        //更新里程碑id,在里程碑的生命周期会监听到id改变，发生请求
        const { dispatch } = this.props
        dispatch({
            type: 'milestoneDetail/updateDatas',
            payload: {
                milestone_id: id
            }
        })
    }
    deleteMiletone = ({ id }) => {
        const { milestoneMap = {}, dispatch } = this.props
        const new_milestoneMap = { ...milestoneMap }
        this.props.deleteOutLineTreeNode(id)

        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                milestoneMap: new_milestoneMap
            }
        })
    }
    // 里程碑删除子任务回调
    deleteRelationContent = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'gantt/getGttMilestoneList',
            payload: {
            }
        })
    }
    // 甘特图信息变化后，实时触发甘特图渲染在甘特图上变化
    handleMiletonsChangeMountInGantt = () => {
        // const { dispatch } = this.props
        // dispatch({
        //     type: 'gantt/getGttMilestoneList',
        //     payload: {

        //     }
        // })

    }
    set_miletone_detail_modal_visible = () => {
        const { miletone_detail_modal_visible } = this.state
        this.setState({
            miletone_detail_modal_visible: !miletone_detail_modal_visible
        })
        if (miletone_detail_modal_visible) { //关闭的时候更新
            let { milestone_detail = {}, itemValue: { id } } = this.props
            milestone_detail.due_time = milestone_detail.deadline
            setTimeout(() => {
                this.changeOutLineTreeNodeProto(id, milestone_detail, 'milestone')
            }, 300)
        }
    }
    // 过滤项目成员
    setCurrentSelectedProjectMembersList = () => {
        const { gantt_board_id, about_user_boards = [] } = this.props
        const users = (about_user_boards.find(item => item.board_id == gantt_board_id) || {}).users || []
        this.setState({
            currentSelectedProjectMembersList: users
        })
    }
    //渲染里程碑设置---end

    render() {
        const { itemValue = {} } = this.props
        const { tree_type } = itemValue
        const { currentSelectedProjectMembersList = [] } = this.state
        console.log('sssssssssssscurrentSelectedProjectMembersList', currentSelectedProjectMembersList)
        return (
            <div>
                <div
                    onMouseMove={this.stripMouseMove}
                    onMouseOver={this.stripMouseOver}
                    onMouseLeave={this.stripMouseLeave}
                    className={`${styles.row_srip} ${this.onHoverState() && styles.row_srip_on_hover}`}
                    style={{ ...this.renderStyles() }}>
                    {
                        tree_type == '1' ? (
                            this.renderMilestoneSet()
                        ) : (
                                this.renderCardRect()
                            )
                    }
                </div >
                <MilestoneDetail
                    handleMiletonesChange={this.handleMiletonsChangeMountInGantt}
                    users={currentSelectedProjectMembersList}
                    miletone_detail_modal_visible={this.state.miletone_detail_modal_visible}
                    set_miletone_detail_modal_visible={this.set_miletone_detail_modal_visible}
                    deleteMiletone={this.deleteMiletone}
                    deleteRelationContent={this.deleteRelationContent}
                />
            </div>

        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: {
    datas: {
        date_arr_one_level = [],
        outline_hover_obj,
        outline_tree = [],
        ceiHeight, ceilWidth,
        list_group, group_list_area,
        gantt_board_id,
        milestoneMap,
        about_user_boards
    } },
    milestoneDetail: {
        milestone_detail = {}
    }
}) {
    return {
        date_arr_one_level,
        outline_hover_obj,
        ceiHeight, ceilWidth,
        outline_tree,
        list_group, group_list_area,
        gantt_board_id,
        milestoneMap,
        about_user_boards,
        milestone_detail
    }
}