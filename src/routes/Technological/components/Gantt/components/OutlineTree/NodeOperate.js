import React, { Component } from 'react'
import { Menu, Button, Input, message } from 'antd';
import styles from './nodeOperate.less'
import globalStyles from '@/globalset/css/globalClassName.less';
import { connect } from 'dva';
import { addTaskGroup, changeTaskType } from '../../../../../../services/technological/task';
import { isApiResponseOk } from '../../../../../../utils/handleResponseData';

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
    // ----------分组逻辑--------end+
    // 选择项点击
    menuItemClick = (key) => {
        const { setDropVisble = function () { } } = this.props
        setDropVisble(false)
        this.setGroupSubShow(false)
        this.setCreateGroupVisible(false)
        switch (key) {
            case 'create_card':
                break
            case 'create_child_card':
                break
            case 'delete':
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
    render() {
        const { group_sub_visible, create_group_visible } = this.state
        const { nodeValue = {} } = this.props
        const { tree_type } = nodeValue
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
                <div className={styles.menu_item} onClick={() => this.menuItemClick('create_card')}>
                    新建任务
                </div>
                <div className={styles.menu_item} onClick={() => this.menuItemClick('create_child_card')} >
                    新建子任务
                </div>
                <div className={styles.menu_item} style={{ color: '#F5222D' }} onClick={() => this.menuItemClick('delete')} >
                    删除
                </div>
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    gantt: { datas: { gantt_board_id, about_group_boards = [] } },
    projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
    return { gantt_board_id, projectDetailInfoData, about_group_boards }
}