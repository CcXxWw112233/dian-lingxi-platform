import React, { Component } from 'react';
import { connect } from 'dva';
import { setUploadHeaderBaseInfo } from '@/utils/businessFunction';
import { REQUEST_DOMAIN_FILE, UPLOAD_FILE_SIZE } from '@/globalset/js/constant';
import Cookies from 'js-cookie';
import ThumbnailFilesListShow from './ThumbnailFilesListShow';
import defaultTypeImg from '@/assets/invite/user_default_avatar@2x.png';
import { Upload, Icon, message } from 'antd';
import styles from './CommunicationThumbnailFiles.less';


// @connect(mapStateToProps)
// @connect()
const thumbnailFilesList = [
    { id: '001', type: 'jpg', fileName: '结构施工一改.jpg', size: '14.4K', changeData: '2019/08/21 08:31' },
    { id: '002', type: 'dwg', fileName: '水专施工一改.dwg', size: '14.4K', changeData: '2019/08/21 08:31' },
    { id: '003', type: 'png', fileName: '建筑方案.png', size: '14.4K', changeData: '2019/08/21 08:31' },
]

export default class CommunicationThumbnailFiles extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentFileschoiceType: 0, // "0 搜索全部文件 1 搜索子集文件
            thumbnailFilesList: thumbnailFilesList, // 缩略图数据
        }
    }

    // 上传文件
    uploadProps = () => {
        const that = this
        const { board_id, current_folder_id, getSubFileData, queryCommunicationFileData, isShowSub } = this.props
        const propsObj = {
            name: 'file',
            withCredentials: true,
            multiple: true,
            action: `${REQUEST_DOMAIN_FILE}/file/upload`,
            data: {
                board_id,
                folder_id: current_folder_id,
                type: '1',
                upload_type: '1'
            },
            headers: {
                Authorization: Cookies.get('Authorization'),
                refreshToken: Cookies.get('refreshToken'),
                ...setUploadHeaderBaseInfo({ boardId: board_id }),
            },
            beforeUpload(e) {
                // if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPLOAD, board_id)) {
                //     message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
                //     return false
                // }
                if (e.size == 0) {
                    message.error(`不能上传空文件`)
                    return false
                } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
                    message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
                    return false
                }
                let loading = message.loading('正在上传...', 0)
            },
            onChange({ file, fileList, event }) {
                // debugger;
                if (file.status === 'uploading') {

                } else {
                    // message.destroy()
                }
                if (file.status === 'done') {

                    if (file.response && file.response.code == '0') {
                        message.success(`上传成功。`);
                        // that.props.getFolderFileList({ id: current_folder_id })
                        // isShowSub ? getSubFileData(current_folder_id, board_id) : queryCommunicationFileData();
                    } else {
                        message.error(file.response && file.response.message || '上传失败');
                    }
                } else if (file.status === 'error') {
                    message.error(`上传失败。`);
                    setTimeout(function () {
                        message.destroy()
                    }, 2000)
                }
            },
        };
        return propsObj
    }

    // 改变搜索状态-全局搜索/局部搜索
    changeChooseType = (type) => {
        const currentType = parseInt(type);
        this.setState({currentFileschoiceType: currentType});
    }

    render(){
        const { isVisibleFileList } = this.props;
        const { currentFileschoiceType, thumbnailFilesList } = this.state;
        return(
            <div className={`${styles.communicationThumbnailFiles} ${isVisibleFileList ? styles.changeContentWidth : null}`}>
                {/* 上传文件和切换列表显示操作 */}
                <div className={styles.thumbnailFilesHeader}>
                    <div className={styles.uploadFile}>
                        <Upload {...this.uploadProps()} showUploadList={false}>
                            上传文件
                        </Upload>
                    </div>
                    <div className={styles.changeTypeOperation}>
                        <Icon type="appstore" />
                    </div>
                </div>

                {/* 搜索input触发-显示样式 */}
                <div className={styles.searchTypeBox}>
                    搜索：
                    <span
                        className={currentFileschoiceType === 0 ? styles.currentFile : ''}
                        onClick={()=>this.changeChooseType('0')}
                    >
                        “全部文件”
                    </span>
                    <span
                        className={currentFileschoiceType === 1 ? styles.currentFile : ''}
                        onClick={()=>this.changeChooseType('1')}
                    >
                        基础资料
                    </span>
                </div>

                {/* 首屏-右侧缩略图列表 */}
                <ThumbnailFilesListShow
                    thumbnailFilesList={thumbnailFilesList}
                />
                
            </div>
        )
    }
}