import React, { Component } from 'react'
import { Upload, notification } from 'antd'

{/* 该组件用于上传文件时，从右侧弹出提醒框，带上传进度条 */ }
export default class UploadNotification extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.openNotification()
    }
    renderUploadDec = () => {
        const { uploading_file_list = [] } = this.props
        console.log('sssss', uploading_file_list)
        const upload_props = {
            fileList: uploading_file_list,
            listType: 'picture',
        }
        return (
            <Upload {...upload_props}>
            </Upload>
        )
    }
    openNotification = () => {
        notification.info({
            message: '文件上传中',
            duration: null,
            description: this.renderUploadDec(),
        });
    };
    render() {
        const { uploading_file_list = [] } = this.props
        // console.log('ssss123s', uploading_file_list)
        return (
            <div>
            </div>
        )
    }
}
