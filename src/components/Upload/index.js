import React, { Component } from 'react'
import UploadNotification from '../UploadNotification'
import { Upload, message } from 'antd'
import { REQUEST_DOMAIN_FILE, UPLOAD_FILE_SIZE } from '../../globalset/js/constant'
import Cookies from 'js-cookie'
import { setUploadHeaderBaseInfo } from '../../utils/businessFunction'
export default class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            upload_file_list: []
        }
    }
    uploadProps = () => {
        const that = this
        const { upload_file_list } = this.state
        const { upload_data = {} } = this.props
        const { board_id } = upload_data
        const propsObj = {
            name: 'file',
            withCredentials: true,
            multiple: true,
            fileList: upload_file_list,
            action: `${REQUEST_DOMAIN_FILE}/file/upload`,
            showUploadList: false,
            onRemove: () => false,
            onDownload: () => false,
            data: upload_data,
            headers: {
                Authorization: Cookies.get('Authorization'),
                refreshToken: Cookies.get('refreshToken'),
                ...setUploadHeaderBaseInfo({ boardId: board_id }),
            },
            beforeUpload(e) {
                if (e.size == 0) {
                    message.error(`不能上传空文件`)
                    return false
                } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
                    message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
                    return false
                }
            },
            onChange({ file, fileList, event }) {
                let fileList_will = [...fileList]
                fileList_will = fileList_will.filter(item => {
                    if (item.status == 'done') {
                        if (item.response && item.response.code == '0') {

                        } else {
                            item.status = 'error'
                        }
                    }
                    return item
                })
                that.setState({
                    upload_file_list: fileList_will
                }, () => {
                    that.setShowUploadNotification(true)
                })
                const is_has_uploading = fileList_will.length && (fileList_will.findIndex(item => item.status == 'uploading') != -1)
                // console.log('sssss_is_has_uploading', {
                //     is_has_uploading,
                //     length: fileList_will.length,
                //     bool: (fileList_will.findIndex(item => item.status == 'uploading'))
                // })
                // if (!is_has_uploading) { //没有上传状态了
                //     that.props.getFolderFileList({ id: current_folder_id })
                // }
            },
        };
        return propsObj
    }
    // 设置右边弹窗出现
    setUploadNotiVisible = () => {
        const { show_upload_notification } = this.state
        this.setState({
            show_upload_notification: !show_upload_notification,
            upload_file_list: []
        })
    }
    setShowUploadNotification = (bool) => {
        this.setState({
            show_upload_notification: bool
        })
    }
    render() {
        const { children } = this.props
        const { show_upload_notification, upload_file_list = [] } = this.state
        return (
            <>
                <Upload {...this.uploadProps()}>
                    {children}
                </Upload>
                {
                    show_upload_notification && (
                        <UploadNotification upload_file_list={upload_file_list} setUploadNotiVisible={this.setUploadNotiVisible} />
                    )
                }
            </>
        )
    }
}
