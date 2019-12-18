import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { date_area_height } from '../../constants'
import { Dropdown, Menu, message, Tree, Icon } from 'antd'

const MenuItem = Menu.Item
const TreeNode = Tree.TreeNode;

export default class BoardTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected_plane_keys: '', //已选择的项目模板
            template_data: [
                {
                    name: '1',
                    id: '1',
                    type: 'a',
                    child_data: [
                        {
                            name: '1-1',
                            id: '1-1',
                            type: 'b',
                            parent_id: '0',
                            child_data: [
                                {
                                    name: '1-1-1',
                                    id: '1-1-1',
                                    type: 'b',
                                    parent_id: '1-1',
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '2',
                    id: '2',
                    type: 'a',
                    child_data: [
                        {
                            name: '2-1',
                            id: '2-1',
                            type: 'b',
                            parent_id: '0',
                            child_data: [
                                {
                                    name: '2-1-1',
                                    id: '2-1-1',
                                    type: 'b',
                                    parent_id: '2-1',
                                }
                            ]
                        }
                    ]
                },

            ], //模板数据
        }
    }
    getHeight = () => {
        const target = document.getElementById('gantt_card_out_middle')
        if (target) {
            return target.clientHeight - date_area_height
        }
        return '100%'
    }
    selectPlane = (e) => {
        const { key } = e

    }
    plansMenu = () => {
        return (
            <Menu onClick={this.selectPlane}>
                <MenuItem key={`0_0`} style={{ color: '#1890FF' }}>
                    <i className={globalStyles.authTheme}>&#xe8fe;</i>
                    &nbsp;
                     新建方案
                </MenuItem>
                <MenuItem
                    className={globalStyles.global_ellipsis}
                    style={{ width: 216 }}>
                    爱丽丝的接口拉萨角度来看爱上了大家拉克丝的
                </MenuItem>
            </Menu>
        )
    }
    renderTemplateTree = (data) => {
        return (
            data.map(item => {
                if (item.child_data) {
                    return (
                        <TreeNode key={item.id} title={item.name} selectable={false}>
                            {this.renderTemplateTree(item.child_data)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.id} title={item.name} selectable={false} />;
            })
        )
    }
    render() {
        const { template_data } = this.state
        return (
            <div className={styles.container} style={{
                height: this.getHeight(),
                top: date_area_height
            }}>
                <div className={styles.top}>
                    <Dropdown overlay={this.plansMenu()}>
                        <div className={styles.top_left}>
                            <div className={`${globalStyles.global_ellipsis} ${styles.name}`}>城市规划方案城市规划方案</div>
                            <div className={`${globalStyles.authTheme} ${styles.down}`}>&#xe7ee;</div>
                        </div>
                    </Dropdown>
                    <div className={`${globalStyles.authTheme} ${styles.top_right}`}>&#xe781;</div>
                </div>
                <div className={styles.main}>
                    <Tree
                        switcherIcon={
                            <Icon type="caret-down" style={{ fontSize: 20, color: 'rgba(0,0,0,.45)' }} />
                        }
                    >
                        {this.renderTemplateTree(template_data)}
                    </Tree>

                </div>
            </div>
        )
    }
}
