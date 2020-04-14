import React, { Component } from 'react'
import { Menu } from 'antd';
import styles from './nodeOperate.less'
import globalStyles from '@/globalset/css/globalClassName.less';

export default class NodeOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group_sub_show: false
        }
    }
    setGroupSubShow = (bool) => {
        this.setState({
            group_sub_show: bool
        })
    }

    menuItemClick = (key) => {

    }

    render() {
        const { group_sub_show } = this.state
        return (
            <div className={styles.menu}>
                <div className={`${styles.menu_item} ${styles.submenu}`}>
                    <div className={`${styles.menu_item_title}`} onClick={() => this.setGroupSubShow(true)}>选择分组</div>
                    {
                        group_sub_show && (
                            <div className={`${styles.submenu_area}`}>
                                <div className={`${styles.submenu_area_item} ${styles.submenu_area_item_create}`}>
                                    <span className={`${globalStyles.authTheme}`}>&#xe782;</span>
                                    <span>新建分组</span>
                                </div>
                                <div className={`${styles.submenu_area_item}`}>分组1</div>
                                <div className={`${styles.submenu_area_item}`}>分组2</div>
                            </div>
                        )
                    }
                </div>
                <div className={styles.menu_item}>
                    新建任务
                </div>
                <div className={styles.menu_item}>
                    新建子任务
                </div>
                <div className={styles.menu_item}>
                    删除
                </div>
            </div>
        )
    }
}
