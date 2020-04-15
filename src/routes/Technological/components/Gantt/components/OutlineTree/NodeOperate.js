import React, { Component } from 'react'
import { Menu, Button, Input } from 'antd';
import styles from './nodeOperate.less'
import globalStyles from '@/globalset/css/globalClassName.less';
import { connect } from 'dva';

@connect(mapStateToProps)
export default class NodeOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group_sub_visible: false,
            create_group_visible: false,
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
                    <Button disabled={!!!group_value} style={{ width: '100%' }} type={'primary'}>确认</Button>
                </div>
            </div>
        )
    }

    // 分组列表
    renderGroupList = () => {
        return (
            <>
                <div className={`${styles.submenu_area_item} ${styles.submenu_area_item_create}`} onClick={() => this.setCreateGroupVisible(true)}>
                    <span className={`${globalStyles.authTheme}`}>&#xe782;</span>
                    <span>新建分组</span>
                </div>
                <div className={`${styles.submenu_area_item}`}>分组12</div>
                <div className={`${styles.submenu_area_item}`}>分组2</div>
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
            case /^group_id_+/:  //选择任务分组

            default:
                break
        }
    }
    render() {
        const { group_sub_visible, create_group_visible } = this.state
        const { nodeValue = {} } = this.props
        const { tree_type } = nodeValue
        return (
            <div className={styles.menu}>
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
    gantt: { datas: { gantt_board_id } },
    projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
    return { gantt_board_id, projectDetailInfoData, }
}