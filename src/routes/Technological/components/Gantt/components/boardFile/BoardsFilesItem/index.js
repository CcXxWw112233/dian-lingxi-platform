
import React, { Component } from 'react'
import styles from './index.less'
import FolderBread from './FolderBread'
import FolderList from './FolderList'
import { getFileList } from '@/services/technological/file.js'
import { isApiResponseOk } from '../../../../../../../utils/handleResponseData';
import { message } from 'antd';

export default class Index extends Component {
    constructor(props) {
        super(props)
        const { board_id, board_name, itemValue = {} } = this.props
        const { file_data = [], folder_id } = itemValue

        const first_paths_item = {
            name: board_name,
            id: board_id,
            type: 'board',
            folder_id
        }
        this.state = {
            first_paths_item,
            current_folder_id: folder_id,
            file_data,
            bread_paths: [first_paths_item], //面包屑路径
        }
    }
    setBreadPaths = ({ path_item = {} }) => {
        const { bread_paths = [], first_paths_item } = this.state
        const { id, type } = path_item
        let new_bread_paths = [...bread_paths]
        if (type == 'board') { //项目
            new_bread_paths = [first_paths_item]
            this.getBoardFileList()
        } else { //文件夹
            const index = bread_paths.findIndex(item => item.id == id)
            if (index == -1) { //如果不存在就加上
                new_bread_paths.push(path_item)
            } else { //如果存在就截取
                new_bread_paths = bread_paths.slice(0, index + 1)
            }
            this.getFolderFileList(path_item)
        }
        this.setState({
            bread_paths: new_bread_paths
        })
    }
    getBoardFileList = () => { // 获取项目根目录文件列表
        const { first_paths_item: { folder_id = ' ' } } = this.state
        this.getFolderFileList({ id: folder_id })
    }
    getFolderFileList = async ({ id }) => { //获取其他目录文件列表
        this.setState({
            current_folder_id: id
        })
        const { board_id } = this.props
        const res = await getFileList({ folder_id: id, board_id })
        if (isApiResponseOk(res)) {
            const data = res.data
            const files = data.file_data.map(item => {
                let new_item = { ...item }
                new_item['name'] = item['file_name']
                new_item['id'] = item['file_id']
                return new_item
            })
            const folders = data.folder_data.map(item => {
                let new_item = { ...item }
                new_item['name'] = item['folder_name']
                new_item['id'] = item['folder_id']
                return new_item
            })
            const file_data = [].concat(folders, files)
            this.setState({
                file_data
            })
        } else {
            message.error('获取数据失败')
        }
    }

    render() {
        const { bread_paths = [], file_data = [], current_folder_id } = this.state
        const { board_id } = this.props
       
        return (
            <div className={`${styles.board_file_area_item}`}>
                <FolderBread bread_paths={bread_paths} setBreadPaths={this.setBreadPaths} />
                <FolderList
                    file_data={file_data}
                    current_folder_id={current_folder_id}
                    board_id={board_id}
                    bread_paths={bread_paths}
                    setBreadPaths={this.setBreadPaths}
                    getFolderFileList={this.getFolderFileList}
                    setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile} />
            </div>
        )
    }
}
