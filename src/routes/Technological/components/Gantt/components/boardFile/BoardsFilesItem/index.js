
import React, { Component } from 'react'
import styles from './index.less'
import FolderBread from './FolderBread'
import FolderList from './FolderList'
import { getFileList } from '@/services/technological/file.js'

export default class Index extends Component {
    constructor(props) {
        super(props)
        const { board_id, board_name, itemValue = {} } = this.props
        const {  file_data = [] } = itemValue

        const first_paths_item = {
            name: board_name,
            id: board_id,
            type: 'board',
        }
        this.state = {
            first_paths_item,
            file_data,
            bread_paths: [first_paths_item], //面包屑路径
        }
    }
    setBreadPaths = ({ path_item = {} }) => {
        const { bread_paths = [], first_paths_item } = this.state
        const { id, type } = path_item
        let new_bread_paths = [...bread_paths]
        if(type == 'board') { //项目
            new_bread_paths = [first_paths_item]
        } else { //文件夹
            const index = bread_paths.findIndex(item => item.id == id)
            if(index == -1) { //如果不存在就加上
                new_bread_paths.push(path_item)
            }else { //如果存在就截取
                new_bread_paths = bread_paths.slice(0, index)
            }
            this.getFileList(path_item)
        }
        this.setState({
            bread_paths: new_bread_paths
        })
    }

    getFileList = async ({id}) => {
        const { board_id } = this.props
        const res = getFileList({folder_id: id, board_id})
    }

    render() {
        const { bread_paths = [], file_data } = this.state
        const { board_id } = this.props
        return (
            <div className={`${styles.board_file_area_item}`}>
                <FolderBread bread_paths={bread_paths} setBreadPaths={this.setBreadPaths} />
                <FolderList file_data={file_data} board_id={board_id} bread_paths={bread_paths} setBreadPaths={this.setBreadPaths} />
            </div>
        )
    }
}
