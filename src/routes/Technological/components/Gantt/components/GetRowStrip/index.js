import React, { Component, PureComponent } from 'react';
import { connect } from 'dva'
import styles from './index.less'
import { task_item_margin_top, date_area_height, ceil_height, task_item_height, ganttIsFold, ganttIsOutlineView } from '../../constants';
import globalStyles from '@/globalset/css/globalClassName.less'
import OutlineTree from '../OutlineTree';
import { updateTask, updateMilestone } from '../../../../../../services/technological/task';
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';
import { message } from 'antd';
import MilestoneDetail from '../milestoneDetail'
import { checkIsHasPermission, checkIsHasPermissionInBoard } from '../../../../../../utils/businessFunction';
import { NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_EDIT, PROJECT_TEAM_CARD_CREATE } from '../../../../../../globalset/js/constant';
const dateAreaHeight = date_area_height //日期区域高度，作为修正
const coperatedLeftDiv = 297 //滚动条左边还有一个div的宽度，作为修正
const getEffectOrReducerByName = name => `gantt/${name}`

@connect(mapStateToProps)
export default class GetRowStrip extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentRect: {},  //任务位置
            is_item_has_time: false, //处于该条上的任务有没有开始或者时间
            set_miletone_detail_modal_visible: false, //里程碑是否可见
            currentRectDashed: { x: 0, width: 0 }, //当前操作的矩形属性
            drag_holiday_count: 0,
            dasheRectShow: false
        }
        this.setIsCardHasTime()

        this.x1 = 0 //用于做拖拽生成一条任务
        this.isDragging = false //判断是否在拖拽虚线框
        this.isMouseDown = false //是否鼠标按下
        this.task_is_dragging = false //任务实例是否在拖拽中
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
        const { tree_type, id, add_id } = itemValue
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_obj: tree_type == '0' ? { add_id } : { id } //创建那一栏不需要效果
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
        // this.addCardSetOutlineTree({ start_time: 0, due_time: 0, editing: false })
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
        const { id, add_id, tree_type } = itemValue
        if (tree_type == '0') {
            return outline_hover_obj.add_id == add_id
        }
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


    // 空条拖拽事件--------------------------------------------------------------------------start
    setTaskIsDragging = (bool) => { //设置任务是否在拖拽中的状态
        this.task_is_dragging = bool
        const target = this.refs.row_strip
        if (!target) return
        if (!target.style) return
        if (bool) {
            target.style.cursor = 'move';
        } else {
            target.style.cursor = 'crosshair';
        }
    }
    setIsDragging = (isDragging) => {
        const { dispatch } = this.props
        this.isDragging = isDragging
    }

    // 在任务实例上点击到特定的位置，阻断，是能够不出现创建任务弹窗
    stopPropagationEle = (e) => {
        if (this.task_is_dragging) {//在做单条任务拖动的时候，不能创建
            return true
        }
        if (
            e.target.dataset && e.target.className && typeof e.target.className == 'string' &&//容错
            (
                e.target.dataset.targetclassname == 'specific_example' ||
                e.target.className.indexOf('authTheme') != -1 ||
                e.target.className.indexOf('ant-avatar') != -1
            )
        ) { //不能滑动到某一个任务实例上
            return true
        }
        return false
    }
    //鼠标拖拽移动
    dashedMousedown = (e) => {
        if (
            this.stopPropagationEle(e) || //不能滑动到某一个任务实例上
            this.isDragging || this.isMouseDown //在拖拽中，还有防止重复点击
        ) {
            return false
        }
        const { currentRectDashed = {} } = this.state
        this.x1 = currentRectDashed.x
        this.setIsDragging(false)
        this.isMouseDown = true
        this.handleCreateTask({ start_end: '1' })
        const target = this.refs.row_strip//event.target || event.srcElement;
        target.onmousemove = this.dashedDragMousemove.bind(this);
        target.onmouseup = this.dashedDragMouseup.bind(this);
    }
    dashedDragMousemove = (e) => {
        if (
            this.stopPropagationEle(e)
        ) { //不能滑动到某一个任务实例上
            return false
        }
        this.setIsDragging(true)

        const { ceilWidth } = this.props
        const target_0 = document.getElementById('gantt_card_out')
        const target_1 = document.getElementById('gantt_card_out_middle')
        const { coperatedX } = this.props
        // 取得鼠标位置
        const x = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX
        //设置宽度
        const offset_left = Math.abs(x - this.x1);
        // 更新拖拽的最新矩形
        let px = this.x1//x < this.x1 ? x : this.x1 //向左向右延申
        let width = (offset_left < ceilWidth) || (x < this.x1) ? ceilWidth : offset_left //小于单位长度或者鼠标相对点击的起始点向左拖动都使用最小单位
        width = Math.ceil(width / ceilWidth) * ceilWidth - 6 //向上取整 4为微调
        const property = {
            x: px,
            width,
        }
        this.setState({
            currentRectDashed: property
        }, () => {
            this.handleCreateTask({ start_end: '2', top: property.y, not_create: true })
            this.setDragDashedRectHolidayNo()
        })
    }
    dashedDragMouseup = (e) => {
        if (
            this.stopPropagationEle(e)
        ) { //不能滑动到某一个任务实例上
            return false
        }
        this.stopDragging()
        this.handleCreateTask({ start_end: '2' })
    }
    stopDragging = () => {
        const target = this.refs.row_strip
        target.onmousemove = null;
        target.onmuseup = null;
        const that = this
        setTimeout(function () {
            that.isMouseDown = false
            that.setIsDragging(false)
        }, 1000)
    }
    //鼠标移动
    dashedMouseMove = (e) => {
        const { ceilWidth } = this.props
        if (this.isMouseDown) { //按下的情况不处理
            return false
        }
        const { dasheRectShow, } = this.state
        const { coperatedX } = this.props
        if (!dasheRectShow) {
            this.setState({
                dasheRectShow: true
            })
        }

        const target_0 = document.getElementById('gantt_card_out')
        const target_1 = document.getElementById('gantt_card_out_middle')
        // 取得鼠标位置
        let px = e.pageX - target_0.offsetLeft + target_1.scrollLeft - coperatedLeftDiv - coperatedX

        const molX = px % ceilWidth
        px = px - molX

        const { currentRectDashed } = this.state
        if (currentRectDashed.x == px) {
            return
        }

        const property = {
            x: px,
            width: 40,
        }

        this.setState({
            currentRectDashed: property,
            drag_holiday_count: 0,
        })
    }
    dashedMouseLeave = (e) => {
        if (!this.isMouseDown) {
            this.setState({
                dasheRectShow: false
            })
        }
    }
    //记录起始时间，做创建任务工作
    handleCreateTask = ({ start_end, top, not_create }) => {
        const { dispatch } = this.props
        const { ceilWidth, date_arr_one_level = [] } = this.props
        const { currentRectDashed = {} } = this.state
        const { x, width, } = currentRectDashed
        let counter = 0
        let date = {}
        for (let val of date_arr_one_level) {
            counter += 1
            if (counter * ceilWidth > x + width) {
                date = val
                break
            }
        }
        const { timestamp, timestampEnd } = date
        const update_name = start_end == '1' ? 'create_start_time' : 'create_end_time'
        dispatch({
            type: getEffectOrReducerByName('updateDatas'),
            payload: {
                [update_name]: start_end == '1' ? timestamp : timestampEnd
            }
        })
        if (not_create) { //不创建和查看
            return
        }
        if (start_end == '2') { //拖拽或点击操作完成，进行生成单条任务逻辑
            this.setSpecilTaskExample() //出现任务创建或查看任务
        }
    }
    //获取当前所在的分组, 根据创建或者查看任务时的高度
    getCurrentGroup = ({ top }) => {
        if (top == undefined || top == null) {
            return Promise.resolve({ current_list_group_id: 0 })
        }
        const { group_view_type } = this.props
        if (ganttIsOutlineView({ group_view_type })) {
            return Promise.resolve({ current_list_group_id: 0 })
        }
        const getSum = (total, num) => {
            return total + num;
        }
        const { dispatch } = this.props
        const { group_list_area = [], list_group = [] } = this.props
        let conter_key = 0
        for (let i = 0; i < group_list_area.length; i++) {
            if (i == 0) {
                if (top < group_list_area[0]) {
                    conter_key = 0
                    break
                }
            } else {
                const arr = group_list_area.slice(0, i + 1)
                const sum = arr.reduce(getSum);
                if (top < sum) {
                    conter_key = i
                    break
                }
            }
        }
        const current_list_group_id = list_group[conter_key]['list_id']
        dispatch({
            type: getEffectOrReducerByName('updateDatas'),
            payload: {
                current_list_group_id
            }
        })

        return Promise.resolve({ current_list_group_id })
    }
    //点击某个实例,或者创建任务
    setSpecilTaskExample = (e) => {
        const { dispatch, gantt_board_id, itemValue: { parent_card_id, parent_milestone_id } } = this.props
        if (e) {
            e.stopPropagation()
        }
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_CREATE, gantt_board_id)) {
            message.warn(NOT_HAS_PERMISION_COMFIRN)
            return
        }
        // 用弹出窗口创建任务
        // let params = {}
        // if (parent_card_id) {
        //     params.parent_id = parent_card_id
        // } else if (parent_milestone_id) {
        //     params.milestone_id = parent_milestone_id
        // }
        // dispatch({
        //     type: 'gantt/updateDatas',
        //     payload: {
        //         panel_outline_create_card_params: params, //创建任务的参数
        //     }
        // })
        // this.props.addTaskModalVisibleChange && this.props.addTaskModalVisibleChange(true)

        // 大纲树左边创建任务
        let { create_start_time, create_end_time } = this.props;
        this.addCardSetOutlineTree({ start_time: create_start_time, due_time: create_end_time, editing: true })
    }

    // 拖拽任务将该任务设置映射到左边创建
    addCardSetOutlineTree = (params = {}) => {
        let { dispatch, outline_tree, itemValue: { add_id } } = this.props;
        const data = {
            ...params,
            // editing: true
        }
        let nodeValue = OutlineTree.getTreeNodeValueByName(outline_tree, 'add_id', add_id);
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

    // 设置拖拽生成任务虚线框内，节假日或者公休日的时间天数
    setDragDashedRectHolidayNo = () => {
        let count = 0

        const { create_start_time, create_end_time, holiday_list = [] } = this.props
        if (!create_start_time || !create_end_time) {
            // return count
            this.setState({
                drag_holiday_count: count
            })
        }
        const create_start_time_ = create_start_time / 1000
        const create_end_time_ = create_end_time / 1000

        const holidy_date_arr = holiday_list.filter(item => {
            if (
                create_start_time_ <= Number(item.timestamp)
                && create_end_time_ >= Number(item.timestamp)
                && (item.is_week || item.festival_status == '1') //周末或者节假日
                && (item.festival_status != '2') //不是补班（周末补班不算）
            ) {
                return item
            }
        })

        this.setState({
            drag_holiday_count: holidy_date_arr.length
        })
    }
    // /空条拖拽事件-----end

    targetEventProps = () => {
        const { itemValue: { id, add_id } } = this.props
        if (!!id) { //真正上的里程碑或者任务 或者创建里程碑的虚拟节点
            return {
                onMouseOver: this.stripMouseOver,
                onMouseLeave: this.stripMouseLeave,
                onMouseMove: this.stripMouseMove,
            }
        } else {
            if (add_id == 'add_milestone') {
                return {
                    onMouseOver: this.stripMouseOver,
                    onMouseLeave: this.stripMouseLeave
                }
            }
            return {
                onMouseDown: (e) => {
                    e.stopPropagation()
                    this.dashedMousedown(e)
                },
                onMouseMove: (e) => {
                    e.stopPropagation()
                    this.dashedMouseMove(e)
                },
                onMouseLeave: (e) => {
                    e.stopPropagation()
                    this.dashedMouseLeave(e)
                    this.stripMouseLeave(e)
                },
                onMouseOver: this.stripMouseOver,
            }
        }
    }

    render() {
        const { itemValue = {}, ceilWidth } = this.props
        const { tree_type } = itemValue

        const { currentSelectedProjectMembersList = [], currentRectDashed = {}, dasheRectShow, drag_holiday_count } = this.state
        console.log('sssseeeee2', dasheRectShow, !this.task_is_dragging, currentRectDashed)

        return (
            <div>
                <div
                    className={`${styles.row_srip} ${this.onHoverState() && styles.row_srip_on_hover}`}
                    ref={'row_strip'}
                    {...this.targetEventProps()}
                    // onMouseMove={this.stripMouseMove}
                    // onMouseOver={this.stripMouseOver}
                    // onMouseLeave={this.stripMouseLeave}
                    style={{ ...this.renderStyles() }}>
                    {
                        dasheRectShow
                        && !this.task_is_dragging
                        && (
                            <div className={styles.dasheRect} style={{
                                left: currentRectDashed.x + 1,
                                width: currentRectDashed.width, height: task_item_height,//currentRectDashed.height,
                                boxSizing: 'border-box',
                                color: 'rgba(0,0,0,0.45)',
                                textAlign: 'right',
                                lineHeight: `${task_item_height}px`,
                                paddingRight: 8,
                            }} >
                                {Math.ceil(currentRectDashed.width / ceilWidth) != 1 && Math.ceil(currentRectDashed.width / ceilWidth) - drag_holiday_count}
                                {Math.ceil(currentRectDashed.width / ceilWidth) != 1 && (drag_holiday_count > 0 ? `+${drag_holiday_count}` : '')}
                            </div>
                        )
                    }
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
            </div >

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
        about_user_boards,
        gold_date_arr = [],
        group_rows = [],
        create_start_time,
        create_end_time,
        holiday_list = [],
        group_view_type,
        group_list_area_section_height,
        show_board_fold,
        outline_tree_round
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
        milestone_detail,
        gold_date_arr,
        group_rows,
        create_start_time,
        create_end_time,
        holiday_list,
        group_view_type,
        group_list_area_section_height,
        show_board_fold,
        outline_tree_round
    }
}
