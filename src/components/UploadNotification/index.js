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
    }
    componentDidMount() {

    }
    componentWillReceiveProps() {

    }
    renderUploadDec = () => {
        const { uploading_file_list = [] } = this.props
        const upload_props = {
            fileList: uploading_file_list,
            listType: 'picture',
            onRemove: () => false,
            onDownload: () => false,
        }
        // console.log('sssss', {
        //     uploading_file_list
        // })
        return (
            <Upload {...upload_props}>
            </Upload>
        )
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
                    <div className={`${globalStyles.authTheme} ${styles.info_icon}`}>&#xe847;</div>
                    <div className={styles.message}>上传成功</div>
                    <div className={`${globalStyles.authTheme} ${styles.close}`} onClick={this.close}>&#xe7fe;</div>
                </div>
                <div className={`${styles.picture_list} ${globalStyles.global_vertical_scrollbar}`}>
                    {this.renderUploadDec()}
                </div>
            </div>
        )
    }
}
