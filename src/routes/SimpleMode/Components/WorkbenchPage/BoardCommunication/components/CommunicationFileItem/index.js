import React, { Component } from 'react';
import { getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard } from '../../../../../../../utils/businessFunction';
import { isApiResponseOk } from '../../../../../../../utils/handleResponseData';
import { getFileList } from '@/services/technological/file.js'
import globalStyles from '@/globalset/css/globalClassName.less';
import FolderList from './FolderList';
import styles from './index.less';

import { Menu, Dropdown, Upload, message } from 'antd';
import { log } from 'util';


export default class CommunicationFileItem extends Component {
    constructor(props) {
        super(props);
        const { board_id, board_name, itemValue = {} } = this.props
        const { file_data = [], folder_id } = itemValue;

        const first_paths_item = {
            name: board_name,
            id: board_id,
            // type: 'board',
            firstType: 'first',
            folder_id
        }
        this.state = {
            first_paths_item,
            current_folder_id: folder_id,
            file_data,
            bread_paths: [first_paths_item], //面包屑路径
            show_drag: false, //是否显示上传
            is_show_add_item: false,
        }
    }

    componentDidMount(){
        this.initSetPath(); // 设置初始路径
    }

    // 设置初始路径
    initSetPath=()=>{
        const { first_paths_item, bread_paths } = this.state;
        this.props.setFirstPaths(first_paths_item, bread_paths);
    }

    render(){
        const {
            bread_paths = [],
            file_data = [],
            current_folder_id,
            show_drag
        } = this.state;
        const {
            board_id,
            isShowSub,
        } = this.props;
        // console.log('ssss', {file_data})

        return(
            <div className={styles.CommunicationFileItem}>
                <FolderList
                    isShowSub={isShowSub}
                    file_data={file_data}
                    current_folder_id={current_folder_id}
                    board_id={board_id}
                    bread_paths={bread_paths}
                    showWhatComponent={this.props.showWhatComponent}
                    getSubFileData={this.props.getSubFileData}
                    queryCommunicationFileData={this.props.queryCommunicationFileData}
                    showUpdatedFileDetail={this.props.showUpdatedFileDetail}
                    // setPreviewFileModalVisibile={this.props.setPreviewFileModalVisibile} />
                />

                {/* 项目文件 */}
            </div>
        )
    }
}
