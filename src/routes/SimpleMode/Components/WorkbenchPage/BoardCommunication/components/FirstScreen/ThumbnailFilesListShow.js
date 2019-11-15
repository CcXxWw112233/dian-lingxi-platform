import React, { Component } from 'react';
import { filterFileFormatType, timestampToTime, timestampToTimeNormal } from '@/utils/util'
import globalStyles from '@/globalset/css/globalClassName.less';
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
                    dataIndex: 'file_name',
                    key: 'file_name',
                    render: (text, record, index) => {
                        return (
                            <div className={styles.fileNameRow} onClick={()=>this.props.previewFile(record)}>
                                {
                                    record && record.thumbnail_url ? (
                                        <div className={styles.imgBox}>
                                            <img src={record.thumbnail_url || ''} width="100px" alt=""/>
                                        </div>
                                    ):(
                                        <div
                                            className={`${globalStyles.authTheme} ${styles.otherFile}`}
                                            dangerouslySetInnerHTML={{ __html: filterFileFormatType(text) }}
                                        >
                                        </div>
                                    )
                                }
                                <span>{text}</span>
                            </div>
                        )
                    }
                },
                {
                    title: '大小',
                    dataIndex: 'file_size',
                    key: 'file_size',
                },
                {
                    title: '修改日期',
                    dataIndex: 'update_time',
                    key: 'update_time',
                    render: (text, record, index) => {
                        return(
                            <div>
                                {/* { timestampToTime(text, true)} */}
                                {timestampToTimeNormal(text, '/', true)}
                            </div>
                        )
                    }
                },
            ],
        }
    }

    componentDidMount(){
        // this.initData();
    }

    // 初始化table数据
    // initData = () => {
    //     const { columns } = this.state;
    //     const newColumns = [];
    //     columns.forEach((item) => {
    //         if(item.file_name = 'file_name'){
    //             // item.render = this.renderItem(item);
    //             item.render = <div>
    //                 lalall-
    //                 {item.file_name}
    //             </div>
    //         }
    //     })
    // }

    // 处理缩略图
    // renderItem = (item) => {
    //     return(
    //         <div>
    //             lalall-
    //             {item.file_name}
    //         </div>
    //     )
    // }

    render(){
        const { thumbnailFilesList=[], onlyFileTableLoading, isSearchDetailOnfocusOrOnblur } = this.props;
        const { columns} = this.state;
        // console.log('isSearchDetailOnfocusOrOnblur',isSearchDetailOnfocusOrOnblur);
        const isShow = isSearchDetailOnfocusOrOnblur;
        return(
            <div className={`${styles.thumbnailFilesList} ${isShow ? styles.changeHeight : ''}`}>
                <Table
                    // style={{height:500}}
                    // scroll={{ y: tableHeight}}
                    dataSource={thumbnailFilesList}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                    loading={onlyFileTableLoading}
                    // pagination={{
                    //     pageSize: 6
                    // }}
                    pagination={false}
                    rowKey={record => record.file_id}
                />
            </div>
        )
    }
}