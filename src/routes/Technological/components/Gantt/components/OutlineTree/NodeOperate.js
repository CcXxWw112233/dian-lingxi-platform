import React, { Component } from 'react'
import { Menu, Button, Input, message, Modal } from 'antd';
import styles from './nodeOperate.less'
import globalStyles from '@/globalset/css/globalClassName.less';
import { connect } from 'dva';
import { addTaskGroup, changeTaskType, deleteTask, requestDeleteMiletone } from '../../../../../../services/technological/task';
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';
import OutlineTree from '.';
import { visual_add_item } from '../../constants';

@connect(mapStateToProps)
export default class NodeOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group_sub_visible: false, //分组
            create_group_visible: false,//新建分组
            group_value: '',
        }
    }
    setGroupSubShow = (bool) => { //设置选择分组二级菜单是否显示
        this.setState({
            group_sub_visible: bool
        })
    }
    setCreateGroupVisible = (bool) => { //设置新建分组显示
        this.setState({
            create_group_visible: bool
        })
    }

    // ---------分组逻辑-------start
    // 获取任务分组列表
    getCardGroups = () => {
        const { gantt_board_id, about_group_boards = [] } = this.props
        const item = about_group_boards.find(item => item.board_id == gantt_board_id) || {}
        const { list_data = [] } = item
        return list_data
    }

    // 创建分组的区域
    renderCreateGroup = () => {
        const { group_value } = this.state
        return (
            <div className={styles.create_group}>
                <div className={styles.create_group_top} >
                    新建分组
                    <div className={`${globalStyles.authTheme} ${styles.create_group_top_go}`} onClick={() => this.setCreateGroupVisible(false)}>&#xe7ec;</div>
                </div>
                <div className={styles.create_group_middle}>
                    <Input placeholder={'请输入分组标题'} value={group_value} onChange={this.groupValueChange} />
                </div>
                <div className={styles.create_group_bott}>
                    <Button disabled={!!!group_value} style={{ width: '100%' }} type={'primary'} onClick={() => this.addGroup()}>确认</Button>
                </div>
            </div>
        )
    }

    // 分组列表
    renderGroupList = () => {
        const groups = this.getCardGroups()
        return (
            <>
                <div className={`${styles.submenu_area_item} ${styles.submenu_area_item_create}`} onClick={() => this.setCreateGroupVisible(true)}>
                    <span className={`${globalStyles.authTheme}`}>&#xe782;</span>
                    <span>新建分组</span>
                </div>
                {
                    groups.map(item => {
                        const { list_id, list_name } = item
                        return (
                            <div
                                onClick={() => this.menuItemClick(`group_id_${list_id}`)}
                                className={`${styles.submenu_area_item}`}
                                key={list_id}>
                                {list_name}
                            </div>
                        )
                    })
                }
            </>
        )
    }
    //分组名输入
    groupValueChange = (e) => {
        const { value } = e.target
        this.setState({
            group_value: value
        })
    }
    addGroup = () => {
        const { gantt_board_id } = this.props
        const { group_value } = this.state
        const params = {
            board_id: gantt_board_id,
            name: group_value
        }
        addTaskGroup({ ...params }).then(res => {
            if (isApiResponseOk(res)) {
                const { id, name } = res.data
                const obj = {
                    list_id: id,
                    list_name: name,
                }
                this.addGroupCalback(obj)
                message.success('创建分组成功')
                this.setCreateGroupVisible(false)
            } else {
                message.error(res.message)
            }
        })
    }
    addGroupCalback = (arg) => {
        const { dispatch, about_group_boards = [], gantt_board_id } = this.props
        const arr = [...about_group_boards]
        const index = arr.findIndex(item => item.board_id == gantt_board_id)
        arr[index].list_data.push({ ...arg })
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                about_group_boards: arr
            }
        })
    }
    relationGroup = (list_id) => {
        const { gantt_board_id, nodeValue: { id }, } = this.props
        const params = {
            list_id,
            board_id: gantt_board_id,
            card_id: id
        }
        changeTaskType({ ...params }, { isNotLoading: false })
            .then(res => {
                if (isApiResponseOk) {
                    message.success('关联分组成功')
                } else {
                    message.error(res.message)
                }
            })
    }
    // ----------分组逻辑--------end+
    // 选择项点击
    menuItemClick = (key) => {
        const { setDropVisble = function () { } } = this.props
        setDropVisble(false)
        this.setGroupSubShow(false)
        this.setCreateGroupVisible(false)
        switch (key) {
            case 'create_card':
                this.createCard()
                break
            case 'create_child_card':
                this.createCard(true)
                break
            case 'delete':
                this.delete()
                break
            case 'create_card':
                break
            default:
                if (/^group_id_+/.test(key)) {//选择任务分组
                    const list_id = key.replace('group_id_', '')
                    this.relationGroup(list_id)
                }
                break
        }
    }

    delete = () => {
        const { nodeValue: { id, tree_type } } = this.props
        // this.props.deleteOutLineTreeNode(id)

        Modal.confirm({
            title: '提示',
            content: '确认删除该节点？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                if (tree_type == '1') {
                    this.deleteMilestone(id)
                } else if (tree_type == '2') {
                    this.deleteCard(id)
                }
            }
        });

    }
    deleteCard = (id) => {
        deleteTask(id).then(res => {
            if (isApiResponseOk(res)) {
                this.props.deleteOutLineTreeNode(id)
            } else {
                message.error(res.message)
            }
        })
    }
    deleteMilestone = (id, calback) => {
        requestDeleteMiletone({ id }).then(res => {
            if (isApiResponseOk(res)) {
                this.props.deleteOutLineTreeNode(id)
            } else {
                message.error(res.message)
            }
        })
    }
    createCard = (create_child) => { //创建任务分为里程碑创建任务和任务创建同级任务
        const { nodeValue: { id, parent_id, tree_type, parent_type, children = [] }, outline_tree = [], dispatch } = this.props
        let target_id = id
        let target_name
        // debugger
        if (create_child) { //如果是创建子任务
            console.log('sssssssssasdx', 0)
        } else {
            if (tree_type == '1') {//如果是里程碑节点创建任务，则是操作children, 否则操作的是父级
                console.log('sssssssssasdx', 1)
            } else {
                console.log('sssssssssasdx', 2)
                target_id = parent_id//创建任务都是创建父级节点里的任务
            }
        }
        this.props.onExpand(target_id, true) //展开
        let node = OutlineTree.getTreeNodeValue(outline_tree, target_id);
        if (!node) {
            return
        }
        let new_children = node.children || [];
        // add_id: create_child ? id : parent_id || id 
        new_children.push({ ...visual_add_item, editing: true, add_id: create_child ? id : parent_id || id }) //插入创建的虚拟节点
        node.children = new_children;
        // debugger
        dispatch({
            type: 'gantt/handleOutLineTreeData',
            payload: {
                data: outline_tree
            }
        });
    }
    render() {
        const { group_sub_visible, create_group_visible } = this.state
        const { nodeValue = {} } = this.props
        const { tree_type, parent_type, parent_id } = nodeValue
        return (
            <div className={styles.menu} onWheel={e => e.stopPropagation()}>
                {
                    tree_type == '2' && (
                        <div className={`${styles.menu_item} ${styles.submenu}`}>
                            <div className={`${styles.menu_item_title}`} onClick={() => this.setGroupSubShow(true)}>
                                选择分组
                            <div className={`${globalStyles.authTheme} ${styles.menu_item_title_go}`}>&#xe7eb;</div>
                            </div>
                            {
                                group_sub_visible && (
                                    <div className={`${styles.submenu_area}`}>
                                        {
                                            create_group_visible ? (
                                                this.renderCreateGroup()
                                            ) : (
                                                    this.renderGroupList()
                                                )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                { //一级任务是顶级则没有
                    tree_type == '2' && !parent_id ? ('') : (
                        <div className={styles.menu_item} onClick={() => this.menuItemClick('create_card')}>
                            新建任务
                        </div>
                    )
                }

                {
                    (parent_type == '1' || !parent_type) && tree_type == '2' && ( //一级任务才有创建子任务功能
                        <div className={styles.menu_item} onClick={() => this.menuItemClick('create_child_card')} >
                            新建子任务
                        </div>
                    )
                }
                <div className={styles.menu_item} style={{ color: '#F5222D' }} onClick={() => this.menuItemClick('delete')} >
                    删除
                </div>
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    gantt: { datas: { gantt_board_id, about_group_boards = [], outline_tree = [] } },
    projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
    return { gantt_board_id, projectDetailInfoData, about_group_boards, outline_tree }
}