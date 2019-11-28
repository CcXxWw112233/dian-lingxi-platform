import React, { Component } from 'react'
import { Upload, notification } from 'antd'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
{/* 该组件用于上传文件时，从右侧弹出提醒框，带上传进度条 */ }
export default class UploadNotification extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.scroll_ref = React.createRef()
    }
    componentDidMount() {

    }
    componentWillReceiveProps() {
        this.setScrollTop()
    }
    setScrollTop = () => {
        const ele = this.scroll_ref.current
        ele.scrollTop = ele.scrollHeight
    }
    renderUploadDec = () => {
        const { uploading_file_list = [] } = this.props
        const upload_props = {
            fileList: uploading_file_list,
            listType: 'picture',
            onRemove: () => false,
            onDownload: () => false,
            onPreview: () => false
        }
        return (
            <Upload {...upload_props}>
            </Upload>
        )
    }
    renderUploadState = () => {
        const { uploading_file_list = [] } = this.props
        const is_has_uploading = uploading_file_list.length && (uploading_file_list.findIndex(item => item.status == 'uploading') != -1)
        const icon_loading = (
            <i className={globalStyles.authTheme} style={{ color: '#52C41A' }}>&#xe7fa;</i>
        )
        const icon_upload = (
            <i className={globalStyles.authTheme} style={{ color: '#1890FF' }}>&#xe77d;</i>
        )
        let message = ''
        let icon = ''
        if (is_has_uploading) {
            icon = icon_loading
            message = '正在上传...'
        } else {
            icon = icon_upload
            message = '上传完成'
        }
        const data = {
            icon,
            message
        }
        return data
    }
    close = () => {
        const { setUploadNotiVisible } = this.props
        setUploadNotiVisible()
    }
    render() {
        const { uploading_file_list = [] } = this.props
        return (
            <div className={`${globalStyles.global_card} ${styles.notice_out}`} >
                <div className={styles.top}>
                    <div className={`${globalStyles.authTheme} ${styles.info_icon}`}>
                        {/* &#xe847; */}
                        {this.renderUploadState().icon}
                    </div>
                    <div className={styles.message}> {this.renderUploadState().message}</div>
                    <div className={`${globalStyles.authTheme} ${styles.close}`} onClick={this.close}>&#xe7fe;</div>
                </div>
                <div className={`${styles.picture_list} ${globalStyles.global_vertical_scrollbar}`} ref={this.scroll_ref}>
                    {this.renderUploadDec()}
                </div>
            </div>
        )
    }
}
