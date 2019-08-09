import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import BoardsFilesItem from './BoardsFilesItem'

@connect(mapStateToProps)
export default class BoardsFilesArea extends Component {
    render() {
        const { is_show_board_file_area } = this.props
        const arr = [1, 2, 3, 4, 5 ]
        return (
            <div className={` ${globalStyles.global_vertical_scrollbar} ${styles.boards_files_area}
            ${is_show_board_file_area == '1' && styles.boards_files_area_show}
            ${is_show_board_file_area == '2' && styles.boards_files_area_hide}
            `}>
                <div>
                    {
                        arr.map((item, key) => {
                            return (
                                <div key={key}>
                                    <BoardsFilesItem itemValue={item} itemKey={key}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
function mapStateToProps({ gantt: { datas: { is_show_board_file_area } } }) {
    return { is_show_board_file_area }
}