import React, { Component } from 'react'
import styles from './index.less';
import { Input, Dropdown, message, Tooltip, Menu } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less';
import ManhourSet from './ManhourSet.js';
import { Popover, Avatar } from 'antd';
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { getOrgIdByBoardId } from '@/utils/businessFunction';
import moment from 'moment';
import AvatarList from '@/components/avatarList'
import NodeOperate from './NodeOperate'
import { validatePositiveInt } from '../../../../../../utils/verify';
import { connect } from 'dva';
import { isSamDay } from '../../../../../../utils/util';
import { task_item_height, task_item_margin_top, ceil_height } from '../../constants';
import { turn } from 'core-js/fn/array';

@connect(mapStateToProps)
export default class TreeNode extends Component {
    constructor(props) {
        //console.log("TreeNode", props);
        super(props);
        this.state = {
            isTitleHover: false,
            isTitleEdit: false,
            nodeValue: {
                is_focus: false,
                is_expand: true,
                hover: false,
                ...props.nodeValue
            }
        }
        this.title_click_timer = null //标题单击和双击事件冲突设置的timer
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            nodeValue: nextProps.nodeValue
        });
    }



    isShowSetTimeSpan = (nodeValue) => {
        if (nodeValue.tree_type == '2' || (nodeValue.tree_type == '1' && nodeValue.time_span)) {
            return true;
        } else {
            return false;

        }

    }



    onChangeExpand = (e) => {
        e.stopPropagation();
        const { nodeValue = {} } = this.state;
        let { id, is_expand } = nodeValue;
        is_expand = !is_expand;
        this.setState({
            nodeValue: { ...nodeValue, is_expand }
        });
        this.props.onExpand(id, is_expand);
    }

    onMouseEnterTitle = () => {
        this.setState({
            isTitleHover: true
        });
    }

    onClickTitle = (placeholder) => {
        if (placeholder == '新建里程碑') {
            this.toggleTitleEdit()
            return
        }
        if (this.title_click_timer) {
            this.toggleTitleEdit()
            clearTimeout(this.title_click_timer)
            this.title_click_timer = null
            return
        }
        this.title_click_timer = setTimeout(() => {
            this.navigateToVisualArea()
            clearTimeout(this.title_click_timer)
            this.title_click_timer = null
        }, 300)
    }
    onDoubleClickTitle = (placeholder) => {
        if (placeholder == '新建里程碑') {
            return
        }
        clearTimeout(this.title_click_timer)
        this.navigateToVisualArea()
    }

    // 设置出现将具有时间的里程碑或任务定位到视觉区域内------start
    // 定位
    navigateToVisualArea = () => {
        const { date_arr_one_level = [], ceilWidth, nodeValue = {}, gantt_view_mode } = this.props
        const { start_time, due_time, tree_type } = nodeValue
        if (!start_time) return
        const gold_time = tree_type == '1' ? due_time : start_time
        const date = new Date(gold_time).getDate()
        let toDayIndex = -1
        if (gantt_view_mode == 'month') {
            toDayIndex = date_arr_one_level.findIndex(item => isSamDay(item.timestamp, gold_time)) //当天所在位置index
        } else if (gantt_view_mode == 'year') {
            toDayIndex = date_arr_one_level.findIndex(item => gold_time >= item.timestamp && gold_time <= item.timestampEnd) //当天所在月位置index
        } else if (gantt_view_mode == 'week') {
            toDayIndex = date_arr_one_level.findIndex(item => gold_time > item.timestamp && gold_time < item.timestampEnd) //当天所在哪个周
        } else {

        }
        const target = document.getElementById('gantt_card_out_middle')

        if (toDayIndex != -1) { //如果今天在当前日期面板内 
            let nomal_position = toDayIndex * ceilWidth - 248 + 16 //248为左边面板宽度,16为左边header的宽度和withCeil * n的 %值
            if (gantt_view_mode == 'year') {
                const date_position = date_arr_one_level.slice(0, toDayIndex).map(item => item.last_date).reduce((total, num) => total + num) //索引月份总天数
                nomal_position = date_position * ceilWidth - 248 + 16//当天所在位置index
            } else if (gantt_view_mode == 'week') {
                nomal_position = (toDayIndex - 1) * 7 * ceilWidth  //当天所在位置index 
            }
            const max_position = target.scrollWidth - target.clientWidth - 2 * ceilWidth//最大值,保持在这个值的范围内，滚动条才能不滚动到触发更新的区域
            const position = max_position > nomal_position ? nomal_position : max_position

            this.setScrollPosition({
                position
            })
        } else {
            this.props.setGoldDateArr && this.props.setGoldDateArr({ timestamp: gold_time })
            setTimeout(() => {
                if (gantt_view_mode == 'week') {
                    this.props.setScrollPosition && this.props.setScrollPosition({ delay: 300, position: (date_arr_one_level.length / 2 - 2) * 7 * ceilWidth })
                } else {
                    this.props.setScrollPosition && this.props.setScrollPosition({ delay: 300, position: ceilWidth * (60 - 4 + date - 1) - 16 })
                }
            }, 300)
        }

    }
    //设置滚动条位置
    setScrollPosition = ({ delay = 300, position = 200 }) => {
        const target = document.getElementById('gantt_card_out_middle')
        const gantt_date_area = document.getElementById('gantt_date_area')
        setTimeout(function () {
            if (gantt_date_area) {
                gantt_date_area.style.left = `-${position}px`
            }
            if (target.scrollTo) {
                target.scrollTo(position, target.scrollTop)
            } else {
                target.scrollLeft = position
            }
        }, delay)
    }

    onMouseLeaveTitle = () => {
        this.setState({
            isTitleHover: false,
            //isTitleEdit: false
        });
    }

    toggleTitleEdit = (e) => {
        // console.log("toggleTitleEdit", e);
        this.setState({
            isTitleEdit: !this.state.isTitleEdit,
        });
        const { nodeValue = {} } = this.state;
        const { id } = nodeValue;
        this.props.onHover(id, false, this.props.parentId);
    }

    onMouseEnter = () => {
        const { nodeValue = {} } = this.state;
        const { id, add_id } = nodeValue;
        const { onHover, parentId } = this.props
        onHover(id || add_id, true, parentId, add_id ? true : false);
    }

    onMouseLeave = () => {
        const { nodeValue = {} } = this.state;
        const { id, add_id } = nodeValue;
        this.props.onHover(id || add_id, false, this.props.parentId, add_id ? true : false);

    }


    onPressEnter = (e) => {

        let { nodeValue = {} } = this.state;
        const value = e.target.value;
        const actions = (type) => {
            const obj = {
                '1': 'milestone',
                '2': 'task',
                '3': 'flow'
            }
            return obj[type]
        }
        if (!!value) {
            let action;
            nodeValue.editing = false;
            nodeValue.name = value
            if (this.props.placeholder) {
                action = 'add_' + actions(this.props.type) //(this.props.type == '1' ? 'milestone' : 'task');
            } else {
                action = 'edit_' + actions(nodeValue.tree_type)//(nodeValue.tree_type == '1' ? 'milestone' : 'task');
            }
            if (this.props.onDataProcess) {
                this.props.onDataProcess({
                    action,
                    param: { name: value, id: nodeValue.id, parentId: this.props.parentId },
                    calback: () => {
                        // setTimeout(() => {
                        //     this.props.deleteOutLineTreeNode('', nodeValue.add_id) //失焦就没了
                        // }, 300)
                    }
                });
            }
            //清空
            if (action.indexOf('add') != -1) {
                this.setState({
                    nodeValue: {}
                });
            }
        } else {
            // message.warn('标题不能为空');
            nodeValue.name = (this.props.nodeValue || {}).name || '';

            if (nodeValue.editing) {
                if (this.props.onDataProcess) {
                    this.props.onDataProcess({
                        action: 'onBlur',
                        param: { ...nodeValue, parentId: this.props.parentId },
                        calback: () => {
                            // setTimeout(() => {
                            //     this.props.deleteOutLineTreeNode('', nodeValue.add_id) //失焦就没了
                            // }, 300)
                        }
                    });
                }

            }

            this.setState({
                nodeValue
            });
        }

        this.setState({
            isTitleHover: false,
            isTitleEdit: false
        });

    }
    onChangeTitle = (e) => {
        const { nodeValue = {} } = this.state;
        this.setState({
            nodeValue: { ...nodeValue, name: e.target.value }
        });
    }

    onManHourChange = (value) => {
        const { outline_tree_round = [] } = this.props;
        const { nodeValue = {} } = this.state;
        if (!validatePositiveInt(value)) {
            return
        }
        const new_value = Number(value)
        if (new_value > 999) {
            message.warn('设置天数最大支持999天');
            return;
        }
        const newNodeValue = { ...nodeValue, time_span: new_value };
        if (newNodeValue.is_has_start_time && newNodeValue.is_has_end_time) {
            //开始时间不变，截至时间后移
            newNodeValue.due_time = moment(newNodeValue.start_time).add(new_value - 1, 'days').hour(23).minute(59).second(59).valueOf();

        } else {
            if (newNodeValue.is_has_start_time) {
                newNodeValue.due_time = moment(newNodeValue.start_time).add(new_value - 1, 'days').hour(23).minute(59).second(59).valueOf();
            }
            if (newNodeValue.is_has_end_time) {
                newNodeValue.start_time = moment(newNodeValue.start_time).add(new_value - 1, 'days').hour(0).minute(0).second(0).valueOf();
            }
        }

        this.setState({
            nodeValue: newNodeValue
        }, () => {
            let action = 'edit_' + (newNodeValue.tree_type == '1' ? 'milestone' : 'task');
            //console.log("onManHourChange", value, action);
            if (this.props.onDataProcess) {
                this.props.onDataProcess({
                    action,
                    param: { start_time: newNodeValue.start_time, due_time: newNodeValue.due_time, time_span: new_value, id: nodeValue.id, parentId: this.props.parentId }
                });
            }
        });



    }



    onExecutorTaskChargeChange = (data) => {
        let { nodeValue = {} } = this.state;
        //{selectedKeys: Array(1), key: "1194507125745913856", type: "add"}
        const { selectedKeys, key, type } = data;

        let action = type + '_executor';

        if (!nodeValue.executors) {
            nodeValue.executors = [];
        }
        if (type == 'add') {
            //nodeValue.executors.push(key);
        }
        if (type == 'remove') {
            //nodeValue.executors.splice(nodeValue.executors.findIndex((item) => item.id == key));
        }
        this.setState({
            nodeValue
        });

        // console.log("kkkknodeValue",nodeValue);
        if (this.props.onDataProcess) {
            this.props.onDataProcess({
                action,
                param: { id: nodeValue.id, user_id: key, tree_type: nodeValue.tree_type, parentId: this.props.parentId }
            });
        }
    }

    inviteOthersToBoardCalback = ({ users }) => {
        const { dispatch, gantt_board_id } = this.props
        const action = 'reloadProjectDetailInfo';
        if (this.props.onDataProcess) {
            this.props.onDataProcess({
                action,
                calback: ({ user_data }) => this.inviteOthersToBoardCalbackFn({ user_data, users })
            });
        }
    }
    inviteOthersToBoardCalbackFn = ({ user_data = [], users }) => { //遍历找到user,将执行人添加到树
        const { nodeValue = {} } = this.state
        const { start_time, due_time, id, executors } = nodeValue
        let add_executors = users.map(item => user_data.find(item2 => item2.user_id == item))
        add_executors = add_executors.filter(item => item.user_id)
        this.props.changeOutLineTreeNodeProto(id, {
            start_time, due_time, executors: [].concat(executors, add_executors)
        })

    }


    renderExecutor = (members = [], { user_id }) => {

        const currExecutor = members.find((item) => item.user_id == user_id);
        if (currExecutor && currExecutor.avatar) {
            return (<span><Avatar size={20} src={currExecutor.avatar} /></span>);
        } else if (currExecutor) {
            return (<span><Avatar size={20} >{currExecutor.name}</Avatar></span>);
        }
        return (<span className={`${styles.editIcon}`}>&#xe7b2;</span>);
    }

    renderTitle = () => {
        const { isTitleHover, isTitleEdit, nodeValue = {} } = this.state;
        const { id, name: title, tree_type, is_expand, time_span, executors = [], is_focus, editing, status } = nodeValue;
        const { onDataProcess, onExpand, onHover, key, leve = 0, icon, placeholder, label, hoverItem = {}, gantt_board_id, projectDetailInfoData = {} } = this.props;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }

        //console.log("isTitleHover || isTitleEdit", isTitleHover, isTitleEdit);


        return (
            <span className={`${styles.outline_tree_node_label} ${isTitleHover ? styles.hoverTitle : ''}`}>
                {/*<span><span>确定</span><span>取消</span></span> */}
                <Tooltip mouseEnterDelay={0.5} mouseLeaveDelay={0} placement="top" title={title != '0' ? title : ''}>
                    <span className={`${styles.title}`}
                        // onMouseEnter={this.onMouseEnterTitle}
                        // onMouseLeave={this.onMouseLeaveTitle}
                        // onDoubleClick={() => this.onDoubleClickTitle(placeholder)}
                        onClick={() => this.onClickTitle(placeholder)}
                    >
                        {
                            (editing || isTitleHover || isTitleEdit) ?
                                <Input defaultValue={title != '0' ? title : ''}
                                    // autoFocus={editing ? true : false}
                                    size={'small'}
                                    autoFocus
                                    style={{ width: '100%' }}
                                    onChange={this.onChangeTitle}
                                    placeholder={placeholder ? placeholder : '请填写任务名称'}
                                    className={`${styles.titleInputFocus}`}
                                    // className={`${isTitleEdit ? styles.titleInputFocus : styles.titleInputHover}`}
                                    // onFocus={this.toggleTitleEdit}
                                    onBlur={this.onPressEnter}
                                    // addonAfter={isTitleEdit ? null : null}
                                    onPressEnter={this.onPressEnter} />
                                :
                                (placeholder ? label : (title ? title : '未填写任务名称'))
                        }

                    </span>
                </Tooltip>
                {/* <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>


                    <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span> */}


                {
                    tree_type != '0' &&
                    <div onWheel={e => e.stopPropagation()}>
                        <Dropdown
                            {...(tree_type == '3' ? { visible: false } : {})}
                            overlayClassName={styles.selectExecutors}
                            trigger={['click']}
                            overlay={
                                <MenuSearchPartner
                                    // isInvitation={true}
                                    inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}

                                    invitationType={tree_type == '1' ? '13' : '4'}
                                    invitationId={nodeValue.id}
                                    invitationOrg={getOrgIdByBoardId(gantt_board_id)}
                                    listData={projectDetailInfoData.data}
                                    keyCode={'user_id'}
                                    searchName={'name'}
                                    currentSelect={executors}

                                    chirldrenTaskChargeChange={this.onExecutorTaskChargeChange}
                                    board_id={gantt_board_id} />
                            }
                        >
                            {
                                tree_type == '3' ? (
                                    <span style={{ color: 'rgba(0,0,0,.45)' }}>
                                        {this.renderFlowStatus(status)}
                                    </span>
                                ) : (
                                        executors && executors.length > 0 ?
                                            (
                                                <div style={{ display: 'inline-block', verticalAlign: 'text-bottom' }}>
                                                    <AvatarList users={executors} size={20} />
                                                </div>
                                            )
                                            // <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>
                                            //     {
                                            //         this.renderExecutor(projectDetailInfoData.data, executors[0])

                                            //     }
                                            // </span>
                                            :
                                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>
                                    )
                            }

                        </Dropdown>
                        {
                            this.isShowSetTimeSpan(nodeValue) &&
                            <Popover
                                {...(tree_type == '1' ? { visible: false } : {})} //里程碑不能直接设置周期
                                placement="bottom" content={<ManhourSet onChange={this.onManHourChange} nodeValue={nodeValue} value={time_span} />} title={<div style={{ textAlign: 'center', height: '36px', lineHeight: '36px', fontWeight: '600' }}>花费时间</div>} trigger="click">
                                {
                                    time_span ?
                                        <span className={`${styles.editTitle}`}>{time_span}天</span>
                                        :
                                        <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span>
                                }
                            </Popover>
                        }

                    </div>
                }

            </span>
        );
    }

    renderFlowStatus = (status) => {
        const obj = {
            '0': '未开始',
            '1': '运行中',
            '2': '已中止',
            '3': '已完成',
        }
        return obj[status]
    }

    // 操作项点击------start
    operateVisibleChange = (bool) => {
        this.setState({
            operateVisible: bool
        })
    }
    // 操作项点击------end

    setDotStyle = { //dot的样式
        '1': styles.milestoneNode,
        '2': styles.taskNode,
        '3': styles.flowNode
    }

    renderOperate = () => {
        const { nodeValue = {}, } = this.state;
        const { changeOutLineTreeNodeProto, deleteOutLineTreeNode, onExpand } = this.props;
        const menu = <NodeOperate nodeValue={nodeValue}
            editName={this.toggleTitleEdit}
            setDropVisble={this.operateVisibleChange}
            onExpand={onExpand}
            changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
            deleteOutLineTreeNode={deleteOutLineTreeNode} />
        return menu
    }

    // 渲染有子节点的
    renderHasChildNode = () => {
        const { isTitleHover, isTitleEdit, nodeValue = {}, operateVisible } = this.state;
        const { id, add_id, name: title, tree_type, is_expand, time_span } = nodeValue;
        const { children = [], drag_outline_node, changeOutLineTreeNodeProto, deleteOutLineTreeNode, onDataProcess, onExpand, onHover, key, leve = 0, icon, placeholder, label, hoverItem = {}, gantt_board_id, projectDetailInfoData = {}, outline_tree_round = [] } = this.props;
        const isLeaf = false;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }
        return (
            <>
                <div className={`${styles.outline_tree_node_content} ${((hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id)) ? styles.hover : ''}`}
                    style={{ paddingLeft: (leve * 23) + 'px', height: task_item_height, lineHeight: `${task_item_height}px`, marginBottom: task_item_margin_top }}
                    onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                    {
                        (hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id || operateVisible) ? (
                            <Dropdown overlay={this.renderOperate()}
                                visible={operateVisible}
                                trigger={['click']} onVisibleChange={this.operateVisibleChange}>
                                <div className={`${styles.node_opeator} ${globalStyles.authTheme}`}>&#xe7fd;</div>
                            </Dropdown>
                        ) : (
                                <span className={`${styles.outline_tree_line_node_dot} ${this.setDotStyle[type]}`}></span>
                            )
                    }
                    {
                        !isLeaf &&
                        <span className={`${styles.outline_tree_node_expand_icon_out}`} onClick={this.onChangeExpand}>
                            <span className={`${styles.outline_tree_node_expand_icon} ${is_expand ? styles.expanded : ''}`} ></span>
                        </span>
                    }
                    {this.renderTitle()}

                </div>
                <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: is_expand ? 'block' : 'none' }}>
                    <div className={styles.outline_tree_node_children}>
                        {
                            React.Children.map(this.props.children, (child, i) => {
                                // console.log("child.props", child.props);
                                //child.props['leve'] = leve + 1;
                                if (child && child.props && child.props.children && child.props.children.length > 0) {
                                    return (
                                        <TreeNode {...child.props}
                                            changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
                                            deleteOutLineTreeNode={deleteOutLineTreeNode}
                                            leve={leve + 1}
                                            drag_outline_node={drag_outline_node}
                                            isLeaf={false}
                                            onDataProcess={onDataProcess}
                                            onExpand={onExpand}
                                            onHover={onHover}
                                            parentId={id}
                                            hoverItem={hoverItem}
                                            gantt_board_id={gantt_board_id}
                                            projectDetailInfoData={projectDetailInfoData}
                                            outline_tree_round={outline_tree_round}>
                                            {child.props.children}
                                        </TreeNode>
                                    );
                                } else {
                                    return (
                                        <TreeNode {...child.props}
                                            changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
                                            deleteOutLineTreeNode={deleteOutLineTreeNode}
                                            drag_outline_node={drag_outline_node}
                                            leve={leve + 1} isLeaf={true}
                                            onDataProcess={onDataProcess}
                                            onExpand={onExpand} onHover={onHover}
                                            parentId={id}
                                            hoverItem={hoverItem}
                                            gantt_board_id={gantt_board_id}
                                            projectDetailInfoData={projectDetailInfoData}
                                            outline_tree_round={outline_tree_round} />
                                    );
                                }
                            })
                        }

                    </div>
                </div>
            </>
        );

    }


    // 渲染无子节点的
    renderNotChildNode = () => {
        const { isTitleHover, isTitleEdit, nodeValue = {}, operateVisible } = this.state;
        const { id, add_id, name: title, tree_type, is_expand, time_span } = nodeValue;
        const { children = [], changeOutLineTreeNodeProto, deleteOutLineTreeNode, onDataProcess, onExpand, onHover, key, leve = 0, icon, placeholder, label, hoverItem = {}, gantt_board_id, projectDetailInfoData = {}, outline_tree_round = [] } = this.props;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }
        const isLeaf = true;
        return (
            <>
                <div className={`${styles.outline_tree_node_content} ${((hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id)) ? styles.hover : ''}`}
                    style={{ paddingLeft: (leve * 23) + 'px', height: task_item_height, lineHeight: `${task_item_height}px`, marginBottom: task_item_margin_top }}
                    onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                    {
                        add_id ?
                            (icon ?
                                icon
                                : (
                                    <span className={`${styles.outline_tree_line_node_dot} ${this.setDotStyle[type]}`}></span>
                                )
                            ) :
                            (
                                (hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id) || operateVisible ? (
                                    <Dropdown overlay={this.renderOperate()}
                                        visible={operateVisible}
                                        trigger={['click']} onVisibleChange={this.operateVisibleChange}>
                                        <div className={`${styles.node_opeator} ${globalStyles.authTheme}`}>&#xe7fd;</div>
                                    </Dropdown>
                                ) : (
                                        <span className={`${styles.outline_tree_line_node_dot} ${this.setDotStyle[type]}`}></span>
                                    )
                            )
                    }
                    {
                        !isLeaf &&
                        <span className={`${styles.outline_tree_node_expand_icon_out}`}>
                            <span className={`${styles.outline_tree_node_expand_icon} ${is_expand ? styles.expanded : ''}`}></span>
                        </span>
                    }

                    {this.renderTitle()}
                </div>
            </>
        );
    }

    // -----------------------拖拽排序
    // 获取onDrop时在节点上获取不到data-set的值，往上遍历得到具名class的父节点
    findParentNodeCapture = (node) => {
        let target_node = node
        let class_name = target_node.getAttribute("class")
        if (class_name.indexOf('outline_drag_node') == -1) {
            return this.findParentNodeCapture(node.parentNode)
        } else {
            return node
        }
    }
    // 由于设置pointer-envent: none, 导致子节点无法拖拽，判断当是拖拽对象的父节点时不去设置pointer-envent: none
    // 当拖拽时才去做判断
    setDragClass = () => {
        const { outline_node_draging } = this.props
        if (!outline_node_draging) return false
        const { nodeValue = {} } = this.state;
        const { id, parent_id, name } = nodeValue;
        const { drag_outline_node = {} } = this.props;
        const { parent_ids = [] } = drag_outline_node
        // console.log('sssssssssssss', name, parent_ids.includes(parent_id), parent_ids.includes(id))
        if (parent_ids.includes(parent_id)) { //在同级之间设置
            return true
        }
        if (parent_ids.includes(id)) { //拖拽对象的父级不设置
            return false
        }
        return true
    }
    // 往后插入
    exchangeNode = ({ from_id, to_id, parent_id }) => {
        const { dispatch, outline_tree = [] } = this.props
        dispatch({
            type: 'gantt/getOutlineNode',
            payload: {
                id: parent_id,
                outline_tree
            }
        }).then(node => {
            let data = []
            if (!node) {
                data = outline_tree
            } else {
                data = node.children || []
            }
            const form_item = data.find(item => item.id == from_id)
            const from_index = data.findIndex(item => item.id == from_id)
            const to_item = data.find(item => item.id == to_id)
            const to_index = data.findIndex(item => item.id == to_id)
            // data[from_index] = to_item
            // data[to_index] = form_item
            console.log('insert_direct', this.insert_direct)
            data.splice(from_index, 1)
            if (this.insert_direct != 'top') { //后插
                data.splice(to_index + (from_index > to_index ? 1 : 0), 0, form_item) //保证都是往后插入（避免后面往前拖和前面往后拖出现行为不一致）
            } else { //前插
                data.splice(to_index - (from_index > to_index ? 0 : 1), 0, form_item) //保证都是往后插入（避免后面往前拖和前面往后拖出现行为不一致）
            }
            dispatch({
                type: 'gantt/updateDatas',
                payload: {
                    outline_tree
                }
            })
            setTimeout(() => {
                dispatch({
                    type: 'gantt/handleOutLineTreeData',
                    payload: {
                        data: outline_tree
                    }
                })
            }, 300)

            setTimeout(() => {
                dispatch({
                    type: 'gantt/saveGanttOutlineSort',
                    payload: {
                        outline_tree
                    }
                })
            }, 300)
            // console.log('sssssssssss_onDrop_2', node)
        })
    }

    onDragStart = (e) => {
        e.stopPropagation()
        const { dispatch } = this.props
        const target = e.target
        const { dataset = {} } = target
        const { outline_node_id, outline_node_name, outline_due_time, outline_start_time, outline_parent_id, outline_parent_ids } = dataset
        dispatch({
            type: 'gantt/updateOutLineTree',
            payload: {
                datas: [{ id: outline_node_id, is_expand: false, start_time: outline_start_time, due_time: outline_due_time }]
            }
        })
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                drag_outline_node: {
                    id: outline_node_id, parent_id: outline_parent_id, parent_ids: outline_parent_ids
                },
                outline_node_draging: true
            }

        })
        // console.log('sssssssssss_onDragStart', outline_node_id, outline_node_name)
    }
    onDragEnd = (e) => {
        const { dispatch } = this.props
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_node_draging: false,
                drag_outline_node: {}
            }
        })
    }
    onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation()
        const { currentTarget } = e
        const { dataset = {} } = currentTarget
        const { outline_node_id, outline_node_name, outline_parent_id } = dataset
        const { drag_outline_node = {} } = this.props
        const { id: from_id, parent_id: from_parent_id } = drag_outline_node
        currentTarget.style.backgroundColor = ''
        currentTarget.style.backgroundImage = ''
        // console.log('sssssssssss_onDrop_0', drag_outline_node)
        if (from_id == outline_node_id || outline_parent_id != from_parent_id || !outline_node_id) { //必须是在同一个父节点下才能拖拽
            return
        }
        // console.log('sssssssssss_onDrop_1', outline_node_name)
        this.exchangeNode({ from_id, to_id: outline_node_id, parent_id: outline_parent_id })
    }
    onDragEnter = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const { currentTarget } = e
        const { dataset = {} } = currentTarget
        const { outline_node_id, outline_node_name, outline_parent_id } = dataset
        const { drag_outline_node = {} } = this.props
        const { parent_ids = [], parent_id } = drag_outline_node
        // if (parent_ids.includes(outline_node_id)) return //当拖拽的对象在该对象父级对象上拖拽时，仅作同级，不做处理
        // console.log('sssssssssssss_onDragEnter', outline_node_name)
        // if (this.setDragClass()) {
        if (outline_parent_id != parent_id) { //拖拽对象和targetd非同级。不做处理
            return
        }
        currentTarget.style.backgroundColor = '#1890FF'
        // }
    }
    onDragLeave = (e) => {
        e.stopPropagation()
        const { currentTarget } = e
        const { dataset = {} } = currentTarget
        const { outline_node_id, outline_node_name } = dataset
        // console.log('sssssssssssss_onDragLeave', outline_node_name)
        currentTarget.style.backgroundColor = ''
        currentTarget.style.backgroundImage = ''
    }
    onDragOver = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const { pageY, currentTarget } = e
        const { dataset = {} } = currentTarget
        const { outline_parent_id } = dataset
        const { drag_outline_node = {} } = this.props
        const { parent_id } = drag_outline_node
        if (outline_parent_id != parent_id) { //拖拽对象和targetd非同级。不做处理
            return
        }

        const rect = currentTarget.getBoundingClientRect()
        const { top, height, y } = rect //获取元素基本信息
        const harf_height = height / 2
        let insert_direct = 'bottom'
        if (pageY - y < harf_height) { //在上
            insert_direct = 'top'
            currentTarget.style.backgroundImage = 'linear-gradient(#1890FF,#fff,#fff,#fff)'
        } else {
            currentTarget.style.backgroundImage = 'linear-gradient(#fff,#fff,#fff,#fff,#1890FF)'
        }
        this.insert_direct = insert_direct
    }
    render() {
        const { nodeValue = {} } = this.state;
        const { id, is_expand, name, start_time, due_time, parent_id, parent_ids = [] } = nodeValue;
        const { children = [], leve = 0, outline_node_draging, drag_outline_node = {} } = this.props;
        const { id: drag_outline_node_id, parent_id: drag_outline_node_parent_id } = drag_outline_node
        const isLeaf = !(children && children.length)
        const className = `${styles.outline_tree_node} 
                        ${styles[`leve_${leve}`]}
                         ${(outline_node_draging && (!!drag_outline_node_parent_id ? !!parent_id : this.setDragClass())) && styles.drag_over} 
                          ${(!!parent_id && (drag_outline_node.parent_id == parent_id)) && styles.current_drag}
                        outline_drag_node ${isLeaf ? (is_expand ? styles.expanded : '') : ''} `;

        return (
            <div
                style={{ boxSizing: 'border-box' }}
                className={className}
                key={id}
                data-outline_node_id={id}
                data-outline_node_name={name}
                data-outline_start_time={start_time}
                data-outline_due_time={due_time}
                data-outline_parent_id={parent_id}
                data-outline_parent_ids={parent_ids}
                draggable={id && id.length > 10}
                onDragStart={this.onDragStart}
                onDrop={this.onDrop}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragEnd={this.onDragEnd}
                onDragOver={this.onDragOver}
            >
                {
                    children && children.length ? (
                        this.renderHasChildNode()
                    ) : (
                            this.renderNotChildNode()
                        )
                }
            </div>
        )

    }
}

function mapStateToProps({
    gantt: { datas: {
        date_arr_one_level = [],
        ceilWidth,
        gantt_view_mode,
        drag_outline_node = {},
        outline_tree,
        outline_node_draging
    } },
}) {
    return {
        date_arr_one_level,
        ceilWidth,
        gantt_view_mode,
        drag_outline_node,
        outline_tree,
        outline_node_draging
    }
}