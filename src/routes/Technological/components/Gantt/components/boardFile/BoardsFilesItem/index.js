
import React, { Component } from 'react'
import styles from './index.less'
import FolderBread from './FolderBread'
import FolderList from './FolderList'

export default class Index extends Component {
    render() {
        return (
            <div className={`${styles.board_file_area_item}`}>
                <FolderBread />
                <FolderList />
            </div>
        )
    }
}
