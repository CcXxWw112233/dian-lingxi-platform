import React, { Component } from 'react'
import UploadNotification from '../UploadNotification'
import { Upload, message } from 'antd'
import { REQUEST_DOMAIN_FILE, UPLOAD_FILE_SIZE } from '../../globalset/js/constant'
import Cookies from 'js-cookie'
import { setUploadHeaderBaseInfo } from '../../utils/businessFunction'
export default class UploadNormal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uploading_file_list: []
        }
    }
    normalUploadProps = () => {
        const that = this
        const { uploading_file_list } = this.state
        const { uploadProps = {}, uploadCompleteCalback, setShowUploadNotification, is_need_parent_notification, setUploadingFileList } = this.props
        const { data: { board_id } } = uploadProps
        const propsObj = {
            name: 'file',
            withCredentials: true,
            multiple: true,
            // fileList: uploading_file_list,
            showUploadList: false,
            onRemove: () => false,
            onDownload: () => false,
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
            onChange({ file, fileList }) {
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
                if (is_need_parent_notification) { //由父组件渲染进度弹窗
                    setUploadingFileList(fileList_will)
                    setShowUploadNotification(true)
                } else {
                    that.setState({
                        uploading_file_list: fileList
                    }, () => {
                        that.setShowUploadNotification(true)
                    })
                }
                const is_has_uploading = fileList_will.length && (fileList_will.findIndex(item => item.status == 'uploading') != -1)
                if (!is_has_uploading) { //没有上传状态了
                    if (typeof uploadCompleteCalback == 'function') {
                        uploadCompleteCalback()
                    }
                }
            },
            ...uploadProps
        };
        return propsObj
    }
    // 设置右边弹窗出现
    setUploadNotiVisible = () => {
        const { show_upload_notification } = this.state
        this.setState({
            show_upload_notification: !show_upload_notification,
            uploading_file_list: []
        })
    }
    setShowUploadNotification = (bool) => {
        this.setState({
            show_upload_notification: bool
        })
    }
    render() {
        const { children, is_need_parent_notification } = this.props
        const { show_upload_notification, uploading_file_list = [] } = this.state

        return (
            <>
                <Upload {...this.normalUploadProps()}>
                    {children}
                </Upload>
                {
                    !is_need_parent_notification && show_upload_notification && (
                        <UploadNotification uploading_file_list={uploading_file_list} setUploadNotiVisible={this.setUploadNotiVisible} />
                    )
                }
            </>
        )
    }
}
