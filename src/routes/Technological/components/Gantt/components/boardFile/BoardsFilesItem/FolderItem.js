import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { getSubfixName } from '../../../../../../../utils/businessFunction';
import { Input, Menu, Dropdown } from 'antd'

export default class FolderItem extends Component {
    judgeFileType(fileName) {
        let themeCode = '&#xe6c4;'//文件夹
        const type = getSubfixName(fileName)
        switch (type) {
            case '.xls':
                themeCode = '&#xe6d5;'
                break
            case '.png':
                themeCode = '&#xe6d4;'
                break
            case '.xlsx':
                themeCode = '&#xe6d3;'
                break
            case '.ppt':
                themeCode = '&#xe6d2;'
                break
            case '.gif':
                themeCode = '&#xe6d1;'
                break
            case '.jpeg':
                themeCode = '&#xe6d0;'
                break
            case '.pdf':
                themeCode = '&#xe6cf;'
                break
            case '.docx':
                themeCode = '&#xe6ce;'
                break
            case '.txt':
                themeCode = '&#xe6cd;'
                break
            case '.doc':
                themeCode = '&#xe6cc;'
                break
            case '.jpg':
                themeCode = '&#xe6cb;'
                break
            default:
                themeCode = '&#xe6c4;'
                break
        }
        return themeCode
    }
    menuItemClick = () => {

    }
    renderOperateItemDropMenu = () => {
        return (
            <Menu onClick={this.menuItemClick}>
                <Menu.Item key={1} style={{ width: 248}}>
                   <span  style={{fontSize: 14, color: `rgba(0,0,0,0.65)`, width: 248}}><i className={`${globalStyles.authTheme}`} style={{fontSize: 16}}>&#xe666;</i> 重命名</span>
                </Menu.Item>
                <Menu.Item key={2}>
                   <span style={{fontSize: 14, color: `rgba(0,0,0,0.65)`,  width: 248}}><i className={`${globalStyles.authTheme}`} style={{fontSize: 16}}>&#xe68d;</i> 移入回收站</span>
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        return (
            <div className={styles.folder_item} >
                <div className={`${globalStyles.authTheme} ${styles.file_logo}`} dangerouslySetInnerHTML={{ __html: this.judgeFileType('') }}></div>
                <div className={`${globalStyles.global_ellipsis} ${styles.file_name}`}>名字名字名字名字名字名字名字名字名字名字名字名字名字名字名字名字名字名字名字</div>
                <Dropdown overlay={this.renderOperateItemDropMenu()}>
                    <div className={`${globalStyles.authTheme} ${styles.operator}`}>&#xe7fd;</div>
                </Dropdown>
            </div>
        )
    }
}
