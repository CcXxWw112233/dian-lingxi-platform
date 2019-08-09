import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import FolderItem from './FolderItem'
import { Input, Menu, Dropdown } from 'antd'

export default class FolderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            folder_list: [1, 2, 3, 4, 5, 6, 7, 8],
            is_show_add_item: false,
            add_folder_value: ''
        }
    }

    addItemClick = ({ key }) => {
        if (key == 2) {
            this.setIsShowAddItem(true)
        }
    }
    setIsShowAddItem = (flag) => {
        this.setState({
            is_show_add_item: flag,
            add_folder_value: '',
        })
    }
    renderAddItemDropMenu = () => {
        return (
            <Menu onClick={this.addItemClick}>
                <Menu.Item key={1} style={{ width: 248}}>
                    上传文件
                </Menu.Item>
                <Menu.Item key={2}>
                    新建文件夹
                </Menu.Item>
            </Menu>
        )
    }
    inputOnPressEnter = (e) => {
        this.setIsShowAddItem(false)
    }
    inputOnBlur = (e) => {
        this.setIsShowAddItem(false)
    }
    inputOnchange = (e) => {
        const { value } = e.target
        this.setState({
            add_folder_value: value
        })
    }
    render() {
        const { folder_list = [], is_show_add_item, add_folder_value } = this.state
        return (
            <div className={styles.folder_list}>
                {
                    folder_list.map(item => {
                        return (
                            <FolderItem />
                        )
                    })
                }
                {
                    is_show_add_item && (
                        <div className={`${styles.folder_item} ${styles.add_item}`} style={{ height: 38 }}>
                            <Input style={{ height: 38 }} 
                                autoFocus 
                                value={add_folder_value}
                                onChange={this.inputOnchange}
                                onPressEnter={this.inputOnPressEnter} 
                                onBlur={this.inputOnBlur} />
                        </div>
                    )
                }
                <Dropdown overlay={this.renderAddItemDropMenu()}>
                    <div className={`${styles.folder_item} ${globalStyles.authTheme} ${styles.add_item}`}>&#xe8fe;</div>
                </Dropdown>
            </div>
        )
    }
}
