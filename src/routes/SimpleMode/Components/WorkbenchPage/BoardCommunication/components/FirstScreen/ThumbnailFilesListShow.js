import React, { Component } from 'react';
// import { connect } from 'dva';
// import { setUploadHeaderBaseInfo } from '@/utils/businessFunction';
// import { REQUEST_DOMAIN_FILE, UPLOAD_FILE_SIZE } from '@/globalset/js/constant';
// import Cookies from 'js-cookie';
// import defaultTypeImg from '@/assets/invite/user_default_avatar@2x.png';
import { Table } from 'antd';
import styles from './CommunicationThumbnailFiles.less';


// @connect(mapStateToProps)
// @connect()

export default class ThumbnailFilesListShow extends Component {
    constructor(props){
        super(props);
        this.state = {
            // currentFileschoiceType: 0, // "0 搜索全部文件 1 搜索子集文件
            // thumbnailFilesList: thumbnailFilesList, // 缩略图数据
            columns: [
                {
                    title: '文件名',
                    dataIndex: 'fileName',
                    key: 'fileName',
                },
                {
                    title: '大小',
                    dataIndex: 'size',
                    key: 'size',
                },
                {
                    title: '修改日期',
                    dataIndex: 'changeData',
                    key: 'changeData',
                },
            ]
        }
    }


    render(){
        const { thumbnailFilesList } = this.props;
        const { columns } = this.state;
        return(
            <div className={styles.thumbnailFilesList}>
                <Table dataSource={thumbnailFilesList} columns={columns} />
                
            </div>
        )
    }
}